import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthUser } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'trustflow-dev-secret-change-in-production';

/** Paths that do not require authentication. */
const PUBLIC_PATHS = ['/health', '/api/v1/auth/login'];

/**
 * JWT Bearer-token authentication middleware.
 *
 * Extracts the token from `Authorization: Bearer <token>`, verifies it,
 * and attaches the decoded user to `req.user`.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Skip auth for public endpoints
  if (PUBLIC_PATHS.some((p) => req.path === p)) {
    next();
    return;
  }

  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header.' });
    return;
  }

  const token = header.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

/**
 * Sign a JWT for a given user.
 */
export function signToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '8h' });
}
