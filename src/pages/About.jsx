import React, { useEffect, useState, useRef } from 'react';
import { cloudinaryUrl, handleImageError } from '../lib/cloudinary';
import { commonImages, weddingGalleries } from '../data/images';
import { client } from '../sanity';
import { useSanityDoc } from '../lib/useSanityDoc';
import { sanityImg } from '../lib/sanityContent';
import { navLinksFrom, isActiveLink } from '../lib/siteContent';

/* ─── Default Testimonials ──────────────────────────────── */
const DEFAULT_NOTES = [
  {
    couple: '',
    quote:
      'One of the best decisions I made during my wedding was to hire the team "DKNOTT" to document it..! They have got an eye for detail and leave no stone unturned when it comes to client satisfaction! It was easy to work with them as they easily blend with the circumstances and I couldn\'t be happier about it. And when I received the pictures, god was I flabbergasted? They were unreal...',
    photoKey: commonImages.testimonials[0],
  },
  {
    couple: '',
    quote:
      'We forgot the camera was there by the time the pheras started. The photographs look the way the morning felt. Candid, vibrant and filled with authentic emotions that we will cherish for a lifetime.',
    photoKey: commonImages.testimonials[1],
  },
  {
    couple: '',
    quote:
      'They knew when to step back. Our parents cried over the album, and nobody had been asked to pose. Every little glance and unspoken expression was captured flawlessly.',
    photoKey: commonImages.testimonials[2],
  },
];

/* ─── Default Wedding Films ─────────────────────────────── */
const DEFAULT_FILMS = [
  {
    id: 'Yv0VLdyL48A',
    title: 'Ellen & Yashwanth',
    subtitle: 'A Story of Love, Family & Forever',
    thumb: 'https://img.youtube.com/vi/Yv0VLdyL48A/maxresdefault.jpg',
  },
  {
    id: '9MEn1gGmhSk',
    title: 'Keerthana & Rohit',
    subtitle: 'A Beautiful Story',
    thumb: 'https://img.youtube.com/vi/9MEn1gGmhSk/maxresdefault.jpg',
  },
  {
    id: 'n-vDqrvE3pE',
    title: 'Shagufta & Fakruddin',
    subtitle: 'A Tale of Two Hearts',
    thumb: 'https://img.youtube.com/vi/n-vDqrvE3pE/maxresdefault.jpg',
  },
  {
    id: 'h_29GN4KmGA',
    title: 'Manasa & Gokul',
    subtitle: 'A Lifetime of Love',
    thumb: 'https://img.youtube.com/vi/h_29GN4KmGA/maxresdefault.jpg',
  },
  {
    id: 't7uP9MAi95w',
    title: 'Eternity Begins Here',
    subtitle: 'DKNOTT Wedding Film',
    thumb: 'https://img.youtube.com/vi/t7uP9MAi95w/maxresdefault.jpg',
  },
  {
    id: 'FTMGzM3a_bQ',
    title: 'Manasa & Satya',
    subtitle: 'A Magical Journey',
    thumb: 'https://img.youtube.com/vi/FTMGzM3a_bQ/maxresdefault.jpg',
  },
  {
    id: 'MU8-UZqwLbg',
    title: 'Ellen & Yashwanth',
    subtitle: 'Two Souls, One Destiny',
    thumb: 'https://img.youtube.com/vi/MU8-UZqwLbg/maxresdefault.jpg',
  },
  {
    id: 'yBdqMz6HGdQ',
    title: 'Deepthi & Sridhar',
    subtitle: 'The Promise of Forever',
    thumb: 'https://img.youtube.com/vi/yBdqMz6HGdQ/hqdefault.jpg',
  },
  {
    id: '6hxO16zNFt8',
    title: 'Babitha & Aashish',
    subtitle: 'A Symphony of Love',
    thumb: 'https://img.youtube.com/vi/6hxO16zNFt8/maxresdefault.jpg',
  },
  {
    id: 'B0LxWgSVmDk',
    title: 'Likita & Sowrab',
    subtitle: 'Timeless Memories',
    thumb: 'https://img.youtube.com/vi/B0LxWgSVmDk/maxresdefault.jpg',
  },
  {
    id: 'fwgTuWTTo6A',
    title: 'Manisha & Vinay',
    subtitle: 'A New Chapter Begins',
    thumb: 'https://img.youtube.com/vi/fwgTuWTTo6A/maxresdefault.jpg',
  },
  {
    id: 'ACUqAGBVDfE',
    title: 'Manisha & Vinay',
    subtitle: 'Written in the Stars',
    thumb: 'https://img.youtube.com/vi/ACUqAGBVDfE/maxresdefault.jpg',
  },
  {
    id: 'ERexGO78QMQ',
    title: 'Shagufta & Fakruddin',
    subtitle: 'A Love Like No Other',
    thumb: 'https://img.youtube.com/vi/ERexGO78QMQ/maxresdefault.jpg',
  },
  {
    id: '087tG7pcFRI',
    title: 'Manisha & Vinay',
    subtitle: 'Our Forever Starts Now',
    thumb: 'https://img.youtube.com/vi/087tG7pcFRI/maxresdefault.jpg',
  },
  {
    id: '6iwa4bN6fBM',
    title: 'Gayathri The Bride',
    subtitle: 'A Cinematic Fairytale',
    thumb: 'https://img.youtube.com/vi/6iwa4bN6fBM/maxresdefault.jpg',
  },
];

export default function About() {
  const [pageData, setPageData] = useState(null);
  const { data: settings } = useSanityDoc('siteSettings');
  const [noteIdx,  setNoteIdx]  = useState(0);
  const [isPausedNotes, setIsPausedNotes] = useState(false);
  const [filmIdx,  setFilmIdx]  = useState(0);
  const [isPausedFilms, setIsPausedFilms] = useState(false);
  const [isPlayingFilm, setIsPlayingFilm] = useState(false);
  const [showcaseIdx, setShowcaseIdx] = useState(0);
  const [isPausedShowcase, setIsPausedShowcase] = useState(false);
  const touchStartX = useRef(null);
  const [blogIdx, setBlogIdx] = useState(1);
  const [enableBlogTransition, setEnableBlogTransition] = useState(true);
  const [isPausedBlog, setIsPausedBlog] = useState(false);
  const touchBlogStartX = useRef(null);
  const isBlogTransitioning = useRef(false);
  const heroRef = useRef(null);


  /* Sanity */
  useEffect(() => {
    client.fetch('*[_type == "aboutPage"][0]')
      .then(d => { if (d) setPageData(d); })
      .catch(err => {
        console.warn('Sanity fetch skipped (using fallback content):', err?.message || err);
      });
  }, []);

  /* Nav toggle + scroll reveal (standard across the site) */
  useEffect(() => {
    if (window.__AboutScriptLoaded) return;
    window.__AboutScriptLoaded = true;
    setTimeout(() => {
      const toggle = document.querySelector('.nav-toggle');
      const links  = document.querySelector('.nav-links');
      if (toggle && links) {
        toggle.addEventListener('click', () => {
          links.classList.toggle('open');
          toggle.classList.toggle('open');
        });
        links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
          links.classList.remove('open');
          toggle.classList.remove('open');
        }));
      }
      const revealEls = document.querySelectorAll('.reveal');
      if ('IntersectionObserver' in window && revealEls.length) {
        const io = new IntersectionObserver(
          entries => entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
          }),
          { threshold: 0.1 }
        );
        revealEls.forEach(el => io.observe(el));
      } else {
        revealEls.forEach(el => el.classList.add('in'));
      }
    }, 150);
  }, []);

  /* Derived content */
  const heroSrc = pageData?.heroImage?.secure_url || cloudinaryUrl(commonImages.heroes.about || 'https://res.cloudinary.com/ddcwf9ji/image/upload/v1790328883/RSR_3555_1.jpg');
  const aboutPhoto = pageData?.aboutPhoto?.secure_url || commonImages.aboutPhoto || 'https://res.cloudinary.com/ddcwf9ji/image/upload/v1790147838/DKN_13.jpg_1.jpg';
  const aboutTitle = pageData?.aboutTitle || 'ABOUT US';
  const aboutSubtitle = pageData?.aboutSubtitle || 'PHOTOGRAPHY BY DKNOTT';
  const aboutBody = pageData?.aboutBody || 'At DKNOTT, we are passionate about preserving the raw, unscripted moments that unfold throughout your special day — the stolen glances, the tears of joy, and the shared laughter that speak volumes without words.\n\nOur mission is to transform these fleeting moments into beautiful, everlasting memories that you can cherish for a lifetime. With a blend of artistry and empathy, we go beyond mere documentation to create a visual narrative that reflects the unique spirit of your love.\n\nWe believe the best wedding photographs are the ones nobody had to pose for. We work across India — and wherever love takes us.';

  const tagline = pageData?.tagline || 'Experience the magic of your love story\nthrough our lens!';

  const showcaseImages = (pageData?.showcaseImages && pageData.showcaseImages.length)
    ? pageData.showcaseImages.map(img => img.secure_url || (typeof img === 'string' ? img : ''))
    : (commonImages.aboutShowcase || []);

  const totalShowcase = showcaseImages.length;
  const prevShowcase = () => setShowcaseIdx(i => (i - 1 + totalShowcase) % totalShowcase);
  const nextShowcase = () => setShowcaseIdx(i => (i + 1) % totalShowcase);

  /* Auto-advance SHOWCASE images continuously left-to-right, paused on hover */
  useEffect(() => {
    if (isPausedShowcase || totalShowcase <= 1) return;
    const timer = setInterval(() => {
      setShowcaseIdx(i => (i + 1) % totalShowcase);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPausedShowcase, totalShowcase]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) nextShowcase();
    else if (diff < -45) prevShowcase();
    touchStartX.current = null;
  };

  const blogImages = (pageData?.blogImages && pageData.blogImages.length)
    ? pageData.blogImages.map(img => img.secure_url || (typeof img === 'string' ? img : ''))
    : (commonImages.blogSlider || []);

  const totalBlogs = blogImages.length;

  // Pad array: clone of last item at start, and clone of first item at end for infinite forward continuation
  const extendedBlogs = totalBlogs > 1
    ? [blogImages[totalBlogs - 1], ...blogImages, blogImages[0]]
    : blogImages;

  const nextBlog = () => {
    if (totalBlogs <= 1 || isBlogTransitioning.current) return;
    isBlogTransitioning.current = true;
    setEnableBlogTransition(true);
    setBlogIdx(i => i + 1);
  };

  const prevBlog = () => {
    if (totalBlogs <= 1 || isBlogTransitioning.current) return;
    isBlogTransitioning.current = true;
    setEnableBlogTransition(true);
    setBlogIdx(i => i - 1);
  };

  const handleBlogTransitionEnd = () => {
    isBlogTransitioning.current = false;
    if (totalBlogs <= 1) return;

    if (blogIdx >= totalBlogs + 1) {
      // Reached the clone of the 1st slide at the far end: instantly snap to index 1 (no animation)
      setEnableBlogTransition(false);
      setBlogIdx(1);
    } else if (blogIdx <= 0) {
      // Reached the clone of the last slide at start: instantly snap to index totalBlogs (no animation)
      setEnableBlogTransition(false);
      setBlogIdx(totalBlogs);
    }
  };

  // Re-enable CSS transition after the instant snap
  useEffect(() => {
    if (!enableBlogTransition) {
      const raf = requestAnimationFrame(() => {
        setEnableBlogTransition(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [enableBlogTransition]);

  /* Auto-advance BLOG images continuously one by one left-to-right, paused on hover */
  useEffect(() => {
    if (isPausedBlog || totalBlogs <= 1) return;
    const timer = setInterval(() => {
      nextBlog();
    }, 3600);
    return () => clearInterval(timer);
  }, [isPausedBlog, totalBlogs, blogIdx]);

  const handleBlogTouchStart = (e) => {
    touchBlogStartX.current = e.touches[0].clientX;
  };
  const handleBlogTouchEnd = (e) => {
    if (touchBlogStartX.current === null) return;
    const diff = touchBlogStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) nextBlog();
    else if (diff < -40) prevBlog();
    touchBlogStartX.current = null;
  };

  const activeBlogDot = totalBlogs > 1
    ? (blogIdx - 1 + totalBlogs) % totalBlogs
    : 0;

  const goToBlog = (dotIdx) => {
    if (isBlogTransitioning.current) return;
    isBlogTransitioning.current = true;
    setEnableBlogTransition(true);
    setBlogIdx(dotIdx + 1);
  };

  const featuredBlogPhoto = pageData?.featuredBlogImage?.secure_url || cloudinaryUrl(weddingGalleries[4]?.coverImage || commonImages.instagram[4]);
  const featuredBlogLink = pageData?.featuredBlogLink || '/real_weddings';

  const notes = (pageData?.loveNotes && pageData.loveNotes.length)
    ? pageData.loveNotes.map(n => ({ couple: n.couple, quote: n.quote, photoSrc: n.photo?.secure_url }))
    : DEFAULT_NOTES.map(n => ({ ...n, photoSrc: cloudinaryUrl(n.photoKey) }));

  const totalNotes = notes.length;
  const prevNote = () => setNoteIdx(i => (i - 1 + totalNotes) % totalNotes);
  const nextNote = () => setNoteIdx(i => (i + 1) % totalNotes);

  /* Auto-advance LOVE NOTES one by one, paused when mouse pointed on them */
  useEffect(() => {
    if (isPausedNotes || totalNotes <= 1) return;
    const timer = setInterval(() => {
      setNoteIdx(i => (i + 1) % totalNotes);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPausedNotes, totalNotes]);

  const films = (pageData?.weddingFilms && pageData.weddingFilms.length)
    ? pageData.weddingFilms
    : DEFAULT_FILMS;
  const currentFilm = films[filmIdx] || films[0];
  const totalFilms = films.length;
  const prevFilm = () => {
    setIsPlayingFilm(false);
    setFilmIdx(i => (i - 1 + totalFilms) % totalFilms);
  };
  const nextFilm = () => {
    setIsPlayingFilm(false);
    setFilmIdx(i => (i + 1) % totalFilms);
  };

  /* Auto-advance WEDDING FILMS one by one, paused when mouse pointed on them or when playing */
  useEffect(() => {
    if (isPausedFilms || isPlayingFilm || totalFilms <= 1) return;
    const timer = setInterval(() => {
      setFilmIdx(i => (i + 1) % totalFilms);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPausedFilms, isPlayingFilm, totalFilms]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Montserrat:wght@300;400;500;600;700;800&family=Work+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

:root{
  --paper: #FAF7F2;
  --paper-blush: #F5EEE6;
  --paper-deep: #F0E8D8;
  --ink: #262019;
  --ink-soft: #574E43;
  --oxblood: #7A2A2A;
  --oxblood-deep: #5E1F1F;
  --olive: #5C6B47;
  --gold: #B08D4C;
  --line: rgba(38,32,25,0.15);
  --line-strong: rgba(38,32,25,0.28);
  --serif: 'Cormorant Garamond', 'Fraunces', Georgia, serif;
  --sans: 'Work Sans', sans-serif;
  --container: 1140px;
  --parchment:#F3ECE0;
  --sage:#8C9186;
}

*{ box-sizing:border-box; }
html{ scroll-behavior:smooth; }
body{
  margin:0;
  background:var(--paper);
  color:var(--ink);
  font-family:var(--sans);
  font-weight:400;
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
img{ max-width:100%; display:block; }
a{ color:inherit; text-decoration:none; }
ul{ list-style:none; margin:0; padding:0; }

.wrap{ max-width:var(--container); margin:0 auto; padding:0 clamp(1.25rem,4vw,2.5rem); }

/* ── NAV (Transparent overlay on hero) ─────── */
header.site-nav{
  position:absolute;
  top:0;
  left:0;
  right:0;
  width:100%;
  z-index:50;
  background:transparent;
  backdrop-filter:none;
  -webkit-backdrop-filter:none;
  border-bottom:none;
}
.nav-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:clamp(1rem, 2.2vw, 1.8rem) 0;
}
.logo{
  font-family:var(--serif);
  font-size:1.35rem;
  letter-spacing:0.02em;
  display:flex;
  align-items:center;
  gap:0.45rem;
}
.brand-logo{
  width:60px;
  height:60px;
  border-radius:50%;
  object-fit:cover;
  flex-shrink:0;
  box-shadow:0 4px 14px rgba(0,0,0,0.35);
}
@media(min-width:768px){
  .brand-logo{
    width:90px;
    height:90px;
  }
}
.nav-links{
  display:flex;
  align-items:center;
  gap:clamp(1rem, 2vw, 2.2rem);
  font-size:0.85rem;
  letter-spacing:0.08em;
  text-transform:uppercase;
}
.nav-links a{
  position:relative;
  padding:0.25rem 0;
  color:#FFFFFF;
  text-shadow:0 1px 6px rgba(0,0,0,0.7);
  font-weight:500;
  transition:color 0.25s ease, opacity 0.25s ease;
  opacity:0.92;
}
.nav-links a:hover{
  color:#FAF7F2;
  opacity:1;
  text-shadow:0 1px 10px rgba(0,0,0,0.9);
}
.nav-links a.active{
  color:#FFFFFF;
  opacity:1;
}
.nav-links a.active::after{
  content:'';
  position:absolute;
  left:0;
  right:0;
  bottom:-3px;
  height:1.5px;
  background:#FFFFFF;
  box-shadow:0 1px 4px rgba(0,0,0,0.6);
}
.nav-cta{
  display:flex;
  align-items:center;
  gap:1.3rem;
}
.nav-toggle{
  display:none;
  background:none;
  border:none;
  cursor:pointer;
  padding:0;
  width:32px;
  height:32px;
  position:relative;
  z-index:100;
}
.hamburger{
  display:block;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  width:26px;
  height:2px;
  background-color:#FFFFFF;
  box-shadow:0 1px 4px rgba(0,0,0,0.7);
  transition:background-color 0.2s;
}
.hamburger::before,
.hamburger::after{
  content:'';
  position:absolute;
  right:0;
  left:auto;
  height:2px;
  background-color:#FFFFFF;
  box-shadow:0 1px 4px rgba(0,0,0,0.7);
  transition:transform 0.3s, top 0.3s, width 0.3s;
}
.hamburger::before{ top:-8px; width:50%; }
.hamburger::after{ top:8px; width:75%; }
.nav-toggle.open .hamburger{ background-color:transparent; box-shadow:none; }
.nav-toggle.open .hamburger::before{ top:0; width:100%; transform:rotate(45deg); }
.nav-toggle.open .hamburger::after{ top:0; width:100%; transform:rotate(-45deg); }

@media(max-width:780px){
  .site-nav .wrap{ padding:0 1.25rem; }
  .nav-row{ padding:0.6rem 0; }
  .logo{ position:relative; z-index:100; }
  .nav-links{
    position:fixed;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
    background:rgba(26,22,19,0.95);
    backdrop-filter:blur(15px);
    -webkit-backdrop-filter:blur(15px);
    flex-direction:column;
    justify-content:center;
    align-items:center;
    padding:2rem;
    display:flex;
    opacity:0;
    visibility:hidden;
    pointer-events:none;
    transform:scale(1.05);
    transition:opacity 0.4s, transform 0.4s, visibility 0.4s;
    z-index:90;
  }
  .nav-links.open{
    opacity:1;
    visibility:visible;
    pointer-events:auto;
    transform:scale(1);
  }
  .nav-toggle{ display:block; z-index:100; }
  .nav-links a{
    color:#FAF7F2!important;
    font-family:var(--sans);
    font-size:1.2rem;
    font-weight:500;
    letter-spacing:0.12em;
    text-transform:uppercase;
    padding:1.2rem 0;
    width:auto;
    text-align:center;
    border-bottom:none;
    opacity:0;
    transform:translateY(15px);
    transition:opacity 0.4s, transform 0.4s;
    text-shadow:none;
  }
  .nav-links a.active{
    color:var(--gold, #C5A880)!important;
  }
  .nav-links.open a{ opacity:1; transform:translateY(0); }
  .nav-links.open a:nth-child(1){ transition-delay:0.1s; }
  .nav-links.open a:nth-child(2){ transition-delay:0.15s; }
  .nav-links.open a:nth-child(3){ transition-delay:0.2s; }
  .nav-links.open a:nth-child(4){ transition-delay:0.25s; }
  .nav-links.open a:nth-child(5){ transition-delay:0.3s; }
  .nav-links.open a:nth-child(6){ transition-delay:0.35s; }
  .nav-links.open a:nth-child(7){ transition-delay:0.4s; }
}

/* ── 1. HERO ────────────────────────────────────────── */
.ab-hero-clean{
  position:relative;
  width:100%;
  height:100vh;
  min-height:540px;
  max-height:920px;
  overflow:hidden;
  background:#1a1410;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
}
.ab-hero-clean::after{
  content:'';
  position:absolute;
  inset:0;
  background:linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.5) 100%);
  pointer-events:none;
  z-index:1;
}
.ab-hero-clean img{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
  object-position:center 20%;
  display:block;
  z-index:0;
}
.ab-hero-content{
  position:relative;
  z-index:2;
  padding:0 clamp(1.25rem, 4vw, 3rem);
  max-width:1020px;
  margin:0 auto;
  display:flex;
  flex-direction:column;
  align-items:center;
}
.ab-hero-heading{
  font-family:'Cinzel', 'Cormorant Garamond', Georgia, serif;
  font-weight:600;
  font-size:clamp(2.3rem, 5.8vw, 4.6rem);
  letter-spacing:clamp(0.16em, 0.32vw, 0.28em);
  text-transform:uppercase;
  color:#FFFFFF;
  margin:0;
  line-height:1.18;
  text-shadow:
    0 2px 14px rgba(0,0,0,0.85),
    0 6px 35px rgba(0,0,0,0.65),
    0 0 45px rgba(197,168,128,0.22);
}

/* Delicate editorial divider */
.ab-hero-divider{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:1rem;
  width:min(280px, 80%);
  margin:1.15rem auto 1.35rem;
  opacity:0.9;
}
.ab-divider-arm{
  flex:1;
  height:1px;
  background:linear-gradient(90deg, transparent, rgba(220,185,120,0.85), transparent);
}
.ab-divider-gem{
  font-size:0.75rem;
  color:#D4AF37;
  text-shadow:0 0 10px rgba(212,175,55,0.8);
  animation:gemGlow 3s ease-in-out infinite alternate;
}
@keyframes gemGlow{
  0%{ opacity:0.65; transform:scale(0.92); }
  100%{ opacity:1; transform:scale(1.18); filter:drop-shadow(0 0 6px rgba(212,175,55,0.95)); }
}

/* Innovative Highlighted Caption Pill (Glassmorphism + Gold Shimmer) */
.ab-hero-badge-wrap{
  display:inline-block;
  margin-top:0.2rem;
}
.ab-hero-highlight-pill{
  display:inline-flex;
  align-items:center;
  gap:0.75rem;
  padding:0.65rem clamp(1.15rem, 2.5vw, 1.95rem);
  background:rgba(20, 16, 13, 0.52);
  backdrop-filter:blur(16px);
  -webkit-backdrop-filter:blur(16px);
  border:1px solid rgba(220, 185, 120, 0.55);
  border-radius:999px;
  box-shadow:
    0 12px 36px rgba(0,0,0,0.45),
    0 0 28px rgba(197,168,128,0.25),
    inset 0 1px 1px rgba(255,255,255,0.25);
  font-family:'Montserrat', var(--sans), sans-serif;
  font-size:clamp(0.72rem, 1.15vw, 0.88rem);
  letter-spacing:clamp(0.18em, 0.24vw, 0.24em);
  text-transform:uppercase;
  font-weight:500;
  color:#FAF7F2;
  background-image:linear-gradient(135deg, #FFFFFF 0%, #F7EAD6 45%, #E2BE78 100%);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  transition:all 0.35s ease;
}
.ab-hero-highlight-pill:hover{
  border-color:rgba(240, 210, 150, 0.85);
  box-shadow:
    0 14px 42px rgba(0,0,0,0.55),
    0 0 35px rgba(212,175,55,0.4),
    inset 0 1px 2px rgba(255,255,255,0.4);
  transform:translateY(-1px);
}
.ab-pill-sparkle{
  font-size:0.68rem;
  color:#D4AF37;
  -webkit-text-fill-color:#D4AF37;
  filter:drop-shadow(0 0 4px rgba(212,175,55,0.85));
}

@media(max-width:768px){
  .ab-hero-clean{
    height:78vh;
    min-height:420px;
  }
  .ab-hero-clean img{
    object-position:50% 15%;
  }
  .ab-hero-heading{
    font-size:clamp(1.65rem, 6.2vw, 2.6rem);
    letter-spacing:0.18em;
  }
  .ab-hero-highlight-pill{
    padding:0.5rem 1rem;
    font-size:0.66rem;
    letter-spacing:0.14em;
    gap:0.45rem;
  }
}

/* ── 2. ABOUT US (Sunlit Plaster Wall Gallery) ──────── */
.ab-about-sec{
  position:relative;
  padding:clamp(3.5rem, 6vw, 7.5rem) clamp(1.25rem, 4vw, 3rem);
  background:#FAF7F2 url('/wall-sunlight.png') center right / cover no-repeat;
  overflow:hidden;
}
.ab-about-sec::before{
  content:'';
  position:absolute;
  inset:0;
  background:rgba(250, 247, 242, 0.22);
  pointer-events:none;
}
.ab-about-grid{
  position:relative;
  z-index:2;
  max-width:1080px;
  margin:0 auto;
  display:grid;
  grid-template-columns:4.6fr 7.4fr;
  gap:clamp(2rem, 5vw, 6.5rem);
  align-items:center;
}
@media(max-width:768px){
  .ab-about-grid{
    grid-template-columns:1fr;
    gap:2.5rem;
  }
}

/* ── ABOUT US IMAGE (Clean, normal image) ──────────── */
.ab-about-img-wrap{
  position:relative;
  width:100%;
  max-width:440px;
  margin:0 auto;
  aspect-ratio:3/4;
  overflow:hidden;
  border-radius:4px;
  box-shadow:0 18px 45px rgba(26,20,16,0.12);
  background:var(--paper-deep);
}
.ab-about-img{
  width:100%;
  height:100%;
  object-fit:cover;
  object-position:center;
  display:block;
  transition:transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
}
.ab-about-img-wrap:hover .ab-about-img{
  transform:scale(1.03);
}
.ab-about-content h2{
  font-family:var(--serif);
  font-size:clamp(1.6rem, 3.2vw, 2.5rem);
  font-weight:400;
  letter-spacing:0.04em;
  margin:0 0 0.4rem;
  color:var(--ink);
}
.ab-about-divider-line{
  width:42px;
  height:1px;
  background:rgba(38,32,25,0.4);
  margin:0.75rem 0 1.15rem;
}
.ab-about-subtitle{
  font-size:0.68rem;
  letter-spacing:0.22em;
  text-transform:uppercase;
  color:var(--ink-soft);
  font-weight:500;
  margin-bottom:1.25rem;
  display:block;
}
.ab-about-text{
  font-size:clamp(0.88rem, 1.2vw, 0.94rem);
  line-height:1.9;
  color:var(--ink-soft);
  white-space:pre-line;
  margin:0;
}

/* ── 3. TAGLINE BANNER & 3D BLACK CAMERA ───────────── */
.ab-quote-banner{
  background:var(--paper-blush);
  padding:clamp(4rem, 7vw, 7rem) clamp(1.25rem, 4vw, 3rem);
  text-align:center;
  position:relative;
  overflow:hidden;
}

.ab-quote-container{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  max-width:960px;
  margin:0 auto;
}


/* Tagline Quote Text */
.ab-quote-text{
  font-family:var(--serif);
  font-style:italic;
  font-size:clamp(1.4rem, 3.2vw, 2.7rem);
  font-weight:300;
  line-height:1.45;
  color:var(--ink);
  max-width:32ch;
  margin:0 auto;
  white-space:pre-line;
}


/* ── 4. 3D ART PHOTO EXHIBITION WALL & BLOGS ────────── */
.ab-blogs-sec{
  padding:clamp(2.5rem, 5vw, 5rem) 0 clamp(4rem, 7vw, 7rem);
  background:var(--paper);
  overflow:hidden;
}

/* Showcase Carousel Shell */
.ab-exhibition-wall{
  position:relative;
  width:100%;
  max-width:1420px;
  margin:0 auto clamp(2rem, 4vw, 4rem);
  padding:clamp(1rem, 2vw, 2.5rem) clamp(1rem, 3vw, 2.5rem) 0;
  user-select:none;
  overflow:hidden;
}

/* Showcase Stage */
.ab-showcase-stage{
  position:relative;
  width:100%;
  height:clamp(440px, 52vw, 620px);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:3;
}

/* Showcase Card */
.ab-showcase-card{
  position:absolute;
  top:50%;
  left:50%;
  width:clamp(250px, 27vw, 380px);
  aspect-ratio:3/4;
  cursor:pointer;
  transition:transform 0.75s cubic-bezier(0.2, 0.9, 0.3, 1),
             opacity 0.75s ease,
             filter 0.75s ease;
  will-change:transform, opacity;
}

/* Normal Photo Wrap (Clean, frameless editorial style) */
.ab-showcase-img-wrap{
  position:relative;
  width:100%;
  height:100%;
  border-radius:4px;
  overflow:hidden;
  box-shadow:0 14px 40px rgba(26,20,16,0.13);
  background:var(--paper-deep);
}

.ab-showcase-img{
  width:100%;
  height:100%;
  object-fit:cover;
  object-position:center;
  display:block;
  transition:transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Center Card - Prominent image */
.ab-showcase-card.card-pos-center{
  transform:translate(-50%, -50%) scale(1);
  z-index:10;
  opacity:1;
  filter:brightness(1);
  cursor:default;
}
.ab-showcase-card.card-pos-center:hover .ab-showcase-img{
  transform:scale(1.03);
}

/* Left Card */
.ab-showcase-card.card-pos-left{
  transform:translate(calc(-50% - clamp(260px, 28vw, 400px)), -50%) scale(0.85);
  z-index:5;
  opacity:0.72;
  filter:brightness(0.92);
}
.ab-showcase-card.card-pos-left:hover{
  opacity:0.95;
  filter:brightness(1);
  transform:translate(calc(-50% - clamp(260px, 28vw, 400px)), -50%) scale(0.88);
}

/* Right Card */
.ab-showcase-card.card-pos-right{
  transform:translate(calc(-50% + clamp(260px, 28vw, 400px)), -50%) scale(0.85);
  z-index:5;
  opacity:0.72;
  filter:brightness(0.92);
}
.ab-showcase-card.card-pos-right:hover{
  opacity:0.95;
  filter:brightness(1);
  transform:translate(calc(-50% + clamp(260px, 28vw, 400px)), -50%) scale(0.88);
}

/* Offstage / Far-left & Far-right */
.ab-showcase-card.card-pos-far-left{
  transform:translate(calc(-50% - clamp(500px, 55vw, 780px)), -50%) scale(0.65);
  z-index:1;
  opacity:0;
  visibility:hidden;
  pointer-events:none;
}
.ab-showcase-card.card-pos-far-right{
  transform:translate(calc(-50% + clamp(500px, 55vw, 780px)), -50%) scale(0.65);
  z-index:1;
  opacity:0;
  visibility:hidden;
  pointer-events:none;
}

@media(max-width:768px){
  .ab-exhibition-wall{
    padding:1rem 0.5rem 0;
  }
  .ab-showcase-stage{
    height:clamp(360px, 86vw, 480px);
  }
  .ab-showcase-card{
    width:clamp(210px, 60vw, 290px);
  }
  .ab-showcase-card.card-pos-left{
    transform:translate(calc(-50% - clamp(170px, 52vw, 230px)), -50%) scale(0.8);
    opacity:0.65;
  }
  .ab-showcase-card.card-pos-right{
    transform:translate(calc(-50% + clamp(170px, 52vw, 230px)), -50%) scale(0.8);
    opacity:0.65;
  }
  .ab-showcase-card.card-pos-far-left{
    transform:translate(calc(-50% - 360px), -50%) scale(0.6);
  }
  .ab-showcase-card.card-pos-far-right{
    transform:translate(calc(-50% + 360px), -50%) scale(0.6);
  }
}


/* Navigation buttons */
.ab-showcase-nav{
  position:absolute;
  top:50%;
  transform:translateY(-50%);
  width:48px;
  height:48px;
  border-radius:50%;
  background:rgba(255,252,246,0.92);
  border:1px solid rgba(45,35,25,0.18);
  color:#2c221a;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  z-index:20;
  backdrop-filter:blur(8px);
  -webkit-backdrop-filter:blur(8px);
  transition:all 0.25s ease;
  box-shadow:0 6px 18px rgba(35,25,18,0.12);
}
.ab-showcase-nav:hover{
  background:#FAF7F2;
  color:var(--gold);
  border-color:var(--gold);
  transform:translateY(-50%) scale(1.08);
  box-shadow:0 10px 24px rgba(35,25,18,0.2);
}
.ab-showcase-nav svg{
  width:20px;
  height:20px;
}
.ab-showcase-prev{
  left:clamp(0.5rem, 2.5vw, 2.5rem);
}
.ab-showcase-next{
  right:clamp(0.5rem, 2.5vw, 2.5rem);
}
@media(max-width:640px){
  .ab-showcase-nav{
    width:36px;
    height:36px;
  }
  .ab-showcase-nav svg{
    width:16px;
    height:16px;
  }
  .ab-showcase-prev{
    left:0.35rem;
  }
  .ab-showcase-next{
    right:0.35rem;
  }
}


/* Indicators */
.ab-showcase-dots{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:0.65rem;
  margin-top:1.5rem;
}
.ab-showcase-dot{
  width:8px;
  height:8px;
  border-radius:50%;
  border:1px solid rgba(38,32,25,0.3);
  background:transparent;
  padding:0;
  cursor:pointer;
  transition:all 0.25s ease;
}
.ab-showcase-dot:hover{
  border-color:var(--ink);
  transform:scale(1.15);
}
.ab-showcase-dot.active{
  background:var(--ink);
  border-color:var(--ink);
  transform:scale(1.3);
}

.ab-blogs-heading{
  text-align:center;
  font-family:var(--serif);
  font-size:clamp(1.5rem, 2.8vw, 2.4rem);
  letter-spacing:0.18em;
  text-transform:uppercase;
  font-weight:400;
  color:var(--ink);
  margin:clamp(2.5rem, 4.5vw, 4.5rem) 0 clamp(2rem, 3.5vw, 3.5rem);
}

.ab-blog-slider-wrap{
  max-width:540px;
  margin:0 auto;
  padding:0 1.25rem;
  text-align:center;
  position:relative;
}
.ab-blog-slider-stage{
  position:relative;
  width:100%;
  aspect-ratio:4/5;
  overflow:hidden;
  border-radius:4px;
  box-shadow:0 14px 40px rgba(26,20,16,0.12);
  background:var(--paper-deep);
}
.ab-blog-slider-track{
  display:flex;
  width:100%;
  height:100%;
  will-change:transform;
}
.ab-blog-slide{
  min-width:100%;
  width:100%;
  height:100%;
  flex-shrink:0;
  overflow:hidden;
  position:relative;
}
.ab-blog-slide a{
  display:block;
  width:100%;
  height:100%;
}
.ab-blog-slide img{
  width:100%;
  height:100%;
  object-fit:cover;
  object-position:center;
  display:block;
  transition:transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
}
.ab-blog-slide:hover img{
  transform:scale(1.035);
}

.ab-blog-nav-btn{
  position:absolute;
  top:50%;
  transform:translateY(-50%);
  width:42px;
  height:42px;
  border-radius:50%;
  background:rgba(250,247,242,0.92);
  border:1px solid rgba(38,32,25,0.12);
  color:var(--ink);
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  z-index:6;
  backdrop-filter:blur(6px);
  -webkit-backdrop-filter:blur(6px);
  transition:all 0.25s ease;
  box-shadow:0 4px 14px rgba(38,32,25,0.1);
}
.ab-blog-nav-btn:hover{
  background:#FAF7F2;
  color:var(--gold);
  border-color:var(--gold);
  transform:translateY(-50%) scale(1.08);
}
.ab-blog-nav-btn svg{
  width:18px;
  height:18px;
}
.ab-blog-nav-prev{
  left:0.75rem;
}
.ab-blog-nav-next{
  right:0.75rem;
}
@media(max-width:640px){
  .ab-blog-nav-btn{
    width:34px;
    height:34px;
  }
  .ab-blog-nav-btn svg{
    width:15px;
    height:15px;
  }
  .ab-blog-nav-prev{
    left:0.5rem;
  }
  .ab-blog-nav-next{
    right:0.5rem;
  }
}

.ab-blog-dots{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:0.55rem;
  margin-top:1.25rem;
}
.ab-blog-dot{
  width:7px;
  height:7px;
  border-radius:50%;
  border:1px solid rgba(38,32,25,0.35);
  background:transparent;
  padding:0;
  cursor:pointer;
  transition:all 0.25s ease;
}
.ab-blog-dot:hover{
  border-color:var(--ink);
  transform:scale(1.15);
}
.ab-blog-dot.active{
  background:var(--ink);
  border-color:var(--ink);
  transform:scale(1.25);
}

.ab-view-post-link{
  display:inline-block;
  margin-top:1.5rem;
  font-family:var(--serif);
  font-size:0.82rem;
  letter-spacing:0.22em;
  text-transform:uppercase;
  color:var(--ink);
  border-bottom:1px solid rgba(38,32,25,0.45);
  padding-bottom:3px;
  transition:border-color 0.25s, color 0.25s;
}
.ab-view-post-link:hover{
  color:var(--oxblood);
  border-color:var(--oxblood);
}


/* ── 6. LOVE NOTES ──────────────────────────────────── */
.ab-notes-sec{
  background:var(--paper-blush);
  padding:clamp(3.5rem, 6vw, 7.5rem) clamp(1rem, 3vw, 2.5rem);
}
.ab-notes-inner{
  max-width:1040px;
  margin:0 auto;
}
.ab-notes-title{
  text-align:center;
  font-family:var(--serif);
  font-size:clamp(1.5rem, 2.8vw, 2.4rem);
  letter-spacing:0.18em;
  text-transform:uppercase;
  font-weight:400;
  color:var(--ink);
  margin:0 0 clamp(2rem, 4vw, 4rem);
}
.ab-notes-layout{
  display:grid;
  grid-template-columns:36px 1fr 36px;
  align-items:center;
  gap:clamp(0.5rem, 2vw, 2rem);
}
@media(max-width:600px){
  .ab-notes-layout{
    grid-template-columns:26px 1fr 26px;
    gap:0.35rem;
  }
}
.ab-chevron{
  background:none;
  border:none;
  cursor:pointer;
  padding:8px 2px;
  color:rgba(38,32,25,0.45);
  display:flex;
  align-items:center;
  justify-content:center;
  transition:color 0.2s, transform 0.2s;
}
.ab-chevron:hover{
  color:var(--ink);
  transform:scale(1.15);
}
.ab-chevron svg{
  width:22px;
  height:38px;
}
@media(max-width:600px){
  .ab-chevron svg{
    width:16px;
    height:28px;
  }
}

.ab-notes-stack{
  display:grid;
  position:relative;
  overflow:hidden;
}
.ab-notes-slide{
  grid-column:1;
  grid-row:1;
  display:grid;
  grid-template-columns:1fr 1.25fr;
  gap:clamp(1.5rem, 4vw, 4rem);
  align-items:center;
  opacity:0;
  visibility:hidden;
  pointer-events:none;
  transform:translateX(80px);
  transition:transform 0.75s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.75s cubic-bezier(0.2, 0.9, 0.3, 1), visibility 0.75s ease;
}
@media(max-width:768px){
  .ab-notes-slide{
    grid-template-columns:1fr;
    gap:1.25rem;
    text-align:center;
  }
}
.ab-notes-slide.active{
  opacity:1;
  visibility:visible;
  pointer-events:auto;
  transform:translateX(0);
  z-index:2;
}
.ab-notes-slide.prev-slide{
  opacity:0;
  visibility:hidden;
  pointer-events:none;
  transform:translateX(-80px);
  z-index:1;
}

.ab-notes-square-img{
  width:100%;
  max-width:340px;
  margin:0 auto;
  aspect-ratio:1/1;
  object-fit:cover;
  display:block;
  border-radius:2px;
}
.ab-notes-square-placeholder{
  width:100%;
  max-width:340px;
  margin:0 auto;
  aspect-ratio:1/1;
  background:linear-gradient(145deg, #e4d3c4, #b98e72 60%, #5e3b26);
  border-radius:2px;
}

.ab-notes-text blockquote{
  margin:0;
}
.ab-notes-quote{
  font-family:var(--serif);
  font-size:clamp(0.92rem, 1.3vw, 1.12rem);
  line-height:1.85;
  color:var(--ink);
  margin:0;
  font-weight:300;
}
.ab-notes-couple{
  font-size:0.78rem;
  letter-spacing:0.18em;
  text-transform:uppercase;
  color:var(--ink);
  font-weight:600;
  display:block;
}

.ab-notes-dots{
  display:flex;
  justify-content:center;
  gap:0.6rem;
  margin-top:clamp(2rem, 3.5vw, 3rem);
}
.ab-dot{
  width:7px;
  height:7px;
  border-radius:50%;
  border:1px solid rgba(38,32,25,0.4);
  background:transparent;
  padding:0;
  cursor:pointer;
  transition:background 0.2s, border-color 0.2s;
}
.ab-dot.active{
  background:rgba(38,32,25,0.85);
  border-color:rgba(38,32,25,0.85);
}

/* ── 7. FILMS SECTION ───────────────────────────────── */
.ab-films-sec{
  background:#FFFFFF;
  padding:clamp(3.5rem, 6vw, 7.5rem) clamp(1.25rem, 4vw, 3rem);
  text-align:center;
}
.ab-films-heading{
  font-family:var(--serif);
  font-size:clamp(1.5rem, 2.8vw, 2.4rem);
  letter-spacing:0.18em;
  text-transform:uppercase;
  font-weight:400;
  color:var(--ink);
  margin:0 0 clamp(2rem, 3.5vw, 3.5rem);
}
.ab-films-carousel-wrap{
  max-width:960px;
  margin:0 auto;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:clamp(0.5rem, 2vw, 1.5rem);
  position:relative;
}
.ab-film-chevron{
  background:none;
  border:none;
  cursor:pointer;
  padding:12px 6px;
  color:rgba(38,32,25,0.45);
  display:flex;
  align-items:center;
  justify-content:center;
  transition:color 0.2s, transform 0.2s;
  flex-shrink:0;
  z-index:2;
}
.ab-film-chevron:hover{
  color:var(--ink);
  transform:scale(1.15);
}
.ab-film-chevron svg{
  width:22px;
  height:42px;
}
@media(max-width:600px){
  .ab-film-chevron svg{
    width:16px;
    height:30px;
  }
}
.ab-films-frame{
  flex:1;
  max-width:880px;
  width:100%;
  aspect-ratio:16/9;
  background:#000000;
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
  cursor:pointer;
  box-shadow:0 12px 36px rgba(0,0,0,0.12);
  border-radius:2px;
  overflow:hidden;
}
.ab-film-stack{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  overflow:hidden;
}
.ab-film-slide{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  opacity:0;
  visibility:hidden;
  pointer-events:none;
  transform:translateX(100%);
  transition:transform 0.75s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.75s cubic-bezier(0.2, 0.9, 0.3, 1), visibility 0.75s ease;
}
.ab-film-slide.active{
  opacity:1;
  visibility:visible;
  pointer-events:auto;
  transform:translateX(0);
  z-index:2;
}
.ab-film-slide.prev-slide{
  opacity:0;
  visibility:hidden;
  pointer-events:none;
  transform:translateX(-100%);
  z-index:1;
}
.ab-film-slide img{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
  opacity:0.8;
  transition:opacity 0.3s ease, transform 0.4s ease;
}
.ab-films-frame:hover .ab-film-slide.active img{
  opacity:0.95;
  transform:scale(1.02);
}
.ab-films-frame iframe{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  border:none;
  z-index:5;
}
.ab-films-circle-play{
  width:48px;
  height:48px;
  border-radius:50%;
  border:1.5px solid rgba(255,255,255,0.85);
  background:rgba(0,0,0,0.35);
  backdrop-filter:blur(3px);
  -webkit-backdrop-filter:blur(3px);
  display:flex;
  align-items:center;
  justify-content:center;
  color:#FFFFFF;
  position:relative;
  z-index:2;
  transition:transform 0.25s ease, background 0.25s ease;
}
.ab-films-frame:hover .ab-films-circle-play{
  transform:scale(1.1);
  background:rgba(255,255,255,0.25);
}
.ab-films-circle-play svg{
  width:18px;
  height:18px;
  margin-left:3px;
}
@media (min-width: 768px) {
  .ab-films-circle-play{
    width:52px;
    height:52px;
  }
  .ab-films-circle-play svg{
    width:19px;
    height:19px;
  }
}
@keyframes filmSlideLeftFade{
  0%{
    opacity:0;
    transform:translateX(24px);
  }
  100%{
    opacity:1;
    transform:translateX(0);
  }
}
.ab-film-meta-anim{
  animation:filmSlideLeftFade 0.6s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
}
.ab-film-meta{
  margin-top:clamp(1.2rem, 2vw, 1.8rem);
}
.ab-film-title{
  font-family:var(--serif);
  font-size:clamp(1.2rem, 2vw, 1.7rem);
  color:var(--gold, #C5A880);
  margin:0 0 0.35rem;
  letter-spacing:0.04em;
  font-weight:400;
}
.ab-film-subtitle{
  font-family:var(--sans);
  font-size:0.75rem;
  letter-spacing:0.18em;
  text-transform:uppercase;
  color:var(--ink-soft, #7A7268);
  margin:0;
}
.ab-film-counter{
  font-family:var(--sans);
  font-size:0.7rem;
  letter-spacing:0.18em;
  color:rgba(38,32,25,0.45);
  margin-top:0.6rem;
}
.ab-films-btn-link{
  display:inline-block;
  margin-top:clamp(1.75rem, 3vw, 2.5rem);
  background:#1E1C1A;
  color:#FAF6F0;
  font-size:0.75rem;
  letter-spacing:0.22em;
  text-transform:uppercase;
  padding:0.85rem 2.5rem;
  font-weight:500;
  text-decoration:none;
  transition:background 0.25s ease;
}
.ab-films-btn-link:hover{
  background:#38322D;
}

/* ── FOOTER TOKENS (standard) ───────────────────────── */
.knot-divider-footer{ width:100%; height:56px; }
.knot-divider-footer path{ fill:none; stroke:var(--gold); stroke-width:1; stroke-linecap:round; }
@media(max-width:768px){
  .knot-divider-footer{ height:38px; }
}
.grain-link{ position:relative; }
.grain-link::after{ content:''; position:absolute; left:0; right:100%; bottom:-4px; height:1px; background:var(--gold); transition:right 0.35s ease; }
.grain-link:hover::after{ right:0; }
.tracked{ letter-spacing:0.18em; }
.tracked-lg{ letter-spacing:0.28em; }

/* scroll reveal */
.reveal{ opacity:0; transform:translateY(16px); transition:opacity 0.75s ease, transform 0.75s ease; }
.reveal.in{ opacity:1; transform:translateY(0); }
@media(prefers-reduced-motion:reduce){ .reveal{ opacity:1; transform:none; transition:none; } html{ scroll-behavior:auto; } }
      ` }} />

      {/* ── NAV (standard — same as all other pages) ─────── */}
      <header className="site-nav">
        <div className="wrap nav-row">
          <a href="/home" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={sanityImg(settings?.logo) || cloudinaryUrl(commonImages.logos.nav)} onError={handleImageError} alt="DKNOTT Logo" className="brand-logo" />
          </a>
          <nav className="nav-links">
            {navLinksFrom(settings).map((l) => (
              <a key={l.href} href={l.href} className={isActiveLink(l.href, '/about') ? 'active' : undefined}>{l.label}</a>
            ))}
          </nav>
          <div className="nav-cta">
            <button className="nav-toggle" aria-label="Menu">
              <span className="hamburger" />
            </button>
          </div>
        </div>
      </header>

      {/* ── 1. HERO (Full cinematic architectural landmark / palace sunset) ── */}
      <section className="ab-hero-clean" ref={heroRef}>
        <img
          src={heroSrc}
          onError={handleImageError}
          alt="DKNOTT Photography"
        />
        <div className="ab-hero-content">
          <h1 className="ab-hero-heading">DKNOTT PHOTOGRAPHY</h1>
        </div>
      </section>

      {/* ── 2. ABOUT US (Clean 2-column editorial, delicate line divider, NO button) ── */}
      <section className="ab-about-sec">
        <div className="ab-about-grid">
          <div className="reveal">
            <div className="ab-about-img-wrap">
              <img
                src={aboutPhoto}
                onError={handleImageError}
                alt="About DKNOTT Photography"
                className="ab-about-img"
              />
            </div>
          </div>
          <div className="reveal" style={{ transitionDelay: '0.12s' }}>
            <div className="ab-about-content">
              <h2>{aboutTitle}</h2>
              <div className="ab-about-divider-line" />
              <span className="ab-about-subtitle">{aboutSubtitle}</span>
              <p className="ab-about-text">{aboutBody}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. TAGLINE BANNER (Blush background, elegant italic serif) ── */}
      <section className="ab-quote-banner">
        <div className="ab-quote-container reveal">
          <p className="ab-quote-text">{tagline}</p>
        </div>
      </section>

      {/* ── 4. BLOGS SECTION (3-photo strip, BLOGS title, portrait post + VIEW POST HERE) ── */}
      <section className="ab-blogs-sec">
        {/* ── Photo Showcase Carousel (Normal clean images, no museum frames or lights) ── */}
        <div
          className="ab-exhibition-wall reveal"
          onMouseEnter={() => setIsPausedShowcase(true)}
          onMouseLeave={() => setIsPausedShowcase(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label="Photo Showcase Carousel"
        >
          <div className="ab-showcase-stage">
            {showcaseImages.map((imgUrl, idx) => {
              let diff = (idx - showcaseIdx) % totalShowcase;
              if (diff > totalShowcase / 2) diff -= totalShowcase;
              if (diff < -totalShowcase / 2) diff += totalShowcase;

              let posClass = 'card-pos-center';
              if (diff === -1) posClass = 'card-pos-left';
              else if (diff === 1) posClass = 'card-pos-right';
              else if (diff <= -2) posClass = 'card-pos-far-left';
              else if (diff >= 2) posClass = 'card-pos-far-right';

              const isCenter = diff === 0;
              const isLeft = diff === -1;
              const isRight = diff === 1;

              return (
                <div
                  key={idx}
                  className={`ab-showcase-card ${posClass}`}
                  onClick={() => {
                    if (isLeft) prevShowcase();
                    else if (isRight) nextShowcase();
                  }}
                  role={!isCenter ? 'button' : undefined}
                  tabIndex={!isCenter ? 0 : undefined}
                  aria-label={isLeft ? 'Previous photo' : isRight ? 'Next photo' : `Showcase Photo ${idx + 1}`}
                >
                  <div className="ab-showcase-img-wrap">
                    <img
                      src={cloudinaryUrl(imgUrl)}
                      onError={handleImageError}
                      alt={`DKNOTT Wedding Moment ${idx + 1}`}
                      className="ab-showcase-img"
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Left / Right Chevron Controls */}
          <button
            className="ab-showcase-nav ab-showcase-prev"
            onClick={prevShowcase}
            aria-label="Previous photo"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="ab-showcase-nav ab-showcase-next"
            onClick={nextShowcase}
            aria-label="Next photo"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="ab-showcase-dots">
            {showcaseImages.map((_, idx) => (
              <button
                key={idx}
                className={`ab-showcase-dot ${idx === showcaseIdx ? 'active' : ''}`}
                onClick={() => setShowcaseIdx(idx)}
                aria-label={`Go to photo ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Section Title */}
        <h2 className="ab-blogs-heading reveal">BLOGS</h2>

        {/* Featured Blog Slider (one by one sliding left to right) */}
        <div
          className="ab-blog-slider-wrap reveal"
          onMouseEnter={() => setIsPausedBlog(true)}
          onMouseLeave={() => setIsPausedBlog(false)}
          onTouchStart={handleBlogTouchStart}
          onTouchEnd={handleBlogTouchEnd}
        >
          <div className="ab-blog-slider-stage">
            <div
              className="ab-blog-slider-track"
              onTransitionEnd={handleBlogTransitionEnd}
              style={{
                transform: `translateX(-${blogIdx * 100}%)`,
                transition: enableBlogTransition
                  ? 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)'
                  : 'none',
              }}
            >
              {extendedBlogs.map((imgUrl, idx) => (
                <div className="ab-blog-slide" key={idx}>
                  <a href={featuredBlogLink} aria-label="Read wedding blog story">
                    <img
                      src={cloudinaryUrl(imgUrl)}
                      onError={handleImageError}
                      alt="DKNOTT Wedding Blog Moment"
                      loading="lazy"
                    />
                  </a>
                </div>
              ))}
            </div>

            {/* Prev / Next Chevrons */}
            <button
              className="ab-blog-nav-btn ab-blog-nav-prev"
              onClick={prevBlog}
              aria-label="Previous blog photo"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className="ab-blog-nav-btn ab-blog-nav-next"
              onClick={nextBlog}
              aria-label="Next blog photo"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="ab-blog-dots">
            {blogImages.map((_, idx) => (
              <button
                key={idx}
                className={`ab-blog-dot ${idx === activeBlogDot ? 'active' : ''}`}
                onClick={() => goToBlog(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <a href={featuredBlogLink} className="ab-view-post-link">
            VIEW POST HERE
          </a>
        </div>
      </section>


      {/* ── 6. LOVE NOTES (Blush bg, 1:1 square photo, minimal chevrons, dots, auto-advances, pauses on mouse hover) ── */}
      <section
        className="ab-notes-sec"
        aria-roledescription="carousel"
        aria-label="Love notes from couples"
        onMouseEnter={() => setIsPausedNotes(true)}
        onMouseLeave={() => setIsPausedNotes(false)}
        onTouchStart={() => setIsPausedNotes(true)}
        onTouchEnd={() => setIsPausedNotes(false)}
      >
        <div className="ab-notes-inner">
          <h2 className="ab-notes-title reveal">LOVE NOTES</h2>

          <div className="ab-notes-layout">
            {/* Left Chevron */}
            <button className="ab-chevron" onClick={prevNote} aria-label="Previous note">
              <svg viewBox="0 0 24 44" fill="none" stroke="currentColor" strokeWidth="1.2">
                <polyline points="20 4 4 22 20 40" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Slides stack */}
            <div className="ab-notes-stack">
              {notes.map((n, i) => (
                <div
                  key={i}
                  className={`ab-notes-slide${i === noteIdx ? ' active' : ''}${i === (noteIdx - 1 + totalNotes) % totalNotes ? ' prev-slide' : ''}`}
                >
                  <div>
                    {n.photoSrc ? (
                      <img
                        src={n.photoSrc}
                        onError={handleImageError}
                        alt="Love note testimonial"
                        className="ab-notes-square-img"
                      />
                    ) : (
                      <div className="ab-notes-square-placeholder" />
                    )}
                  </div>
                  <div className="ab-notes-text">
                    <blockquote>
                      <p className="ab-notes-quote">{n.quote}</p>
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Chevron */}
            <button className="ab-chevron" onClick={nextNote} aria-label="Next note">
              <svg viewBox="0 0 24 44" fill="none" stroke="currentColor" strokeWidth="1.2">
                <polyline points="4 4 20 22 4 40" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Dots */}
          <div className="ab-notes-dots" role="group" aria-label="Testimonials">
            {notes.map((_, i) => (
              <button
                key={i}
                className={`ab-dot${i === noteIdx ? ' active' : ''}`}
                onClick={() => setNoteIdx(i)}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. WEDDING FILMS (Carousel with inline player, prev/next arrows, auto-advances, pauses on hover/play) ── */}
      <section
        className="ab-films-sec"
        onMouseEnter={() => setIsPausedFilms(true)}
        onMouseLeave={() => setIsPausedFilms(false)}
        onTouchStart={() => setIsPausedFilms(true)}
        onTouchEnd={() => setIsPausedFilms(false)}
      >
        <div className="wrap">
          <h2 className="ab-films-heading reveal">WEDDING FILMS</h2>

          <div className="ab-films-carousel-wrap reveal">
            <button
              className="ab-film-chevron"
              onClick={prevFilm}
              aria-label="Previous wedding film"
            >
              <svg viewBox="0 0 24 44" fill="none" stroke="currentColor" strokeWidth="1.2">
                <polyline points="20 4 4 22 20 40" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div
              className="ab-films-frame"
              onClick={() => {
                if (!isPlayingFilm) setIsPlayingFilm(true);
              }}
              role="button"
              tabIndex={0}
              aria-label={isPlayingFilm ? `Playing ${currentFilm.title}` : `Play ${currentFilm.title}`}
            >
              {isPlayingFilm ? (
                <iframe
                  src={`https://www.youtube.com/embed/${currentFilm.id}?autoplay=1&rel=0`}
                  title={currentFilm.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="ab-film-stack">
                  {films.map((f, i) => (
                    <div
                      key={f.id}
                      className={`ab-film-slide${i === filmIdx ? ' active' : ''}${i === (filmIdx - 1 + totalFilms) % totalFilms ? ' prev-slide' : ''}`}
                    >
                      <img
                        src={f.thumb}
                        onError={(e) => {
                          e.currentTarget.src = `https://img.youtube.com/vi/${f.id}/hqdefault.jpg`;
                        }}
                        alt={f.title}
                      />
                      <div className="ab-films-circle-play">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polygon points="7,4 19,12 7,20" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              className="ab-film-chevron"
              onClick={nextFilm}
              aria-label="Next wedding film"
            >
              <svg viewBox="0 0 24 44" fill="none" stroke="currentColor" strokeWidth="1.2">
                <polyline points="4 4 20 22 4 40" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div key={filmIdx} className="ab-film-meta ab-film-meta-anim reveal">
            {currentFilm.title && <h3 className="ab-film-title">{currentFilm.title}</h3>}
            {currentFilm.subtitle && <p className="ab-film-subtitle">{currentFilm.subtitle}</p>}
            <div className="ab-film-counter">{filmIdx + 1} / {totalFilms}</div>
          </div>

          <div>
            <a href="/wedding_films" className="ab-films-btn-link reveal">
              WEDDING FILMS
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER (standard — same as all other pages) ───── */}
      <footer style={{ background: 'var(--ink)', color: 'var(--parchment)', paddingTop: '3.5rem', paddingBottom: '1.5rem' }} className="pt-10 pb-4">
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
          {/* Instagram strip */}
          <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(0.75rem,2vw,2rem)' }}>
              {commonImages.instagram.map((img, i) => (
                <a key={i} href="#" style={{ width: 'clamp(80px,14%,160px)', aspectRatio: '3/4', borderRadius: '4px', overflow: 'hidden', display: 'block' }}>
                  <img src={cloudinaryUrl(img)} onError={handleImageError} className="w-full h-full object-cover rounded-sm" alt={`Instagram ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} />
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

          {/* Main grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '2.5rem', marginTop: '2rem' }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: 'var(--paper)', border: '1px solid rgba(199,163,105,0.3)', flexShrink: 0 }}>
                  <img src={sanityImg(settings?.logo) || cloudinaryUrl(commonImages.logos.large)} onError={handleImageError} alt="DKNOTT" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.85rem', letterSpacing: '0.18em', color: 'var(--parchment)' }}>{settings?.title || 'DKNOTT'}</p>
                  <p style={{ margin: 0, fontSize: '0.65rem', letterSpacing: '0.18em', color: 'var(--sage)' }}>{settings?.description || 'PHOTOGRAPHY'}</p>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--sage)', maxWidth: '32ch' }}>
                {settings?.footerTagline || 'Documentary wedding photography and film, shot across India — quiet moments, kept honestly.'}
              </p>
            </div>
            {/* Navigate */}
            <div>
              <p style={{ margin: '0 0 1.25rem', fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)' }}>Navigate</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                {navLinksFrom(settings).map((l) => (
                  <li key={l.href}><a href={l.href} className="grain-link" style={{ color: 'var(--parchment)' }}>{l.label}</a></li>
                ))}
              </ul>
            </div>
            {/* Studio */}
            <div>
              <p style={{ margin: '0 0 1.25rem', fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)' }}>Studio</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--parchment)' }}>
                <li>{settings?.contactAddress || 'Hyderabad, India'}</li>
                <li>{settings?.contactEmail || 'dknottphotography3@gmail.com'}</li>
                <li>{settings?.contactPhone || '+91 91107 08256'}</li>
              </ul>
            </div>
          </div>

          {/* CTA line */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(1.6rem,3vw,2.75rem)', lineHeight: 1.3, color: 'var(--parchment)', margin: 0 }}>
              Every knot tells a story.<br />Let's start yours.
            </p>
            <a href="/contact" className="grain-link" style={{ display: 'inline-block', marginTop: '1.5rem', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              Enquire about your date
            </a>
          </div>

          {/* Bottom bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '2.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(199,163,105,0.15)' }}>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--sage)' }}>© {new Date().getFullYear()} {settings?.footerText || 'DKNOTT Photography. All rights reserved.'}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <a href={settings?.instagramUrl || 'https://www.instagram.com/dknottphotography'} aria-label="Instagram" style={{ color: 'var(--parchment)', opacity: 0.8 }}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(199,163,105,0.3)', color: 'var(--gold)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
