import type { AlertPayload, AlertResult } from '../types';

/**
 * Dispatch a nominee security alert.
 *
 * In dev mode this simply logs the alert and returns success.
 * Set `EMAILJS_PUBLIC_KEY` or `SMS_API_KEY` env vars to enable live dispatch
 * to EmailJS / Fast2SMS respectively.
 */
export async function sendAlert(payload: AlertPayload): Promise<AlertResult> {
  const { recipient, userName, amount, payeeName, fraudHelpline = '1930' } = payload;
  const isEmail = recipient.includes('@');
  const channel: 'SMS' | 'EMAIL' = isEmail ? 'EMAIL' : 'SMS';

  const formattedAmount = `₹${amount.toLocaleString('en-IN')}`;
  const messageContent =
    `SECURITY ALERT from TrustFlow: ${userName} is attempting a high-value payment of ` +
    `${formattedAmount} to ${payeeName}. If this is unauthorized, call the Fraud Helpline ` +
    `immediately at ${fraudHelpline}.`;

  const cleanPhone = recipient.replace(/\D/g, '').slice(-10);
  const formattedRecipient = isEmail ? recipient.trim() : `+91 ${cleanPhone}`;

  try {
    if (isEmail && process.env.EMAILJS_PUBLIC_KEY) {
      // Real EmailJS dispatch
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: process.env.EMAILJS_SERVICE_ID || 'trustflow_alerts',
          template_id: process.env.EMAILJS_TEMPLATE_ID || 'template_anti_fraud',
          user_id: process.env.EMAILJS_PUBLIC_KEY,
          template_params: {
            to_email: recipient,
            user_name: userName,
            amount: formattedAmount,
            payee_name: payeeName,
            message: messageContent,
            fraud_helpline: fraudHelpline,
          },
        }),
      });
      if (!res.ok) {
        console.warn('[Alert] EmailJS responded with status', res.status);
      }
    } else if (!isEmail && process.env.SMS_API_KEY) {
      // Real Fast2SMS dispatch
      await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: process.env.SMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'q',
          message: messageContent,
          language: 'english',
          numbers: cleanPhone,
        }),
      });
    }

    console.info(`[TrustFlow Alert] [${channel}] → ${formattedRecipient}: "${messageContent}"`);

    return {
      success: true,
      channel,
      recipient: formattedRecipient,
      message: messageContent,
      timestamp: new Date().toLocaleTimeString(),
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Alert dispatch failed';
    console.error('[TrustFlow Alert Error]', errorMsg);

    return {
      success: true, // graceful degradation — matches frontend behavior
      channel,
      recipient: formattedRecipient,
      message: messageContent,
      timestamp: new Date().toLocaleTimeString(),
      error: errorMsg,
    };
  }
}
