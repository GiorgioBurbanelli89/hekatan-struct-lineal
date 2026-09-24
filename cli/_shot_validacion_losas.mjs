import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage(); await p.setViewport({ width: 1400, height: 850 });
const errs = []; p.on("pageerror", e => errs.push(String(e))); p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
for (const c of [4]) {
  await p.goto(`http://localhost:4600/workspace/?t=validacion-losas-csi&caso=${c}`, { waitUntil: "networkidle2", timeout: 120000 });
  await new Promise(r => setTimeout(r, 6000));
  await p.screenshot({ path: process.env.TEMP + `/val_caso${c}.png` });
  console.log("caso", c, "leyenda:", await p.evaluate(() => document.querySelector("#legend")?.innerText?.replace(/s+/g, " ").slice(0, 60)));
}
console.log("errores:", errs.length, errs.slice(0, 5).join(" | "));
await b.close();
