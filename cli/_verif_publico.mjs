import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--use-angle=d3d11","--ignore-gpu-blocklist"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1500, height: 1000 });
const err = []; pag.on("pageerror", (e) => err.push(e.message));
await pag.goto("https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 8000));
console.log(JSON.stringify(await pag.evaluate(() => ({ snap: window.__hekatanSnapEnabled, orto: window.__hekatanOrthoMode, titulo: document.title, ribbon: !!document.getElementById("hk-ribbon"), menuDiseno: !!document.getElementById("hk-menus") }))));
await pag.keyboard.press("Escape"); await new Promise((r) => setTimeout(r, 500));
await pag.evaluate(() => window.__hekatanSetView("plan")); await new Promise((r) => setTimeout(r, 1200));
await pag.keyboard.type("l ", { delay: 40 });
const META = [[0,0],[0,4],[6,4],[6,0]], R = [[5,-4],[-6,5],[4,6],[-5,-5]];
for (let i = 0; i < 4; i++) {
  const [px, py] = await pag.evaluate((w) => { const c = window.__hekatanViewerCtx().camera, r = window.__hekatanViewerElm().getBoundingClientRect();
    const q = new c.position.constructor(w[0], w[1], 0).project(c); return [r.left + (q.x*.5+.5)*r.width, r.top + (-q.y*.5+.5)*r.height]; }, META[i]);
  await pag.mouse.move(px + R[i][0], py + R[i][1], { steps: 6 }); await new Promise((r) => setTimeout(r, 60));
  await pag.mouse.click(px + R[i][0], py + R[i][1]); await new Promise((r) => setTimeout(r, 500));
}
console.log(JSON.stringify(await pag.evaluate(() => (window.__hekatanDrawingPoints?.val ?? []).map((p) => Array.from(p).map((v) => +(+v).toFixed(3))))));
console.log("pageerrors:", err.length, err.slice(0, 2));
await pag.screenshot({ path: "cli/shots_bench/publico.png" });
await nav.close();
