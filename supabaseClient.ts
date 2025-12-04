import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

// If credentials are provided, create the real client.
// Otherwise, we export a null client which our data service will detect and fallback to mocks.
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;
