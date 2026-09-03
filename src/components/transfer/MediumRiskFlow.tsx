import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, XCircle, Info, ShieldAlert, Check, HelpCircle } from 'lucide-react';
import { useTrustFlow } from '../../context/TrustFlowContext';
import { useTranslation } from '../../i18n';
import { clsx } from 'clsx';
import type { RiskEvaluateResponse } from '../../types';

interface MediumRiskFlowProps {
  riskResult: RiskEvaluateResponse;
  onConfirm: () => void;
  onCancel: () => void;
}

export function MediumRiskFlow({ riskResult, onConfirm, onCancel }: MediumRiskFlowProps) {
  const { state, dispatch } = useTrustFlow();
  const { t } = useTranslation();
  const { selectedPayee, transferAmount, largeFontMode } = state;

  // Answers to the 3 Context Validation Questions (null = unanswered, false = No, true = Yes)
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({
    1: null,
    2: null,
    3: null,
  });

  const handleSelectAnswer = (questionIndex: number, value: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const allAnswered = answers[1] !== null && answers[2] !== null && answers[3] !== null;
  const redFlagsCount = [answers[1], answers[2], answers[3]].filter((val) => val === true).length;
  const hasRedFlags = redFlagsCount > 0;

  const handleConfirmWithTelemetry = () => {
    dispatch({
      type: 'ADD_SECURITY_LOG',
      payload: {
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        action: 'Moderate Risk Context Answered',
        details: `3 Context queries answered with ${redFlagsCount} red-flags acknowledged.`,
        riskLevel: hasRedFlags ? 'HIGH' : 'MEDIUM',
        riskScore: riskResult.riskScore,
      },
    });
    onConfirm();
  };

  const questions = [
    {
      id: 1,
      text: t('contextQ1'),
      warning: t('warningUrgencyDetected'),
    },
    {
      id: 2,
      text: t('contextQ2'),
      warning: t('warningImpersonationDetected'),
    },
    {
      id: 3,
      text: t('contextQ3'),
      warning: t('warningSecrecyDetected'),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="p-6 sm:p-8 space-y-6"
    >
      {/* Moderate Risk Header Banner */}
      <div className="bg-amber-50 border-2 border-amber-500/40 rounded-3xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-amber-500 text-white rounded-2xl p-3 flex-shrink-0 shadow-md shadow-amber-500/20">
            <AlertTriangle size={28} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-900 uppercase px-2.5 py-0.5 rounded-full bg-amber-200/80">
                {t('mediumRiskHeading')}
              </span>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                ₹{transferAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-mono font-bold text-amber-900 bg-white/80 px-2 py-0.5 rounded-md border border-amber-200">
                Score: {riskResult.riskScore}/100
              </span>
            </div>
            <h3 className={clsx('font-black text-amber-950 leading-tight', largeFontMode ? 'text-2xl' : 'text-xl')}>
              {t('contextQueriesTitle')}
            </h3>
            <p className={clsx('text-amber-900 text-xs sm:text-sm mt-1 leading-relaxed', largeFontMode && 'text-base')}>
              {t('mediumRiskSubheading')}
            </p>
          </div>
        </div>
      </div>

      {/* Recipient & Amount Summary Tag */}
      <div className="flex items-center justify-between bg-slate-50 rounded-2xl border border-slate-200 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm"
            style={{ backgroundColor: selectedPayee?.avatarColor || '#1E40AF' }}
          >
            {selectedPayee?.name?.charAt(0)}
          </div>
          <div>
            <p className={clsx('font-bold text-slate-900', largeFontMode ? 'text-base' : 'text-sm')}>
              {selectedPayee?.name}
            </p>
            <p className="text-xs text-slate-500">{selectedPayee?.bankName} • {selectedPayee?.accountNumber}</p>
          </div>
        </div>
        <span className={clsx('font-black text-slate-900 text-lg sm:text-xl', largeFontMode && 'text-2xl')}>
          ₹{transferAmount.toLocaleString('en-IN')}
        </span>
      </div>

      {/* The 3 Context Validation Questions */}
      <div className="space-y-4">
        {questions.map((q) => {
          const answer = answers[q.id];
          const isYes = answer === true;
          const isNo = answer === false;

          return (
            <div
              key={q.id}
              className={clsx(
                'rounded-2xl border-2 p-5 transition-all bg-white shadow-sm',
                answer === null
                  ? 'border-slate-200'
                  : isYes
                  ? 'border-rose-300 bg-rose-50/40'
                  : 'border-emerald-300 bg-emerald-50/30',
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {q.id}
                  </span>
                  <p className={clsx('font-bold text-slate-900 text-sm sm:text-base leading-snug', largeFontMode && 'text-lg')}>
                    {q.text}
                  </p>
                </div>

                {/* Yes / No Toggle Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSelectAnswer(q.id, false)}
                    className={clsx(
                      'px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 border-2',
                      isNo
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100',
                    )}
                  >
                    {isNo && <Check size={14} strokeWidth={3} />}
                    <span>{t('noLabel')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectAnswer(q.id, true)}
                    className={clsx(
                      'px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 border-2',
                      isYes
                        ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100',
                    )}
                  >
                    {isYes && <AlertTriangle size={14} />}
                    <span>{t('yesLabel')}</span>
                  </button>
                </div>
              </div>

              {/* Warning advisory if user answered "Yes" to a red flag */}
              {isYes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3.5 pt-3 border-t border-rose-200/80 flex items-start gap-2.5 text-rose-800 text-xs sm:text-sm"
                >
                  <ShieldAlert size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold leading-relaxed">{q.warning}</span>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Warning banner if red flags detected */}
      {hasRedFlags && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start gap-3"
        >
          <AlertTriangle size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Caution: Behavioral Scam Signals Acknowledged</p>
            <p className="text-rose-700 mt-0.5">
              You indicated affirmative responses to fraud risk triggers. If an unknown caller instructed you to make this payment, please cancel and verify with someone you trust.
            </p>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleConfirmWithTelemetry}
          disabled={!allAnswered}
          className={clsx(
            'w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-bold shadow-lg transition-all',
            largeFontMode ? 'text-xl' : 'text-base sm:text-lg',
            !allAnswered
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : hasRedFlags
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30 active:scale-98'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 active:scale-98',
          )}
        >
          <CheckCircle2 size={20} />
          <span>{allAnswered ? t('confirmKnowRecipientBtn') : 'Answer All 3 Questions to Proceed'}</span>
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full flex items-center justify-center gap-2 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl py-3.5 font-bold text-xs sm:text-sm transition-colors"
        >
          <XCircle size={16} />
          <span>{t('cancelTransactionBtn')}</span>
        </button>
      </div>
    </motion.div>
  );
}
