import { useEffect, useRef, useState } from "react";

export function PlanButton() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    else if (!open && dlg.open) dlg.close();
  }, [open]);

  return (
    <>
      <button type="button" className="toc-plan" onClick={() => setOpen(true)}>
        Plan
      </button>
      <dialog
        ref={dialogRef}
        closedby="any"
        aria-labelledby="plan-dialog-title"
        className="plan-dialog"
        onClose={() => setOpen(false)}
      >
        <form method="dialog" className="plan-dialog__close-form">
          <button type="submit" aria-label="Close" className="plan-dialog__close">
            ×
          </button>
        </form>
        <h2 id="plan-dialog-title">Plan</h2>
        <ol className="plan-dialog__list">
          <li>
            Completely transform the PDF to a modern web document (extract /
            replace images, layout, etc.) — chapter 7 onwards.
          </li>
          <li>
            Cover as many SignWriting symbols on hover:
            <ul>
              <li>Hand shapes — done.</li>
              <li>Movement arrows.</li>
              <li>Facial expressions.</li>
            </ul>
          </li>
          <li>
            Add testing features after each chapter: show real signs from
            whatsthatsign and ask to transcribe a particular part — e.g. just
            the handshape, or just the movement.
          </li>
          <li>Multilingual support (English, Portuguese, etc.).</li>
        </ol>
      </dialog>
    </>
  );
}
