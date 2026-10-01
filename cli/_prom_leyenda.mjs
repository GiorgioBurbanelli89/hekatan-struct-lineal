// Leyenda de Struct (min/max real) para un campo con los 3 modos de promediado. node cli/_prom_leyenda.mjs <base> <campo> <png-prefijo>
import puppeteer from "puppeteer";
const [BASE, CAMPO, PNG] = process.argv.slice(2);
const URL = `${BASE}/workspace/?t=muro-manabi&p=` + Buffer.from(JSON.stringify({ modelo: 1, cf: 1, L: 3, sCf: 1.5, ms: 0.15 })).toString("base64");
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 7000));
await pag.evaluate(() => { const p = window.__hekatanHoverPrefs; for (const k in p) p[k].val = false; });
for (const modo of ["ninguno", "todos", "objeto"]) {
  const r = await pag.evaluate((modo, campo) => new Promise((ok) => {
    window.__hekatanSettings().shellResults.val = campo; window.__hekatanPromediado.val = modo;
    const sel = [...document.querySelectorAll(".tp-lblv")].find((x) => x.querySelector(".tp-lblv_l")?.innerText?.includes("Rango colormap"))?.querySelector("select");
    if (sel) { sel.value = "todas, min/max real"; sel.dispatchEvent(new Event("change", { bubbles: true })); }
    setTimeout(() => ok(document.querySelector("#legend")?.innerText?.replace(/\s+/g, " ")), 1500);
  }), modo, CAMPO);
  console.log(modo, "|", r);
  await pag.screenshot({ path: `${PNG}_${modo}.png` });
}
await nav.close();
