import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [w, h] of [[1920, 1080], [1366, 768]]) {
  await pag.setViewport({ width: w, height: h });
  await pag.goto("https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-frame-nec", { waitUntil: "networkidle2", timeout: 180000 });
  await espera(8000);
  await pag.screenshot({ path: `cli/shots/abajo_${w}.png` });
  await pag.screenshot({ path: `cli/shots/abajo_${w}_zona.png`, clip: { x: 0, y: h - 260, width: w, height: 260 } });
  console.log(w, JSON.stringify(await pag.evaluate(() => ["#hk3-cmdline", "#hk3-cmd-hist", "#hk-cad-est", "#hk-pane-host", "#settings", "#legend"].map((s) => {
    const e = document.querySelector(s); if (!e) return s + ": no"; const r = e.getBoundingClientRect(); return s + ` ${Math.round(r.left)},${Math.round(r.top)} → ${Math.round(r.right)},${Math.round(r.bottom)}`;
  }))));
}
await nav.close();
