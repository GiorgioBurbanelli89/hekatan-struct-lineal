// Promediado de esfuerzos de cáscara (todos / por plano / ninguno) sobre el muro con contrafuertes. node cli/_promediado_check.mjs <base> <dirPNG> [campo]
import puppeteer from "puppeteer";
const [BASE, DIR, CAMPO = "membraneYY"] = process.argv.slice(2);
const P = Buffer.from(JSON.stringify({ modelo: 1, cf: 1, L: 3, sCf: 1.5, ms: 0.15 })).toString("base64");
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const err = []; pag.on("pageerror", (e) => err.push(String(e)));
await pag.goto(`${BASE}/workspace/?t=muro-manabi&p=${P}`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 7000));
for (const modo of ["todos", "objeto", "ninguno"]) {
  const r = await pag.evaluate((modo, campo) => {
    window.__hekatanSettings().shellResults.val = campo; window.__hekatanPromediado.val = modo;
    return new Promise((ok) => setTimeout(() => {
      const leg = document.querySelector("#legend")?.innerText?.replace(/\s+/g, " ").slice(0, 120);
      ok(leg);
    }, 1500));
  }, modo, CAMPO);
  console.log(modo, "| leyenda:", r);
  await pag.screenshot({ path: `${DIR}/prom_${modo}.png` });
}
console.log("errores", err.length, err.slice(0, 3));
await nav.close();
