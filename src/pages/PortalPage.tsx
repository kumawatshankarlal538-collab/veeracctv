import React, { useState } from 'react';
import {
  CheckCircle2,
  KeyRound,
  LogOut,
  Save,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import type { AppRoute } from '../types/cctv';

interface PortalPageProps {
  onNavigate: (route: AppRoute) => void;
}

type AuthTab = 'login' | 'register' | 'forgot';

export function PortalPage({ onNavigate }: PortalPageProps) {
  const {
    user,
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
  } = useAuth();
  const { inquiries } = useCatalog();

  const [tab, setTab] = useState<AuthTab>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  // Forgot / Reset Password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStage, setResetStage] = useState<'request' | 'verify'>('request');
  const [resetFeedback, setResetFeedback] = useState<{ ok: boolean; text: string; code?: string } | null>(null);

  // Profile edit state
  const [profileName, setProfileName] = useState(user?.displayName || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileSaved, setProfileSaved] = useState(false);

  React.useEffect(() => {
    if (user) {
      setProfileName(user.displayName);
      setProfilePhone(user.phone);
    }
  }, [user]);

  const handleGoogleSignIn = async () => {
    setBusy(true);
    await signInWithGoogle();
    setBusy(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await loginWithEmail(email, password);
    setBusy(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await registerWithEmail(fullName, email, phone, password);
    setBusy(false);
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await forgotPassword(resetEmail);
    setResetFeedback({
      ok: res.ok,
      text: res.message,
      code: res.resetCodePreview,
    });
    if (res.ok) {
      setResetStage('verify');
      if (res.resetCodePreview) setResetToken(res.resetCodePreview);
    }
    setBusy(false);
  };

  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await resetPassword(resetEmail, resetToken, newPassword);
    setResetFeedback({ ok: res.ok, text: res.message });
    if (res.ok) {
      setTimeout(() => {
        setTab('login');
        setEmail(resetEmail);
        setResetStage('request');
      }, 1000);
    }
    setBusy(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await updateProfileInfo(profileName, profilePhone);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
    setBusy(false);
  };

  if (user) {
    return (
      <div className="bg-[#060B16] text-slate-100 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-[#0B1221] border border-white/10 p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 chamfer-corner">
            <div>
              <div className="text-xs font-semibold text-red-400 mb-1">
                AUTHENTICATED ACCOUNT · {user.authProvider === 'google' ? 'GOOGLE CLOUD AUTH' : 'EXPRESS SECURE SESSION'}
              </div>
              <h1 className="text-2xl font-extrabold text-white">{user.displayName}</h1>
              <p className="text-sm text-slate-400">
                {user.email} · Role: <span className="text-slate-200 font-semibold">{isAdmin ? 'Administrator' : 'Customer'}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Open Admin Dashboard</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => void logout()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#1A2642] border border-white/15 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-[#0B1221] border border-white/10 p-6">
              <h2 className="text-lg font-bold text-white mb-4">Profile Details</h2>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Display Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#060B16] border border-white/15 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+91 98290 00000"
                    className="w-full px-3.5 py-2.5 bg-[#060B16] border border-white/15 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{profileSaved ? 'Saved' : 'Save Profile'}</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-[#0B1221] border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">My Quote Inquiries</h2>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="text-xs font-semibold text-red-400 hover:text-red-300 cursor-pointer"
                >
                  New Quote Request
                </button>
              </div>
              {inquiries.length === 0 ? (
                <p className="text-sm text-slate-400 py-6">
                  You have not submitted any quote requests under this account yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-[#060B16] border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-sm font-bold text-white">{inq.serviceType}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {inq.propertyType} · {inq.message.slice(0, 75)}
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-red-400 shrink-0">
                        Status: {inq.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#060B16] text-slate-100 py-16">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-[#0B1221] border border-white/10 p-7 sm:p-9 chamfer-card-lg">
          <div className="mb-6">
            <div className="w-10 h-0.5 bg-red-600 mb-3" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              VEERA CCTV Client & Admin Portal
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Sign in with Google for cloud sync and admin access, or use your Express email credentials.
            </p>
          </div>

          {/* Primary Google Sign-In Button */}
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleGoogleSignIn()}
            className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 text-sm font-semibold flex items-center justify-center gap-3 transition-colors mb-6 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-red-600" />
            <span>Continue with Google Sign-In</span>
          </button>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-white/10" />
            <span className="flex-shrink mx-3 text-xs text-slate-500">or email credentials</span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-3 gap-1 bg-[#060B16] p-1 border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => {
                clearAuthError();
                setTab('login');
              }}
              className={`py-2 text-xs font-semibold transition-colors cursor-pointer ${
                tab === 'login' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                clearAuthError();
                setTab('register');
              }}
              className={`py-2 text-xs font-semibold transition-colors cursor-pointer ${
                tab === 'register' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => {
                clearAuthError();
                setTab('forgot');
              }}
              className={`py-2 text-xs font-semibold transition-colors cursor-pointer ${
                tab === 'forgot' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Forgot Password
            </button>
          </div>

          {authError && (
            <div className="mb-5 p-3.5 bg-red-950/60 border border-red-500/50 text-xs text-red-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-3.5 py-2.5 bg-[#060B16] border border-white/15 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#060B16] border border-white/15 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {busy ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Arvind Kumar"
                  className="w-full px-3.5 py-2.5 bg-[#060B16] border border-white/15 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-3.5 py-2.5 bg-[#060B16] border border-white/15 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98290 00000"
                  className="w-full px-3.5 py-2.5 bg-[#060B16] border border-white/15 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create strong password"
                  className="w-full px-3.5 py-2.5 bg-[#060B16] border border-white/15 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {busy ? 'Creating Account...' : 'Create Customer Account'}
              </button>
            </form>
          )}

          {tab === 'forgot' && (
            <div className="space-y-4">
              {resetFeedback && (
                <div
                  className={`p-3.5 text-xs border ${
                    resetFeedback.ok
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                      : 'bg-red-950/60 border-red-500/50 text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{resetFeedback.text}</span>
                  </div>
                  {resetFeedback.code && (
                    <div className="mt-1.5 font-mono text-white">
                      Verification Code: <strong>{resetFeedback.code}</strong>
                    </div>
                  )}
                </div>
              )}

              {resetStage === 'request' ? (
                <form onSubmit={handleRequestReset} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1.5">Registered Email</label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-3.5 py-2.5 bg-[#060B16] border border-white/15 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{busy ? 'Generating Code...' : 'Send Reset Code'}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCompleteReset} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1.5">Reset Code</label>
                    <input
                      type="text"
                      required
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      placeholder="8-character code"
                      className="w-full px-3.5 py-2.5 bg-[#060B16] border border-white/15 text-sm font-mono text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1.5">New Password (min 8 chars)</label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#060B16] border border-white/15 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold cursor-pointer"
                  >
                    {busy ? 'Updating Password...' : 'Confirm Password Reset'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
