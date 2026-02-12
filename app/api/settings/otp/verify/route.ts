import { NextRequest, NextResponse } from 'next/server';
import { getSession, signToken, setAuthCookies } from '../../../../../lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { phone, otp } = await req.json();

        if (!phone || !otp) {
            return NextResponse.json({ error: 'Phone and OTP are required' }, { status: 400 });
        }

        // Get User Data (including app_metadata)
        const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(session.id);

        if (userError || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const appMeta = user.app_metadata || {};
        const storedOtp = appMeta.otp_code;
        const expiry = appMeta.otp_expiry;
        const pendingPhone = appMeta.pending_phone;

        // Validation
        if (!storedOtp || !expiry || !pendingPhone) {
            return NextResponse.json({ error: 'No pending verification found' }, { status: 400 });
        }

        if (Date.now() > expiry) {
            return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
        }

        if (pendingPhone !== phone) {
            return NextResponse.json({ error: 'Phone number mismatch' }, { status: 400 });
        }

        if (storedOtp !== otp) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        // Determine if verification fields exist in user_metadata or if we need to create them.
        // The prompt asked to "extend existing schema". Supabase user_metadata is JSON, so we just add fields.

        // SUCCESS: Update User
        // 1. Set ROOT phone number
        // 2. Set phone_confirm: true (marks as verified in Supabase)
        // 3. Clear OTP fields from app_metadata

        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            session.id,
            {
                phone: phone,
                phone_confirm: true, // Mark as verified in Supabase
                user_metadata: {
                    phone: null, // Clear from metadata
                    phone_verified: true // Keep UI flag but clear the number
                },
                app_metadata: {
                    phone_verified: true,
                    otp_code: null,
                    otp_expiry: null,
                    pending_phone: null
                }
            }
        );

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        // Refresh Session
        const updatedUser = {
            ...session,
            phone,
            phone_verified: true
        };

        const accessToken = await signToken(updatedUser, '15m');
        const refreshToken = await signToken({ sub: session.id, token_version: session.token_version }, '7d'); // Keep version same

        await setAuthCookies(accessToken, refreshToken);

        return NextResponse.json({ message: 'Phone verified successfully' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
