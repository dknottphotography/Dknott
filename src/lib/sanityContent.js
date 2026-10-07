import { cloudinaryUrl } from './cloudinary';

/**
 * Shared Sanity content helpers. Everything here degrades gracefully:
 * missing/empty Sanity values produce '' or fallbacks, never exceptions.
 */

/** Extract a usable image URL from a Sanity `cloudinary.asset` value. */
export function sanityImg(asset) {
  if (!asset) return '';
  if (typeof asset === 'string') return cloudinaryUrl(asset);
  return asset.secure_url || asset.url || '';
}

/**
 * Normalize a Sanity `realWedding` document into the shape the site's
 * wedding components expect ({ id, title, location, tags, description,
 * coverImage, photos }). Falls back cleanly when fields are missing.
 */
export function normalizeWedding(doc) {
  if (!doc || typeof doc !== 'object') return null;
  const gallery = Array.isArray(doc.gallery)
    ? doc.gallery.map(sanityImg).filter(Boolean)
    : [];
  const cover = sanityImg(doc.coverImage) || gallery[0] || '';
  return {
    id: doc.slug || doc._id || '',
    title: doc.title || 'Untitled Wedding',
    location: doc.location || '',
    // Site filter pills use lowercase tags: destination | traditional | intimate
    tags: (doc.category || '').toString().toLowerCase(),
    description: doc.description || '',
    coverImage: cover,
    photos: gallery.length ? { Gallery: gallery } : {},
  };
}

/** Map an array of Sanity docs through normalizeWedding, dropping empties. */
export function normalizeWeddings(docs) {
  if (!Array.isArray(docs)) return [];
  return docs.map(normalizeWedding).filter(Boolean);
}

/** Pick the first non-empty string from a list of candidates. */
export function pick(...candidates) {
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim() !== '') return c;
  }
  return '';
}
