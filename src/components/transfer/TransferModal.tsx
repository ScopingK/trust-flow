import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Loader2, CheckCircle2, ShieldCheck, Banknote } from 'lucide-react';
import { BeneficiaryList } from '../payee/BeneficiaryList';
import { LowRiskFlow } from './LowRiskFlow';
import { MediumRiskFlow } from './MediumRiskFlow';
import { HighRiskVerificationModal } from './HighRiskVerificationModal';
import { useRiskEvaluate } from '../../hooks/useRiskEvaluate';
import { useTrustFlow } from '../../context/TrustFlowContext';
import { useTranslation } from '../../i18n';
import { clsx } from 'clsx';
import type { Payee, Transaction } from '../../types';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransferModal({ isOpen, onClose }: TransferModalProps) {
  const { state, dispatch } = useTrustFlow();
  const { evaluate, loading: riskLoading } = useRiskEvaluate();
  const { t } = useTranslation();
  const { largeFontMode, flowStep, selectedPayee, currentRiskResult } = state;

  const [amount, setAmount] = useState('');

  const handleClose = () => {
    dispatch({ type: 'RESET_FLOW' });
    setAmount('');
    onClose();
  };

  const handleSelectPayee = (payee: Payee) => {
    dispatch({ type: 'SELECT_PAYEE', payload: payee });
  };

  const handleEvaluate = async () => {
    const numAmount = parseFloat(amount);
    if (!selectedPayee || !numAmount) return;

    dispatch({ type: 'SET_AMOUNT', payload: numAmount });

    const payload = {
      amount: numAmount,
      recipientId: selectedPayee.id,
      timestamp: new Date().toISOString(),
      deviceId: 'desktop_browser_001',
      userAnswers: [],
    };

    dispatch({ type: 'SET_FLOW_STEP', payload: 'RISK_EVALUATING' });
    await evaluate(payload);
  };

  const handleConfirmTransfer = () => {
    if (!selectedPayee) return;
    const finalAmount = state.transferAmount || parseFloat(amount);
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      payeeName: selectedPayee.name,
      amount: finalAmount,
      date: new Date().toISOString().split('T')[0],
      status: 'SUCCESS',
      riskLevel: currentRiskResult?.riskLevel ?? (finalAmount <= 1000 ? 'LOW' : finalAmount <= 10000 ? 'MEDIUM' : 'HIGH'),
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: tx });
    dispatch({ type: 'SET_FLOW_STEP', payload: 'SUCCESS' });
  };

  if (!isOpen) return null;

  // When High Risk Interception is active, transition directly to the HighRiskVerificationModal!
  if (flowStep === 'HIGH_PAUSE' && currentRiskResult) {
    return (
      <HighRiskVerificationModal
        isOpen={true}
        riskResult={currentRiskResult}
        onProceed={handleConfirmTransfer}
        onCancel={handleClose}
      />
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          onClick={handleClose}
        />

        {/* Desktop-Optimized Dialog Card (max-w-3xl for 1024px+ screens) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8"
          role="dialog"
          aria-modal="true"
        >
          {/* Dialog Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center shadow-inner">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 className={clsx('font-black text-slate-900', largeFontMode ? 'text-2xl' : 'text-xl')}>
                  {t('transferModalTitle')}
                </h2>
                <p className="text-xs text-slate-500">
                  TrustFlow Anti-Fraud Neural Check Enabled
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

          {/* Modal Content */}
          <div className="max-h-[78vh] overflow-y-auto">
            {/* Step 1: Destination Payee and Amount */}
            {(flowStep === 'IDLE' || flowStep === 'ENTER_AMOUNT') && (
              <div className="p-6 sm:p-8 space-y-6">
                {/* Payee Selection Section */}
                <div>
                  <BeneficiaryList
                    selectable
                    selectedId={selectedPayee?.id}
                    onSelectPayee={handleSelectPayee}
                  />
                </div>

                {/* Amount Entry Section */}
                {selectedPayee && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-5 border-t border-slate-200 space-y-4"
                  >
                    <div>
                      <label className={clsx('block font-bold text-slate-800 mb-2', largeFontMode ? 'text-lg' : 'text-sm sm:text-base')}>
                        {t('enterAmountStep')}
                      </label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-3xl">
                          ₹
                        </span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                          placeholder={t('amountPlaceholder')}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none font-black text-3xl text-slate-900 transition-all shadow-inner"
                          autoFocus
                        />
                      </div>

                      {/* Helper indicator of thresholds */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          ≤ ₹1,000 : Low Risk
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          ₹1,001 - ₹10,000 : Medium Risk
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          &gt; ₹10,000 : High Risk Interception
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleEvaluate}
                      disabled={!amount || parseFloat(amount) <= 0 || riskLoading}
                      className={clsx(
                        'w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg',
                        largeFontMode ? 'text-xl' : 'text-base sm:text-lg',
                        !amount || parseFloat(amount) <= 0
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 active:scale-98',
                      )}
                    >
                      {riskLoading ? (
                        <>
                          <Loader2 size={22} className="animate-spin" />
                          <span>{t('evaluatingSecurity')}</span>
                        </>
                      ) : (
                        <>
                          <span>{t('continueSecurityCheck')}</span>
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 2: Evaluating Animation */}
            {flowStep === 'RISK_EVALUATING' && (
              <div className="p-16 text-center space-y-5">
                <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                  <Loader2 size={44} className="animate-spin" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-2xl">{t('evaluatingSecurity')}</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                    {t('evaluatingSubtext')}
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Low Risk Flow */}
            {flowStep === 'LOW_CONFIRM' && (
              <LowRiskFlow
                onConfirm={handleConfirmTransfer}
                onCancel={handleClose}
              />
            )}

            {/* Step 4: Medium Risk Flow */}
            {flowStep === 'MEDIUM_CONFIRM' && currentRiskResult && (
              <MediumRiskFlow
                riskResult={currentRiskResult}
                onConfirm={handleConfirmTransfer}
                onCancel={handleClose}
              />
            )}

            {/* Step 5: Success Flow */}
            {flowStep === 'SUCCESS' && (
              <div className="p-8 sm:p-12 text-center space-y-6">
                <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto text-emerald-600 shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 size={54} />
                </div>
                <div>
                  <h3 className={clsx('font-black text-slate-900', largeFontMode ? 'text-3xl' : 'text-2xl sm:text-3xl')}>
                    {t('paymentSuccessTitle')}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                    {t('paymentSuccessSubtext')}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 max-w-md mx-auto text-left border border-slate-200/80 space-y-2.5">
                  <div className="flex justify-between text-xs sm:text-sm py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Recipient Beneficiary:</span>
                    <span className="font-bold text-slate-900">{selectedPayee?.name}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Settled Amount:</span>
                    <span className="font-black text-slate-900">₹{parseFloat(amount || '0').toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm py-1">
                    <span className="text-slate-500">Security Clearance:</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck size={16} /> Cleared (TrustFlow Neural Guard)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="px-10 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-lg transition-all active:scale-95"
                >
                  {t('doneBtn')}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
