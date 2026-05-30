import type { CSSProperties, ReactNode } from "react";

/** Side-by-side two-column flex row. Pass `stretch` to make columns equal height with figures pushed to the bottom. */
export function Row({
  children,
  stretch = false,
  style,
}: {
  children: ReactNode;
  stretch?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={stretch ? "row stretch" : "row"} style={style}>
      {children}
    </div>
  );
}

/** A column for use inside a stretched <Row>. The trailing <figure> auto-pushes to the bottom. */
export function Col({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={className ? `col ${className}` : "col"} style={style}>
      {children}
    </div>
  );
}

/** Arbitrary CSS grid wrapper for the n×m image layouts. */
export function Grid({
  children,
  columns = "repeat(3, 1fr)",
  gap = "1.5em",
  align = "center",
  justify = "center",
  style,
}: {
  children: ReactNode;
  columns?: string;
  gap?: string;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyItems"];
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: columns,
        gap,
        alignItems: align,
        justifyItems: justify,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
