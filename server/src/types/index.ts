// ─── Risk API ───────────────────────────────────────────────────────────────

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RiskEvaluatePayload {
  amount: number;
  recipientId: string;
  timestamp: string;
  deviceId: string;
  userAnswers: boolean[];
}

export interface RiskEvaluateResponse {
  riskLevel: RiskLevel;
  riskScore: number;
  triggers: string[];
  requireContextSurvey: boolean;
}

// ─── Payee API ──────────────────────────────────────────────────────────────

export interface PayeeVerifyPayload {
  accountNumber: string;
  ifscCode: string;
  beneficiaryName: string;
}

export interface PayeeVerifyResponse {
  isVerified: boolean;
  rbiMatchedName: string;
  error: string | null;
}

// ─── Auth API ───────────────────────────────────────────────────────────────

export interface LoginRequest {
  customerId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    name: string;
    account: string;
    balance: number;
  };
}

// ─── Alert API ──────────────────────────────────────────────────────────────

export interface AlertPayload {
  recipient: string;
  userName: string;
  amount: number;
  payeeName: string;
  fraudHelpline?: string;
}

export interface AlertResult {
  success: boolean;
  channel: 'SMS' | 'EMAIL';
  recipient: string;
  message: string;
  timestamp: string;
  error?: string;
}

// ─── Express augmentation ───────────────────────────────────────────────────

export interface AuthUser {
  customerId: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
