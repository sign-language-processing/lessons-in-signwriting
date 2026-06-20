import { useTranslation } from "react-i18next";
import { ContactExplorer } from "../components/ContactExplorer";

export function Ch4Contact() {
  const { t } = useTranslation();
  return (
    <>
      <h2 id="chapter-4">
        {t("common.chapterHeading", { number: 4, title: t("toc.chapter-4") })}
      </h2>
      <ContactExplorer />
    </>
  );
}
