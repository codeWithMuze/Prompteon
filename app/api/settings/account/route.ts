import { NextRequest, NextResponse } from 'next/server';
import { getSession, clearAuthCookies } from '../../../../lib/auth';
import { createClient } from '@supabase/supabase-js';

// Need Service Role Key to delete users usually, avoiding exposing it here.
// For this simulation, we'll assume we can delete self or mark as deleted in metadata.
// To fully implement deletion, we would use strict RLS or an admin function.
// Here we will use the client-side user deletion if allowed, or simulated soft delete.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Anon key might not have delete permission
const supabase = createClient(supabaseUrl, supabaseKey);

export async function DELETE(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Mark as deleted in metadata (Soft Delete)
        const { error } = await supabase.auth.updateUser({
            data: { deleted_at: new Date().toISOString() }
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // Clear cookies
        await clearAuthCookies();

        return NextResponse.json({ message: 'Account scheduled for deletion' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
