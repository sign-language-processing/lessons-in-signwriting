const PREFIX = import.meta.env.BASE_URL.replace(/\/$/, "");

/**
 * Resolve a root-relative public asset path against the Vite `base`, so the app
 * works when served from a sub-path (e.g. GitHub Pages at
 * `/lessons-in-signwriting/`). Absolute URLs (http, protocol-relative, data,
 * blob) pass through untouched, and the function is idempotent — re-applying it
 * never double-prefixes an already-resolved path.
 */
export function asset(path: string): string;
export function asset(path: string | undefined): string | undefined;
export function asset(path: string | undefined): string | undefined {
  if (!path) return path;
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }
  const rooted = path.startsWith("/") ? path : `/${path}`;
  if (PREFIX && (rooted === PREFIX || rooted.startsWith(`${PREFIX}/`))) {
    return rooted;
  }
  return `${PREFIX}${rooted}`;
}
