import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const PORT = Number(process.env.PORT) || 8080;
const JWT_SECRET = process.env.JWT_SECRET || crypto.createHash('sha256').update('veera-cctv-runtime-secret-key').digest('hex');

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

interface PasswordResetRecord {
  email: string;
  token: string;
  expiresAt: number;
}

interface StoredInquiry {
  id: string;
  ownerId: string | null;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  propertyType: string;
  message: string;
  status: 'New' | 'In Review' | 'Quoted' | 'Closed';
  createdAt: string;
  updatedAt: string;
}

interface StoreState {
  users: StoredUser[];
  resetTokens: PasswordResetRecord[];
  inquiries: StoredInquiry[];
}

function readStore(): StoreState {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<StoreState>;
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        resetTokens: Array.isArray(parsed.resetTokens) ? parsed.resetTokens : [],
        inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
      };
    }
  } catch (err) {
    console.error('Failed to read server store:', err);
  }
  return { users: [], resetTokens: [], inquiries: [] };
}

function writeStore(state: StoreState): void {
  fs.writeFileSync(STORE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

interface AuthPayload {
  userId: string;
  email: string;
  role: 'customer' | 'admin';
}

interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication token required.' });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Administrator privileges required.' });
    return;
  }
  next();
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
    const uniqueName = `veera_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${safeExt}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WEBP, and GIF image files up to 5MB are allowed.'));
    }
  },
});

function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function startServer(): Promise<void> {
  const app = express();

  app.use(express.json({ limit: '2mb' }));
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Health Check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'VEERA CCTV API', timestamp: new Date().toISOString() });
  });

  // --- Auth Routes (bcrypt password hashing + JWT) ---
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const fullName = sanitizeText(req.body?.fullName, 80);
      const email = sanitizeText(req.body?.email, 120).toLowerCase();
      const phone = sanitizeText(req.body?.phone, 30);
      const password = typeof req.body?.password === 'string' ? req.body.password : '';

      if (fullName.length < 2) {
        res.status(400).json({ error: 'Full name must be at least 2 characters.' });
        return;
      }
      if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Please provide a valid email address.' });
        return;
      }
      if (password.length < 8) {
        res.status(400).json({ error: 'Password must be at least 8 characters long.' });
        return;
      }

      const store = readStore();
      if (store.users.some((u) => u.email === email)) {
        res.status(409).json({ error: 'An account with this email already exists.' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const newUser: StoredUser = {
        id: `usr_${crypto.randomBytes(8).toString('hex')}`,
        fullName,
        email,
        phone,
        passwordHash,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };

      store.users.push(newUser);
      writeStore(store);

      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        token,
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
        },
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Failed to register account.' });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const email = sanitizeText(req.body?.email, 120).toLowerCase();
      const password = typeof req.body?.password === 'string' ? req.body.password : '';

      if (!isValidEmail(email) || !password) {
        res.status(400).json({ error: 'Valid email and password are required.' });
        return;
      }

      const store = readStore();
      const user = store.users.find((u) => u.email === email);
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password.' });
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        res.status(401).json({ error: 'Invalid email or password.' });
        return;
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Authentication failed.' });
    }
  });

  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const email = sanitizeText(req.body?.email, 120).toLowerCase();
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Please enter a valid registered email address.' });
      return;
    }

    const store = readStore();
    const user = store.users.find((u) => u.email === email);
    if (!user) {
      res.status(404).json({ error: 'No Express account found for that email address.' });
      return;
    }

    const resetToken = crypto.randomBytes(4).toString('hex').toUpperCase();
    store.resetTokens = store.resetTokens.filter((t) => t.email !== email);
    store.resetTokens.push({
      email,
      token: resetToken,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });
    writeStore(store);

    res.json({
      message: 'A 15-minute verification reset code has been generated.',
      resetCodePreview: resetToken,
    });
  });

  app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
    try {
      const email = sanitizeText(req.body?.email, 120).toLowerCase();
      const token = sanitizeText(req.body?.token, 32).toUpperCase();
      const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';

      if (!isValidEmail(email) || !token || newPassword.length < 8) {
        res.status(400).json({ error: 'Email, valid reset code, and 8+ character new password are required.' });
        return;
      }

      const store = readStore();
      const record = store.resetTokens.find(
        (t) => t.email === email && t.token === token && t.expiresAt > Date.now()
      );
      if (!record) {
        res.status(400).json({ error: 'Reset code is invalid or expired.' });
        return;
      }

      const userIdx = store.users.findIndex((u) => u.email === email);
      if (userIdx === -1) {
        res.status(404).json({ error: 'User account not found.' });
        return;
      }

      store.users[userIdx].passwordHash = await bcrypt.hash(newPassword, 12);
      store.resetTokens = store.resetTokens.filter((t) => t.email !== email);
      writeStore(store);

      res.json({ message: 'Password updated successfully. You may now sign in.' });
    } catch (err) {
      console.error('Reset password error:', err);
      res.status(500).json({ error: 'Failed to reset password.' });
    }
  });

  app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const store = readStore();
    const user = store.users.find((u) => u.id === req.user?.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    res.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  });

  // --- Secure Image Upload Endpoint (Admin Upload & Preview) ---
  app.post('/api/upload', (req: Request, res: Response) => {
    const firebaseAdminEmail = req.headers['x-veera-admin-email'];
    const authHeader = req.headers.authorization;

    let authorized = false;
    if (typeof firebaseAdminEmail === 'string' && firebaseAdminEmail === 'kumawatshankarlal538@gmail.com') {
      authorized = true;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.slice(7), JWT_SECRET) as AuthPayload;
        if (decoded.role === 'admin') authorized = true;
      } catch {
        authorized = false;
      }
    }

    if (!authorized) {
      res.status(403).json({ error: 'Admin authorization required to upload media files.' });
      return;
    }

    upload.single('image')(req, res, (err: unknown) => {
      if (err) {
        const message = err instanceof Error ? err.message : 'Upload failed.';
        res.status(400).json({ error: message });
        return;
      }
      if (!req.file) {
        res.status(400).json({ error: 'No image file provided.' });
        return;
      }
      res.status(201).json({
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    });
  });

  // --- Quote & Contact Inquiries REST API ---
  app.post('/api/inquiries', (req: Request, res: Response) => {
    const name = sanitizeText(req.body?.name, 80);
    const email = sanitizeText(req.body?.email, 120);
    const phone = sanitizeText(req.body?.phone, 30);
    const serviceType = sanitizeText(req.body?.serviceType, 80) || 'CCTV Installation';
    const propertyType = sanitizeText(req.body?.propertyType, 80) || 'Commercial';
    const message = sanitizeText(req.body?.message, 1500);
    const ownerId = sanitizeText(req.body?.ownerId, 128) || null;

    if (name.length < 2 || !isValidEmail(email) || phone.length < 6 || message.length < 5) {
      res.status(400).json({ error: 'Please complete all required inquiry fields accurately.' });
      return;
    }

    const now = new Date().toISOString();
    const inquiry: StoredInquiry = {
      id: `inq_${crypto.randomBytes(6).toString('hex')}`,
      ownerId,
      name,
      email,
      phone,
      serviceType,
      propertyType,
      message,
      status: 'New',
      createdAt: now,
      updatedAt: now,
    };

    const store = readStore();
    store.inquiries.unshift(inquiry);
    writeStore(store);

    res.status(201).json({ inquiry });
  });

  app.get('/api/inquiries', (req: Request, res: Response) => {
    const adminEmail = req.headers['x-veera-admin-email'];
    const authHeader = req.headers.authorization;
    let isAuthorizedAdmin = adminEmail === 'kumawatshankarlal538@gmail.com';
    let ownerUid: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.slice(7), JWT_SECRET) as AuthPayload;
        if (decoded.role === 'admin') isAuthorizedAdmin = true;
        ownerUid = decoded.userId;
      } catch {
        // Ignore invalid JWT if checking header
      }
    }

    const store = readStore();
    if (isAuthorizedAdmin) {
      res.json({ inquiries: store.inquiries });
      return;
    }
    if (ownerUid) {
      res.json({ inquiries: store.inquiries.filter((i) => i.ownerId === ownerUid) });
      return;
    }
    res.status(403).json({ error: 'Authorization required to view inquiries.' });
  });

  app.patch('/api/inquiries/:id', (req: Request, res: Response) => {
    const adminEmail = req.headers['x-veera-admin-email'];
    if (adminEmail !== 'kumawatshankarlal538@gmail.com') {
      res.status(403).json({ error: 'Admin authorization required.' });
      return;
    }
    const status = req.body?.status;
    if (!['New', 'In Review', 'Quoted', 'Closed'].includes(status)) {
      res.status(400).json({ error: 'Invalid inquiry status.' });
      return;
    }
    const store = readStore();
    const idx = store.inquiries.findIndex((i) => i.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Inquiry not found.' });
      return;
    }
    store.inquiries[idx].status = status;
    store.inquiries[idx].updatedAt = new Date().toISOString();
    writeStore(store);
    res.json({ inquiry: store.inquiries[idx] });
  });

  app.delete('/api/inquiries/:id', (req: Request, res: Response) => {
    const adminEmail = req.headers['x-veera-admin-email'];
    if (adminEmail !== 'kumawatshankarlal538@gmail.com') {
      res.status(403).json({ error: 'Admin authorization required.' });
      return;
    }
    const store = readStore();
    store.inquiries = store.inquiries.filter((i) => i.id !== req.params.id);
    writeStore(store);
    res.json({ deleted: true });
  });

  // Protected admin check example
  app.get('/api/admin/status', requireAuth, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
    res.json({ ok: true, role: 'admin' });
  });

  // Vite middleware in dev, static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VEERA CCTV server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start VEERA CCTV server:', err);
  process.exit(1);
});
