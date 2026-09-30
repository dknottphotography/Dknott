import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://hpdzehxsxvvfvbskgnrd.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwZHplaHhzeHZ2ZnZic2tnbnJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE3OTU4MSwiZXhwIjoyMDk5NzU1NTgxfQ.i_xpo7xyrAKMzLg77pbtoWtw_JQ5OsrG6PkUGd8BD0Q';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const BUCKET_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/wedding-images/`;

function getFirstImageRecursive(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            const img = getFirstImageRecursive(filePath);
            if (img) return img;
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                return filePath;
            }
        }
    }
    return null;
}

async function insertWeddings() {
    const baseDir = path.join(process.cwd(), 'public', 'img');
    const folders = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

    console.log(`Found ${folders.length} wedding folders. Inserting into database...`);

    for (const folder of folders) {
        const folderPath = path.join(baseDir, folder);
        const firstImagePath = getFirstImageRecursive(folderPath);
        
        if (firstImagePath) {
            let relativePath = path.relative(baseDir, firstImagePath).replace(/\\/g, '/');
            // Encode the path for URL
            let encodedPath = relativePath.split('/').map(segment => encodeURIComponent(segment)).join('/');
            const fullUrl = BUCKET_BASE_URL + encodedPath;
            
            // Format title (e.g. "ANUHYA ABHINAV" -> "Anuhya & Abhinav")
            let title = folder.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' & ');

            console.log(`Inserting: ${title}`);
            const { error } = await supabase.from('real_weddings').insert([{
                title: title,
                location: 'India',
                tags: 'traditional',
                description: 'A beautiful wedding story captured by Dknott.',
                cover_image_url: fullUrl
            }]);

            if (error) {
                console.error(`Error inserting ${title}:`, error);
            }
        } else {
            console.log(`No images found for ${folder}`);
        }
    }
    
    console.log("Database population complete!");
}

insertWeddings();
