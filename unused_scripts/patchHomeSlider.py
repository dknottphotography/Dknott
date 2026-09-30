import re

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/Home.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update fetch query to get all weddings, add startIndex state and useEffect interval
old_hooks = """export default function Home() {
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

new_hooks = """export default function Home() {
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

content = content.replace(old_hooks, new_hooks)


# 2. Update the rendering logic to display 3 sliding weddings
old_render = """    <div className="grid-3 reveal" style={{"alignItems":"start"}}>
      {weddings.length > 0 ? (
        weddings.map((wedding, idx) => (
          <a key={wedding.id} className="card center" href="/real_weddings">
            {idx === 1 ? (
              <div style={{"background":"white","padding":"1.5rem","border":"1px solid rgba(0,0,0,0.05)","marginBottom":"1rem"}}>
                <img src={wedding.cover_image_url} alt={wedding.title} style={{"width":"100%","aspectRatio":"1/1","objectFit":"cover"}} />
              </div>
            ) : (
              <img src={wedding.cover_image_url} alt={wedding.title} style={{"width":"100%","aspectRatio":"4/5","objectFit":"cover","marginBottom":"1rem"}} />
            )}
            <span className="meta" style={{textTransform: 'uppercase'}}>{wedding.tags || 'WEDDING'}</span>
            <h3 style={{"fontWeight":"300"}}>{wedding.title}</h3>
          </a>
        ))
      ) : (
        <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Loading amazing weddings...</p>
      )}
    </div>"""

new_render = """    <div className="grid-3 reveal" style={{"alignItems":"start"}}>
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

content = content.replace(old_render, new_render)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Home.jsx updated with sliding weddings feature.")
