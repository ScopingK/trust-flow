import type { RiskEvaluatePayload, RiskEvaluateResponse, RiskLevel } from '../types';

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Evaluate transaction risk based on exact amount-based thresholds:
 * - ₹0 to ₹1,000: Low Risk
 * - ₹1,001 to ₹10,000: Medium Risk
 * - Above ₹10,000: High Risk
 *
 * Simulator override (`forcedRiskLevel`) takes precedence when explicitly set.
 */
export async function evaluateRisk(
  payload: RiskEvaluatePayload,
  forcedRiskLevel?: RiskLevel | null,
): Promise<RiskEvaluateResponse> {
  await delay(900); // realistic evaluation latency

  // Simulator override takes full precedence
  if (forcedRiskLevel) {
    return buildMockResponse(forcedRiskLevel, payload);
  }

  // Exact Amount-Based Dynamic Risk Evaluation Engine
  const { amount } = payload;

  let riskLevel: RiskLevel;
  if (amount <= 1000) {
    riskLevel = 'LOW';
  } else if (amount <= 10000) {
    riskLevel = 'MEDIUM';
  } else {
    riskLevel = 'HIGH';
  }

  return buildMockResponse(riskLevel, payload);
}

function buildMockResponse(level: RiskLevel, payload: RiskEvaluatePayload): RiskEvaluateResponse {
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
