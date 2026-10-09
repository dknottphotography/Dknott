import { stegaClean } from '@sanity/client/stega';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ddcwf9ji';

export function cloudinaryUrl(publicId, transforms = "f_auto,q_auto") {
  if (!publicId) return '';
  // In Studio preview mode a Sanity-sourced public_id can carry invisible
  // stega characters that would corrupt the URL; strip them (no-op live).
  if (typeof publicId === 'string') publicId = stegaClean(publicId);
  // If it's already an absolute URL (e.g. from Sanity or an external host), return as is
  if (typeof publicId === 'string' && (publicId.startsWith('http://') || publicId.startsWith('https://'))) {
    return publicId;
  }
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

export function handleImageError(e) {
  // Graceful fallback for broken images
  e.target.style.display = 'none'; // Or set a placeholder image source
}
