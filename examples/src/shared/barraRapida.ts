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

const ITEMS: Item[] = [
  { ico: "⬉", tip: "Seleccionar (Esc)", tool: "select" },
  { ico: "●", tip: "Nudo", tool: "node" },
  { ico: "／", tip: "Línea (frame) — L", tool: "line" },
  { ico: "⌒", tip: "Polilínea — PL", tool: "polyline" },
  { ico: "▭", tip: "Rectángulo — REC", tool: "rect" },
  { ico: "○", tip: "Círculo — C", tool: "circle" },
  { ico: "⌓", tip: "Arco: 3 puntos — A", tool: "arc" },
  { ico: "⌔", tip: "Arco: 2 puntos + altura (flecha) — A2", tool: "arc2h" },
  { ico: "∪", tip: "Parábola (3 ptos)", tool: "parabola" },
  { ico: "∿", tip: "Cúbica (4 ptos)", tool: "cubica" },
  { ico: "▦", tip: "Área / losa (4 vértices)", tool: "area" },
  { ico: "▮", tip: "Columna — COL", tool: "col" },
  { ico: "▥", tip: "Muro — MU", tool: "wall", sep: true },
  { ico: "✥", tip: "Mover — M", tool: "move" },
  { ico: "⧉", tip: "Copiar por 2 puntos (snap) — CO", tool: "copy" },
  { ico: "⇉", tip: "Desfase — O", tool: "offset" },
  { ico: "✂", tip: "Recortar — TR", tool: "trim" },
  { ico: "↦", tip: "Alargar — EX", tool: "extend" },
  { ico: "⫶", tip: "Dividir barra", tool: "divide" },
  { ico: "🗑", tip: "Borrar (hover + clic)", tool: "delete", sep: true },
  { ico: "XY", tip: "Plano de trabajo XY (planta)", plano: "xy" },
  { ico: "XZ", tip: "Plano de trabajo XZ (elevación frontal)", plano: "xz" },
  { ico: "YZ", tip: "Plano de trabajo YZ (elevación lateral)", plano: "yz" },
  { ico: "⛶", tip: "Encuadrar todo (zoom extensión)", run: () => w.__hekatanAutoFit?.(), sep: true },
  { ico: "⌗", tip: "Snap a rejilla (F9)", run: () => w.__hekatanToggleSnap?.(), toggle: "snap" },
  { ico: "✛", tip: "Referencias a objetos OSNAP (F3)", run: () => w.__hekatanToggleOsnap?.(), toggle: "osnap" },
  { ico: "◔", tip: "Rastreo polar (F10)", run: () => w.__hekatanTogglePolar?.() },
  { ico: "⊢", tip: "Ortogonal (F8)", run: () => w.__hekatanToggleOrtho?.(), sep: true },
  { ico: "↶", tip: "Deshacer (Ctrl+Z)", run: () => w.__hekatanUndo?.() },
];

const CSS = `
#hk-barra{position:fixed;left:36px;top:150px;bottom:60px;width:34px;z-index:95;display:flex;flex-direction:column;align-items:center;gap:1px;
 padding:4px 0;overflow-y:auto;overflow-x:hidden;background:rgba(18,22,30,.96);border-right:1px solid rgba(127,150,179,.35);scrollbar-width:none}
#hk-barra::-webkit-scrollbar{display:none}
#hk-barra button{width:26px;height:26px;flex:none;display:flex;align-items:center;justify-content:center;font:600 15px/1 system-ui,"Segoe UI Symbol",sans-serif;
 color:#cbd5e1;background:transparent;border:1px solid transparent;border-radius:4px;cursor:pointer;padding:0}
#hk-barra button.txt{font-size:10px;letter-spacing:-.5px}
#hk-barra button:hover{background:rgba(127,150,179,.25);border-color:rgba(127,150,179,.5)}
#hk-barra button.on{background:#1d4f91;border-color:#60a5fa;color:#fff}
#hk-barra .sep{width:22px;height:1px;background:rgba(127,150,179,.35);margin:3px 0;flex:none}
@media (max-width:600px){#hk-barra{display:none}}
`;

export function montarBarraRapida(): void {
  if (document.getElementById("hk-barra")) return;
  const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
  const barra = document.createElement("div"); barra.id = "hk-barra";
  const botones = new Map<string, HTMLButtonElement>();
  for (const it of ITEMS) {
    const b = document.createElement("button"); b.type = "button";
    b.textContent = it.ico; b.title = it.tip; b.setAttribute("aria-label", it.tip);
    if (it.ico.length > 1 && /^[A-Z]+$/.test(it.ico)) b.classList.add("txt");
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
    visible = v; barra.style.display = v ? "flex" : "none";
    try { localStorage.setItem("hk_barra_visible", v ? "1" : "0"); } catch { /* */ }
    const a = document.getElementById("hk-acceso"); if (a) a.style.left = v ? "80px" : "30px";
  };
  poner(visible);
  w.__hekatanBarraRapida = (v?: boolean) => poner(v ?? !visible);
  window.addEventListener("keydown", (e) => { if (e.altKey && e.key.toLowerCase() === "b") { e.preventDefault(); poner(!visible); } });
}
