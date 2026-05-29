const PDF_HASH_KEY = "pdf-hash";

const DEBUG = false;
const log = (...args: unknown[]) => {
  if (DEBUG) console.log("[pdf-scroll]", ...args);
};

/**
 * Persist the PDF iframe's position across reloads.
 *
 * We use Mozilla's PDF.js viewer (served from /pdfjs/web/viewer.html). PDF.js
 * keeps its current scroll position in the iframe's URL hash, in the form
 * `#page=N&zoom=auto,0,123`, and updates it as the user scrolls/zooms. So
 * we just need to listen for `hashchange` on the iframe's contentWindow and
 * persist the hash; on reload we set the iframe src with the saved hash.
 *
 * (Chrome's native PDF viewer renders inside a sealed <embed> that doesn't
 * expose any scroll state to JS, so we can't use it.)
 */
export function setupScrollPersist() {
  const findIframe = () => {
    const iframe = document.querySelector<HTMLIFrameElement>(
      ".pdf-debug iframe",
    );
    if (iframe) {
      wireUp(iframe);
    } else {
      requestAnimationFrame(findIframe);
    }
  };

  const wireUp = (iframe: HTMLIFrameElement) => {
    // 1) Apply saved hash to the iframe src BEFORE it finishes loading.
    const saved = localStorage.getItem(PDF_HASH_KEY);
    if (saved && saved.length > 1 && !iframe.src.includes("#")) {
      iframe.src = iframe.src + saved;
      log("restored hash:", saved);
    }

    const onLoad = () => {
      try {
        const cw = iframe.contentWindow;
        if (!cw) return;
        const saveHash = () => {
          try {
            const h = cw.location.hash;
            if (h) {
              localStorage.setItem(PDF_HASH_KEY, h);
              log("saved hash:", h);
            }
          } catch (e) {
            log("hash read failed:", e);
          }
        };
        cw.addEventListener("hashchange", saveHash);
        log("hashchange listener attached");
      } catch (e) {
        log("could not access contentWindow:", e);
      }
    };

    iframe.addEventListener("load", onLoad);
  };

  findIframe();
}
