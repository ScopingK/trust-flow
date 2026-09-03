import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Phone, User, ChevronRight, X } from 'lucide-react';
import { useTrustFlow } from '../../context/TrustFlowContext';
import { useTranslation } from '../../i18n';
import { clsx } from 'clsx';

const RELATIONS = ['Son / Daughter', 'Spouse', 'Sibling', 'Close Advisor', 'Other'];

export function OnboardingModal() {
  const { state, dispatch } = useTrustFlow();
  const { t } = useTranslation();
  const [step, setStep] = useState(0); // 0 = intro, 1 = contact form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState(RELATIONS[0]);
  const lf = state.largeFontMode;

  if (state.onboardingDone) return null;

  const handleSave = () => {
    if (!name || !phone) return;
    const formatted = phone.startsWith('+91') ? phone : `+91 ${phone.replace(/^0/, '')}`;
    dispatch({ type: 'SET_TRUSTED_CONTACT', payload: { name, phone: formatted, relation } });
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  };

  const handleSkip = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 z-10"
          role="dialog"
          aria-modal="true"
        >
          {step === 0 ? (
            /* Step 0: Intro */
            <div className="p-8 text-center space-y-5">
              <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-3xl flex items-center justify-center mx-auto text-blue-600 shadow-md">
                <ShieldCheck size={44} />
              </div>

              <div>
                <h1 className={clsx('font-black text-slate-900', lf ? 'text-3xl' : 'text-2xl')}>
                  {t('onboardingWelcomeTitle')}
                </h1>
                <p className="text-xs font-semibold text-blue-600 mt-1 uppercase tracking-wider">
                  {t('onboardingWelcomeSub')}
                </p>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  {t('onboardingDesc')}
                </p>
              </div>

              <div className="pt-3 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <User size={18} />
                  <span>{t('setupNomineeBtn')}</span>
                  <ChevronRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-full text-slate-400 hover:text-slate-600 py-2 text-xs font-semibold transition-colors"
                >
                  {t('skipOnboardingBtn')}
                </button>
              </div>
            </div>
          ) : (
            /* Step 1: Nominee Setup Form */
            <div className="p-8 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className={clsx('font-bold text-slate-900', lf ? 'text-2xl' : 'text-lg')}>
                    {t('nomineeSetupTitle')}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{t('nomineeSetupSub')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t('nomineeNameLabel')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('nomineeNamePlaceholder')}
                    className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t('nomineePhoneLabel')}
                  </label>
                  <div className="flex gap-2">
                    <div className="px-3.5 py-3 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 flex items-center">
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      className="flex-1 text-sm px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none transition-colors font-mono"
                      maxLength={10}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t('nomineeRelationLabel')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {RELATIONS.map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setRelation(r)}
                        className={clsx(
                          'px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all',
                          relation === r
                            ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!name || phone.length < 10}
                  className={clsx(
                    'w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm shadow-md transition-all mt-2',
                    !name || phone.length < 10
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95',
                  )}
                >
                  <Phone size={16} />
                  <span>{t('saveNomineeBtn')}</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
