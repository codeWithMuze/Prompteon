import { NextRequest, NextResponse } from 'next/server';
import { getSession, signToken, setAuthCookies } from '../../../../lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use Service Role Key for Admin actions
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, email, phone } = await req.json();

        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        // Get current data to check if phone changed
        const { data: { user }, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(session.id);

        if (getUserError || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const currentPhone = user.user_metadata.phone;
        const phoneChanged = phone && phone !== currentPhone;

        const updates: any = {
            email: email !== session.email ? email : undefined,
            phone: phoneChanged ? phone : undefined, // Update root phone if changed
            user_metadata: { name } // Phone removed from metadata
        };

        if (phoneChanged) {
            // If updating root phone, Supabase auto-sets phone_confirmed_at to null 
            // unless we pass phone_confirm: true (which we don't want yet).
            // We also update our custom flags for UI consistency.
            updates.user_metadata.phone_verified = false;
            updates.app_metadata = { phone_verified: false };
        }

        // 1. Update Supabase User using Admin Client
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
            session.id,
            updates
        );

        if (error) {
            console.error("Supabase Update Error:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // 2. Refresh Session Tokens with new data
        const updatedUser = {
            ...session,
            name,
            email,
            phone,
            phone_verified: phoneChanged ? false : session.phone_verified
        };

        const accessToken = await signToken(updatedUser, '15m');
        const refreshToken = await signToken({ sub: session.id, token_version: session.token_version }, '7d');

        await setAuthCookies(accessToken, refreshToken);

        return NextResponse.json({ user: updatedUser, message: 'Profile updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
