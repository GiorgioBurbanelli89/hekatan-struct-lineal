/**
 * Tutorial 6 — La CAPILLA REAL (Capilla Analitico.EDB) replicada barra a barra,
 * nudo a nudo, solo con el cursor y el menú (nada de comandos). Jorge: «cuando
 * sea igual geometría por geometría, posición por posición, hablamos».
 *
 * Fuente: `tests/datos/capilla_geom_etabs.json` (152 nudos / 187 barras, por
 * OAPI). Cada barra del EDB se dibuja con la herramienta Línea entre sus dos
 * nudos reales — los arcos del EDB ya son tramos rectos, así que dibujarlos
 * nudo a nudo ES replicar su discretización. Orden: barras del plano XZ eje a
 * eje, luego YZ, luego las de planta XY cota a cota, y al final las diagonales
 * (enganchan por osnap a nudos ya existentes). Cámara cerca de cada eje para
 * que 1 px ≈ 1 cm. Al terminar, `cli/_capilla_check.mjs` mide nudo a nudo.
 *
 * Toda acción se NARRA (plano, herramienta, qué se dibuja).
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
export const EDB = JSON.parse(readFileSync(join(__dirname, "..", "..", "tests", "datos", "capilla_geom_etabs.json"), "utf8"));
export const titulo = "Hekatan Struct · la capilla analítica (réplica del EDB)";
export const ruta = "workspace/?t=new-blank";

// ── Clasificación de barras por plano ──────────────────────────────────────
const r2 = (v) => Math.round(v * 100) / 100;
const N = EDB.nodes, E = EDB.elements, T = EDB.tipos;
const same = (a, b) => Math.abs(a - b) < 0.02;
export const grupos = (() => {
  const xz = new Map(), yz = new Map(), xy = new Map(), otras = [];
  E.forEach(([i, j], k) => {
    const a = N[i], b = N[j], item = { a, b, tipo: T[k] };
    if (same(a[1], b[1])) { const key = r2(a[1]); (xz.get(key) ?? xz.set(key, []).get(key)).push(item); }
    else if (same(a[0], b[0])) { const key = r2(a[0]); (yz.get(key) ?? yz.set(key, []).get(key)).push(item); }
    else if (same(a[2], b[2])) { const key = r2(a[2]); (xy.get(key) ?? xy.set(key, []).get(key)).push(item); }
    else otras.push(item);
  });
  const ord = (m) => [...m.entries()].sort((p, q) => p[0] - q[0]);
  return { xz: ord(xz), yz: ord(yz), xy: ord(xy), otras };
})();
export const EJES = grupos.xz.map(([y]) => y);
const bbox = (() => { const xs = N.map((p) => p[0]), ys = N.map((p) => p[1]), zs = N.map((p) => p[2]);
  return { x: [Math.min(...xs), Math.max(...xs)], y: [Math.min(...ys), Math.max(...ys)], z: [Math.min(...zs), Math.max(...zs)] }; })();
const centro = [(bbox.x[0] + bbox.x[1]) / 2, (bbox.y[0] + bbox.y[1]) / 2, (bbox.z[0] + bbox.z[1]) / 2];

// ── Helpers de cursor / cámara ─────────────────────────────────────────────
const proj = async (a, wx, wy, wz = 0) => a.pag.evaluate(({ wx, wy, wz }) => {
  const host = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera);
  if (!host) return null;
  const cam = host.__ctx.camera; const rect = host.getBoundingClientRect(); cam.updateMatrixWorld();
  const ap = (m, v) => { const e = m.elements; return [
    e[0]*v[0]+e[4]*v[1]+e[8]*v[2]+e[12]*v[3], e[1]*v[0]+e[5]*v[1]+e[9]*v[2]+e[13]*v[3],
    e[2]*v[0]+e[6]*v[1]+e[10]*v[2]+e[14]*v[3], e[3]*v[0]+e[7]*v[1]+e[11]*v[2]+e[15]*v[3] ]; };
  let v = ap(cam.matrixWorldInverse, [wx, wy, wz, 1]); v = ap(cam.projectionMatrix, v);
  return { x: rect.left + (v[0]/v[3]*0.5+0.5)*rect.width, y: rect.top + (-v[1]/v[3]*0.5+0.5)*rect.height };
}, { wx, wy, wz });
// Fotogramas al mínimo (Jorge: «apurar fotogramas»): 2 tramos de cursor + 1 de clic.
const mover = async (a, x, y, pasos = 2) => {
  const p0 = await a.pag.evaluate(() => window.__tutXY || { x: 640, y: 300 });
  for (let i = 1; i <= pasos; i++) {
    const cx = p0.x + (x - p0.x) * (i / pasos), cy = p0.y + (y - p0.y) * (i / pasos);
    await a.pag.mouse.move(cx, cy);
    await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x: cx, y: cy });
    await a.quieto(1, 35);
  }
};
const clicPx = async (a, x, y, lento = false) => {
  await mover(a, x, y, lento ? 12 : 2); if (lento) await a.quieto(3, 220);
  await a.pag.evaluate((q) => window.__tutClick && window.__tutClick(q.x, q.y), { x, y });
  await a.quieto(lento ? 3 : 1, 200); await a.pag.mouse.click(x, y); if (lento) await a.quieto(2, 200);
};
const clk = async (a, p, lento = false) => { const s = await proj(a, p[0], p[1], p[2]); if (s) await clicPx(a, s.x, s.y, lento); };
const setPlano = async (a, k, off = 0) => a.pag.evaluate(({ kk, off }) => {
  const gt = window.__hekatanDrawingGridTarget;
  if (gt) {
    if (kk === "xy") gt.val = { position: [0, 0, off], rotation: [Math.PI / 2, 0, 0] };
    else if (kk === "xz") gt.val = { position: [0, off, 0], rotation: [0, 0, 0] };
    else gt.val = { position: [off, 0, 0], rotation: [0, 0, Math.PI / 2] };
  }
  try { window.__hekatanCadState.get().workPlane = kk; } catch (e) {}
}, { kk: k, off });
const setTool = async (a, t) => a.pag.evaluate((tt) => { try { window.__hekatanCadState.setTool(tt); } catch (e) {} }, t);
const vista = async (a, p, t) => a.pag.evaluate(({ p, t }) => {
  const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera);
  if (!h) return; const c = h.__ctx;
  c.camera.position.set(p[0], p[1], p[2]); if (c.camera.up) c.camera.up.set(0, 0, 1);
  c.controls.target.set(t[0], t[1], t[2]); c.camera.lookAt(t[0], t[1], t[2]);
  c.controls.update(); c.render();
}, { p, t });
// Dirección de cámara validada (17,−20,10) normalizada; distancia según lo que se encuadra.
const DIR = [17 / 28.3, -20 / 28.3, 10 / 28.3];
const camA = (target, dist) => [[target[0] + DIR[0] * dist, target[1] + DIR[1] * dist, target[2] + DIR[2] * dist], target];
const ISO = camA(centro, 46);
// Cerca: a 22 m, 1 px ≈ 3 cm → con osnap de 3 px un nudo vecino (≥1.15 m) queda a >20 px.
const camEje = (Y) => camA([(bbox.x[0] + bbox.x[1]) / 2, Y, centro[2]], 22);      // un pórtico (≈20 m de ancho)
const camCota = (z) => camA([centro[0], centro[1], z], 30);
const limpiar = async (a) => { await a.pag.keyboard.press("Escape"); await a.pag.evaluate(() => { try { window.__hekatanCadState?.setTool?.(null); } catch(e){} try { window.__hekatanClearMeasure && window.__hekatanClearMeasure(); } catch(e){} }); };
// Cámara vigente (para volver a ella tras un reintento).
let camActual = null;
const vistaR = async (a, p, t) => { camActual = [p, t]; await vista(a, p, t); };
// Extremos de la última barra dibujada, para VERIFICAR el clic.
const ultimaBarra = (a) => a.pag.evaluate(() => {
  const pl = window.__hekatanDrawingPolylines?.rawVal || [], P = window.__hekatanDrawingPoints?.rawVal || [];
  // La herramienta Línea guarda la barra como COORDENADAS [x1,y1,z1,x2,y2,z2]
  // (no índices) — leerlas como índices daba falsos fallos y deshacía de más.
  const esCoords = (x) => x.length === 6 && x.some((v) => !Number.isInteger(v) || v >= P.length);
  const ext = (x) => esCoords(x) ? [[x[0], x[1], x[2]], [x[3], x[4], x[5]]] : [P[x[0]], P[x[x.length - 1]]];
  const last = [...pl].reverse().find((x) => x.length >= 2); if (!last) return null;
  const [A, B] = ext(last);
  return { n: pl.filter((x) => x.length >= 2).length, a: A, b: B };
});
const dist = (u, v) => Math.hypot(u[0] - v[0], u[1] - v[1], u[2] - v[2]);
const TOL_M = 0.03;   // 3 cm
/** Línea entre p y q con VERIFICACIÓN: si un extremo no cae a ≤3 cm (clic
 *  perdido bajo un panel/barra o enganchado a un nudo vecino), Ctrl+Z y
 *  reintento con la cámara encima de la barra. Registra los fallos. */
export const fallos = [];
const nPts = (a) => a.pag.evaluate(() => (window.__hekatanDrawingPoints?.rawVal || []).length);
const linea = async (a, p, q, lento = false) => {
  const antes = (await ultimaBarra(a))?.n ?? 0, ptsAntes = await nPts(a);
  const dibujar = async () => { await setTool(a, "line"); await clk(a, p, lento); await clk(a, q, lento); await a.pag.keyboard.press("Escape"); };
  const ok = async () => { const u = await ultimaBarra(a); return !!u && u.n === antes + 1 && ((dist(u.a, p) <= TOL_M && dist(u.b, q) <= TOL_M) || (dist(u.a, q) <= TOL_M && dist(u.b, p) <= TOL_M)); };
  await dibujar();
  if (await ok()) return true;
  // Deshacer hasta el nº de PUNTOS de antes (cada clic es un snapshot). Antes
  // se deshacía por nº de barras y quedaba un punto suelto: la barra siguiente
  // arrancaba de él y salía de 3 puntos (medido en cli/_capilla_dbg.mjs).
  for (let k = 0; k < 4 && (await nPts(a)) > ptsAntes; k++) { await a.pag.keyboard.down("Control"); await a.pag.keyboard.press("z"); await a.pag.keyboard.up("Control"); }
  await a.pag.keyboard.press("Escape");
  const mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2];
  await vista(a, ...camA(mid, 10));   // a 10 m, 1 px ≈ 1.5 cm
  await dibujar();
  const bien = await ok();
  if (!bien) fallos.push({ p, q, antes, u: await ultimaBarra(a), raw: await a.pag.evaluate(() => (window.__hekatanDrawingPolylines?.rawVal || []).slice(-2)) });
  if (camActual) await vista(a, ...camActual);
  return bien;
};

// ── Receta: barra a barra desde el EDB ─────────────────────────────────────
/** Cierra los paneles laterales con las PUERTAS CORREDIZAS (clic del cursor en
 *  #hk-settings-toggle y #hk-pane-toggle) si están abiertos. Juntos tapaban el
 *  60 % del ancho y los clics que caían debajo se perdían (7 barras menos y
 *  nudos a 2–3 m). Se comprueba el estado por el transform del panel. */
export const cerrarPaneles = async (a) => {
  for (const [panelSel, btnSel] of [["#settings", "#hk-settings-toggle"], ["#hk-pane-host", "#hk-pane-toggle"]]) {
    const r = await a.pag.evaluate(({ p, b }) => {
      const panel = document.querySelector(p), btn = document.querySelector(b); if (!btn) return null;
      const tr = panel ? getComputedStyle(panel).transform : "none";
      const oculto = tr && tr !== "none" && Math.abs(new DOMMatrix(tr).m41) > 40;
      const rc = btn.getBoundingClientRect(); return { oculto, x: rc.left + rc.width / 2, y: rc.top + rc.height / 2 };
    }, { p: panelSel, b: btnSel });
    if (r && !r.oculto) { await clicPx(a, r.x, r.y, true); await a.quieto(2, 300); }
  }
};
export const setup = async (a) => { await setupFlags(a); await cerrarPaneles(a); };
const setupFlags = async (a) => a.pag.evaluate(() => {
  try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo","0"); } catch(e){}
  try { window.__hekatanDrawingPoints.val=[]; window.__hekatanDrawingPolylines.val=[]; window.__hekatanDrawingAreas.val=[]; window.__hekatanRebuild?.(); } catch(e){}
  try { window.__hekatanRibbonPlegar?.(true); } catch(e){}
  window.__hekatanSnapEnabled = false;   // sin rejilla: las cotas reales no son redondas
  window.__hekatanOrthoMode = false;     // orto apagado
  window.__hekatanAxisSnap = false;      // enganche a ejes apagado (capturaba vértices)
  // Polar apagado (F10 en AutoCAD): la cumbrera tiene 0.6° de pendiente y el
  // polar (±6°) aplanaba el 2º clic cuando su nudo aún no existía (5 cm arriba).
  window.__hekatanPolarTrack = false;
  // Osnap fino (3 px): con 14 px, en la iso el nudo del eje VECINO (a 1.2 m)
  // se proyecta casi encima y el clic se pegaba a él (medido: hasta 3.5 m de
  // error). Con 3 px solo engancha al re-clicar el mismo nudo.
  try { window.__hekatanAperturaPx && window.__hekatanAperturaPx(3); } catch (e) {}
});
/** Dibuja todas las barras de un eje Y (plano XZ), cámara cerca de ese eje. */
export const eje = async (a, Y, lento = false) => {
  const barras = grupos.xz.find(([y]) => y === Y)?.[1] ?? [];
  await vistaR(a, ...camEje(Y)); await setPlano(a, "xz", Y);
  for (const { a: p, b: q } of barras) await linea(a, p, q, lento);
};
/** Barras en planos YZ (por x). */
export const planosYZ = async (a) => {
  for (const [x, barras] of grupos.yz) { await vistaR(a, ...camA([x, centro[1], centro[2]], 34)); await setPlano(a, "yz", x); for (const { a: p, b: q } of barras) await linea(a, p, q); }
};
/** Barras de planta (por cota z). */
export const plantas = async (a) => {
  for (const [z, barras] of grupos.xy) { await vistaR(a, ...camCota(z)); await setPlano(a, "xy", z); for (const { a: p, b: q } of barras) await linea(a, p, q); }
};
/** Diagonales: sus dos nudos ya existen → osnap. */
export const diagonales = async (a) => { await vistaR(a, ...ISO); for (const { a: p, b: q } of grupos.otras) await linea(a, p, q); };
export const vistas = { ISO, camEje, vista, limpiar };

// ── Pasos del vídeo ────────────────────────────────────────────────────────
const nBarras = (arr) => arr.reduce((s, [, b]) => s + b.length, 0);
export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("La capilla analítica", "Tutorial 6", 16); } },
  {
    rotulo: "1 · Preparar: lienzo limpio, sin rejilla, sin orto, sin enganche a ejes",
    hacer: async (a) => { await setup(a); await a.general(); await a.quieto(1, 200); await vista(a, ...camEje(EJES[0])); await a.quieto(3, 320); },
  },
  {
    rotulo: `2 · Eje Y=${EJES[0]}: plano frontal y cada barra del EDB con Línea, nudo a nudo (columnas, arco, cabio, cumbrera, ala)`,
    hacer: async (a) => { await eje(a, EJES[0], true); await limpiar(a); await vista(a, ...camEje(EJES[0])); await a.quieto(5, 360); },
  },
  {
    rotulo: `3 · Los otros ${EJES.length - 1} ejes, igual: plano frontal de cada uno y sus barras (${nBarras(grupos.xz)} barras en XZ)`,
    hacer: async (a) => { for (const Y of EJES.slice(1)) await eje(a, Y); await limpiar(a); await vista(a, ...ISO); await a.quieto(3, 320); },
  },
  {
    rotulo: `4 · Planos laterales YZ (${nBarras(grupos.yz)} barras) y de planta XY cota a cota (${nBarras(grupos.xy)} vigas longitudinales)`,
    hacer: async (a) => { await planosYZ(a); await plantas(a); await limpiar(a); await vista(a, ...ISO); await a.quieto(3, 320); },
  },
  {
    rotulo: `5 · Diagonales (${grupos.otras.length}), enganchando a nudos ya dibujados`,
    hacer: async (a) => { await diagonales(a); await limpiar(a); await vista(a, ...ISO); await a.quieto(4, 340); },
  },
  {
    rotulo: "6 · La capilla del EDB replicada — giramos para verla",
    hacer: async (a) => {
      await limpiar(a);
      const c = await a.pag.evaluate(() => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const r = h.getBoundingClientRect(); return { x: r.left + r.width/2, y: r.top + r.height/2 }; });
      await a.pag.mouse.move(c.x, c.y); await a.pag.mouse.down();
      for (let i = 1; i <= 20; i++) { await a.pag.mouse.move(c.x + i*7, c.y - i*1.2); await a.pag.evaluate((q)=>window.__tutCursor&&window.__tutCursor(q.x,q.y),{x:c.x+i*7,y:c.y-i*1.2}); await a.quieto(1, 55); }
      await a.pag.mouse.up(); await a.quieto(4, 340);
    },
  },
];
