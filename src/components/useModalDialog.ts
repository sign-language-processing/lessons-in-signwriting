import { useEffect, useRef } from "react";

/**
 * Opens a <dialog> as a modal on mount with light-dismiss (click the backdrop
 * or press Esc to close). Uses the declarative `closedby="any"` where available
 * and falls back to a backdrop-click listener for Safari, which lacks it.
 */
export function useModalDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    dlg.setAttribute("closedby", "any");
    dlg.showModal();
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
  return ref;
}
