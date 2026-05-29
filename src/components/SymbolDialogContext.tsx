import { createContext, useContext, useState, type ReactNode } from "react";
import { SymbolDialog } from "./SymbolDialog";

type Ctx = { open: (key: string) => void };
const SymbolDialogCtx = createContext<Ctx | null>(null);

export function SymbolDialogProvider({ children }: { children: ReactNode }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  return (
    <SymbolDialogCtx.Provider value={{ open: (key) => setOpenKey(key) }}>
      {children}
      <SymbolDialog openKey={openKey} onClose={() => setOpenKey(null)} />
    </SymbolDialogCtx.Provider>
  );
}

export function useSymbolDialog(): Ctx {
  const ctx = useContext(SymbolDialogCtx);
  if (!ctx) {
    // Render-tree safety: if used outside the provider, return a no-op.
    return { open: () => {} };
  }
  return ctx;
}
