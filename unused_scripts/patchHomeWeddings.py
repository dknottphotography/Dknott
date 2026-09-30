import re

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/Home.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add supabase import
import_old = """import React, { useEffect } from 'react';"""
import_new = """import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';"""
if import_old in content:
    content = content.replace(import_old, import_new)

# 2. Add state and fetch logic
component_start_old = """export default function Home() {"""
component_start_new = """export default function Home() {
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
  }, []);
"""
if component_start_old in content:
    content = content.replace(component_start_old, component_start_new)

# 3. Replace static cards with dynamic map
cards_old = """    <div className="grid-3 reveal" style={{"alignItems":"start"}}>
      <a className="card center" href="#">
        <img src="https://hpdzehxsxvvfvbskgnrd.supabase.co/storage/v1/object/public/website-images/gallery_3.jpeg" alt="Vedika & Devansh" style={{"width":"100%","aspectRatio":"4/5","objectFit":"cover","marginBottom":"1rem"}} />
        <span className="meta">PRE-WEDDING</span>
        <h3 style={{"fontWeight":"300"}}>Vedika X Devansh</h3>
      </a>
      <a className="card center" href="#">
        <div style={{"background":"white","padding":"1.5rem","border":"1px solid rgba(0,0,0,0.05)","marginBottom":"1rem"}}>
          <img src="https://hpdzehxsxvvfvbskgnrd.supabase.co/storage/v1/object/public/website-images/gallery_4.jpeg" alt="Shivani & Kashyap" style={{"width":"100%","aspectRatio":"1/1","objectFit":"cover"}} />
        </div>
        <span className="meta">COCKTAIL</span>
        <h3 style={{"fontWeight":"300"}}>Shivani X Kashyap</h3>
      </a>
      <a className="card center" href="#">
        <img src="https://hpdzehxsxvvfvbskgnrd.supabase.co/storage/v1/object/public/website-images/gallery_5.jpeg" alt="Varsha & Dharshan" style={{"width":"100%","aspectRatio":"4/5","objectFit":"cover","marginBottom":"1rem"}} />
        <span className="meta">WEDDING</span>
        <h3 style={{"fontWeight":"300"}}>Varsha X Dharshan</h3>
      </a>
    </div>"""

cards_new = """    <div className="grid-3 reveal" style={{"alignItems":"start"}}>
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

if cards_old in content:
    content = content.replace(cards_old, cards_new)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Home.jsx updated with dynamic real weddings.")
