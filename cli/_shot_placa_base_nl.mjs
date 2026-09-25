// Captura LOCAL del ejemplo dev-only placa-base-nolineal: vM Hekatan, vM Abaqus, PEEQ.
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage(); await p.setViewport({ width: 1400, height: 850 });
const errs = []; p.on("pageerror", e => errs.push(String(e).slice(0, 160)));
await p.goto("http://localhost:4600/workspace/?t=placa-base-nolineal", { waitUntil: "networkidle2", timeout: 120000 });
await new Promise(r => setTimeout(r, 6000));
for (const [c, v, nom] of [[0, 0, "vmH_todo"], [0, 1, "vmH_placa"], [1, 1, "vmA_placa"], [2, 1, "peeq_placa"]]) {
  await p.evaluate((c, v) => { Object.assign(window.__hekatanParams(), { campo: c, ver: v }); window.__hekatanRebuild(); }, c, v);
  await new Promise(r => setTimeout(r, 2500));
  await p.screenshot({ path: `${process.env.TEMP}/pbnl_${nom}.png` });
}
console.log("ejemplo:", await p.evaluate(() => window.__hekatanExample?.()), "| errores:", errs.length, errs.join(" || "));
await b.close();
