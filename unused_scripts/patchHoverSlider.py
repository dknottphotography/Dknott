import re

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/Home.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_component = """const WeddingCardSlideshow = ({ wedding, offset }) => {
  const [images, setImages] = useState([wedding.cover_image_url]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchImages() {
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
    }
    fetchImages();
  }, [wedding.title, wedding.cover_image_url]);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 3000 + (offset * 500)); 
      return () => clearInterval(interval);
    }
  }, [images, offset]);

  return (
    <a className="card center" href="/real_weddings" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      {offset === 1 ? (
        <div style={{"background":"white","padding":"1.5rem","border":"1px solid rgba(0,0,0,0.05)","marginBottom":"1rem"}}>
          <img src={images[currentIndex]} alt={wedding.title} style={{"width":"100%","aspectRatio":"1/1","objectFit":"cover", "transition": "opacity 0.4s ease"}} />
        </div>
      ) : (
        <img src={images[currentIndex]} alt={wedding.title} style={{"width":"100%","aspectRatio":"4/5","objectFit":"cover","marginBottom":"1rem", "transition": "opacity 0.4s ease"}} />
      )}
      <span className="meta" style={{textTransform: 'uppercase'}}>{wedding.tags || 'WEDDING'}</span>
      <h3 style={{"fontWeight":"300"}}>{wedding.title}</h3>
    </a>
  );
};"""

new_component = """const WeddingCardSlideshow = ({ wedding, offset }) => {
  const [images, setImages] = useState([wedding.cover_image_url]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    async function fetchImages() {
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
    }
    fetchImages();
  }, [wedding.title, wedding.cover_image_url]);

  useEffect(() => {
    let interval;
    if (images.length > 1 && isHovered) {
      interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 1500); // Faster slideshow when hovering
    } else if (!isHovered) {
      setCurrentIndex(0); // Reset to cover image when not hovering
    }
    return () => clearInterval(interval);
  }, [images, isHovered]);

  return (
    <a 
      className="card center" 
      href="/real_weddings" 
      style={{ animation: 'fadeIn 0.5s ease-in-out', cursor: 'pointer' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      onTouchCancel={() => setIsHovered(false)}
    >
      {offset === 1 ? (
        <div style={{"background":"white","padding":"1.5rem","border":"1px solid rgba(0,0,0,0.05)","marginBottom":"1rem"}}>
          <img src={images[currentIndex]} alt={wedding.title} style={{"width":"100%","aspectRatio":"1/1","objectFit":"cover", "transition": "opacity 0.4s ease"}} />
        </div>
      ) : (
        <img src={images[currentIndex]} alt={wedding.title} style={{"width":"100%","aspectRatio":"4/5","objectFit":"cover","marginBottom":"1rem", "transition": "opacity 0.4s ease"}} />
      )}
      <span className="meta" style={{textTransform: 'uppercase'}}>{wedding.tags || 'WEDDING'}</span>
      <h3 style={{"fontWeight":"300"}}>{wedding.title}</h3>
    </a>
  );
};"""

content = content.replace(old_component, new_component)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Home.jsx updated to trigger slideshow on hover/touch only.")
