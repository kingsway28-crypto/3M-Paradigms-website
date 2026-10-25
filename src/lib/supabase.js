import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey && !supabaseUrl.includes('YOUR_PROJECT_ID') && !supabaseKey.includes('YOUR_PUBLISHABLE'));

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;
