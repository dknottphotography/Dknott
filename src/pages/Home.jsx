import React, { useEffect, useState } from 'react';
import { cloudinaryUrl, handleImageError } from '../lib/cloudinary';
import { commonImages, weddingGalleries } from '../data/images';
import { supabase } from '../lib/supabaseClient';
import { client } from '../sanity';
import { useSanityDoc } from '../lib/useSanityDoc';
import { sanityImg, normalizeWeddings } from '../lib/sanityContent';
import { navLinksFrom, isActiveLink } from '../lib/siteContent';

const WeddingCardSlideshow = ({ wedding, offset }) => {
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
    setImages(allPhotos.length > 0 ? allPhotos : [wedding.coverImage || '']);
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
      href={`/real_weddings?open=${wedding.id}`} 
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
};

export default function Home() {
  const [weddings, setWeddings] = useState([]);
  const [currentTesti, setCurrentTesti] = useState(0);
  const [testiFading, setTestiFading] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    client.fetch(`{
      "settings": *[_type == "siteSettings"][0],
      "home": *[_type == "homePage"][0]
    }`).then(data => {
      setSiteSettings(data.settings);
      setHomeData(data.home);
    }).catch(console.error);
  }, []);

  const DEFAULT_TESTIMONIALS = [
    {
      author: 'Shiva & Shravani',
      text: `<p>Thank you so much to you and your team for capturing every moment with such precision and artistry. Your attention to detail, professionalism, and ability to preserve genuine emotions was absolutely amazing.</p><p>It created lasting memories. The quality, composition, and timing were captured beautifully.</p><p>We sincerely appreciate your dedication, creativity, and effort throughout the entire event.</p><p>Thank you so much from me and Shravani.</p>`,
      image: cloudinaryUrl('testinomial1.jpeg')
    },
    {
      author: 'Shivani & Shubham',
      text: `<p>Hi,</p><p>Thank you so much for the beautiful pictures. I truly appreciate the effort and creativity you put into capturing those moments.</p><p>I've always felt that I'm not very photogenic and I'm not great with poses, but you and your team made me feel really comfortable throughout.</p><p>The way you guided everything and captured the photos so naturally was amazing. Actually wanted to thank you personally that day, but things were so busy that I didn't get the chance to meet you.</p><p>Once again, thank you so much for your wonderful work. I genuinely appreciate the time, patience, and effort you and your team put into making the photos so special.</p>`,
      image: cloudinaryUrl('testinomial2.jpeg')
    },
    {
      author: 'Poojitha & Pranay',
      text: `<p>Thank you for the patience. Your entire team was very good. They made sure I was comfortable and enjoyed the wedding.</p><p>You didn't just act like photographers; you took pictures with a lot of patience and care.</p><p>Your team's passion for photography was very evident. I am sure you people will reach the sky. I will for sure recommend you to everyone.</p><p>Thank you again. You have no idea how nice it was to have good people with genuine intentions. Good luck in life.</p>`,
      image: cloudinaryUrl('testinomial3.jpeg')
    }
  ];

  // Testimonials from Sanity (homePage.testimonials) with built-in fallback.
  const testimonials = (homeData?.testimonials && homeData.testimonials.length)
    ? homeData.testimonials.map((t, i) => ({
        author: t.author || DEFAULT_TESTIMONIALS[i % DEFAULT_TESTIMONIALS.length].author,
        text: t.text || DEFAULT_TESTIMONIALS[i % DEFAULT_TESTIMONIALS.length].text,
        image: sanityImg(t.image) || DEFAULT_TESTIMONIALS[i % DEFAULT_TESTIMONIALS.length].image,
      }))
    : DEFAULT_TESTIMONIALS;

  const handleTestiChange = (direction) => {
    if (testiFading) return;
    setTestiFading(true);
    setTimeout(() => {
      setCurrentTesti(prev => {
        if (direction === 'next') return (prev + 1) % testimonials.length;
        return (prev - 1 + testimonials.length) % testimonials.length;
      });
      setTestiFading(false);
    }, 400);
  };


  useEffect(() => {
    client.fetch('*[_type == "realWedding"] | order(_createdAt desc)[0...3]')
      .then((docs) => {
        const list = normalizeWeddings(docs);
        setWeddings(list.length ? list : weddingGalleries.slice(0, 3));
      })
      .catch(() => setWeddings(weddingGalleries.slice(0, 3)));
  }, []);

  useEffect(() => {
    if (window.__HomeScriptLoaded) return;
    window.__HomeScriptLoaded = true;

    
  // Lock scrolling while splash is visible
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    const path = document.getElementById("knot-path");
    const splashText = document.getElementById("splash-text");
    if (!path || !splashText) return;
    const length = path.getTotalLength();
    
    // Set initial dash state for the knot
    path.style.transition = 'none';
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    
    // Trigger reflow to apply initial state
    path.getBoundingClientRect();
    
    // Animate the thread drawing itself
    path.style.transition = 'stroke-dashoffset 2s ease-in-out';
    path.style.strokeDashoffset = '0';
    
    // Fade in text halfway through the knot animation
    setTimeout(() => {
      splashText.style.opacity = '1';
      splashText.style.transform = 'translateY(0)';
    }, 1200);
    
    // Fade out and remove splash screen
    setTimeout(() => {
      const splash = document.getElementById('splash-screen');
      if (splash) {
        splash.style.opacity = '0';
        splash.style.visibility = 'hidden';
      }
      document.body.style.overflow = ''; // Unlock scrolling
    }, 3200);
  });


  setTimeout(() => {
  // mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links){
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    }));
  }

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // real weddings filter pills (Real Weddings page)
  const pills = document.querySelectorAll('.pill[data-filter]');
  const cards = document.querySelectorAll('[data-tags]');
  if (pills.length && cards.length){
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filter = pill.dataset.filter;
        cards.forEach(card => {
          const tags = card.dataset.tags.split(',');
          card.style.display = (filter === 'all' || tags.includes(filter)) ? '' : 'none';
        });
      });
    });
  }

  // contact form: placeholder submit
  const form = document.querySelector('#inquiry-form');
  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Sent — thank you';
      form.reset();
      setTimeout(() => { btn.textContent = original; }, 3000);
    });
  }
});



  }, []);

  // Dynamically set CSS variables from Sanity site settings
  const dynamicStyles = siteSettings?.creamColor ? `
    :root {
      --paper: ${siteSettings.creamColor};
    }
  ` : '';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
/* ==========================================================================
   DKNOTT PHOTOGRAPHY — design system
   Palette: warm paper / ink / oxblood / olive / gold
   Type: Fraunces (display) + Work Sans (body & utility)
   Signature: the knot mark — used in the wordmark and as a section divider
   ========================================================================== */

@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Work+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

:root{
  --paper: #F8F3E9;
  --paper-deep: #F0E8D8;
  --ink: #262019;
  --ink-soft: #574E43;
  --oxblood: #7A2A2A;
  --oxblood-deep: #5E1F1F;
  --olive: #5C6B47;
  --gold: #B08D4C;
  --line: rgba(38,32,25,0.15);
  --line-strong: rgba(38,32,25,0.28);

  --serif: 'Fraunces', serif;
  --sans: 'Work Sans', sans-serif;

  --container: 1180px;
  --gap: clamp(1.5rem, 3vw, 3rem);
}

${dynamicStyles}

*{ box-sizing: border-box; }
html{ scroll-behavior: smooth; }
body{
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  font-weight: 400;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
img{ max-width: 100%; display: block; }
a{ color: inherit; text-decoration: none; }
ul{ list-style: none; margin: 0; padding: 0; }

.wrap{
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 4vw, 2.5rem);
}

.eyebrow{
  font-family: var(--sans);
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--oxblood);
  font-weight: 600;
  display: inline-block;
  margin-bottom: 0.9rem;
}

h1,h2,h3,h4{
  font-family: var(--serif);
  font-weight: 500;
  color: var(--ink);
  margin: 0 0 0.5em;
  letter-spacing: -0.01em;
}
h1{ font-size: clamp(2.6rem, 6vw, 4.6rem); font-weight: 400; line-height: 1.03; }
h2{ font-size: clamp(1.9rem, 4vw, 2.9rem); line-height: 1.12; }
h3{ font-size: clamp(1.3rem, 2.4vw, 1.6rem); }
p{ margin: 0 0 1em; color: var(--ink-soft); }
.lede{ font-size: clamp(1.05rem, 1.6vw, 1.25rem); font-style: italic; font-family: var(--serif); color: var(--ink); }

/* ---------- knot mark (signature) ---------- */
.knot{
  display: inline-block;
  width: 1em; height: 1em;
  vertical-align: -0.12em;
}
.knot svg{ width:100%; height:100%; display:block; }

.knot-divider{
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: clamp(2.5rem, 6vw, 5rem) 0;
  color: var(--gold);
}
.knot-divider::before,
.knot-divider::after{
  content: "";
  flex: 1;
  height: 1px;
  background: var(--line-strong);
}
.knot-divider .knot{ width: 1.4rem; height: 1.4rem; opacity: 0.9; }

/* ---------- buttons ---------- */
.btn{
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--sans);
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
  padding: 0.95rem 1.8rem;
  border: 1px solid var(--ink);
  border-radius: 999px;
  transition: background 0.25s ease, color 0.25s ease, border-color .25s ease;
}
.btn:hover{ background: var(--ink); color: var(--paper); }
.btn.solid{ background: var(--oxblood); border-color: var(--oxblood); color: var(--paper); }
.btn.solid:hover{ background: var(--oxblood-deep); border-color: var(--oxblood-deep); }
.btn.ghost{ border-color: rgba(248,243,233,0.6); color: var(--paper); }
.btn.ghost:hover{ background: var(--paper); color: var(--ink); }

/* ---------- nav (Transparent overlay on hero) ---------- */
header.site-nav{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 50;
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-bottom: none;
}
.nav-row{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(1rem, 2.2vw, 1.8rem) 0;
}
.logo{
  font-family: var(--serif);
  font-size: 1.35rem;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}
.brand-logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(0,0,0,0.35);
}
@media (min-width: 768px) {
  .brand-logo {
    width: 90px;
    height: 90px;
  }
}
.footer-logo {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
@media (min-width: 768px) {
  .footer-logo {
    width: 140px;
    height: 140px;
  }
}
.nav-links{
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2vw, 2.2rem);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.nav-links a{
  position: relative;
  padding: 0.25rem 0;
  color: #FFFFFF;
  text-shadow: 0 1px 6px rgba(0,0,0,0.7);
  font-weight: 500;
  transition: color 0.25s ease, opacity 0.25s ease;
  opacity: 0.92;
}
.nav-links a:hover{
  color: #FAF7F2;
  opacity: 1;
  text-shadow: 0 1px 10px rgba(0,0,0,0.9);
}
.nav-links a.active{
  color: #FFFFFF;
  opacity: 1;
}
.nav-links a.active::after{
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -3px;
  height: 1.5px;
  background: #FFFFFF;
  box-shadow: 0 1px 4px rgba(0,0,0,0.6);
}
.nav-cta{ display:flex; align-items:center; gap: 1.3rem; }

/* Animated Hamburger Icon */
.nav-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  position: relative;
  z-index: 100;
}
.hamburger {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 26px;
  height: 2px;
  background-color: #FFFFFF;
  box-shadow: 0 1px 4px rgba(0,0,0,0.7);
  transition: background-color 0.2s ease-in-out;
}
.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  right: 0;
  left: auto;
  height: 2px;
  background-color: #FFFFFF;
  box-shadow: 0 1px 4px rgba(0,0,0,0.7);
  transition: transform 0.3s ease-in-out, top 0.3s ease-in-out, width 0.3s ease-in-out;
}
.hamburger::before {
  top: -8px;
  width: 50%;
}
.hamburger::after {
  top: 8px;
  width: 75%;
}
.nav-toggle.open .hamburger {
  background-color: transparent;
  box-shadow: none;
}
.nav-toggle.open .hamburger::before {
  top: 0;
  width: 100%;
  transform: rotate(45deg);
}
.nav-toggle.open .hamburger::after {
  top: 0;
  width: 100%;
  transform: rotate(-45deg);
}

@media (max-width: 780px){
  .site-nav .wrap { padding: 0 1.25rem; }
  .nav-row { padding: 0.6rem 0; }
  .logo { position: relative; z-index: 100; }
  .nav-links {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(26, 22, 19, 0.95);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    flex-direction: column; justify-content: center; align-items: center;
    padding: 2rem; display: flex;
    opacity: 0; visibility: hidden; pointer-events: none;
    transform: scale(1.05);
    transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
    z-index: 90;
  }
  .nav-links.open {
    opacity: 1; visibility: visible; pointer-events: auto;
    transform: scale(1);
  }
  .nav-toggle { display: block; z-index: 100; }
  .nav-links a {
    color: #FAF7F2 !important;
    font-family: var(--sans);
    font-size: 1.2rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 1.2rem 0;
    width: auto;
    text-align: center;
    border-bottom: none;
    opacity: 0;
    transform: translateY(15px);
    transition: opacity 0.4s ease, transform 0.4s ease;
    text-shadow: none;
  }
  .nav-links a.active {
    color: var(--gold, #C5A880) !important;
  }
  .nav-links.open a {
    opacity: 1; transform: translateY(0);
  }
  .nav-links.open a:nth-child(1) { transition-delay: 0.1s; }
  .nav-links.open a:nth-child(2) { transition-delay: 0.15s; }
  .nav-links.open a:nth-child(3) { transition-delay: 0.2s; }
  .nav-links.open a:nth-child(4) { transition-delay: 0.25s; }
  .nav-links.open a:nth-child(5) { transition-delay: 0.3s; }
  .nav-links.open a:nth-child(6) { transition-delay: 0.35s; }
  .nav-links.open a:nth-child(7) { transition-delay: 0.4s; }
}

/* ---------- hero ---------- */
.hero{
  position: relative;
  min-height: 88vh;
  display: flex; align-items: flex-end;
  overflow: hidden;
}
.hero .photo-slot{ position: absolute; inset:0; border-radius:0; border:none; height:100%; }
.hero-content{
  position: relative; z-index: 2;
  padding: clamp(2rem,5vw,4rem) clamp(1.25rem,4vw,2.5rem) clamp(3rem,6vw,5rem);
  color: var(--paper);
  width: 100%;
}
.hero-content h1{ color: var(--paper); }
.hero-content .eyebrow{ color: var(--gold); }
.hero-scroll{
  position: absolute; bottom: 1.6rem; right: clamp(1.25rem,4vw,2.5rem);
  z-index: 2; color: var(--paper); font-size: 0.72rem;
  letter-spacing: 0.2em; text-transform: uppercase;
  writing-mode: vertical-rl;
  opacity: 0.8;
}

.hero-band{
  min-height: 46vh;
  display:flex; align-items:flex-end;
  position: relative;
  overflow: hidden;
}

/* ---------- photo-slot placeholder component ---------- */
.photo-slot{
  position: relative;
  background:
    repeating-linear-gradient(135deg, var(--paper-deep), var(--paper-deep) 12px, #eadfc8 12px, #eadfc8 24px);
  border: 1.5px dashed var(--line-strong);
  border-radius: 6px;
  display: flex; align-items: flex-end;
  min-height: 260px;
  overflow: hidden;
}
.photo-slot .slot-tag{
  margin: 0.9rem;
  background: rgba(38,32,25,0.82);
  color: var(--paper);
  font-size: 0.72rem;
  letter-spacing: 0.05em;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  display: flex; align-items: center; gap: 0.4rem;
}
.photo-slot.dark .slot-tag{ background: rgba(248,243,233,0.85); color: var(--ink); }
.photo-slot::after{
  content: "\\1F4F7";
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%,-50%);
  font-size: 1.6rem; opacity: 0.35;
}
.photo-slot.tall{ aspect-ratio: 4/5; min-height: 0; }
.photo-slot.wide{ aspect-ratio: 16/9; min-height: 0; }
.photo-slot.square{ aspect-ratio: 1/1; min-height: 0; }

/* film / play placeholder */
.film-slot{
  position: relative;
  background: linear-gradient(160deg, #2b241d, #3d3225);
  border-radius: 6px;
  aspect-ratio: 16/9;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.film-slot .play{
  width: 4.2rem; height: 4.2rem; border-radius: 50%;
  border: 1.5px solid rgba(248,243,233,0.7);
  display:flex; align-items:center; justify-content:center;
  color: var(--paper); font-size: 1.3rem;
}
.film-slot .slot-tag{
  position: absolute; bottom: 0.9rem; left: 0.9rem;
  background: rgba(38,32,25,0.7); color: var(--paper);
  font-size: 0.72rem; padding: 0.4rem 0.75rem; border-radius: 999px;
}

/* ---------- layout helpers ---------- */
.section{ padding: clamp(3.5rem,7vw,7rem) 0; }
.section.tight{ padding: clamp(2rem,4vw,3.5rem) 0; }
.section.deep{ background: var(--ink); color: var(--paper); }
.section.deep p{ color: rgba(248,243,233,0.75); }
.section.deep h2, .section.deep h3{ color: var(--paper); }
.section.olive{ background: var(--olive); color: var(--paper); }
.section.olive p{ color: rgba(248,243,233,0.85); }
.section.olive h2{ color: var(--paper); }

.grid-2{ display:grid; grid-template-columns: 1fr 1fr; gap: var(--gap); align-items:center; }
.grid-3{ display:grid; grid-template-columns: repeat(3,1fr); gap: var(--gap); }
.grid-2.rev{ direction: rtl; } .grid-2.rev > *{ direction: ltr; }
@media (max-width: 860px){
  .grid-2, .grid-3{ grid-template-columns: 1fr; }
}

.center{ text-align:center; }
.max-56{ max-width: 56ch; }
.mx-auto{ margin-left:auto; margin-right:auto; }

/* card */
.card{
  display:flex; flex-direction:column; gap: 1rem;
}
.card h3{ margin-bottom: 0.15em; }
.card .meta{ font-size:0.8rem; letter-spacing:0.05em; text-transform:uppercase; color:var(--oxblood); }

/* pills / tags */
.pill-row{ display:flex; flex-wrap:wrap; gap:0.6rem; }
.pill{
  font-size:0.78rem; letter-spacing:0.04em; padding:0.5rem 1.1rem;
  border:1px solid var(--line-strong); border-radius:999px; background:transparent;
  cursor:pointer; color: var(--ink-soft); font-family: var(--sans);
}
.pill.active, .pill:hover{ background: var(--ink); color: var(--paper); border-color: var(--ink); }

/* accordion (client guide) */
details.faq{
  border-bottom: 1px solid var(--line);
  padding: 1.4rem 0;
}
details.faq summary{
  cursor: pointer; list-style:none;
  font-family: var(--serif); font-size:1.15rem; color: var(--ink);
  display:flex; justify-content:space-between; align-items:center; gap:1rem;
}
details.faq summary::-webkit-details-marker{ display:none; }
details.faq summary::after{
  content: "+"; font-size:1.4rem; color: var(--oxblood); transition: transform 0.2s ease;
}
details.faq[open] summary::after{ content:"–"; }
details.faq p{ margin-top:0.9rem; }

/* testimonial */
.testimonial{ max-width: 62ch; margin:0 auto; text-align:center; }
.testimonial .lede{ font-size: clamp(1.2rem,2.4vw,1.7rem); }
.testimonial .who{
  margin-top:1.4rem; font-size:0.8rem; letter-spacing:0.08em; text-transform:uppercase; color: var(--oxblood);
}

/* form */
.form-field{ margin-bottom:1.3rem; display:flex; flex-direction:column; gap:0.4rem; }
.form-field label{ font-size:0.78rem; letter-spacing:0.05em; text-transform:uppercase; color: var(--ink-soft); }
.form-field input, .form-field textarea, .form-field select{
  font-family: var(--sans); font-size:1rem; padding:0.85rem 1rem;
  border:1px solid var(--line-strong); border-radius:4px; background: var(--paper);
  color: var(--ink);
}
.form-field input:focus, .form-field textarea:focus, .form-field select:focus{
  outline: 2px solid var(--oxblood); outline-offset: 1px;
}
.form-row{ display:grid; grid-template-columns:1fr 1fr; gap:1rem 1.4rem; }
@media (max-width:700px){ .form-row{ grid-template-columns:1fr; } }

/* footer */
footer.site-footer{
  background: var(--ink); color: rgba(248,243,233,0.82);
  padding: clamp(3rem,6vw,5rem) 0 2rem;
}
.footer-top{
  display:grid; grid-template-columns: 1.4fr repeat(3, 1fr);
  gap: var(--gap);
  padding-bottom: 2.5rem;
  border-bottom: 1px solid rgba(248,243,233,0.15);
}
.footer-top h4{ color: var(--paper); font-size:0.82rem; letter-spacing:0.08em; text-transform:uppercase; font-family:var(--sans); margin-bottom:1rem; }
.footer-top a{ display:block; color: rgba(248,243,233,0.72); margin-bottom:0.6rem; font-size:0.92rem; }
.footer-top a:hover{ color: var(--gold); }
.footer-brand .logo{ color: var(--paper); }
.footer-brand p{ margin-top:1rem; max-width: 34ch; }
.footer-bottom{
  display:flex; justify-content:space-between; align-items:center;
  padding-top:1.6rem; font-size:0.78rem; color: rgba(248,243,233,0.5);
  flex-wrap: wrap; gap:0.8rem;
}
@media (max-width: 860px){
  .footer-top{ grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px){
  .footer-top{ grid-template-columns: 1fr; }
}

/* utility reveal animation, respects reduced motion */
.reveal{ opacity:0; transform: translateY(16px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.in{ opacity:1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce){
  .reveal{ opacity:1; transform:none; transition:none; }
  html{ scroll-behavior: auto; }
}

/* Knot Divider */
.knot-divider {
  display: flex; align-items: center; justify-content: center;
  margin: 3.5rem auto 1rem auto; width: 90%; max-width: 900px;
}
.knot-divider .line {
  flex: 1; height: 1px; background-color: var(--gold); opacity: 0.35;
}
.knot-divider svg {
  margin: 0 1.2rem; overflow: visible;
}
@keyframes drawLoop {
  0% { stroke-dashoffset: 300; fill: transparent; }
  35% { stroke-dashoffset: 0; fill: transparent; }
  50% { stroke-dashoffset: 0; fill: rgba(176,141,76, 0.15); }
  65% { stroke-dashoffset: 0; fill: transparent; }
  100% { stroke-dashoffset: -300; fill: transparent; }
}
.knot-divider path {
  stroke-dasharray: 300;
  animation: drawLoop 7s infinite ease-in-out;
}



    #testimonial-text p {
      color: rgba(255,255,255,0.95) !important;
    }
  

  :root{
    --ink:#1F231F;
    --ink-2:#262B25;
    --parchment:#F3ECE0;
    --gold:#C7A369;
    --sage:#8C9186;
  }
  .knot-divider-footer{ width:100%; height:56px; }
  .knot-divider-footer path{
    fill:none;
    stroke:var(--gold);
    stroke-width:1;
    stroke-linecap:round;
  }
  .grain-link{ position:relative; }
  .grain-link::after{
    content:'';
    position:absolute; left:0; right:100%; bottom:-4px; height:1px;
    background:var(--gold);
    transition:right 0.35s ease;
  }
  .grain-link:hover::after{ right:0; }
  .ig-tile{ overflow:hidden; }
  .ig-tile img{ transition:transform 0.6s ease; }
  .ig-tile:hover img{ transform:scale(1.06); }
  @media (max-width:768px){
    .knot-divider-footer{ height:40px; }
  }
  .tracked{ letter-spacing:0.18em; }
  .tracked-lg{ letter-spacing:0.28em; }

` }} />
      
{/*  Splash Screen  */}
<div id="splash-screen" style={{"position":"fixed","top":"0","left":"0","width":"100vw","height":"100vh","backgroundColor":"var(--ink)","zIndex":"9999","display":"flex","flexDirection":"column","justifyContent":"center","alignItems":"center","transition":"opacity 0.8s ease-out, visibility 0.8s ease-out"}}>
  <svg viewBox="0 0 100 60" width="80" height="60" style={{"overflow":"visible"}}>
    {/*  Elegant figure-eight infinity knot representing the 'knot'  */}
    <path id="knot-path" d="M 30 50 C 15 50 10 40 10 30 C 10 20 15 10 30 10 C 45 10 55 50 70 50 C 85 50 90 40 90 30 C 90 20 85 10 70 10 C 55 10 45 50 30 50 Z" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
  <div id="splash-text" style={{"marginTop":"25px","textAlign":"center","fontFamily":"var(--sans)","color":"var(--gold)","opacity":"0","transform":"translateY(10px)","transition":"opacity 1s ease-out, transform 1s ease-out"}}>
    <div style={{"letterSpacing":"0.4em","fontSize":"0.85rem","marginBottom":"0.3rem"}}>{siteSettings?.title || 'DKNOTT'}</div>
    {(() => { const _t = (siteSettings?.title || 'DKNOTT'); const _d = (siteSettings?.description || 'PHOTOGRAPHY'); return (_d && !_t.toLowerCase().includes(_d.toLowerCase())) ? (<div style={{"letterSpacing":"0.35em","fontSize":"0.55rem","opacity":"0.75"}}>{_d}</div>) : null; })()}
  </div>
</div>


<header className="site-nav">
  <div className="wrap nav-row">
    <a href="/home" className="logo" style={{"display":"flex","alignItems":"center"}}>
      <img src={sanityImg(siteSettings?.logo) || cloudinaryUrl(commonImages.logos.nav)} onError={handleImageError} alt="DKNOTT Logo" className="brand-logo" />
    </a>
    <nav className="nav-links">
      {navLinksFrom(siteSettings).map((l) => (
        <a key={l.href} href={l.href} className={isActiveLink(l.href, '/home') ? 'active' : undefined}>{l.label}</a>
      ))}
    </nav>
    <div className="nav-cta">
      <button className="nav-toggle" aria-label="Menu">
        <span className="hamburger"></span>
      </button>
    </div>
  </div>
</header>

<section
  className="hero-band relative"
  style={{ minHeight: 'clamp(900px, 165vh, 1650px)' }}
>
  <img
    src={homeData?.heroImage?.secure_url || cloudinaryUrl(commonImages.instagram[0])}
    onError={handleImageError}
    alt={homeData?.heroTitle || 'For the loved'}
    className="absolute inset-0 w-full h-full object-cover z-[-1] brightness-60"
    style={{ objectPosition: 'center top' }}
  />
  <div
    className="hero-content wrap center relative z-10"
    style={{
      color: "white",
      textShadow: "0 2px 12px rgba(0,0,0,0.65)",
      paddingTop: "18vh",
      paddingBottom: "6vh",
      display: "flex",
      flexDirection: "column",
      minHeight: "inherit",
      justifyContent: "space-between"
    }}
  >
    <div>
      <h1 style={{ fontSize: "clamp(3rem,8vw,6rem)", marginBottom: "1rem", color: "#f3f2ee" }}>
        <span style={{ fontStyle: "italic", fontSize: "0.7em", marginRight: "1rem", fontFamily: "'Spectral', serif" }}>
          {homeData?.heroSubtitle || 'for the'}
        </span>
        {homeData?.heroTitle || 'LOVED'}
      </h1>
      <p className="eyebrow" style={{ color: "white", border: "none", letterSpacing: "0.25em", maxWidth: "600px", margin: "0 auto", lineHeight: "1.8" }}>
        {homeData?.heroEyebrow || 'For couples who believe the best moments are the ones that happen naturally.'}
      </p>
    </div>
    <div style={{ marginTop: "auto", paddingTop: "8vh" }}>
      <p style={{ fontFamily: "'Spectral', serif", fontStyle: "italic", fontSize: "1.2rem", marginBottom: "0.5rem", color: "#f3f2ee" }}>{homeData?.heroSignoff || 'Truly yours'}</p>
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#f3f2ee", opacity: "0.85" }}>{homeData?.heroTags || 'CINEMATIC, VISUAL POETRY, STORY TELLING, ROMANTIC'}</p>
    </div>
  </div>
</section>

<section className="section" style={{"padding":"2.5rem 0 1.5rem 0","backgroundColor":"#EBE6E0"}}>
  <div className="wrap center max-56 mx-auto reveal">
    <p className="lede" style={{"lineHeight":"1.8","color":"var(--ink)"}}>
      {homeData?.introBody || `We take the time to truly understand you and your story - the way you laugh together, the quiet moments you share and the love that binds you. This lets us capture your most cherished moments in a way that feels deeply personal and undeniably you.`}
    </p>
  </div>
  
  {/*  Knot Divider  */}
  <div className="knot-divider reveal">
    <div className="line"></div>
    <svg viewBox="0 0 100 60" width="35" height="25">
      <path d="M 30 50 C 15 50 10 40 10 30 C 10 20 15 10 30 10 C 45 10 55 50 70 50 C 85 50 90 40 90 30 C 90 20 85 10 70 10 C 55 10 45 50 30 50 Z" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    <div className="line"></div>
  </div>
</section>

<section className="section min-h-[400px] md:min-h-[600px]" style={{
  backgroundImage: `url(${cloudinaryUrl('DKN_2copy.jpg')})`,
  backgroundSize: "cover",
  backgroundPosition: "center 25%",
  backgroundBlendMode: "overlay",
  backgroundColor: "rgba(53, 50, 47, 0.75)",
  color: "var(--paper)",
  padding: "8rem 1rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"
}}>
  <div className="wrap center reveal">
    <div style={{"display":"flex","flexWrap":"wrap","justifyContent":"center","alignItems":"center","gap":"clamp(2rem, 6vw, 5rem)"}}>
      
      {/* Awards will be added here later */}

    </div>
  </div>
</section>

<section className="section py-8 lg:py-2" style={{"backgroundColor":"#EBE6E0"}}>
  <div className="wrap">
    <div className="center reveal" style={{"marginBottom":"2.5rem"}}>
      <h2 style={{"fontWeight":"400","color":"var(--ink-soft)","fontSize":"2rem"}}>{homeData?.portfolioHeading || `Real wedding Blog's`}</h2>
    </div>
    
    <div className="grid-3 reveal" style={{"alignItems":"start"}}>
      {weddings.length > 0 ? (
        weddings.map((wedding, idx) => (
          <WeddingCardSlideshow key={wedding.id} wedding={wedding} offset={idx} />
        ))
      ) : (
        <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>{homeData?.loadingWeddingsText || 'Loading amazing weddings...'}</p>
      )}
    </div>
  </div>
  
  {/*  Knot Divider  */}
  <div className="knot-divider reveal" style={{"marginTop":"5rem"}}>
    <div className="line"></div>
    <svg viewBox="0 0 100 60" width="35" height="25">
      <path d="M 30 50 C 15 50 10 40 10 30 C 10 20 15 10 30 10 C 45 10 55 50 70 50 C 85 50 90 40 90 30 C 90 20 85 10 70 10 C 55 10 45 50 30 50 Z" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    <div className="line"></div>
  </div>
</section>

<section className="section py-12 lg:py-16" style={{"position":"relative","color":"white","overflow":"hidden","minHeight":"80vh","display":"flex","alignItems":"center","backgroundColor":"transparent"}}>
  
  <img id="testi-bg" src={testimonials[currentTesti].image} onError={handleImageError} alt="Testimonials Background" style={{"position":"absolute","top":"0","left":"0","width":"100%","height":"100%","objectFit":"cover","zIndex":"0","filter":"brightness(0.5)","transition":"opacity 0.4s ease-in-out","opacity": testiFading ? 0 : 1}} />
  <div className="wrap center max-56 mx-auto reveal" style={{"position":"relative","zIndex":"10","width":"100%"}}>
    <span className="meta" style={{"color":"var(--paper)","display":"block","marginBottom":"1rem","fontSize":"0.65rem","letterSpacing":"0.25em","textTransform":"uppercase"}}>{homeData?.testimonialsLabel || 'TESTIMONIALS'}</span>
    
    <div id="testimonial-container" style={{"minHeight":"350px","display":"flex","flexDirection":"column","justifyContent":"center","transition":"opacity 0.4s ease-in-out","opacity": testiFading ? 0 : 1}}>
      <h2 id="testimonial-author" style={{"color":"var(--paper)","fontFamily":"var(--serif)","fontSize":"clamp(2rem, 4vw, 2.8rem)","fontWeight":"400","marginBottom":"1.5rem"}}>
        {testimonials[currentTesti].author}
      </h2>
      <div id="testimonial-text" style={{"fontFamily":"var(--sans)","fontSize":"0.95rem","lineHeight":"1.8","color":"rgba(255,255,255,0.95)","fontWeight":"300"}} dangerouslySetInnerHTML={{__html: testimonials[currentTesti].text}}>
      </div>
    </div>
    
    {/*  Knot Divider replacing hr  */}
    <div className="knot-divider" style={{"margin":"3rem auto 1.5rem auto","width":"100%","maxWidth":"100%"}}>
      <div className="line" style={{"backgroundColor":"rgba(255,255,255,0.4)","opacity":"1"}}></div>
      <svg viewBox="0 0 100 60" width="35" height="25">
        <path d="M 30 50 C 15 50 10 40 10 30 C 10 20 15 10 30 10 C 45 10 55 50 70 50 C 85 50 90 40 90 30 C 90 20 85 10 70 10 C 55 10 45 50 30 50 Z" fill="none" stroke="var(--paper)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div className="line" style={{"backgroundColor":"rgba(255,255,255,0.4)","opacity":"1"}}></div>
    </div>
    
    <div style={{"display":"flex","justifyContent":"center","alignItems":"center","gap":"4rem","fontFamily":"var(--sans)","fontSize":"0.85rem","letterSpacing":"0.15em"}}>
      <span onClick={() => handleTestiChange("prev")} style={{"cursor":"pointer","opacity":"0.7","transition":"opacity 0.3s","padding":"0.5rem","fontSize":"1.2rem","fontFamily":"Arial, sans-serif"}} onMouseOver={(e) => e.currentTarget.style.opacity="1"} onMouseOut={(e) => e.currentTarget.style.opacity="0.7"}>←</span>
      <span id="testi-counter">{currentTesti + 1} &nbsp;/&nbsp; {testimonials.length}</span>
      <span onClick={() => handleTestiChange("next")} style={{"cursor":"pointer","opacity":"0.7","transition":"opacity 0.3s","padding":"0.5rem","fontSize":"1.2rem","fontFamily":"Arial, sans-serif"}} onMouseOver={(e) => e.currentTarget.style.opacity="1"} onMouseOut={(e) => e.currentTarget.style.opacity="0.7"}>→</span>
    </div>
  </div>
</section>



<section className="py-8 md:py-10" style={{"backgroundColor":"#2F2D2C","color":"var(--paper)"}}>
  <div className="wrap grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
    <div className="reveal" style={{"maxWidth":"280px","margin":"0 auto"}}>
      <img src={sanityImg(homeData?.ctaImage) || cloudinaryUrl('gallery_8.jpg')} onError={handleImageError} alt="Celebrating Your Love" style={{"width":"100%","aspectRatio":"3/4","objectFit":"cover","borderRadius":"4px"}} />
    </div>
    <div className="reveal">
      <span className="eyebrow" style={{"marginBottom":"1rem","fontSize":"0.7rem","color":"rgba(255,255,255,0.6)","display":"block","textAlign":"left"}}>{homeData?.ctaEyebrow || 'AS SEEN ON THE COVER OF WEDDING MAGAZINE'}</span>
      <h2 style={{"marginBottom":"1.5rem","color":"var(--paper)","fontSize":"clamp(1.6rem, 3vw, 2.2rem)","textAlign":"left"}}>{homeData?.ctaHeading || 'Celebrating Your Love!'}</h2>
      <div style={{"display":"flex","gap":"1.5rem","fontSize":"0.88rem","fontWeight":"300","lineHeight":"1.8","flexDirection":"column","textAlign":"left"}}>
        <p style={{"color":"#F8F3E9","opacity":"0.95"}}>
          {homeData?.ctaBody || 'Your love story is one of a kind, and we believe your wedding photos should reflect exactly that. We take the time to build a strong connection to truly understand you and your partner\u2014your personalities, your bond, and all the little details that make your relationship special. From our first conversation to the final delivery of your images, our ultimate goal is to document the real, unfiltered moments: the joyful tears, the stolen glances, the raucous laughter, and the quiet, intimate seconds. We are here to tell the beautiful story of your day.'}
        </p>
      </div>
    </div>
  </div>
</section>

<section className="center py-10" style={{"backgroundColor":"var(--paper-deep)"}}>
  <div className="wrap reveal flex flex-col md:flex-row justify-center items-center gap-10 md:gap-24">
    <div className="flex-1 text-center">
      <a href="/real_weddings" style={{"textDecoration":"none"}}>
        <h2 style={{"color":"var(--gold)","marginBottom":"0.5rem","transition":"opacity 0.3s"}} onMouseOver={(e) => e.currentTarget.style.opacity="0.7"} onMouseOut={(e) => e.currentTarget.style.opacity="1"}>REAL<br />WEDDINGS</h2>
        <span className="meta">{homeData?.viewGalleryLabel || 'VIEW GALLERY'}</span>
      </a>
    </div>
    <div className="hidden md:block w-px h-24" style={{"backgroundColor":"var(--line-strong)"}}></div>
    <div className="flex-1 text-center">
      <a href="/contact" style={{"textDecoration":"none"}}>
        <h2 style={{"color":"var(--gold)","marginBottom":"0.5rem","transition":"opacity 0.3s"}} onMouseOver={(e) => e.currentTarget.style.opacity="0.7"} onMouseOut={(e) => e.currentTarget.style.opacity="1"}>{homeData?.contactUsHeading || 'CONTACT US'}</h2>
        <span className="meta">{homeData?.bookDateLabel || 'BOOK YOUR DATE'}</span>
      </a>
    </div>
  </div>
</section>



<footer style={{"background":"var(--ink)","color":"var(--parchment)"}} className="pt-10 pb-4">
  <div className="max-w-6xl mx-auto px-6">
 {/*  Instagram Grid  */}
    <div className="mt-12 mb-4">
      <div className="flex justify-center flex-wrap" style={{"gap":"clamp(1rem, 2.5vw, 2.5rem)"}}>
        {(siteSettings?.instagramStripImages?.length
          ? siteSettings.instagramStripImages.map((img) => sanityImg(img))
          : [commonImages.instagram[0], commonImages.instagram[1], commonImages.heroes.realWeddings, commonImages.instagram[3], commonImages.instagram[4]].map((k) => cloudinaryUrl(k))
        ).map((url, i) => (
          <a key={i} href={siteSettings?.instagramUrl || "https://www.instagram.com/dknottphotography"} target="_blank" rel="noopener noreferrer" className="ig-tile relative block" style={{"width":"clamp(100px, 16%, 180px)","aspectRatio":"3/4","borderRadius":"4px"}}>
            <img src={url} onError={handleImageError} className="w-full h-full object-cover rounded-sm" alt={`Instagram ${i + 1}`} />
          </a>
        ))}
      </div>
    </div>
    {/* Main Knot Divider */}
    <div className="footer-main-knot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', margin: '2.5rem auto 1.5rem auto' }}>
      <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--gold)', opacity: 0.35 }} />
      <svg viewBox="0 0 100 60" width="36" height="24" style={{ margin: '0 1.25rem', overflow: 'visible', flexShrink: 0 }}>
        <path d="M 30 50 C 15 50 10 40 10 30 C 10 20 15 10 30 10 C 45 10 55 50 70 50 C 85 50 90 40 90 30 C 90 20 85 10 70 10 C 55 10 45 50 30 50 Z" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--gold)', opacity: 0.35 }} />
    </div>

    {/*  Main grid: brand + nav + contact  */}
    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mt-8">

      {/*  Brand  */}
      <div className="md:col-span-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-full flex items-center justify-center overflow-hidden" style={{"background":"var(--paper)","border":"1px solid rgba(199,163,105,0.3)"}}>
            <img src={sanityImg(siteSettings?.logo) || cloudinaryUrl(commonImages.logos.large)} onError={handleImageError} alt="DKNOTT" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm tracked" style={{"color":"var(--parchment)"}}>{siteSettings?.title || 'DKNOTT'}</p>
            {(() => { const _t = (siteSettings?.title || 'DKNOTT'); const _d = (siteSettings?.description || 'PHOTOGRAPHY'); return (_d && !_t.toLowerCase().includes(_d.toLowerCase())) ? (<p className="text-[10px] tracked" style={{"color":"var(--sage)"}}>{_d}</p>) : null; })()}
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{"color":"var(--sage)","maxWidth":"32ch"}}>
          {siteSettings?.footerTagline || 'Documentary wedding photography and film, shot across India — quiet moments, kept honestly.'}
        </p>
      </div>

      {/*  Navigate  */}
      <div className="md:col-span-4">
        <p className="text-[11px] tracked-lg uppercase mb-5" style={{"color":"var(--gold)"}}>{siteSettings?.footerNavHeading || 'Navigate'}</p>
        <ul className="space-y-3 text-sm">
          {(siteSettings?.footerNavLinks?.length ? siteSettings.footerNavLinks : navLinksFrom(siteSettings)).map((l, i) => (
            <li key={i}><a href={l.href} className="grain-link" style={{"color":"var(--parchment)"}}>{l.label}</a></li>
          ))}
        </ul>
      </div>

      {/*  Contact  */}
      <div className="md:col-span-3">
        <p className="text-[11px] tracked-lg uppercase mb-5" style={{"color":"var(--gold)"}}>{siteSettings?.footerStudioHeading || 'Studio'}</p>
        <ul className="space-y-3 text-sm" style={{"color":"var(--parchment)"}}>
          <li>{siteSettings?.contactAddress || 'Hyderbad, India'}</li>
          <li>{siteSettings?.contactEmail || 'dknottphotography3@gmail.com'}</li>
          <li>{siteSettings?.contactPhone || '+91 91107 08256'}</li>
        </ul>
      </div>

    </div>

       

    {/*  CTA line  */}
    <div className="text-center mt-10">
      <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(1.6rem, 3vw, 2.75rem)', lineHeight: 1.3, color: 'var(--parchment)', margin: 0 }}>
        {siteSettings?.footerCtaLine1 || 'Every knot tells a story.'}<br className="hidden md:block" /> {siteSettings?.footerCtaLine2 || "Let's start yours."}
      </p>
      <a href={siteSettings?.footerCtaHref || "/contact"} className="inline-block mt-6 text-xs tracked-lg uppercase grain-link" style={{"color":"var(--gold)"}}>
        {siteSettings?.footerCtaButton || 'Enquire about your date'}
      </a>
    </div>

    {/*  Bottom bar  */}
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-10 pt-4" style={{"borderTop":"1px solid rgba(199,163,105,0.15)"}}>
      <p className="text-xs" style={{"color":"var(--sage)"}}>{siteSettings?.footerText || '© 2026 DKNOTT Photography. All rights reserved.'}</p>
      <div className="flex items-center gap-6">
         <a href={siteSettings?.instagramUrl || "https://www.instagram.com/dknottphotography"} className="text-xs tracked" style={{"color":"var(--parchment)","opacity":"0.8","transition":"opacity 0.3s","padding":"0.2rem"}} onMouseOver={(e) => e.currentTarget.style.opacity="1"} onMouseOut={(e) => e.currentTarget.style.opacity="0.8"} aria-label="Instagram">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        </a>
        <a href={siteSettings?.pinterestUrl || "https://www.pinterest.com/dknottphotography"} className="text-xs tracked" style={{"color":"var(--parchment)","opacity":"0.8","transition":"opacity 0.3s","padding":"0.2rem"}} onMouseOver={(e) => e.currentTarget.style.opacity="1"} onMouseOut={(e) => e.currentTarget.style.opacity="0.8"} aria-label="Pinterest">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.163 0 7.398 2.967 7.398 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
        </a>
        <button onClick={() => window.scrollTo({top:0,behavior:"smooth"})} className="w-8 h-8 rounded-full flex items-center justify-center transition" style={{"border":"1px solid rgba(199,163,105,0.3)","color":"var(--gold)"}} aria-label={siteSettings?.backToTopLabel || "Back to top"}>
          ↑
        </button>
      </div>
    </div>

  </div>
</footer>



    </>
  );
}
