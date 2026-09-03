import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useTrustFlow } from '../../context/TrustFlowContext';
import { clsx } from 'clsx';

function JsonTree({ data, depth = 0 }: { data: unknown; depth?: number }) {
  const [collapsed, setCollapsed] = useState(depth > 1);

  if (data === null || data === undefined) {
    return <span className="text-slate-400">null</span>;
  }
  if (typeof data === 'boolean') {
    return <span className={data ? 'text-trust-green' : 'text-trust-red'}>{String(data)}</span>;
  }
  if (typeof data === 'number') {
    return <span className="text-trust-amber">{data}</span>;
  }
  if (typeof data === 'string') {
    return <span className="text-emerald-600">"{data}"</span>;
  }
  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-slate-400">[]</span>;
    return (
      <span>
        <button onClick={() => setCollapsed(c => !c)} className="text-slate-500 hover:text-trust-blue">
          {collapsed ? <ChevronRight size={12} className="inline" /> : <ChevronDown size={12} className="inline" />}
          <span className="text-slate-400">[{data.length}]</span>
        </button>
        {!collapsed && (
          <div className="pl-3 border-l border-slate-200 ml-1 mt-0.5 space-y-0.5">
            {data.map((item, i) => (
              <div key={i} className="flex items-start gap-1">
                <span className="text-slate-300 text-xs">{i}:</span>
                <JsonTree data={item} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </span>
    );
  }
  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) return <span className="text-slate-400">{'{}'}</span>;
    return (
      <span>
        <button onClick={() => setCollapsed(c => !c)} className="text-slate-500 hover:text-trust-blue">
          {collapsed ? <ChevronRight size={12} className="inline" /> : <ChevronDown size={12} className="inline" />}
          <span className="text-slate-400">{'{...}'}</span>
        </button>
        {!collapsed && (
          <div className="pl-3 border-l border-slate-200 ml-1 mt-0.5 space-y-0.5">
            {entries.map(([key, val]) => (
              <div key={key} className="flex items-start gap-1 flex-wrap">
                <span className="text-trust-blue font-medium text-xs">{key}:</span>
                <JsonTree data={val} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </span>
    );
  }
  return <span>{String(data)}</span>;
}

export function DebugPanel() {
  const { state } = useTrustFlow();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={clsx(
          'fixed bottom-6 right-4 z-50 flex items-center gap-1.5 px-3 py-2 rounded-full shadow-lg font-semibold text-xs transition-all',
          isOpen
            ? 'bg-trust-dark text-white'
            : 'bg-white text-trust-dark border border-slate-200 hover:border-trust-blue hover:text-trust-blue',
        )}
        aria-label="Toggle debug panel"
        aria-expanded={isOpen}
      >
        <Code2 size={14} />
        {isOpen ? 'Close' : 'Debug'}
      </button>

      {/* Slide-in Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-72 bg-slate-950 text-white z-50 shadow-2xl flex flex-col"
              role="complementary"
              aria-label="API Debug Panel"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Code2 size={16} className="text-trust-blue" />
                  <span className="font-bold text-sm">API Debug Panel</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-slate-800 transition-colors"
                  aria-label="Close debug panel"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Loading Indicator */}
              {state.apiLoading && (
                <div className="px-4 py-2 bg-trust-blue/10 border-b border-trust-blue/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-trust-blue animate-pulse" />
                    <span className="text-xs text-trust-blue font-medium">Request in flight...</span>
                  </div>
                </div>
              )}

              {/* Simulator State */}
              <div className="px-4 py-3 border-b border-slate-800 bg-slate-900">
                <p className="text-xs font-mono text-slate-500 mb-1">SIMULATOR STATE</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Forced Risk:</span>
                  <span className={clsx(
                    'text-xs font-bold px-2 py-0.5 rounded-full',
                    state.forcedRiskLevel === 'HIGH'   ? 'bg-trust-red text-white' :
                    state.forcedRiskLevel === 'MEDIUM' ? 'bg-trust-amber text-white' :
                    state.forcedRiskLevel === 'LOW'    ? 'bg-trust-green text-white' :
                    'bg-slate-700 text-slate-400',
                  )}>
                    {state.forcedRiskLevel ?? 'AUTO'}
                  </span>
                  <span className="text-xs text-slate-500">FlowStep: {state.flowStep}</span>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto font-mono text-xs space-y-0">
                {/* Request */}
                <div className="px-4 py-3 border-b border-slate-800">
                  <p className="text-slate-500 mb-2 font-sans font-semibold text-xs uppercase tracking-widest">→ Last Request</p>
                  {state.lastRequestPayload ? (
                    <div className="leading-relaxed">
                      <JsonTree data={state.lastRequestPayload} />
                    </div>
                  ) : (
                    <p className="text-slate-600 italic">No request yet</p>
                  )}
                </div>

                {/* Response */}
                <div className="px-4 py-3">
                  <p className="text-slate-500 mb-2 font-sans font-semibold text-xs uppercase tracking-widest">← Last Response</p>
                  {state.lastApiResponse ? (
                    <div className="leading-relaxed">
                      <JsonTree data={state.lastApiResponse} />
                    </div>
                  ) : (
                    <p className="text-slate-600 italic">No response yet</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-slate-800 bg-slate-900">
                <p className="text-slate-600 text-xs text-center">
                  TrustFlow Debug Panel · Mock API v1
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
