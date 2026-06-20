import { useTranslation } from "react-i18next";
import { SymbolExplorer, type ExplorerType } from "./SymbolExplorer";

const META = [
  { symbol: "񆇡", sections: [["more", "school", "dating", "deaf"]] },
  { symbol: "񆌁", sections: [["grasp-earring", "grasp-congratulations"]] },
  { symbol: "񆊡", sections: [["between-disappear", "between-america"]] },
  { symbol: "񆐡", sections: [["strike-hit", "strike-clap"]] },
  { symbol: "񆕁", sections: [["brush-excuse-me", "brush-monthly", "brush-easy"]] },
  {
    symbol: "񆙡",
    sections: [
      ["circular-coffee", "circular-chocolate"],
      ["straight-nice", "straight-eager"],
      ["rub-temperature"],
    ],
  },
];

type LocContact = {
  name: string;
  sections: { title?: string; paragraphs: string[] }[];
};

export function ContactExplorer() {
  const { t } = useTranslation();
  const data = t("ch4.contacts", { returnObjects: true }) as LocContact[];
  const types: ExplorerType[] = META.map((m, i) => ({
    name: data[i]?.name ?? "",
    symbol: m.symbol,
    sections: m.sections.map((slugs, j) => ({
      title: data[i]?.sections[j]?.title,
      paragraphs: data[i]?.sections[j]?.paragraphs ?? [],
      slugs,
    })),
  }));
  return <SymbolExplorer ariaLabel={t("ch4.contactAria")} types={types} />;
}
