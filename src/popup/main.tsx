import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/pixelify-sans";
import "@fontsource/jersey-10/400.css";
import "@fontsource/silkscreen/400.css";

import { App } from "./App";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Lunagrove popup root was not found");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
