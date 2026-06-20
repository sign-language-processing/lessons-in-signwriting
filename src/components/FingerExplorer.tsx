import { useTranslation } from "react-i18next";
import { SymbolExplorer, type ExplorerType } from "./SymbolExplorer";

const META = [
  { symbol: "񆡁", slugs: ["finger-huh", "finger-milk"] },
  { symbol: "񆨡", slugs: ["finger-eleven", "finger-understand"] },
  { symbol: "񆱥", slugs: ["finger-twenty", "finger-boy"] },
  { symbol: "񆱡", slugs: ["finger-send", "finger-send-send"] },
  { symbol: "񆲅", slugs: ["finger-goodbye", "finger-why"] },
  { symbol: "񆸁", slugs: ["finger-fingerspell", "finger-typing"] },
];

export function FingerExplorer() {
  const { t } = useTranslation();
  const data = t("ch5.fingers", { returnObjects: true }) as {
    name: string;
    paragraphs: string[];
  }[];
  const types: ExplorerType[] = META.map((m, i) => ({
    name: data[i]?.name ?? "",
    symbol: m.symbol,
    sections: [{ paragraphs: data[i]?.paragraphs ?? [], slugs: m.slugs }],
  }));
  return <SymbolExplorer ariaLabel={t("ch5.fingerAria")} types={types} />;
}
