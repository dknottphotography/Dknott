/**
 * Shared site-chrome helpers: navigation links and active-state detection.
 * All Sanity reads degrade gracefully — when the siteSettings document is
 * missing or a field is empty, the built-in defaults below are used.
 */

export const DEFAULT_NAV_LINKS = [
  { label: 'Home', href: '/home' },
  { label: 'About', href: '/about' },
  { label: 'Our Story', href: '/our_story' },
  { label: 'Wedding Films', href: '/wedding_films' },
  { label: 'Real Weddings', href: '/real_weddings' },
  { label: 'Client Guide', href: '/client_guide' },
  { label: 'Contact', href: '/contact' },
];

/** Nav links from Sanity siteSettings, or the built-in defaults. */
export function navLinksFrom(settings) {
  if (settings && Array.isArray(settings.navLinks) && settings.navLinks.length) {
    return settings.navLinks.filter((l) => l && l.label && l.href);
  }
  return DEFAULT_NAV_LINKS;
}

/**
 * Whether a nav link should render as active for the given page.
 * `selfHref` is the current page's own path (e.g. '/about').
 */
export function isActiveLink(href, selfHref) {
  try {
    const p = window.location.pathname;
    if (p === href) return true;
    // The site root (/) renders the About page.
    if (p === '/' && href === selfHref) return true;
    return false;
  } catch (e) {
    return href === selfHref;
  }
}
