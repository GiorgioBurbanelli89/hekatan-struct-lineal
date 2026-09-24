import "./styles.css";
import { createCadState } from "./cadModel";
import { createViewer } from "./cadViewerSetup";
import { setupGridRenderer } from "./gridRenderer";
import { createViewPanel } from "./viewController";
import { createCli } from "./cadCli";

// --- Initialize ---
const state = createCadState();
const { element: viewport, ctx } = createViewer();
const viewPanel = createViewPanel(state, ctx);

// Setup grid renderer (reactive)
setupGridRenderer(state, ctx);

// --- DOM Layout ---
const container = document.createElement("div");
container.id = "cad-container";
container.appendChild(viewport);

// Panel goes inside viewport (absolutely positioned)
viewport.appendChild(viewPanel);

// Info bar
const info = document.createElement("div");
info.id = "cad-info";
info.textContent = "Hekatan Struct — type cad.help() in console";
viewport.appendChild(info);

document.body.appendChild(container);

// --- Expose CLI ---
const cli = createCli(state, viewPanel);
(window as any).cad = cli;

// Log welcome message
console.log(
  "%c Hekatan Struct %c type cad.help() for commands",
  "background: #0088ff; color: white; padding: 2px 6px; border-radius: 3px;",
  "color: #888;"
);
