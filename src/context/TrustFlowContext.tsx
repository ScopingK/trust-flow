import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type {
  TrustFlowState,
  TrustFlowAction,
  Payee,
  Transaction,
  SecurityActivityLogItem,
} from '../types';

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_PAYEES: Payee[] = [
  {
    id: 'p1',
    name: 'Ramesh Kumar',
    nameLocalized: { en: 'Ramesh Kumar', hi: 'रमेश कुमार', ta: 'ரமேஷ் குமார்' },
    accountNumber: '****4521',
    ifscCode: 'SBIN0001234',
    bankName: 'State Bank of India',
    bankNameLocalized: { en: 'State Bank of India', hi: 'भारतीय स्टेट बैंक', ta: 'ஸ்டேட் பேங்க் ஆஃப் இந்தியா' },
    isRbiVerified: true,
    rbiMatchedName: 'KUMAR RAMESH',
    addedAt: '2024-08-01',
    avatarColor: '#1E40AF',
  },
  {
    id: 'p2',
    name: 'Priya Sharma',
    nameLocalized: { en: 'Priya Sharma', hi: 'प्रिया शर्मा', ta: 'பிரியா சர்மா' },
    accountNumber: '****8843',
    ifscCode: 'HDFC0002345',
    bankName: 'HDFC Bank',
    bankNameLocalized: { en: 'HDFC Bank', hi: 'एचडीएफसी बैंक', ta: 'எச்டிஎஃப்சி வங்கி' },
    isRbiVerified: true,
    rbiMatchedName: 'SHARMA PRIYA',
    addedAt: '2024-09-15',
    avatarColor: '#15803D',
  },
  {
    id: 'p3',
    name: 'Anand Electronics Pvt Ltd',
    nameLocalized: { en: 'Anand Electronics Pvt Ltd', hi: 'आनंद इलेक्ट्रॉनिक्स प्राइवेट लिमिटेड', ta: 'ஆனந்த் எலக்ட்ரானிக்ஸ் பிரைவேட் லிமிடெட்' },
    accountNumber: '****1199',
    ifscCode: 'ICIC0003456',
    bankName: 'ICICI Bank',
    bankNameLocalized: { en: 'ICICI Bank', hi: 'आईसीआईसीआई बैंक', ta: 'ஐசிஐசிஐ வங்கி' },
    isRbiVerified: true,
    rbiMatchedName: 'ANAND ELECTRONICS PVT LTD',
    addedAt: '2024-10-20',
    avatarColor: '#D97706',
  },
];

const SEED_TRANSACTIONS: Transaction[] = [
  { id: 't1', payeeName: 'Ramesh Kumar', payeeNameLocalized: { en: 'Ramesh Kumar', hi: 'रमेश कुमार', ta: 'ரமேஷ் குமார்' }, amount: 850, date: '2024-11-01', status: 'SUCCESS', riskLevel: 'LOW' },
  { id: 't2', payeeName: 'Priya Sharma', payeeNameLocalized: { en: 'Priya Sharma', hi: 'प्रिया शर्मा', ta: 'பிரியா சர்மா' }, amount: 4500, date: '2024-10-28', status: 'SUCCESS', riskLevel: 'MEDIUM' },
  { id: 't3', payeeName: 'Anand Electronics', payeeNameLocalized: { en: 'Anand Electronics', hi: 'आनंद इलेक्ट्रॉनिक्स', ta: 'ஆனந்த் எலக்ட்ரானிக்ஸ்' }, amount: 35000, date: '2024-10-15', status: 'SUCCESS', riskLevel: 'HIGH' },
  { id: 't4', payeeName: 'Suspicious Merchant', payeeNameLocalized: { en: 'Suspicious Merchant', hi: 'संदिग्ध व्यापारी', ta: 'சந்தேகத்திற்குரிய வணிகர்' }, amount: 65000, date: '2024-10-10', status: 'FAILED', riskLevel: 'HIGH' },
];

const SEED_LOG: SecurityActivityLogItem[] = [
  {
    id: 'log-1',
    timestamp: 'Just now',
    action: 'Session Initialization',
    details: 'Neural Anti-Fraud telemetry engaged. Device integrity validated.',
    riskLevel: 'LOW',
    riskScore: 5,
  },
  {
    id: 'log-2',
    timestamp: '2 mins ago',
    action: 'Payee Verification',
    details: 'RBI clearing registry verified 3 active beneficiaries.',
    riskLevel: 'LOW',
    riskScore: 10,
  },
  {
    id: 'log-3',
    timestamp: '15 mins ago',
    action: 'Threshold Check',
    details: 'Enforcing active risk brackets: Low (≤₹1k), Med (≤₹10k), High (>₹10k)',
    riskLevel: 'LOW',
    riskScore: 12,
  },
];

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: TrustFlowState = {
  userName: 'Vikram Sharma',
  userAccount: 'XXXX XXXX 7823',
  availableBalance: 248500,

  forcedRiskLevel: null,
  payees: SEED_PAYEES,
  selectedPayee: null,
  transferAmount: 0,
  flowStep: 'IDLE',
  currentRiskResult: null,

  securityQuestionsAnswered: false,
  nomineeApproved: false,
  nomineeStatus: 'IDLE',

  lastRequestPayload: null,
  lastApiResponse: null,
  apiLoading: false,

  language: 'en', // 100% English by default
  largeFontMode: false,
  trustedContact: {
    name: 'Ramesh Kumar',
    phone: '+91 98765 43212',
    relation: 'Son',
  },
  onboardingDone: true, // Default true so user can start right away, can still configure
  isAuthenticated: false, // Default unauthenticated for Login Gateway

  transactions: SEED_TRANSACTIONS,
  securityLog: SEED_LOG,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: TrustFlowState, action: TrustFlowAction): TrustFlowState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, flowStep: 'IDLE' };
    case 'SET_FORCED_RISK_LEVEL':
      return { ...state, forcedRiskLevel: action.payload };
    case 'ADD_PAYEE':
      return {
        ...state,
        payees: [action.payload, ...state.payees],
        securityLog: [
          {
            id: `log-${Date.now()}`,
            timestamp: 'Just now',
            action: 'Beneficiary Registered',
            details: `New payee "${action.payload.name}" validated via RBI registry (${action.payload.ifscCode}).`,
            riskLevel: 'LOW',
            riskScore: 10,
          },
          ...state.securityLog,
        ],
      };
    case 'SELECT_PAYEE':
      return { ...state, selectedPayee: action.payload };
    case 'SET_AMOUNT':
      return { ...state, transferAmount: action.payload };
    case 'SET_FLOW_STEP':
      return { ...state, flowStep: action.payload };
    case 'SET_RISK_RESULT':
      return { ...state, currentRiskResult: action.payload };
    case 'SET_REQUEST_PAYLOAD':
      return { ...state, lastRequestPayload: action.payload };
    case 'SET_API_RESPONSE':
      return { ...state, lastApiResponse: action.payload };
    case 'SET_API_LOADING':
      return { ...state, apiLoading: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'TOGGLE_LARGE_FONT':
      return { ...state, largeFontMode: !state.largeFontMode };
    case 'SET_TRUSTED_CONTACT':
      return { ...state, trustedContact: action.payload };
    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingDone: true };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        availableBalance: Math.max(0, state.availableBalance - action.payload.amount),
        securityLog: [
          {
            id: `log-${Date.now()}`,
            timestamp: 'Just now',
            action: `Transfer Cleared: ₹${action.payload.amount.toLocaleString('en-IN')}`,
            details: `Transfer to ${action.payload.payeeName} finalized under ${action.payload.riskLevel} risk protocols.`,
            riskLevel: action.payload.riskLevel,
          },
          ...state.securityLog,
        ],
      };
    case 'ADD_SECURITY_LOG':
      return {
        ...state,
        securityLog: [action.payload, ...state.securityLog.slice(0, 24)],
      };
    case 'SET_SECURITY_QUESTIONS_ANSWERED':
      return { ...state, securityQuestionsAnswered: action.payload };
    case 'SET_NOMINEE_STATUS':
      return {
        ...state,
        nomineeStatus: action.payload,
        nomineeApproved: action.payload === 'APPROVED',
      };
    case 'RESET_FLOW':
      return {
        ...state,
        flowStep: 'IDLE',
        selectedPayee: null,
        transferAmount: 0,
        currentRiskResult: null,
        securityQuestionsAnswered: false,
        nomineeApproved: false,
        nomineeStatus: 'IDLE',
      };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface TrustFlowContextValue {
  state: TrustFlowState;
  dispatch: React.Dispatch<TrustFlowAction>;
}

const TrustFlowContext = createContext<TrustFlowContextValue | undefined>(undefined);

export function TrustFlowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <TrustFlowContext.Provider value={{ state, dispatch }}>
      {children}
    </TrustFlowContext.Provider>
  );
}

export function useTrustFlow() {
  const ctx = useContext(TrustFlowContext);
  if (!ctx) throw new Error('useTrustFlow must be used within TrustFlowProvider');
  return ctx;
}
