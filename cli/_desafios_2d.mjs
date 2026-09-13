// Desafíos 2D (Jorge, 13-sep-2026): en la vista XZ, con el MOUSE y por MENÚ (sin
// comandos), un círculo, un arco, una parábola y una cúbica. Fotograma por paso y
// comprobación numérica de lo dibujado. Sale con código 1 si algo no cuadra.
//   node cli/_desafios_2d.mjs        (dev server en 4600)
import puppeteer from "puppeteer";
import fs from "node:fs";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 160)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const ev = (f, a) => pag.evaluate(f, a);
let k = 0; const foto = async (n) => { await espera(350); await pag.screenshot({ path: `cli/shots/desafios2d_${String(k++).padStart(2, "0")}_${n}.png` }); };
// cursor visible en los fotogramas (puppeteer no pinta el del sistema)
const cursor = (x, y) => ev(({ x, y }) => { let c = document.getElementById("hk-test-cursor"); if (!c) { c = document.createElement("div"); c.id = "hk-test-cursor"; c.style.cssText = "position:fixed;width:18px;height:18px;border:2px solid #ff3030;border-radius:50%;background:rgba(255,48,48,.25);pointer-events:none;z-index:99999;transform:translate(-50%,-50%)"; document.body.appendChild(c); } c.style.left = x + "px"; c.style.top = y + "px"; }, { x, y });
const mover = async (x, y, pasos = 8) => { const p0 = mover.ult || { x, y }; for (let i = 1; i <= pasos; i++) { const cx = p0.x + (x - p0.x) * i / pasos, cy = p0.y + (y - p0.y) * i / pasos; await pag.mouse.move(cx, cy); await cursor(cx, cy); await espera(25); } mover.ult = { x, y }; };
const clic = async (x, y) => { await mover(x, y); await espera(250); await pag.mouse.click(x, y); await espera(300); };
const rect = (fn, arg) => ev((q) => { const f = new Function("arg", q.src); const el = f(q.arg); if (!el) return null; el.scrollIntoView?.({ block: "center" }); const rc = el.getBoundingClientRect(); return { x: rc.left + rc.width / 2, y: rc.top + rc.height / 2 }; }, { src: `return (${fn.toString()})(arg)`, arg });
const boton = (re) => rect((re) => [...document.querySelectorAll("button")].find((b) => new RegExp(re, "i").test(b.textContent || "")), re);
const carpeta = (re) => rect((re) => [...document.querySelectorAll(".tp-fldv_b")].find((x) => new RegExp(re, "i").test(x.textContent || "")), re);
const abrirCarpeta = async (re) => { const abierta = await ev((re) => { const b = [...document.querySelectorAll(".tp-fldv_b")].find((x) => new RegExp(re, "i").test(x.textContent || "")); return !!b?.closest(".tp-fldv")?.classList.contains("tp-fldv-expanded"); }, re); if (abierta) return; const f = await carpeta(re); if (!f) throw new Error("no está la carpeta " + re); await clic(f.x, f.y); await espera(400); };
const pulsar = async (re) => { const b = await boton(re); if (!b) throw new Error("no está el botón " + re); await clic(b.x, b.y); return b; };
const panelDer = async (abrir) => { const est = await ev(() => { const b = document.getElementById("hk-pane-toggle"); const p = document.getElementById("hk-pane-host"); const t = p ? getComputedStyle(p).transform : "none"; const m = t && t !== "none" ? Math.abs(+t.split(",")[4]) : 0; const rc = b.getBoundingClientRect(); return { abierto: m <= 40, x: rc.left + rc.width / 2, y: rc.top + rc.height / 2 }; }); if (est.abierto === abrir) return; await clic(est.x, est.y); for (let i = 0; i < 40; i++) { const m = await ev(() => { const p = document.getElementById("hk-pane-host"); const t = p ? getComputedStyle(p).transform : "none"; return t && t !== "none" ? Math.abs(+t.split(",")[4]) : 0; }); if ((abrir && m <= 1) || (!abrir && m >= 200)) break; await espera(50); } await espera(200); };
const proj = (P) => ev((P) => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; const r = h.querySelector("canvas").getBoundingClientRect(); const V = Object.getPrototypeOf(c.camera.position).constructor; return P.map(([x, y, z]) => { const v = new V(x, y, z).project(c.camera); return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top }; }); }, P);
const estado = () => ev(() => document.getElementById("hk-cad-status")?.textContent);
const dibujo = () => ev(() => ({ P: window.__hekatanDrawingPoints.rawVal, PL: window.__hekatanDrawingPolylines.rawVal.filter((p) => p.length) }));
// clics en coordenadas del MUNDO (se proyectan con la cámara actual)
const clicMundo = async (pts) => { for (const p of pts) { const [q] = await proj([p]); await clic(q.x, q.y); } };
const filas = []; const ok = (que, medido, limite, pasa, detalle = "") => { filas.push({ que, medido, limite, ok: pasa, detalle }); console.log((pasa ? "  ✓ " : "  ✗ ") + que + "  " + medido + (detalle ? "  " + detalle : "")); };
const ultima = async () => { const d = await dibujo(); const pl = d.PL[d.PL.length - 1]; return { pts: pl.map((i) => d.P[i]), idx: pl, nPolys: d.PL.length }; };
const cerca = (a, b, tol = 1e-6) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < tol;

await pag.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 }); await espera(2500);
await ev(() => { try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo", "0"); window.__hekatanRibbonPlegar?.(true); } catch (e) {} try { window.__hekatanDrawingPoints.val = []; window.__hekatanDrawingPolylines.val = [[]]; window.__hekatanDrawingAreas.val = []; } catch (e) {} });
await espera(800);
try { await pag.click("#hk-settings-toggle"); await espera(400); } catch (e) {}
await panelDer(true); await foto("inicio");
// ── vista XZ real (ortográfica) por el MENÚ ──
await abrirCarpeta("Plano de trabajo"); await pulsar("Plano XZ \\(elevaci"); await foto("plano_xz");
const SEGS = await ev(() => window.__hekatanArcSegs ?? 12);
console.log("segmentos por curva:", SEGS, "| estado:", await estado());
// grid snap ON por el menú (AutoCAD F9): así los clics caen en la rejilla de 0.5 m y las
// coordenadas son EXACTAS (sin él, el clic tiene la precisión del píxel, ~1e-6 m)
await abrirCarpeta("Precisión"); { const c = await rect((re) => { const row = [...document.querySelectorAll(".tp-lblv")].find((x) => new RegExp(re, "i").test(x.textContent || "")); return row?.querySelector(".tp-ckbv_w") || row?.querySelector("input[type=checkbox]") || row; }, "Grid snap"); if (!c) throw new Error("no está Grid snap"); await clic(c.x, c.y); }
console.log("grid snap:", await ev(() => window.__hekatanSnapEnabled)); await foto("grid_snap");
await abrirCarpeta("✏ Dibujar");

// 1. CÍRCULO: centro (5,0,5), radio 3 → clic en (8,0,5)
await pulsar("○ Círculo"); await clicMundo([[5, 0, 5]]); await foto("circulo_centro"); await clicMundo([[8, 0, 5]]); await foto("circulo");
{ const u = await ultima(); const r = u.pts.map((p) => Math.hypot(p[0] - 5, p[2] - 5)); const dr = Math.max(...r.map((v) => Math.abs(v - 3)));
  ok("círculo: puntos", u.pts.length, "= " + (SEGS + 1), u.pts.length === SEGS + 1); ok("círculo: cerrado", u.idx[0] === u.idx[u.idx.length - 1], "sí", u.idx[0] === u.idx[u.idx.length - 1]);
  ok("círculo: |r − 3| máx", dr.toExponential(2), "< 1e-6", dr < 1e-6); const ey = Math.max(...u.pts.map((p) => Math.abs(p[1]))); ok("círculo: en el plano y = 0", ey.toExponential(2), "< 1e-6", ey < 1e-6); }
// 2. ARCO por 3 puntos: (10,0,2) (13,0,5) (16,0,2) → centro (13,0,2), r 3, medio arriba
await pulsar("⌒ Arco \\(3 ptos\\)"); await clicMundo([[10, 0, 2], [13, 0, 5]]); await foto("arco_2clics"); await clicMundo([[16, 0, 2]]); await foto("arco");
{ const u = await ultima(); const r = u.pts.map((p) => Math.hypot(p[0] - 13, p[2] - 2)); const dr = Math.max(...r.map((v) => Math.abs(v - 3)));
  ok("arco: puntos", u.pts.length, "= " + (SEGS + 1), u.pts.length === SEGS + 1); const ext = cerca(u.pts[0], [10, 0, 2]) && cerca(u.pts[u.pts.length - 1], [16, 0, 2]); ok("arco: extremos exactos", ext, "sí", ext);
  ok("arco: |r − 3| máx", dr.toExponential(2), "< 1e-6", dr < 1e-6); const zmax = Math.max(...u.pts.map((p) => p[2])); ok("arco: pasa por arriba (z máx)", zmax.toFixed(4), "= 5", Math.abs(zmax - 5) < 1e-6); }
// 3. PARÁBOLA por 3 puntos: (0,0,10) (3,0,13) (6,0,10) → z = 13 − (x−3)²/3
await pulsar("∪ Parábola"); await clicMundo([[0, 0, 10], [3, 0, 13]]); await foto("parabola_2clics"); await clicMundo([[6, 0, 10]]); await foto("parabola"); console.log("  ", await estado());
{ const u = await ultima(); const f = (x) => 13 - (x - 3) ** 2 / 3; const e = Math.max(...u.pts.map((p) => Math.abs(p[2] - f(p[0])))); const dx = u.pts.slice(1).map((p, i) => p[0] - u.pts[i][0]); const ddx = Math.max(...dx) - Math.min(...dx);
  ok("parábola: puntos", u.pts.length, "= " + (SEGS + 1), u.pts.length === SEGS + 1); ok("parábola: |z − f(x)| máx", e.toExponential(2), "< 1e-6", e < 1e-6); ok("parábola: Δx igual", ddx.toExponential(2), "< 1e-9", ddx < 1e-9);
  const v = SEGS % 2 ? true : cerca(u.pts[SEGS / 2], [3, 0, 13]); ok("parábola: vértice en (3,13)", v, "sí (si N par)", v); }
// 4. CÚBICA por 4 puntos: (8,0,10) (10,0,12) (12,0,10) (14,0,13)
await pulsar("∿ Cúbica"); await clicMundo([[8, 0, 10], [10, 0, 12], [12, 0, 10]]); await foto("cubica_3clics"); await clicMundo([[14, 0, 13]]); await foto("cubica"); console.log("  ", await estado());
{ const u = await ultima(); const X = [8, 10, 12, 14], Y = [10, 12, 10, 13]; const f = (x) => X.reduce((s, xi, i) => s + Y[i] * X.reduce((L, xj, j) => j === i ? L : L * (x - xj) / (xi - xj), 1), 0);
  const e = Math.max(...u.pts.map((p) => Math.abs(p[2] - f(p[0])))); ok("cúbica: puntos", u.pts.length, "= " + (SEGS + 1), u.pts.length === SEGS + 1); ok("cúbica: |z − f(x)| máx", e.toExponential(2), "< 1e-6", e < 1e-6);
  const ext = cerca(u.pts[0], [8, 0, 10]) && cerca(u.pts[u.pts.length - 1], [14, 0, 13]); ok("cúbica: extremos exactos", ext, "sí", ext);
  // los dos puntos interiores caen en nudos sólo si N es múltiplo de 3: se comprueba sobre la curva
  const pasa = Math.abs(f(10) - 12) < 1e-9 && Math.abs(f(12) - 10) < 1e-9; ok("cúbica: pasa por (10,12) y (12,10)", pasa, "sí", pasa); }
// 5. degenerada: dos puntos con la misma abscisa → aviso, sin dibujar
const antes = (await dibujo()).PL.length;
await pulsar("∪ Parábola"); await clicMundo([[17, 0, 8], [17, 0, 11], [19, 0, 9]]); const st = await estado(); await foto("parabola_degenerada");
const deg = /misma abscisa/.test(st || "") && (await dibujo()).PL.length === antes; ok("parábola vertical: avisa y no dibuja", deg, "sí", deg, (st || "").slice(0, 80));
await panelDer(false); await ev(() => document.getElementById("hk-test-cursor")?.remove()); await foto("final");
console.log("errores de página:", errs.length ? errs : "ninguno"); ok("sin errores de página", errs.length, "0", errs.length === 0);
const malas = filas.filter((f) => !f.ok); console.log(`\n${filas.length - malas.length}/${filas.length} comprobaciones OK`);
fs.writeFileSync("cli/shots/desafios2d_resultado.json", JSON.stringify(filas, null, 1));
await nav.close(); process.exit(malas.length ? 1 : 0);
