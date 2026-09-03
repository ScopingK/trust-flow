import { useState } from 'react';
import { useTrustFlow } from '../../context/TrustFlowContext';
import { useTranslation } from '../../i18n';
import { clsx } from 'clsx';
import type { RiskLevel } from '../../types';
import { ShieldCheck, ShieldAlert, Shield, ChevronDown, ChevronUp, Sliders } from 'lucide-react';

const LEVELS: { level: RiskLevel; label: string; bg: string; icon: typeof ShieldCheck }[] = [
  { level: 'LOW', label: 'LOW (≤₹1k)', bg: 'bg-emerald-600', icon: ShieldCheck },
  { level: 'MEDIUM', label: 'MED (≤₹10k)', bg: 'bg-amber-600', icon: Shield },
  { level: 'HIGH', label: 'HIGH (>₹10k)', bg: 'bg-rose-600', icon: ShieldAlert },
];

export function SimulatorBar() {
  const { state, dispatch } = useTrustFlow();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside aria-label={t('devSimulatorTitle')} className="bg-slate-950 text-white border-b border-slate-800 text-xs shadow-md">
      <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-blue-400">
              <Sliders size={13} />
              <span>{t('devSimulatorTitle')}</span>
            </div>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              {t('activeThresholdsTitle')}: Low (≤₹1k), Med (≤₹10k), High (&gt;₹10k)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick override pill buttons */}
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => dispatch({ type: 'SET_FORCED_RISK_LEVEL', payload: null })}
                className={clsx(
                  'px-2.5 py-1 rounded text-[11px] font-bold transition-all',
                  state.forcedRiskLevel === null
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white',
                )}
                aria-pressed={state.forcedRiskLevel === null}
              >
                {t('autoMode')}
              </button>

              {LEVELS.map(({ level, label, bg, icon: Icon }) => (
                <button
                  key={level}
                  onClick={() => dispatch({ type: 'SET_FORCED_RISK_LEVEL', payload: level })}
                  className={clsx(
                    'flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition-all',
                    state.forcedRiskLevel === level
                      ? `${bg} text-white shadow-sm`
                      : 'text-slate-400 hover:text-white',
                  )}
                  aria-pressed={state.forcedRiskLevel === level}
                >
                  <Icon size={12} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
              title="Toggle simulator details"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* Expandable details panel */}
        {expanded && (
          <div className="py-2 pb-3 text-[11px] text-slate-400 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <span>
              {t('forceRiskLabel')} {state.forcedRiskLevel ? <strong className="text-blue-400">{state.forcedRiskLevel}</strong> : <span className="text-emerald-400">Dynamic Amount-Based Rule</span>}
            </span>
            <span className="text-slate-500 font-mono">
              Thresholds: Low (₹0-1,000), Medium (₹1,001-10,000), High (&gt;₹10,000)
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
