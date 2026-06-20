import { useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { HAND_GROUPS, type HandExample, type HandGroup } from "../lib/handGroups";
import { asset } from "../lib/asset";
import { SgnwSign, SgnwSymbol } from "./Sgnw";

const ART = asset("/docling-out/sw0116-Lessons-SignWriting_artifacts");

function ExampleCell({ example }: { example: HandExample }) {
  if (example.placeholder) {
    return <li className="hand-groups-examples__placeholder" aria-hidden="true" />;
  }
  if (example.sign) {
    return (
      <li>
        <SgnwSign sign={example.sign} video={example.video} size={36} />
        <figcaption>{example.word}</figcaption>
      </li>
    );
  }
  const src = `${ART}/${example.file}`;
  return (
    <li>
      <img src={src} alt={example.word} loading="lazy" />
      <figcaption>{example.word}</figcaption>
    </li>
  );
}

function GroupPanel({ group }: { group: HandGroup }) {
  const { t } = useTranslation();
  return (
    <>
      <h3 style={{ marginBlockStart: 0 }}>
        {t("ui.group", { n: group.number })} — {group.name}
      </h3>
      <ul className="hand-groups-bases">
        {group.bases.map((b) => (
          <li key={b.symbol}>
            <SgnwSymbol symbol={b.symbol} size={36} />
            <span>{b.name}</span>
          </li>
        ))}
      </ul>
      {group.examples.length > 0 && (
        <>
          <h4 style={{ marginBlockStart: "1.5em" }}>{t("ui.examples")}</h4>
          <ul className="hand-groups-examples">
            {group.examples.map((ex, i) => (
              <ExampleCell key={`${ex.word}-${i}`} example={ex} />
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export function HandGroupsExplorer() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(0);
  const group = HAND_GROUPS[selected]!;

  return (
    <>
      <section className="hand-groups-explorer screen-only">
        <nav aria-label={t("ui.handGroupsAria")} className="hand-groups-menu">
          {HAND_GROUPS.map((g, i) => (
            <button
              key={g.number}
              type="button"
              aria-current={i === selected ? "true" : undefined}
              onClick={() => setSelected(i)}
              style={menuItemStyle(i === selected)}
            >
              <SgnwSymbol symbol={g.symbol} size={28} />
              <span className="hand-groups-menu__label">
                <strong>{t("ui.group", { n: g.number })}</strong>
                <span>{g.name}</span>
              </span>
            </button>
          ))}
        </nav>

        <div className="hand-groups-panel">
          <GroupPanel group={group} />
        </div>
      </section>

      <div className="print-only">
        <ul className="hand-groups">
          {HAND_GROUPS.map((g) => (
            <li key={g.number}>
              <SgnwSymbol symbol={g.symbol} />
              <span>
                <strong>{t("ui.group", { n: g.number })}:</strong> {g.name}
              </span>
            </li>
          ))}
        </ul>
        {HAND_GROUPS.map((g) => (
          <div key={g.number} style={{ breakInside: "avoid" }}>
            <GroupPanel group={g} />
          </div>
        ))}
      </div>
    </>
  );
}

function menuItemStyle(active: boolean): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "0.6em",
    padding: "0.5em 0.75em",
    border: active ? "2px solid #d33" : "1px solid #ddd",
    background: active ? "#fff5f5" : "white",
    borderRadius: 6,
    cursor: "pointer",
    font: "inherit",
    textAlign: "left",
    width: "100%",
  };
}
