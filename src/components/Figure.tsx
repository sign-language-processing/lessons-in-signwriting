import { type CSSProperties, type ReactNode } from "react";
import { asset } from "../lib/asset";

const ARTIFACTS = "docling-out/sw0116-Lessons-SignWriting_artifacts";

export type FigureProps = {
  src: string;
  alt?: string;
  caption?: ReactNode;
  /** Optional inline style passed to the outer <figure>. */
  style?: CSSProperties;
  /** Optional inline style passed to the inner img-wrap span. */
  wrapStyle?: CSSProperties;
  /** Optional inline style passed to the inner <img>. */
  imgStyle?: CSSProperties;
  /** Content rendered absolutely-positioned over the image (e.g., a sgnw-symbol overlay). */
  overlay?: ReactNode;
};

export function Figure({
  src,
  alt,
  caption,
  style,
  wrapStyle,
  imgStyle,
  overlay,
}: FigureProps) {
  const finalSrc = asset(
    src.startsWith("http") || src.startsWith("/") ? src : `/${ARTIFACTS}/${src}`,
  );

  return (
    <figure style={style}>
      {caption && (
        <figcaption>
          <div className="caption">{caption}</div>
        </figcaption>
      )}
      <span className="img-wrap" style={wrapStyle}>
        <img src={finalSrc} alt={alt ?? ""} style={imgStyle} />
        {overlay}
      </span>
    </figure>
  );
}
