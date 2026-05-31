function showToast(x: number, y: number, text: string) {
  const el = document.createElement("div");
  el.className = "copy-toast";
  el.textContent = `Copied ${text}`;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

/**
 * Double-click any <img> to copy its source-relative path (base prefix
 * stripped) to the clipboard — an authoring aid for grabbing asset paths.
 * Delegated on `document` so it covers every image, including ones in dialogs.
 * Returns a cleanup that removes the listener.
 */
export function setupImageCopy(): () => void {
  const prefix = import.meta.env.BASE_URL.replace(/\/$/, "");
  const onDblClick = (e: MouseEvent) => {
    const target = e.target;
    if (!(target instanceof HTMLImageElement)) return;
    let path = target.currentSrc || target.src;
    try {
      path = new URL(path).pathname;
    } catch {
      // keep the raw value if it isn't a parseable URL
    }
    if (prefix && path.startsWith(`${prefix}/`)) path = path.slice(prefix.length);
    void navigator.clipboard
      ?.writeText(path)
      .then(() => showToast(e.clientX, e.clientY, path))
      .catch(() => {});
  };
  document.addEventListener("dblclick", onDblClick);
  return () => document.removeEventListener("dblclick", onDblClick);
}
