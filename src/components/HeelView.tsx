import { asset } from "../lib/asset";

const BASE = asset("/textbook/heel-views");

export type HeelViewCardProps = {
  photo: string;
  /** Optional second photo (e.g. the "top view" companion in image 176). */
  altPhoto?: string;
  symbolL: string;
  symbolR: string;
};

const LABEL = "Heel of Hand Wrist View …OR… Top View";

export function HeelViewCard({
  photo,
  altPhoto,
  symbolL,
  symbolR,
}: HeelViewCardProps) {
  return (
    <div className="heel-view">
      <img className="heel-view__photo" src={`${BASE}/${photo}`} alt="" />
      <div className="heel-view__symbols">
        <div className="heel-view__label">{LABEL}</div>
        <div className="heel-view__pair">
          <img src={`${BASE}/${symbolL}`} alt="Heel of Hand Wrist View symbol" />
          <img src={`${BASE}/${symbolR}`} alt="Top View symbol" />
        </div>
      </div>
      {altPhoto ? (
        <img className="heel-view__photo" src={`${BASE}/${altPhoto}`} alt="" />
      ) : null}
    </div>
  );
}
