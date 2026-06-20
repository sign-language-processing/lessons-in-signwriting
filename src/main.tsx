import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./i18n";
import { App } from "./App";
import { asset } from "./lib/asset";
import { AUTHORING } from "./lib/devMode";
import { setupScrollPersist } from "./lib/scrollPersist";

// Load Stencil's prebuilt lazy bundle from /public via a module script tag. It
// self-registers the SignWriting custom elements and resolves its sibling `p-*`
// chunks + the Sutton fonts relative to its own URL — so it works both in dev
// and when the app is hosted under a sub-path (GitHub Pages). A native script
// tag (rather than a bundler import) keeps Vite from transforming the asset and
// preserves the relative chunk resolution the bundle relies on.
const sgnwLoader = document.createElement("script");
sgnwLoader.type = "module";
sgnwLoader.src = asset("/vendor/sgnw-components/sgnw-components.esm.js");
document.head.appendChild(sgnwLoader);
if (AUTHORING) {
  document.documentElement.classList.add("authoring");
  setupScrollPersist();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
