import re

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/RealWeddings.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update PermanentImage to use class names and 100% height
perm_old = """const PermanentImage = ({ src, alt }) => {
    const [hasTriggered, setHasTriggered] = useState(false);
    const ref = useRef();

    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setHasTriggered(true);
                observer.disconnect();
            }
        }, { rootMargin: '400px' }); // Load 400px before it comes into view
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} style={{ minHeight: hasTriggered ? 'auto' : '300px', width: '100%', marginBottom: '1.5rem' }}>
            {hasTriggered && <img src={src} alt={alt} style={{ width: '100%', display: 'block', borderRadius: '6px' }} />}
        </div>
    );
};"""

perm_new = """const PermanentImage = ({ src, alt, className }) => {
    const [hasTriggered, setHasTriggered] = useState(false);
    const ref = useRef();

    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setHasTriggered(true);
                observer.disconnect();
            }
        }, { rootMargin: '400px' });
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={className} style={{ width: '100%', height: '100%' }}>
            {hasTriggered && <img src={src} alt={alt} />}
        </div>
    );
};"""

content = content.replace(perm_old, perm_new)


# 2. Update the CSS for the gallery grid
css_old = """.masonry-grid {
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
}"""

css_new = """.photo-gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 8px;
}
@media (max-width: 600px) {
    .photo-gallery-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 4px;
    }
}
.gallery-item-wrapper {
    aspect-ratio: 1 / 1;
    overflow: hidden;
    cursor: zoom-in;
    position: relative;
    background: rgba(255,255,255,0.05);
}
.gallery-item-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
.gallery-item-wrapper:hover img {
    transform: scale(1.1);
}"""

content = content.replace(css_old, css_new)


# 3. Update the JSX using masonry-grid to use photo-gallery-grid
jsx_old = """                  {Object.keys(galleryData).map(tab => (
                      <div key={tab} className="masonry-grid" style={{ display: activeTab === tab ? 'block' : 'none' }}>
                          {galleryData[tab]?.map((url, i) => (
                              <div key={`${tab}-${i}`} onClick={() => { setCurrentSlideIndex(i); setSlideshowActive(true); }} style={{ cursor: 'zoom-in' }}>
                                  <PermanentImage src={url} alt={`${selectedWedding.title} ${tab} photo ${i+1}`} />
                              </div>
                          ))}
                      </div>
                  ))}"""

jsx_new = """                  {Object.keys(galleryData).map(tab => (
                      <div key={tab} className="photo-gallery-grid" style={{ display: activeTab === tab ? 'grid' : 'none' }}>
                          {galleryData[tab]?.map((url, i) => (
                              <div key={`${tab}-${i}`} onClick={() => { setCurrentSlideIndex(i); setSlideshowActive(true); }} className="gallery-item-wrapper">
                                  <PermanentImage src={url} alt={`${selectedWedding.title} ${tab} photo ${i+1}`} className="gallery-item-inner" />
                              </div>
                          ))}
                      </div>
                  ))}"""

content = content.replace(jsx_old, jsx_new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("RealWeddings.jsx updated with grid layout.")
