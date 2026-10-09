import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import OurStory from './pages/OurStory'
import About from './pages/About'
import WeddingFilms from './pages/WeddingFilms'
import RealWeddings from './pages/RealWeddings'
import ClientGuide from './pages/ClientGuide'
import Contact from './pages/Contact'
import LinkTree from './pages/Index'
import Universe from './pages/Universe'
import { useSanityDoc } from './lib/useSanityDoc'
import { isPreviewMode } from './sanity'
import { stegaClean } from '@sanity/client/stega'

/**
 * Studio draft-preview overlays. Only mounted when the site runs inside the
 * Sanity Studio's Presentation tool (preview mode); the package is imported
 * lazily so live visitors never download it. If it fails to load for any
 * reason the page still renders normally, just without edit overlays.
 */
function PreviewVisualEditing() {
  const [VisualEditing, setVisualEditing] = React.useState(null);

  React.useEffect(() => {
    let alive = true;
    import('@sanity/visual-editing/react')
      .then((m) => { if (alive) setVisualEditing(() => m.VisualEditing); })
      .catch((e) => console.warn('Visual editing overlays unavailable:', e?.message || e));
    return () => { alive = false; };
  }, []);

  return VisualEditing ? <VisualEditing /> : null;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/** Load a Google Font on demand (no-op if already present). */
function ensureGoogleFont(family) {
  try {
    const safe = String(family).replace(/[^a-zA-Z0-9 \-]/g, '').trim();
    if (!safe) return;
    const id = 'sanity-font-' + safe.toLowerCase().replace(/\s+/g, '-');
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(safe).replace(/%20/g, '+') + ':wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  } catch (e) {
    /* font loading is decorative — never break rendering */
  }
}

/**
 * Applies the Sanity `siteSettings` brand theme as CSS variables on :root.
 * Inline custom properties beat each page's <style> :root defaults, so the
 * client's colors/fonts win wherever the pages use var(--paper), var(--gold),
 * var(--ink), var(--serif), var(--sans). When Sanity has no values, nothing
 * is overridden and the built-in design is untouched.
 */
function SiteTheme() {
  const { data: settings } = useSanityDoc('siteSettings');

  React.useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;
    const set = (name, value) => {
      // Preview mode: Sanity strings may carry invisible stega characters
      // that would make a CSS value invalid; strip them (no-op when live).
      if (typeof value === 'string') value = stegaClean(value);
      if (typeof value === 'string' && value.trim() !== '') {
        try { root.style.setProperty(name, value); } catch (e) { /* ignore */ }
      }
    };
    // Colors
    set('--paper', settings.backgroundColor);
    set('--gold', settings.accentColor);
    set('--ink', settings.textColor);
    set('--brand-primary', settings.primaryColor);
    set('--brand-secondary', settings.secondaryColor);
    // Fonts
    if (settings.headingFont) {
      const f = String(settings.headingFont).replace(/[^a-zA-Z0-9 \-]/g, '').trim();
      if (f) {
        set('--serif', `'${f}', serif`);
        set('--font-heading', `'${f}', serif`);
        ensureGoogleFont(f);
      }
    }
    if (settings.bodyFont) {
      const f = String(settings.bodyFont).replace(/[^a-zA-Z0-9 \-]/g, '').trim();
      if (f) {
        set('--sans', `'${f}', sans-serif`);
        set('--font-body', `'${f}', sans-serif`);
        ensureGoogleFont(f);
      }
    }
  }, [settings]);

  return null;
}

/** Sets the browser tab title from Sanity `siteSettings.browserTabTitle`. */
function SiteTabTitle() {
  const { data: settings } = useSanityDoc('siteSettings');

  React.useEffect(() => {
    try {
      const t = typeof settings?.browserTabTitle === 'string' && settings.browserTabTitle.trim()
        ? stegaClean(settings.browserTabTitle).trim()
        : 'DKNOTT Photography';
      if (document.title !== t) document.title = t;
    } catch (e) { /* never break rendering */ }
  }, [settings]);

  return null;
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SiteTheme />
      <SiteTabTitle />
      <ScrollToTop />
      {isPreviewMode && <PreviewVisualEditing />}
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/index" element={<LinkTree />} />
        <Route path="/home" element={<Home />} />
        <Route path="/our_story" element={<OurStory />} />
        <Route path="/wedding_films" element={<WeddingFilms />} />
        <Route path="/real_weddings" element={<RealWeddings />} />
        <Route path="/client_guide" element={<ClientGuide />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/universe" element={<Universe />} />
      </Routes>
    </Router>
  )
}

export default App
