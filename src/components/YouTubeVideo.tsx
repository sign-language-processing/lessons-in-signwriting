import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";

export type YouTubeVideoProps = {
  videoId: string;
  title: string;
  credits?: ReactNode;
  transcript?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

type OpenSection = "credits" | "transcript" | null;

export function YouTubeVideo({
  videoId,
  title,
  credits,
  transcript,
  className,
  style,
}: YouTubeVideoProps) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState<OpenSection>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) {
      dlg.showModal();
    } else if (!open && dlg.open) {
      dlg.close();
    }
  }, [open]);

  // Safari fallback: <dialog closedby="any"> is not yet implemented in WebKit.
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

  const dialogTitle =
    open === "credits" ? t("common.credits") : t("common.transcript");
  const dialogBody = open === "credits" ? credits : transcript;
  const showOriginalNote =
    open === "transcript" && i18n.resolvedLanguage !== "en";

  return (
    <figure className={className} style={{ margin: "1.5em 0", ...style }}>
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          overflow: "hidden",
          borderRadius: 8,
          background: "#000",
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />
      </div>
      <figcaption
        style={{
          marginBlockStart: "0.75em",
          display: "flex",
          gap: "0.75em",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <strong>{title}</strong>
        {credits && (
          <button
            type="button"
            onClick={() => setOpen("credits")}
            style={buttonStyle}
          >
            {t("common.credits")}
          </button>
        )}
        {transcript && (
          <button
            type="button"
            onClick={() => setOpen("transcript")}
            style={buttonStyle}
          >
            {t("common.transcript")}
          </button>
        )}
      </figcaption>

      <dialog
        ref={dialogRef}
        closedby="any"
        aria-labelledby="yt-dialog-title"
        onClose={() => setOpen(null)}
        style={{
          padding: 0,
          border: "none",
          borderRadius: 12,
          inlineSize: "min(720px, 95vw)",
          maxBlockSize: "90vh",
        }}
      >
        <div style={{ position: "relative", padding: "1.5rem", textAlign: "left" }}>
          <form method="dialog" style={{ margin: 0 }}>
            <button
              type="submit"
              aria-label={t("common.close")}
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
          <h2 id="yt-dialog-title" style={{ marginTop: 0 }}>
            {title} — {dialogTitle}
          </h2>
          <div style={{ maxBlockSize: "70vh", overflowY: "auto" }}>
            {showOriginalNote && (
              <p className="original-note">{t("common.transcriptOriginal")}</p>
            )}
            {dialogBody}
          </div>
        </div>
      </dialog>
    </figure>
  );
}

const buttonStyle: CSSProperties = {
  padding: "0.35em 0.9em",
  border: "1px solid #ccc",
  background: "white",
  borderRadius: 6,
  cursor: "pointer",
  font: "inherit",
};
