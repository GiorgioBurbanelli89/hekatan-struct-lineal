// Pulsa «Menu» con un modelo abierto y comprueba que NO queden puntos sueltos.
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1500, height: 900 });
await p.goto(process.argv[2], { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 18000));
const antes = await p.evaluate(() => ({
  orden: Array.from(document.querySelectorAll("#hk-cad-tit button")).map((e) => (e.textContent || "").trim()).filter(Boolean),
}));
console.log("orden:", JSON.stringify(antes.orden.slice(6, 12)));
await p.evaluate(() => document.getElementById("hk-home-btn")?.click());
await new Promise((r) => setTimeout(r, 4000));
const despues = await p.evaluate(() => ({
  url: location.search,
  nodos: (window.__hekatanStates?.nodes?.val ?? []).length,
  elems: (window.__hekatanStates?.elements?.val ?? []).length,
}));
console.log("tras pulsar Menu:", JSON.stringify(despues));
await p.screenshot({ path: process.argv[3] });
await b.close();
