/**
 * PANEL «ZAPATAS EN PLANTA» — editar cada zapata desde la vista en planta.
 *
 * Jorge, 8-oct-2026: «que la cimentación se pueda modificar desde la vista en planta: desde
 * las caras, a cierta distancia, indicar de cuánto en cuánto puede ser mi cimentación».
 *
 * Se dibuja la planta (zapatas, columnas, vigas de amarre), se hace clic en una zapata y se
 * da el vuelo de CADA cara medido desde la cara de la columna, con paso (0.05 m por defecto).
 * Los atajos fijan el tipo de zapata: centrada, lindero (una cara en la línea de propiedad),
 * esquinera (dos caras). Escribe en `EDICION_ZAPATAS` y reconstruye por `__hekatanRebuild`.
 */
import { EDICION_ZAPATAS, type VueloZapata } from "./cimentacion";

const ID = "hk-zapatas-planta";
const TIPOS_CIM = [8, 9, 10, 11, 12, 13];     // plantillas con zapatas de cáscara (la T invertida son barras)
let sel = 0, paso = 0.05, plegado = false, temporizador: any = null;
let vigilante: any = null;
let ultimo: any = null;

const CARAS: Array<[keyof VueloZapata, string]> = [["w", "Oeste ◀"], ["e", "Este ▶"], ["s", "Sur ▼"], ["n", "Norte ▲"]];
const r2 = (v: number) => Math.round(v * 1000) / 1000;

function solapes(zs: any[]) {
  const mal = new Set<number>();
  for (let i = 0; i < zs.length; i++) for (let j = i + 1; j < zs.length; j++) {
    const a = zs[i], b = zs[j];
    if (a.x0 < b.x1 - 1e-6 && b.x0 < a.x1 - 1e-6 && a.y0 < b.y1 - 1e-6 && b.y0 < a.y1 - 1e-6) { mal.add(i); mal.add(j); }
  }
  return mal;
}

function fijar(i: number, v: VueloZapata) {
  // Modelo IMPORTADO: la zapata se reconstruye en el propio modelo (plantillas/cimentacionImportadaUI.ts)
  if (ultimo.aplicar) {
    const w = { w: r2(Math.max(0, v.w)), e: r2(Math.max(0, v.e)), s: r2(Math.max(0, v.s)), n: r2(Math.max(0, v.n)) };
    clearTimeout(temporizador);
    temporizador = setTimeout(() => ultimo.aplicar(i, w), 250);
    return;
  }
  const sub = ultimo.sub;
  const m = EDICION_ZAPATAS.get(sub) ?? {};
  m[i] = { w: r2(Math.max(0, v.w)), e: r2(Math.max(0, v.e)), s: r2(Math.max(0, v.s)), n: r2(Math.max(0, v.n)) };
  EDICION_ZAPATAS.set(sub, m);
  clearTimeout(temporizador);
  temporizador = setTimeout(() => (window as any).__hekatanRebuild?.(), 250);
}

let PANT = { k: 1, x0: 0, y0: 0, H: 0 };

function dibujar(d: any) {
  const zs = d.zapatas as any[], cols = d.columnas as any[], vigas = d.vigas as number[][];
  const x0 = Math.min(...zs.map((z) => z.x0)) - 0.4, x1 = Math.max(...zs.map((z) => z.x1)) + 0.4;
  const y0 = Math.min(...zs.map((z) => z.y0)) - 0.4, y1 = Math.max(...zs.map((z) => z.y1)) + 0.4;
  const W = 330, H = Math.max(120, Math.min(260, (W * (y1 - y0)) / (x1 - x0)));
  const k = Math.min(W / (x1 - x0), H / (y1 - y0));
  const X = (x: number) => (x - x0) * k, Y = (y: number) => H - (y - y0) * k;     // Y hacia arriba
  PANT = { k, x0, y0, H };
  const mal = solapes(zs);
  let g = `<svg width="${W}" height="${H}" style="background:#0d1118;border:1px solid #2a3140;border-radius:6px;cursor:pointer">`;
  for (const v of vigas) g += `<line x1="${X(v[0])}" y1="${Y(v[1])}" x2="${X(v[2])}" y2="${Y(v[3])}" stroke="#7f8ea8" stroke-width="3"/>`;
  zs.forEach((z, i) => {
    const on = i === sel, rojo = mal.has(i);
    g += `<rect data-i="${i}" x="${X(z.x0)}" y="${Y(z.y1)}" width="${(z.x1 - z.x0) * k}" height="${(z.y1 - z.y0) * k}" ` +
         `fill="${on ? "rgba(255,200,60,.35)" : "rgba(90,160,255,.22)"}" stroke="${rojo ? "#ff5d5d" : on ? "#ffc83c" : "#5aa0ff"}" stroke-width="${on ? 2.5 : 1.5}"/>`;
  });
  for (const c of cols) { const bx = c.bx ?? c.b, by = c.by ?? c.b; g += `<rect x="${X(c.x - bx / 2)}" y="${Y(c.y + by / 2)}" width="${Math.max(3, bx * k)}" height="${Math.max(3, by * k)}" fill="#e8eef9" pointer-events="none"/>`; }
  const z = zs[sel];
  if (z) {   // cota del vuelo de cada cara + MANILLAS para arrastrar
    const v = z.vuelos as VueloZapata, cy = (z.y0 + z.y1) / 2, cxm = (z.x0 + z.x1) / 2;
    const t = (c: string, x: number, y: number, s: string) =>
      `<text data-t="${c}" x="${x}" y="${y}" fill="#ffc83c" font-size="11" text-anchor="middle" pointer-events="none">${s}</text>`;
    g += t("w", X(z.x0) + 14, Y(cy) - 4, v.w.toFixed(2)) + t("e", X(z.x1) - 14, Y(cy) - 4, v.e.toFixed(2)) +
         t("s", X(cxm), Y(z.y0) - 4, v.s.toFixed(2)) + t("n", X(cxm), Y(z.y1) + 12, v.n.toFixed(2));
    const h = (c: string, x1: number, y1: number, x2: number, y2: number, cur: string) =>
      `<line data-h="${c}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffc83c" stroke-opacity=".01" stroke-width="12" style="cursor:${cur}"/>` +
      `<line data-hv="${c}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffc83c" stroke-width="3.5" pointer-events="none"/>`;
    g += h("w", X(z.x0), Y(z.y1), X(z.x0), Y(z.y0), "ew-resize") + h("e", X(z.x1), Y(z.y1), X(z.x1), Y(z.y0), "ew-resize") +
         h("s", X(z.x0), Y(z.y0), X(z.x1), Y(z.y0), "ns-resize") + h("n", X(z.x0), Y(z.y1), X(z.x1), Y(z.y1), "ns-resize");
  }
  return g + `</svg>`;
}

/** El panel solo se ve en una plantilla de cimentación con zapatas. */
function visible() {
  const w = window as any;
  if (ultimo?.siempre) return w.__hekatanExample?.() === "csi-importer";
  if (w.__hekatanExample?.() !== "plantillas") return false;
  return TIPOS_CIM.includes(Math.round(w.__hekatanGetParams?.().tipo));
}

export function montarPanelPlanta(states: any) {
  const d = states.__cimPlanta;
  if (!d || typeof document === "undefined") return;
  ultimo = d;
  if (sel >= d.zapatas.length) sel = 0;
  let cx = document.getElementById(ID) as HTMLElement | null;
  if (!cx) {
    cx = document.createElement("div"); cx.id = ID;
    cx.style.cssText = "position:fixed;left:312px;top:58px;z-index:9500;width:352px;background:rgba(18,22,30,.96);" +
      "color:#e8eef9;font:12px Segoe UI,sans-serif;border:1px solid #2f3a4d;border-radius:8px;padding:8px 10px;" +
      "box-shadow:0 6px 24px rgba(0,0,0,.5)";
    document.body.appendChild(cx);
    vigilante = setInterval(() => {
      const el = document.getElementById(ID);
      if (el) el.style.display = visible() ? "" : "none";
    }, 700);
  }
  cx.style.display = visible() ? "" : "none";
  const z = d.zapatas[sel], v = z.vuelos as VueloZapata;
  const ancho = z.x1 - z.x0, largo = z.y1 - z.y0;
  const boton = (a: string, n: string) =>
    `<button data-a="${a}" style="background:#26314a;color:#e8eef9;border:1px solid #3a4560;border-radius:4px;padding:2px 6px;cursor:pointer">${n}</button>`;
  cx.innerHTML =
    `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">` +
    `<b>📐 Zapatas en planta</b><button id="${ID}-p" style="all:unset;cursor:pointer;padding:0 6px">${plegado ? "▾" : "▴"}</button></div>` +
    (plegado ? "" :
    dibujar(d) +
    `<div style="margin:6px 0 4px">Zapata <b>${sel + 1}</b> de ${d.zapatas.length} · <b data-sz>${ancho.toFixed(2)} × ${largo.toFixed(2)} m</b> · canto ${z.t.toFixed(2)} m</div>` +
    `<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 8px">` +
    CARAS.map(([c, n]) => `<label style="display:flex;justify-content:space-between;align-items:center">${n}` +
      `<input data-c="${c}" type="number" min="0" step="${paso}" value="${v[c].toFixed(2)}" style="width:68px;background:#0d1118;color:#fff;border:1px solid #3a4560;border-radius:4px;padding:2px 4px"></label>`).join("") +
    `</div>` +
    `<div style="margin:6px 0 2px;display:flex;align-items:center;gap:6px">paso <select id="${ID}-paso" style="background:#0d1118;color:#fff;border:1px solid #3a4560;border-radius:4px">` +
    [0.01, 0.05, 0.10, 0.25, 0.50].map((q) => `<option ${q === paso ? "selected" : ""} value="${q}">${q.toFixed(2)} m</option>`).join("") +
    `</select><span style="opacity:.7">arrastra una cara amarilla o escribe</span></div>` +
    `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">` +
    boton("centrada", "▫ Centrada") + boton("lw", "◧ Lindero O") + boton("le", "◨ Lindero E") +
    boton("ls", "⬓ Lindero S") + boton("ln", "⬒ Lindero N") + boton("esq", "◰ Esquinera (O+S)") +
    boton("igual", "▣ 4 caras = Oeste") + boton("reset", "↺ Original") +
    `</div>` +
    (solapes(d.zapatas).size ? `<div style="color:#ff7b7b;margin-top:6px">⚠ Hay zapatas que se solapan (borde rojo): se mallarían dos veces.</div>` : ""));

  cx.querySelector(`#${ID}-p`)?.addEventListener("click", () => { plegado = !plegado; montarPanelPlanta(states); });
  cx.querySelectorAll("rect[data-i]").forEach((r) => r.addEventListener("click", () => { sel = +(r as any).dataset.i; montarPanelPlanta(states); }));
  cx.querySelector(`#${ID}-paso`)?.addEventListener("change", (e) => { paso = +(e.target as any).value; montarPanelPlanta(states); });
  arrastrar(cx, z, states);
  cx.querySelectorAll("input[data-c]").forEach((inp) => inp.addEventListener("change", () => {
    const n = { ...v }; (n as any)[(inp as any).dataset.c] = +(inp as HTMLInputElement).value; fijar(sel, n);
  }));
  cx.querySelectorAll("button[data-a]").forEach((b) => b.addEventListener("click", () => {
    const a = (b as any).dataset.a, base = z.base as VueloZapata, n = { ...v };
    const m = Math.max(base.w, base.e, base.s, base.n);
    if (a === "centrada") Object.assign(n, { w: m, e: m, s: m, n: m });
    if (a === "reset") Object.assign(n, base);
    if (a === "lw") n.w = 0;
    if (a === "le") n.e = 0;
    if (a === "ls") n.s = 0;
    if (a === "ln") n.n = 0;
    if (a === "esq") { n.w = 0; n.s = 0; }
    if (a === "igual") Object.assign(n, { e: n.w, s: n.w, n: n.w });
    fijar(sel, n);
  }));
}

/**
 * ARRASTRAR una cara con el ratón: se mueve la manilla amarilla; el vuelo se ajusta al PASO
 * (así «de cuánto en cuánto» lo manda el panel) y la zapata se redibuja en vivo. El modelo se
 * recalcula al SOLTAR, no en cada píxel: el solver tarda y el arrastre se atascaría.
 */
function arrastrar(cx: HTMLElement, z: any, states: any) {
  const svg = cx.querySelector("svg") as SVGSVGElement | null;
  if (!svg) return;
  const base = z.vuelos as VueloZapata;
  const caja = { x0: z.x0 + base.w, x1: z.x1 - base.e, y0: z.y0 + base.s, y1: z.y1 - base.n };   // cara de las columnas
  svg.querySelectorAll("line[data-h]").forEach((ln) => ln.addEventListener("pointerdown", (ev: any) => {
    ev.preventDefault(); ev.stopPropagation();
    const cara = (ln as any).dataset.h as keyof VueloZapata;
    const nuevo: VueloZapata = { ...base };
    (ln as Element).setPointerCapture?.(ev.pointerId);
    const alMover = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      const xm = PANT.x0 + (e.clientX - r.left) / PANT.k, ym = PANT.y0 + (PANT.H - (e.clientY - r.top)) / PANT.k;
      let q = cara === "w" ? caja.x0 - xm : cara === "e" ? xm - caja.x1 : cara === "s" ? caja.y0 - ym : ym - caja.y1;
      q = Math.max(0, Math.round(q / paso) * paso);
      (nuevo as any)[cara] = r2(q);
      const x0 = caja.x0 - nuevo.w, x1 = caja.x1 + nuevo.e, y0 = caja.y0 - nuevo.s, y1 = caja.y1 + nuevo.n;
      const X = (x: number) => (x - PANT.x0) * PANT.k, Y = (y: number) => PANT.H - (y - PANT.y0) * PANT.k;
      const rect = svg.querySelector(`rect[data-i="${sel}"]`);
      rect?.setAttribute("x", String(X(x0))); rect?.setAttribute("y", String(Y(y1)));
      rect?.setAttribute("width", String((x1 - x0) * PANT.k)); rect?.setAttribute("height", String((y1 - y0) * PANT.k));
      const pon = (c: string, x1_: number, y1_: number, x2_: number, y2_: number) =>
        svg.querySelectorAll(`line[data-h="${c}"],line[data-hv="${c}"]`).forEach((l) => {
          l.setAttribute("x1", String(x1_)); l.setAttribute("y1", String(y1_)); l.setAttribute("x2", String(x2_)); l.setAttribute("y2", String(y2_)); });
      pon("w", X(x0), Y(y1), X(x0), Y(y0)); pon("e", X(x1), Y(y1), X(x1), Y(y0));
      pon("s", X(x0), Y(y0), X(x1), Y(y0)); pon("n", X(x0), Y(y1), X(x1), Y(y1));
      const cxm = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      const tx = (c: string, x: number, y: number) => { const t = svg.querySelector(`text[data-t="${c}"]`);
        if (t) { t.setAttribute("x", String(x)); t.setAttribute("y", String(y)); t.textContent = (nuevo as any)[c].toFixed(2); } };
      tx("w", X(x0) + 14, Y(cy) - 4); tx("e", X(x1) - 14, Y(cy) - 4); tx("s", X(cxm), Y(y0) - 4); tx("n", X(cxm), Y(y1) + 12);
      const sz = cx.querySelector("b[data-sz]"); if (sz) sz.textContent = `${(x1 - x0).toFixed(2)} × ${(y1 - y0).toFixed(2)} m`;
      cx.querySelectorAll("input[data-c]").forEach((i: any) => { i.value = (nuevo as any)[i.dataset.c].toFixed(2); });
    };
    const alSoltar = () => {
      window.removeEventListener("pointermove", alMover); window.removeEventListener("pointerup", alSoltar);
      fijar(sel, nuevo);
    };
    window.addEventListener("pointermove", alMover); window.addEventListener("pointerup", alSoltar);
  }));
}
