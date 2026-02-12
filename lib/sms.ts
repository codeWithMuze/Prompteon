import twilio from 'twilio';

interface SmsResult {
    success: boolean;
    error?: string;
}

export async function sendSms(to: string, message: string): Promise<SmsResult> {
    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    // 1. Try Fast2SMS (Preferred for India if key exists)
    if (fast2smsKey) {
        try {
            console.log(`[SMS] Sending via Fast2SMS to ${to}...`);
            const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
                method: 'POST',
                headers: {
                    'authorization': fast2smsKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "route": "otp",
                    "variables_values": message.replace(/\D/g, ''), // Extract OTP from message if using route 'otp'
                    "numbers": to.replace('+91', '') // Fast2SMS often expects 10 digits for India
                })
            });

            const data = await response.json();
            if (data.return) {
                return { success: true };
            } else {
                console.error('[SMS] Fast2SMS Error:', data);
                return { success: false, error: data.message };
            }
        } catch (error: any) {
            console.error('[SMS] Fast2SMS Exception:', error);
            // Fallthrough to next provider or fail
        }
    }

    // 2. Try Twilio
    if (twilioSid && twilioToken && twilioPhone) {
        try {
            console.log(`[SMS] Sending via Twilio to ${to}...`);
            const client = twilio(twilioSid, twilioToken);
            await client.messages.create({
                body: message,
                from: twilioPhone,
                to: to
            });
            return { success: true };
        } catch (error: any) {
            console.error('[SMS] Twilio Exception:', error);
            return { success: false, error: error.message };
        }
    }

    // 3. Fallback: Console Log (Mock)
    console.log('------------------------------------------------');
    console.log(`[SMS MOCK] To: ${to}`);
    console.log(`[SMS MOCK] Message: ${message}`);
    console.log('------------------------------------------------');

    // Return true for mock to allow flow testing
    return { success: true };
}
