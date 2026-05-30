import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { defineCustomElement as defineSgnwSign } from "@sutton-signwriting/sgnw-components/dist/components/sgnw-sign";
import { defineCustomElement as defineSgnwSymbol } from "@sutton-signwriting/sgnw-components/dist/components/sgnw-symbol";
import { defineCustomElement as defineSgnwVp } from "@sutton-signwriting/sgnw-components/dist/components/sgnw-vp";
import "./styles.css";
import { App } from "./App";
import { setupScrollPersist } from "./lib/scrollPersist";

// Use the self-contained custom-elements build (not the lazy `loader`), so the
// components bundle into the app instead of fetching `*.entry.js` chunks at
// runtime — those 404 under a static-host sub-path. Each define() also
// registers the component's internal dependencies.
defineSgnwSign();
defineSgnwSymbol();
defineSgnwVp();
setupScrollPersist();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
