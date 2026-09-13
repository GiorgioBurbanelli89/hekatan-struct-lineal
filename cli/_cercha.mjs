// Cercha WARREN con la CINTA de acceso rápido y el mouse (Jorge, 13-sep-2026: «haz primero una
// cercha, a ver cómo te va; si no calculas, ¿de qué sirve?»). Vano 12 m, canto 2 m, 6 paneles:
// cordón inferior (7 nudos), superior (6 nudos) y las diagonales en zigzag (13 clics). Apoyos con
// «Apoyo» de la cinta, cargas con «Carga» (−10 kN por nudo superior). La app resuelve SOLA
// (autorun): se leen flecha y axiles del estado y se exporta .heks para el careo con ETABS.
//   node cli/_cercha.mjs [warren|howe|pratt]     (dev server en 4600)
import puppeteer from "puppeteer";
import fs from "node:fs";
const TIPO = (process.argv[2] || "warren").toLowerCase();
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 160)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const ev = (f, a) => pag.evaluate(f, a);
let k = 0; const foto = async (n) => { await espera(350); await pag.screenshot({ path: `cli/shots/cercha_${TIPO}_${String(k++).padStart(2, "0")}_${n}.png` }); };
const cursor = (x, y) => ev(({ x, y }) => { let c = document.getElementById("hk-test-cursor"); if (!c) { c = document.createElement("div"); c.id = "hk-test-cursor"; c.style.cssText = "position:fixed;width:18px;height:18px;border:2px solid #ff3030;border-radius:50%;background:rgba(255,48,48,.25);pointer-events:none;z-index:99999;transform:translate(-50%,-50%)"; document.body.appendChild(c); } c.style.left = x + "px"; c.style.top = y + "px"; }, { x, y });
const mover = async (x, y, pasos = 8) => { const p0 = mover.ult || { x, y }; for (let i = 1; i <= pasos; i++) { const cx = p0.x + (x - p0.x) * i / pasos, cy = p0.y + (y - p0.y) * i / pasos; await pag.mouse.move(cx, cy); await cursor(cx, cy); await espera(20); } mover.ult = { x, y }; };
const clic = async (x, y, boton = "left") => { await mover(x, y); await espera(200); await pag.mouse.click(x, y, { button: boton }); await espera(250); };
const rect = (fn, arg) => ev((q) => { const f = new Function("arg", q.src); const el = f(q.arg); if (!el) return null; el.scrollIntoView?.({ block: "center" }); const rc = el.getBoundingClientRect(); return { x: rc.left + rc.width / 2, y: rc.top + rc.height / 2 }; }, { src: `return (${fn.toString()})(arg)`, arg });
// botón de la CINTA (acceso rápido) por texto
const cinta = async (re) => { const b = await rect((re) => [...document.querySelectorAll("#hk-ribbon button")].find((b) => new RegExp(re, "i").test(b.textContent || "")), re); if (!b) throw new Error("no está en la cinta: " + re); await clic(b.x, b.y); return b; };
const barraEstado = async (re) => { const b = await rect((re) => [...document.querySelectorAll("button")].find((b) => new RegExp(re).test((b.textContent || "").trim())), re); if (!b) throw new Error("no está el conmutador " + re); await clic(b.x, b.y); };
const proj = (P) => ev((P) => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; const r = h.querySelector("canvas").getBoundingClientRect(); const V = Object.getPrototypeOf(c.camera.position).constructor; return P.map(([x, y, z]) => { const v = new V(x, y, z).project(c.camera); return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top }; }); }, P);
const estado = () => ev(() => document.getElementById("hk-cad-status")?.textContent);
const clicMundo = async (pts) => { for (const p of pts) { const [q] = await proj([p]); await clic(q.x, q.y); } };
const filas = []; const ok = (que, medido, limite, pasa, detalle = "") => { filas.push({ que, medido, limite, ok: pasa, detalle }); console.log((pasa ? "  ✓ " : "  ✗ ") + que + "  " + medido + (detalle ? "  " + detalle : "")); };
const modelo = () => ev(() => { const S = window.__hekatanStates; const ni = S.nodeInputs.rawVal; const D = S.deformOutputs.rawVal; const A = S.analyzeOutputs.rawVal; const ei = S.elementInputs.rawVal;
  const defs = D?.deformations ? [...D.deformations.entries()] : []; const N = A?.normals ? [...A.normals.entries()] : [];
  const g = (m, i) => (m instanceof Map ? m.get(i) : m?.[i]);
  return { nodes: S.nodes.rawVal, elements: S.elements.rawVal, supports: [...(ni.supports?.entries?.() ?? [])], loads: [...(ni.loads?.entries?.() ?? [])],
    uz: defs.map(([n, d]) => [n, d[2]]), N: N.map(([e, v]) => [e, v]), props: S.elements.rawVal.map((_, i) => [g(ei.elasticities, i), g(ei.areas, i), g(ei.momentsOfInertiaY, i), g(ei.momentsOfInertiaZ, i), g(ei.torsionalConstants, i), g(ei.poissonsRatios, i), g(ei.densities, i)]) }; });

await pag.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 }); await espera(2500);
await ev(() => { try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo", "0"); } catch (e) {} try { window.__hekatanDrawingPoints.val = []; window.__hekatanDrawingPolylines.val = [[]]; window.__hekatanDrawingAreas.val = []; } catch (e) {} });
await espera(800);
// paneles laterales cerrados: la cinta de acceso rápido a la vista
for (const id of ["hk-settings-toggle", "hk-pane-toggle"]) { try { const est = await ev((id) => { const b = document.getElementById(id); const p = id === "hk-settings-toggle" ? document.getElementById("settings") : document.getElementById("hk-pane-host"); const t = p ? getComputedStyle(p).transform : "none"; const m = t && t !== "none" ? Math.abs(+t.split(",")[4]) : 0; const rc = b.getBoundingClientRect(); return { abierto: m <= 40, x: rc.left + rc.width / 2, y: rc.top + rc.height / 2 }; }, id); if (est.abierto) await clic(est.x, est.y); } catch (e) {} }
await espera(500); await foto("cinta");
{ const r = await ev(() => { const b = document.getElementById("hk-ribbon"); const rc = b.getBoundingClientRect(); return { w: Math.round(rc.width), h: Math.round(rc.height), filas: b.children.length }; }); ok("cinta: dos filas", r.filas, "= 2", r.filas === 2, `${r.w}×${r.h} px`); }
// 1. Frente (XZ) y SNAP desde la cinta / barra de estado
await cinta("Frente"); await barraEstado("^SNAP"); console.log("grid snap:", await ev(() => window.__hekatanSnapEnabled)); await foto("frente_snap");
// 2. geometría: L = 12, h = 2, 6 paneles
const L = 12, H = 2, n = 6, d = L / n;
const inf = Array.from({ length: n + 1 }, (_, i) => [i * d, 0, 0]);
const sup = TIPO === "warren" ? Array.from({ length: n }, (_, i) => [(i + 0.5) * d, 0, H]) : Array.from({ length: n + 1 }, (_, i) => [i * d, 0, H]);
const poli = async (pts) => { await cinta("Polilínea"); await clicMundo(pts); const [q] = await proj([pts[pts.length - 1]]); await clic(q.x + 40, q.y - 40, "right"); await espera(300); };
await poli(inf); await foto("cordon_inferior");
await poli(sup); await foto("cordon_superior");
if (TIPO === "warren") {
  // diagonales en zigzag: 0,0 → 1,2 → 2,0 → 3,2 … → 12,0 (una sola polilínea)
  const zig = []; for (let i = 0; i < n; i++) { zig.push(inf[i]); zig.push(sup[i]); } zig.push(inf[n]);
  await poli(zig);
} else {
  // Howe: diagonales hacia el centro caen al apoyo; Pratt: al revés. Verticales en todos los nudos.
  for (let i = 1; i < n; i++) { await cinta("Línea"); await clicMundo([inf[i], sup[i]]); await pag.keyboard.press("Escape"); await espera(150); }
  for (let i = 0; i < n; i++) {
    const izq = i < n / 2; const par = TIPO === "howe" ? (izq ? [inf[i], sup[i + 1]] : [sup[i], inf[i + 1]]) : (izq ? [sup[i], inf[i + 1]] : [inf[i], sup[i + 1]]);
    await cinta("Línea"); await clicMundo(par); await pag.keyboard.press("Escape"); await espera(150);
  }
}
await foto("diagonales");
{ const m = await modelo(); const nN = TIPO === "warren" ? 13 : 14, nE = TIPO === "warren" ? 6 + 5 + 12 : 6 + 6 + 5 + 6;
  ok("cercha: nudos", m.nodes.length, "= " + nN, m.nodes.length === nN); ok("cercha: barras", m.elements.length, "= " + nE, m.elements.length === nE); }
// 3. apoyos con «Apoyo» de la cinta (clic en el nudo) y cargas con «Carga» (−10 kN en cada nudo superior)
await cinta("Apoyo"); await clicMundo([inf[0], inf[n]]); await foto("apoyos");
await cinta("Carga"); await clicMundo(TIPO === "warren" ? sup : sup.slice(1, n)); await espera(800); await foto("cargas");
console.log("  ", await estado());
// 4. la app calcula sola: flecha y axiles
let m = await modelo();
ok("apoyos en el modelo", m.supports.length, "= 2", m.supports.length === 2); ok("cargas en el modelo", m.loads.length, "= " + (TIPO === "warren" ? n : n - 1), m.loads.length === (TIPO === "warren" ? n : n - 1));
ok("calculado (autorun): nudos con resultado", m.uz.length, "= " + m.nodes.length, m.uz.length === m.nodes.length);
const uzMax = Math.max(...m.uz.map(([, v]) => Math.abs(v))); const Nmax = Math.max(...m.N.map(([, v]) => Math.max(...v.map(Math.abs))));
console.log("  flecha máx", (uzMax * 1000).toFixed(3), "mm | axil máx", Nmax.toFixed(2), "kN | sección", m.props[0]);
ok("flecha máxima > 0", (uzMax * 1000).toFixed(3) + " mm", "> 0", uzMax > 0); ok("axil máximo > 0", Nmax.toFixed(2) + " kN", "> 0", Nmax > 0);
// 5. deformada + diagrama de axiles en el visor
await ev(() => { const s = window.__hekatanSettings?.(); if (s?.deformedShape) s.deformedShape.val = true; if (s?.frameResults) s.frameResults.val = "contour:normals"; if (s?.supports) s.supports.val = true; if (s?.loads) s.loads.val = true; }); await espera(800); await foto("axiles");
// 6. .heks para ETABS (misma sección, mismas cargas, apoyos empotrados como los pone «Apoyo»)
{ const Lh = []; m.nodes.forEach((p, i) => Lh.push(`node ${i + 1} ${p.map((v) => +v.toFixed(6)).join(" ")}`));
  m.elements.forEach((e, i) => { const [E, A, I22, I33, J, nu, rho] = m.props[i]; Lh.push(`frame ${i + 1} ${e[0] + 1} ${e[1] + 1} ${E} ${A} ${I22} ${I33} ${J} ${nu} ${rho}`); });
  for (const [nd, dofs] of m.supports) Lh.push(`support ${nd + 1} ${dofs.map((v) => (v ? 1 : 0)).join(" ")}`);
  for (const [nd, f] of m.loads) Lh.push(`load ${nd + 1} ${f.join(" ")}`);
  Lh.push("solve"); fs.writeFileSync(`cli/shots/cercha_${TIPO}.heks`, Lh.join("\n") + "\n"); console.log("heks:", m.nodes.length, "nudos", m.elements.length, "barras"); }
await ev(() => document.getElementById("hk-test-cursor")?.remove()); await cinta("3D"); await espera(800); await foto("iso");
console.log("errores de página:", errs.length ? errs : "ninguno"); ok("sin errores de página", errs.length, "0", errs.length === 0);
const malas = filas.filter((f) => !f.ok); console.log(`\n${filas.length - malas.length}/${filas.length} comprobaciones OK`);
fs.writeFileSync(`cli/shots/cercha_${TIPO}_resultado.json`, JSON.stringify({ filas, uzMax, Nmax }, null, 1));
await nav.close(); process.exit(malas.length ? 1 : 0);
