const LINK_ICON =
  '<svg width="0.8em" height="0.8em" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
  '<path d="M7.78 3.22a.75.75 0 0 1 1.06 1.06L7.59 5.53a2.5 2.5 0 0 0 3.54 3.54l2.5-2.5a2.5 2.5 0 0 0-3.54-3.54.75.75 0 1 1-1.06-1.06 4 4 0 0 1 5.66 5.66l-2.5 2.5a4 4 0 0 1-5.66-5.66l1.25-1.25Z"/>' +
  '<path d="M8.22 12.78a.75.75 0 0 1-1.06-1.06l1.25-1.25A2.5 2.5 0 0 0 4.87 6.93l-2.5 2.5a2.5 2.5 0 0 0 3.54 3.54.75.75 0 1 1 1.06 1.06 4 4 0 0 1-5.66-5.66l2.5-2.5a4 4 0 0 1 5.66 5.66l-1.25 1.25Z"/></svg>';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Give every h1/h2/h3 under `root` a stable id (existing ids like `chapter-6`
 * are kept) and a hover-revealed anchor link that jumps to it. Runs once after
 * mount; idempotent so React StrictMode's double-invoke is harmless.
 */
export function setupHeadingAnchors(root: HTMLElement) {
  const used = new Set<string>();
  root.querySelectorAll("[id]").forEach((el) => used.add(el.id));

  root.querySelectorAll<HTMLHeadingElement>("h1, h2, h3").forEach((h) => {
    if (h.querySelector(".heading-anchor")) return;

    let id = h.id;
    if (!id) {
      const base = slugify(h.textContent ?? "") || "section";
      id = base;
      let n = 2;
      while (used.has(id)) id = `${base}-${n++}`;
      h.id = id;
    }
    used.add(id);

    const a = document.createElement("a");
    a.className = "heading-anchor";
    a.href = `#${id}`;
    a.setAttribute("aria-label", "Link to this section");
    a.setAttribute("data-no-print", "");
    a.innerHTML = LINK_ICON;
    h.appendChild(a);
  });
}
