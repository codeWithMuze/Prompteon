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

        // Increment token version in metadata
        const newTokenVersion = (session.token_version || 0) + 1;

        const { error } = await supabaseAdmin.auth.admin.updateUserById(
            session.id,
            { user_metadata: { token_version: newTokenVersion } }
        );

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // Issue new tokens with updated version for THIS session only
        // All other sessions with old version will be invalid on next refresh attempt (logic needs to be in refresh route)
        const updatedUser = {
            ...session,
            token_version: newTokenVersion
        };

        const accessToken = await signToken(updatedUser, '15m');
        const refreshToken = await signToken({ sub: session.id, token_version: newTokenVersion }, '7d');

        await setAuthCookies(accessToken, refreshToken);

        return NextResponse.json({ message: 'Logged out of all other devices' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
