import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Home.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace WeddingCardSlideshow
slideshow_new = '''const WeddingCardSlideshow = ({ wedding, offset }) => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const allPhotos = [];
    if (wedding.coverImage) allPhotos.push(wedding.coverImage);
    if (wedding.photos) {
      for (const key in wedding.photos) {
        if (Array.isArray(wedding.photos[key])) {
          allPhotos.push(...wedding.photos[key]);
        }
      }
    }
    // ensure at least something is there if empty
    setImages(allPhotos.length > 0 ? allPhotos.slice(0, 5) : [wedding.coverImage || '']);
  }, [wedding]);

  useEffect(() => {
    let interval;
    if (images.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 2000 + (offset * 300)); 
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
                 src={cloudinaryUrl(img)} 
                 onError={handleImageError}
                 alt={${wedding.title} } 
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
};'''

content = re.sub(r'const WeddingCardSlideshow = \(\{ wedding, offset \}\) => \{.*?(?=export default function Home)', slideshow_new + '\n\n', content, flags=re.DOTALL)

# Replace fetchWeddings
fetch_weddings_new = '''  useEffect(() => {
    setWeddings(weddingGalleries.slice(0, 3));
  }, []);'''
content = re.sub(r'  useEffect\(\(\) => \{\n    async function fetchWeddings\(\) \{.*?\n  \}, \[\]\);', fetch_weddings_new, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
