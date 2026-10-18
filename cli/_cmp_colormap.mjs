import puppeteer from "puppeteer";
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const [id, campo, out] = process.argv.slice(2);
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const [nom, base] of [["deploy", "https://giorgioburbanelli89.github.io/hekatan-struct-lineal"], ["local", "http://localhost:4600"]]) {
  const pag = await nav.newPage(); await pag.setViewport({ width: 1100, height: 800 });
  await pag.goto(`${base}/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 180000 }); await espera(6000);
  await pag.evaluate(async (campo) => {
    for (const s of ["#hk-revit", "#parameters", "#settings", "#hk-pane-host", "#hk-ribbon", "#hk-revit-toggle", "#hk-ribbon-guia"]) document.querySelectorAll(s).forEach((e) => e.style.display = "none");
    const s = window.__hekatanSettings(); s.shellResults.val = campo; await new Promise((r) => setTimeout(r, 600));
    window.__hekatanSetView("plan"); await new Promise((r) => setTimeout(r, 900));
  }, campo);
  await pag.screenshot({ path: `${out}_${nom}.png` }); await pag.close();
}
await nav.close();
