import { createClient } from '@sanity/client'

const STUDIO_URL = 'https://dknott-studio-dknott1.vercel.app'

/**
 * Draft preview mode is on when the site is viewed from the Sanity Studio's
 * Presentation tool: the Studio loads the site with `?sanity-preview=1`, and
 * preview browsing keeps the site inside the Studio iframe. ONLY in preview
 * mode does the client (a) ask Sanity for draft documents, so unpublished
 * edits appear on the real site before publishing, and (b) stega-encode
 * text, which is what lets the Studio draw click-to-edit overlays. Live
 * visitors always get a plain client that returns published content with
 * no encoding, exactly as before.
 */
export const isPreviewMode = (() => {
  try {
    if (new URLSearchParams(window.location.search).has('sanity-preview')) return true
    return window.self !== window.top
  } catch (e) {
    return false
  }
})()

export const client = createClient({
  projectId: 'cqd974oj',
  dataset: 'production',
  useCdn: false, // Set to false so you instantly see updates without caching!
  apiVersion: '2024-03-20',
  ...(isPreviewMode
    ? {
        perspective: 'previewDrafts',
        stega: { enabled: true, studioUrl: STUDIO_URL },
        // Read-only (Viewer) API token from the client's Sanity project
        // (manage -> API -> Tokens). It is only sent in preview mode;
        // live visitors never use it and only ever see published content.
        // Without it the preview still loads, but shows the last published
        // content instead of draft edits.
        token: import.meta.env.VITE_SANITY_READ_TOKEN || undefined,
      }
    : {}),
})
