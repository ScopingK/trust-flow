import { ArrowUpRight, ArrowDownLeft, Send, Clock, Wallet, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTrustFlow } from '../../context/TrustFlowContext';
import { useTranslation } from '../../i18n';
import { clsx } from 'clsx';

const STATUS_CONFIGS = {
  SUCCESS: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  PENDING: { bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  FAILED: { bg: 'bg-rose-50 text-rose-800 border-rose-200', dot: 'bg-rose-500' },
};

const RISK_BADGES = {
  LOW: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  MEDIUM: 'bg-amber-100 text-amber-800 border-amber-200',
  HIGH: 'bg-rose-100 text-rose-800 border-rose-200',
};

interface AccountOverviewProps {
  onOpenTransfer: () => void;
}

export function AccountOverview({ onOpenTransfer }: AccountOverviewProps) {
  const { state } = useTrustFlow();
  const { t } = useTranslation();
  const { transactions, availableBalance, userAccount, userName, largeFontMode } = state;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner Hero: Balance & Transfer Action Card */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 lg:p-10 text-white shadow-xl border border-slate-800/90 relative overflow-hidden">
        {/* Subtle decorative background gradients */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 lg:gap-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5">
              <Wallet size={15} className="text-blue-400" />
              <span>{t('availableBalance')}</span>
              <span className="text-slate-600">•</span>
              <span>A/C: {userAccount}</span>
              <span className="text-slate-600">•</span>
              <span className="text-blue-300">{userName}</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-400">₹</span>
              <span className={clsx('font-black tracking-tight text-white', largeFontMode ? 'text-5xl sm:text-6xl' : 'text-4xl sm:text-5xl')}>
                {availableBalance.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/70 px-3.5 py-1.5 rounded-full border border-emerald-800/70 font-semibold shadow-sm">
                <ArrowDownLeft size={15} />
                <span>+₹12,000 {t('monthlyCredit')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-300 bg-rose-950/70 px-3.5 py-1.5 rounded-full border border-rose-800/70 font-semibold shadow-sm">
                <ArrowUpRight size={15} />
                <span>-₹8,400 {t('monthlyDebit')}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300 bg-white/10 px-3 py-1.5 rounded-full font-medium">
                <ShieldCheck size={14} className="text-blue-400" />
                <span>RBI Settlement Clearance Active</span>
              </div>
            </div>
          </div>

          {/* Transfer Button */}
          <div className="flex-shrink-0">
            <button
              onClick={onOpenTransfer}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-5 rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-blue-600/30 transition-all active:scale-95 hover:shadow-blue-500/40"
            >
              <Send size={20} />
              <span>{t('sendMoneyCta')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions Desktop Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className={clsx('font-black text-slate-900 tracking-tight', largeFontMode ? 'text-2xl' : 'text-xl sm:text-2xl')}>
              {t('recentTransactionsTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Live ledger audited by TrustFlow Fraud Interception Engine
            </p>
          </div>
          <button className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline">
            {t('viewAll')}
          </button>
        </div>

        {transactions.length === 0 ? (
          <p className="text-sm text-slate-400 py-10 text-center font-medium">{t('noTransactions')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="pb-3.5 font-bold">Beneficiary Name</th>
                  <th className="pb-3.5 font-bold">Execution Date</th>
                  <th className="pb-3.5 font-bold">TrustFlow Risk Bracket</th>
                  <th className="pb-3.5 font-bold text-right">Settled Amount</th>
                  <th className="pb-3.5 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.slice(0, 6).map((tx) => {
                  const statusCfg = STATUS_CONFIGS[tx.status] || STATUS_CONFIGS.SUCCESS;
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-700 flex items-center justify-center font-black text-xs transition-colors flex-shrink-0 shadow-inner">
                            {tx.payeeName.charAt(0)}
                          </div>
                          <span className="truncate max-w-[180px] sm:max-w-xs">{tx.payeeName}</span>
                        </div>
                      </td>
                      <td className="py-4 text-slate-500 font-medium text-xs sm:text-sm">
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-slate-400" />
                          <span>{tx.date}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={clsx('px-3 py-1 rounded-full text-xs font-bold border', RISK_BADGES[tx.riskLevel])}>
                          {tx.riskLevel} RISK
                        </span>
                      </td>
                      <td className="py-4 text-right font-black text-slate-900 text-base">
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 text-right">
                        <span className={clsx('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border', statusCfg.bg)}>
                          <span className={clsx('w-1.5 h-1.5 rounded-full', statusCfg.dot)} />
                          <span>
                            {tx.status === 'SUCCESS' ? t('statusSuccess') : tx.status === 'PENDING' ? t('statusPending') : t('statusFailed')}
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
