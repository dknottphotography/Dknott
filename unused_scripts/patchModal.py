import re

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/RealWeddings.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the openGallery function
old_open_gallery = """  const openGallery = async (wedding, e) => {
    e.preventDefault();
    setSelectedWedding(wedding);
    setLoadingGallery(true);
    setGalleryData({});
    setActiveTab('All');
    
    const BUCKET = 'wedding-images';
    let folderName = wedding.title.toUpperCase().replace(/ & /g, ' ');
    if (wedding.title === 'Pooja Sai Charan') folderName = 'POOJA SAI CHARAN';
    
    const { data, error } = await supabase.storage.from(BUCKET).list(folderName, { limit: 100 });
    if (error || !data) {
        setLoadingGallery(false);
        return;
    }
    
    let newGalleryData = { 'All': [] };
    
    for (const item of data) {
        if (!item.id) {
            const subName = item.name;
            const { data: subData } = await supabase.storage.from(BUCKET).list(`${folderName}/${subName}`, { limit: 100 });
            if (subData) {
                const urls = subData
                    .filter(f => f.id && ['.jpg', '.jpeg', '.png', '.webp'].some(ext => f.name.toLowerCase().endsWith(ext)))
                    .map(f => supabase.storage.from(BUCKET).getPublicUrl(`${folderName}/${subName}/${f.name}`).data.publicUrl);
                
                if (urls.length > 0) {
                    newGalleryData[subName] = urls;
                    newGalleryData['All'].push(...urls);
                }
            }
        } else {
            const isImage = ['.jpg', '.jpeg', '.png', '.webp'].some(ext => item.name.toLowerCase().endsWith(ext));
            if (isImage) {
                newGalleryData['All'].push(supabase.storage.from(BUCKET).getPublicUrl(`${folderName}/${item.name}`).data.publicUrl);
            }
        }
    }
    
    if (newGalleryData['All'].length === 0) delete newGalleryData['All'];
    
    setGalleryData(newGalleryData);
    if (Object.keys(newGalleryData).length > 0) {
        // If there are multiple tabs, maybe we default to the first one that isn't 'All' if 'All' is empty
        setActiveTab(Object.keys(newGalleryData)[0]);
    }
    setLoadingGallery(false);
  };"""

new_open_gallery = """  const openGallery = async (wedding, e) => {
    e.preventDefault();
    setSelectedWedding(wedding);
    setLoadingGallery(true);
    setGalleryData({});
    setActiveTab('');
    
    const BUCKET = 'wedding-images';
    let folderName = wedding.title.toUpperCase().replace(/ & /g, ' ');
    if (wedding.title === 'Pooja Sai Charan') folderName = 'POOJA SAI CHARAN';
    
    const { data, error } = await supabase.storage.from(BUCKET).list(folderName, { limit: 100 });
    if (error || !data) {
        setLoadingGallery(false);
        return;
    }
    
    let newGalleryData = {};
    let rootImages = [];
    let hasSubfolders = false;
    
    for (const item of data) {
        if (!item.id) {
            const subName = item.name;
            const { data: subData } = await supabase.storage.from(BUCKET).list(`${folderName}/${subName}`, { limit: 100 });
            if (subData) {
                const urls = subData
                    .filter(f => f.id && ['.jpg', '.jpeg', '.png', '.webp'].some(ext => f.name.toLowerCase().endsWith(ext)))
                    .map(f => supabase.storage.from(BUCKET).getPublicUrl(`${folderName}/${subName}/${f.name}`).data.publicUrl);
                
                if (urls.length > 0) {
                    newGalleryData[subName] = urls;
                    hasSubfolders = true;
                }
            }
        } else {
            const isImage = ['.jpg', '.jpeg', '.png', '.webp'].some(ext => item.name.toLowerCase().endsWith(ext));
            if (isImage) {
                rootImages.push(supabase.storage.from(BUCKET).getPublicUrl(`${folderName}/${item.name}`).data.publicUrl);
            }
        }
    }
    
    if (rootImages.length > 0) {
        newGalleryData[hasSubfolders ? 'Highlights' : 'Gallery'] = rootImages;
    }
    
    setGalleryData(newGalleryData);
    if (Object.keys(newGalleryData).length > 0) {
        setActiveTab(Object.keys(newGalleryData)[0]);
    }
    setLoadingGallery(false);
  };"""

content = content.replace(old_open_gallery, new_open_gallery)


# 2. Update the modal layout
old_modal_layout = """<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                      {galleryData[activeTab]?.map((url, i) => (
                          <img key={i} src={url} alt={`${selectedWedding.title} photo ${i+1}`} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: '6px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }} />
                      ))}
                  </div>"""

new_modal_layout = """<div className="masonry-grid">
                      {galleryData[activeTab]?.map((url, i) => (
                          <img key={i} src={url} alt={`${selectedWedding.title} photo ${i+1}`} loading="lazy" />
                      ))}
                  </div>"""

content = content.replace(old_modal_layout, new_modal_layout)


# 3. Add the CSS for masonry-grid to the style block
style_insert_point = """/* utility reveal animation, respects reduced motion */"""
masonry_css = """
.masonry-grid {
    column-count: 3;
    column-gap: 1.5rem;
}
.masonry-grid img {
    width: 100%;
    break-inside: avoid;
    margin-bottom: 1.5rem;
    border-radius: 6px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: transform 0.3s ease;
}
.masonry-grid img:hover {
    transform: scale(1.02);
}
@media (max-width: 900px) {
    .masonry-grid { column-count: 2; }
}
@media (max-width: 500px) {
    .masonry-grid { column-count: 1; }
}

/* utility reveal animation, respects reduced motion */"""

content = content.replace(style_insert_point, masonry_css)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("RealWeddings.jsx updated with Masonry layout and Lazy Loading.")
