// SONDA: durante la animacion modal, ¿las barras salen CURVAS? Cuenta segmentos del wireframe
// y guarda un zoom (deviceScaleFactor 2) en el cuadro de mayor deriva.
import puppeteer from "puppeteer";
import fs from "fs";
const id = process.argv[2] ?? "edificio-aporticado";
const OUT = `cli/shots/anim_modal/${id}_curva`; fs.mkdirSync(OUT, { recursive: true });
const nav = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 });
const errs = []; p.on("pageerror", e => errs.push(e.message));
await p.goto(`http://localhost:4600/workspace/?t=${id}`, { waitUntil: "domcontentloaded", timeout: 180000 });
await p.waitForFunction(() => typeof window.__hekatanRunModalAnimate === "function", { timeout: 180000 });
await new Promise(r => setTimeout(r, 3000));
const medir = () => p.evaluate(() => {
  const v = document.querySelector("#viewer"); const ctx = v.__ctx; let segs = 0;
  ctx.scene.traverse(o => { if (o.isLineSegments && !o.name && o.material?.depthTest === false) segs = Math.max(segs, (o.geometry.getAttribute("position")?.count ?? 0) / 2); });
  const a = v.__settings?.__modoAnim;
  // flecha maxima de cada polilinea de 8 tramos respecto de su cuerda, relativa al largo
  let flecha = 0, curvas = 0, obj = null;
  ctx.scene.traverse(o => { if (o.isLineSegments && !o.name && o.material?.depthTest === false && (!obj || (o.geometry.getAttribute("position")?.count ?? 0) > (obj.geometry.getAttribute("position")?.count ?? 0))) obj = o; });
  const P = obj?.geometry.getAttribute("position")?.array ?? [];
  for (let b = 0; b + 48 <= P.length; b += 48) {   // 8 segmentos x 2 puntos x 3
    const A = [P[b], P[b+1], P[b+2]], B = [P[b+45], P[b+46], P[b+47]];
    const L = Math.hypot(B[0]-A[0], B[1]-A[1], B[2]-A[2]); if (L < 1e-9) continue;
    let m = 0;
    for (let k = 0; k < 16; k++) { const q = [P[b+3*k], P[b+3*k+1], P[b+3*k+2]];
      const t = ((q[0]-A[0])*(B[0]-A[0]) + (q[1]-A[1])*(B[1]-A[1]) + (q[2]-A[2])*(B[2]-A[2])) / (L*L);
      const d = Math.hypot(q[0]-A[0]-t*(B[0]-A[0]), q[1]-A[1]-t*(B[1]-A[1]), q[2]-A[2]-t*(B[2]-A[2])); if (d > m) m = d; }
    if (m / L > 1e-3) curvas++; flecha = Math.max(flecha, m / L);
  }
  return { segs, modoAnim: !!a, amp: a?.amp ?? null, barrasCurvas: curvas, flechaMaxRel: +flecha.toFixed(4) };
});
const sinModal = await medir();
await p.evaluate(() => window.__hekatanRunModalAnimate());
await p.waitForFunction(() => !!document.getElementById("modal-results")?.innerText?.includes("MODAL"), { timeout: 180000 }).catch(() => errs.push("sin tabla"));
await p.evaluate(() => { const t = document.getElementById("modal-results"); if (t) t.style.display = "none"; });
await new Promise(r => setTimeout(r, 1000));
let mejor = null;
for (let k = 0; k < 25; k++) {
  const m = await medir();
  if (!mejor || Math.abs(m.amp ?? 0) > Math.abs(mejor.amp ?? 0)) { mejor = m; await p.screenshot({ path: `${OUT}/pico.png`, clip: { x: 520, y: 330, width: 520, height: 420 } }); }
  await new Promise(r => setTimeout(r, 40));
}
await p.evaluate(() => window.__hekatanModalStop?.());
await new Promise(r => setTimeout(r, 800));
const alParar = await medir();
await p.screenshot({ path: `${OUT}/parado.png`, clip: { x: 520, y: 330, width: 520, height: 420 } });
console.log(JSON.stringify({ sinModal, animando: mejor, alParar, errs: errs.slice(0, 5) }));
await nav.close();
