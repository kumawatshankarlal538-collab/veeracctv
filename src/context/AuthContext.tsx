import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import {
  auth,
  BOOTSTRAPPED_ADMIN_EMAIL,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import type { UserProfileData } from '../types/cctv';

const EXPRESS_TOKEN_KEY = 'veera_cctv_jwt';

interface AuthContextValue {
  user: UserProfileData | null;
  firebaseUser: User | null;
  expressToken: string | null;
  authReady: boolean;
  isAdmin: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  registerWithEmail: (fullName: string, email: string, phone: string, password: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<{ ok: boolean; message: string; resetCodePreview?: string }>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<{ ok: boolean; message: string }>;
  updateProfileInfo: (displayName: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [expressToken, setExpressToken] = useState<string | null>(() =>
    localStorage.getItem(EXPRESS_TOKEN_KEY)
  );
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        const emailLower = (fbUser.email || '').toLowerCase();
        let adminFlag =
          fbUser.emailVerified && emailLower === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();

        if (!adminFlag && fbUser.emailVerified) {
          try {
            const adminSnap = await getDoc(doc(db, 'admins', fbUser.uid));
            if (adminSnap.exists()) {
              adminFlag = true;
            }
          } catch {
            // Non-admin read denial is expected if user is not admin
          }
        }

        const userDocRef = doc(db, 'users', fbUser.uid);
        let profileData: UserProfileData = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || emailLower.split('@')[0] || 'Client',
          email: fbUser.email || '',
          phone: '',
          role: adminFlag ? 'admin' : 'customer',
          authProvider: 'google',
        };

        if (fbUser.emailVerified) {
          try {
            const snap = await getDoc(userDocRef);
            if (snap.exists()) {
              const existing = snap.data() as Partial<UserProfileData>;
              profileData = {
                uid: fbUser.uid,
                displayName: existing.displayName || profileData.displayName,
                email: existing.email || profileData.email,
                phone: existing.phone || '',
                role: adminFlag ? 'admin' : existing.role === 'admin' ? 'admin' : 'customer',
                authProvider: 'google',
              };
            } else {
              await setDoc(userDocRef, {
                uid: fbUser.uid,
                displayName: profileData.displayName.slice(0, 80),
                email: profileData.email.slice(0, 120),
                phone: '',
                role: 'customer',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
            }
          } catch (err) {
            console.warn('User profile Firestore sync notice:', err);
          }
        }

        setUser(profileData);
        setIsAdmin(adminFlag);
        setAuthReady(true);
        return;
      }

      // If no Firebase Auth user, restore Express JWT session if present
      const storedJwt = localStorage.getItem(EXPRESS_TOKEN_KEY);
      if (storedJwt) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${storedJwt}` },
          });
          if (res.ok) {
            const data = (await res.json()) as {
              user: { id: string; fullName: string; email: string; phone: string; role: 'customer' | 'admin' };
            };
            setExpressToken(storedJwt);
            setUser({
              uid: data.user.id,
              displayName: data.user.fullName,
              email: data.user.email,
              phone: data.user.phone || '',
              role: data.user.role,
              authProvider: 'express',
            });
            setIsAdmin(data.user.role === 'admin');
            setAuthReady(true);
            return;
          }
        } catch {
          // Invalid/expired token
        }
        localStorage.removeItem(EXPRESS_TOKEN_KEY);
        setExpressToken(null);
      }

      setUser(null);
      setIsAdmin(false);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = () => setAuthError(null);

  const signInWithGoogle = async (): Promise<boolean> => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google Sign-In was cancelled or failed.';
      setAuthError(msg);
      return false;
    }
  };

  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as {
        error?: string;
        token?: string;
        user?: { id: string; fullName: string; email: string; phone: string; role: 'customer' | 'admin' };
      };
      if (!res.ok || !data.token || !data.user) {
        setAuthError(data.error || 'Login failed.');
        return false;
      }
      localStorage.setItem(EXPRESS_TOKEN_KEY, data.token);
      setExpressToken(data.token);
      setUser({
        uid: data.user.id,
        displayName: data.user.fullName,
        email: data.user.email,
        phone: data.user.phone || '',
        role: data.user.role,
        authProvider: 'express',
      });
      setIsAdmin(data.user.role === 'admin');
      return true;
    } catch {
      setAuthError('Unable to reach authentication server.');
      return false;
    }
  };

  const registerWithEmail = async (
    fullName: string,
    email: string,
    phone: string,
    password: string
  ): Promise<boolean> => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, password }),
      });
      const data = (await res.json()) as {
        error?: string;
        token?: string;
        user?: { id: string; fullName: string; email: string; phone: string; role: 'customer' | 'admin' };
      };
      if (!res.ok || !data.token || !data.user) {
        setAuthError(data.error || 'Registration failed.');
        return false;
      }
      localStorage.setItem(EXPRESS_TOKEN_KEY, data.token);
      setExpressToken(data.token);
      setUser({
        uid: data.user.id,
        displayName: data.user.fullName,
        email: data.user.email,
        phone: data.user.phone || '',
        role: data.user.role,
        authProvider: 'express',
      });
      setIsAdmin(false);
      return true;
    } catch {
      setAuthError('Unable to register account.');
      return false;
    }
  };

  const forgotPassword = async (
    email: string
  ): Promise<{ ok: boolean; message: string; resetCodePreview?: string }> => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as {
        error?: string;
        message?: string;
        resetCodePreview?: string;
      };
      if (!res.ok) {
        return { ok: false, message: data.error || 'Could not process reset request.' };
      }
      return {
        ok: true,
        message: data.message || 'Reset code generated.',
        resetCodePreview: data.resetCodePreview,
      };
    } catch {
      return { ok: false, message: 'Server unavailable.' };
    }
  };

  const resetPassword = async (
    email: string,
    token: string,
    newPassword: string
  ): Promise<{ ok: boolean; message: string }> => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        return { ok: false, message: data.error || 'Failed to reset password.' };
      }
      return { ok: true, message: data.message || 'Password updated.' };
    } catch {
      return { ok: false, message: 'Server unavailable.' };
    }
  };

  const updateProfileInfo = async (displayName: string, phone: string): Promise<void> => {
    if (!user) return;
    const cleanName = displayName.trim().slice(0, 80);
    const cleanPhone = phone.trim().slice(0, 30);

    if (firebaseUser) {
      const path = `users/${firebaseUser.uid}`;
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          displayName: cleanName,
          phone: cleanPhone,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    }

    setUser((prev) => (prev ? { ...prev, displayName: cleanName, phone: cleanPhone } : null));
  };

  const logout = async (): Promise<void> => {
    if (firebaseUser) {
      await firebaseSignOut(auth);
    }
    localStorage.removeItem(EXPRESS_TOKEN_KEY);
    setExpressToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        expressToken,
        authReady,
        isAdmin,
        authError,
        clearAuthError,
        signInWithGoogle,
        loginWithEmail,
        registerWithEmail,
        forgotPassword,
        resetPassword,
        updateProfileInfo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
