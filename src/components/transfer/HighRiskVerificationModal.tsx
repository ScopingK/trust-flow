import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  HelpCircle,
  BellRing,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertTriangle,
  Smartphone,
  Loader2,
  X,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Clock,
  Ban,
} from 'lucide-react';
import { useTrustFlow } from '../../context/TrustFlowContext';
import { useTranslation } from '../../i18n';
import { sendRealWorldAlert } from '../../api/alertService';
import { clsx } from 'clsx';
import type { RiskEvaluateResponse } from '../../types';

interface HighRiskVerificationModalProps {
  isOpen: boolean;
  riskResult: RiskEvaluateResponse;
  onProceed: () => void;
  onCancel: () => void;
}

type VerificationTab = 'METHOD_A' | 'METHOD_B';

export function HighRiskVerificationModal({
  isOpen,
  riskResult,
  onProceed,
  onCancel,
}: HighRiskVerificationModalProps) {
  const { state, dispatch } = useTrustFlow();
  const { t } = useTranslation();
  const {
    selectedPayee,
    transferAmount,
    userName,
    largeFontMode,
    securityQuestionsAnswered,
    nomineeStatus,
  } = state;

  // Active Tab: Method A (5 Queries) or Method B (Pre-Set Nominee Approval)
  const [activeTab, setActiveTab] = useState<VerificationTab>('METHOD_B');

  // ─── Pre-Set Nominee Contact (Locked Profile) ───────────────────────────────
  const nomineeProfile = {
    name: 'Ramesh Kumar (Son)',
    phone: '+91 ******4321',
    fullPhoneForDispatch: '+919876544321',
    status: 'Verified Account Nominee',
  };

  // ─── METHOD A: 5 Security & Context Queries State ──────────────────────────
  const [contextAnswers, setContextAnswers] = useState<Record<number, boolean | null>>({
    1: null,
    2: null,
    3: null,
  });
  const [cityAnswer, setCityAnswer] = useState('');
  const [schoolAnswer, setSchoolAnswer] = useState('');
  const [methodAError, setMethodAError] = useState('');

  // ─── METHOD B: Locked Nominee Approval State ───────────────────────────────
  const [isRequestingApproval, setIsRequestingApproval] = useState(false);
  const [waitingCountdown, setWaitingCountdown] = useState(6);

  // Simulated waiting timer for nominee concurrence
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (nomineeStatus === 'SENT' && waitingCountdown > 0) {
      interval = setInterval(() => {
        setWaitingCountdown((prev) => {
          if (prev <= 1) {
            dispatch({ type: 'SET_NOMINEE_STATUS', payload: 'APPROVED' });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [nomineeStatus, waitingCountdown, dispatch]);

  if (!isOpen) return null;

  // ─── Method A Validation ───────────────────────────────────────────────────
  const handleValidateMethodA = (e: React.FormEvent) => {
    e.preventDefault();

    if (contextAnswers[1] === null || contextAnswers[2] === null || contextAnswers[3] === null) {
      setMethodAError('Please answer all 3 context validation questions (Yes/No).');
      return;
    }
    if (!cityAnswer.trim() || !schoolAnswer.trim()) {
      setMethodAError('Please provide answers to both security identity questions.');
      return;
    }

    setMethodAError('');
    dispatch({ type: 'SET_SECURITY_QUESTIONS_ANSWERED', payload: true });
    dispatch({
      type: 'ADD_SECURITY_LOG',
      payload: {
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        action: 'Method A 5 Queries Authenticated',
        details: 'User answered 3 context questions and 2 security questions.',
        riskLevel: 'MEDIUM',
      },
    });
  };

  // ─── Method B: Request Approval from Saved Nominee ─────────────────────────
  const handleRequestNomineeApproval = async () => {
    setIsRequestingApproval(true);
    dispatch({ type: 'SET_NOMINEE_STATUS', payload: 'SENDING' });

    // Attempt live dispatch to the pre-set nominee phone
    try {
      await sendRealWorldAlert({
        recipient: nomineeProfile.fullPhoneForDispatch,
        userName,
        amount: transferAmount,
        payeeName: selectedPayee?.name || 'Beneficiary',
        fraudHelpline: '1930',
      });
    } catch {
      // Handled in alertService with fallback
    }

    setTimeout(() => {
      setIsRequestingApproval(false);
      dispatch({ type: 'SET_NOMINEE_STATUS', payload: 'SENT' });
      setWaitingCountdown(6);
      dispatch({
        type: 'ADD_SECURITY_LOG',
        payload: {
          id: `log-${Date.now()}`,
          timestamp: 'Just now',
          action: 'Pre-Set Nominee Approval Requested',
          details: `Authorization request dispatched to locked nominee: ${nomineeProfile.name} (${nomineeProfile.phone}).`,
          riskLevel: 'HIGH',
        },
      });
    }, 1200);
  };

  const isMethodAUnlocked = securityQuestionsAnswered;
  const isMethodBUnlocked = nomineeStatus === 'APPROVED';
  const isFullyAuthorized = isMethodAUnlocked || isMethodBUnlocked;

  // Static SMS message template sent to the locked pre-set contact
  const lockedSmsContent = `SECURITY ALERT: TrustFlow has held a high-value transfer of ₹${transferAmount.toLocaleString('en-IN')} initiated by ${userName}. Authorization link sent to pre-registered contact (${nomineeProfile.phone}). If unauthorized, call 1930 immediately.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
      {/* Backdrop with desktop blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        onClick={onCancel}
      />

      {/* Spacious Desktop Dialog Card (1024px+ screen optimized) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="high-risk-title"
      >
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 text-white p-6 sm:p-8 relative">
          <button
            onClick={onCancel}
            className="absolute top-6 right-6 p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
            aria-label={t('cancelBtn')}
          >
            <X size={20} />
          </button>

          <div className="flex items-start gap-4 sm:gap-5">
            <div className="p-3.5 bg-rose-500/20 border border-rose-400/40 rounded-2xl flex-shrink-0 shadow-inner">
              <ShieldAlert className="text-rose-400" size={42} />
            </div>
            <div className="flex-1 pr-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold tracking-widest text-rose-300 uppercase px-3 py-0.5 rounded-full bg-rose-950/90 border border-rose-500/50">
                  {t('highRiskWarningTitle')}
                </span>
                <span className="text-xs font-bold text-rose-200 bg-white/10 px-2.5 py-0.5 rounded-full">
                  Transfer: ₹{transferAmount.toLocaleString('en-IN')} (&gt; ₹10,000)
                </span>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                  Risk Score: {riskResult.riskScore}/100
                </span>
              </div>

              <h2
                id="high-risk-title"
                className={clsx('font-black tracking-tight mt-2 text-white', largeFontMode ? 'text-3xl' : 'text-2xl')}
              >
                {t('highRiskWarningHeading')}
              </h2>
              <p className={clsx('text-rose-100/90 mt-1.5 max-w-2xl leading-relaxed', largeFontMode ? 'text-base' : 'text-sm')}>
                {t('highRiskWarningSubheading')}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body: Two Tab Selectors */}
        <div className="p-6 sm:p-8 bg-slate-50/70 space-y-6">
          <div>
            <h3 className={clsx('font-black text-slate-900', largeFontMode ? 'text-2xl' : 'text-xl')}>
              {t('chooseVerificationMethodTitle')}
            </h3>
            <p className={clsx('text-slate-500 text-sm mt-0.5', largeFontMode && 'text-base')}>
              Choose either Method A (answer 5 queries) or Method B (request approval from locked pre-set nominee).
            </p>
          </div>

          {/* Two-Tab Navigation Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tab: Method B (Pre-Set Nominee Approval) */}
            <button
              type="button"
              onClick={() => setActiveTab('METHOD_B')}
              className={clsx(
                'flex items-start gap-4 p-5 rounded-3xl border-2 text-left transition-all',
                activeTab === 'METHOD_B'
                  ? 'bg-indigo-50/90 border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50',
              )}
            >
              <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', activeTab === 'METHOD_B' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700')}>
                <BellRing size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-600 uppercase">Method B (Recommended)</span>
                  {isMethodBUnlocked && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={12} /> Approved
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900 text-base mt-0.5 truncate">
                  Pre-Set Nominee Authorization
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Request concurrence from locked contact: {nomineeProfile.name}
                </p>
              </div>
            </button>

            {/* Tab: Method A (5 Queries) */}
            <button
              type="button"
              onClick={() => setActiveTab('METHOD_A')}
              className={clsx(
                'flex items-start gap-4 p-5 rounded-3xl border-2 text-left transition-all',
                activeTab === 'METHOD_A'
                  ? 'bg-blue-50/90 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50',
              )}
            >
              <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', activeTab === 'METHOD_A' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700')}>
                <HelpCircle size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-600 uppercase">Method A</span>
                  {isMethodAUnlocked && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={12} /> Cleared
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900 text-base mt-0.5 truncate">
                  5 Security & Context Queries
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  3 context questions + 2 personal security questions.
                </p>
              </div>
            </button>
          </div>

          {/* Active Tab Content Area */}
          <AnimatePresence mode="wait">
            {/* ─── METHOD B: Locked Nominee Authorization Tab ─────────────── */}
            {activeTab === 'METHOD_B' && (
              <motion.div
                key="methodB"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-200 shadow-sm space-y-6"
              >
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                      <Lock size={20} className="text-indigo-600" />
                      <span>Pre-Registered Nominee Authorization</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Contact details are permanently locked to your verified account profile to prevent scammer diversion.
                    </p>
                  </div>
                  {isMethodBUnlocked && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300">
                      <CheckCircle2 size={16} /> Nominee Concurrence Received
                    </span>
                  )}
                </div>

                {/* Locked, High-Trust Pre-Registered Contact Card */}
                <div className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-slate-50 to-white p-6 shadow-sm relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-600/20 flex-shrink-0">
                        RK
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-black text-slate-900 text-lg sm:text-xl">
                            {nomineeProfile.name}
                          </h5>
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                            <ShieldCheck size={13} /> {nomineeProfile.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 font-bold mt-1">
                          <Smartphone size={14} className="text-indigo-600" />
                          <span>Phone: {nomineeProfile.phone}</span>
                          <span className="text-slate-400 font-sans font-normal">(Masked for Privacy)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto shadow-inner">
                      <Lock size={13} className="text-amber-600" />
                      <span>Account Profile Locked</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-4 pt-3 border-t border-indigo-100/80 flex items-center gap-1.5">
                    <ShieldAlert size={13} className="text-indigo-600 flex-shrink-0" />
                    <span>Manual number entry is disabled to prevent fraudulent diversion to third-party devices.</span>
                  </p>
                </div>

                {/* Static SMS Preview Box showing automated request sent to locked number */}
                <div className="bg-slate-950 text-slate-100 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-mono text-amber-400 font-bold flex items-center gap-1.5">
                      <Smartphone size={14} /> SMS Security Dispatch Preview
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Recipient: {nomineeProfile.phone}</span>
                  </div>

                  <div className="bg-gradient-to-r from-slate-900 to-slate-850 p-4 rounded-2xl border border-slate-800">
                    <p className="text-xs sm:text-sm font-mono text-slate-200 leading-relaxed">
                      "{lockedSmsContent}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Emergency Stop Hotline: 1930</span>
                    <span className="text-emerald-400 font-semibold">✓ Linked to Registered Bank Nominee</span>
                  </div>
                </div>

                {/* Loading / Sending State */}
                {isRequestingApproval && (
                  <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-sm font-bold flex items-center justify-center gap-3">
                    <Loader2 size={22} className="animate-spin text-indigo-600" />
                    <span>Dispatching authorization link to {nomineeProfile.name}...</span>
                  </div>
                )}

                {/* Simulated Waiting Card State */}
                {nomineeStatus === 'SENT' && !isRequestingApproval && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-3xl bg-amber-50/90 border-2 border-amber-400 shadow-md space-y-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-900 uppercase tracking-wider bg-amber-200/80 px-2.5 py-0.5 rounded-md">
                          Live Authorization Request
                        </span>
                        <h5 className="font-black text-amber-950 text-base sm:text-lg mt-1">
                          Approval link sent to {nomineeProfile.phone}
                        </h5>
                        <p className="text-xs sm:text-sm text-amber-800 font-medium mt-0.5 flex items-center gap-1.5">
                          <Clock size={14} className="text-amber-700 animate-spin" />
                          <span>Waiting for response from {nomineeProfile.name} ({nomineeProfile.phone})...</span>
                        </p>
                      </div>

                      <span className="text-xs font-mono font-bold text-amber-900 bg-white/90 px-3 py-1.5 rounded-xl border border-amber-300 shadow-sm flex-shrink-0">
                        {waitingCountdown}s
                      </span>
                    </div>

                    {/* Animated waiting progress bar */}
                    <div className="w-full bg-amber-200/70 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className="bg-amber-600 h-2.5 rounded-full"
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: 6, ease: 'linear' }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-amber-800">
                        Automated concurrence approval simulation active.
                      </span>
                      <button
                        type="button"
                        onClick={onCancel}
                        className="font-bold text-rose-700 hover:text-rose-900 underline flex items-center gap-1"
                      >
                        <Ban size={13} /> Cancel Transfer
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Approved State Badge */}
                {nomineeStatus === 'APPROVED' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 text-sm sm:text-base font-bold flex items-start gap-3.5 shadow-md shadow-emerald-500/10"
                  >
                    <CheckCircle2 size={24} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1">
                      <p className="text-emerald-900">
                        Nominee Concurrence Received: Transfer safety approved by {nomineeProfile.name}.
                      </p>
                      <p className="text-xs text-emerald-700 font-normal">
                        Pre-registered contact ({nomineeProfile.phone}) acknowledged the transfer. Clearance granted.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Primary Action Button: "Request Approval from Pre-Set Nominee" */}
                {nomineeStatus === 'IDLE' && !isRequestingApproval && (
                  <button
                    type="button"
                    onClick={handleRequestNomineeApproval}
                    className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2.5"
                  >
                    <BellRing size={18} />
                    <span>Request Approval from Pre-Set Nominee</span>
                  </button>
                )}
              </motion.div>
            )}

            {/* ─── METHOD A: 5 Queries (3 Context + 2 Security) ───────────── */}
            {activeTab === 'METHOD_A' && (
              <motion.div
                key="methodA"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-200 shadow-sm space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg sm:text-xl">
                      Method A: Complete All 5 Queries
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Answer the 3 context queries below and provide your 2 security answers.
                    </p>
                  </div>
                  {isMethodAUnlocked && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300">
                      <CheckCircle2 size={16} /> All 5 Queries Verified
                    </span>
                  )}
                </div>

                {!isMethodAUnlocked ? (
                  <form onSubmit={handleValidateMethodA} className="space-y-6">
                    {/* Part 1: The 3 Context Questions */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Part 1: Context Questions (3 Queries)
                      </p>

                      {/* Context Query 1 */}
                      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            1
                          </span>
                          <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                            {t('contextQ1')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setContextAnswers((p) => ({ ...p, 1: false }))}
                            className={clsx('px-4 py-2 rounded-xl text-xs font-bold border transition-all', contextAnswers[1] === false ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300 text-slate-700')}
                          >
                            {t('noLabel')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setContextAnswers((p) => ({ ...p, 1: true }))}
                            className={clsx('px-4 py-2 rounded-xl text-xs font-bold border transition-all', contextAnswers[1] === true ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white border-slate-300 text-slate-700')}
                          >
                            {t('yesLabel')}
                          </button>
                        </div>
                      </div>

                      {/* Context Query 2 */}
                      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            2
                          </span>
                          <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                            {t('contextQ2')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setContextAnswers((p) => ({ ...p, 2: false }))}
                            className={clsx('px-4 py-2 rounded-xl text-xs font-bold border transition-all', contextAnswers[2] === false ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300 text-slate-700')}
                          >
                            {t('noLabel')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setContextAnswers((p) => ({ ...p, 2: true }))}
                            className={clsx('px-4 py-2 rounded-xl text-xs font-bold border transition-all', contextAnswers[2] === true ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white border-slate-300 text-slate-700')}
                          >
                            {t('yesLabel')}
                          </button>
                        </div>
                      </div>

                      {/* Context Query 3 */}
                      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            3
                          </span>
                          <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                            {t('contextQ3')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setContextAnswers((p) => ({ ...p, 3: false }))}
                            className={clsx('px-4 py-2 rounded-xl text-xs font-bold border transition-all', contextAnswers[3] === false ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300 text-slate-700')}
                          >
                            {t('noLabel')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setContextAnswers((p) => ({ ...p, 3: true }))}
                            className={clsx('px-4 py-2 rounded-xl text-xs font-bold border transition-all', contextAnswers[3] === true ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white border-slate-300 text-slate-700')}
                          >
                            {t('yesLabel')}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Part 2: The 2 Security Identity Questions */}
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Part 2: Personal Security Questions (2 Queries)
                      </p>

                      {/* Question 4: City */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          4. {t('securityCityQ')}
                        </label>
                        <input
                          type="text"
                          value={cityAnswer}
                          onChange={(e) => setCityAnswer(e.target.value)}
                          placeholder="e.g. Mumbai, New Delhi, Bengaluru"
                          className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Question 5: First School */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          5. {t('securitySchoolQ')}
                        </label>
                        <input
                          type="text"
                          value={schoolAnswer}
                          onChange={(e) => setSchoolAnswer(e.target.value)}
                          placeholder="e.g. St. Xavier's, Kendriya Vidyalaya"
                          className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {methodAError && (
                      <p className="text-xs sm:text-sm font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center gap-2">
                        <AlertTriangle size={16} /> {methodAError}
                      </p>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-2"
                      >
                        <CheckCircle2 size={18} />
                        <span>Validate All 5 Queries & Unlock</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm sm:text-base font-bold flex items-center gap-3">
                    <CheckCircle2 size={26} className="text-emerald-600 flex-shrink-0" />
                    <div>
                      <p>{t('answersValidatedMsg')}</p>
                      <p className="text-xs text-emerald-700 font-normal mt-0.5">
                        Both context queries and personal security identity questions have been validated. You can authorize the payment now.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Dialog Footer Action Bar */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-slate-500">
              {isFullyAuthorized ? (
                <span className="text-emerald-700 font-bold flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>High-Risk Clearance Granted via {isMethodAUnlocked ? 'Method A (5 Queries)' : 'Method B (Locked Nominee Approval)'}.</span>
                </span>
              ) : (
                <span className="flex items-center gap-2 text-slate-500 font-medium">
                  <Lock size={16} />
                  <span>Complete Method A or Method B above to unlock payment authorization.</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-bold transition-colors"
              >
                {t('cancelTransactionBtn')}
              </button>

              <button
                type="button"
                onClick={onProceed}
                disabled={!isFullyAuthorized}
                className={clsx(
                  'flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold shadow-lg transition-all',
                  isFullyAuthorized
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed',
                )}
              >
                <CheckCircle2 size={18} />
                <span>{t('proceedWithTransferBtn')}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
