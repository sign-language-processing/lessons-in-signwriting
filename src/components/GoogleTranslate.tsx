import { useEffect } from "react";

// Drop-in Google Website Translator widget. It injects a <select> that
// translates the whole page on the fly. The chosen language lives in Google's
// own `googtrans` cookie; we mirror it to localStorage and restore it (by
// re-setting the cookie before the widget initializes) so it survives refresh.

const KEY = "site-translate-lang";
const SCRIPT_ID = "google-translate-script";
const PAGE_LANG = "en";

type TranslateGlobal = {
  google?: { translate?: { TranslateElement: new (opts: object, el: string) => void } };
  googleTranslateElementInit?: () => void;
};

function setGoogtrans(lang: string | null) {
  const value = lang && lang !== PAGE_LANG ? `/${PAGE_LANG}/${lang}` : "";
  // Google reads `googtrans`; set it both host-scoped and domain-scoped so it
  // applies on this exact host and across subdomains.
  for (const scope of ["", `;domain=.${location.hostname}`]) {
    document.cookie = value
      ? `googtrans=${value};path=/${scope}`
      : `googtrans=;path=/${scope};expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

export function GoogleTranslate() {
  useEffect(() => {
    const w = window as unknown as TranslateGlobal;

    // Restore the saved language into the cookie so the widget applies it on init.
    const saved = localStorage.getItem(KEY);
    if (saved && saved !== PAGE_LANG) setGoogtrans(saved);

    w.googleTranslateElementInit = () => {
      if (!w.google?.translate) return;
      new w.google.translate.TranslateElement(
        { pageLanguage: PAGE_LANG, autoDisplay: false },
        "google_translate_element",
      );
    };

    if (document.getElementById(SCRIPT_ID)) {
      w.googleTranslateElementInit();
    } else {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    }

    // Persist whatever the user picks in the injected dropdown.
    const onChange = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target instanceof HTMLSelectElement && target.classList.contains("goog-te-combo")) {
        const lang = target.value || PAGE_LANG;
        localStorage.setItem(KEY, lang);
        setGoogtrans(lang);
      }
    };
    document.addEventListener("change", onChange, true);
    return () => document.removeEventListener("change", onChange, true);
  }, []);

  return (
    <div className="toc-translate" data-no-print>
      <span className="toc-translate__label">Translate this page</span>
      <div id="google_translate_element" />
    </div>
  );
}
