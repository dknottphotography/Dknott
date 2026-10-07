import React, { useEffect } from 'react';
import { cloudinaryUrl, handleImageError } from '../lib/cloudinary';
import { commonImages } from '../data/images';

/* ─── Knot SVG path helper ──────────────────────────────── */
function knotPath(scale = 26, points = 360) {
  let d = '';
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * Math.PI * 2;
    const x = scale * (Math.sin(t) + 2 * Math.sin(2 * t));
    const y = scale * (Math.cos(t) - 2 * Math.cos(2 * t));
    d += `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return `${d}Z`;
}
const KNOT_D = knotPath(26);

/* ─── Story Images Provided ─────────────────────────────── */
const STORY_IMAGES = {
  hero: 'https://res.cloudinary.com/ddcwf9ji/image/upload/v1790516365/DKN_5956.JPG.jpg',
  portraitOne: 'https://res.cloudinary.com/ddcwf9ji/image/upload/v1790516365/DKN_5886.JPG.jpg',
  portraitTwo: 'https://res.cloudinary.com/ddcwf9ji/image/upload/v1790516365/DKN_5902.JPG.jpg',
  portraitThree: 'https://res.cloudinary.com/ddcwf9ji/image/upload/v1790516365/DKN_5826.JPG.jpg',
  portraitFour: 'https://res.cloudinary.com/ddcwf9ji/image/upload/v1790524452/0.jpg',
};

/* ─── 12-Year Lessons (Pillars) ─────────────────────────── */
const LESSON_PILLARS = [
  {
    num: '01',
    title: 'The Art of Patience',
    body: 'One wedding taught the importance of patience. Waiting quietly in the margins for the real moment to unfold naturally without intervention or choreography.',
  },
  {
    num: '02',
    title: 'The Instinct of Anticipation',
    body: 'Another taught the value of anticipation — sensing the emotional rhythm of the family so the camera is poised a split second before the tear or laugh arrives.',
  },
  {
    num: '03',
    title: 'The Unseen Moments',
    body: 'Another reminded us that the most powerful photograph often happens when nobody is looking at the camera, completely immersed in each other.',
  },
  {
    num: '04',
    title: 'Small Details, Eternal Emotion',
    body: 'And another proved that the smallest fleeting second — a gentle hand clasp, an unspoken glance, a whispered blessing — carries the deepest lifelong emotion.',
  },
];

export default function OurStory() {
  /* Nav + scroll-reveal */
  useEffect(() => {
    if (window.__OurStoryScriptLoaded) return;
    window.__OurStoryScriptLoaded = true;

    setTimeout(() => {
      // mobile nav
      const toggle = document.querySelector('.nav-toggle');
      const links  = document.querySelector('.nav-links');
      if (toggle && links) {
        toggle.addEventListener('click', () => {
          links.classList.toggle('open');
          toggle.classList.toggle('open');
        });
        links.querySelectorAll('a').forEach(a =>
          a.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('open');
          })
        );
      }

      // scroll-reveal
      const revealEls = document.querySelectorAll('.reveal');
      if ('IntersectionObserver' in window && revealEls.length) {
        const io = new IntersectionObserver(
          entries => entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
          }),
          { threshold: 0.12 }
        );
        revealEls.forEach(el => io.observe(el));
      } else {
        revealEls.forEach(el => el.classList.add('in'));
      }
    }, 150);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
/* =====================================================================
   DKNOTT PHOTOGRAPHY — design system
   ===================================================================== */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400;1,9..144,500&family=Work+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Montserrat:wght@400;500;600;700&display=swap');

:root{
  --paper: #F8F3E9;
  --paper-deep: #F0E8D8;
  --paper-blush: #EFE4D6;
  --ink: #1F231F;
  --ink-2: #262B25;
  --ink-soft: #574E43;
  --ink-muted: #7E7365;
  --oxblood: #7A2A2A;
  --oxblood-deep: #5E1F1F;
  --olive: #5C6B47;
  --gold: #C7A369;
  --gold-light: #DFBB7B;
  --parchment: #F3ECE0;
  --sage: #8C9186;
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
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}
img{ max-width: 100%; display: block; }
a{ color: inherit; text-decoration: none; }
ul{ list-style: none; margin: 0; padding: 0; }

.wrap{ max-width: var(--container); margin: 0 auto; padding: 0 clamp(1.25rem,4vw,2.5rem); }

.eyebrow{
  font-family: var(--sans); font-size: 0.72rem; letter-spacing: 0.24em;
  text-transform: uppercase; color: var(--oxblood); font-weight: 600;
  display: inline-block; margin-bottom: 0.9rem;
}
.eyebrow.gold{ color: var(--gold); }
.eyebrow.white{ color: #FAF7F2; }

h1,h2,h3,h4{ font-family: var(--serif); font-weight: 500; color: var(--ink); margin: 0 0 0.5em; letter-spacing: -0.01em; }
h1{ font-size: clamp(2.4rem, 5.5vw, 4.2rem); font-weight: 400; line-height: 1.05; }
h2{ font-size: clamp(1.8rem, 3.6vw, 2.7rem); line-height: 1.18; }
h3{ font-size: clamp(1.25rem, 2.2vw, 1.55rem); }
p{ margin: 0 0 1.2em; color: var(--ink-soft); font-size: clamp(0.96rem, 1.1vw, 1.05rem); }
.lede{ font-size: clamp(1.1rem, 1.8vw, 1.35rem); font-style: italic; font-family: var(--serif); color: var(--ink); line-height: 1.6; }

/* Knot mark */
.knot{ display: inline-block; width: 1em; height: 1em; vertical-align: -0.12em; }
.knot svg{ width:100%; height:100%; display:block; }
.knot-divider{ display:flex; align-items:center; gap:1rem; margin: clamp(2.5rem,6vw,4.5rem) 0; color: var(--gold); }
.knot-divider::before,.knot-divider::after{ content:""; flex:1; height:1px; background: var(--line-strong); }
.knot-divider .knot{ width:1.4rem; height:1.4rem; opacity:0.9; }

/* Buttons */
.btn{
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-family: var(--sans); font-size: 0.82rem; letter-spacing: 0.1em;
  text-transform: uppercase; font-weight: 600;
  padding: 0.95rem 2rem; border: 1px solid var(--ink); border-radius: 999px;
  transition: background 0.25s ease, color 0.25s ease, border-color .25s ease;
}
.btn:hover{ background: var(--ink); color: var(--paper); }
.btn.solid{ background: var(--oxblood); border-color: var(--oxblood); color: var(--paper); }
.btn.solid:hover{ background: var(--oxblood-deep); border-color: var(--oxblood-deep); }
.btn.gold{ background: var(--gold); border-color: var(--gold); color: #FFFFFF; }
.btn.gold:hover{ background: #96763D; border-color: #96763D; }

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
}

/* ── Hero band ────────────────────────────────────────── */
.story-hero{
  position: relative;
  width: 100%;
  min-height: 85vh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  background-color: #1A1613;
  padding-bottom: clamp(3rem, 6vw, 5.5rem);
}
.story-hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 58%;
  z-index: 1;
  filter: brightness(0.72);
}
.story-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.16) 30%,
    rgba(0, 0, 0, 0.4) 65%,
    rgba(0, 0, 0, 0.85) 100%
  );
  pointer-events: none;
  z-index: 2;
}
.story-hero-content{
  position: relative;
  z-index: 3;
  color: #FFFFFF;
  width: 100%;
  max-width: 680px;
  text-shadow: 0 2px 14px rgba(0,0,0,0.85);
}
.story-hero-content h1{
  color: #FFFFFF;
  margin-bottom: 0.4rem;
  letter-spacing: 0.04em;
}
.story-hero-sub{
  font-family: var(--sans);
  font-size: clamp(0.85rem, 1.6vw, 1.05rem);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold-light);
  margin-bottom: 1.5rem;
  max-width: 68ch;
}
.story-hero-quote{
  font-family: var(--serif);
  font-style: italic;
  font-size: clamp(1.15rem, 2.2vw, 1.6rem);
  line-height: 1.5;
  color: #FAF7F2;
  max-width: 45ch;
  border-left: 2px solid var(--gold);
  padding-left: 1.25rem;
  margin: 0;
}
@media (max-width: 768px) {
  .story-hero {
    min-height: 75vh;
    padding-top: 105px;
    padding-bottom: 2.5rem;
  }
  .story-hero-bg {
    object-position: 68% 42%;
  }
  .story-hero-content {
    max-width: 100%;
  }
}
@media (min-width: 1200px) {
  .story-hero-bg {
    object-position: center 60%;
  }
}

/* ── Editorial Layout helpers ────────────────────────── */
.section{ padding: clamp(4rem, 7vw, 7rem) 0; }
.section.tight{ padding: clamp(2.5rem, 5vw, 4.5rem) 0; }
.section.deep{ background: var(--ink); color: var(--paper); }
.section.deep p{ color: rgba(248,243,233,0.8); }
.section.deep h2, .section.deep h3{ color: var(--paper); }
.section.blush{ background: var(--paper-deep); }

.grid-editorial{
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: clamp(2.5rem, 5vw, 5rem);
  align-items: center;
}
.grid-editorial.rev{
  grid-template-columns: 0.85fr 1.15fr;
}
@media (max-width: 900px){
  .grid-editorial, .grid-editorial.rev{
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

/* ── Image frame styling ──────────────────────────────── */
.story-img-frame{
  position: relative;
  width: 100%;
  aspect-ratio: 4/5;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 18px 45px rgba(26,20,16,0.12);
  background: var(--paper-deep);
}
.story-img-frame img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
}
.story-img-frame:hover img{
  transform: scale(1.035);
}
.story-img-caption{
  margin-top: 0.8rem;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-muted);
  text-align: center;
}

/* ── Callout Quote Box ────────────────────────────────── */
.story-quote-box{
  max-width: 820px;
  margin: 0 auto;
  text-align: center;
  padding: clamp(2.5rem, 5vw, 4.5rem) clamp(1.5rem, 4vw, 3rem);
  background: var(--paper-deep);
  border: 1px solid var(--line);
  border-radius: 4px;
  position: relative;
}
.story-quote-box h2{
  font-family: var(--serif);
  font-size: clamp(1.8rem, 3.2vw, 2.5rem);
  font-style: italic;
  color: var(--oxblood);
  margin-bottom: 1.25rem;
}
.story-quote-box p{
  font-size: clamp(1.02rem, 1.4vw, 1.15rem);
  line-height: 1.85;
  color: var(--ink);
  margin-bottom: 1.5rem;
}
.story-quote-highlight{
  font-family: var(--serif);
  font-size: clamp(1.1rem, 1.6vw, 1.35rem);
  letter-spacing: 0.05em;
  color: var(--gold);
  font-weight: 500;
  display: block;
}

/* ── Pillars 4-grid ───────────────────────────────────── */
.story-pillars-grid{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(1.2rem, 2.5vw, 2rem);
  margin-top: 3rem;
}
@media (max-width: 990px){
  .story-pillars-grid{ grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 580px){
  .story-pillars-grid{ grid-template-columns: 1fr; }
}
.pillar-card{
  background: #FFFFFF;
  padding: 2.2rem 1.8rem;
  border-radius: 4px;
  border: 1px solid var(--line);
  box-shadow: 0 8px 24px rgba(38,32,25,0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}
.pillar-card:hover{
  transform: translateY(-4px);
  box-shadow: 0 14px 32px rgba(38,32,25,0.1);
  border-color: var(--gold);
}
.pillar-num{
  font-family: var(--sans);
  font-size: 0.78rem;
  letter-spacing: 0.2em;
  color: var(--gold);
  font-weight: 600;
  margin-bottom: 0.75rem;
}
.pillar-card h3{
  font-size: 1.25rem;
  margin-bottom: 0.8rem;
  color: var(--ink);
}
.pillar-card p{
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--ink-soft);
  margin: 0;
}

/* ── Signature block ─────────────────────────────────── */
.story-signature-block{
  text-align: center;
  max-width: 780px;
  margin: 0 auto;
  padding: clamp(2rem, 4vw, 3rem) 1.5rem 0.5rem;
}
.story-signature-name{
  font-family: var(--serif);
  font-size: clamp(2rem, 4vw, 3rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink);
  margin: 0 0 0.5rem;
}
.story-signature-title{
  font-family: var(--sans);
  font-size: 0.85rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--oxblood);
  font-weight: 500;
  margin-bottom: 1.25rem;
}
.story-signature-tagline{
  font-family: var(--serif);
  font-style: italic;
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  color: var(--gold);
  margin: 0;
}

/* ── Follow along IG strip ───────────────────────────── */
.ig-grid{
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: clamp(0.75rem, 2vw, 1.5rem);
}
@media (max-width: 768px){
  .ig-grid{ grid-template-columns: repeat(3, 1fr); }
  .ig-tile:nth-child(n+4){ display: none; }
}
.ig-tile{
  overflow: hidden;
  border-radius: 4px;
}
.ig-tile img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.ig-tile:hover img{
  transform: scale(1.06);
}

/* ── Footer tokens ───────────────────────────────────── */
.knot-divider-footer{ width: 100%; height: 56px; }
.knot-divider-footer path{ fill: none; stroke: var(--gold); stroke-width: 1; stroke-linecap: round; }
@media (max-width: 768px){
  .knot-divider-footer{ height: 40px; }
}
.grain-link{ position: relative; color: var(--parchment); }
.grain-link::after{ content: ''; position: absolute; left: 0; right: 100%; bottom: -4px; height: 1px; background: var(--gold); transition: right 0.35s ease; }
.grain-link:hover::after{ right: 0; }
.tracked{ letter-spacing: 0.18em; }
.tracked-lg{ letter-spacing: 0.28em; }
.font-display{ font-family: var(--serif, 'Fraunces', serif); }
footer p{ margin: 0; }

/* scroll reveal */
.reveal{ opacity: 0; transform: translateY(18px); transition: opacity 0.75s ease, transform 0.75s ease; }
.reveal.in{ opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce){
  .reveal{ opacity: 1; transform: none; transition: none; }
  html{ scroll-behavior: auto; }
}
      ` }} />

      {/* ── SITE NAV ──────────────────────────────── */}
      <header className="site-nav">
        <div className="wrap nav-row">
          <a href="/home" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={cloudinaryUrl(commonImages.logos.nav)} onError={handleImageError} alt="DKNOTT Logo" className="brand-logo" />
          </a>
          <nav className="nav-links">
            <a href="/home">Home</a>
            <a href="/about">About</a>
            <a href="/our_story" className="active">Our Story</a>
            <a href="/wedding_films">Wedding Films</a>
            <a href="/real_weddings">Real Weddings</a>
            <a href="/client_guide">Client Guide</a>
            <a href="/contact">Contact</a>
          </nav>
          <div className="nav-cta">
            <button className="nav-toggle" aria-label="Menu">
              <span className="hamburger" />
            </button>
          </div>
        </div>
      </header>

      {/* ── 1. HERO BAND ──────────────────────────── */}
      <section className="story-hero">
        <img
          src={STORY_IMAGES.hero}
          onError={handleImageError}
          alt="Davood behind the lens"
          className="story-hero-bg"
        />
        <div className="story-hero-content wrap">
          <span className="eyebrow white">OUR STORY · 12 YEARS BEHIND THE LENS</span>
          <h1>DAVOOD</h1>
          <p className="story-hero-sub">
            An Unconventional Storyteller &bull; Luxury Indian Wedding &amp; Documentary Photographer
          </p>
          <blockquote className="story-hero-quote">
            "Every photograph has a story. But some stories are not meant to be simply photographed — they are meant to be felt."
          </blockquote>
        </div>
      </section>

      {/* ── 2. THE 12-YEAR JOURNEY & THE ARTIST ───── */}
      <section className="section">
        <div className="wrap grid-editorial">
          <div className="reveal">
            <span className="eyebrow">BUILT ONE FRAME AT A TIME</span>
            <h2>Understanding People, Traditions &amp; Fleeting Emotions</h2>
            <p className="lede">
              For Davood, photography was never just about owning a camera, finding the perfect frame, or creating beautiful pictures.
            </p>
            <p>
              It became a way of understanding people, emotions, traditions, relationships, and those tiny moments that often disappear before anyone realizes how meaningful they were.
            </p>
            <p>
              For more than 12 years, this journey has been built one frame at a time — through countless weddings, endless hours of preparation, unpredictable moments, late nights, early mornings, difficult situations, beautiful celebrations, and thousands of memories entrusted by families.
            </p>
            <p>
              The journey was never about reaching a position overnight. It was about starting from the beginning, learning through every experience, making mistakes, improving with every wedding, understanding light, mastering composition, observing people, studying emotions, experimenting with visual storytelling, and constantly searching for a more honest way to photograph a wedding.
            </p>
            <p style={{ fontWeight: 500, color: 'var(--ink)' }}>
              Over the years, that dedication slowly became a signature.
            </p>
          </div>

          <div className="reveal" style={{ transitionDelay: '0.15s' }}>
            <div className="story-img-frame">
              <img
                src={STORY_IMAGES.portraitOne}
                onError={handleImageError}
                alt="Davood - Documentary Wedding Photographer"
              />
            </div>
            <div className="story-img-caption">Davood &bull; 12+ Years Documenting Real Moments</div>
          </div>
        </div>
      </section>

      {/* ── 3. EDITORIAL CALLOUT: A WEDDING IS NEVER JUST A WEDDING ── */}
      <section className="section blush tight">
        <div className="wrap">
          <div className="story-quote-box reveal">
            <span className="eyebrow" style={{ color: 'var(--oxblood)' }}>THE MOMENTS THAT MATTER</span>
            <h2>"A wedding is never just a wedding."</h2>
            <p>
              It is a bride quietly waiting before she walks into a new chapter of her life. It is a father trying to hold back his emotions. It is a mother fixing her daughter's outfit one last time. It is a groom surrounded by friends, unaware that years later he will look back at that exact moment and remember the laughter. It is grandparents watching generations come together. It is a child running through a celebration without knowing that someone has just captured a memory the family will treasure forever.
            </p>
            <span className="story-quote-highlight">
              These are the moments that matter. And these are the moments worth chasing.
            </span>
          </div>
        </div>
      </section>

      {/* ── 4. THE PHILOSOPHY: THE INVISIBLE OBSERVER ── */}
      <section className="section">
        <div className="wrap grid-editorial rev">
          <div className="reveal" style={{ transitionDelay: '0.15s' }}>
            <div className="story-img-frame">
              <img
                src={STORY_IMAGES.portraitTwo}
                onError={handleImageError}
                alt="Davood observing the wedding celebration"
              />
            </div>
            <div className="story-img-caption">The Invisible Observer &bull; Quiet Observation</div>
          </div>

          <div className="reveal">
            <span className="eyebrow">THE PHILOSOPHY</span>
            <h2>Do Not Force a Moment When You Can Discover a Real One</h2>
            <p className="lede">
              Today, Davood is known for an unconventional approach to Indian wedding photography — where luxury meets authenticity, where cinematic visuals meet documentary storytelling, and where photographs are created not merely to look beautiful, but to preserve how a moment actually felt.
            </p>
            <p>
              Instead of turning every wedding into a perfectly rehearsed production, the approach focuses on observing what is naturally happening and transforming those authentic moments into timeless visual stories.
            </p>
            <div style={{ background: 'var(--paper-deep)', padding: '1.4rem 1.8rem', borderLeft: '3px solid var(--oxblood)', margin: '1.8rem 0', borderRadius: '0 4px 4px 0' }}>
              <p style={{ margin: 0, fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--ink)' }}>
                The camera becomes almost invisible.<br />
                The photographer watches. He waits. He observes.<br />
                And when the right moment arrives — a glance, a smile, a tear, a touch, a laugh, a silence — the frame is created.
              </p>
            </div>
            <p>
              This documentary influence is at the heart of the work. But storytelling does not mean compromising on luxury.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. CINEMATIC SCALE & LUXURY INDIAN WEDDINGS ── */}
      <section className="section deep">
        <div className="wrap">
          <div className="reveal" style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="eyebrow gold">WHERE LUXURY MEETS AUTHENTICITY</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Cinematic Visuals, Extraordinary Scale</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.85' }}>
              Indian weddings are celebrations of extraordinary scale, culture, craftsmanship, fashion, architecture, traditions, and emotion. From grand mandaps and magnificent venues to couture outfits, jewellery, floral installations, intimate ceremonies, and spectacular receptions, every detail deserves to be photographed with intention.
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.85' }}>
              That is where the visual language becomes cinematic. Light is carefully observed. Composition is deliberately created. Movement, depth, atmosphere, colour, architecture, and emotion come together to create photographs that feel larger than the moment itself.
            </p>
          </div>

          {/* 4 Pillars of the Style */}
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            <div style={{ padding: '2rem 1.5rem', border: '1px solid rgba(248,243,233,0.18)', borderRadius: '4px', background: 'rgba(255,255,255,0.03)' }}>
              <h3 style={{ color: 'var(--gold-light)', fontSize: '1.15rem', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Elegant</h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(248,243,233,0.7)' }}>When it needs to be</p>
            </div>
            <div style={{ padding: '2rem 1.5rem', border: '1px solid rgba(248,243,233,0.18)', borderRadius: '4px', background: 'rgba(255,255,255,0.03)' }}>
              <h3 style={{ color: 'var(--gold-light)', fontSize: '1.15rem', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Emotional</h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(248,243,233,0.7)' }}>When it matters most</p>
            </div>
            <div style={{ padding: '2rem 1.5rem', border: '1px solid rgba(248,243,233,0.18)', borderRadius: '4px', background: 'rgba(255,255,255,0.03)' }}>
              <h3 style={{ color: 'var(--gold-light)', fontSize: '1.15rem', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Unscripted</h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(248,243,233,0.7)' }}>Whenever possible</p>
            </div>
            <div style={{ padding: '2rem 1.5rem', border: '1px solid rgba(248,243,233,0.18)', borderRadius: '4px', background: 'rgba(255,255,255,0.03)' }}>
              <h3 style={{ color: 'var(--gold-light)', fontSize: '1.15rem', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Cinematic</h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(248,243,233,0.7)' }}>Throughout every film &amp; frame</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. WHAT 12 YEARS HAVE TAUGHT (LESSONS PILLARS) ── */}
      <section className="section">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
            <span className="eyebrow">LESSONS FROM THE CRAFT</span>
            <h2>Twelve Years of Constant Learning</h2>
            <p>
              Over these twelve years, every wedding has taught something different. This constant learning became an essential part of the journey. Because photography is never finished — there is always another light to understand, another story to discover, another family to meet, and another frame that has never been created before.
            </p>
          </div>

          <div className="story-pillars-grid reveal">
            {LESSON_PILLARS.map((p, idx) => (
              <div key={idx} className="pillar-card">
                <span className="pillar-num">{p.num}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KNOT DIVIDER ──────────────────────────── */}
      <div className="knot-divider reveal" style={{ margin: '0 clamp(1.25rem,4vw,2.5rem)', borderTop: 'none' }}>
        <span className="knot" style={{ color: 'var(--gold)', width: '1.4rem', height: '1.4rem' }}>
          <svg viewBox="-100 -100 200 200" aria-hidden="true">
            <path d={KNOT_D} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </span>
      </div>

      {/* ── 7. HARD WORK & INSTINCT ─────────────────── */}
      <section className="section tight">
        <div className="wrap grid-editorial">
          <div className="reveal">
            <span className="eyebrow" style={{ color: 'var(--oxblood)' }}>BEHIND THE SCENES &bull; THE INSTINCT</span>
            <h2>More Than Experience — Built on Hard Work &amp; Instinct</h2>
            <p className="lede">
              Behind the photographs is also a story of hard work. The glamorous final image is only a small part of what happens behind the scenes.
            </p>
            <p>
              There are long hours of preparation, travelling, planning, equipment checks, location scouting, understanding timelines, coordinating with teams, waiting for the right light, working through challenging conditions, and spending countless hours after the wedding carefully selecting, editing, and refining every image.
            </p>
            <p>
              Twelve years of this work have built more than experience. They have built instinct:
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.8rem', listStyle: 'disc' }}>
              <li style={{ marginBottom: '0.6rem', color: 'var(--ink)' }}><strong>The ability to anticipate a moment</strong> before it happens.</li>
              <li style={{ marginBottom: '0.6rem', color: 'var(--ink)' }}><strong>The ability to understand</strong> when to step forward and when to disappear.</li>
              <li style={{ marginBottom: '0.6rem', color: 'var(--ink)' }}><strong>The ability to recognize raw emotion</strong> in a fraction of a second.</li>
              <li style={{ marginBottom: '0.6rem', color: 'var(--ink)' }}><strong>And most importantly, the ability</strong> to tell a family's story without taking away from the people who are living it.</li>
            </ul>
          </div>

          <div className="reveal" style={{ transitionDelay: '0.15s' }}>
            <div className="story-img-frame">
              <img
                src={STORY_IMAGES.portraitThree}
                onError={handleImageError}
                alt="Davood on location - Preparation, Scouting and Craft"
                style={{ objectPosition: 'center 55%' }}
              />
            </div>
            <div className="story-img-caption">On Location &bull; Preparation, Scouting &amp; Craft</div>
          </div>
        </div>
      </section>

      {/* ── KNOT DIVIDER ──────────────────────────── */}
      <div className="knot-divider reveal" style={{ margin: '0 clamp(1.25rem,4vw,2.5rem)', borderTop: 'none' }}>
        <span className="knot" style={{ color: 'var(--gold)', width: '1.4rem', height: '1.4rem' }}>
          <svg viewBox="-100 -100 200 200" aria-hidden="true">
            <path d={KNOT_D} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </span>
      </div>

      {/* ── 8. THE PURPOSE: CREATING A VISUAL LEGACY ─── */}
      <section className="section tight">
        <div className="wrap grid-editorial rev">
          <div className="reveal" style={{ transitionDelay: '0.15s' }}>
            <div className="story-img-frame">
              <img
                src={STORY_IMAGES.portraitFour}
                onError={handleImageError}
                alt="Davood - Preserving Memories for Generations"
                style={{ objectPosition: 'center 65%' }}
              />
            </div>
            <div className="story-img-caption">A Visual Legacy &bull; Preserving Memories for Generations</div>
          </div>

          <div className="reveal">
            <span className="eyebrow gold">THE PURPOSE</span>
            <h2>Creating a Visual Legacy Across Generations</h2>
            <p className="lede">
              For Davood, success is not simply measured by how many weddings have been photographed. It is measured by how many families trusted the camera with their memories.
            </p>
            <p>
              How many couples looked at their photographs years later and felt the same emotion again. How many parents found themselves emotional while watching their children begin a new chapter. And how many ordinary seconds became extraordinary memories because they were preserved forever.
            </p>
            <p>
              Today, the vision is bigger than simply documenting weddings. It is about creating a visual legacy — a collection of photographs and films that can travel through generations: from the couple, to their children, and eventually to their grandchildren.
            </p>
            <div style={{ background: 'var(--paper-deep)', padding: '1.4rem 1.8rem', borderLeft: '3px solid var(--gold)', margin: '1.8rem 0 0', borderRadius: '0 4px 4px 0' }}>
              <p style={{ margin: 0, fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--ink)', lineHeight: '1.7' }}>
                "Because a wedding photograph should not only belong to the year it was created. It should belong to the family. It should survive changing trends, changing technology, and changing generations."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. SIGNATURE CLOSING ──────────────────── */}
      <section className="section blush tight" style={{ paddingBottom: 'clamp(2rem, 3.5vw, 3rem)' }}>
        <div className="wrap">
          <div className="story-signature-block reveal" style={{ paddingBottom: 0 }}>
            <span className="knot" style={{ color: 'var(--gold)', width: '2rem', height: '2rem', marginBottom: '1.25rem' }}>
              <svg viewBox="-100 -100 200 200" aria-hidden="true">
                <path d={KNOT_D} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </span>
            <p style={{ fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)', color: 'var(--ink)', lineHeight: '1.7', marginBottom: '2rem' }}>
              "After more than 12 years behind the lens, the journey continues with the same hunger to learn, the same respect for every story, and the same belief that there is always one more unforgettable moment waiting to be captured."
            </p>
            <h2 className="story-signature-name">DAVOOD</h2>
            <p className="story-signature-title">
              Unconventional Storyteller &bull; Luxury Indian Weddings &bull; Documentary Photography
            </p>
            <p className="story-signature-tagline">
              Capturing what happened. Preserving how it felt.
            </p>
          </div>
        </div>
      </section>

      {/* ── 9. FOOTER ─────────────────────────────── */}
      <footer style={{"background":"var(--ink)","color":"var(--parchment)"}} className="pt-10 pb-4">
        <div className="max-w-6xl mx-auto px-6">

          {/*  Instagram Grid  */}
          <div className="mt-12 mb-4">
            <div className="flex justify-center flex-wrap" style={{"gap":"clamp(1rem, 2.5vw, 2.5rem)"}}>
              <a href="https://www.instagram.com/dknottphotography" target="_blank" rel="noopener noreferrer" className="ig-tile relative block" style={{"width":"clamp(100px, 16%, 180px)","aspectRatio":"3/4","borderRadius":"4px"}}>
                <img src={cloudinaryUrl(commonImages.instagram[0])} onError={handleImageError} className="w-full h-full object-cover rounded-sm" alt="Instagram 1" />
              </a>
              <a href="https://www.instagram.com/dknottphotography" target="_blank" rel="noopener noreferrer" className="ig-tile relative block" style={{"width":"clamp(100px, 16%, 180px)","aspectRatio":"3/4","borderRadius":"4px"}}>
                <img src={cloudinaryUrl(commonImages.instagram[1])} onError={handleImageError} className="w-full h-full object-cover rounded-sm" alt="Instagram 2" />
              </a>
              <a href="https://www.instagram.com/dknottphotography" target="_blank" rel="noopener noreferrer" className="ig-tile relative block" style={{"width":"clamp(100px, 16%, 180px)","aspectRatio":"3/4","borderRadius":"4px"}}>
                <img src={cloudinaryUrl(commonImages.heroes.realWeddings)} onError={handleImageError} className="w-full h-full object-cover rounded-sm" alt="Instagram 3" />
              </a>
              <a href="https://www.instagram.com/dknottphotography" target="_blank" rel="noopener noreferrer" className="ig-tile relative block" style={{"width":"clamp(100px, 16%, 180px)","aspectRatio":"3/4","borderRadius":"4px"}}>
                <img src={cloudinaryUrl(commonImages.instagram[3])} onError={handleImageError} className="w-full h-full object-cover rounded-sm" alt="Instagram 4" />
              </a>
              <a href="https://www.instagram.com/dknottphotography" target="_blank" rel="noopener noreferrer" className="ig-tile relative block" style={{"width":"clamp(100px, 16%, 180px)","aspectRatio":"3/4","borderRadius":"4px"}}>
                <img src={cloudinaryUrl(commonImages.instagram[4])} onError={handleImageError} className="w-full h-full object-cover rounded-sm" alt="Instagram 5" />
              </a>
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
                  <img src={cloudinaryUrl(commonImages.logos.large)} onError={handleImageError} alt="DKNOTT" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm tracked" style={{"color":"var(--parchment)"}}>DKNOTT</p>
                  <p className="text-[10px] tracked" style={{"color":"var(--sage)"}}>PHOTOGRAPHY</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{"color":"var(--sage)","maxWidth":"32ch"}}>
                Documentary wedding photography and film, shot across India — quiet moments, kept honestly.
              </p>
            </div>

            {/*  Navigate  */}
            <div className="md:col-span-4">
              <p className="text-[11px] tracked-lg uppercase mb-5" style={{"color":"var(--gold)"}}>Navigate</p>
              <ul className="space-y-3 text-sm">
                <li><a href="/home" className="grain-link" style={{"color":"var(--parchment)"}}>Home</a></li>
                <li><a href="/about" className="grain-link" style={{"color":"var(--parchment)"}}>About</a></li>
                <li><a href="/our_story" className="grain-link" style={{"color":"var(--parchment)"}}>Our story</a></li>
                <li><a href="/wedding_films" className="grain-link" style={{"color":"var(--parchment)"}}>Wedding films</a></li>
                <li><a href="/real_weddings" className="grain-link" style={{"color":"var(--parchment)"}}>Real weddings</a></li>
                <li><a href="/client_guide" className="grain-link" style={{"color":"var(--parchment)"}}>Client guide</a></li>
                <li><a href="/contact" className="grain-link" style={{"color":"var(--parchment)"}}>Let's connect</a></li>
              </ul>
            </div>

            {/*  Contact  */}
            <div className="md:col-span-3">
              <p className="text-[11px] tracked-lg uppercase mb-5" style={{"color":"var(--gold)"}}>Studio</p>
              <ul className="space-y-3 text-sm" style={{"color":"var(--parchment)"}}>
                <li>Hyderabad, India</li>
                <li>dknottphotography3@gmail.com</li>
                <li>+91 91107 08256</li>
              </ul>
            </div>

          </div>

          {/*  CTA line  */}
          <div className="text-center mt-10">
            <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(1.6rem, 3vw, 2.75rem)', lineHeight: 1.3, color: 'var(--parchment)', margin: 0 }}>
              Every knot tells a story.<br className="hidden md:block" /> Let's start yours.
            </p>
            <a href="/contact" className="inline-block mt-6 text-xs tracked-lg uppercase grain-link" style={{"color":"var(--gold)"}}>
              Enquire about your date
            </a>
          </div>

          {/*  Bottom bar  */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-10 pt-4" style={{"borderTop":"1px solid rgba(199,163,105,0.15)"}}>
            <p className="text-xs" style={{"color":"var(--sage)"}}>© 2026 DKNOTT Photography. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="https://www.instagram.com/dknottphotography" target="_blank" rel="noopener noreferrer" className="text-xs tracked" style={{"color":"var(--parchment)","opacity":"0.8","transition":"opacity 0.3s","padding":"0.2rem"}} onMouseOver={(e) => e.currentTarget.style.opacity="1"} onMouseOut={(e) => e.currentTarget.style.opacity="0.8"} aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://www.pinterest.com/dknottphotography" target="_blank" rel="noopener noreferrer" className="text-xs tracked" style={{"color":"var(--parchment)","opacity":"0.8","transition":"opacity 0.3s","padding":"0.2rem"}} onMouseOver={(e) => e.currentTarget.style.opacity="1"} onMouseOut={(e) => e.currentTarget.style.opacity="0.8"} aria-label="Pinterest">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.163 0 7.398 2.967 7.398 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
              </a>
              <button onClick={() => window.scrollTo({top:0,behavior:"smooth"})} className="w-8 h-8 rounded-full flex items-center justify-center transition" style={{"border":"1px solid rgba(199,163,105,0.3)","color":"var(--gold)"}} aria-label="Back to top">
                ↑
              </button>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}
