import { useState, useRef, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Globe, Type, ChevronDown, UserCheck, LogOut } from 'lucide-react';
import { useTrustFlow } from '../../context/TrustFlowContext';
import { useTranslation } from '../../i18n';
import type { Language } from '../../types';
import { clsx } from 'clsx';

const LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी (Hindi)' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ் (Tamil)' },
];

export function TopNav() {
  const { state, dispatch } = useTrustFlow();
  const { t, language } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { flowStep, largeFontMode, userName } = state;
  const isHigh = flowStep === 'HIGH_PAUSE' || flowStep === 'HIGH_OPTION_A' || flowStep === 'HIGH_OPTION_B';
  const isMedium = flowStep === 'MEDIUM_CONFIRM';

  const statusConfig = isHigh
    ? { text: t('statusHighRisk'), color: 'text-rose-400', bg: 'bg-rose-950/70 border-rose-800/80', icon: ShieldAlert }
    : isMedium
    ? { text: t('statusElevated'), color: 'text-amber-400', bg: 'bg-amber-950/70 border-amber-800/80', icon: Shield }
    : { text: t('statusProtected'), color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-800/60', icon: ShieldCheck };

  const StatusIcon = statusConfig.icon;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (langCode: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: langCode });
    setLangDropdownOpen(false);
  };

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12 h-20 flex items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={clsx('font-extrabold tracking-tight', largeFontMode ? 'text-2xl' : 'text-xl')}>
                {t('appTitle')}
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                PROD-READY
              </span>
            </div>
            <p className={clsx('text-slate-400 leading-none mt-0.5', largeFontMode ? 'text-xs' : 'text-[11px]')}>
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        {/* Center: Live Protection Status */}
        <div className="hidden md:flex items-center">
          <div className={clsx('flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all duration-300', statusConfig.bg, statusConfig.color)}>
            <StatusIcon size={16} className="animate-pulse" />
            <span>{statusConfig.text}</span>
          </div>
        </div>

        {/* Right: Controls & Language Switcher Dropdown */}
        <div className="flex items-center gap-3">
          {/* Large Font Toggle */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_LARGE_FONT' })}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors',
              largeFontMode
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white',
            )}
            title={largeFontMode ? t('normalText') : t('largeText')}
            aria-label="Toggle text size"
          >
            <Type size={15} />
            <span>{largeFontMode ? t('normalText') : t('largeText')}</span>
          </button>

          {/* Strict Language Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all shadow-sm"
              aria-haspopup="listbox"
              aria-expanded={langDropdownOpen}
              aria-label="Language selection"
            >
              <Globe size={15} className="text-blue-400" />
              <span className="font-semibold">{currentLang.nativeName}</span>
              <ChevronDown size={14} className={clsx('transition-transform', langDropdownOpen && 'rotate-180')} />
            </button>

            {langDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                role="listbox"
              >
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/60 mb-1">
                  {t('langSelect')}
                </div>
                {LANGUAGES.map((langItem) => (
                  <button
                    key={langItem.code}
                    onClick={() => handleSelectLanguage(langItem.code)}
                    className={clsx(
                      'w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors',
                      language === langItem.code
                        ? 'bg-blue-600/30 text-blue-300 font-bold'
                        : 'text-slate-200 hover:bg-slate-700/70',
                    )}
                    role="option"
                    aria-selected={language === langItem.code}
                  >
                    <span>{langItem.nativeName}</span>
                    {language === langItem.code && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Account Capsule */}
          <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-800">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-slate-200 font-semibold text-xs shadow-inner">
              <UserCheck size={16} className="text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight">{userName}</p>
              <p className="text-[10px] text-slate-400 leading-tight">SBI • Primary</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/70 border border-rose-800/60 transition-colors shadow-sm ml-1"
            title={t('logoutBtn')}
            aria-label="Logout from TrustFlow"
          >
            <LogOut size={15} className="text-rose-400" />
            <span className="hidden sm:inline">{t('logoutBtn')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
