import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hpdzehxsxvvfvbskgnrd.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'dummy'; // We need the anon key. 

// Wait, I can just fetch it from the src/lib/supabaseClient.js file if I run this script in the browser context, or I can read the .env file
