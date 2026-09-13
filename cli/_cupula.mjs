// Cúpula en Hekatan Struct, con el MOUSE y por MENÚ (Jorge, 13-sep-2026: «una cúpula,
// cómo la hace en Hekatan Struct»): alzado XZ → arco meridiano (3 clics) → seleccionar el
// arco (ventana) → «Revolución» → clic en el eje. Fotograma por paso, comprobación numérica
// (todos los nudos sobre la esfera) y exportación a .heks para el careo con ETABS.
//   node cli/_cupula.mjs        (dev server en 4600)
import puppeteer from "puppeteer";
import fs from "node:fs";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 160)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const ev = (f, a) => pag.evaluate(f, a);
let k = 0; const foto = async (n) => { await espera(350); await pag.screenshot({ path: `cli/shots/cupula_${String(k++).padStart(2, "0")}_${n}.png` }); };
const cursor = (x, y) => ev(({ x, y }) => { let c = document.getElementById("hk-test-cursor"); if (!c) { c = document.createElement("div"); c.id = "hk-test-cursor"; c.style.cssText = "position:fixed;width:18px;height:18px;border:2px solid #ff3030;border-radius:50%;background:rgba(255,48,48,.25);pointer-events:none;z-index:99999;transform:translate(-50%,-50%)"; document.body.appendChild(c); } c.style.left = x + "px"; c.style.top = y + "px"; }, { x, y });
const mover = async (x, y, pasos = 8) => { const p0 = mover.ult || { x, y }; for (let i = 1; i <= pasos; i++) { const cx = p0.x + (x - p0.x) * i / pasos, cy = p0.y + (y - p0.y) * i / pasos; await pag.mouse.move(cx, cy); await cursor(cx, cy); await espera(25); } mover.ult = { x, y }; };
const clic = async (x, y) => { await mover(x, y); await espera(250); await pag.mouse.click(x, y); await espera(300); };
const rect = (fn, arg) => ev((q) => { const f = new Function("arg", q.src); const el = f(q.arg); if (!el) return null; el.scrollIntoView?.({ block: "center" }); const rc = el.getBoundingClientRect(); return { x: rc.left + rc.width / 2, y: rc.top + rc.height / 2 }; }, { src: `return (${fn.toString()})(arg)`, arg });
const boton = (re) => rect((re) => [...document.querySelectorAll("button")].find((b) => new RegExp(re, "i").test(b.textContent || "")), re);
const carpeta = (re) => rect((re) => [...document.querySelectorAll(".tp-fldv_b")].find((x) => new RegExp(re, "i").test(x.textContent || "")), re);
const abrirCarpeta = async (re) => { const abierta = await ev((re) => { const b = [...document.querySelectorAll(".tp-fldv_b")].find((x) => new RegExp(re, "i").test(x.textContent || "")); return !!b?.closest(".tp-fldv")?.classList.contains("tp-fldv-expanded"); }, re); if (abierta) return; const f = await carpeta(re); if (!f) throw new Error("no está la carpeta " + re); await clic(f.x, f.y); await espera(400); };
const pulsar = async (re) => { const b = await boton(re); if (!b) throw new Error("no está el botón " + re); await clic(b.x, b.y); return b; };
const control = (re, que) => rect(({ re, que }) => { const row = [...document.querySelectorAll(".tp-lblv")].find((x) => new RegExp(re, "i").test(x.textContent || "")); if (!row) return null; if (que === "check") return row.querySelector(".tp-ckbv_w") || row.querySelector("input[type=checkbox]") || row; return row.querySelector("input[type=text]") || row.querySelector("input") || row; }, { re, que });
const escribir = async (re, valor) => { const c = await control(re, "texto"); if (!c) throw new Error("no está el control " + re); await clic(c.x, c.y); await pag.keyboard.down("Control"); await pag.keyboard.press("a"); await pag.keyboard.up("Control"); await pag.keyboard.type(String(valor), { delay: 40 }); await pag.keyboard.press("Enter"); await espera(300); };
const panelDer = async (abrir) => { const est = await ev(() => { const b = document.getElementById("hk-pane-toggle"); const p = document.getElementById("hk-pane-host"); const t = p ? getComputedStyle(p).transform : "none"; const m = t && t !== "none" ? Math.abs(+t.split(",")[4]) : 0; const rc = b.getBoundingClientRect(); return { abierto: m <= 40, x: rc.left + rc.width / 2, y: rc.top + rc.height / 2 }; }); if (est.abierto === abrir) return; await clic(est.x, est.y); for (let i = 0; i < 40; i++) { const m = await ev(() => { const p = document.getElementById("hk-pane-host"); const t = p ? getComputedStyle(p).transform : "none"; return t && t !== "none" ? Math.abs(+t.split(",")[4]) : 0; }); if ((abrir && m <= 1) || (!abrir && m >= 200)) break; await espera(50); } await espera(200); };
const proj = (P) => ev((P) => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; const r = h.querySelector("canvas").getBoundingClientRect(); const V = Object.getPrototypeOf(c.camera.position).constructor; return P.map(([x, y, z]) => { const v = new V(x, y, z).project(c.camera); return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top }; }); }, P);
const estado = () => ev(() => document.getElementById("hk-cad-status")?.textContent);
const dibujo = () => ev(() => ({ P: window.__hekatanDrawingPoints.rawVal, PL: window.__hekatanDrawingPolylines.rawVal.filter((p) => p.length), A: window.__hekatanDrawingAreas.rawVal }));
const clicMundo = async (pts) => { for (const p of pts) { const [q] = await proj([p]); await clic(q.x, q.y); } };
const filas = []; const ok = (que, medido, limite, pasa, detalle = "") => { filas.push({ que, medido, limite, ok: pasa, detalle }); console.log((pasa ? "  ✓ " : "  ✗ ") + que + "  " + medido + (detalle ? "  " + detalle : "")); };

await pag.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 }); await espera(2500);
await ev(() => { try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo", "0"); window.__hekatanRibbonPlegar?.(true); } catch (e) {} try { window.__hekatanDrawingPoints.val = []; window.__hekatanDrawingPolylines.val = [[]]; window.__hekatanDrawingAreas.val = []; } catch (e) {} });
await espera(800);
try { await pag.click("#hk-settings-toggle"); await espera(400); } catch (e) {}
await panelDer(true);
// 1. alzado XZ + grid snap, por el menú
await abrirCarpeta("Plano de trabajo"); await pulsar("Plano XZ \\(elevaci");
await abrirCarpeta("Precisión"); { const c = await control("Grid snap", "check"); await clic(c.x, c.y); }
await abrirCarpeta("Modos de dibujo"); await escribir("Segmentos arc", 8); const SEGS = await ev(() => window.__hekatanArcSegs);
// curvas como GUÍA AUXILIAR (cian): el meridiano no es estructura; la Revolución lo borra al terminar
{ const c = await control("Curvas como gu", "check"); await clic(c.x, c.y); } console.log("curvas aux:", await ev(() => window.__hekatanCurvasAux)); await foto("guia_aux_on");
console.log("segmentos del arco:", SEGS, "| grid snap:", await ev(() => window.__hekatanSnapEnabled)); await foto("alzado_xz");
// 2. el meridiano: arco por (5,0,0) (3,0,4) (0,0,5) → círculo de radio 5 centrado en el origen (3²+4²=5²)
await abrirCarpeta("✏ Dibujar"); await pulsar("⌒ Arco \\(3 ptos\\)"); await clicMundo([[5, 0, 0], [3, 0, 4]]); await foto("arco_2clics"); await clicMundo([[0, 0, 5]]); await foto("meridiano");
const auxLineas = () => ev(() => (window.__hekatanDrawingAuxLines?.rawVal ?? []));
{ const L = await auxLineas(); const e = Math.max(...L.flatMap((l) => [Math.hypot(l[0], l[2]) - 5, Math.hypot(l[3], l[5]) - 5]).map(Math.abs)); ok("meridiano: líneas auxiliares", L.length, "= " + SEGS, L.length === SEGS); ok("meridiano: |r − 5| máx", e.toExponential(2), "< 1e-9", e < 1e-9); ok("meridiano: sin barras ni nudos (es guía)", (await dibujo()).P.length, "0", (await dibujo()).P.length === 0); }
// acotar: la regla mide el radio entre el centro y el arranque (enganche a los extremos de la auxiliar)
await abrirCarpeta("✏ Dibujar"); await pulsar("Medir / acotar"); await clicMundo([[0, 0, 0], [5, 0, 0]]); await foto("regla_radio");
{ const t = await ev(() => document.getElementById("hk-measure-label")?.textContent); ok("regla: radio medido", t, "5.000 m", /^5\.000 m$/.test(t || "")); }
// 3. seleccionar el arco con una VENTANA (arrastre con el tool Seleccionar)
await abrirCarpeta("Modificar").catch(() => {}); let bSel = await boton("Seleccionar"); if (!bSel) { await abrirCarpeta("Acciones de selecci"); bSel = await boton("Seleccionar"); }
if (bSel) await clic(bSel.x, bSel.y); else await ev(() => window.__hekatanCadState.setTool("select"));
// (la ventana es CLIC-CLIC como en AutoCAD: un clic marca la esquina, otro la cierra; arrastrar orbita)
{ const [a, b] = await proj([[-0.6, 0, 5.6], [5.6, 0, -0.6]]); await clic(a.x, a.y); await mover(b.x, b.y, 10); await espera(200); await foto("ventana_seleccion"); await clic(b.x, b.y); await espera(400); }
const nSel = await ev(() => [...(window.__hekatanSelection ?? [])].filter((i) => i.startsWith("aux:")).length); ok("selección: líneas auxiliares del arco", nSel, "= " + SEGS, nSel === SEGS); await foto("arco_seleccionado");
// 4. Revolución: 16 sectores, 1 clic en el eje (x = 0, en el alzado)
await abrirCarpeta("Áreas \\(shells\\)"); await escribir("Sectores \\(revoluci", 16); await pulsar("Revolución de la selecci"); await foto("boton_revolucion");
await clicMundo([[0, 0, 2]]); console.log("  ", await estado()); await foto("cupula_alzado");
// 5. vista isométrica por el menú
await abrirCarpeta("Plano de trabajo"); await pulsar("Vista isom"); await ev(() => { const s = window.__hekatanSettings?.(); if (s?.extruded) s.extruded.val = true; }); await espera(600); await foto("cupula_iso");
{ const d = await dibujo(); const nudos = new Set(); for (const a of d.A) for (const i of d.PL[a]) nudos.add(i);
  const e = Math.max(...[...nudos].map((i) => Math.abs(Math.hypot(...d.P[i]) - 5)));
  const esperadoA = (SEGS - 1) * 16 + 8, esperadoN = SEGS * 16 + 1;
  ok("cúpula: paños Q4", d.A.length, "= " + esperadoA, d.A.length === esperadoA); ok("cúpula: nudos de paño", nudos.size, "= " + esperadoN, nudos.size === esperadoN);
  ok("cúpula: |R − 5| máx en todos los nudos", e.toExponential(2), "< 1e-9", e < 1e-9);
  const degen = d.A.filter((a) => new Set(d.PL[a].slice(0, 4)).size < 4).length; ok("cúpula: Q4 colapsados", degen, "0", degen === 0);
  const dup = d.P.length - new Set(d.P.map((p) => p.map((v) => Math.round(v * 1e4)).join(","))).size; ok("cúpula: nudos duplicados", dup, "0", dup === 0);
  const auxQuedan = (await auxLineas()).length; ok("cúpula: guías auxiliares borradas", auxQuedan, "0 quedan", auxQuedan === 0);
  const barras = d.PL.filter((pl, k) => !d.A.includes(k) && pl.length >= 2).length; ok("cúpula: sin barras sueltas", barras, "0", barras === 0);
  ok("cúpula: todos los nudos son de paño", d.P.length, "= " + nudos.size, d.P.length === nudos.size);
  // .heks para ETABS: t 0.10, E 25e6, ρ 2.4; base (z = 0) empotrada; peso propio
  const L = ["selfweight 1"]; const ids = [...nudos].sort((u, v) => u - v); const idDe = new Map(ids.map((i, j) => [i, j + 1]));
  for (const i of ids) L.push(`node ${idDe.get(i)} ${d.P[i].map((v) => +v.toFixed(6)).join(" ")}`);
  d.A.forEach((a, j) => L.push(`shell ${j + 1} ${d.PL[a].slice(0, 4).map((i) => idDe.get(i)).join(" ")} 0.10 25e6 0 2.4`));
  let nAp = 0; for (const i of ids) if (Math.abs(d.P[i][2]) < 1e-6) { L.push(`support ${idDe.get(i)} 1 1 1 1 1 1`); nAp++; }
  L.push("solve"); fs.writeFileSync("cli/shots/cupula.heks", L.join("\n") + "\n"); console.log("heks: nudos", ids.length, "paños", d.A.length, "apoyos", nAp); }
await panelDer(false); await ev(() => document.getElementById("hk-test-cursor")?.remove()); await foto("final");
console.log("errores de página:", errs.length ? errs : "ninguno"); ok("sin errores de página", errs.length, "0", errs.length === 0);
const malas = filas.filter((f) => !f.ok); console.log(`\n${filas.length - malas.length}/${filas.length} comprobaciones OK`);
fs.writeFileSync("cli/shots/cupula_resultado.json", JSON.stringify(filas, null, 1));
await nav.close(); process.exit(malas.length ? 1 : 0);
