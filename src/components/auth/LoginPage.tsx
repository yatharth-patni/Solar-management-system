import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  KeyRound, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface LoginPageProps {
  onSignInSuccess: (user: { name: string; email: string; role: string }) => void;
  onPreviewDashboard?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onSignInSuccess,
  onPreviewDashboard 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Views: 'signin' | 'forgot-password' | 'passkey-loading'
  const [view, setView] = useState<'signin' | 'forgot-password' | 'passkey-loading'>('signin');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  // Email validation regex
  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    // Simulate authentic SaaS security handshake
    setTimeout(() => {
      setIsLoading(false);
      onSignInSuccess({
        name: email.toLowerCase().includes('alexander') ? 'Alexander Vance' : email.split('@')[0],
        email: email.trim(),
        role: 'Super Administrator',
      });
    }, 600);
  };

  const handlePasskeySignIn = () => {
    setView('passkey-loading');
    setErrorMessage('');

    setTimeout(() => {
      onSignInSuccess({
        name: 'Alexander Vance',
        email: 'alexander@solaros.io',
        role: 'Super Administrator (Passkey)',
      });
    }, 850);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim() || !validateEmail(recoveryEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsLoading(false);
      setRecoverySent(true);
    }, 500);
  };

  const handleQuickFillDemo = () => {
    setEmail('alexander@solaros.io');
    setPassword('SolarOS2026!Secure');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F6F8] text-[#1D1B20] flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 font-body selection:bg-[#F1E9F5] selection:text-[#765087] relative overflow-hidden">
      
      {/* Subtle Ambient Radial Glow — Inspired by Antigravity & Odoo Minimal Composition */}
      <div 
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgba(139,101,156,0.06),rgba(247,246,248,0))] z-0" 
        aria-hidden="true" 
      />

      {/* Top Header Spacing */}
      <div className="w-full flex justify-end max-w-5xl z-10 pt-2">
        {onPreviewDashboard && (
          <button
            type="button"
            onClick={onPreviewDashboard}
            className="text-xs font-medium text-[#77737D] hover:text-[#765087] transition-colors"
          >
            Direct Dashboard Access →
          </button>
        )}
      </div>

      {/* CENTERED LOGIN CARD */}
      <main className="w-full max-w-[420px] z-10 my-auto">
        <div className="bg-white rounded-3xl border border-[#E9E8EC] shadow-[0_4px_24px_-4px_rgba(29,27,32,0.04),0_12px_36px_-6px_rgba(118,80,135,0.06)] p-8 sm:p-10 transition-all duration-300 animate-fade-in">
          
          {/* SOLAROS LOGO */}
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-2xl bg-[#F1E9F5] border border-[#E9E8EC] flex items-center justify-center text-[#765087] transition-transform duration-300 hover:rotate-12 shadow-subtle mb-4">
              <svg 
                className="w-5 h-5 text-[#8B659C]" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" fill="#8B659C" fillOpacity="0.25" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            </div>
            
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-bold text-2xl tracking-tight text-[#1D1B20]">
                Solar<span className="text-[#8B659C]">OS</span>
              </span>
            </div>
          </div>

          {/* VIEW: FORGOT PASSWORD FLOW */}
          {view === 'forgot-password' ? (
            <div className="mt-6 animate-fade-in">
              <button
                type="button"
                onClick={() => {
                  setView('signin');
                  setRecoverySent(false);
                  setErrorMessage('');
                }}
                className="inline-flex items-center space-x-1.5 text-xs text-[#77737D] hover:text-[#1D1B20] transition-colors mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to sign in</span>
              </button>

              <h1 className="font-display font-bold text-xl text-[#1D1B20] tracking-tight">
                Reset your password
              </h1>
              <p className="text-xs text-[#77737D] mt-1 leading-relaxed">
                Enter your work email address and we will dispatch a secure recovery token.
              </p>

              {recoverySent ? (
                <div className="mt-6 p-4 rounded-2xl bg-[#F1E9F5]/70 border border-[#8B659C]/20 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#8B659C] text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold text-[#1D1B20]">Recovery link dispatched</p>
                  <p className="text-[11px] text-[#77737D]">
                    Check your inbox at <span className="font-mono text-[#1D1B20]">{recoveryEmail}</span> to complete credential reset.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="mt-6 space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-[#F1E9F5] border border-[#8B659C]/30 text-xs text-[#765087] flex items-center space-x-2">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[#1D1B20] mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#E9E8EC] text-[#1D1B20] placeholder-[#77737D]/60 focus:outline-none focus:border-[#8B659C] focus:ring-2 focus:ring-[#8B659C]/20 transition-all duration-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#8B659C] hover:bg-[#765087] active:bg-[#684577] text-white text-xs font-semibold shadow-subtle hover:shadow transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 cursor-pointer"
                  >
                    {isLoading ? <span>Dispatching...</span> : <span>Send Recovery Instructions</span>}
                  </button>
                </form>
              )}
            </div>
          ) : view === 'passkey-loading' ? (
            /* VIEW: PASSKEY CEREMONY */
            <div className="mt-8 text-center space-y-4 py-8 animate-fade-in">
              <div className="w-12 h-12 rounded-2xl bg-[#F1E9F5] text-[#8B659C] flex items-center justify-center mx-auto animate-pulse">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="font-display font-bold text-lg text-[#1D1B20]">
                Verifying Passkey
              </h2>
              <p className="text-xs text-[#77737D] max-w-xs mx-auto">
                Communicating with FIDO2 hardware token or device biometric key...
              </p>
            </div>
          ) : (
            /* VIEW: STANDARD SIGN IN FORM */
            <div className="mt-6">
              
              {/* WELCOME SECTION */}
              <div className="text-center mb-6">
                <h1 className="font-display font-bold text-xl text-[#1D1B20] tracking-tight">
                  Welcome back
                </h1>
                <p className="text-xs text-[#77737D] mt-1">
                  Sign in to your SolarOS account to continue.
                </p>
              </div>

              {/* Error Message Box */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-[#F1E9F5] border border-[#8B659C]/30 text-xs text-[#765087] flex items-center space-x-2 animate-fade-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-[#8B659C]" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* LOGIN FORM */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                
                {/* Email Address */}
                <div>
                  <label 
                    htmlFor="solar-email"
                    className="block text-xs font-medium text-[#1D1B20] mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="solar-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#E9E8EC] text-[#1D1B20] placeholder-[#77737D]/60 focus:outline-none focus:border-[#8B659C] focus:ring-2 focus:ring-[#8B659C]/20 transition-all duration-200"
                  />
                </div>

                {/* Password Field + Forgot Link */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label 
                      htmlFor="solar-password"
                      className="block text-xs font-medium text-[#1D1B20]"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setView('forgot-password');
                        setRecoveryEmail(email);
                        setErrorMessage('');
                      }}
                      className="text-xs font-medium text-[#8B659C] hover:text-[#765087] hover:underline transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  
                  <div className="relative">
                    <input
                      id="solar-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl bg-white border border-[#E9E8EC] text-[#1D1B20] placeholder-[#77737D]/60 focus:outline-none focus:border-[#8B659C] focus:ring-2 focus:ring-[#8B659C]/20 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77737D] hover:text-[#1D1B20] transition-colors p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* PRIMARY LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#8B659C] hover:bg-[#765087] active:bg-[#684577] text-white text-xs font-semibold shadow-subtle hover:shadow transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#8B659C] focus:ring-offset-2 transform active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>

              </form>

              {/* DIVIDER */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E9E8EC]"></div>
                </div>
                <div className="relative flex justify-center text-[11px]">
                  <span className="bg-white px-3 text-[#77737D]">or</span>
                </div>
              </div>

              {/* ADDITIONAL AUTH: PASSKEY BUTTON */}
              <button
                type="button"
                onClick={handlePasskeySignIn}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#E9E8EC] hover:bg-[#F7F6F8] hover:border-[#8B659C]/40 text-[#1D1B20] text-xs font-semibold transition-all duration-150 flex items-center justify-center space-x-2 shadow-subtle group cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#77737D] group-hover:text-[#8B659C] transition-colors" />
                <span>Continue with Passkey</span>
              </button>

            </div>
          )}

          {/* CARD FOOTER — SECURITY NOTE */}
          <div className="mt-8 pt-5 border-t border-[#E9E8EC]/80 flex items-center justify-center space-x-1.5 text-[11px] text-[#77737D]">
            <Lock className="w-3 h-3 text-[#8B659C]" />
            <span>Secure access to your SolarOS workspace.</span>
          </div>

        </div>

        {/* QUICK DEMO CREDENTIAL AUTO-FILL HELPER */}
        <div className="mt-4 flex items-center justify-center">
          <button
            type="button"
            onClick={handleQuickFillDemo}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-[#E9E8EC] text-[11px] text-[#77737D] hover:text-[#765087] hover:border-[#8B659C]/40 transition-all shadow-subtle"
          >
            <Sparkles className="w-3 h-3 text-[#8B659C]" />
            <span>Quick Fill Demo Admin (<span className="text-[#1D1B20] font-medium">alexander@solaros.io</span>)</span>
          </button>
        </div>

      </main>

      {/* OUTER FOOTER */}
      <footer className="w-full text-center py-4 z-10">
        <p className="text-[11px] text-[#77737D]">
          © 2026 SolarOS • Multi-Tenant Solar Installation Management
        </p>
      </footer>

    </div>
  );
};
