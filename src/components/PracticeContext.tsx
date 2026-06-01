import { createContext, useContext, useState, type ReactNode } from "react";
import { HandOrientationPractice } from "./HandOrientationPractice";
import { randomPracticeBase } from "../lib/practiceHands";

type Ctx = { open: (base?: string) => void };
const PracticeCtx = createContext<Ctx | null>(null);

export function PracticeProvider({ children }: { children: ReactNode }) {
  const [openBase, setOpenBase] = useState<string | null>(null);
  return (
    <PracticeCtx.Provider
      value={{ open: (base) => setOpenBase(base ?? randomPracticeBase()) }}
    >
      {children}
      <HandOrientationPractice
        openBase={openBase}
        onClose={() => setOpenBase(null)}
      />
    </PracticeCtx.Provider>
  );
}

export function usePractice(): Ctx {
  const ctx = useContext(PracticeCtx);
  if (!ctx) return { open: () => {} };
  return ctx;
}
