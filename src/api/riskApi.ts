import apiClient from './client';
import type { RiskEvaluatePayload, RiskEvaluateResponse, RiskLevel } from '../types';

/**
 * Client-side mock for simulator override.
 * When `forcedRiskLevel` is set in the SimulatorBar, we bypass the backend
 * and return a deterministic response — matching the original mock behaviour.
 */
function buildSimulatorResponse(level: RiskLevel, payload: RiskEvaluatePayload): RiskEvaluateResponse {
  const configs: Record<RiskLevel, RiskEvaluateResponse> = {
    LOW: {
      riskLevel: 'LOW',
      riskScore: 12,
      triggers: [],
      requireContextSurvey: false,
    },
    MEDIUM: {
      riskLevel: 'MEDIUM',
      riskScore: 54,
      triggers: [
        'Transaction value (₹' + payload.amount.toLocaleString('en-IN') + ') falls into elevated medium-risk band',
        'Routine behavioral velocity deviation detected',
      ],
      requireContextSurvey: false,
    },
    HIGH: {
      riskLevel: 'HIGH',
      riskScore: 92,
      triggers: [
        'High-value transfer exceeding ₹10,000 threshold (₹' + payload.amount.toLocaleString('en-IN') + ')',
        'Mandatory protective pause triggered under RBI Anti-Coercion guidelines',
        'Requires personal security verification or nominee concurrence',
      ],
      requireContextSurvey: true,
    },
  };

  return configs[level];
}

/**
 * Evaluate transaction risk.
 *
 * • If `forcedRiskLevel` is set (SimulatorBar override) → returns mock instantly.
 * • Otherwise → hits the real backend at POST /api/v1/risk/evaluate.
 */
export async function evaluateRisk(
  payload: RiskEvaluatePayload,
  forcedRiskLevel?: RiskLevel | null,
): Promise<RiskEvaluateResponse> {
  // Simulator override takes full precedence (client-side only)
  if (forcedRiskLevel) {
    return buildSimulatorResponse(forcedRiskLevel, payload);
  }

  const { data } = await apiClient.post<RiskEvaluateResponse>('/api/v1/risk/evaluate', payload);
  return data;
}
