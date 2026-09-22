import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1600, height: 900 });
const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
await p.goto(process.argv[2], { waitUntil: "networkidle2", timeout: 90000 });
await new Promise((r) => setTimeout(r, 9000));
const info = await p.evaluate(() => {
  const r = (id) => { const e = document.getElementById(id); if (!e) return null;
    const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.right), Math.round(b.top), Math.round(b.bottom)]; };
  const solapa = (a, c) => a && c && a[0] < c[1] && c[0] < a[1] && a[2] < c[3] && c[2] < a[3];
  const g = r("hk-grabar-btn"), n = r("hk-caja-negra-btn"), ag = r("hk-agente-lanzador");
  return { grabar: g, caja: n, agente: ag,
           texto: document.getElementById("hk-grabar-btn")?.textContent,
           pisa_caja: solapa(g, n), pisa_agente: solapa(g, ag) };
});
console.log(JSON.stringify(info));
console.log("errores:", errs.slice(0, 3));
await p.screenshot({ path: process.argv[3] });
await b.close();
