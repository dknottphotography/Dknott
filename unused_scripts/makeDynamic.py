import re

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/RealWeddings.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports and add state/fetch logic
old_imports = """import React, { useEffect } from 'react';

export default function RealWeddings() {"""

new_imports = """import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function RealWeddings() {
  const [weddings, setWeddings] = useState([]);

  useEffect(() => {
    async function fetchWeddings() {
      const { data, error } = await supabase
        .from('real_weddings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setWeddings(data);
      } else if (error) {
        console.error("Error fetching weddings:", error);
      }
    }
    fetchWeddings();
  }, []);"""

content = content.replace(old_imports, new_imports)

# 2. Replace the hardcoded grid with dynamic mapping
# We need to find the grid-3 block and replace it.
grid_start = content.find('<div className="grid-3">')
if grid_start != -1:
    grid_end = content.find('</div>', grid_start) + 6 # find closing div of grid-3
    
    # We actually want to replace everything inside the grid-3
    # Wait, the closing div is the first </div> after the last </a>.
    # Let's use a regex to replace the entire <div className="grid-3">...</div> block safely.
    pass

# Better approach for grid replacement:
old_grid_block = """    <div className="grid-3">
      <a className="card reveal" href="#" data-tags="destination,traditional">
        <img src="https://hpdzehxsxvvfvbskgnrd.supabase.co/storage/v1/object/public/website-images/gallery_1.jpeg" alt="Meera & Arjun" style={{"width":"100%","aspectRatio":"4/3","objectFit":"cover","marginBottom":"1rem"}} />
        <span className="meta">Udaipur · Destination</span>
        <h3>Meera &amp; Arjun</h3>
        <p>Three days, a lakeside pheras, and a sangeet that ran two hours long.</p>
      </a>
      <a className="card reveal" href="#" data-tags="intimate">
        <img src="https://hpdzehxsxvvfvbskgnrd.supabase.co/storage/v1/object/public/website-images/gallery_3.jpeg" alt="Ishaan & Priya" style={{"width":"100%","aspectRatio":"4/3","objectFit":"cover","marginBottom":"1rem"}} />
        <span className="meta">Goa · Intimate</span>
        <h3>Ishaan &amp; Priya</h3>
        <p>Forty guests, one beach, and a ceremony at low tide.</p>
      </a>
      <a className="card reveal" href="#" data-tags="traditional">
        <img src="https://hpdzehxsxvvfvbskgnrd.supabase.co/storage/v1/object/public/website-images/gallery_4.jpeg" alt="Kabir & Naina" style={{"width":"100%","aspectRatio":"4/3","objectFit":"cover","marginBottom":"1rem"}} />
        <span className="meta">Delhi NCR · Traditional</span>
        <h3>Kabir &amp; Naina</h3>
        <p>A four-function wedding across two families and one very long week.</p>
      </a>
      <a className="card reveal" href="#" data-tags="destination">
        <img src="https://hpdzehxsxvvfvbskgnrd.supabase.co/storage/v1/object/public/website-images/gallery_5.jpeg" alt="Aditi & Rohan" style={{"width":"100%","aspectRatio":"4/3","objectFit":"cover","marginBottom":"1rem"}} />
        <span className="meta">Jaipur · Destination</span>
        <h3>Aditi &amp; Rohan</h3>
        <p>A haldi in a courtyard and a baraat that stopped traffic for a block.</p>
      </a>
      <a className="card reveal" href="#" data-tags="intimate,traditional">
        <img src="https://hpdzehxsxvvfvbskgnrd.supabase.co/storage/v1/object/public/website-images/WhatsApp Image 2026-07-07 at 10.04.47 PM (1).jpeg" alt="Nikhil & Sana" style={{"width":"100%","aspectRatio":"4/3","objectFit":"cover","marginBottom":"1rem"}} />
        <span className="meta">Hyderabad · Intimate</span>
        <h3>Nikhil &amp; Sana</h3>
        <p>A backyard mehendi and a home-cooked reception for sixty.</p>
      </a>
      <a className="card reveal" href="#" data-tags="destination">
        <img src="https://hpdzehxsxvvfvbskgnrd.supabase.co/storage/v1/object/public/website-images/gallery_8.jpeg" alt="Vivaan & Anaya" style={{"width":"100%","aspectRatio":"4/3","objectFit":"cover","marginBottom":"1rem"}} />
        <span className="meta">Alibaug · Destination</span>
        <h3>Vivaan &amp; Anaya</h3>
        <p>A weekend by the coast, planned entirely around the sunset.</p>
      </a>
    </div>"""

new_grid_block = """    <div className="grid-3" id="dynamic-weddings-grid">
      {weddings.length > 0 ? (
        weddings.map((wedding) => (
          <a key={wedding.id} className="card" href="#" data-tags={wedding.tags || 'all'} style={{ animation: 'fadeRight 0.8s ease forwards' }}>
            <img src={wedding.cover_image_url} alt={wedding.title} style={{"width":"100%","aspectRatio":"4/3","objectFit":"cover","marginBottom":"1rem"}} />
            <span className="meta">{wedding.location || ''} {wedding.tags ? `· ${wedding.tags}` : ''}</span>
            <h3>{wedding.title}</h3>
            <p>{wedding.description}</p>
          </a>
        ))
      ) : (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--ink-soft)' }}>No weddings added to the database yet. Add them in Supabase!</p>
        </div>
      )}
    </div>"""

content = content.replace(old_grid_block, new_grid_block)

# Also fix the filter logic in the vanilla JS useEffect to watch the DOM mutations or just re-run filtering on state change
# Since filtering is done via data-tags, the best way in React is to do it via State.
# I will update the filter buttons to use React state instead of Vanilla JS querySelector.
# Let's do this safely by replacing the button row.

old_pill_row = """    <div className="pill-row reveal" style={{"marginBottom":"2.5rem"}}>
      <button className="pill active" data-filter="all">All</button>
      <button className="pill" data-filter="destination">Destination</button>
      <button className="pill" data-filter="traditional">Traditional</button>
      <button className="pill" data-filter="intimate">Intimate</button>
    </div>"""

new_pill_row = """    <div className="pill-row reveal" style={{"marginBottom":"2.5rem"}}>
      <button className="pill active" onClick={(e) => filterWeddings(e, 'all')}>All</button>
      <button className="pill" onClick={(e) => filterWeddings(e, 'destination')}>Destination</button>
      <button className="pill" onClick={(e) => filterWeddings(e, 'traditional')}>Traditional</button>
      <button className="pill" onClick={(e) => filterWeddings(e, 'intimate')}>Intimate</button>
    </div>"""

content = content.replace(old_pill_row, new_pill_row)

# Add the filterWeddings function just before the return
filter_function = """  const filterWeddings = (e, filter) => {
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
  };

  return ("""

content = content.replace('  return (', filter_function)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("RealWeddings.jsx updated for dynamic fetching.")
