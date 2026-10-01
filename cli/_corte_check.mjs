// «✂ Cortes X/Y/Z» sobre el muro: solo pantalla / solo zapata. node cli/_corte_check.mjs <base> <dir>
import puppeteer from "puppeteer";
const [BASE, DIR] = process.argv.slice(2);
const URL = `${BASE}/workspace/?t=muro-manabi&p=` + Buffer.from(JSON.stringify({ modelo: 1, L: 1, ms: 0.1, cf: 0, caso: 0, lat: 0, apoyos: 1 })).toString("base64");
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 7000));
await pag.evaluate(() => { window.__hekatanSettings().shellResults.val = "bendingYY"; });
for (const [nom, inv] of [["pantalla", false], ["zapata", true]]) {
  await pag.evaluate((inv) => { const c = window.__hekatanClip; c.enableZ = true; c.posZ = 0.25; c.invertZ = inv; window.__hekatanClipApply(); }, inv);
  await new Promise((r) => setTimeout(r, 1200)); await pag.screenshot({ path: `${DIR}/corte_${nom}.png` });
}
await nav.close();
