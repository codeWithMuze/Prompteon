import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
    try {
        const { email, otp, newPassword } = await req.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        // 1. Find User
        // Again, iterating list is not scalable but works for this scope. 
        // In production, we'd use a robust search or direct DB query.
        const { data: { users }, error: searchError } = await supabaseAdmin.auth.admin.listUsers();
        if (searchError) return NextResponse.json({ error: 'Request failed' }, { status: 500 });

        const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
        if (!user) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

        // 2. Verify OTP
        const appMeta = user.app_metadata || {};
        const storedOtp = appMeta.reset_otp;
        const expiry = appMeta.reset_expiry;

        if (!storedOtp || !expiry) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        if (Date.now() > expiry) return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
        if (storedOtp !== otp) return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });

        // 3. Update Password & Clear OTP
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            {
                password: newPassword,
                app_metadata: {
                    reset_otp: null,
                    reset_expiry: null
                }
            }
        );

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Password reset successfully' });

    } catch (error: any) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
