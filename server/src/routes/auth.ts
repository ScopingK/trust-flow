import { Router, Request, Response } from 'express';
import { authenticate } from '../services/authService';
import type { LoginRequest } from '../types';

const router = Router();

/**
 * POST /api/v1/auth/login
 *
 * Body:     { customerId, password }
 * Response: { token, user: { name, account, balance } }
 */
router.post('/login', (req: Request, res: Response): void => {
  try {
    const body = req.body as LoginRequest;

    if (!body.customerId || !body.password) {
      res.status(400).json({ error: 'Missing fields. Expected: customerId, password.' });
      return;
    }

    const result = authenticate(body);

    if (!result) {
      res.status(401).json({ error: 'Invalid Customer ID or Password.' });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    console.error('[auth/login]', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
