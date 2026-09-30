import re

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/Home.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the component to use stacked images and auto slideshow instead of hover
old_component = """const WeddingCardSlideshow = ({ wedding, offset }) => {
  const [images, setImages] = useState([wedding.cover_image_url]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    async function fetchImages() {
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
    }
    fetchImages();
  }, [wedding.title, wedding.cover_image_url]);

  useEffect(() => {
    let interval;
    if (images.length > 1 && isHovered) {
      setCurrentIndex(1); // Jump to second image immediately on hover!
      interval = setInterval(() => {
        setCurrentIndex(prev => {
           const next = (prev + 1) % images.length;
           return next === 0 ? 1 : next; // Skip cover photo once slideshow starts
        });
      }, 1500); 
    } else {
      setCurrentIndex(0); 
    }
    return () => clearInterval(interval);
  }, [images, isHovered]);

  const aspectRatio = offset === 1 ? '1/1' : '4/5';

  return (
    <a 
      className="card center" 
      href="/real_weddings" 
      style={{ animation: 'fadeIn 0.5s ease-in-out', cursor: 'pointer', display: 'block' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      onTouchCancel={() => setIsHovered(false)}
    >
      <div style={{
          background: offset === 1 ? "white" : "transparent",
          padding: offset === 1 ? "1.5rem" : "0",
          border: offset === 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
          marginBottom: "1rem"
      }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio, overflow: 'hidden' }}>
            {images.map((img, i) => (
               <img 
                 key={i}
                 src={img} 
                 alt={`${wedding.title} ${i}`} 
                 style={{
                    position: i === 0 ? 'relative' : 'absolute',
                    top: 0, left: 0,
                    width: "100%", 
                    height: "100%",
                    objectFit: "cover", 
                    opacity: currentIndex === i ? 1 : 0,
                    transition: "opacity 0.6s ease-in-out",
                    zIndex: currentIndex === i ? 2 : 1
                 }} 
               />
            ))}
          </div>
      </div>
      <span className="meta" style={{textTransform: 'uppercase'}}>{wedding.tags || 'WEDDING'} ({images.length} imgs)</span>
      <h3 style={{"fontWeight":"300"}}>{wedding.title}</h3>
    </a>
  );
};"""

new_component = """const WeddingCardSlideshow = ({ wedding, offset }) => {
  const [images, setImages] = useState([wedding.cover_image_url]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchImages() {
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
    }
    fetchImages();
  }, [wedding.title, wedding.cover_image_url]);

  useEffect(() => {
    let interval;
    if (images.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 3000 + (offset * 500)); // Stagger the auto-slideshows so they don't all change at the exact same time
    }
    return () => clearInterval(interval);
  }, [images, offset]);

  const aspectRatio = offset === 1 ? '1/1' : '4/5';

  return (
    <a 
      className="card center" 
      href="/real_weddings" 
      style={{ animation: 'fadeIn 0.5s ease-in-out', cursor: 'pointer', display: 'block' }}
    >
      <div style={{
          background: offset === 1 ? "white" : "transparent",
          padding: offset === 1 ? "1.5rem" : "0",
          border: offset === 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
          marginBottom: "1rem"
      }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio, overflow: 'hidden' }}>
            {images.map((img, i) => (
               <img 
                 key={i}
                 src={img} 
                 alt={`${wedding.title} ${i}`} 
                 style={{
                    position: i === 0 ? 'relative' : 'absolute',
                    top: 0, left: 0,
                    width: "100%", 
                    height: "100%",
                    objectFit: "cover", 
                    opacity: currentIndex === i ? 1 : 0,
                    transition: "opacity 1.2s ease-in-out",
                    zIndex: currentIndex === i ? 2 : 1
                 }} 
               />
            ))}
          </div>
      </div>
      <span className="meta" style={{textTransform: 'uppercase'}}>{wedding.tags || 'WEDDING'}</span>
      <h3 style={{"fontWeight":"300"}}>{wedding.title}</h3>
    </a>
  );
};"""

content = content.replace(old_component, new_component)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Home.jsx updated with auto slideshow (no hover needed).")
