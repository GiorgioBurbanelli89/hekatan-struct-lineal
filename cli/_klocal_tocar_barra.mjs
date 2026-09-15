// Tocar una barra con el cursor → aparece «📐 Ver K local · barra N» → ventana con la K 12×12.
// Comprueba: chip visible tras el clic, ventana abierta, y K en pantalla = MATLAB R2017a
// (cli/shots/klocal/K_local_barra_1.csv, generado por _klocal_matlab_check.mjs para plantillas barra 1).
// Uso: node cli/_klocal_tocar_barra.mjs [url]  → cli/shots/klocal/tocar_*.png
import puppeteer from "puppeteer";
import fs from "node:fs";
const url = process.argv[2] || "http://localhost:4600/workspace/?t=plantillas";
const out = "cli/shots/klocal"; fs.mkdirSync(out, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 900 });
const esp = (ms) => new Promise((r) => setTimeout(r, ms));
const errores = []; pag.on("pageerror", (e) => errores.push(String(e).slice(0, 200)));
await pag.goto(url, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx && !!window.__hekatanKLocal, { timeout: 120000 });
await esp(5000);
await pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); } catch (e) {} });
await pag.keyboard.press("Escape"); await esp(300);
// punto medio de la barra 0 proyectado a pantalla
const pto = await pag.evaluate(() => {
  const h = document.querySelector("#viewer"); const c = h.__ctx; const cv = h.querySelector("canvas").getBoundingClientRect();
  const m = window.__hekatanMeshForTest || null;
  return { cv: { l: cv.left, t: cv.top, w: cv.width, h: cv.height } };
});
const idx = 0;
const mid = await pag.evaluate((idx) => {
  const h = document.querySelector("#viewer"); const c = h.__ctx; const r = h.querySelector("canvas").getBoundingClientRect();
  const V = Object.getPrototypeOf(c.camera.position).constructor;
  const S = window.__hekatanSettings?.() ?? null;
  // nudos/elementos: los expone el panel del diagrama a través de __hekatanKLocal? no → se leen del mesh del visor
  const mesh = window.__hekatanMallaK;
  const N = mesh?.nodes?.rawVal, E = mesh?.elements?.rawVal;
  if (!N || !E) return null;
  const a = N[E[idx][0]], b = N[E[idx][1]];
  const v = new V((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2).project(c.camera);
  return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top };
}, idx);
console.log("punto de la barra 1:", JSON.stringify(mid));
let chip;
if (mid) {
  await pag.mouse.move(mid.x - 4, mid.y - 3); await esp(200);
  await pag.mouse.move(mid.x, mid.y); await esp(400);
  await pag.mouse.click(mid.x, mid.y); await esp(800);
  chip = await pag.evaluate(() => { const v = document.getElementById("hk-klocal"); const t = v?.querySelector("b")?.textContent; return v ? { visible: !v.hidden, txt: t } : null; });
  console.log("ventana tras TOCAR la barra (sin otro clic):", JSON.stringify(chip));
}
await pag.screenshot({ path: `${out}/tocar_1_chip.png` });
// si el clic no cayó exacto en la barra, se designa por código para seguir comprobando la ventana
if (!chip || !chip.visible) {
  await pag.evaluate(() => window.dispatchEvent(new CustomEvent("hk:model-selection", { detail: { ultimo: { type: "frame", idx: 0 } } })));
  await esp(300);
  console.log("(el clic no designó la barra 1; se designa por evento para seguir)");
}
await esp(500);
await pag.screenshot({ path: `${out}/tocar_2_ventana.png` });
const K = await pag.evaluate(() => { const i = Number(document.getElementById("hk-klocal-chip").dataset.idx); return { idx: i, K: window.__hekatanKLocal(i).K, abierta: !document.getElementById("hk-klocal")?.hidden }; });
console.log("ventana K abierta:", K.abierta, "· barra", K.idx + 1);
const csv = `${out}/K_local_barra_1.csv`;
if (K.idx === 0 && fs.existsSync(csv)) {
  const M = fs.readFileSync(csv, "utf8").trim().split(/\r?\n/).map((l) => l.split(",").map(Number));
  let mx = 0, d = 0;
  for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) { mx = Math.max(mx, Math.abs(M[i][j])); d = Math.max(d, Math.abs(M[i][j] - K.K[i][j])); }
  console.log(`K en pantalla vs MATLAB R2017a (barra 1): dif máx relativa ${(d / mx).toExponential(2)}`);
}
console.log("pageerror:", errores.length, errores.slice(0, 2));
await nav.close();
