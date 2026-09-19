// PNG de varias plantillas del build servido (o del deploy): node cli/_foto_ids.mjs <base> <carpeta> id1 id2 ...
import puppeteer from "puppeteer";
import fs from "node:fs";
const [base, dir, ...ids] = process.argv.slice(2);
fs.mkdirSync(dir, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const id of ids) {
  const p = await nav.newPage(); await p.setViewport({ width: 1280, height: 720 });
  const e = []; p.on("pageerror", (x) => e.push(String(x)));
  await p.goto(`${base}?t=${id}`, { waitUntil: "networkidle2", timeout: 120000 });
  await new Promise((r) => setTimeout(r, 4000));
  const st = await p.evaluate(() => ({ ex: window.__hekatanExample?.(), n: window.__hekatanStates?.nodes?.val?.length, err: window.__hekatanCliErrors?.length }));
  await p.screenshot({ path: `${dir}/${id}.png` });
  console.log(id, JSON.stringify(st), "pageerrors", e.length, e.slice(0, 1));
  await p.close();
}
await nav.close();
