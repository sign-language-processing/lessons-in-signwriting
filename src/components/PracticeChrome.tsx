import { useEffect, useRef, type RefObject } from "react";

/** The launch card (button + hint) that sits after a section and opens a game. */
export function PracticeLaunchCard({
  label,
  hint,
  onClick,
  disabled,
}: {
  label: string;
  hint: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="practice-launch" data-no-print>
      <button
        type="button"
        className="practice-launch__button"
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </button>
      <p className="practice-launch__hint">{hint}</p>
    </div>
  );
}

/** The × button in a practice dialog's top-right (submits the dialog's form to close). */
export function DialogCloseButton() {
  return (
    <form method="dialog" className="practice-close-form">
      <button type="submit" aria-label="Close" className="practice-close">
        ×
      </button>
    </form>
  );
}

/** Run `onClose` when the dialog fires its native `close` event. Subscribes once;
 *  the latest `onClose` is always called via a ref, so callers can pass an inline. */
export function useDialogClose(
  ref: RefObject<HTMLDialogElement | null>,
  onClose: () => void,
) {
  const cb = useRef(onClose);
  cb.current = onClose;
  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const handler = () => cb.current();
    dlg.addEventListener("close", handler);
    return () => dlg.removeEventListener("close", handler);
  }, [ref]);
}
