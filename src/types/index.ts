// ─── Risk & Payee API Types ───────────────────────────────────────────────────

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type Language  = 'en' | 'hi' | 'ta';

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

// ─── Domain Models ────────────────────────────────────────────────────────────

export interface Payee {
  id: string;
  name: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  isRbiVerified: boolean;
  rbiMatchedName: string;
  addedAt: string;
  avatarColor: string;
}

export interface Transaction {
  id: string;
  payeeName: string;
  amount: number;
  date: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  riskLevel: RiskLevel;
}

export interface TrustedContact {
  name: string;
  phone: string; // E.164 format e.g. +919876543210
  relation: string;
}

export interface SecurityActivityLogItem {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  riskLevel: RiskLevel;
  riskScore?: number;
}

// ─── App State Types ──────────────────────────────────────────────────────────

export type FlowStep =
  | 'IDLE'
  | 'ENTER_AMOUNT'
  | 'RISK_EVALUATING'
  | 'LOW_CONFIRM'
  | 'MEDIUM_CONFIRM'
  | 'HIGH_PAUSE'
  | 'HIGH_OPTION_A'
  | 'HIGH_OPTION_B'
  | 'SUCCESS';

export interface TrustFlowState {
  // Current logged in user
  userName: string;
  userAccount: string;
  availableBalance: number;

  // Simulator
  forcedRiskLevel: RiskLevel | null;

  // Payees
  payees: Payee[];
  selectedPayee: Payee | null;

  // Transfer Flow
  transferAmount: number;
  flowStep: FlowStep;
  currentRiskResult: RiskEvaluateResponse | null;

  // High Risk Verification state
  securityQuestionsAnswered: boolean;
  nomineeApproved: boolean;
  nomineeStatus: 'IDLE' | 'SENDING' | 'SENT' | 'APPROVED';

  // Last API activity (for debug panel)
  lastRequestPayload: object | null;
  lastApiResponse: object | null;
  apiLoading: boolean;

  // User preferences
  language: Language;
  largeFontMode: boolean;
  trustedContact: TrustedContact | null;
  onboardingDone: boolean;

  // Authentication Gate
  isAuthenticated: boolean;

  // Transactions & Security Activity Log
  transactions: Transaction[];
  securityLog: SecurityActivityLogItem[];
}

export type TrustFlowAction =
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'SET_FORCED_RISK_LEVEL'; payload: RiskLevel | null }
  | { type: 'ADD_PAYEE'; payload: Payee }
  | { type: 'SELECT_PAYEE'; payload: Payee | null }
  | { type: 'SET_AMOUNT'; payload: number }
  | { type: 'SET_FLOW_STEP'; payload: FlowStep }
  | { type: 'SET_RISK_RESULT'; payload: RiskEvaluateResponse | null }
  | { type: 'SET_REQUEST_PAYLOAD'; payload: object }
  | { type: 'SET_API_RESPONSE'; payload: object }
  | { type: 'SET_API_LOADING'; payload: boolean }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'TOGGLE_LARGE_FONT' }
  | { type: 'SET_TRUSTED_CONTACT'; payload: TrustedContact }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_SECURITY_LOG'; payload: SecurityActivityLogItem }
  | { type: 'SET_SECURITY_QUESTIONS_ANSWERED'; payload: boolean }
  | { type: 'SET_NOMINEE_STATUS'; payload: 'IDLE' | 'SENDING' | 'SENT' | 'APPROVED' }
  | { type: 'RESET_FLOW' };
