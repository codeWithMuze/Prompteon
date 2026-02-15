import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSession } from '../../../../lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const {
            original_prompt,
            improved_prompt,
            score,
            score_breakdown,
            model,
            duration_ms,
            status
        } = body;

        // Validation
        if (!original_prompt || !improved_prompt) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('prompts')
            .insert([
                {
                    user_id: session.id,
                    original_prompt,
                    improved_prompt,
                    score,
                    score_breakdown: score_breakdown || null,
                    model: model || 'gpt-4',
                    duration_ms: duration_ms || 0,
                    status: status || 'success'
                }
            ]);

        if (error) {
            console.error('Save history error:', error);
            return NextResponse.json({ error: 'Failed to save history' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
