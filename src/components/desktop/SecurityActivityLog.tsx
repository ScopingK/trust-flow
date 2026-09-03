import { Activity, ShieldCheck, ShieldAlert, AlertTriangle, Radio } from 'lucide-react';
import { useTrustFlow } from '../../context/TrustFlowContext';
import { useTranslation } from '../../i18n';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const RISK_BADGES = {
  LOW: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500', icon: ShieldCheck },
  MEDIUM: { bg: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500', icon: AlertTriangle },
  HIGH: { bg: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-500', icon: ShieldAlert },
};

export function SecurityActivityLog() {
  const { state } = useTrustFlow();
  const { t } = useTranslation();
  const { securityLog, largeFontMode } = state;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col h-full max-h-[560px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-blue-600" />
          <div>
            <h3 className={clsx('font-bold text-slate-800 leading-tight', largeFontMode ? 'text-lg' : 'text-sm')}>
              {t('securityLogTitle')}
            </h3>
            <p className="text-[11px] text-slate-400 leading-tight">
              {t('securityLogSubtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold rounded-full">
          <Radio size={12} className="animate-pulse text-emerald-600" />
          <span>{t('liveShieldActive')}</span>
        </div>
      </div>

      {/* Scrollable event feed */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-dark">
        {securityLog.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center italic">{t('emptyLog')}</p>
        ) : (
          securityLog.map((item, idx) => {
            const badge = RISK_BADGES[item.riskLevel] || RISK_BADGES.LOW;
            const Icon = badge.icon;
            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', badge.dot)} />
                    <span className={clsx('font-bold text-slate-800 truncate', largeFontMode ? 'text-sm' : 'text-xs')}>
                      {item.action}
                    </span>
                  </div>
                  <span className={clsx('px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 flex-shrink-0', badge.bg)}>
                    <Icon size={10} />
                    {item.riskLevel}
                  </span>
                </div>
                <p className={clsx('text-slate-600 leading-relaxed', largeFontMode ? 'text-xs' : 'text-[11px]')}>
                  {item.details}
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/40">
                  <span>{item.timestamp}</span>
                  {item.riskScore !== undefined && (
                    <span className="font-mono font-semibold">Score: {item.riskScore}/100</span>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
