import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../../../../lib/auth';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '../../../../../../lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Simple rate limit
const rateLimit = new Map<string, { count: number, lastTime: number }>();

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate Limiting
        const now = Date.now();
        const userId = session.id as string;
        const userEmail = session.email as string;

        const userRate = rateLimit.get(userId) || { count: 0, lastTime: now };
        if (now - userRate.lastTime > 600000) { // 10 mins
            userRate.count = 0;
            userRate.lastTime = now;
        }
        if (userRate.count >= 3) {
            return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
        }
        userRate.count++;
        rateLimit.set(userId, userRate);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Store in app_metadata
        const { error } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            {
                app_metadata: {
                    email_otp_code: otp,
                    email_otp_expiry: expiresAt
                }
            }
        );

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Send Email
        const emailResult = await sendEmail(
            userEmail,
            'Verify Password Change - Prompteon',
            `Your verification code is ${otp}. Use this to confirm your password change requests. Do not share this code.`
        );

        if (!emailResult.success) {
            return NextResponse.json({ error: 'Failed to send email: ' + emailResult.error }, { status: 500 });
        }

        return NextResponse.json({ message: 'OTP sent to your email', expiresAt });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
