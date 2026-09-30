import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf-8');
const lines = envFile.split('\n');
let SUPABASE_URL = '';
let SUPABASE_ANON_KEY = '';

for (const line of lines) {
    if (line.startsWith('VITE_SUPABASE_URL=')) SUPABASE_URL = line.split('=')[1].trim();
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) SUPABASE_ANON_KEY = line.split('=')[1].trim();
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testFetch() {
    console.log("Testing fetch for ANUHYA ABHINAV");
    const baseFolder = "ANUHYA ABHINAV";
    const { data, error } = await supabase.storage.from('wedding-images').list(baseFolder, { limit: 10 });
    
    if (error) {
        console.error("Error fetching root:", error);
        return;
    }
    
    console.log("Root data:", data);
    
    if (data && data.length > 0) {
        for (const item of data) {
            if (!item.id && item.name !== '.emptyFolderPlaceholder') {
                console.log(`Found folder: ${item.name}, fetching contents...`);
                const { data: subData, error: subError } = await supabase.storage.from('wedding-images').list(`${baseFolder}/${item.name}`, { limit: 5 });
                console.log(`Subfolder ${item.name} data:`, subData);
                if (subError) console.error(subError);
            }
        }
    }
}

testFetch();
