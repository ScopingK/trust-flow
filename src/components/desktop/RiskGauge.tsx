import { motion } from 'framer-motion';
import { useTrustFlow } from '../../context/TrustFlowContext';
import { useTranslation } from '../../i18n';
import { ShieldCheck, ShieldAlert, Shield, Gauge } from 'lucide-react';
import { clsx } from 'clsx';

export function RiskGauge() {
  const { state } = useTrustFlow();
  const { t } = useTranslation();
  const { currentRiskResult, flowStep, transferAmount, largeFontMode } = state;

  const score = currentRiskResult?.riskScore ?? (
    flowStep === 'IDLE' ? 8 :
    transferAmount <= 1000 ? 12 :
    transferAmount <= 10000 ? 54 : 92
  );

  const level = currentRiskResult?.riskLevel ?? (
    flowStep === 'IDLE' ? 'LOW' :
    transferAmount <= 1000 ? 'LOW' :
    transferAmount <= 10000 ? 'MEDIUM' : 'HIGH'
  );

  const config = level === 'HIGH'
    ? { color: 'text-rose-500', stroke: '#DC2626', bg: 'bg-rose-500/10', border: 'border-rose-500/30', label: t('riskGaugeCritical'), icon: ShieldAlert }
    : level === 'MEDIUM'
    ? { color: 'text-amber-500', stroke: '#D97706', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: t('riskGaugeElevated'), icon: Shield }
    : { color: 'text-emerald-500', stroke: '#15803D', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: t('riskGaugeSafe'), icon: ShieldCheck };

  const Icon = config.icon;

  // Arc calculation for SVG half gauge
  const radius = 56;
  const circumference = Math.PI * radius; // half circle
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gauge size={18} className="text-slate-600" />
          <h3 className={clsx('font-bold text-slate-800', largeFontMode ? 'text-lg' : 'text-sm')}>
            {t('riskGaugeTitle')}
          </h3>
        </div>
        <div className={clsx('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border', config.bg, config.border, config.color)}>
          <Icon size={14} />
          <span>{level}</span>
        </div>
      </div>

      {/* SVG Arc Gauge */}
      <div className="flex flex-col items-center justify-center pt-2">
        <div className="relative w-40 h-24 flex items-center justify-center">
          <svg className="w-40 h-24 overflow-visible" viewBox="0 0 140 80">
            {/* Background track */}
            <path
              d="M 14 74 A 56 56 0 0 1 126 74"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Animated risk track */}
            <motion.path
              d="M 14 74 A 56 56 0 0 1 126 74"
              fill="none"
              stroke={config.stroke}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          </svg>

          {/* Center Score readout */}
          <div className="absolute bottom-1 text-center">
            <span className={clsx('font-black tracking-tight', config.color, largeFontMode ? 'text-3xl' : 'text-2xl')}>
              {score}
            </span>
            <span className="text-slate-400 text-xs font-semibold">/100</span>
          </div>
        </div>

        <p className={clsx('text-xs font-semibold mt-2 text-center text-slate-600', largeFontMode && 'text-sm')}>
          {config.label}
        </p>
      </div>

      {/* Active Enforced Thresholds Reference */}
      <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs">
        <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
          {t('activeThresholdsTitle')}
        </p>
        <div className="space-y-1.5 text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex-shrink-0" />
            <span className="font-medium">{t('thresholdLow')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
            <span className="font-medium">{t('thresholdMed')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 flex-shrink-0" />
            <span className="font-medium">{t('thresholdHigh')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
