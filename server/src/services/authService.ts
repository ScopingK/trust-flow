import type { LoginRequest, LoginResponse, AuthUser } from '../types';
import { signToken } from '../middleware/auth';

/**
 * Demo user store.
 * In production, swap with a proper database lookup + bcrypt password hashing.
 */
const DEMO_USERS: Record<string, { password: string; name: string; account: string; balance: number }> = {
  user123: {
    password: 'trustflow2026',
    name: 'Vikram Sharma',
    account: 'XXXX XXXX 7823',
    balance: 248_500,
  },
};

/**
 * Authenticate a user and return a signed JWT + profile.
 * Returns `null` if credentials are invalid.
 */
export function authenticate(req: LoginRequest): LoginResponse | null {
  const record = DEMO_USERS[req.customerId];

  if (!record || record.password !== req.password) {
    return null;
  }

  const authUser: AuthUser = { customerId: req.customerId, name: record.name };
  const token = signToken(authUser);

  return {
    token,
    user: {
      name: record.name,
      account: record.account,
      balance: record.balance,
    },
  };
}
