import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import es from "./locales/es.json";
import pt from "./locales/pt.json";

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "pt", label: "Português (Brasil)" },
  { code: "es", label: "Español" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pt: { translation: pt },
      es: { translation: es },
    },
    fallbackLng: "en",
    supportedLngs: LANGUAGES.map((l) => l.code),
    load: "languageOnly",
    nonExplicitSupportedLngs: true,
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "lang",
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

const syncHtmlLang = (lng: string) => {
  document.documentElement.lang = lng;
};
i18n.on("languageChanged", syncHtmlLang);
syncHtmlLang(i18n.resolvedLanguage ?? "en");

export default i18n;
