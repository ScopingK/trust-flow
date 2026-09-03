import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle, CheckCircle2, Building, ShieldCheck } from 'lucide-react';
import { RBIBadge } from './RBIBadge';
import { usePayeeVerify } from '../../hooks/usePayeeVerify';
import { useTrustFlow } from '../../context/TrustFlowContext';
import { useTranslation } from '../../i18n';
import { clsx } from 'clsx';
import type { Payee } from '../../types';

interface AddPayeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (payee: Payee) => void;
}

const BANK_NAMES: Record<string, string> = {
  SBIN: 'State Bank of India',
  HDFC: 'HDFC Bank',
  ICIC: 'ICICI Bank',
  AXIS: 'Axis Bank',
  KKBK: 'Kotak Mahindra Bank',
  PUNB: 'Punjab National Bank',
  CNRB: 'Canara Bank',
  UBIN: 'Union Bank of India',
};

const AVATAR_COLORS = ['#1E40AF', '#15803D', '#D97706', '#DC2626', '#7C3AED', '#0891B2'];

export function AddPayeeModal({ isOpen, onClose, onSuccess }: AddPayeeModalProps) {
  const { state, dispatch } = useTrustFlow();
  const { t } = useTranslation();
  const { verify, loading, result, error, reset } = usePayeeVerify();

  const [form, setForm] = useState({
    accountNumber: '',
    ifscCode: '',
    beneficiaryName: '',
  });

  const bankName = BANK_NAMES[form.ifscCode.slice(0, 4)?.toUpperCase()] || '';

  const handleVerify = async () => {
    const res = await verify({
      accountNumber: form.accountNumber,
      ifscCode: form.ifscCode.toUpperCase(),
      beneficiaryName: form.beneficiaryName,
    });
    if (!res) return;
  };

  const handleSave = () => {
    if (!result?.isVerified) return;
    const newPayee: Payee = {
      id: `p${Date.now()}`,
      name: form.beneficiaryName,
      accountNumber: `****${form.accountNumber.slice(-4)}`,
      ifscCode: form.ifscCode.toUpperCase(),
      bankName: bankName || 'Verified Scheduled Commercial Bank',
      isRbiVerified: true,
      rbiMatchedName: result.rbiMatchedName,
      addedAt: new Date().toISOString().split('T')[0],
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    };
    dispatch({ type: 'ADD_PAYEE', payload: newPayee });
    reset();
    setForm({ accountNumber: '', ifscCode: '', beneficiaryName: '' });
    onSuccess?.(newPayee);
    onClose();
  };

  const handleClose = () => {
    reset();
    setForm({ accountNumber: '', ifscCode: '', beneficiaryName: '' });
    onClose();
  };

  const lf = state.largeFontMode;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          onClick={handleClose}
        />

        {/* Desktop-Optimized Dialog Card (max-w-2xl with high readability) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center shadow-inner">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 className={clsx('font-black text-slate-900', lf ? 'text-2xl' : 'text-xl')}>
                  {t('addPayeeModalTitle')}
                </h2>
                <p className={clsx('text-slate-500 text-xs sm:text-sm mt-0.5', lf && 'text-base')}>
                  {t('addPayeeModalSub')}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label={t('cancelBtn')}
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Account Number */}
            <div>
              <label className={clsx('block font-bold text-slate-800 mb-1.5', lf ? 'text-lg' : 'text-xs uppercase tracking-wider')}>
                {t('accountNumberLabel')}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={form.accountNumber}
                onChange={(e) => {
                  reset();
                  setForm((f) => ({ ...f, accountNumber: e.target.value.replace(/\D/g, '') }));
                }}
                placeholder={t('accountNumberPlaceholder')}
                className="w-full text-base sm:text-lg rounded-2xl border-2 border-slate-200 px-4 py-3.5 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-mono font-medium shadow-inner"
                maxLength={18}
              />
            </div>

            {/* IFSC Code */}
            <div>
              <label className={clsx('block font-bold text-slate-800 mb-1.5', lf ? 'text-lg' : 'text-xs uppercase tracking-wider')}>
                {t('ifscCodeLabel')}
              </label>
              <input
                type="text"
                value={form.ifscCode}
                onChange={(e) => {
                  reset();
                  setForm((f) => ({ ...f, ifscCode: e.target.value.toUpperCase() }));
                }}
                placeholder={t('ifscCodePlaceholder')}
                className="w-full text-base sm:text-lg rounded-2xl border-2 border-slate-200 px-4 py-3.5 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-mono uppercase tracking-widest font-bold shadow-inner"
                maxLength={11}
              />
              {bankName && (
                <p className="text-blue-600 text-xs sm:text-sm mt-1.5 font-bold flex items-center gap-1.5 bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                  <Building size={16} /> {bankName}
                </p>
              )}
            </div>

            {/* Beneficiary Name */}
            <div>
              <label className={clsx('block font-bold text-slate-800 mb-1.5', lf ? 'text-lg' : 'text-xs uppercase tracking-wider')}>
                {t('beneficiaryNameLabel')}
              </label>
              <input
                type="text"
                value={form.beneficiaryName}
                onChange={(e) => {
                  reset();
                  setForm((f) => ({ ...f, beneficiaryName: e.target.value }));
                }}
                placeholder={t('beneficiaryNamePlaceholder')}
                className="w-full text-base sm:text-lg rounded-2xl border-2 border-slate-200 px-4 py-3.5 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium shadow-inner"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-800 text-xs sm:text-sm">
                <AlertCircle size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* RBI Verification Badge Component */}
            <RBIBadge show={!!result?.isVerified} rbiMatchedName={result?.rbiMatchedName ?? ''} />

            {/* Dialog Actions */}
            <div className="pt-3">
              {!result?.isVerified ? (
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={loading || !form.accountNumber || !form.ifscCode || !form.beneficiaryName}
                  className={clsx(
                    'w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-sm sm:text-base transition-all shadow-lg',
                    loading || !form.accountNumber || !form.ifscCode || !form.beneficiaryName
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 active:scale-98',
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>{t('verifyingBtn')}</span>
                    </>
                  ) : (
                    <span>{t('verifyAndAddBtn')}</span>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 active:scale-98 transition-all"
                >
                  <CheckCircle2 size={20} />
                  <span>{t('saveBeneficiaryBtn')}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
