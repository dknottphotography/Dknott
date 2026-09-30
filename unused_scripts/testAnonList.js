import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hpdzehxsxvvfvbskgnrd.supabase.co';
// Use the ANON KEY!
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwZHplaHhzeHZ2ZnZic2tnbnJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNzk1ODEsImV4cCI6MjA5OTc1NTU4MX0.r4wWMwyJ3hk8nyeD037cfxZ6Jguzb7jEjgLM31EhhLQ';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function testAnonList() {
    const { data, error } = await supabase.storage.from('wedding-images').list('ELLEN YASHWANTH');
    if (error) console.error("Error:", error);
    else console.log("Anon List Data:", data);
}

testAnonList();
