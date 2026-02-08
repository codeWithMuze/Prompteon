
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase Server Client: Missing URL or Service Role Key in environment.");
}

/**
 * Server-only administrative client.
 * Bypasses RLS for mission-critical usage counting and plan verification.
 * This file is never imported on the client side.
 */
// Fix: Cast to any to bypass strict type checking for auth methods on the server client
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
}) as any;
