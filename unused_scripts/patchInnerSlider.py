import re

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/Home.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add WeddingCardSlideshow component and revert hooks
old_hooks = """export default function Home() {
  const [weddings, setWeddings] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    async function fetchWeddings() {
      const { data, error } = await supabase
        .from('real_weddings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setWeddings(data);
      }
    }
    fetchWeddings();
  }, []);

  useEffect(() => {
    if (weddings.length > 0) {
      const interval = setInterval(() => {
        setStartIndex(prev => (prev + 1) % weddings.length);
      }, 3500); // Change image every 3.5 seconds
      return () => clearInterval(interval);
    }
  }, [weddings]);"""

new_hooks = """const WeddingCardSlideshow = ({ wedding, offset }) => {
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
};


export default function Home() {
  const [weddings, setWeddings] = useState([]);

  useEffect(() => {
    async function fetchWeddings() {
      const { data, error } = await supabase
        .from('real_weddings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      if (!error && data) {
        setWeddings(data);
      }
    }
    fetchWeddings();
  }, []);"""

content = content.replace(old_hooks, new_hooks)

# 2. Update render
old_render = """    <div className="grid-3 reveal" style={{"alignItems":"start"}}>
      {weddings.length > 0 ? (
        [0, 1, 2].map((offset) => {
          const wedding = weddings[(startIndex + offset) % weddings.length];
          if (!wedding) return null;
          return (
            <a key={`${wedding.id}-${offset}`} className="card center" href="/real_weddings" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
              {offset === 1 ? (
                <div style={{"background":"white","padding":"1.5rem","border":"1px solid rgba(0,0,0,0.05)","marginBottom":"1rem"}}>
                  <img src={wedding.cover_image_url} alt={wedding.title} style={{"width":"100%","aspectRatio":"1/1","objectFit":"cover"}} />
                </div>
              ) : (
                <img src={wedding.cover_image_url} alt={wedding.title} style={{"width":"100%","aspectRatio":"4/5","objectFit":"cover","marginBottom":"1rem"}} />
              )}
              <span className="meta" style={{textTransform: 'uppercase'}}>{wedding.tags || 'WEDDING'}</span>
              <h3 style={{"fontWeight":"300"}}>{wedding.title}</h3>
            </a>
          );
        })
      ) : (
        <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Loading amazing weddings...</p>
      )}
    </div>"""

new_render = """    <div className="grid-3 reveal" style={{"alignItems":"start"}}>
      {weddings.length > 0 ? (
        weddings.map((wedding, idx) => (
          <WeddingCardSlideshow key={wedding.id} wedding={wedding} offset={idx} />
        ))
      ) : (
        <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Loading amazing weddings...</p>
      )}
    </div>"""

content = content.replace(old_render, new_render)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Home.jsx updated with inner card slideshows.")
