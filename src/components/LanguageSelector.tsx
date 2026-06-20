import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n";

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  return (
    <label className="lang-select" data-no-print>
      <span className="lang-select__label">{t("common.language")}</span>
      <select
        className="lang-select__menu"
        value={i18n.resolvedLanguage}
        onChange={(e) => void i18n.changeLanguage(e.target.value)}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
