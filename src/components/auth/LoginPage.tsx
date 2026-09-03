import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Fingerprint,
  PhoneCall,
  CheckCircle2,
  Globe,
  Zap,
} from 'lucide-react';
import { useTrustFlow } from '../../context/TrustFlowContext';
import { useTranslation } from '../../i18n';
import type { Language } from '../../types';
import { clsx } from 'clsx';

const DEMO_CUSTOMER_ID = 'user123';
const DEMO_PASSWORD = 'trustflow2026';

export function LoginPage() {
  const { state, dispatch } = useTrustFlow();
  const { t, language } = useTranslation();

  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle normal form submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId.trim() || !password.trim()) {
      setLoginError('Please enter both your Customer ID and Password/MPIN.');
      return;
    }

    setIsLoading(true);
    setLoginError('');

    // Simulate authenticating against banking auth server
    setTimeout(() => {
      setIsLoading(false);
      dispatch({ type: 'LOGIN' });
      dispatch({
        type: 'ADD_SECURITY_LOG',
        payload: {
          id: `log-${Date.now()}`,
          timestamp: 'Just now',
          action: 'User Authenticated',
          details: `Session verified for Customer ID "${customerId}". Anti-fraud shields engaged.`,
          riskLevel: 'LOW',
          riskScore: 6,
        },
      });
    }, 600);
  };

  // Quick action: Demo Auto-Login fills credentials & logs in instantly
  const handleDemoAutoLogin = () => {
    setCustomerId(DEMO_CUSTOMER_ID);
    setPassword(DEMO_PASSWORD);
    setLoginError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      dispatch({ type: 'LOGIN' });
      dispatch({
        type: 'ADD_SECURITY_LOG',
        payload: {
          id: `log-${Date.now()}`,
          timestamp: 'Just now',
          action: 'Demo Fast-Track Login',
          details: `Evaluator bypass authenticated with test profile (${DEMO_CUSTOMER_ID}).`,
          riskLevel: 'LOW',
          riskScore: 5,
        },
      });
    }, 300);
  };

  const handleLanguageChange = (lang: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col lg:flex-row font-sans selection:bg-blue-600 selection:text-white">
      {/* ─── LEFT PANEL: Brand & Security Info ─────────────────────────────── */}
      <div className="lg:w-7/12 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Logo + Language Switcher */}
        <div className="flex items-center justify-between z-10 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="text-white" size={28} />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
                {t('appTitle')}
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  BANKING GATEWAY
                </span>
              </span>
              <p className="text-xs text-slate-400 leading-none mt-0.5">
                {t('appSubtitle')}
              </p>
            </div>
          </div>

          {/* Clean Language Switcher (EN | HI | TA) */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-2xl border border-slate-800 shadow-inner">
            <Globe size={14} className="text-blue-400 ml-2 mr-1" />
            {(['en', 'hi', 'ta'] as Language[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => handleLanguageChange(code)}
                className={clsx(
                  'px-3 py-1.5 rounded-xl text-xs font-bold transition-all uppercase',
                  language === code
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white',
                )}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Center Hero Information & Security Badges */}
        <div className="my-10 lg:my-auto max-w-xl z-10 relative space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 text-xs font-semibold mb-4">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Next-Generation Anti-Fraud Neural Interception</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Secure Digital Banking with Real-Time Scam Prevention
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
              TrustFlow monitors every high-value electronic transfer using behavioural context queries, RBI clearing matching, and pre-set nominee authorization to protect you from financial fraud and coercive scams.
            </p>
          </div>

          {/* Highlighting TrustFlow Security Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 flex-shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-100 text-sm">{t('rbiCompliantSecurity')}</p>
                <p className="text-xs text-slate-400 mt-0.5">Automated clearing name matching</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 flex-shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-100 text-sm">{t('aiPoweredFraudPrevention')}</p>
                <p className="text-xs text-slate-400 mt-0.5">Real-time risk velocity scoring</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-100 text-sm">{t('adaptiveCoercionShield')}</p>
                <p className="text-xs text-slate-400 mt-0.5">Context questions & locked nominee alert</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 flex-shrink-0">
                <PhoneCall size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-100 text-sm">Helpline 1930 Connected</p>
                <p className="text-xs text-slate-400 mt-0.5">National Cyber Crime Reporting Portal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Guarantee */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-6 z-10 relative">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span>256-Bit Financial Encryption</span>
          </span>
          <span className="font-mono text-slate-400">TrustFlow Protocol v2.6.4</span>
        </div>
      </div>

      {/* ─── RIGHT PANEL: Login Form Card ─────────────────────────────────── */}
      <div className="lg:w-5/12 bg-slate-100 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          {/* Pre-Populated Demo Credentials Helper Badge */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/80 rounded-3xl p-4 shadow-sm relative">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono font-black text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                <Fingerprint size={15} className="text-blue-600" />
                <span>{t('demoCredentialsBadge')}</span>
              </span>
              <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                EVALUATION MODE
              </span>
            </div>
            <div className="text-xs font-mono text-slate-700 space-y-1 bg-white/90 p-2.5 rounded-2xl border border-blue-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer ID:</span>
                <span className="font-bold text-slate-900">{DEMO_CUSTOMER_ID}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Password / MPIN:</span>
                <span className="font-bold text-slate-900">{DEMO_PASSWORD}</span>
              </div>
            </div>
            <p className="text-[11px] text-blue-700 mt-2 font-medium">
              Tip: Click <strong>"Demo Auto-Login"</strong> below to autofill and enter immediately.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {t('loginTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {t('loginSubtitle')}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Customer ID Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t('customerIdLabel')}
                </label>
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => {
                    setCustomerId(e.target.value);
                    setLoginError('');
                  }}
                  placeholder={t('customerIdPlaceholder')}
                  className="w-full text-sm sm:text-base px-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-mono transition-all"
                  autoFocus
                />
              </div>

              {/* Password / MPIN Field with Show/Hide Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t('passwordLabel')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError('');
                    }}
                    placeholder={t('passwordPlaceholder')}
                    className="w-full text-sm sm:text-base pl-4 pr-12 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-mono transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
                  {loginError}
                </div>
              )}

              {/* Primary "Login to TrustFlow" Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base shadow-xl shadow-blue-600/25 transition-all active:scale-98 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{t('loginBtn')}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200" />
              <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase">Or Presentation Bypass</span>
              <div className="flex-grow border-t border-slate-200" />
            </div>

            {/* Quick Demo Login Button */}
            <button
              type="button"
              onClick={handleDemoAutoLogin}
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/20 transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Zap size={18} className="text-yellow-300" />
              <span>{t('demoAutoLoginBtn')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
