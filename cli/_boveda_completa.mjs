// Bóveda completa sobre el IFC, con fotograma por paso (dev server 4600).
import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 160)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let k = 0; const foto = async (n) => { await espera(400); await pag.screenshot({ path: `cli/shots/boveda_${String(k++).padStart(2, "0")}_${n}.png` }); };
const ev = (f, a) => pag.evaluate(f, a);
const proj = (P) => ev((P) => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; const r = h.querySelector("canvas").getBoundingClientRect(); const V = Object.getPrototypeOf(c.camera.position).constructor; return P.map(([x, y, z]) => { const v = new V(x, y, z).project(c.camera); return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top }; }); }, P);
const corte = (eje, pos, inv) => ev(({ eje, pos, inv }) => { const c = window.__hekatanClip; c.enableX = c.enableY = c.enableZ = false; if (eje) { c["enable" + eje] = true; c["pos" + eje] = pos; c["invert" + eje] = !!inv; } window.__hekatanClipApply?.(); }, { eje, pos, inv });
const rueda = async (x, y, n) => { await pag.mouse.move(x, y); for (let i = 0; i < n; i++) { await pag.mouse.wheel({ deltaY: -120 }); await espera(60); } };
const estado = () => ev(() => document.getElementById("hk-cad-status")?.textContent);
const cadena = () => ev(() => { const c = window.__hekatanCadenaIfc?.() || []; return { n: c.length, de: c[0]?.map((v) => +v.toFixed(2)), a: c[c.length - 1]?.map((v) => +v.toFixed(2)) }; });
await pag.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 }); await espera(2500);
await ev(async () => { try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo", "0"); window.__hekatanRibbonPlegar?.(true); } catch (e) {} try { window.__hekatanDrawingPoints.val = []; window.__hekatanDrawingPolylines.val = [[]]; window.__hekatanDrawingAreas.val = []; } catch (e) {} const M = await fetch("/ifc_church.json").then((r) => r.json()); window.__hekatanIfcMesh = M; window.__hekatanRebuild?.(); });
await espera(1500);
for (const id of ["hk-settings-toggle", "hk-pane-toggle"]) { try { await pag.click("#" + id); await espera(400); } catch (e) {} }
await ev(() => window.__hekatanSetView?.("iso")); await foto("iso_ifc");
// ── 1. corte X = 16.5, alzado lateral real, arco de la nave (cara superior = TOP) ──
await corte("X", 16.5, false); await ev(() => window.__hekatanSetView?.("elevY")); await espera(300);
let c = await proj([[16.5, 123.5, 4.5]]); await rueda(c[0].x, c[0].y, 7); await espera(300);
await ev(() => { window.__hekatanCadState.setTool("ifcline"); window.__hekatanArcSegs = 6; });
const P = await ev(() => window.__hekatanSeccionIfcPuntos?.(20000) || []);
const exterior = (y) => { const c = P.filter((p) => Math.abs(p[1] - y) < 0.4); c.sort((u, v) => v[2] - u[2]); return c[0]; };
const nave = exterior(121), ala = exterior(129.8);
let px = await proj([nave, ala]);
await pag.mouse.move(px[0].x, px[0].y - 3); await espera(400); console.log("nave:", JSON.stringify(await cadena())); await foto("nave_iluminada");
await pag.mouse.click(px[0].x, px[0].y - 3); await espera(600); console.log(await estado()); await foto("nave_copiada");
await ev(() => { window.__hekatanArcSegs = 5; });
await pag.mouse.move(px[1].x, px[1].y - 3); await espera(400); console.log("ala:", JSON.stringify(await cadena())); await foto("ala_iluminada");
await pag.mouse.click(px[1].x, px[1].y - 3); await espera(600); console.log(await estado()); await foto("ala_copiada");
// ── 2. extruir: hacia x = 13.2 (2 × −1.65) y hacia x = 26.1 (6 × 1.6) ──
const r1 = await ev(() => { window.__hekatanCadState.setTool("select"); window.__hekatanSelectAll?.(); const r = window.__hekatanExtrudeSelection?.(-1.65, 0, 0, 2); return r; });
const r2 = await ev(() => { window.__hekatanSelectAll?.(); const r = window.__hekatanExtrudeSelection?.(1.6, 0, 0, 6); window.__hekatanCadState.setTool(null); return r; });
console.log("extruido:", JSON.stringify(r1), JSON.stringify(r2), "áreas:", await ev(() => (window.__hekatanDrawingAreas?.rawVal || []).length));
await pag.keyboard.press("Escape"); await corte(null); await ev(() => window.__hekatanSetView?.("iso")); await foto("boveda_extruida_iso");
// ── 3. entrepiso desde su cara superior: corte Z ≤ 5.6 (quita la bóveda) y cámara desde arriba ──
// (sonda `cli/_sonda_entrepiso.mjs`: la cara superior del entrepiso está a z = 4.6, y ≈ 126.7, x 17–23)
await pag.keyboard.press("Escape"); await ev(() => window.__hekatanCadState.setTool(null));
await corte("Z", 5.6, false);
await ev(() => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; c.setActiveCamera(c.perspCamera); c.camera.position.set(20, 108, 30); c.camera.up.set(0, 0, 1); c.controls.target.set(20, 125, 3); c.camera.lookAt(20, 125, 3); c.controls.update(); c.render(); window.__hekatanCadState.setTool("ifcface"); });
await espera(300);
px = await proj([[20, 126.7, 4.6]]);
await pag.mouse.move(px[0].x, px[0].y); await espera(500); console.log("cara entrepiso:", JSON.stringify(await ev(() => window.__hekatanCaraIfc?.()))); await foto("entrepiso_iluminado");
await pag.mouse.click(px[0].x, px[0].y); await espera(800); console.log(await estado()); await foto("entrepiso_area");
// ── 4. final: sin corte, iso, extruido ──
await pag.keyboard.press("Escape"); await corte(null); await ev(() => { window.__hekatanCadState.setTool(null); window.__hekatanSetView?.("iso"); const s = window.__hekatanSettings?.(); if (s?.extruded) s.extruded.val = true; }); await espera(1200); await foto("final_extruido");
await ev(() => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; c.camera.position.set(-6, 98, 20); c.camera.up.set(0, 0, 1); c.controls.target.set(20, 124, 4); c.camera.lookAt(20, 124, 4); c.controls.update(); c.render(); }); await foto("final_extruido_2");
console.log("nudos:", await ev(() => (window.__hekatanDrawingPoints?.rawVal || []).length), "áreas:", await ev(() => (window.__hekatanDrawingAreas?.rawVal || []).length), "errs:", errs);
await nav.close();
