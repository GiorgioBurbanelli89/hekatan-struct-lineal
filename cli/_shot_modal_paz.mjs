import puppeteer from "puppeteer";
const BASE = process.argv[2], OUT = process.argv[3], ids = process.argv.slice(4);
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
for (const ex of ids) {
  const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 900 });
  const logs = []; pag.on("console", (m) => logs.push(m.text()));
  await pag.goto(`${BASE}/workspace/?t=${ex}`, { waitUntil: "networkidle2", timeout: 120000 });
  await new Promise((r) => setTimeout(r, 5000));
  const ok = await pag.evaluate(() => { for (const b of document.querySelectorAll("button")) if (b.textContent.includes("Correr modal")) { b.click(); return true; } return false; });
  await new Promise((r) => setTimeout(r, 6000));
  const txt = await pag.evaluate(() => [...document.querySelectorAll("*")].filter(e => e.children.length === 0 && /Hz|T\s*=|periodo|Periodo/.test(e.textContent)).map(e => e.textContent.trim()).slice(0, 30));
  await pag.screenshot({ path: `${OUT}/${ex}_modal.png` });
  console.log(ex, ok, JSON.stringify(txt), "\nLOG:", logs.filter(l => /Paz|modal|Modal|Hz|f1|ω/.test(l)).slice(0, 12).join("\n"));
  await pag.close();
}
await nav.close();
