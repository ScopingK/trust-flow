import { useState } from 'react';
import { verifyPayee } from '../api/payeeApi';
import { useTrustFlow } from '../context/TrustFlowContext';
import type { PayeeVerifyPayload, PayeeVerifyResponse } from '../types';

export function usePayeeVerify() {
  const { dispatch }                 = useTrustFlow();
  const [loading, setLoading]        = useState(false);
  const [result,  setResult]         = useState<PayeeVerifyResponse | null>(null);
  const [error,   setError]          = useState<string | null>(null);

  const verify = async (payload: PayeeVerifyPayload) => {
    setLoading(true);
    setError(null);
    setResult(null);

    dispatch({ type: 'SET_API_LOADING',       payload: true });
    dispatch({ type: 'SET_REQUEST_PAYLOAD',   payload: payload });

    try {
      const response = await verifyPayee(payload);
      setResult(response);
      dispatch({ type: 'SET_API_RESPONSE', payload: response });

      if (!response.isVerified && response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
      dispatch({ type: 'SET_API_LOADING', payload: false });
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { verify, loading, result, error, reset };
}
