// Captura el menú 📚 Fundamentos y la ficha th-modal / th-directa. Uso: node cli/_shot_fund_th.mjs <base> <carpeta>
import puppeteer from "puppeteer";
const [BASE, OUT] = process.argv.slice(2);
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 1000 });
const err = []; pag.on("pageerror", (e) => err.push(String(e)));
await pag.goto(`${BASE}/workspace/?t=plantillas`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 6000));
await pag.evaluate(() => document.getElementById("hk-fundamentos-btn")?.click());
await new Promise((r) => setTimeout(r, 800));
await pag.screenshot({ path: `${OUT}/fund_menu.png` });
for (const t of ["superposición modal", "integración directa"]) {
  const ok = await pag.evaluate((t) => { const e = [...document.querySelectorAll("button, div, li")].filter((x) => x.children.length <= 3 && x.textContent?.toLowerCase().includes(t)).pop(); e?.click(); return !!e; }, t);
  await new Promise((r) => setTimeout(r, 800));
  await pag.screenshot({ path: `${OUT}/fund_${t.split(" ")[0]}.png` });
  console.log(t, ok);
  await pag.evaluate(() => document.getElementById("hk-fundamentos-btn")?.click());
  await new Promise((r) => setTimeout(r, 600));
}
console.log("errores", err.length, err.slice(0, 3));
await nav.close();
