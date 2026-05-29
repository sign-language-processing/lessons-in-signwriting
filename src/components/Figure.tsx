import { useState, type CSSProperties, type ReactNode } from "react";

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
  const finalSrc =
    src.startsWith("http") || src.startsWith("/")
      ? src
      : `/${ARTIFACTS}/${src}`;

  const [copied, setCopied] = useState(false);
  const handleDoubleClick = async () => {
    try {
      await navigator.clipboard.writeText(finalSrc);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore — clipboard may be unavailable (insecure context, etc.)
    }
  };

  return (
    <figure style={style}>
      {caption && (
        <figcaption>
          <div className="caption">{caption}</div>
        </figcaption>
      )}
      <span
        className="img-wrap"
        style={wrapStyle}
        onDoubleClick={handleDoubleClick}
        title="Double-click to copy image path"
      >
        <img src={finalSrc} alt={alt ?? ""} style={imgStyle} />
        {overlay}
        {copied && <span className="img-copied">Copied</span>}
      </span>
    </figure>
  );
}
