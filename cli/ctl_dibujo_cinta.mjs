/**
 * Lo que la prueba con el RATÓN REAL (17-oct-2026, registros/STRUCT_dibujo_raton_real_17oct.md) encontró
 * al dibujar en el lienzo nuevo, comprobado sin ventana en segundos:
 *  1. «➕ Nuevo» borra lo dibujado (antes no hacía nada).
 *  2. La cinta se pliega al dibujar y VUELVE sola tras Esc (antes había que buscar «✏ Dibujar»).
 *  3. «⇈ Subir» tras la Rejilla no duplica columnas encima de las que ya hay.
 *  4. La lista «Nivel» lleva el plano de planta a la cota del piso elegido.
 *  5. MODO REVIT: niveles + Columna/Viga/Losa con clics de ratón en la planta, «En ejes», «Todas», sin duplicar
 *     y sin que la vista salte al dibujar.
 *   node cli/ctl_dibujo_cinta.mjs [--base URL]      (defecto: dev server 4600)
 */
import puppeteer from "puppeteer";
const args = process.argv.slice(2), i = args.indexOf("--base");
const BASE = i >= 0 ? args[i + 1] : "http://localhost:4600";
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 900 });
const errs = []; pag.on("pageerror", (e) => errs.push(e.message.slice(0, 150)));
pag.on("dialog", (d) => d.accept());
await pag.goto(`${BASE}/workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(2500);
const ev = (f, a) => pag.evaluate(f, a);
const clicBoton = (t) => ev((t) => { const b = [...document.querySelectorAll("#hk-ribbon button")].find((b) => (b.textContent || "").includes(t) && b.getBoundingClientRect().width > 0); b?.click(); return !!b; }, t);
const filas = []; const ok = (que, pasa, det = "") => { filas.push(pasa); console.log((pasa ? "  ✓ " : "  ✗ ") + que + (det ? "  · " + det : "")); };
const n = () => ev(() => ({ P: window.__hekatanDrawingPoints.rawVal.length, PL: window.__hekatanDrawingPolylines.rawVal.filter((p) => p.length).length }));
const superpuestas = () => ev(() => { const P = window.__hekatanDrawingPoints.rawVal, PL = window.__hekatanDrawingPolylines.rawVal; const k = (i) => P[i].map((v) => Math.round(v * 1e6)).join(","); const s = new Set(); let d = 0;
  PL.forEach((pl) => { for (let j = 0; j + 1 < pl.length; j++) { const f = [k(pl[j]), k(pl[j + 1])].sort().join("|"); if (s.has(f)) d++; else s.add(f); } }); return d; });
const cinta = () => ev(() => { const r = document.getElementById("hk-ribbon"); return !!r && getComputedStyle(r).display !== "none"; });

await ev(() => { window.__hekatanModoRevit?.poner(false); window.__hekatanRibbonPlegar?.(false); }); await espera(400);
// 1. Nuevo
await ev(() => { window.__hekatanDrawingPoints.val = [[0, 0, 0], [1, 0, 0]]; window.__hekatanDrawingPolylines.val = [[0, 1], []]; });
await espera(300);
const t0 = Date.now(); await ev(() => document.querySelector('#hk-cad-tit button[title="Nuevo"]').click()); await espera(500);
ok("➕ Nuevo borra lo dibujado", (await n()).P === 0, `nudos ${(await n()).P}`);
// 2. Rejilla + Subir sin duplicados
await clicBoton("🏗 Rejilla"); await espera(1500);
const r0 = await n();
ok("Rejilla 4x6 · 3x5 · 4x3", r0.P === 100 && r0.PL === 80, `${r0.P} nudos, ${r0.PL} columnas`);
await clicBoton("Subir"); await espera(1500);
const dup = await superpuestas(), r1 = await n();
ok("⇈ Subir no deja barras superpuestas", dup === 0, `superpuestas ${dup}, ${r1.PL} barras`);
// 3. cinta: se pliega al primer clic de dibujo sobre el lienzo y vuelve tras Esc
await clicBoton("Línea"); await espera(300);
const cv = await ev(() => { const c = document.querySelector("#viewer canvas"); const r = c.getBoundingClientRect(); return [r.left + r.width * 0.6, r.top + r.height * 0.7]; });
await pag.mouse.click(cv[0], cv[1]); await espera(400);
const plegada = !(await cinta());
await pag.keyboard.press("Escape"); await espera(700);
ok("cinta: se pliega al dibujar y vuelve tras Esc", plegada && (await cinta()), `plegada ${plegada}, vuelve ${await cinta()}`);
// 4. Nivel
const opciones = await ev(() => { window.__hekatanLlenarNiveles?.(); return [...document.querySelectorAll("#hk-nivel option")].map((o) => o.textContent); });
await pag.select("#hk-nivel", "6"); await espera(500);
const z = await ev(() => window.__hekatanDrawingGridTarget.rawVal.position[2]);
ok("lista Nivel: niveles de la rejilla y plano a N+6.00", opciones.includes("N+6.00") && Math.abs(z - 6) < 1e-9, `${opciones.join(" ")} → z = ${z}`);
// 5. Modo Revit
await ev(() => { window.confirm = () => true; document.querySelector('#hk-cad-tit button[title="Nuevo"]').click(); window.__hekatanModoRevit.poner(true); });
await espera(500);
await ev(() => window.__hekatanModoRevit.abrirEjes()); await espera(200);
await ev(() => [...document.querySelectorAll("#hk-revit .rv-op button")].find((b) => /Crear/.test(b.textContent)).click()); await espera(1500);
const est = await ev(() => window.__hekatanModoRevit.estado());
ok("Revit: ejes y niveles creados, planta N+3.00 activa", est.ejes.xs.length === 5 && est.ejes.ys.length === 4 && est.niveles.length === 5 && est.zAct === 3, `x ${est.ejes.xs} · y ${est.ejes.ys} · z ${est.zAct}`);
const pant = (P) => ev((P) => { const c = document.querySelector("#viewer canvas"); const x = window.__hekatanViewerCtx(); const r = c.getBoundingClientRect(); const V = Object.getPrototypeOf(x.camera.position).constructor;
  return P.map((p) => { const v = new V(...p).project(x.camera); return [(v.x * 0.5 + 0.5) * r.width + r.left, (-v.y * 0.5 + 0.5) * r.height + r.top]; }); }, P);
const camara = () => ev(() => { const c = window.__hekatanViewerCtx().camera; return [c.type, ...c.position.toArray(), c.left, c.top, c.zoom].map((v) => typeof v === "number" ? +v.toFixed(4) : v).join(","); });
const cam0 = await camara();
const clicEn = async (p) => { const [[x, y]] = await pant([p]); await pag.mouse.move(x + 3, y + 2); await pag.mouse.click(x + 3, y + 2); await espera(250); };
const barras = () => ev(() => { const P = window.__hekatanDrawingPoints.rawVal, A = new Set(window.__hekatanDrawingAreas.rawVal);
  return window.__hekatanDrawingPolylines.rawVal.map((pl, i) => ({ pl, i })).filter((o) => o.pl.length && !A.has(o.i)).map((o) => o.pl.map((k) => P[k])); });
await ev(() => window.__hekatanModoRevit.usar("columna")); await clicEn([6, 5, 3]);
let B = await barras();
ok("Revit: Columna con un clic en el cruce (6,5) va de N+0.00 a N+3.00", B.length === 1 && JSON.stringify(B[0]) === "[[6,5,0],[6,5,3]]", JSON.stringify(B));
await ev(() => window.__hekatanModoRevit.usar("viga")); await clicEn([6, 5, 3]); await clicEn([12, 5, 3]); await clicEn([18, 5, 3]); await pag.keyboard.press("Escape"); await espera(200);
B = await barras();
const vigas = B.filter((b) => b[0][2] === 3 && b[1][2] === 3).map((b) => JSON.stringify(b)).sort();
ok("Revit: Viga en cadena 6→12→18 sobre el eje 2 (enganche a los cruces)", vigas.length === 2 && vigas.includes("[[6,5,3],[12,5,3]]") && vigas.includes("[[12,5,3],[18,5,3]]"), vigas.join(" "));
await ev(() => window.__hekatanModoRevit.usar("losa")); await clicEn([9, 7.5, 3]);
const A1 = await ev(() => { const P = window.__hekatanDrawingPoints.rawVal; return window.__hekatanDrawingAreas.rawVal.map((i) => window.__hekatanDrawingPolylines.rawVal[i].map((k) => P[k])); });
ok("Revit: Losa con un clic dentro del vano (6–12 × 5–10)", A1.length === 1 && JSON.stringify(A1[0].slice(0, 4)) === "[[6,5,3],[12,5,3],[12,10,3],[6,10,3]]", JSON.stringify(A1));
const cam1 = await camara();
ok("Revit: la vista NO se mueve al dibujar", cam0 === cam1, cam0 === cam1 ? "" : `${cam0} → ${cam1}`);
await ev(() => { const R = window.__hekatanModoRevit; R.columnasEnEjes(true); R.vigasEnEjes(true); R.losasTodas(true); }); await espera(800);
const tot = await ev(() => { const A = window.__hekatanDrawingAreas.rawVal; return { b: window.__hekatanDrawingPolylines.rawVal.filter((p) => p.length).length - A.length, a: A.length, n: window.__hekatanStates.nodes.rawVal.length }; });
ok("Revit: «En ejes» / «Todas» en los 4 pisos = 80 columnas + 124 vigas + 48 losas, sin duplicar lo dibujado a mano", tot.b === 204 && tot.a === 48, `${tot.b} barras, ${tot.a} losas, ${tot.n} nudos del modelo`);
ok("sin errores de página", errs.length === 0, errs.join(" | "));
console.log(`${filas.filter(Boolean).length}/${filas.length} OK (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
await nav.close(); process.exit(filas.every(Boolean) ? 0 : 1);
