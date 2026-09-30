import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';


const SUPABASE_URL = 'https://hpdzehxsxvvfvbskgnrd.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwZHplaHhzeHZ2ZnZic2tnbnJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE3OTU4MSwiZXhwIjoyMDk5NzU1NTgxfQ.i_xpo7xyrAKMzLg77pbtoWtw_JQ5OsrG6PkUGd8BD0Q';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function uploadImages() {
  const bucketName = 'website-images';
  
  // 1. Create Bucket
  console.log(`Checking if bucket '${bucketName}' exists...`);
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError);
    return;
  }
  
  const bucketExists = buckets.some(b => b.name === bucketName);
  
  if (!bucketExists) {
    console.log(`Creating public bucket '${bucketName}'...`);
    const { data, error } = await supabase.storage.createBucket(bucketName, { public: true });
    if (error) {
      console.error('Error creating bucket:', error);
      return;
    }
    console.log('Bucket created successfully!');
  } else {
    console.log('Bucket already exists.');
  }

  // 2. Read local images
  const imgDir = path.join(process.cwd(), 'public', 'img');
  const files = fs.readdirSync(imgDir);
  
  for (const file of files) {
    const filePath = path.join(imgDir, file);
    if (fs.statSync(filePath).isFile()) {
      console.log(`Uploading ${file}...`);
      
      const fileBuffer = fs.readFileSync(filePath);
      let contentType = 'image/jpeg';
      if (file.endsWith('.png')) contentType = 'image/png';
      else if (file.endsWith('.svg')) contentType = 'image/svg+xml';
      else if (file.endsWith('.gif')) contentType = 'image/gif';
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(file, fileBuffer, {
          contentType: contentType,
          upsert: true
        });
        
      if (error) {
        console.error(`Failed to upload ${file}:`, error);
      } else {
        console.log(`Successfully uploaded ${file}`);
      }
    }
  }
  
  console.log('All uploads finished!');
}

uploadImages();
