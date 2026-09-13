// Prueba «Área desde cara del IFC» con ratón simulado sobre el dev server (4600).
import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 160)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
await pag.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 }); await espera(2500);
await pag.evaluate(async () => { try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo", "0"); window.__hekatanRibbonPlegar?.(true); } catch (e) {} const M = await fetch("/ifc_church.json").then((r) => r.json()); window.__hekatanIfcMesh = M; window.__hekatanRebuild?.(); });
await espera(1500);
for (const id of ["hk-settings-toggle", "hk-pane-toggle"]) { try { await pag.click("#" + id); await espera(500); } catch (e) {} }
// cámara: iso mirando la pared oeste (x = 13.2) desde fuera
await pag.evaluate(() => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; c.camera.position.set(-10, 105, 12); c.camera.up.set(0, 0, 1); c.controls.target.set(16, 124, 4); c.camera.lookAt(16, 124, 4); c.controls.update(); c.render(); });
await espera(300);
const proj = (P) => pag.evaluate((P) => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; const r = h.querySelector("canvas").getBoundingClientRect(); const V = Object.getPrototypeOf(c.camera.position).constructor; return P.map(([x, y, z]) => { const v = new V(x, y, z).project(c.camera); return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top }; }); }, P);
await pag.evaluate(() => window.__hekatanCadState.setTool("ifcface"));
const objetivos = [[13.17, 122, 2.5], [13.17, 118, 1.5], [19.7, 116, 6.5]];   // pared oeste ×2, bóveda
const px = await proj(objetivos);
for (let i = 0; i < objetivos.length; i++) {
  await pag.mouse.move(px[i].x, px[i].y); await espera(400);
  const c = await pag.evaluate(() => window.__hekatanCaraIfc?.());
  console.log("objetivo", JSON.stringify(objetivos[i]), "px", Math.round(px[i].x), Math.round(px[i].y), "→ cara:", JSON.stringify(c));
  if (i === 0) { await pag.screenshot({ path: "cli/shots/cara_1_hover.png" }); await pag.mouse.click(px[i].x, px[i].y); await espera(800);
    console.log("estado:", await pag.evaluate(() => document.getElementById("hk-cad-status")?.textContent || window.__hekatanCadStatusText));
    console.log("áreas:", await pag.evaluate(() => (window.__hekatanDrawingAreas?.rawVal || []).length), "nudos:", await pag.evaluate(() => (window.__hekatanDrawingPoints?.rawVal || []).length));
    await pag.screenshot({ path: "cli/shots/cara_2_area.png" }); }
  if (i === 2) await pag.screenshot({ path: "cli/shots/cara_3_boveda.png" });
}
// modo «solo bordes»
await pag.evaluate(() => { const P = window.__hekatanParams?.(); if (P) { P.refModo = 2; } window.__hekatanRebuild?.(); }); await espera(1500);
await pag.mouse.move(400, 300); await espera(300);
await pag.screenshot({ path: "cli/shots/cara_4_solo_bordes.png" });
console.log("errs:", errs);
await nav.close();
