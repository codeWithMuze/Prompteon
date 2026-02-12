import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../../../lib/auth';
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

        const { password, otp } = await req.json();

        if (!password || password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        if (!otp) {
            return NextResponse.json({ error: 'OTP is required' }, { status: 400 });
        }

        // Verify OTP
        const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(session.id);
        if (userError || !user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const appMeta = user.app_metadata || {};
        const storedOtp = appMeta.email_otp_code;
        const expiry = appMeta.email_otp_expiry;

        if (!storedOtp || !expiry) return NextResponse.json({ error: 'No OTP requested' }, { status: 400 });
        if (Date.now() > expiry) return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
        if (storedOtp !== otp) return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });

        // Update Password & Clear OTP
        const { error } = await supabaseAdmin.auth.admin.updateUserById(
            session.id,
            {
                password,
                app_metadata: {
                    email_otp_code: null,
                    email_otp_expiry: null
                }
            }
        );

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Password updated successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
