# VEERA CCTV — Full-Stack Installation & Architecture Guide

## 1. Folder Structure
```text
veera-cctv/
├── database/
│   └── veera_cctv_mssql.sql       # Microsoft SQL Server (SSMS) schema & seed script
├── uploads/                       # Secure multipart image uploads served at /uploads/*
├── server/
│   └── data/
│       └── store.json             # Persistent Express backend store (auth, inquiries, uploads)
├── src/
│   ├── assets/images/             # Generated studio & architectural CCTV visual assets
│   ├── components/
│   │   ├── ErrorBoundary.tsx      # React ErrorBoundary for Firestore & runtime resilience
│   │   ├── Footer.tsx             # Site footer with all page links & contact info
│   │   ├── Navbar.tsx             # Responsive top navigation bar
│   │   └── WhatsAppButton.tsx     # Floating WhatsApp quick contact launcher
│   ├── context/
│   │   ├── AuthContext.tsx        # Firebase Google Sign-In + Express bcrypt JWT Auth
│   │   └── CatalogContext.tsx     # Real-time Firestore onSnapshot sync + Express inquiries
│   ├── data/
│   │   └── seedData.ts            # Initial VEERA CCTV services, products, brands, projects
│   ├── lib/
│   │   └── firebase.ts            # Firebase App, Firestore, Auth & structured error handler
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── AdminPanel.tsx         # Protected Admin Dashboard (CRUD + Upload + Settings)
│   │   ├── BrandsPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── PortalPage.tsx         # User Registration, Login, Forgot Password, Google Auth
│   │   ├── ProductsPage.tsx
│   │   ├── ProjectsPage.tsx       # Case Studies & Filterable Photo Gallery
│   │   ├── ServicesPage.tsx
│   │   └── TestimonialsPage.tsx
│   ├── types/
│   │   └── cctv.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── firebase-applet-config.json    # Provisioned Firebase configuration
├── firebase-blueprint.json        # Firestore schema intermediate representation
├── firestore.rules                # Hardened Firestore security rules (deployed)
├── server.ts                      # Express.js REST API + Vite middleware entry point
├── package.json
└── vite.config.ts
```

## 2. Running Locally
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Environment variables** (`.env` optional in dev):
   - `JWT_SECRET`: Secret key for signing Express JWT tokens.
   - `PORT`: Defaults to `3000`.
3. **Start the full-stack server** (Express API + Vite frontend):
   ```bash
   npm run dev
   ```
4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 3. Microsoft SQL Server (SSMS) Setup (Optional On-Premise Deployment)
1. Open **SQL Server Management Studio (SSMS)** and connect to your SQL Server instance.
2. Open `database/veera_cctv_mssql.sql` and click **Execute (F5)** to create `VeeraCCTV_DB` and all 10 normalized tables (`Users`, `PasswordResetTokens`, `Services`, `Brands`, `Products`, `Projects`, `GalleryPhotos`, `Testimonials`, `Inquiries`, `SiteSettings`).
3. Configure your SQL Server connection string (`mssql` / `tedious` driver) if deploying outside the cloud Firestore runtime.

## 4. Cloud Firebase Authentication & Admin Setup
- **Google Sign-In** is enabled via Firebase Authentication.
- The bootstrapped administrator account (`kumawatshankarlal538@gmail.com`) automatically receives Admin privileges in Firestore rules and can manage Products, Services, Brands, Projects, Gallery Photos, Testimonials, Site Settings, and Inquiries in real time.
