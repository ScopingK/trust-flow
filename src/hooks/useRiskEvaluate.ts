import { useState } from 'react';
import { evaluateRisk } from '../api/riskApi';
import { useTrustFlow } from '../context/TrustFlowContext';
import type { RiskEvaluatePayload, RiskEvaluateResponse } from '../types';

export function useRiskEvaluate() {
  const { state, dispatch } = useTrustFlow();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskEvaluateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const evaluate = async (payload: RiskEvaluatePayload) => {
    setLoading(true);
    setError(null);

    dispatch({ type: 'SET_API_LOADING', payload: true });
    dispatch({ type: 'SET_REQUEST_PAYLOAD', payload });

    try {
      const response = await evaluateRisk(payload, state.forcedRiskLevel);
      setResult(response);
      dispatch({ type: 'SET_RISK_RESULT', payload: response });
      dispatch({ type: 'SET_API_RESPONSE', payload: response });

      // Log into live telemetry security log
      dispatch({
        type: 'ADD_SECURITY_LOG',
        payload: {
          id: `log-${Date.now()}`,
          timestamp: 'Just now',
          action: `Risk Evaluated: ${response.riskLevel} (${response.riskScore}/100)`,
          details: `₹${payload.amount.toLocaleString('en-IN')} evaluation completed with ${response.triggers.length} triggers.`,
          riskLevel: response.riskLevel,
          riskScore: response.riskScore,
        },
      });

      // Flow step routing based on exact amount-based risk level
      if (response.riskLevel === 'LOW') {
        dispatch({ type: 'SET_FLOW_STEP', payload: 'LOW_CONFIRM' });
      } else if (response.riskLevel === 'MEDIUM') {
        dispatch({ type: 'SET_FLOW_STEP', payload: 'MEDIUM_CONFIRM' });
      } else {
        dispatch({ type: 'SET_FLOW_STEP', payload: 'HIGH_PAUSE' });
      }

      return response;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Risk evaluation failed.';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
      dispatch({ type: 'SET_API_LOADING', payload: false });
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { evaluate, loading, result, error, reset };
}
