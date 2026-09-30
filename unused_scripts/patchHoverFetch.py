import re

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/Home.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_fetch = """    async function fetchImages() {
      try {
         const titleParts = wedding.title.split('&').map(s => s.trim().toUpperCase());
         const baseFolder = titleParts.join(' ');
         const { data: subfolders } = await supabase.storage.from('wedding-images').list(baseFolder);
         if (subfolders && subfolders.length > 0) {
            const validSubfolder = subfolders.find(s => s.name !== '.emptyFolderPlaceholder');
            if (validSubfolder) {
                const { data: files } = await supabase.storage.from('wedding-images').list(`${baseFolder}/${validSubfolder.name}`);
                if (files && files.length > 0) {
                    const urls = files.filter(f => f.name.toLowerCase().endsWith('.jpg') || f.name.toLowerCase().endsWith('.jpeg') || f.name.toLowerCase().endsWith('.png'))
                        .map(f => supabase.storage.from('wedding-images').getPublicUrl(`${baseFolder}/${validSubfolder.name}/${f.name}`).data.publicUrl);
                    
                    if (urls.length > 0) {
                        setImages([wedding.cover_image_url, ...urls.slice(0, 4)]);
                    }
                }
            }
         }
      } catch (e) {}
    }"""

new_fetch = """    async function fetchImages() {
      try {
         const titleParts = wedding.title.split('&').map(s => s.trim().toUpperCase());
         const baseFolder = titleParts.join(' ');
         const { data } = await supabase.storage.from('wedding-images').list(baseFolder, { limit: 10 });
         
         if (data && data.length > 0) {
            let fetchedUrls = [];
            for (const item of data) {
                if (!item.id && item.name !== '.emptyFolderPlaceholder') {
                    // It's a folder
                    const { data: subData } = await supabase.storage.from('wedding-images').list(`${baseFolder}/${item.name}`, { limit: 5 });
                    if (subData) {
                        const urls = subData.filter(f => f.id && (f.name.toLowerCase().endsWith('.jpg') || f.name.toLowerCase().endsWith('.jpeg') || f.name.toLowerCase().endsWith('.png') || f.name.toLowerCase().endsWith('.webp')))
                            .map(f => supabase.storage.from('wedding-images').getPublicUrl(`${baseFolder}/${item.name}/${f.name}`).data.publicUrl);
                        fetchedUrls.push(...urls);
                    }
                } else if (item.id && (item.name.toLowerCase().endsWith('.jpg') || item.name.toLowerCase().endsWith('.jpeg') || item.name.toLowerCase().endsWith('.png') || item.name.toLowerCase().endsWith('.webp'))) {
                    // It's a file
                    fetchedUrls.push(supabase.storage.from('wedding-images').getPublicUrl(`${baseFolder}/${item.name}`).data.publicUrl);
                }
            }
            if (fetchedUrls.length > 0) {
                setImages([wedding.cover_image_url, ...fetchedUrls.slice(0, 4)]);
            }
         }
      } catch (e) {
         console.error("Error fetching preview images:", e);
      }
    }"""

content = content.replace(old_fetch, new_fetch)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Home.jsx updated robust fetch logic.")
