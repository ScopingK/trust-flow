import apiClient from './client';
import type { PayeeVerifyPayload, PayeeVerifyResponse } from '../types';

/**
 * Verify a payee against RBI records via the backend.
 *
 * Contract: POST /api/v1/payee/verify
 *   Payload:  { accountNumber, ifscCode, beneficiaryName }
 *   Response: { isVerified: boolean, rbiMatchedName: string, error: string | null }
 */
export async function verifyPayee(payload: PayeeVerifyPayload): Promise<PayeeVerifyResponse> {
  const { data } = await apiClient.post<PayeeVerifyResponse>('/api/v1/payee/verify', payload);
  return data;
}
