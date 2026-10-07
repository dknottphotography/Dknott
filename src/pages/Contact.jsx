import React, { useEffect } from 'react';
import { cloudinaryUrl, handleImageError } from '../lib/cloudinary';
import { commonImages, weddingGalleries } from '../data/images';
import { supabase } from '../lib/supabaseClient';
import { useSanityDoc } from '../lib/useSanityDoc';
import { sanityImg } from '../lib/sanityContent';
import { navLinksFrom, isActiveLink } from '../lib/siteContent';

export default function Contact() {
  const { data } = useSanityDoc('contactPage');
  const { data: settings } = useSanityDoc('siteSettings');
  // Contact details: page-specific first, then site-wide settings, then built-ins.
  const contactEmail = data?.email || settings?.contactEmail || 'dknottphotography3@gmail.com';
  const contactPhone = data?.phone || settings?.contactPhone || '+91 91107 08256';
  const contactAddress = data?.address || settings?.contactAddress || 'Hyderabad, India';
  const [formData, setFormData] = React.useState({
    name1: '', name2: '', email: '', phone: '', date: '', city: '', interest: 'Photography only', message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState(null);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      // 1. Insert into Supabase
      const { error: supabaseError } = await supabase
        .from('inquiries')
        .insert([{ 
          name1: formData.name1,
          name2: formData.name2,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          city: formData.city,
          interest: formData.interest,
          message: formData.message
        }]);

      if (supabaseError) {
        console.error("Supabase Error:", supabaseError);
      }

      // 2. Send Email via EmailJS
      const emailJsPayload = {
        service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name: formData.name1,
          reply_to: formData.email,
          name: formData.name1,
          partner: formData.name2 || 'N/A',
          email: formData.email,
          phone: formData.phone,
          wedding_date: formData.date || 'N/A',
          city: formData.city || 'N/A',
          interest: formData.interest,
          message: formData.message || 'N/A'
        }
      };

      // 3. Send Auto-Reply to Customer via EmailJS
      const autoreplyJsPayload = {
        service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        template_id: import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID,
        user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name: formData.name1,
          reply_to: formData.email,
          name: formData.name1,
          email: formData.email
        }
      };

      const [response, autoreplyResponse] = await Promise.all([
        fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailJsPayload)
        }),
        fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(autoreplyJsPayload)
        })
      ]);
      
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name1: '', name2: '', email: '', phone: '', date: '', city: '', interest: 'Photography only', message: '' });
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        console.error("Web3Forms Error:", data);
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error("Submission Error:", err);
      setSubmitStatus('error');
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (window.__ContactScriptLoaded) return;
    window.__ContactScriptLoaded = true;

    
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
  max-width: var(--container, 1180px);
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

/* Contact Hero */
.contact-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: clamp(55vh, 65vh, 75vh);
  padding-top: clamp(8rem, 14vw, 11rem);
  padding-bottom: clamp(4rem, 6vw, 6rem);
}
.contact-hero::after {
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



      /* Floating Label & Glassmorphism Form styling */
      .elegant-field { 
        position: relative; 
        margin-bottom: 2.5rem; 
      }
      .elegant-field input, .elegant-field textarea, .elegant-field select {
        width: 100%; 
        background: transparent; 
        border: none; 
        border-bottom: 1.5px solid var(--line-strong); 
        padding: 1.2rem 0 0.5rem 0; 
        font-family: var(--sans); 
        font-size: 1.1rem; 
        color: var(--ink); 
        outline: none; 
        transition: border-color 0.4s ease;
      }
      .elegant-field select {
        padding-top: 1rem;
        color: var(--ink);
      }
      .elegant-field label { 
        position: absolute;
        top: 1.2rem;
        left: 0;
        font-size: 1.05rem; 
        color: var(--ink-soft); 
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        text-transform: none;
        letter-spacing: normal;
      }
      .elegant-field input:focus, .elegant-field textarea:focus, .elegant-field select:focus { 
        border-bottom: 1.5px solid var(--oxblood); 
      }
      .elegant-field input:focus ~ label,
      .elegant-field.filled input ~ label,
      .elegant-field textarea:focus ~ label,
      .elegant-field.filled textarea ~ label {
        top: -0.4rem;
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--oxblood);
      }
      .elegant-field select ~ label {
        top: -0.4rem;
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--ink-soft);
      }
      
      .contact-container {
        background: linear-gradient(145deg, rgba(240,232,216,0.9), rgba(240,232,216,0.4));
        backdrop-filter: blur(12px);
        padding: clamp(2.5rem, 4vw, 4rem);
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(38,32,25,0.06), inset 0 1px 0 rgba(255,255,255,0.5);
        animation: fadeRight 1s ease-out forwards;
        animation-delay: 0.5s;
        opacity: 0;
        border: 1px solid rgba(255,255,255,0.3);
      }

      .spinner {
        animation: spin 1s linear infinite;
        width: 18px; height: 18px;
        margin-right: 10px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: white;
        border-radius: 50%;
        display: inline-block;
      }
      @keyframes spin { 100% { transform: rotate(360deg); } }
      
      @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeRight { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes fadeLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
    

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
    <a href="/home" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
      <img src={sanityImg(settings?.logo) || cloudinaryUrl(commonImages.logos.nav)} onError={handleImageError} alt="DKNOTT Logo" className="brand-logo" />
    </a>
    <nav className="nav-links">
      {navLinksFrom(settings).map((l) => (
        <a key={l.href} href={l.href} className={isActiveLink(l.href, '/contact') ? 'active' : undefined}>{l.label}</a>
      ))}
    </nav>
    <div className="nav-cta">
      <button className="nav-toggle" aria-label="Menu">
        <span className="hamburger" />
      </button>
    </div>
  </div>
</header>

{/*  HERO  */}
<section className="contact-hero">
  <img src={sanityImg(data?.heroImage) || cloudinaryUrl('another_image.png')} onError={handleImageError} alt="Contact Hero" style={{"position":"absolute","top":"0","left":"0","width":"100%","height":"100%","objectFit":"cover","zIndex":"0","filter":"brightness(0.6)"}} />
  <div style={{"position":"relative","zIndex":"2","textAlign":"center","color":"white","textShadow":"0 4px 15px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)"}}>
    <h1 className="reveal" style={{"fontSize":"clamp(2.8rem, 6vw, 4.2rem)","fontFamily":"var(--serif)","letterSpacing":"0.02em","marginBottom":"1rem","color":"white"}}>{data?.heading || 'Tell us about your day.'}</h1>
    <p className="reveal" style={{"animationDelay":"0.2s","fontFamily":"var(--sans)","fontSize":"0.85rem","letterSpacing":"0.2em","textTransform":"uppercase","color":"#DFBB7B","maxWidth":"600px","margin":"0 auto","lineHeight":"1.6"}}>{data?.subheading || `Fill in the details below and we'll get back to you within 24–48 hours.`}</p>
  </div>
</section>

{/*  MAIN  */}
<section className="section" style={{"backgroundColor": "var(--paper)", "paddingTop":"6rem", "paddingBottom":"8rem"}}>
  <div className="wrap" style={{"maxWidth": "1200px", "margin": "0 auto"}}>
    
    <div style={{"display": "flex", "flexDirection": "column", "gap": "5rem"}} className="md-flex-row">
      <style>{`
        @media (min-width: 900px) {
          .md-flex-row { flex-direction: row !important; }
          .left-col { flex: 1.1; padding-right: 2rem; }
          .right-col { flex: 0.9; padding-left: 2rem; }
        }
        @media (max-width: 899px) {
          .contact-container { padding: 2rem !important; }
        }
        .left-col { flex: 1; }
        .right-col { flex: 1; }
        
        .contact-container {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 3.5rem 4rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 20px 40px rgba(38,32,25,0.05), inset 0 1px 0 rgba(255,255,255,0.8);
        }

        .ref-field { margin-bottom: 2.2rem; position: relative; }
        .ref-label { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-soft); display: block; margin-bottom: 0.6rem; font-weight: 600; }
        .ref-input { 
          width: 100%; 
          background: rgba(255,255,255,0.6); 
          border: 1px solid rgba(38,32,25,0.1); 
          border-bottom: 2px solid rgba(38,32,25,0.2);
          padding: 0.9rem 1rem; 
          font-family: var(--sans); 
          font-size: 0.95rem; 
          color: var(--ink); 
          outline: none; 
          transition: all 0.3s ease;
          border-radius: 4px 4px 0 0;
        }
        .ref-input::placeholder { color: rgba(38,32,25,0.3); font-style: italic; }
        .ref-input:focus { 
          background: rgba(255,255,255,0.9);
          border-bottom-color: var(--oxblood); 
          box-shadow: 0 4px 15px rgba(122,42,42,0.05);
        }
        
        .ref-pill { 
          padding: 0.7rem 1.4rem; 
          border-radius: 999px; 
          border: 1px solid rgba(38,32,25,0.2); 
          font-size: 0.75rem; 
          letter-spacing: 0.05em;
          background: transparent; 
          color: var(--ink-soft); 
          cursor: pointer; 
          transition: all 0.3s ease; 
          margin-right: 0.6rem; 
          margin-bottom: 0.6rem; 
        }
        .ref-pill.active { 
          border-color: var(--oxblood); 
          color: var(--paper); 
          background: var(--oxblood); 
          box-shadow: 0 4px 10px rgba(122,42,42,0.2);
        }
        .ref-pill:hover:not(.active) { border-color: var(--oxblood); color: var(--oxblood); }

        .btn-submit {
          width: 100%;
          background: var(--ink);
          color: var(--paper);
          border: none;
          padding: 1.2rem 2rem;
          border-radius: 4px;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 1rem;
          transition: all 0.3s ease;
          font-family: var(--sans);
          font-weight: 500;
        }
        .btn-submit:hover:not(:disabled) {
          background: var(--gold);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(199,163,105,0.3);
        }

        .info-block { margin-bottom: 2rem; }
        .info-label { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-soft); display: block; margin-bottom: 0.5rem; font-weight: 600; }
        .info-text { font-family: var(--sans); font-size: 1.1rem; color: var(--ink); display: inline-block; transition: color 0.3s; position: relative; text-decoration: none; }
        .info-text::after { content: ''; position: absolute; width: 100%; transform: scaleX(0); height: 1px; bottom: -2px; left: 0; background-color: var(--gold); transform-origin: bottom right; transition: transform 0.3s ease-out; }
        .info-text:hover::after { transform: scaleX(1); transform-origin: bottom left; }
        .info-text:hover { color: var(--gold); }
        
        .map-container {
          margin-top: 3rem;
          border-radius: 12px;
          overflow: hidden;
          height: 280px;
          border: 1px solid rgba(38,32,25,0.1);
          box-shadow: 0 10px 30px rgba(38,32,25,0.05);
          position: relative;
        }
        .map-container iframe {
          width: 100%;
          height: 100%;
          border: 0;
          filter: grayscale(0.2) contrast(1.1) sepia(0.2);
          transition: filter 0.5s ease;
        }
        .map-container:hover iframe {
          filter: grayscale(0) contrast(1) sepia(0);
        }
        .contact-hero {
          min-height: 45vh;
        }
        @media (min-width: 768px) {
          .contact-hero {
            min-height: 600px;
          }
        }
        @media (min-width: 1024px) {
          .contact-hero {
            min-height: 80vh;
          }
        }
      `}</style>

      {/* LEFT COLUMN: FORM */}
      <div className="left-col reveal">
        <div className="contact-container">
          <h2 style={{"fontSize": "1.6rem", "fontFamily": "var(--serif)", "color": "var(--ink)", "marginBottom": "2.5rem"}}>{data?.formHeading || 'Send an Inquiry'}</h2>
          
          <form id="inquiry-form" onSubmit={handleSubmit}>
            <div className="grid-2" style={{"gap": "1.5rem", "marginBottom": "0"}}>
              <div className="ref-field">
                <label className="ref-label">{data?.formName1Label || 'Your name'}</label>
                <input type="text" className="ref-input" placeholder={data?.formName1Placeholder || "Ananya"} value={formData.name1} onChange={(e) => setFormData({...formData, name1: e.target.value})} required />
              </div>
              <div className="ref-field">
                <label className="ref-label">{data?.formName2Label || "Partner's name"}</label>
                <input type="text" className="ref-input" placeholder={data?.formName2Placeholder || "Rohan"} value={formData.name2} onChange={(e) => setFormData({...formData, name2: e.target.value})} />
              </div>
            </div>
            
            <div className="grid-2" style={{"gap": "1.5rem", "marginBottom": "0"}}>
              <div className="ref-field">
                <label className="ref-label">{data?.formEmailLabel || 'Email address'}</label>
                <input type="email" className="ref-input" placeholder={data?.formEmailPlaceholder || "you@email.com"} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="ref-field">
                <label className="ref-label">{data?.formPhoneLabel || 'Mobile number'}</label>
                <input type="tel" className="ref-input" placeholder={data?.formPhonePlaceholder || "+91 00000 00000"} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
              </div>
            </div>
            
            <div className="grid-2" style={{"gap": "1.5rem", "marginBottom": "0"}}>
              <div className="ref-field">
                <label className="ref-label">{data?.formDateLabel || 'Wedding date'}</label>
                <input type="text" className="ref-input" placeholder={data?.formDatePlaceholder || "e.g. 14 Feb 2027"} value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="ref-field">
                <label className="ref-label">{data?.formCityLabel || 'City / venue'}</label>
                <input type="text" className="ref-input" placeholder={data?.formCityPlaceholder || "Hyderabad"} value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
              </div>
            </div>
            
            <div className="ref-field" style={{"marginTop": "0.5rem"}}>
              <label className="ref-label">{data?.formInterestLabel || 'Interested in'}</label>
              <div style={{"display": "flex", "flexWrap": "wrap"}}>
                <button type="button" className={`ref-pill ${formData.interest === 'Photography only' || !formData.interest ? 'active' : ''}`} onClick={() => setFormData({...formData, interest: 'Photography only'})}>{data?.interestPhotoLabel || 'Photography only'}</button>
                <button type="button" className={`ref-pill ${formData.interest === 'Films only' ? 'active' : ''}`} onClick={() => setFormData({...formData, interest: 'Films only'})}>{data?.interestFilmsLabel || 'Films only'}</button>
                <button type="button" className={`ref-pill ${formData.interest === 'Photography + Films' ? 'active' : ''}`} onClick={() => setFormData({...formData, interest: 'Photography + Films'})}>{data?.interestBothLabel || 'Photography + Films'}</button>
              </div>
            </div>
            
            <div className="ref-field" style={{"marginTop": "1.5rem"}}>
              <label className="ref-label">{data?.formMessageLabel || 'A little about your wedding'}</label>
              <textarea className="ref-input" placeholder={data?.formMessagePlaceholder || "Functions, guest count, what matters most to you..."} rows="3" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} style={{"resize": "none", "lineHeight": "1.6"}}></textarea>
            </div>
            
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isSubmitting}
              style={{ "color": "#F8F3E9", "background": submitStatus === "success" ? "#5C6B47" : (isSubmitting ? "#574E43" : ""), "border": "none",
                "cursor": isSubmitting ? "not-allowed" : "pointer"
              }}
            >
              {isSubmitting ? (data?.submitSendingLabel || "SENDING...") : submitStatus === "success" ? (data?.submitSentLabel || "SENT - THANK YOU") : (data?.submitLabel || "SUBMIT INQUIRY")}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: DIRECT CONTACT */}
      <div className="right-col reveal" style={{"animationDelay": "0.2s"}}>
        <h2 style={{"fontSize": "2.2rem", "fontWeight": "400", "fontFamily": "var(--serif)", "color": "var(--ink)", "marginBottom": "3rem", "letterSpacing": "-0.01em"}}>{data?.directHeading || 'Reach us directly'}</h2>
        
        <div className="info-block">
          <span className="info-label">{data?.emailLabel || 'Email'}</span>
          <a href={`mailto:${contactEmail}`} className="info-text">{contactEmail}</a>
        </div>
        
        <div className="info-block">
          <span className="info-label">{data?.phoneLabel || 'Phone / Whatsapp'}</span>
          <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="info-text">{contactPhone}</a>
        </div>
        
        <div className="info-block">
          <span className="info-label">{data?.instagramLabel || 'Instagram'}</span>
          <a href={settings?.instagramUrl || "https://instagram.com/dknottphotography"} target="_blank" rel="noreferrer" className="info-text">{data?.instagramHandle || "@dknottphotography"}</a>
        </div>
        
        <div className="map-container">
          {/* Default to a nice map of Hyderabad, India */}
          <iframe 
            src={data?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.31604107248!2d78.24323214532587!3d17.412299801452417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1716945892558!5m2!1sen!2sin"} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Studio Location"
          ></iframe>
        </div>
        
        <div style={{"marginTop": "2rem", "display": "flex", "alignItems": "center", "gap": "1rem"}}>
          <div style={{"width": "40px", "height": "1px", "background": "var(--gold)"}}></div>
          <p style={{"fontFamily": "var(--sans)", "fontSize": "0.75rem", "color": "var(--ink-soft)", "letterSpacing": "0.1em", "textTransform": "uppercase", "marginBottom": "0"}}>
            {data?.locationNote || 'Based in India, available worldwide.'}
          </p>
        </div>
      </div>
      
    </div>
  </div>
</section>




<footer style={{ "background": "var(--ink)", "color": "var(--parchment)" }} className="pt-10 pb-4">
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
          <div className="w-11 h-11 rounded-full flex items-center justify-center overflow-hidden" style={{ "color": "#F8F3E9", "background":"var(--paper)","border":"1px solid rgba(199,163,105,0.3)"}}>
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
          <li>{contactAddress}</li>
          <li>{contactEmail}</li>
          <li>{contactPhone}</li>
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




