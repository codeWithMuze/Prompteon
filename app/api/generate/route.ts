import { NextResponse } from 'next/server';
import { analyzePromptServer } from '@/lib/gemini';
import { checkUsageLimitServer, saveResultServer } from '@/lib/usage';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    let userId = 'anonymous';
    let plan = 'free';

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
        const { data: profile } = await supabaseServer
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single();
        plan = profile?.plan || 'free';
      }
    }

    const body = await req.json();
    const prompt = body.prompt?.trim();
    const mode = body.mode;

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Input is empty.' }, { status: 400 });
    }

    // Usage check for logged-in users
    if (userId !== 'anonymous') {
      const usage = await checkUsageLimitServer(userId, plan);
      if (!usage.allowed) {
        return NextResponse.json({ success: false, error: usage.message }, { status: 403 });
      }
    }

    const result = await analyzePromptServer(prompt, mode);

    if (userId !== 'anonymous') {
      await saveResultServer(userId, prompt, result.improvedPrompt, result.score);
    }

    return NextResponse.json({ success: true, data: result });

  } catch (error: any) {
    console.error('API_ERROR:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'The Neural Bridge is currently overloaded. Please retry.' 
    }, { status: 500 });
  }
}