import re

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/RealWeddings.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update state declarations
state_block_old = """export default function RealWeddings() {
  const [weddings, setWeddings] = useState([]);"""

state_block_new = """export default function RealWeddings() {
  const [weddings, setWeddings] = useState([]);
  const [selectedWedding, setSelectedWedding] = useState(null);
  const [galleryData, setGalleryData] = useState({});
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  
  const openGallery = async (wedding, e) => {
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
  };
"""
content = content.replace(state_block_old, state_block_new)

# 2. Update the card mapping to call openGallery
card_old = """<a key={wedding.id} className="card" href="#" data-tags={wedding.tags || 'all'} style={{ animation: 'fadeRight 0.8s ease forwards' }}>"""
card_new = """<a key={wedding.id} className="card" href="#" onClick={(e) => openGallery(wedding, e)} data-tags={wedding.tags || 'all'} style={{ animation: 'fadeRight 0.8s ease forwards', cursor: 'pointer' }}>"""
content = content.replace(card_old, card_new)

# 3. Add the modal JSX before the closing </> of the return statement
modal_jsx = """

      {selectedWedding && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(31,35,31,0.98)', overflowY: 'auto' }}>
          <div style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto', color: 'var(--paper)', minHeight: '100vh' }}>
            <button onClick={() => setSelectedWedding(null)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: 'white', fontSize: '2.5rem', cursor: 'pointer', zIndex: 10000, lineHeight: 1 }}>&times;</button>
            
            <h2 style={{ color: 'var(--paper)', textAlign: 'center', marginBottom: '2rem', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>{selectedWedding.title}</h2>
            
            {loadingGallery ? (
                <p style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading gallery...</p>
            ) : (
                <>
                  {Object.keys(galleryData).length > 1 && (
                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
                          {Object.keys(galleryData).map(tab => (
                              <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: activeTab === tab ? 'var(--gold)' : 'transparent', color: activeTab === tab ? 'var(--ink)' : 'var(--paper)', border: '1px solid var(--gold)', padding: '0.6rem 1.4rem', borderRadius: '99px', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', transition: 'all 0.2s ease' }}>
                                  {tab}
                              </button>
                          ))}
                      </div>
                  )}
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                      {galleryData[activeTab]?.map((url, i) => (
                          <img key={i} src={url} alt={`${selectedWedding.title} photo ${i+1}`} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: '6px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }} />
                      ))}
                  </div>
                  
                  {Object.keys(galleryData).length === 0 && (
                      <p style={{ textAlign: 'center', marginTop: '2rem', color: 'rgba(255,255,255,0.6)' }}>No images found in this folder.</p>
                  )}
                </>
            )}
          </div>
        </div>
      )}

    </>
  );
}"""

content = content.replace("""    </>
  );
}""", modal_jsx)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("RealWeddings.jsx modal added!")
