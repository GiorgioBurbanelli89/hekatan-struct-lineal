import puppeteer from "puppeteer";
const id = "edificio-dual", campo = "vonMises";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 1000 });
await p.goto(`https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 8000));
for (const [nom, fn] of [["base", "s.shellResults.val = 'vonMises'"], ["sinDeformada", "s.deformedShape.val = false"], ["sinAreas", "s.elements.val = false"], ["conAreas_sinDef", "s.elements.val = true; s.deformedShape.val = false"]]) {
  const r = await p.evaluate((fn) => { const s = window.__hekatanSettings?.(); eval(fn); const ctx = [...document.querySelectorAll("div")].map(d => d.__ctx).find(Boolean); ctx.render?.(); return { deform: s.deformedShape.val, elements: s.elements.val, shell: s.shellResults.val, keys: Object.keys(s).filter(k => /elem|shell|area|deform/i.test(k)).join(",") }; }, fn);
  await new Promise((r) => setTimeout(r, 1500)); await p.screenshot({ path: `cli/shots/deploy/_var_${nom}.png` }); console.log(nom, JSON.stringify(r));
}
await nav.close();
