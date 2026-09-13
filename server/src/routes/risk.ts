import { Router, Request, Response } from 'express';
import { evaluateRisk } from '../services/riskEngine';
import type { RiskEvaluatePayload } from '../types';

const router = Router();

/**
 * POST /api/v1/risk/evaluate
 *
 * Body:     { amount, recipientId, timestamp, deviceId, userAnswers }
 * Response: { riskLevel, riskScore, triggers, requireContextSurvey }
 */
router.post('/evaluate', (req: Request, res: Response): void => {
  try {
    const body = req.body as RiskEvaluatePayload;

    // ── Validation ──────────────────────────────────────────────────
    if (body.amount == null || typeof body.amount !== 'number' || body.amount <= 0) {
      res.status(400).json({ error: '`amount` must be a positive number.' });
      return;
    }
    if (!body.recipientId) {
      res.status(400).json({ error: '`recipientId` is required.' });
      return;
    }

    // ── Evaluate ────────────────────────────────────────────────────
    const result = evaluateRisk(body);

    res.status(200).json(result);
  } catch (err) {
    console.error('[risk/evaluate]', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
