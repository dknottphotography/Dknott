import re

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/RealWeddings.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add activeFilter state and CustomLazyImage component
state_old = """export default function RealWeddings() {
  const [weddings, setWeddings] = useState([]);"""

state_new = """
// Custom image component that handles smooth loading without native browser pop-in
const SmoothImage = ({ src, alt, style }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <div style={{ position: 'relative', width: style.width || '100%', aspectRatio: style.aspectRatio, marginBottom: style.marginBottom }}>
            {!loaded && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: style.borderRadius || 0 }}></div>
            )}
            <img 
                src={src} 
                alt={alt} 
                onLoad={() => setLoaded(true)}
                style={{ ...style, width: '100%', height: '100%', opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }} 
            />
        </div>
    );
};

export default function RealWeddings() {
  const [weddings, setWeddings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');"""

content = content.replace(state_old, state_new)

# 2. Update the filterWeddings function to just set state
filter_old = """  const filterWeddings = (e, filter) => {
    // Update active class
    document.querySelectorAll('.pill-row .pill').forEach(p => p.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter cards
    const cards = document.querySelectorAll('#dynamic-weddings-grid .card');
    cards.forEach(card => {
      if (!card.dataset.tags) return;
      const tags = card.dataset.tags.split(',');
      card.style.display = (filter === 'all' || tags.includes(filter)) ? '' : 'none';
    });
  };"""

filter_new = """  const filterWeddings = (e, filter) => {
    e.preventDefault();
    setActiveFilter(filter);
  };"""

content = content.replace(filter_old, filter_new)


# 3. Update the filter buttons to use activeFilter state
pills_old = """    <div className="pill-row reveal" style={{"marginBottom":"2.5rem"}}>
      <button className="pill active" onClick={(e) => filterWeddings(e, 'all')}>All</button>
      <button className="pill" onClick={(e) => filterWeddings(e, 'destination')}>Destination</button>
      <button className="pill" onClick={(e) => filterWeddings(e, 'traditional')}>Traditional</button>
      <button className="pill" onClick={(e) => filterWeddings(e, 'intimate')}>Intimate</button>
    </div>"""

pills_new = """    <div className="pill-row reveal" style={{"marginBottom":"2.5rem"}}>
      <button className={`pill ${activeFilter === 'all' ? 'active' : ''}`} onClick={(e) => filterWeddings(e, 'all')}>All</button>
      <button className={`pill ${activeFilter === 'destination' ? 'active' : ''}`} onClick={(e) => filterWeddings(e, 'destination')}>Destination</button>
      <button className={`pill ${activeFilter === 'traditional' ? 'active' : ''}`} onClick={(e) => filterWeddings(e, 'traditional')}>Traditional</button>
      <button className={`pill ${activeFilter === 'intimate' ? 'active' : ''}`} onClick={(e) => filterWeddings(e, 'intimate')}>Intimate</button>
    </div>"""

content = content.replace(pills_old, pills_new)


# 4. Update the card mapping to use activeFilter and SmoothImage
grid_old = """    <div className="grid-3" id="dynamic-weddings-grid">
      {weddings.length > 0 ? (
        weddings.map((wedding) => (
          <a key={wedding.id} className="card" href="#" onClick={(e) => openGallery(wedding, e)} data-tags={wedding.tags || 'all'} style={{ animation: 'fadeRight 0.8s ease forwards', cursor: 'pointer' }}>
            <img src={wedding.cover_image_url} alt={wedding.title} style={{"width":"100%","aspectRatio":"4/3","objectFit":"cover","marginBottom":"1rem"}} />
            <span className="meta">{wedding.location || ''} {wedding.tags ? `· ${wedding.tags}` : ''}</span>
            <h3>{wedding.title}</h3>
            <p>{wedding.description}</p>
          </a>
        ))
      ) : ("""

grid_new = """    <div className="grid-3" id="dynamic-weddings-grid">
      {weddings.length > 0 ? (
        weddings.map((wedding) => {
          const tags = wedding.tags ? wedding.tags.split(',') : [];
          const isVisible = activeFilter === 'all' || tags.includes(activeFilter);
          return (
            <a key={wedding.id} className="card reveal" href="#" onClick={(e) => openGallery(wedding, e)} style={{ display: isVisible ? 'flex' : 'none', cursor: 'pointer' }}>
              <SmoothImage src={wedding.cover_image_url} alt={wedding.title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", marginBottom: "1rem", borderRadius: "4px" }} />
              <span className="meta">{wedding.location || ''} {wedding.tags ? `· ${wedding.tags}` : ''}</span>
              <h3>{wedding.title}</h3>
              <p>{wedding.description}</p>
            </a>
          );
        })
      ) : ("""

content = content.replace(grid_old, grid_new)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("RealWeddings.jsx updated with SmoothImage and React State filtering.")
