/**
 * EL CUADRO DE LA SECCIÓN: designas una barra y ves qué perfil es, dibujado y acotado.
 *
 * Jorge, 21-sep-2026: «no tenemos nosotros para ver una sección transversal del
 * elemento, un cuadro, para ver qué elemento consideramos».
 *
 * Y es verdad que faltaba: el visor ya dibuja la sección en el medio de cada barra
 * y sabe extruirla, pero no había forma de mirar UNA y leer sus medidas. Para
 * contar en un vídeo «esta columna es CFT 250×250×8» hace falta verlo.
 *
 * El dibujo es SVG a escala, con las cotas en milímetros, y debajo las propiedades
 * que de verdad entran en el cálculo (A, I22, I33, J, E). Los contornos se arman
 * aquí a partir de `sectionShape`, que es lo mismo que usan el visor y el
 * exportador a CSI: si cambia el perfil, cambia el dibujo.
 */

const W = () => window as any;

type Forma = {
  type: string; b?: number; h?: number; d?: number; tw?: number; tf?: number;
  t?: number; r?: number; lip?: number; dis?: number; name?: string;
};

const mm = (v?: number) => (v == null ? "—" : (v * 1000).toFixed(v * 1000 < 10 ? 1 : 0));

/** Nombre legible del perfil, con sus medidas en mm. */
export function nombreSeccion(f: Forma): string {
  if (f.name) return f.name;
  const t = f.type;
  if (t === "rect") return `${mm(f.b)}×${mm(f.h)}`;
  if (t === "circ") return `⌀${mm(f.d)}`;
  if (t === "pipe") return `⌀${mm(f.d)}×${mm(f.tw)}`;
  if (t === "I") return `I ${mm(f.h)}×${mm(f.b)}×${mm(f.tf)}×${mm(f.tw)}`;
  if (t === "HSS" || t === "CFT") return `${t} ${mm(f.b)}×${mm(f.h)}×${mm(f.tw)}`;
  if (t === "L") return `L ${mm(f.b)}×${mm(f.h)}×${mm(f.t ?? f.tw)}`;
  if (t === "2L") return `2L ${mm(f.h)}×${mm(f.h)}×${mm(f.t ?? f.tw)} s${mm(f.dis)}`;
  if (t === "C" || t === "coldC") return `C ${mm(f.h)}×${mm(f.b)}×${mm(f.t ?? f.tw)}`;
  if (t === "2C") return `2C ${mm(f.h)}×${mm(f.b)}×${mm(f.t ?? f.tw)}`;
  if (t === "T") return `T ${mm(f.h)}×${mm(f.b)}`;
  return t;
}

/** El contorno de la sección, en metros y centrado. Devuelve polígonos. */
function contorno(f: Forma): number[][][] {
  const b = f.b ?? 0.1, h = f.h ?? 0.1, tw = f.tw ?? f.t ?? 0.006, tf = f.tf ?? f.t ?? tw;
  const B = b / 2, H = h / 2;
  const caja = (x0: number, y0: number, x1: number, y1: number) =>
    [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  switch (f.type) {
    case "rect": return [caja(-B, -H, B, H)];
    case "circ": case "pipe": {
      const R = (f.d ?? 0.1) / 2, n = 40;
      const fuera = Array.from({ length: n }, (_, i) =>
        [R * Math.cos((2 * Math.PI * i) / n), R * Math.sin((2 * Math.PI * i) / n)]);
      if (f.type === "circ") return [fuera];
      const r = R - (f.tw ?? 0.006);
      return [fuera, Array.from({ length: n }, (_, i) =>
        [r * Math.cos((2 * Math.PI * i) / n), r * Math.sin((2 * Math.PI * i) / n)])];
    }
    case "HSS": case "CFT":
      return [caja(-B, -H, B, H), caja(-B + tw, -H + tw, B - tw, H - tw)];
    case "I":
      return [[
        [-B, -H], [B, -H], [B, -H + tf], [tw / 2, -H + tf], [tw / 2, H - tf],
        [B, H - tf], [B, H], [-B, H], [-B, H - tf], [-tw / 2, H - tf],
        [-tw / 2, -H + tf], [-B, -H + tf],
      ]];
    case "C": case "coldC":
      return [[
        [-B, -H], [B, -H], [B, -H + tf], [-B + tw, -H + tf], [-B + tw, H - tf],
        [B, H - tf], [B, H], [-B, H],
      ]];
    case "T":
      return [[
        [-B, H - tf], [B, H - tf], [B, H], [-B, H], [-B, H - tf],
        [-tw / 2, H - tf], [-tw / 2, -H], [tw / 2, -H], [tw / 2, H - tf],
      ]];
    case "L": {
      const e = f.t ?? tw;
      return [[[-B, -H], [B, -H], [B, -H + e], [-B + e, -H + e], [-B + e, H], [-B, H]]];
    }
    case "2L": {
      // OJO: en el modelo `b` es el ancho TOTAL de los dos angulos juntos
      // (2L50x50x5s10 -> b = 0.11 = 50 + 10 + 50), no el ala de uno.
      // Medido el 21-sep-2026 en el galpon; sumarle la separacion otra vez
      // daba 230 mm donde son 110.
      const e = f.t ?? tw, s = (f.dis ?? 0.01) / 2;
      const ala = Math.max(1e-4, (b - 2 * s) / 2);      // el ala de UN angulo
      const uno = (sg: number) => [
        [sg * s, -H], [sg * (s + ala), -H], [sg * (s + ala), -H + e],
        [sg * (s + e), -H + e], [sg * (s + e), H], [sg * s, H],
      ];
      return [uno(1), uno(-1)];
    }
    case "2C": {
      const s = (f.dis ?? 0.01) / 2;
      const uno = (sg: number) => [
        [sg * s, -H], [sg * (s + b), -H], [sg * (s + b), -H + tf], [sg * (s + tw), -H + tf],
        [sg * (s + tw), H - tf], [sg * (s + b), H - tf], [sg * (s + b), H], [sg * s, H],
      ];
      return [uno(1), uno(-1)];
    }
    default: return [caja(-B, -H, B, H)];
  }
}

function svg(f: Forma): string {
  const polis = contorno(f);
  const todos = polis.flat();
  if (!todos.length) return "";
  const xs = todos.map((p) => p[0]), ys = todos.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const W0 = 250, H0 = 180, M = 34;
  const k = Math.min((W0 - 2 * M) / Math.max(x1 - x0, 1e-6), (H0 - 2 * M) / Math.max(y1 - y0, 1e-6));
  const X = (x: number) => W0 / 2 + (x - (x0 + x1) / 2) * k;
  const Y = (y: number) => H0 / 2 - (y - (y0 + y1) / 2) * k;   // Y hacia arriba
  const relleno = polis.length > 1 ? "evenodd" : "nonzero";
  const d = polis.map((p) => "M " + p.map((q) => `${X(q[0]).toFixed(1)},${Y(q[1]).toFixed(1)}`).join(" L ") + " Z").join(" ");
  const cotaX = `<line x1="${X(x0)}" y1="${H0 - 14}" x2="${X(x1)}" y2="${H0 - 14}" stroke="#e6c463" stroke-width="1"/>` +
    `<text x="${(X(x0) + X(x1)) / 2}" y="${H0 - 4}" text-anchor="middle" font-size="10" fill="#e6c463">${mm(x1 - x0)} mm</text>`;
  const cotaY = `<line x1="14" y1="${Y(y0)}" x2="14" y2="${Y(y1)}" stroke="#e6c463" stroke-width="1"/>` +
    `<text x="10" y="${(Y(y0) + Y(y1)) / 2}" text-anchor="middle" font-size="10" fill="#e6c463" ` +
    `transform="rotate(-90 10 ${(Y(y0) + Y(y1)) / 2})">${mm(y1 - y0)} mm</text>`;
  return `<svg viewBox="0 0 ${W0} ${H0}" width="100%" style="max-width:${W0}px;display:block;margin:2px auto">` +
    `<path d="${d}" fill="#38bdf8" fill-opacity="0.38" fill-rule="${relleno}" stroke="#7dd3fc" stroke-width="1.4"/>` +
    cotaX + cotaY + `</svg>`;
}

// ── la ventana ────────────────────────────────────────────────────────
let caja: HTMLDivElement | null = null;

function crear(): HTMLDivElement {
  const v = document.createElement("div");
  v.id = "hk-seccion";
  v.style.cssText = [
    "position:fixed", "left:16px", "top:96px", "width:270px", "z-index:9100",
    "background:#0b1220", "border:1px solid #334155", "border-radius:9px",
    "box-shadow:0 10px 30px rgba(0,0,0,.45)", "color:#e5e7eb",
    "font:12px system-ui,Segoe UI,sans-serif", "overflow:hidden",
  ].join(";");
  document.body.appendChild(v);
  // arrastrable por la cabecera
  let ox = 0, oy = 0, mov = false;
  v.addEventListener("mousedown", (e) => {
    const t = e.target as HTMLElement;
    if (!t.closest("[data-cab]") || t.tagName === "BUTTON") return;
    const r = v.getBoundingClientRect(); ox = e.clientX - r.left; oy = e.clientY - r.top; mov = true;
    e.preventDefault();
  });
  window.addEventListener("mousemove", (e) => {
    if (!mov) return;
    v.style.left = Math.max(0, e.clientX - ox) + "px";
    v.style.top = Math.max(0, e.clientY - oy) + "px";
  });
  window.addEventListener("mouseup", () => { mov = false; });
  return v;
}

/** Lee la barra designada y pinta su sección. */
export function mostrarSeccion(): string {
  const sel: Array<{ type: string; idx: number }> = W().__hekatanModelSelection ?? [];
  let ult: { type: string; idx: number } | null = null;
  for (let i = sel.length - 1; i >= 0; i--) if (sel[i].type === "frame") { ult = sel[i]; break; }
  if (!ult) return "Designá una barra en el visor (clic encima).";

  const st = W().__hekatanStates;
  const ei = st?.elementInputs?.val ?? st?.elementInputs?.rawVal ?? {};
  const g = (m: any, def: number) => Number(m?.get?.(ult!.idx) ?? m?.[ult!.idx] ?? def) || def;
  const f: Forma | undefined = ei.sectionShapes?.get?.(ult.idx);
  if (!f) return `La barra ${ult.idx + 1} no tiene forma de sección declarada.`;

  if (!caja || !document.body.contains(caja)) caja = crear();
  caja.style.display = "block";
  const fila = (a: string, b: string) =>
    `<tr><td style="padding:1px 6px;color:#94a3b8">${a}</td>` +
    `<td style="padding:1px 6px;text-align:right;font-family:ui-monospace,Consolas,monospace">${b}</td></tr>`;
  caja.innerHTML =
    `<div data-cab style="display:flex;align-items:center;gap:6px;padding:6px 9px;background:#13314f;cursor:move">` +
    `<b style="flex:1;font-size:12px">📐 Sección · barra ${ult.idx + 1}</b>` +
    `<button id="hk-sec-x" style="background:none;border:none;color:#cbd5e1;cursor:pointer;font-size:13px">✕</button></div>` +
    `<div style="padding:6px 8px">` +
    `<div style="text-align:center;font-weight:600;color:#7dd3fc;margin-bottom:2px">${nombreSeccion(f)}</div>` +
    svg(f) +
    `<table style="width:100%;font-size:11px;margin-top:4px">` +
    fila("Tipo", f.type) +
    fila("A", g(ei.areas, 0).toExponential(3) + " m²") +
    fila("I₂₂", g(ei.I22 ?? ei.momentsOfInertiaZ, 0).toExponential(3) + " m⁴") +
    fila("I₃₃", g(ei.I33 ?? ei.momentsOfInertiaY, 0).toExponential(3) + " m⁴") +
    fila("J", g(ei.J ?? ei.torsionalConstants, 0).toExponential(3) + " m⁴") +
    fila("E", g(ei.elasticities, 0).toExponential(3) + " kN/m²") +
    `</table></div>`;
  caja.querySelector("#hk-sec-x")?.addEventListener("click", () => { if (caja) caja.style.display = "none"; });
  return `Barra ${ult.idx + 1}: ${nombreSeccion(f)}`;
}

export function montarBotonSeccion() {
  if (document.getElementById("hk-sec-btn")) return;
  const b = document.createElement("button");
  b.id = "hk-sec-btn";
  b.textContent = "📐";
  b.title = "Ver la sección de la barra designada (dibujo acotado y propiedades)";
  b.style.cssText = [
    "position:fixed", "left:16px", "top:60px", "z-index:9100",
    "width:34px", "height:34px", "border-radius:50%", "border:1px solid #64748b",
    "background:#0b1220", "color:#f1f5f9", "font-size:15px", "cursor:pointer",
    "opacity:.85", "box-shadow:0 3px 10px rgba(0,0,0,.35)",
  ].join(";");
  b.onclick = () => {
    const msg = mostrarSeccion();
    if (msg.startsWith("Designá") || msg.startsWith("La barra")) {
      const t = document.createElement("div");
      t.style.cssText = "position:fixed;left:16px;top:100px;z-index:9200;background:#3f1d1d;color:#fca5a5;" +
        "padding:6px 10px;border-radius:6px;font:12px system-ui;max-width:260px";
      t.textContent = msg;
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 4000);
    }
  };
  const poner = () => document.body && document.body.appendChild(b);
  if (document.body) poner(); else document.addEventListener("DOMContentLoaded", poner);
  W().hkSeccion = mostrarSeccion;
}
