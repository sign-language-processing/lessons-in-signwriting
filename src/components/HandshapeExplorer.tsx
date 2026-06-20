import { Fragment, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { asset } from "../lib/asset";
import { fillVariants, symbolToKey } from "../lib/handImage";
import { SgnwSymbol } from "./Sgnw";

const ART = asset("/docling-out/sw0116-Lessons-SignWriting_artifacts");

type Shape = {
  name: string;
  symbol: string;
  wallPhotos: [string, string, string];
  floorPhotos: [string, string, string];
};

const SHAPES: Shape[] = [
  {
    name: "Index Hand",
    symbol: "񀀁",
    wallPhotos: [
      "page_index_front_r1_photo.png",
      "page_index_front_r2_photo.png",
      "page_index_front_r3_photo.png",
    ],
    floorPhotos: [
      "page_index_top_r1_photo.png",
      "page_index_top_r2_photo.png",
      "page_index_top_r3_photo.png",
    ],
  },
  {
    name: "Closed Fist",
    symbol: "񆄡",
    wallPhotos: [
      "page_closed_fist_front_r1_photo.png",
      "page_closed_fist_front_r2_photo.png",
      "page_closed_fist_front_r3_photo.png",
    ],
    floorPhotos: [
      "page_closed_fist_top_r1_photo.png",
      "page_closed_fist_top_r2_photo.png",
      "page_closed_fist_top_r3_photo.png",
    ],
  },
  {
    name: "D-Hand",
    symbol: "񀁡",
    wallPhotos: [
      "page_open_index_front_r1_photo.png",
      "page_open_index_front_r2_photo.png",
      "page_open_index_front_r3_photo.png",
    ],
    floorPhotos: [
      "page_open_index_top_r1_photo.png",
      "page_open_index_top_r2_photo.png",
      "page_open_index_top_r3_photo.png",
    ],
  },
  {
    name: "Open Fist",
    symbol: "񂱁",
    wallPhotos: [
      "image_000106_248a79acc2c7a50b27d5f7ce14cabc426ae536c8795206416c35256e12ee3210.png",
      "image_000107_0c06861530e4302ea4ca0c7988c975719561193a8c46569990ca8909a6e2b5eb.png",
      "image_000108_8ca632426902a7dfda53dad01b748defaf779305d26905632d9286dacbd7994d.png",
    ],
    floorPhotos: [
      "page_open_fist_top_r1_photo.png",
      "page_open_fist_top_r2_photo.png",
      "page_open_fist_top_r3_photo.png",
    ],
  },
  {
    name: "5-Hand",
    symbol: "񁲁",
    wallPhotos: [
      "image_000113_5692d96a37b0919f4c111ed5ab43063c2d0c03cfb9aa4138b7ff79da3c5e6f1c.png",
      "image_000114_160bbde34ccc6251bb7d9bd252b122e99df665677f8081984835487313a5c54b.png",
      "image_000115_ec946a4fc80a80f03afd07c55a2a852bde66593b1118cf6454d72914d27d7824.png",
    ],
    floorPhotos: [
      "page_five_hand_top_r1_photo.png",
      "page_five_hand_top_r2_photo.png",
      "page_five_hand_top_r3_photo.png",
    ],
  },
  {
    name: "Flat Hand",
    symbol: "񂇁",
    wallPhotos: [
      "image_000120_9484a4d3ced72795fa4ede63ef4a37378a3bfbd1caecc48bf5a2b2076671a331.png",
      "image_000121_f63c3b2e012598f02f465ea93e1c3380d1c1ec926f4a48aac560cefda9c8cbb4.png",
      "image_000122_b17bbb946e4fc796e26b1230e39659a8cd369dc2d436ef99b15416a0ffa38655.png",
    ],
    floorPhotos: [
      "page_flat_hand_top_r1_photo.png",
      "page_flat_hand_top_r2_photo.png",
      "page_flat_hand_top_r3_photo.png",
    ],
  },
];

type Plane = "wall" | "floor";

const SHAPE_NAME_KEYS = [
  "indexHand",
  "closedFist",
  "dHand",
  "openFist",
  "fiveHand",
  "flatHand",
];

function ShapePanel({ shape, plane }: { shape: Shape; plane: Plane }) {
  const key = symbolToKey(shape.symbol);
  const variants = key ? fillVariants(key) : [];
  const planeVariants =
    plane === "wall" ? variants.slice(0, 3) : variants.slice(3, 6);
  const photos = plane === "wall" ? shape.wallPhotos : shape.floorPhotos;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1em 1.5em",
        alignItems: "center",
        justifyItems: "center",
      }}
    >
      {planeVariants.map((v, i) => (
        <Fragment key={v.key}>
          <SgnwSymbol symbol={v.swu} />
          <img
            src={`${ART}/${photos[i]}`}
            alt=""
            style={{ maxHeight: 180, width: "auto" }}
          />
        </Fragment>
      ))}
    </div>
  );
}

export function HandshapeExplorer() {
  const { t } = useTranslation();
  const [shapeIdx, setShapeIdx] = useState(0);
  const [plane, setPlane] = useState<Plane>("wall");
  const shape = SHAPES[shapeIdx]!;
  const shapeName = (i: number) => t(`ui.shapeNames.${SHAPE_NAME_KEYS[i]}`);
  const planeLabel = (p: Plane) =>
    t(p === "wall" ? "ui.wallPlane" : "ui.floorPlane");

  return (
    <section
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: "1em",
        marginBlock: "1.5em",
      }}
    >
      <header
        data-no-print
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1em",
          justifyContent: "space-between",
          alignItems: "center",
          marginBlockEnd: "1em",
        }}
      >
        <div role="tablist" aria-label={t("ui.handshapeAria")} style={tabBarStyle}>
          {SHAPES.map((s, i) => (
            <button
              key={s.name}
              role="tab"
              type="button"
              aria-selected={i === shapeIdx}
              onClick={() => setShapeIdx(i)}
              style={tabStyle(i === shapeIdx)}
            >
              <sgnw-symbol
                symbol={s.symbol}
                style={{ fontSize: 22 }}
              ></sgnw-symbol>
              <span style={{ marginInlineStart: 6 }}>{shapeName(i)}</span>
            </button>
          ))}
        </div>
        <div role="tablist" aria-label={t("ui.planeAria")} style={tabBarStyle}>
          {(["wall", "floor"] as Plane[]).map((p) => (
            <button
              key={p}
              role="tab"
              type="button"
              aria-selected={plane === p}
              onClick={() => setPlane(p)}
              style={tabStyle(plane === p)}
            >
              {planeLabel(p)}
            </button>
          ))}
        </div>
      </header>

      <div className="screen-only">
        <ShapePanel shape={shape} plane={plane} />
      </div>

      <div className="print-only">
        {SHAPES.map((s, i) =>
          (["wall", "floor"] as Plane[]).map((p) => (
            <div
              key={`${s.name}-${p}`}
              style={{ marginBlockEnd: "1.5em", breakInside: "avoid" }}
            >
              <h3 style={{ marginBlockEnd: "0.5em" }}>
                {shapeName(i)} — {planeLabel(p)}
              </h3>
              <ShapePanel shape={s} plane={p} />
            </div>
          )),
        )}
      </div>
    </section>
  );
}

const tabBarStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.25em",
};

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
