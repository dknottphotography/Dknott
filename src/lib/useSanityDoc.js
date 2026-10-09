import { useEffect, useState } from 'react';
import { client, isPreviewMode } from '../sanity';

/**
 * Fetch a single Sanity document by its _id.
 * Never throws and never breaks rendering: on any error or when the
 * document does not exist, `data` stays null so callers fall back to
 * their hardcoded content.
 *
 * In Studio preview mode the query ALSO matches the document's draft id
 * (drafts.<id>) so unpublished edits render on the site before they are
 * published; live mode only ever matches the published document.
 *
 * @param {string} docId - the Sanity document _id (e.g. 'siteSettings')
 * @returns {{ data: object|null, loading: boolean, error: Error|null }}
 */
export function useSanityDoc(docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const query = isPreviewMode
      ? '*[_id == $id || _id == $draftId][0]'
      : '*[_id == $id][0]';
    const params = isPreviewMode
      ? { id: docId, draftId: `drafts.${docId}` }
      : { id: docId };
    client
      .fetch(query, params)
      .then((d) => {
        if (cancelled) return;
        setData(d || null);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        // Graceful degradation: warn once, keep hardcoded fallbacks.
        console.warn(`Sanity fetch skipped for "${docId}" (using fallback content):`, err?.message || err);
        setData(null);
        setError(err);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [docId]);

  return { data, loading, error };
}

export default useSanityDoc;
