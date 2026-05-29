import { useState, type CSSProperties } from "react";
import { HAND_GROUPS, type HandExample, type HandGroup } from "../lib/handGroups";
import { SgnwSign, SgnwSymbol } from "./Sgnw";

const ART = "/docling-out/sw0116-Lessons-SignWriting_artifacts";

function copyOnDoubleClick(src: string) {
  return () => {
    void navigator.clipboard?.writeText(src).catch(() => {});
  };
}

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
      <img
        src={src}
        alt={example.word}
        loading="lazy"
        onDoubleClick={copyOnDoubleClick(src)}
        title="Double-click to copy image path"
      />
      <figcaption>{example.word}</figcaption>
    </li>
  );
}

function GroupPanel({ group }: { group: HandGroup }) {
  return (
    <>
      <h3 style={{ marginBlockStart: 0 }}>
        Group {group.number} — {group.name}
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
          <h4 style={{ marginBlockStart: "1.5em" }}>Examples</h4>
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
  const [selected, setSelected] = useState(0);
  const group = HAND_GROUPS[selected]!;

  return (
    <>
      <section className="hand-groups-explorer screen-only">
        <nav aria-label="Hand groups" className="hand-groups-menu">
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
                <strong>Group {g.number}</strong>
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
                <strong>Group {g.number}:</strong> {g.name}
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
