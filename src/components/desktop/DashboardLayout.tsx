import { type ReactNode } from 'react';
import { TopNav } from './TopNav';
import { SecurityActivityLog } from './SecurityActivityLog';
import { RiskGauge } from './RiskGauge';
import { useTrustFlow } from '../../context/TrustFlowContext';
import { useTranslation } from '../../i18n';
import { ShieldCheck, PhoneCall, AlertOctagon, HeartHandshake } from 'lucide-react';
import { clsx } from 'clsx';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { state } = useTrustFlow();
  const { t } = useTranslation();
  const { trustedContact, largeFontMode } = state;

  return (
    <div className={clsx('min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white', largeFontMode && 'text-lg')}>
      {/* Fixed Desktop Top Navigation Bar */}
      <TopNav />

      {/* Main Container: Spacious 2-Column Desktop Grid Layout (1024px+ screen resolutions) */}
      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column (8 cols): Primary Banking Controls, Overview, Payees */}
          <div className="lg:col-span-8 space-y-8">
            {children}
          </div>

          {/* Right Column (4 cols, Sticky): Live TrustFlow Security Activity Log, Risk Gauge & Helpline */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Live Visual Risk Gauge */}
            <RiskGauge />

            {/* Live Security Intelligence Activity Log */}
            <SecurityActivityLog />

            {/* Quick Emergency Assistance Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-850 rounded-3xl p-5 border border-slate-800 text-white shadow-md space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span>24x7 Fraud Protection</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold">Registered Safety Nominee</p>
                  <p className="text-xs font-bold text-slate-200 mt-0.5">{trustedContact?.name || 'Ananya Sharma'}</p>
                  <p className="text-[10px] font-mono text-blue-400">{trustedContact?.phone || '+91 98765 43210'}</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <HeartHandshake size={16} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <PhoneCall size={15} className="text-rose-400" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold">National Cyber Fraud Helpline</p>
                    <p className="text-xs font-black text-rose-300">Dial 1930 (Toll Free)</p>
                  </div>
                </div>
                <a
                  href="tel:1930"
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition-all shadow-sm active:scale-95"
                >
                  Call 1930
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
