// Designa barras del modelo y pinta su seccion, para mirarla.
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1500, height: 950 });
const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
await p.goto(process.argv[2], { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 20000));
// tipos de seccion que hay en el modelo
const tipos = await p.evaluate(() => {
  const ei = window.__hekatanStates?.elementInputs?.val ?? {};
  const m = ei.sectionShapes;
  if (!m?.forEach) return null;
  const out = {};
  m.forEach((v, k) => { out[v.type] = out[v.type] ?? k; });
  return out;
});
console.log("tipos en el modelo:", JSON.stringify(tipos));
// designar una de cada tipo y pintar
const idxs = Object.values(tipos ?? {}).slice(0, 3);
for (const idx of idxs) {
  await p.evaluate((i) => {
    const sel = window.__hekatanModelSelection;
    if (sel) { sel.length = 0; sel.push({ type: "frame", idx: i }); }
    window.hkSeccion?.();
  }, idx);
  await new Promise((r) => setTimeout(r, 800));
  const info = await p.evaluate(() => {
    const c = document.getElementById("hk-seccion");
    return c ? { titulo: c.querySelector("b")?.textContent, perfil: c.querySelector("div div")?.textContent,
                 svg: !!c.querySelector("svg path") } : null;
  });
  console.log("idx", idx, "->", JSON.stringify(info));
  await p.screenshot({ path: `${process.argv[3]}_${idx}.png`, clip: { x: 0, y: 50, width: 320, height: 380 } });
}
console.log("errores:", errs.slice(0, 2));
await b.close();
