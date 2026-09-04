import { useState } from 'react';
import { Plus, ShieldCheck, Check, Banknote, Building2 } from 'lucide-react';
import { useTrustFlow } from '../../context/TrustFlowContext';
import { useTranslation } from '../../i18n';
import { AddPayeeModal } from './AddPayeeModal';
import { clsx } from 'clsx';
import type { Payee } from '../../types';

interface BeneficiaryListProps {
  onSelectPayee?: (payee: Payee) => void;
  selectable?: boolean;
  selectedId?: string;
  hideHeader?: boolean;
}

export function BeneficiaryList({
  onSelectPayee,
  selectable,
  selectedId,
  hideHeader,
}: BeneficiaryListProps) {
  const { state } = useTrustFlow();
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const lf = state.largeFontMode;

  return (
    <div className="space-y-4">
      {!hideHeader && (
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="min-w-0">
            <h3 className={clsx('font-black text-slate-900 tracking-tight', lf ? 'text-2xl' : 'text-xl sm:text-2xl')}>
              {t('beneficiariesTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate sm:overflow-visible sm:whitespace-normal">{t('beneficiariesDesc')}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95 flex-shrink-0"
          >
            <Plus size={16} />
            <span>{t('addPayeeBtn')}</span>
          </button>
        </div>
      )}

      {state.payees.length === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border border-slate-200/80">
          <Banknote size={44} className="mx-auto mb-2.5 opacity-30 text-slate-500" />
          <p className="text-sm font-medium">{t('noBeneficiaries')}</p>
        </div>
      ) : (
        <div
          className={clsx(
            'grid gap-3.5',
            selectable
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
          )}
        >
          {state.payees.map((payee) => {
            const isSelected = selectedId === payee.id;
            return (
              <button
                type="button"
                key={payee.id}
                onClick={() => onSelectPayee?.(payee)}
                className={clsx(
                  'w-full flex items-center gap-3.5 rounded-2xl p-4 border-2 text-left transition-all group',
                  selectable
                    ? isSelected
                      ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 hover:shadow-sm'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-md cursor-default',
                )}
                disabled={!selectable}
              >
                {/* Avatar with initial */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base flex-shrink-0 shadow-sm transition-transform group-hover:scale-105"
                  style={{ backgroundColor: payee.avatarColor || '#1E40AF' }}
                >
                  {payee.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={clsx('font-black text-slate-900 truncate', lf ? 'text-lg' : 'text-sm sm:text-base')}>
                      {payee.name}
                    </p>
                    {payee.isRbiVerified && (
                      <span title={t('rbiVerifiedBadge')}>
                        <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate font-semibold mt-0.5">
                    {payee.bankName}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                    <span>{payee.accountNumber}</span>
                    <span>•</span>
                    <span className="uppercase">{payee.ifscCode}</span>
                  </div>
                </div>

                {selectable && isSelected && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      <AddPayeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={(newPayee) => {
          setShowAddModal(false);
          onSelectPayee?.(newPayee);
        }}
      />
    </div>
  );
}
