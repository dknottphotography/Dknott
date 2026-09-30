import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hpdzehxsxvvfvbskgnrd.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwZHplaHhzeHZ2ZnZic2tnbnJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE3OTU4MSwiZXhwIjoyMDk5NzU1NTgxfQ.i_xpo7xyrAKMzLg77pbtoWtw_JQ5OsrG6PkUGd8BD0Q';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function testList() {
    const { data, error } = await supabase.storage.from('wedding-images').list('ANUHYA ABHINAV');
    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
}

testList();
