import { NextRequest, NextResponse } from 'next/server';
import { signToken, setAuthCookies } from '../../../../lib/auth';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Note: In a real production app, use server-side Supabase client with SERVICE_ROLE key for admin tasks if needed.
// Here we use the public client to verify credentials.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        // 1. Verify credentials against Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data.user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 2. Generate our own secure tokens
        const user = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata.name,
            plan: data.user.user_metadata.plan || 'free',
        };

        // Sign Access Token (15m)
        const accessToken = await signToken(user, '15m');

        // Sign Refresh Token (7d)
        const refreshToken = await signToken({ sub: user.id }, '7d');

        // 3. Set HTTP-only cookies
        await setAuthCookies(accessToken, refreshToken);

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
