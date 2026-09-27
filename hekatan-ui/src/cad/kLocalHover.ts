/**
 * Al PASAR por una barra: su matriz de rigidez local, en una tarjeta con el aspecto de una hoja de
 * Hekatan LISP (papel claro, letra de libro, la matriz entre corchetes).
 *
 * Jorge, 27-sep-2026: «al pasar por una barra, la matriz local de ese elemento; usa Hekatan LISP,
 * me gusta así». El rótulo de siempre (número, largo, fuerzas) sigue saliendo al instante; la
 * tarjeta aparece si el cursor se QUEDA en la barra medio segundo, para no taparlo todo al cruzar
 * el modelo. «Hoja completa» abre la deducción en el motor de Hekatan LISP.
 *
 * El visor avisa con el evento `hk:hover` (lo lanza `viewer/objects/hover.ts`).
 */
import { abrirHoja } from "./hojaLisp";
import { comprobar, corto, datosBarra, elementosDelModelo, GDL, hojaBarra, kLocalBarra } from "./kLocalBarra";

const ESPERA = 450;          // ms quieto sobre la barra antes de abrir
const W = () => window as any;
let tarjeta: HTMLDivElement | null = null;
let reloj = 0, cierre = 0, abierta = -1, dentro = false;
let activo = true;

const CSS = `
#hk-klocal{position:fixed;z-index:9300;display:none;max-width:min(880px,calc(100vw - 24px));
  background:#fbf7ee;color:#1d1b17;border:1px solid #cdbf9a;border-radius:8px;
  box-shadow:0 12px 40px rgba(0,0,0,.55);font:13px 'Segoe UI',system-ui,sans-serif;padding:10px 14px 10px}
#hk-klocal h4{margin:0 0 2px;font:700 15px 'Segoe UI',system-ui,sans-serif;color:#14120f;text-align:center}
#hk-klocal .sub{color:#5b5446;font-size:12px;text-align:center;margin-bottom:6px}
#hk-klocal .datos{display:grid;grid-template-columns:repeat(4,auto);gap:1px 14px;justify-content:center;
  font:13px Georgia,'Times New Roman',serif;color:#0b3a7a;margin:4px 0 8px}
#hk-klocal .datos i{color:#0b4fa8} #hk-klocal .datos span{white-space:nowrap}
#hk-klocal .datos small{color:#6b6257;font:11px 'Segoe UI',sans-serif;margin-left:3px}
#hk-klocal .mat{display:flex;align-items:center;justify-content:center;gap:6px;overflow:auto}
#hk-klocal .mat b{font:italic 700 15px Georgia,serif;color:#0b4fa8}
#hk-klocal table{border-collapse:collapse;font:12px Georgia,'Times New Roman',serif;color:#12305e;
  border-left:2px solid #1d1b17;border-right:2px solid #1d1b17;border-radius:7px}
#hk-klocal td{padding:1px 6px;text-align:right;white-space:nowrap}
#hk-klocal td.c{color:#b9ae98}
#hk-klocal th{font:italic 11px Georgia,serif;color:#8a7f6a;padding:0 6px 2px;text-align:right;font-weight:400}
#hk-klocal th.f{text-align:left;padding-right:8px}
#hk-klocal tr.s td{border-top:1px dashed #d8cdb0} #hk-klocal td.s,#hk-klocal th.s{border-left:1px dashed #d8cdb0}
#hk-klocal .pie{display:flex;align-items:center;gap:10px;margin-top:8px;font-size:12px;color:#5b5446}
#hk-klocal .ok{color:#1e6b40} #hk-klocal .mal{color:#a32b1e;font-weight:700}
#hk-klocal button{margin-left:auto;cursor:pointer;background:#0b4fa8;color:#fff;border:0;border-radius:5px;
  padding:4px 10px;font:600 12px 'Segoe UI',sans-serif}
#hk-klocal .u{color:#6b6257;font-size:11px}
`;

function crear(): HTMLDivElement {
  const st = document.createElement("style");
  st.textContent = CSS;
  document.head.appendChild(st);
  const t = document.createElement("div");
  t.id = "hk-klocal";
  t.addEventListener("pointerenter", () => { dentro = true; clearTimeout(cierre); });
  t.addEventListener("pointerleave", () => { dentro = false; cerrarLuego(250); });
  document.body.appendChild(t);
  return t;
}

function cerrar(): void {
  if (tarjeta) tarjeta.style.display = "none";
  abierta = -1;
}
function cerrarLuego(ms: number): void {
  clearTimeout(cierre);
  cierre = window.setTimeout(() => { if (!dentro) cerrar(); }, ms);
}

const sub = (t: string) => t.replace(/([₀-₉]+)/g, "<sub>$1</sub>").replace(/[₀-₉]/g, (c) => String("₀₁₂₃₄₅₆₇₈₉".indexOf(c)));
const dato = (s: string, v: string, u: string) => `<span><i>${s}</i> = ${v}<small>${u}</small></span>`;
const num = (v: number) => (Math.abs(v) >= 1e6 || (v !== 0 && Math.abs(v) < 1e-3) ? v.toExponential(3).replace("e+", "e") : String(+v.toPrecision(6)));

function pintar(idx: number, x: number, y: number): void {
  const st = W().__hekatanStates;
  const d = datosBarra(st, idx);
  let K: number[][] | null = null;
  try { K = d ? kLocalBarra(st, idx) : null; } catch { K = null; }
  if (!d || !K) return;
  if (!tarjeta) tarjeta = crear();
  const c = comprobar(K, d.L);
  const cab = GDL.concat(GDL).map((g, j) => `<th class="${j === 6 ? "s" : ""}">${sub(g)}${j > 5 ? "′" : ""}</th>`).join("");
  const filas = K.map((f, i) =>
    `<tr class="${i === 6 ? "s" : ""}"><th class="f">${sub(GDL[i % 6])}${i > 5 ? "′" : ""}</th>` +
    f.map((v, j) => `<td class="${Math.abs(v) < 1e-9 ? "c" : ""}${j === 6 ? " s" : ""}">${corto(v)}</td>`).join("") + "</tr>").join("");
  tarjeta.innerHTML =
    `<h4>Matriz de rigidez local · barra ${d.idx + 1}</h4>` +
    `<div class="sub">nudo ${d.n1} → nudo ${d.n2} · ${d.formulacion}</div>` +
    (d.brazos ? `<div class="sub">Brazos rígidos: ${num(d.brazos[0])} m y ${num(d.brazos[1])} m · factor ${num(d.brazos[2])} · longitud flexible ${num(d.Lf)} m</div>` : "") +
    `<div class="datos">` +
    dato("L", num(d.L), "m") + dato("E", num(d.E), "kN/m²") + dato("G", num(d.G), "kN/m²") + dato("A", num(d.A), "m²") +
    dato("I<sub>33</sub>", num(d.I33), "m⁴") + dato("I<sub>22</sub>", num(d.I22), "m⁴") +
    dato("A<sub>s2</sub>", num(d.As2), "m²") + dato("A<sub>s3</sub>", num(d.As3), "m²") +
    dato("J", num(d.J), "m⁴") + dato("φ<sub>3</sub>", num(d.phi3), "") + dato("φ<sub>2</sub>", num(d.phi2), "") +
    dato("ángulo", num(d.ang), "°") +
    `</div>` +
    `<div class="mat"><b>K</b><span>=</span><table><tr><th></th>${cab}</tr>${filas}</table></div>` +
    `<div class="pie"><span class="u">kN y m · ejes de la barra · ′ = nudo final</span>` +
    `<span class="${c.simetrica ? "ok" : "mal"}">${c.simetrica ? "✓" : "✕"} simétrica</span>` +
    `<span class="${c.rigido ? "ok" : "mal"}">${c.rigido ? "✓" : "✕"} sólido rígido sin fuerza</span>` +
    `<button id="hk-klocal-hoja">Hoja completa en Hekatan LISP</button></div>`;
  tarjeta.style.display = "block";
  // al lado del cursor, y siempre ENTERA dentro de la ventana
  const r = tarjeta.getBoundingClientRect();
  let px = x + 18, py = y + 18;
  if (px + r.width > window.innerWidth - 8) px = Math.max(8, x - r.width - 18);
  if (px + r.width > window.innerWidth - 8) px = Math.max(8, window.innerWidth - r.width - 8);
  if (py + r.height > window.innerHeight - 8) py = Math.max(8, y - r.height - 18);
  if (py + r.height > window.innerHeight - 8) py = Math.max(8, window.innerHeight - r.height - 8);
  tarjeta.style.left = px + "px";
  tarjeta.style.top = py + "px";
  abierta = idx;
  (tarjeta.querySelector("#hk-klocal-hoja") as HTMLButtonElement).onclick = () => abrirHojaBarra(idx);
}

/** La deducción entera, en el motor de Hekatan LISP. */
export function abrirHojaBarra(idx: number): string {
  const st = W().__hekatanStates;
  const d = datosBarra(st, idx);
  const K = d ? kLocalBarra(st, idx) : null;
  if (!d || !K) return "No pude leer esa barra.";
  const hoja = hojaBarra(d, K, elementosDelModelo(st));
  abrirHoja(`K local · barra ${d.idx + 1}`, "```hoja\n" + hoja + "\n```", 900);
  cerrar();
  return `Barra ${d.idx + 1}: hoja abierta.`;
}

/** Arranca la escucha. Se llama una vez desde el workspace. */
export function arrancarKLocalHover(): void {
  if (W().__hkKLocalHover) return;
  W().__hkKLocalHover = {
    activar: (v: boolean) => { activo = v; if (!v) cerrar(); },
    hoja: abrirHojaBarra,
    abierta: () => abierta,
    // para pruebas y para el agente: la tarjeta de una barra sin tener que poner el cursor
    ver: (idx: number, x = 300, y = 200) => pintar(idx, x, y),
    datos: (idx: number) => datosBarra(W().__hekatanStates, idx),
    matriz: (idx: number) => kLocalBarra(W().__hekatanStates, idx),
  };
  window.addEventListener("hk:hover", (ev: any) => {
    const h = ev.detail;
    clearTimeout(reloj);
    if (!activo || !h || h.type !== "frame") { if (!dentro) cerrarLuego(300); return; }
    if (h.idx === abierta) { clearTimeout(cierre); return; }
    clearTimeout(cierre);
    reloj = window.setTimeout(() => pintar(h.idx, h.x, h.y), ESPERA);
  });
}
