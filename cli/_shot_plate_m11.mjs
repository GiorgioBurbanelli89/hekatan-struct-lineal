// Captura plate-thick 6x4 (parametros de la captura de Jorge, 22-sep-2026) con M11: ¿campo centrado y barra al pico?
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage(); await p.setViewport({ width: 1400, height: 850 });
const errs = []; p.on("pageerror", e => errs.push(String(e)));
await p.goto("http://localhost:4600/workspace/?t=plate-thick&Lx=6&Ly=4&t=0.1&E=35000000&nu=0.15&q=10&nx=6&ny=4", { waitUntil: "networkidle2", timeout: 120000 });
await new Promise(r => setTimeout(r, 5000));
await p.evaluate(() => { Object.assign(window.__hekatanParams(), { Lx: 6, Ly: 4, t: 0.1, E: 35e6, nu: 0.15, q: 10, nx: 6, ny: 4 }); window.__hekatanRebuild(); });
await new Promise(r => setTimeout(r, 3000));
await p.evaluate(() => { const s = window.__hekatanSettings?.(); if (s) { s.shellResults.val = "bendingXX"; s.deformedShape && (s.deformedShape.val = false); } });
await new Promise(r => setTimeout(r, 2500));
const leyenda = await p.evaluate(() => document.querySelector("#legend")?.innerText?.replace(/\s+/g, " ").slice(0, 200));
await p.screenshot({ path: process.argv[2] || (process.env.TEMP + "/plate_m11.png") });
console.log("leyenda:", leyenda, "| errores:", errs.length);
await b.close();
