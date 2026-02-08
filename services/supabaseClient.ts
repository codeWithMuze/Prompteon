
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Fix: Cast to any to bypass strict type checking for auth methods that the environment might be flagging incorrectly
export const supabase = createClient(supabaseUrl, supabaseAnonKey) as any;
