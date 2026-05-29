import { useState, type CSSProperties } from "react";
import { figures } from "../content/figures";
import { SignFigure } from "./SignFigure";

export type ExplorerSection = {
  title?: string;
  paragraphs: string[];
  slugs: string[];
};

export type ExplorerType = {
  name: string;
  symbol: string;
  sections: ExplorerSection[];
};

const hasIllustration = (slug: string) => Boolean(figures[slug]?.illustration);

function Panel({ type }: { type: ExplorerType }) {
  return (
    <div className="symbol-panel">
      <header className="symbol-panel__head">
        <sgnw-symbol symbol={type.symbol}></sgnw-symbol>
        <h3>{type.name}</h3>
      </header>
      {type.sections.map((section, i) => {
        const illustrated = section.slugs.filter(hasIllustration);
        const plain = section.slugs.filter((slug) => !hasIllustration(slug));
        return (
          <div className="symbol-panel__section" key={section.title ?? i}>
            {section.title && <h4>{section.title}</h4>}
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {[illustrated, plain].map(
              (group, g) =>
                group.length > 0 && (
                  <div className="examples-row" key={g}>
                    {group.map((slug) => (
                      <SignFigure key={slug} slug={slug} />
                    ))}
                  </div>
                ),
            )}
          </div>
        );
      })}
    </div>
  );
}

export type SymbolExplorerProps = {
  ariaLabel: string;
  types: ExplorerType[];
};

export function SymbolExplorer({ ariaLabel, types }: SymbolExplorerProps) {
  const [index, setIndex] = useState(0);
  const type = types[index]!;

  return (
    <section className="symbol-explorer">
      <div role="tablist" aria-label={ariaLabel} className="symbol-tabs" data-no-print>
        {types.map((t, i) => (
          <button
            key={t.name}
            role="tab"
            type="button"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            style={tabStyle(i === index)}
          >
            <sgnw-symbol symbol={t.symbol} style={{ fontSize: 24 }}></sgnw-symbol>
            <span style={{ marginInlineStart: 6 }}>{t.name}</span>
          </button>
        ))}
      </div>

      <div className="screen-only">
        <Panel type={type} />
      </div>
      <div className="print-only">
        {types.map((t) => (
          <Panel key={t.name} type={t} />
        ))}
      </div>
    </section>
  );
}

function tabStyle(active: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.4em 0.8em",
    border: active ? "2px solid #d33" : "1px solid #ccc",
    background: active ? "#fff5f5" : "white",
    cursor: "pointer",
    borderRadius: 6,
    font: "inherit",
  };
}
