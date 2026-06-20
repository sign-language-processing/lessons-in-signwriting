import { useTranslation } from "react-i18next";
import { CHAPTERS } from "../chapters/registry";
import { LanguageSelector } from "./LanguageSelector";

export function Sidebar() {
  const { t } = useTranslation();
  return (
    <nav className="toc-sidebar" data-no-print>
      <h2>{t("common.tableOfContents")}</h2>
      <ol className="toc">
        {CHAPTERS.map((c) => (
          <li key={c.id}>
            <a href={`#${c.id}`}>{t(`toc.${c.id}`)}</a>
          </li>
        ))}
      </ol>
      <LanguageSelector />
    </nav>
  );
}
