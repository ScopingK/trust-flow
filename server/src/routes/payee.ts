import { Router, Request, Response } from 'express';
import { verifyPayee } from '../services/payeeService';
import type { PayeeVerifyPayload } from '../types';

const router = Router();

/**
 * POST /api/v1/payee/verify
 *
 * Body:     { accountNumber, ifscCode, beneficiaryName }
 * Response: { isVerified, rbiMatchedName, error }
 */
router.post('/verify', (req: Request, res: Response): void => {
  try {
    const body = req.body as PayeeVerifyPayload;

    // ── Validation ──────────────────────────────────────────────────
    if (!body.accountNumber || !body.ifscCode || !body.beneficiaryName) {
      res.status(400).json({
        error: 'Missing fields. Expected: accountNumber, ifscCode, beneficiaryName.',
      });
      return;
    }

    // ── Verify ──────────────────────────────────────────────────────
    const result = verifyPayee(body);

    res.status(200).json(result);
  } catch (err) {
    console.error('[payee/verify]', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
