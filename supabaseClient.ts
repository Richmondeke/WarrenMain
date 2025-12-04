import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
const supabaseUrl = process.env.SUPABASE_URL || 'https://gngfdrhmlcdpzppktnpz.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZ2ZkcmhtbGNkcHpwcGt0bnB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTM5MTEsImV4cCI6MjA1OTQyOTkxMX0._8zvImpi8t0-oSZn61O3qczHMupDK7dpp0I41HZIlUs';

// If credentials are provided, create the real client.
// Otherwise, we export a null client which our data service will detect and fallback to mocks.
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;