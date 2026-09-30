import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://hpdzehxsxvvfvbskgnrd.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwZHplaHhzeHZ2ZnZic2tnbnJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE3OTU4MSwiZXhwIjoyMDk5NzU1NTgxfQ.i_xpo7xyrAKMzLg77pbtoWtw_JQ5OsrG6PkUGd8BD0Q';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function getFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fileList = getFilesRecursively(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

async function uploadImages() {
  const bucketName = 'wedding-images';
  const baseDir = path.join(process.cwd(), 'public', 'img');
  
  if (!fs.existsSync(baseDir)) {
      console.error("The public/img directory does not exist!");
      return;
  }
  
  const allFiles = getFilesRecursively(baseDir);
  const imageFiles = allFiles.filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });
  
  console.log(`Found ${imageFiles.length} valid image files. Starting upload...`);
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const filePath = imageFiles[i];
    let relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/');
    
    // Ignore files larger than 45MB
    const stats = fs.statSync(filePath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    
    if (fileSizeInMB > 45) {
        console.log(`[${i+1}/${imageFiles.length}] Skipping ${relativePath} (File too large: ${fileSizeInMB.toFixed(2)}MB)`);
        skipCount++;
        continue;
    }

    console.log(`[${i+1}/${imageFiles.length}] Attempting to upload ${relativePath}...`);
    
    const fileBuffer = fs.readFileSync(filePath);
    let contentType = 'image/jpeg';
    const lowerPath = filePath.toLowerCase();
    if (lowerPath.endsWith('.png')) contentType = 'image/png';
    else if (lowerPath.endsWith('.webp')) contentType = 'image/webp';
    
    try {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(relativePath, fileBuffer, {
            contentType: contentType,
            upsert: false // Returns error if exists, which is faster than overwriting
          });
          
        if (error) {
          if (error.statusCode === '409' || error.message.includes('Duplicate')) {
              console.log(` -> Already exists, skipping.`);
              skipCount++;
          } else {
              console.error(` -> Failed to upload:`, error.message);
              errorCount++;
          }
        } else {
          console.log(` -> Successfully uploaded!`);
          successCount++;
        }
    } catch (e) {
        console.error(` -> Network/Timeout error:`, e.message);
        errorCount++;
    }
  }
  
  console.log(`\\n--- UPLOAD SUMMARY ---`);
  console.log(`New files uploaded: ${successCount}`);
  console.log(`Already existed / Skipped: ${skipCount}`);
  console.log(`Errors (Likely Network Timeouts): ${errorCount}`);
}

uploadImages();
