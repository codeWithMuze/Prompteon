import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../../../lib/auth';
import { createClient } from '@supabase/supabase-js';
import { sendSms } from '../../../../../lib/sms';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Simple in-memory rate limiting (for demo/MVP purposes). 
// In production, use Redis or a database table.
const rateLimit = new Map<string, { count: number, lastTime: number }>();

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
        }

        // Rate Limiting Logic
        const now = Date.now();
        const userRate = rateLimit.get(session.id) || { count: 0, lastTime: now };

        if (now - userRate.lastTime > 600000) { // Reset every 10 mins
            userRate.count = 0;
            userRate.lastTime = now;
        }

        if (userRate.count >= 3) {
            return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
        }

        userRate.count++;
        rateLimit.set(session.id, userRate);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        // In a real app, HASH this OTP before storing. 
        // For this demo, we store it in app_metadata which is secure from user access.

        // Update User App Metadata with OTP details
        const { error } = await supabaseAdmin.auth.admin.updateUserById(
            session.id,
            {
                user_metadata: {
                    // We don't verify the phone yet, just store pending state
                },
                app_metadata: {
                    otp_code: otp, // Ideally hashed
                    otp_expiry: expiresAt,
                    pending_phone: phone
                }
            }
        );

        if (error) {
            console.error('Supabase OTP Error:', error);
            return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 });
        }

        // Send SMS
        const message = `Your Prompteon authentication code is ${otp}. Do not share this code with anyone.`;
        const smsResult = await sendSms(phone, message);

        if (!smsResult.success) {
            return NextResponse.json({ error: 'Failed to send SMS: ' + smsResult.error }, { status: 500 });
        }

        return NextResponse.json({ message: 'OTP sent successfully', expiresAt });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
