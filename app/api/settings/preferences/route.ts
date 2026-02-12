import { NextRequest, NextResponse } from 'next/server';
import { getSession, signToken, setAuthCookies } from '../../../../lib/auth';
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

        const preferences = await req.json();

        // 1. Update Supabase User Metadata using Admin
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
            session.id,
            { user_metadata: { preferences } }
        );

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // 2. Refresh Session Tokens to include new preferences
        const updatedUser = {
            ...session,
            preferences
        };

        const accessToken = await signToken(updatedUser, '15m');
        const refreshToken = await signToken({ sub: session.id, token_version: session.token_version }, '7d');

        await setAuthCookies(accessToken, refreshToken);

        return NextResponse.json({ user: updatedUser, message: 'Preferences saved' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
