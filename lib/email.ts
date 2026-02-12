import nodemailer from 'nodemailer';

interface EmailResult {
    success: boolean;
    error?: string;
}

export async function sendEmail(to: string, subject: string, text: string): Promise<EmailResult> {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (user && pass) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user, pass }
            });

            await transporter.sendMail({
                from: `"Prompteon Security" <${user}>`,
                to,
                subject,
                text
            });

            console.log(`[Email] Sent to ${to}`);
            return { success: true };
        } catch (error: any) {
            console.error('[Email] Nodemailer Error:', error);
            // Return false to indicate failure, allowing UI to show error or fallback
            return { success: false, error: error.message };
        }
    }

    // Fallback: Console Log (Mock)
    console.log('------------------------------------------------');
    console.log(`[EMAIL MOCK] To: ${to}`);
    console.log(`[EMAIL MOCK] Subject: ${subject}`);
    console.log(`[EMAIL MOCK] Body: ${text}`);
    console.log('------------------------------------------------');

    return { success: true };
}
