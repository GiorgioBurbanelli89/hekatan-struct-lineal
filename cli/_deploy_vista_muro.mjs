import puppeteer from "puppeteer";
const id = process.argv[2] ?? "test-m-dual"; const campo = process.argv[3] ?? "vonMises";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 1000 });
await p.goto(`https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 8000));
const process_flip_v = (process.argv[4] ?? "1") === "1"; const r = await p.evaluate((campo, process_flip) => {
  const s = window.__hekatanSettings?.(); if (s?.shellResults) s.shellResults.val = campo;
  const ctx = [...document.querySelectorAll("div")].map(d => d.__ctx).find(Boolean);
  const c = ctx.camera.position; const d = Math.hypot(c.x, c.y, c.z);
  if (process_flip) { ctx.camera.position.set(-c.x, -c.y, c.z); } ctx.controls?.update?.(); ctx.render?.();
  return { campo: s?.shellResults?.val, cam: [ctx.camera.position.x, ctx.camera.position.y, ctx.camera.position.z].map(v => +v.toFixed(1)) };
}, campo, process_flip_v);
await new Promise((r) => setTimeout(r, 2500));
await p.screenshot({ path: `cli/shots/deploy/_muro_${id}_${campo}.png` });
console.log(JSON.stringify(r)); await nav.close();
