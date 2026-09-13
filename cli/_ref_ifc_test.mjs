// Prueba de la REFERENCIA IFC en el lienzo: IFC de la capilla de fondo, corte en
// elevación → perfil de sección (naranja) → la mirilla engancha al perfil.
// Uso: node cli/_ref_ifc_test.mjs   → cli/shots/ref_ifc_*.png + consola
import { createServer } from "http"; import { readFileSync, existsSync, statSync } from "fs";
import { fileURLToPath } from "url"; import { dirname, join, extname } from "path"; import puppeteer from "puppeteer";
const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "/hekatan-struct-lineal/"; const raiz = join(__dirname, "..", "website", "src", "examples");
const IFC = "C:/Users/j-b-j/AppData/Local/Temp/claude/C--Users-j-b-j-Documents-Hekatan-Calc-1-0-0/e516dcfc-010a-4ffa-88ae-abcdf213b18c/scratchpad/ifc_church.json";
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };
const srv = createServer((q, s) => { let p = decodeURIComponent((q.url || "/").split("?")[0]); if (p.startsWith(BASE)) p = p.slice(BASE.length - 1); if (p === "/ifc_church.json") { s.writeHead(200, { "content-type": "application/json" }); return s.end(readFileSync(IFC)); } let f = join(raiz, p); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html"); if (!existsSync(f)) { s.writeHead(404); return s.end("404"); } s.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); s.end(readFileSync(f)); });
const PORT = 4824; await new Promise((r) => srv.listen(PORT, r));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 160)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
await pag.goto(`http://localhost:${PORT}${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(2000);
await pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo", "0"); } catch (e) {} try { window.__hekatanRibbonPlegar?.(true); } catch (e) {} });
for (const id of ["hk-settings-toggle", "hk-pane-toggle"]) { try { await pag.click("#" + id); await espera(500); } catch (e) {} }
await pag.evaluate(async (base) => { const M = await fetch(base + "ifc_church.json").then((r) => r.json()); window.__hekatanIfcMesh = M; window.__hekatanRebuild?.(); }, BASE);
await espera(1500);
const vista = (p, t) => pag.evaluate(({ p, t }) => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; c.camera.position.set(...p); c.camera.up.set(0, 0, 1); c.controls.target.set(...t); c.camera.lookAt(...t); c.controls.update(); c.render(); }, { p, t });
const corte = (eje, pos, inv) => pag.evaluate(({ eje, pos, inv }) => { const c = window.__hekatanClip; c["enable" + eje] = pos != null; if (pos != null) { c["pos" + eje] = pos; c["invert" + eje] = !!inv; } window.__hekatanClipApply?.(); }, { eje, pos, inv });
const foto = async (n) => { await espera(400); await pag.screenshot({ path: `cli/shots/ref_ifc_${n}.png` }); };
const proj = (P) => pag.evaluate((P) => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; const r = h.querySelector("canvas").getBoundingClientRect(); return P.map(([x, y, z]) => { const v = new (Object.getPrototypeOf(c.camera.position).constructor)(x, y, z).project(c.camera); return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top }; }); }, P);
// Alzado frontal mirando +Y, corte Y = 125 (queda lo de Y ≥ 125)
await vista([19.7, 85, 6], [19.7, 126, 6]); await corte("Y", 125, true); await espera(300);
await pag.mouse.move(640, 300); await espera(200);   // dispara el cálculo del perfil
const nSeg = await pag.evaluate(() => window.__hekatanSeccionIfc?.());
console.log("segmentos del perfil de sección:", nSeg);
await foto("1_corteY125_perfil");
const pts = await pag.evaluate(() => window.__hekatanSeccionIfcPuntos?.(40) || []);
const px = await proj(pts);
await pag.evaluate(() => { window.__hekatanCadState?.setTool?.("node"); });
const lee = () => pag.evaluate(() => { const e = document.getElementById("hk-osnap-etiqueta"); return e && e.style.display !== "none" ? e.textContent : ""; });
let ok = 0; const etiqs = {};
for (let i = 0; i < pts.length; i++) {
  const s = px[i]; if (!s || s.x < 40 || s.x > 1240 || s.y < 60 || s.y > 600) continue;
  await pag.mouse.move(s.x + 2, s.y - 1); await espera(60); const e = await lee(); etiqs[e] = (etiqs[e] || 0) + 1;
  if (/Sección/.test(e) && ok < 10) { await pag.mouse.click(s.x + 2, s.y - 1); await espera(60); ok++; }
}
console.log("etiquetas vistas:", JSON.stringify(etiqs));
const nudos = await pag.evaluate(() => (window.__hekatanDrawingPoints?.rawVal || []).map((p) => p.map((v) => +v.toFixed(3))));
console.log("nudos creados:", nudos.length, JSON.stringify(nudos.slice(0, 10)));
console.log("Y de los nudos (debe ser 125.000):", [...new Set(nudos.map((p) => p[1]))].join(", "));
await pag.keyboard.press("Escape"); await foto("2_nudos_en_seccion");
// Lateral: corte X = 19.7 (eje de la nave) → perfil longitudinal con el entrepiso
await corte("Y", null); await corte("X", 19.7, true); await vista([-20, 126, 6], [19.7, 126, 6]); await pag.mouse.move(640, 300); await espera(300);
console.log("segmentos perfil X=19.7:", await pag.evaluate(() => window.__hekatanSeccionIfc?.()));
await foto("3_corteX_perfil");
console.log("errs:", errs);
await nav.close(); srv.close();
