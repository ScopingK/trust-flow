import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import { useTrustFlow } from '../../context/TrustFlowContext';
import { useTranslation } from '../../i18n';

interface RBIBadgeProps {
  show: boolean;
  rbiMatchedName: string;
}

export function RBIBadge({ show, rbiMatchedName }: RBIBadgeProps) {
  const { state } = useTrustFlow();
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className="rounded-xl border-2 border-emerald-600 bg-emerald-50 p-4 mt-3 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 bg-emerald-600 rounded-full p-1.5 text-white shadow-sm">
              <CheckCircle2 size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Shield size={14} className="text-emerald-700" />
                <p className={clsx('font-bold text-emerald-900', state.largeFontMode ? 'text-base' : 'text-sm')}>
                  {t('rbiVerifiedBadge')}
                </p>
              </div>
              <p className={clsx('text-emerald-700 mt-0.5', state.largeFontMode ? 'text-sm' : 'text-xs')}>
                {t('rbiVerifiedDesc')}
              </p>
              <p className={clsx('font-mono font-bold text-slate-900 mt-1.5 truncate bg-white/80 px-2 py-1 rounded border border-emerald-200 text-xs sm:text-sm')}>
                {rbiMatchedName}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
