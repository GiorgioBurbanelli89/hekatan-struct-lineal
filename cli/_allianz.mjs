// La cáscara del Allianz Arena en Hekatan Struct, con el MOUSE y por MENÚ (Jorge, 13-sep-2026:
// «la parte de afuera, esa cáscara, ¿puedes implementarla?»). A escala 1:10 (el chaflán del
// menú llega a 5 m): planta = rectángulo redondeado 26 × 24 (Losa con chaflanes, r 5) ;
// alzado XZ = la panza (parábola por 3 puntos, 1 m de vuelo a media altura, 4 m de alto);
// «Barrido en alzado» con 1 clic en el centro → la piel en paños Q4.
//   node cli/_allianz.mjs        (dev server en 4600)
import puppeteer from "puppeteer";
import fs from "node:fs";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 160)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const ev = (f, a) => pag.evaluate(f, a);
let k = 0; const foto = async (n) => { await espera(350); await pag.screenshot({ path: `cli/shots/allianz_${String(k++).padStart(2, "0")}_${n}.png` }); };
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
// 1. PLANTA: grid snap, chaflán 5 m, 4 segmentos por chaflán, Losa con chaflanes por 2 esquinas
await abrirCarpeta("Plano de trabajo"); await pulsar("Plano XY \\(planta\\)");
await abrirCarpeta("Precisión"); { const c = await control("Grid snap", "check"); await clic(c.x, c.y); }
await abrirCarpeta("Modos de dibujo"); await escribir("Segmentos arc", 4); await escribir("Chaflán r", 5);
console.log("grid snap:", await ev(() => window.__hekatanSnapEnabled), "| chaflán r:", await ev(() => window.__hekatanChaflanR), "| segs:", await ev(() => window.__hekatanArcSegs));
await abrirCarpeta("Áreas \\(shells\\)"); await pulsar("Losa con chaflanes"); await clicMundo([[-13, -12, 0]]); await foto("planta_esquina1"); await clicMundo([[13, 12, 0]]); console.log("  ", await estado()); await foto("planta_contorno");
let nC = 0;
{ const d = await dibujo(); const pl = d.PL[d.PL.length - 1]; nC = pl.length - 1; const cerrada = pl[0] === pl[pl.length - 1]; const z0 = Math.max(...pl.map((i) => Math.abs(d.P[i][2])));
  ok("contorno: polilínea cerrada", cerrada, "sí", cerrada); ok("contorno: lados", nC, "= 4 lados × 6 + 4 chaflanes × 4 = 40", nC === 40); ok("contorno: en z = 0", z0.toExponential(1), "0", z0 < 1e-9);
  const xM = Math.max(...pl.map((i) => d.P[i][0])), yM = Math.max(...pl.map((i) => d.P[i][1])); ok("contorno: 26 × 24", `${2 * xM} × ${2 * yM}`, "26 × 24", Math.abs(xM - 13) < 1e-9 && Math.abs(yM - 12) < 1e-9); }
// 2. ALZADO XZ: la panza, parábola por (16,0,0) (17,0,2) (16,0,4); 12 tramos. Se dibuja FUERA del contorno
// (x 16, no 13): en el alzado todos los vértices del contorno con la misma x se proyectan en el mismo píxel y
// el osnap engancharía a uno con y ≠ 0. El barrido mide la panza RELATIVA (r_k − r_0), así que da igual dónde esté.
await abrirCarpeta("Plano de trabajo"); await pulsar("Plano XZ \\(elevaci"); await abrirCarpeta("Modos de dibujo"); await escribir("Segmentos arc", 12);
await abrirCarpeta("✏ Dibujar"); await pulsar("∪ Parábola"); await clicMundo([[16, 0, 0], [17, 0, 2]]); await foto("alzado_2clics"); await clicMundo([[16, 0, 4]]); console.log("  ", await estado()); await foto("alzado_perfil");
const SEGS = 12;
{ const d = await dibujo(); const pl = d.PL[d.PL.length - 1]; const f = (z) => 17 - (z - 2) ** 2 / 4; const e = Math.max(...pl.map((i) => Math.abs(d.P[i][0] - f(d.P[i][2]))));
  ok("perfil: puntos", pl.length, "= 13", pl.length === SEGS + 1); ok("perfil: |x − f(z)| máx", e.toExponential(2), "< 1e-9", e < 1e-9); }
// 3. seleccionar contorno + perfil con UNA ventana (clic-clic) en el alzado
await abrirCarpeta("Modificar"); await pulsar("🖱 Seleccionar");
{ const [a, b] = await proj([[-14, 0, 4.6], [18, 0, -0.6]]); await clic(a.x, a.y); await mover(b.x, b.y, 10); await espera(200); await foto("ventana"); await clic(b.x, b.y); await espera(400); }
{ const sel = await ev(() => [...(window.__hekatanSelection ?? [])]); const polysSel = new Set(sel.filter((i) => i.startsWith("poly:") || i.startsWith("seg:")).map((i) => +i.split(":")[1])); ok("selección: contorno y perfil (2 polilíneas)", polysSel.size, "= 2", polysSel.size === 2, sel.length + " ids"); }
// 4. Barrido en alzado: 1 clic en el centro de la planta
await abrirCarpeta("Áreas \\(shells\\)"); await pulsar("Barrido en alzado"); await foto("boton_barrido"); await clicMundo([[0, 0, 2]]); const st = await estado(); console.log("  ", st); await foto("piel_alzado");
// 5. iso
await abrirCarpeta("Plano de trabajo"); await pulsar("Vista isom"); await ev(() => { const s = window.__hekatanSettings?.(); if (s?.extruded) s.extruded.val = true; }); await espera(600); await foto("piel_iso");
await ev(() => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; c.camera.position.set(30, -34, 16); c.camera.up.set(0, 0, 1); c.controls.target.set(0, 0, 2); c.camera.lookAt(0, 0, 2); c.controls.update(); c.render(); }); await espera(400); await foto("piel_iso_2");
{ const d = await dibujo(); const nudos = new Set(); for (const a of d.A) for (const i of d.PL[a].slice(0, 4)) nudos.add(i);
  ok("piel: paños Q4", d.A.length, "= " + nC + " × " + SEGS + " = " + nC * SEGS, d.A.length === nC * SEGS);
  const degen = d.A.filter((a) => new Set(d.PL[a].slice(0, 4)).size < 4).length; ok("piel: Q4 colapsados", degen, "0", degen === 0);
  const dup = d.P.length - new Set(d.P.map((p) => p.map((v) => Math.round(v * 1e4)).join(","))).size; ok("piel: nudos duplicados", dup, "0", dup === 0);
  // anillo a anillo: x máx = 13 + d(z), con d(z) = f(z) − 13 (la panza del perfil)
  const f = (z) => 17 - (z - 2) ** 2 / 4 - 3; /* x máx del anillo = 13 + (perfil − 16) */ const porZ = new Map(); for (const i of nudos) { const z = d.P[i][2]; porZ.set(z, Math.max(porZ.get(z) ?? -1e9, d.P[i][0])); }   // z exacta: todos los nudos del anillo la copian del perfil
  const eR = Math.max(...[...porZ].map(([z, xM]) => Math.abs(xM - f(z)))); ok("piel: anillos", porZ.size, "= 13", porZ.size === SEGS + 1); ok("piel: |x máx − f(z)| por anillo", eR.toExponential(2), "< 1e-9", eR < 1e-9);
  const yM = Math.max(...[...nudos].map((i) => d.P[i][1])); ok("piel: y máx (panza también en el lado largo)", yM.toFixed(6), "= 13", Math.abs(yM - 13) < 1e-6);
  // .heks: t 0.10, E 25e6, ρ 2.4; base (z = 0) empotrada; peso propio → careo con ETABS
  const L = ["selfweight 1"]; const ids = [...nudos].sort((u, v) => u - v); const idDe = new Map(ids.map((i, j) => [i, j + 1]));
  for (const i of ids) L.push(`node ${idDe.get(i)} ${d.P[i].map((v) => +v.toFixed(6)).join(" ")}`);
  d.A.forEach((a, j) => L.push(`shell ${j + 1} ${d.PL[a].slice(0, 4).map((i) => idDe.get(i)).join(" ")} 0.10 25e6 0 2.4`));
  let nAp = 0; for (const i of ids) if (Math.abs(d.P[i][2]) < 1e-6) { L.push(`support ${idDe.get(i)} 1 1 1 1 1 1`); nAp++; }
  L.push("solve"); fs.writeFileSync("cli/shots/allianz.heks", L.join("\n") + "\n"); console.log("heks: nudos", ids.length, "paños", d.A.length, "apoyos", nAp); }
await panelDer(false); await ev(() => document.getElementById("hk-test-cursor")?.remove()); await foto("final");
console.log("errores de página:", errs.length ? errs : "ninguno"); ok("sin errores de página", errs.length, "0", errs.length === 0);
const malas = filas.filter((f) => !f.ok); console.log(`\n${filas.length - malas.length}/${filas.length} comprobaciones OK`);
fs.writeFileSync("cli/shots/allianz_resultado.json", JSON.stringify(filas, null, 1));
await nav.close(); process.exit(malas.length ? 1 : 0);
