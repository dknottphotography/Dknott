import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hpdzehxsxvvfvbskgnrd.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwZHplaHhzeHZ2ZnZic2tnbnJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE3OTU4MSwiZXhwIjoyMDk5NzU1NTgxfQ.i_xpo7xyrAKMzLg77pbtoWtw_JQ5OsrG6PkUGd8BD0Q';
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const BUCKET = 'wedding-images';

async function getFirstImageRecursive(folderPath) {
    const { data, error } = await supabase.storage.from(BUCKET).list(folderPath, { limit: 100 });
    if (error || !data) return null;

    for (const item of data) {
        if (!item.id) { // it's a folder
            const imgPath = await getFirstImageRecursive(`${folderPath}/${item.name}`);
            if (imgPath) return imgPath;
        } else {
            const ext = item.name.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
                return `${folderPath}/${item.name}`;
            }
        }
    }
    return null;
}

async function fixCovers() {
    console.log("Fetching weddings from DB...");
    const { data: weddings, error: dbError } = await supabase.from('real_weddings').select('*');
    if (dbError) { console.error(dbError); return; }

    const { data: folders, error: storageError } = await supabase.storage.from(BUCKET).list('');
    if (storageError) { console.error(storageError); return; }
    
    for (const wedding of weddings) {
        // Find matching folder
        // "Anuhya & Abhinav" -> "ANUHYA ABHINAV" or "ANUHYA & ABHINAV"
        let possibleFolderName = wedding.title.toUpperCase().replace(/ & /g, ' ');
        // Special case for Pooja Sai Charan where there was an ampersand locally but not in DB
        if (wedding.title === 'Pooja Sai Charan') possibleFolderName = 'POOJA SAI CHARAN';
        
        let actualFolder = folders.find(f => f.name.toUpperCase() === possibleFolderName);
        if (!actualFolder) {
            // Try matching without ampersand
            actualFolder = folders.find(f => f.name.toUpperCase().replace(/ & /g, ' ') === possibleFolderName);
        }

        if (actualFolder) {
            console.log(`Found folder for ${wedding.title}: ${actualFolder.name}`);
            const firstImage = await getFirstImageRecursive(actualFolder.name);
            
            if (firstImage) {
                // Construct public URL
                const encodedPath = firstImage.split('/').map(segment => encodeURIComponent(segment)).join('/');
                const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodedPath}`;
                
                console.log(` -> Updating cover to: ${publicUrl}`);
                const { error: updateError } = await supabase.from('real_weddings').update({ cover_image_url: publicUrl }).eq('id', wedding.id);
                if (updateError) console.error("Error updating:", updateError);
            } else {
                console.log(` -> No images found inside folder.`);
            }
        } else {
            console.log(`Could not find folder for ${wedding.title}`);
        }
    }
    console.log("Done fixing covers!");
}

fixCovers();
