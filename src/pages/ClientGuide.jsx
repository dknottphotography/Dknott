import React, { useEffect } from 'react';
import { cloudinaryUrl, handleImageError } from '../lib/cloudinary';
import { commonImages, weddingGalleries } from '../data/images';
import { useSanityDoc } from '../lib/useSanityDoc';
import { sanityImg } from '../lib/sanityContent';
import { navLinksFrom, isActiveLink } from '../lib/siteContent';

/* Built-in FAQs (used when Sanity has none yet). */
const FAQS = [
  {
    question: "How far in advance should we book?",
    answer: "Most of our couples book 8\u201312 months out, especially for wedding-season dates (October to February). We do sometimes take on shorter-notice bookings \u2014 reach out and we'll tell you honestly if your date is realistic.",
    open: true
  },
  {
    question: "What's included in a standard package?",
    answer: "Every package includes a lead photographer, full-day coverage, an online gallery of edited images, and a teaser film. Feature films, second shooters, albums and additional days are available as add-ons \u2014 we'll walk through the options on our call.",
    open: false
  },
  {
    question: "Do you travel for destination weddings?",
    answer: "Yes \u2014 we regularly shoot outside our home city and are happy to travel internationally. Travel and stay are quoted separately based on the location and number of days.",
    open: false
  },
  {
    question: "How long until we get our photos?",
    answer: "A teaser gallery of 40\u201360 images arrives within a week of the wedding. The full edited gallery and feature film are delivered within 6\u20138 weeks, sooner outside peak season.",
    open: false
  },
  {
    question: "Do we get the raw, unedited files?",
    answer: "We deliver fully edited, colour-graded images rather than raw files \u2014 editing is a core part of how we shape the final story, and it's included in every package.",
    open: false
  },
  {
    question: "Can we book just photography or just film?",
    answer: "Yes, both are available separately, though most couples find it easier to book both together as one coordinated team rather than syncing two vendors' schedules.",
    open: false
  },
  {
    question: "How many functions can you cover?",
    answer: "As many as your wedding has. Multi-day, multi-function bookings are the norm for us, not the exception \u2014 mehendi, haldi, sangeet, ceremony and reception can all be quoted as one package.",
    open: false
  },
  {
    question: "What's your payment structure?",
    answer: "We ask for a booking deposit to confirm your date, with the remaining balance due before the wedding. Exact terms are laid out in your contract once we've confirmed your package.",
    open: false
  },
  {
    question: "Do you print albums?",
    answer: "Yes \u2014 hand-designed, printed albums are available as an add-on, and we'll walk you through layout options once your gallery is finalised.",
    open: false
  }
];

export default function ClientGuide() {
  const { data } = useSanityDoc('clientGuidePage');
  const { data: settings } = useSanityDoc('siteSettings');
  // FAQs from Sanity (clientGuidePage.faqs) with built-in fallback.
  const faqs = (data?.faqs && data.faqs.length) ? data.faqs : FAQS;
  useEffect(() => {
    if (window.__ClientGuideScriptLoaded) return;
    window.__ClientGuideScriptLoaded = true;

    
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
  min-height: clamp(580px, 80vh, 880px);
  display: flex;
  align-items: flex-end;
  position: relative;
  overflow: hidden;
  padding-top: clamp(7rem, 14vw, 10rem);
}
.hero-band::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 180px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 65%, transparent 100%);
  pointer-events: none;
  z-index: 1;
}
@media (min-width: 768px) {
  .hero-band { min-height: 660px; }
}
@media (min-width: 1024px) {
  .hero-band { min-height: 85vh; max-height: 920px; }
}

.client-hero-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 82%;
  z-index: 0;
  filter: brightness(0.85);
}
@media (max-width: 768px) {
  .client-hero-img {
    object-position: 31% center;
  }
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
        <a key={l.href} href={l.href} className={isActiveLink(l.href, '/client_guide') ? 'active' : undefined}>{l.label}</a>
      ))}
    </nav>
    <div className="nav-cta">
      <button className="nav-toggle" aria-label="Menu">
        <span className="hamburger"></span>
      </button>
    </div>
  </div>
</header>

<section className="hero-band">
  <img
    src={sanityImg(data?.heroImage) || cloudinaryUrl(commonImages.heroes?.clientGuide || 'https://res.cloudinary.com/ddcwf9ji/image/upload/v1790349408/RSR_5653-2_1.jpg')}
    onError={handleImageError}
    alt="Client Guide Hero"
    className="client-hero-img object-[31%_center] md:object-[center_82%]"
  />
  <div className="hero-content wrap" style={{ position: "relative", zIndex: "2", color: "white", textShadow: "0 2px 10px rgba(0,0,0,0.6)", paddingBottom: "clamp(2rem, 4vw, 3.5rem)" }}>
    <span className="eyebrow" style={{ color: "white", borderColor: "white" }}>{data?.heroEyebrow || 'Client Guide'}</span>
    <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", maxWidth: "24ch", lineHeight: 1.25 }}>{data?.heroHeading || `Everything you'd normally ask us over coffee.`}</h1>
  </div>
</section>

<section className="section tight">
  <div className="wrap max-56 mx-auto reveal">

    {faqs.map((f, i) => (
      <details className="faq" key={i} open={i === 0}>
        <summary>{f.question}</summary>
        <p>{f.answer}</p>
      </details>
    ))}
  </div>
</section>

<section className="section olive center">
  <div className="wrap reveal">
    <h2 style={{"color":"var(--paper)"}}>{data?.ctaHeading || 'Still have a question?'}</h2>
    <p className="max-56 mx-auto" style={{"marginBottom":"1.5rem"}}>{data?.ctaText || `We'd rather answer it now than surprise you later — reach out any time.`}</p>
    <a href="/contact" className="btn" style={{"borderColor":"var(--paper)","color":"var(--paper)"}}>{data?.ctaLabel || 'Ask us directly'}</a>
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
          <a key={i} href={settings?.instagramUrl || 'https://www.instagram.com/dknottphotography'} target="_blank" rel="noopener noreferrer" className="ig-tile relative block" style={{"width":"clamp(100px, 16%, 180px)","aspectRatio":"3/4","borderRadius":"4px"}}>
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
            {(() => { const _t = (settings?.title || 'DKNOTT'); const _d = (settings?.description || 'PHOTOGRAPHY'); return (_d && !_t.toLowerCase().includes(_d.toLowerCase())) ? (<p className="text-[10px] tracked" style={{"color":"var(--sage)"}}>{_d}</p>) : null; })()}
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
        <button onClick={() => window.scrollTo({top:0,behavior:"smooth"})} className="w-8 h-8 rounded-full flex items-center justify-center transition" style={{"border":"1px solid rgba(199,163,105,0.3)","color":"var(--gold)"}} aria-label={settings?.backToTopLabel || "Back to top"}>
          ↑
        </button>
      </div>
    </div>

  </div>
</footer>



    </>
  );
}
