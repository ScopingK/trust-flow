import { Router, Request, Response } from 'express';
import { sendAlert } from '../services/alertService';
import type { AlertPayload } from '../types';

const router = Router();

/**
 * POST /api/v1/alerts/nominee
 *
 * Body:     { recipient, userName, amount, payeeName, fraudHelpline? }
 * Response: { success, channel, recipient, message, timestamp, error? }
 */
router.post('/nominee', async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as AlertPayload;

    if (!body.recipient || !body.userName || body.amount == null || !body.payeeName) {
      res.status(400).json({
        error: 'Missing fields. Expected: recipient, userName, amount, payeeName.',
      });
      return;
    }

    const result = await sendAlert(body);

    res.status(200).json(result);
  } catch (err) {
    console.error('[alerts/nominee]', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
