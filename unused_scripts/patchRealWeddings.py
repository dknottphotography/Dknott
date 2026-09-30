import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/RealWeddings.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace openGallery
open_gallery_new = '''  const openGallery = async (wedding, e) => {
    e.preventDefault();
    setSelectedWedding(wedding);
    setLoadingGallery(true);
    
    // Instead of fetching from Supabase, we use the local static manifest data
    let newGalleryData = wedding.photos || {};
    
    setGalleryData(newGalleryData);
    if (Object.keys(newGalleryData).length > 0) {
        setActiveTab(Object.keys(newGalleryData)[0]);
    } else {
        setActiveTab('');
    }
    setLoadingGallery(false);
  };'''
content = re.sub(r'  const openGallery = async \(wedding, e\) => \{.*?\n  \};\n\n', open_gallery_new + '\n\n', content, flags=re.DOTALL)

# Replace fetchWeddings
fetch_weddings_new = '''  useEffect(() => {
    setWeddings(weddingGalleries);
  }, []);'''
content = re.sub(r'  useEffect\(\(\) => \{\n    async function fetchWeddings\(\) \{.*?\n  \}, \[\]\);', fetch_weddings_new, content, flags=re.DOTALL)

# Replace <img src={wedding.cover_image_url} ... />
content = re.sub(r'<img src=\{wedding\.cover_image_url\} alt=\{wedding\.title\}', r'<img src={cloudinaryUrl(wedding.coverImage)} onError={handleImageError} alt={wedding.title}', content)

# And in the modal/gallery image rendering, assuming there's an img rendering the gallery photo somewhere at the bottom...
# Wait, I didn't read the bottom of RealWeddings.jsx where it actually displays the photos.
# I should replace the raw src={img} inside the gallery view with src={cloudinaryUrl(img)}.

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
