import { useEffect, useRef } from "react";
import { fillVariants, handImageForKey } from "../lib/handImage";

export type SymbolDialogProps = {
  /** The symbol key that was clicked. When non-null, the dialog opens. */
  openKey: string | null;
  onClose: () => void;
};

const FILL_LABELS = [
  "Fill 1 — outline",
  "Fill 2 — half-white",
  "Fill 3 — black",
  "Fill 4",
  "Fill 5",
  "Fill 6",
];

export function SymbolDialog({ openKey, onClose }: SymbolDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (openKey && !dlg.open) {
      dlg.showModal();
    } else if (!openKey && dlg.open) {
      dlg.close();
    }
  }, [openKey]);

  // Safari fallback: <dialog closedby="any"> isn't supported. Detect a click
  // on the backdrop (outside the content box) and close manually.
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if ("closedBy" in HTMLDialogElement.prototype) return;
    const handler = (event: MouseEvent) => {
      if (event.target !== dlg) return;
      const rect = dlg.getBoundingClientRect();
      const inside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!inside) dlg.close();
    };
    dlg.addEventListener("click", handler);
    return () => dlg.removeEventListener("click", handler);
  }, []);

  const variants = openKey ? fillVariants(openKey) : [];

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="symbol-dialog-title"
      onClose={onClose}
      style={{
        padding: 0,
        border: "none",
        borderRadius: 12,
        inlineSize: "min(720px, 95vw)",
        maxBlockSize: "90vh",
      }}
    >
      <div style={{ padding: "1.5rem", position: "relative" }}>
        <form method="dialog" style={{ margin: 0 }}>
          <button
            type="submit"
            aria-label="Close"
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
              width: "2rem",
              height: "2rem",
              padding: 0,
              borderRadius: "50%",
              border: "1px solid #ccc",
              background: "white",
              cursor: "pointer",
              fontSize: "1.2rem",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </form>
        <h2 id="symbol-dialog-title" style={{ marginTop: 0 }}>
          Symbol variants
        </h2>
        {openKey && (
          <p style={{ color: "#666", marginTop: 0 }}>
            Base: <code>{openKey.slice(0, 4)}</code> · 6 fill variants at
            rotation <code>{openKey[5]}</code>
          </p>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            marginBlock: "1rem",
          }}
        >
          {variants.map(({ key, swu }, i) => {
            const img = handImageForKey(key);
            const isSelected = key === openKey;
            return (
              <div
                key={key}
                aria-current={isSelected ? "true" : undefined}
                style={{
                  border: isSelected ? "2px solid #d33" : "1px solid #ddd",
                  borderRadius: 8,
                  padding: isSelected ? "calc(0.75rem - 1px)" : "0.75rem",
                  textAlign: "center",
                  background: isSelected ? "#fff5f5" : "#fafafa",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: isSelected
                    ? "0 0 0 4px rgba(221,51,51,0.15)"
                    : undefined,
                }}
              >
                <sgnw-symbol
                  symbol={swu}
                  style={{ fontSize: 80 }}
                ></sgnw-symbol>
                {img ? (
                  <img
                    src={img}
                    alt={FILL_LABELS[i]}
                    style={{ maxHeight: 100, maxWidth: "100%", width: "auto", height: "auto" }}
                  />
                ) : (
                  <div style={{ color: "#aaa", fontSize: "0.85em", height: 100 }}>
                    (no photo)
                  </div>
                )}
                <code style={{ fontSize: "0.85em", color: "#666" }}>{key}</code>
              </div>
            );
          })}
        </div>
      </div>
    </dialog>
  );
}
