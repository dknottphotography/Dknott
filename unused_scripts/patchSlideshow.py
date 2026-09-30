import re

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/RealWeddings.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state variables
state_old = """  const [activeTab, setActiveTab] = useState('All');"""
state_new = """  const [activeTab, setActiveTab] = useState('All');
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);"""

content = content.replace(state_old, state_new)

# 2. Add Slideshow Button
tabs_old = """                  {Object.keys(galleryData).length > 1 && (
                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
                          {Object.keys(galleryData).map(tab => (
                              <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: activeTab === tab ? 'var(--gold)' : 'transparent', color: activeTab === tab ? 'var(--ink)' : 'var(--paper)', border: '1px solid var(--gold)', padding: '0.6rem 1.4rem', borderRadius: '99px', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', transition: 'all 0.2s ease' }}>
                                  {tab}
                              </button>
                          ))}
                      </div>
                  )}"""

tabs_new = """                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      {Object.keys(galleryData).length > 1 && Object.keys(galleryData).map(tab => (
                          <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: activeTab === tab ? 'var(--gold)' : 'transparent', color: activeTab === tab ? 'var(--ink)' : 'var(--paper)', border: '1px solid var(--gold)', padding: '0.6rem 1.4rem', borderRadius: '99px', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', transition: 'all 0.2s ease' }}>
                              {tab}
                          </button>
                      ))}
                      {galleryData[activeTab]?.length > 0 && (
                          <button onClick={() => { setCurrentSlideIndex(0); setSlideshowActive(true); }} style={{ background: 'var(--paper)', color: 'var(--ink)', border: '1px solid var(--paper)', padding: '0.6rem 1.4rem', borderRadius: '99px', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: Object.keys(galleryData).length > 1 ? '1rem' : '0' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Slideshow
                          </button>
                      )}
                  </div>"""

content = content.replace(tabs_old, tabs_new)


# 3. Add clicking images to open slideshow at that index, and add the slideshow overlay
grid_old = """                  {Object.keys(galleryData).map(tab => (
                      <div key={tab} className="masonry-grid" style={{ display: activeTab === tab ? 'block' : 'none' }}>
                          {galleryData[tab]?.map((url, i) => (
                              <PermanentImage key={`${tab}-${i}`} src={url} alt={`${selectedWedding.title} ${tab} photo ${i+1}`} />
                          ))}
                      </div>
                  ))}"""

grid_new = """                  {Object.keys(galleryData).map(tab => (
                      <div key={tab} className="masonry-grid" style={{ display: activeTab === tab ? 'block' : 'none' }}>
                          {galleryData[tab]?.map((url, i) => (
                              <div key={`${tab}-${i}`} onClick={() => { setCurrentSlideIndex(i); setSlideshowActive(true); }} style={{ cursor: 'zoom-in' }}>
                                  <PermanentImage src={url} alt={`${selectedWedding.title} ${tab} photo ${i+1}`} />
                              </div>
                          ))}
                      </div>
                  ))}
                  
                  {slideshowActive && galleryData[activeTab] && (
                      <div style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                          <button onClick={() => setSlideshowActive(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white', fontSize: '2.5rem', cursor: 'pointer', zIndex: 10 }}>&times;</button>
                          
                          <div style={{ position: 'relative', width: '100%', height: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <img src={galleryData[activeTab][currentSlideIndex]} alt={`Slide ${currentSlideIndex + 1}`} style={{ maxWidth: '90%', maxHeight: '100%', objectFit: 'contain', userSelect: 'none' }} />
                              
                              <button onClick={(e) => { e.stopPropagation(); setCurrentSlideIndex(prev => prev > 0 ? prev - 1 : galleryData[activeTab].length - 1); }} style={{ position: 'absolute', left: '2%', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '1rem', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                              </button>
                              
                              <button onClick={(e) => { e.stopPropagation(); setCurrentSlideIndex(prev => prev < galleryData[activeTab].length - 1 ? prev + 1 : 0); }} style={{ position: 'absolute', right: '2%', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '1rem', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                              </button>
                          </div>
                          
                          <div style={{ color: 'rgba(255,255,255,0.6)', marginTop: '1.5rem', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
                              {currentSlideIndex + 1} / {galleryData[activeTab].length}
                          </div>
                      </div>
                  )}"""

content = content.replace(grid_old, grid_new)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("RealWeddings.jsx updated with Slideshow feature.")
