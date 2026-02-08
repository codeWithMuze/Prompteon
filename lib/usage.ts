
import { supabaseServer } from './supabaseServer';

/**
 * Enforces daily usage limits for the user.
 * Boundary is strictly UTC 00:00:00.
 */
export const checkUsageLimitServer = async (userId: string, plan: string) => {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  // Query database using service role to prevent user tampering
  const { count, error } = await supabaseServer
    .from('prompts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfDay.toISOString());

  if (error) {
    console.error('Usage verification failure:', error);
    throw new Error('Credit verification service unavailable.');
  }

  const currentUsage = count || 0;

  // Plan-based logic: Free = 3/day, Pro = Unlimited
  if (plan !== 'pro' && currentUsage >= 3) {
    return { 
      allowed: false, 
      message: "Today's credits are over. Use Pro version to get unlimited prompt usage." 
    };
  }

  return { allowed: true, currentUsage };
};

export const saveResultServer = async (userId: string, original: string, improved: string, score: number) => {
  const { error } = await supabaseServer
    .from('prompts')
    .insert([{ 
      user_id: userId, 
      original_prompt: original, 
      improved_prompt: improved, 
      score 
    }]);
  
  if (error) {
    console.error('Server Persistence Error:', error);
  }
};
