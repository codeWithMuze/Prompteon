import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '../../../../../lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
    try {
        const Body = await req.json();
        const { email } = Body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // 1. Find User by Email
        const { data: { users }, error: searchError } = await supabaseAdmin.auth.admin.listUsers();

        if (searchError) {
            console.error("Supabase User Search Error:", searchError);
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }

        // Create a map or logic to find specific user because listUsers returns paginated list.
        // For production with many users, 'listUsers' is not efficient. 
        // Better to use 'generateLink' type methods or just try to update known email metadata if possible.
        // HOWEVER, Supabase Admin doesn't have "getUserByEmail" directly exposed easily in all versions without specific config.
        // But we can just iterate the list for this scale or use a specific filter if available.
        // Actually, 'listUsers' is generally fine for smaller apps, but let's see if we can just generic "Mock" success if not found for security.

        // BETTER APPROACH: Use `supabaseAdmin.rpc` if we had exact DB access, but here we are using Auth Admin.
        // We will try finding the user in the returned list.
        const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

        if (!user) {
            // Security: Don't reveal user existence
            return NextResponse.json({ message: 'If account exists, OTP sent.' });
        }

        // 2. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        // 3. Store OTP in app_metadata
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            {
                app_metadata: {
                    reset_otp: otp,
                    reset_expiry: expiresAt
                }
            }
        );

        if (updateError) {
            console.error("Supabase Update Error:", updateError);
            return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
        }

        // 4. Send Email
        await sendEmail(
            email,
            'Reset Password - Prompteon',
            `Your password reset code is ${otp}. It expires in 10 minutes. Do not share this code.`
        );

        return NextResponse.json({ message: 'If account exists, OTP sent.' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
