import type { PayeeVerifyPayload, PayeeVerifyResponse } from '../types';

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

/**
 * Verify a payee against simulated RBI records.
 *
 * Rules (mirroring the frontend mock):
 *   • Invalid IFSC format → error
 *   • Account '000000000000' → not found
 *   • Otherwise → verified, with a minor name variation
 */
export function verifyPayee(payload: PayeeVerifyPayload): PayeeVerifyResponse {
  const { accountNumber, ifscCode, beneficiaryName } = payload;

  // 1. IFSC format check
  if (!IFSC_REGEX.test(ifscCode)) {
    return {
      isVerified: false,
      rbiMatchedName: '',
      error: 'Invalid IFSC code format. Please check and retry.',
    };
  }

  // 2. Test account-not-found sentinel
  if (accountNumber === '000000000000') {
    return {
      isVerified: false,
      rbiMatchedName: '',
      error: 'Account number not found in RBI records.',
    };
  }

  // 3. Normal verification — produce a minor name variation
  const normalizedName = beneficiaryName.trim().toUpperCase();
  const rbiMatchedName = normalizedName.split(' ').reverse().join(' ');

  return {
    isVerified: true,
    rbiMatchedName,
    error: null,
  };
}
