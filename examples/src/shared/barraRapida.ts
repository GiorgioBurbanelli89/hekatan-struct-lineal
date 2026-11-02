/**
 * BARRA DE ACCESO RÁPIDO VERTICAL (2-nov-2026) — como la tira de iconos de ETABS (izquierda del Model Explorer).
 * Jorge: «una ventana de acceso rápido similar [a la de ETABS], no hay». Una columna de botones-icono con
 * tooltip y atajo: seleccionar · nudo · línea · polilínea · rectángulo · círculo · arcos · área/columna/muro ·
 * mover/copiar/recortar/alargar/desfase/dividir/borrar · planos XY/XZ/YZ · vista · snaps · deshacer.
 * No duplica lógica: cada botón llama lo que ya existe (`__hekatanAcciones.herramienta`, `__hekatanAcciones.plano`,
 * `__hekatanToggle*`). Se oculta/muestra con Alt+B. Elemento activo en azul, como ETABS.
 */
const w = window as any;
type Item = { ico: string; tip: string; tool?: string; run?: () => void; plano?: "xy" | "xz" | "yz"; sep?: boolean; toggle?: string };

/** Icono de trazo (24×24, currentColor): mismo grosor y estilo en todos, para que la tira se lea como un conjunto. */
const svg = (d: string, fill = false) =>
  `<svg viewBox="0 0 24 24" width="16" height="16" fill="${fill ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const P = (d: string) => `<path d="${d}"/>`;
const C = (x: number, y: number, r: number, f = false) => `<circle cx="${x}" cy="${y}" r="${r}"${f ? ' fill="currentColor"' : ""}/>`;

const ITEMS: Item[] = [
  { ico: svg(P("M6 3l12 8-5.5 1.3L10 18z"), true), tip: "Seleccionar (Esc)", tool: "select" },
  { ico: svg(C(12, 12, 3.2, true)), tip: "Nudo", tool: "node" },
  { ico: svg(P("M5 19L19 5") + C(5, 19, 1.8, true) + C(19, 5, 1.8, true)), tip: "Línea (frame) — L", tool: "line" },
  { ico: svg(P("M4 18l5-9 5 6 6-10")), tip: "Polilínea — PL", tool: "polyline" },
  { ico: svg('<rect x="4" y="6" width="16" height="12" rx="1"/>'), tip: "Rectángulo — REC", tool: "rect" },
  { ico: svg(C(12, 12, 8)), tip: "Círculo — C", tool: "circle" },
  { ico: svg(P("M4 19C5 8 19 8 20 19") + C(4, 19, 1.5, true) + C(12, 9.6, 1.5, true) + C(20, 19, 1.5, true)), tip: "Arco: 3 puntos — A", tool: "arc" },
  { ico: svg(P("M4 19C5 8 19 8 20 19") + '<path d="M4 19H20M12 19V9.6" stroke-dasharray="2 2.2" opacity=".7"/>'), tip: "Arco: 2 puntos + altura (flecha) — A2", tool: "arc2h" },
  { ico: svg(P("M5 5Q12 27 19 5")), tip: "Parábola (3 ptos)", tool: "parabola" },
  { ico: svg(P("M3 17C8 2 13 22 21 7")), tip: "Cúbica (4 ptos)", tool: "cubica" },
  { ico: svg(P("M4 18l3-11h13l-3 11z")), tip: "Área / losa (4 vértices)", tool: "area" },
  { ico: svg('<rect x="9" y="3" width="6" height="18" rx="1"/>'), tip: "Columna — COL", tool: "col" },
  { ico: svg('<rect x="3" y="8" width="18" height="8" rx="1"/>' + P("M7 8l-3 8M12 8l-3 8M17 8l-3 8")), tip: "Muro — MU", tool: "wall", sep: true },
  { ico: svg(P("M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3")), tip: "Mover — M", tool: "move" },
  { ico: svg('<rect x="8" y="8" width="12" height="12" rx="1.5"/>' + P("M16 8V5.5A1.5 1.5 0 0014.5 4h-9A1.5 1.5 0 004 5.5v9A1.5 1.5 0 005.5 16H8")), tip: "Copiar por 2 puntos (snap) — CO", tool: "copy" },
  { ico: svg(P("M4 8h16M4 16h16") + P("M12 11v2")), tip: "Desfase — O", tool: "offset" },
  { ico: svg(C(6, 6, 2.5) + C(6, 18, 2.5) + P("M8 7.5L20 18M8 16.5L20 6")), tip: "Recortar — TR", tool: "trim" },
  { ico: svg(P("M4 12h12M12.5 8l4 4-4 4M20 5v14")), tip: "Alargar — EX", tool: "extend" },
  { ico: svg(P("M5 12h14") + C(9, 12, 1.6, true) + C(15, 12, 1.6, true) + P("M5 8v8M19 8v8")), tip: "Dividir barra", tool: "divide" },
  { ico: svg(P("M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 11v6M14 11v6")), tip: "Borrar (hover + clic)", tool: "delete", sep: true },
  { ico: "XY", tip: "Plano de trabajo XY (planta)", plano: "xy" },
  { ico: "XZ", tip: "Plano de trabajo XZ (elevación frontal)", plano: "xz" },
  { ico: "YZ", tip: "Plano de trabajo YZ (elevación lateral)", plano: "yz" },
  { ico: svg(P("M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5")), tip: "Encuadrar todo (zoom extensión)", run: () => w.__hekatanAutoFit?.(), sep: true },
  { ico: svg('<rect x="4" y="4" width="16" height="16"/>' + P("M4 12h16M12 4v16")), tip: "Snap a rejilla (F9)", run: () => w.__hekatanToggleSnap?.() },
  { ico: svg(P("M12 3v18M3 12h18") + '<rect x="9" y="9" width="6" height="6"/>'), tip: "Referencias a objetos OSNAP (F3)", run: () => w.__hekatanToggleOsnap?.() },
  { ico: svg(C(12, 12, 8) + P("M12 12l5-5")), tip: "Rastreo polar (F10)", run: () => w.__hekatanTogglePolar?.() },
  { ico: svg(P("M5 4v15h15")), tip: "Ortogonal (F8)", run: () => w.__hekatanToggleOrtho?.(), sep: true },
  { ico: svg(P("M9 6L4 11l5 5M4 11h9a6 6 0 010 12")), tip: "Deshacer (Ctrl+Z)", run: () => w.__hekatanUndo?.() },
];

const CSS = `
#hk-barra{position:fixed;left:545px;top:52px;max-width:calc(100vw - 545px - 150px);z-index:95;display:none;flex-direction:row;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;align-items:center;gap:1px;
 padding:3px 5px;background:rgba(15,23,42,.96);border:1px solid #1e3a4a;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.45)}
body.hk-revit-on #hk-barra.visible{display:flex}
#hk-barra button{width:24px;height:24px;flex:none;display:flex;align-items:center;justify-content:center;font:700 10px/1 system-ui,sans-serif;letter-spacing:-.3px;
 color:#bcd2e6;background:transparent;border:1px solid transparent;border-radius:6px;cursor:pointer;padding:0;transition:background .12s,color .12s}
#hk-barra button:hover{background:#12304a;color:#fff}
#hk-barra button.on{background:#0e7490;border-color:#22d3ee;color:#fff}
#hk-barra button svg{display:block;pointer-events:none}
#hk-barra .sep{width:1px;height:18px;background:#1e3a4a;margin:0 3px;flex:none}
@media (max-width:600px){#hk-barra{display:none!important}}
`;

export function montarBarraRapida(): void {
  if (document.getElementById("hk-barra")) return;
  const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
  const barra = document.createElement("div"); barra.id = "hk-barra";
  const botones = new Map<string, HTMLButtonElement>();
  for (const it of ITEMS) {
    const b = document.createElement("button"); b.type = "button";
    b.innerHTML = it.ico; b.title = it.tip; b.setAttribute("aria-label", it.tip);
    b.onclick = () => {
      if (it.tool) w.__hekatanAcciones?.herramienta?.(it.tool);
      else if (it.plano) w.__hekatanAcciones?.plano?.(it.plano);
      else it.run?.();
      pintar();
    };
    barra.appendChild(b);
    if (it.tool) botones.set(it.tool, b);
    if (it.plano) botones.set("plano_" + it.plano, b);
    if (it.sep) { const s = document.createElement("div"); s.className = "sep"; barra.appendChild(s); }
  }
  document.body.appendChild(barra);

  /** Marca en azul la herramienta y el plano activos (lee el estado real del CAD). */
  const pintar = () => {
    let tool = "select", plano = "xy";
    try { const s = w.__hekatanCadState?.get?.(); tool = s?.tool ?? "select"; plano = s?.workPlane ?? "xy"; } catch { /* sin CAD aún */ }
    for (const [k, b] of botones) b.classList.toggle("on", k === tool || k === "plano_" + plano);
  };
  setInterval(pintar, 400);
  pintar();

  let visible = true;
  try { visible = localStorage.getItem("hk_barra_visible") !== "0"; } catch { /* */ }
  const poner = (v: boolean) => {
    visible = v; barra.classList.toggle("visible", v);
    try { localStorage.setItem("hk_barra_visible", v ? "1" : "0"); } catch { /* */ }
    const a = document.getElementById("hk-acceso"); if (a) a.style.left = "30px";
  };
  poner(visible);
  w.__hekatanBarraRapida = (v?: boolean) => poner(v ?? !visible);
  window.addEventListener("keydown", (e) => { if (e.altKey && e.key.toLowerCase() === "b") { e.preventDefault(); poner(!visible); } });
}
