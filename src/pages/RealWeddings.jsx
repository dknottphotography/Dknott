import React, { useEffect, useState, useRef } from 'react';
import { cloudinaryUrl, handleImageError } from '../lib/cloudinary';
import { commonImages, weddingGalleries } from '../data/images';
import { supabase } from '../lib/supabaseClient';
import { client } from '../sanity';
import { useSanityDoc } from '../lib/useSanityDoc';
import { sanityImg, normalizeWeddings } from '../lib/sanityContent';
import { navLinksFrom, isActiveLink } from '../lib/siteContent';

const PermanentImage = ({ src, alt, className }) => {
    const [hasTriggered, setHasTriggered] = useState(false);
    const ref = useRef();

    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setHasTriggered(true);
                observer.disconnect();
            }
        }, { rootMargin: '600px' });
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={className} style={{ width: '100%' }}>
            {hasTriggered ? (
                <img
                    src={cloudinaryUrl(src)}
                    onError={handleImageError}
                    alt={alt}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            ) : (
                <div style={{ width: '100%', minHeight: '260px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} />
            )}
        </div>
    );
};

const WeddingCard = ({ wedding, isVisible, onOpen }) => {
  // Collect all unique photos for this couple
  const allImages = React.useMemo(() => {
    const list = [];
    if (wedding.coverImage) list.push(wedding.coverImage);
    if (wedding.photos) {
      Object.values(wedding.photos).forEach(arr => {
        if (Array.isArray(arr)) {
          arr.forEach(img => {
            if (img && !list.includes(img)) list.push(img);
          });
        }
      });
    }
    return list.length > 0 ? list : [wedding.coverImage];
  }, [wedding]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Controlled slideshow lifecycle via useEffect - guaranteed cleanup when isHovered changes
  useEffect(() => {
    if (!isHovered || allImages.length <= 1) {
      setCurrentIndex(0);
      return;
    }

    // Preload next few photos for immediate smooth rendering
    allImages.slice(1, 6).forEach(img => {
      const preload = new Image();
      preload.src = cloudinaryUrl(img);
    });

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % allImages.length;
        const upcoming = allImages[(next + 1) % allImages.length];
        if (upcoming) {
          const preload = new Image();
          preload.src = cloudinaryUrl(upcoming);
        }
        return next;
      });
    }, 2200); // Reduced speed: 2.2s per slide (calm, elegant pace)

    return () => {
      clearInterval(interval);
    };
  }, [isHovered, allImages]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentIndex(0);
  };

  const isLandscape = wedding.coverImage && typeof wedding.coverImage === 'string' && wedding.coverImage.includes('DKN_7783');
  const cardAspectRatio = isLandscape ? '3/2' : '2/3';

  return (
    <a
      key={wedding.id}
      className="card"
      href="#"
      onClick={(e) => {
        setIsHovered(false);
        onOpen(wedding, e);
      }}
      onMouseLeave={handleMouseLeave}
      style={{ display: isVisible ? 'flex' : 'none', cursor: 'pointer' }}
    >
      <div
        className="card-img-wrap"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          aspectRatio: cardAspectRatio,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '4px',
          background: 'var(--paper-deep)',
        }}
      >
        <img
          src={cloudinaryUrl(allImages[currentIndex])}
          onError={handleImageError}
          alt={`${wedding.title} - photo ${currentIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Hover slideshow indicator badge */}
        {isHovered && allImages.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              background: 'rgba(26, 22, 19, 0.82)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(199, 163, 105, 0.4)',
              color: 'var(--parchment, #F3ECE0)',
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              fontWeight: 500,
              padding: '0.28rem 0.65rem',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--gold, #C7A369)',
                display: 'inline-block',
                boxShadow: '0 0 6px rgba(199, 163, 105, 0.8)',
              }}
            />
            <span>
              {String(currentIndex + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      <span className="meta">
        {wedding.location || ''} {wedding.tags ? `· ${wedding.tags}` : ''}
      </span>
      <h3>{wedding.title}</h3>
      <p>{wedding.description}</p>
    </a>
  );
};


export default function RealWeddings() {
  const [weddings, setWeddings] = useState(weddingGalleries);
  const { data: settings } = useSanityDoc('siteSettings');
  const { data: pageData } = useSanityDoc('realWeddingsPage');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedWedding, setSelectedWedding] = useState(null);
  const [galleryData, setGalleryData] = useState({});
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (slideshowActive && galleryData[activeTab] && galleryData[activeTab].length > 1) {
      interval = setInterval(() => {
        setCurrentSlideIndex(prev => prev < galleryData[activeTab].length - 1 ? prev + 1 : 0);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [slideshowActive, currentSlideIndex, activeTab, galleryData]);
  const openGallery = async (wedding, e) => {
    e.preventDefault();
    setSelectedWedding(wedding);
    setLoadingGallery(true);
    
    // Instead of fetching from Supabase, we use the local static manifest data
    let newGalleryData = wedding.photos || {};
    
    setGalleryData(newGalleryData);
    if (Object.keys(newGalleryData).length > 0) {
        setActiveTab(Object.keys(newGalleryData)[0]);
    } else {
        setActiveTab('');
    }
    setLoadingGallery(false);
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const openId = params.get('open');
    if (openId && weddings.length && !window.__rwOpened) {
      const targetWedding = weddings.find(g => g.id === openId);
      if (targetWedding) {
        window.__rwOpened = true;
        openGallery(targetWedding, { preventDefault: () => {} });
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [weddings]);


  // Weddings from Sanity (realWedding documents) with built-in fallback.
  useEffect(() => {
    client.fetch('*[_type == "realWedding"] | order(_createdAt desc)')
      .then((docs) => {
        const list = normalizeWeddings(docs);
        if (list.length) setWeddings(list);
      })
      .catch((err) => console.warn('Sanity weddings skipped (using fallback):', err?.message || err));
  }, []);
  useEffect(() => {
    if (window.__RealWeddingsScriptLoaded) return;
    window.__RealWeddingsScriptLoaded = true;

    
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

  const filterWeddings = (e, filter) => {
    e.preventDefault();
    setActiveFilter(filter);
  };

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
.rw-hero-img {
  object-position: 88% center;
}
@media (min-width: 768px) {
  .rw-hero-img {
    object-position: center center;
  }
}
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
.grid-3{ display:grid; grid-template-columns: repeat(3,1fr); gap: var(--gap); align-items: start; }
.grid-2.rev{ direction: rtl; } .grid-2.rev > *{ direction: ltr; }
@media (max-width: 860px){
  .grid-2{ grid-template-columns: 1fr; }
  .grid-3{ grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 580px){
  .grid-3{ grid-template-columns: 1fr; }
}

.center{ text-align:center; }
.max-56{ max-width: 56ch; }
.mx-auto{ margin-left:auto; margin-right:auto; }

/* card */
.card{
  display:flex; flex-direction:column; gap: 0.75rem;
  transition: transform 0.3s ease;
}
.card:hover{
  transform: translateY(-4px);
}
.card-img-wrap{
  width: 100%;
  overflow: hidden;
  border-radius: 4px;
  background: var(--paper-deep);
  margin-bottom: 0.35rem;
}
.card-img-wrap img{
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.card:hover .card-img-wrap img{
  transform: scale(1.03);
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


.photo-gallery-grid {
    column-count: 3;
    column-gap: 16px;
}
@media (max-width: 900px) {
    .photo-gallery-grid {
        column-count: 2;
        column-gap: 12px;
    }
}
@media (max-width: 540px) {
    .photo-gallery-grid {
        column-count: 1;
        column-gap: 0;
    }
}
.gallery-item-wrapper {
    break-inside: avoid;
    margin-bottom: 16px;
    overflow: hidden;
    cursor: zoom-in;
    position: relative;
    border-radius: 4px;
    background: rgba(255,255,255,0.04);
}
@media (max-width: 900px) {
    .gallery-item-wrapper {
        margin-bottom: 12px;
    }
}
.gallery-item-wrapper img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 4px;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
.gallery-item-wrapper:hover img {
    transform: scale(1.025);
}

@keyframes slideFadeIn {
  from { opacity: 0.55; }
  to { opacity: 1; }
}
.wedding-hover-slide {
  animation: slideFadeIn 0.35s ease-out;
}

/* utility reveal animation, respects reduced motion */
.reveal{ opacity:0; transform: translateY(16px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.in{ opacity:1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce){
  .reveal{ opacity:1; transform:none; transition:none; }
  html{ scroll-behavior: auto; }
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
      

<header className="site-nav">
  <div className="wrap nav-row">
    <a href="/home" className="logo" style={{"display":"flex","alignItems":"center"}}>
      <img src={sanityImg(settings?.logo) || cloudinaryUrl(commonImages.logos.nav)} onError={handleImageError} alt="DKNOTT Logo" className="brand-logo" />
    </a>
    <nav className="nav-links">
      {navLinksFrom(settings).map((l) => (
        <a key={l.href} href={l.href} className={isActiveLink(l.href, '/real_weddings') ? 'active' : undefined}>{l.label}</a>
      ))}
    </nav>
    <div className="nav-cta">
      <button className="nav-toggle" aria-label="Menu">
        <span className="hamburger"></span>
      </button>
    </div>
  </div>
</header>

<section className="relative w-full overflow-hidden flex items-center h-[65vh] min-h-[480px] md:h-[75vh] md:min-h-[580px] lg:h-[82vh] lg:min-h-[640px] pt-28 md:pt-36 pb-12 md:pb-16">
  <img
    src={sanityImg(pageData?.heroImage) || cloudinaryUrl(commonImages.heroes.realWeddings || 'https://res.cloudinary.com/ddcwf9ji/image/upload/v1790350983/_ANV9169_1.jpg')}
    onError={handleImageError}
    alt="Real Weddings Hero"
    className="rw-hero-img absolute inset-0 w-full h-full object-cover object-[88%_center] md:object-center brightness-[0.9] z-0 transition-all duration-300"
  />
  <div className="absolute top-0 left-0 right-0 h-28 md:h-36 bg-gradient-to-b from-black/50 via-black/15 to-transparent z-[1] pointer-events-none" />
  <div className="wrap relative z-10 w-full" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
    <div className="max-w-md lg:max-w-lg">
      <span className="eyebrow" style={{ color: 'white', borderColor: 'white' }}>{pageData?.heroEyebrow || 'Real Weddings'}</span>
      <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#ffffff' }}>{pageData?.heroHeading || 'Stories, not just galleries.'}</h1>
    </div>
  </div>
</section>

<section className="section tight">
  <div className="wrap">
    <div className="pill-row reveal" style={{"marginBottom":"2.5rem"}}>
      <button className={`pill ${activeFilter === 'all' ? 'active' : ''}`} onClick={(e) => filterWeddings(e, 'all')}>{pageData?.filterAllLabel || 'All'}</button>
      <button className={`pill ${activeFilter === 'destination' ? 'active' : ''}`} onClick={(e) => filterWeddings(e, 'destination')}>{pageData?.filterDestinationLabel || 'Destination'}</button>
      <button className={`pill ${activeFilter === 'traditional' ? 'active' : ''}`} onClick={(e) => filterWeddings(e, 'traditional')}>{pageData?.filterTraditionalLabel || 'Traditional'}</button>
      <button className={`pill ${activeFilter === 'intimate' ? 'active' : ''}`} onClick={(e) => filterWeddings(e, 'intimate')}>{pageData?.filterIntimateLabel || 'Intimate'}</button>
    </div>

    <div className="grid-3" id="dynamic-weddings-grid">
      {weddings.length > 0 ? (
        weddings.map((wedding) => {
          const tags = wedding.tags ? wedding.tags.split(',') : [];
          const isVisible = activeFilter === 'all' || tags.includes(activeFilter);
          return (
            <WeddingCard
              key={wedding.id}
              wedding={wedding}
              isVisible={isVisible}
              onOpen={openGallery}
            />
          );
        })
      ) : (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--ink-soft)' }}>{pageData?.emptyStateText || 'No weddings yet \u2014 add them in Sanity Studio and they will appear here.'}</p>
        </div>
      )}
    </div>
  </div>
</section>

<section className="section olive center">
  <div className="wrap reveal">
    <h2 style={{"color":"var(--paper)"}}>{pageData?.ctaHeading || 'Want your wedding here next?'}</h2>
    <a href={pageData?.ctaButtonHref || "/contact"} className="btn" style={{"borderColor":"var(--paper)","color":"var(--paper)","marginTop":"0.5rem"}}>{pageData?.ctaButtonLabel || 'Start an inquiry'}</a>
  </div>
</section>



<footer style={{"background":"var(--ink)","color":"var(--parchment)"}} className="pt-10 pb-4">
  <div className="max-w-6xl mx-auto px-6">

    {/*  Instagram Grid  */}
    <div className="mt-12 mb-4">
      <div className="flex justify-center flex-wrap" style={{"gap":"clamp(1rem, 2.5vw, 2.5rem)"}}>
        {(settings?.instagramStripImages?.length
          ? settings.instagramStripImages.map((img) => sanityImg(img))
          : [commonImages.instagram[0], commonImages.instagram[1], commonImages.heroes.realWeddings, commonImages.instagram[3], commonImages.instagram[4]].map((k) => cloudinaryUrl(k))
        ).map((url, i) => (
          <a key={i} href={"#"} className="ig-tile relative block" style={{"width":"clamp(100px, 16%, 180px)","aspectRatio":"3/4","borderRadius":"4px"}}>
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
            <img src={sanityImg(settings?.logo) || cloudinaryUrl(commonImages.logos.large)} onError={handleImageError} alt="DKNOTT" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm tracked" style={{"color":"var(--parchment)"}}>{settings?.title || 'DKNOTT'}</p>
            <p className="text-[10px] tracked" style={{"color":"var(--sage)"}}>{settings?.description || 'PHOTOGRAPHY'}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{"color":"var(--sage)","maxWidth":"32ch"}}>
          {settings?.footerTagline || 'Documentary wedding photography and film, shot across India — quiet moments, kept honestly.'}
        </p>
      </div>

      {/*  Navigate  */}
      <div className="md:col-span-4">
        <p className="text-[11px] tracked-lg uppercase mb-5" style={{"color":"var(--gold)"}}>{settings?.footerNavHeading || 'Navigate'}</p>
        <ul className="space-y-3 text-sm">
          {(settings?.footerNavLinks?.length ? settings.footerNavLinks : navLinksFrom(settings)).map((l) => (
            <li key={l.href}><a href={l.href} className="grain-link" style={{"color":"var(--parchment)"}}>{l.label}</a></li>
          ))}
        </ul>
      </div>

      {/*  Contact  */}
      <div className="md:col-span-3">
        <p className="text-[11px] tracked-lg uppercase mb-5" style={{"color":"var(--gold)"}}>{settings?.footerStudioHeading || 'Studio'}</p>
        <ul className="space-y-3 text-sm" style={{"color":"var(--parchment)"}}>
          <li>{settings?.contactAddress || 'Hyderabad, India'}</li>
          <li>{settings?.contactEmail || 'dknottphotography3@gmail.com'}</li>
          <li>{settings?.contactPhone || '+91 91107 08256'}</li>
        </ul>
      </div>

    </div>

        

    {/*  CTA line  */}
    <div className="text-center mt-10">
      <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(1.6rem, 3vw, 2.75rem)', lineHeight: 1.3, color: 'var(--parchment)', margin: 0 }}>
        {settings?.footerCtaLine1 || 'Every knot tells a story.'}<br className="hidden md:block" /> {settings?.footerCtaLine2 || "Let's start yours."}
      </p>
      <a href={settings?.footerCtaHref || "/contact"} className="inline-block mt-6 text-xs tracked-lg uppercase grain-link" style={{"color":"var(--gold)"}}>
        {settings?.footerCtaButton || 'Enquire about your date'}
      </a>
    </div>

    {/*  Bottom bar  */}
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-10 pt-4" style={{"borderTop":"1px solid rgba(199,163,105,0.15)"}}>
      <p className="text-xs" style={{"color":"var(--sage)"}}>{settings?.footerText || '© 2026 DKNOTT Photography. All rights reserved.'}</p>
      <div className="flex items-center gap-6">
        <a href={settings?.instagramUrl || 'https://www.instagram.com/dknottphotography'} className="text-xs tracked" style={{"color":"var(--parchment)","opacity":"0.8","transition":"opacity 0.3s","padding":"0.2rem"}} onMouseOver={(e) => e.currentTarget.style.opacity="1"} onMouseOut={(e) => e.currentTarget.style.opacity="0.8"} aria-label="Instagram">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        </a>
        <a href={settings?.pinterestUrl || 'https://www.pinterest.com/dknottphotography'} className="text-xs tracked" style={{"color":"var(--parchment)","opacity":"0.8","transition":"opacity 0.3s","padding":"0.2rem"}} onMouseOver={(e) => e.currentTarget.style.opacity="1"} onMouseOut={(e) => e.currentTarget.style.opacity="0.8"} aria-label="Pinterest">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.163 0 7.398 2.967 7.398 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
        </a>
        <button onClick={() => window.scrollTo({top:0,behavior:"smooth"})} className="w-8 h-8 rounded-full flex items-center justify-center transition" style={{"border":"1px solid rgba(199,163,105,0.3)","color":"var(--gold)"}} aria-label="Back to top">
          ↑
        </button>
      </div>
    </div>

  </div>
</footer>





      {selectedWedding && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(31,35,31,0.98)', overflowY: 'auto' }}>
          <div style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto', color: 'var(--paper)', minHeight: '100vh' }}>
            <button onClick={() => setSelectedWedding(null)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: 'white', fontSize: '2.5rem', cursor: 'pointer', zIndex: 10000, lineHeight: 1 }}>&times;</button>
            
            <h2 style={{ color: 'var(--paper)', textAlign: 'center', marginBottom: '2rem', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>{selectedWedding.title}</h2>
            
            {loadingGallery ? (
                <p style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading gallery...</p>
            ) : (
                <>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
                  </div>
                  
                  {Object.keys(galleryData).map(tab => (
                      <div key={tab} className="photo-gallery-grid" style={{ display: activeTab === tab ? 'block' : 'none' }}>
                          {galleryData[tab]?.map((url, i) => (
                              <div key={`${tab}-${i}`} onClick={() => { setCurrentSlideIndex(i); setSlideshowActive(true); }} className="gallery-item-wrapper">
                                  <PermanentImage src={url} alt={`${selectedWedding.title} ${tab} photo ${i+1}`} className="gallery-item-inner" />
                              </div>
                          ))}
                      </div>
                  ))}
                  
                  {slideshowActive && galleryData[activeTab] && (
                      <div style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                          <button onClick={() => setSlideshowActive(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white', fontSize: '2.5rem', cursor: 'pointer', zIndex: 10 }}>&times;</button>
                          
                          <div style={{ position: 'relative', width: '100%', height: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <img src={cloudinaryUrl(galleryData[activeTab][currentSlideIndex])} onError={handleImageError} alt={`Slide ${currentSlideIndex + 1}`} style={{ maxWidth: '90%', maxHeight: '100%', objectFit: 'contain', userSelect: 'none' }} />
                              
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
                  )}
                  
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
}
