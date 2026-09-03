import type { PayeeVerifyPayload, PayeeVerifyResponse } from '../types';

/** Simulated network delay (ms) */
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Verify a payee against RBI records.
 *
 * TO SWITCH TO REAL BACKEND:
 *   1. Import `apiClient` from './client'
 *   2. Replace mock body with:
 *      const { data } = await apiClient.post<PayeeVerifyResponse>('/api/v1/payee/verify', payload);
 *      return data;
 *
 * Contract: POST /api/v1/payee/verify
 *   Payload:  { accountNumber, ifscCode, beneficiaryName }
 *   Response: { isVerified: boolean, rbiMatchedName: string, error: string | null }
 */
export async function verifyPayee(payload: PayeeVerifyPayload): Promise<PayeeVerifyResponse> {
  // ── MOCK IMPLEMENTATION ────────────────────────────────────────────────────
  await delay(1800); // Realistic RBI lookup latency

  const { accountNumber, ifscCode, beneficiaryName } = payload;

  // Simulate invalid IFSC
  if (!ifscCode.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) {
    return {
      isVerified:     false,
      rbiMatchedName: '',
      error:          'Invalid IFSC code format. Please check and retry.',
    };
  }

  // Simulate account not found for specific test number
  if (accountNumber === '000000000000') {
    return {
      isVerified:     false,
      rbiMatchedName: '',
      error:          'Account number not found in RBI records.',
    };
  }

  // Simulate name mismatch warning
  const normalizedName = beneficiaryName.trim().toUpperCase();
  const mockRbiName    = normalizedName.split(' ').reverse().join(' '); // minor variation

  return {
    isVerified:     true,
    rbiMatchedName: mockRbiName,
    error:          null,
  };
  // ── END MOCK ───────────────────────────────────────────────────────────────
}
