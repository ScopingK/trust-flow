import type { RiskEvaluatePayload, RiskEvaluateResponse, RiskLevel } from '../types';

/**
 * Deterministic risk-scoring engine matching the frontend thresholds:
 *
 *   amount ≤  1 000  → LOW    (score ~12, 0 triggers)
 *   amount ≤ 10 000  → MEDIUM (score ~54, 2 triggers)
 *   amount > 10 000  → HIGH   (score ~92, 3 triggers, requireContextSurvey)
 */
export function evaluateRisk(payload: RiskEvaluatePayload): RiskEvaluateResponse {
  const { amount } = payload;
  const formattedAmount = `₹${amount.toLocaleString('en-IN')}`;

  let riskLevel: RiskLevel;
  let riskScore: number;
  let triggers: string[];
  let requireContextSurvey: boolean;

  if (amount <= 1_000) {
    riskLevel = 'LOW';
    riskScore = 12;
    triggers = [];
    requireContextSurvey = false;
  } else if (amount <= 10_000) {
    riskLevel = 'MEDIUM';
    riskScore = 54;
    triggers = [
      `Transaction value (${formattedAmount}) falls into elevated medium-risk band`,
      'Routine behavioral velocity deviation detected',
    ];
    requireContextSurvey = false;
  } else {
    riskLevel = 'HIGH';
    riskScore = 92;
    triggers = [
      `High-value transfer exceeding ₹10,000 threshold (${formattedAmount})`,
      'Mandatory protective pause triggered under RBI Anti-Coercion guidelines',
      'Requires personal security verification or nominee concurrence',
    ];
    requireContextSurvey = true;
  }

  return { riskLevel, riskScore, triggers, requireContextSurvey };
}
