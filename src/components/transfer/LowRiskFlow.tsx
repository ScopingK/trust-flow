import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTrustFlow } from '../../context/TrustFlowContext';
import { useTranslation } from '../../i18n';
import { clsx } from 'clsx';

interface LowRiskFlowProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function LowRiskFlow({ onConfirm, onCancel }: LowRiskFlowProps) {
  const { state } = useTrustFlow();
  const { t } = useTranslation();
  const { selectedPayee, transferAmount, largeFontMode } = state;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="p-6 sm:p-8 space-y-6"
    >
      {/* Risk Status Banner */}
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h3 className={clsx('font-bold text-emerald-900', largeFontMode ? 'text-lg' : 'text-base')}>
            {t('lowRiskBanner')}
          </h3>
          <p className={clsx('text-emerald-700 text-xs mt-0.5', largeFontMode && 'text-sm')}>
            {t('lowRiskTitle')} • {t('lowRiskScoreLabel')}: 12/100
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('payingTo')}
            </p>
            <p className={clsx('font-bold text-slate-900 mt-1', largeFontMode ? 'text-xl' : 'text-lg')}>
              {selectedPayee?.name}
            </p>
            <p className="text-xs text-slate-500">
              {selectedPayee?.bankName} • {selectedPayee?.accountNumber}
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
            style={{ backgroundColor: selectedPayee?.avatarColor || '#1E40AF' }}
          >
            {selectedPayee?.name?.charAt(0)}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t('amountToPay')}
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-slate-400">₹</span>
            <span className={clsx('font-black text-slate-900 tracking-tight', largeFontMode ? 'text-4xl' : 'text-3xl')}>
              {transferAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onConfirm}
          className={clsx(
            'w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3.5 font-bold shadow-lg shadow-emerald-600/20 active:scale-98 transition-all',
            largeFontMode ? 'text-lg' : 'text-base',
          )}
        >
          <CheckCircle2 size={20} />
          {t('confirmTransferBtn')}
          <ArrowRight size={18} />
        </button>

        <button
          onClick={onCancel}
          className="w-full text-slate-500 hover:text-slate-800 py-2 text-xs font-semibold transition-colors"
        >
          {t('cancelBtn')}
        </button>
      </div>

      {/* Subtle Protected Badge */}
      <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs pt-2">
        <ShieldCheck size={14} className="text-emerald-600" />
        <span>{t('protectedByTrustFlow')}</span>
      </div>
    </motion.div>
  );
}
