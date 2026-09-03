import { useState } from 'react';
import { useTrustFlow } from './context/TrustFlowContext';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardLayout } from './components/desktop/DashboardLayout';
import { AccountOverview } from './components/shell/AccountOverview';
import { BeneficiaryList } from './components/payee/BeneficiaryList';
import { TransferModal } from './components/transfer/TransferModal';
import { SimulatorBar } from './components/simulator/SimulatorBar';
import { DebugPanel } from './components/debug/DebugPanel';
import { OnboardingModal } from './components/onboarding/OnboardingModal';

export default function App() {
  const { state } = useTrustFlow();
  const [transferOpen, setTransferOpen] = useState(false);

  // Authentication Gate: Render ONLY the TrustFlow Login Gateway if not authenticated
  if (!state.isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      {/* Dev Simulator Bar pinned at the top */}
      <SimulatorBar />

      {/* Desktop-Optimized Two-Column Dashboard (1024px+ layout) */}
      <DashboardLayout>
        {/* Account Balance & Recent Transactions */}
        <AccountOverview onOpenTransfer={() => setTransferOpen(true)} />

        {/* Registered Payees & Beneficiaries Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <BeneficiaryList />
        </div>
      </DashboardLayout>

      {/* Modals & Overlays */}
      <TransferModal isOpen={transferOpen} onClose={() => setTransferOpen(false)} />
      <OnboardingModal />
      <DebugPanel />
    </>
  );
}
