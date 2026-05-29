import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { defineCustomElements } from "@sutton-signwriting/sgnw-components/loader";
import "./styles.css";
import { App } from "./App";
import { setupScrollPersist } from "./lib/scrollPersist";

defineCustomElements();
setupScrollPersist();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
