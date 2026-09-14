// ¿Qué enseña «Ver diagrama en 2D» con la cercha? (Jorge: en el vídeo solo se ve el colormap)
import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
await pag.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 5000));
const w = (ms) => new Promise((r) => setTimeout(r, ms));
await pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); } catch (e) {} });
for (const id of ["hk-settings-toggle", "hk-pane-toggle"]) { try { await pag.click("#" + id); await w(300); } catch (e) {} }
await pag.evaluate(() => {
  const inf = [-6, -4, -2, 0, 2, 4, 6].map((x) => [x, 0, 0]), sup = [-5, -3, -1, 1, 3, 5].map((x) => [x, 0, 2]);
  const P = [...inf, ...sup]; window.__hekatanDrawingPoints.val = P;
  const zig = []; for (let i = 0; i < 6; i++) zig.push(i, 7 + i); zig.push(6);
  window.__hekatanDrawingPolylines.val = [[0, 1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12], zig];
  window.__hekatanManualSupports.set(0, [true, true, true, true, true, true]); window.__hekatanManualSupports.set(6, [true, true, true, true, true, true]);
  for (let i = 7; i < 13; i++) window.__hekatanManualLoads.set(i, [0, 0, -10, 0, 0, 0]);
  window.__hekatanRebuild?.();
});
await w(1500);
await pag.evaluate(() => { const s = window.__hekatanSettings?.(); if (s) s.frameResults.val = "contour:normals"; });
await w(600);
await pag.evaluate(() => window.__hekatanDiagrama2D?.({ plano: "XZ", en: 0 })); await w(1500);
await pag.screenshot({ path: "cli/shots/_diagrama2d.png" });
await pag.evaluate(() => { const s = window.__hekatanSettings?.(); if (s) s.frameResults.val = "contour:bendingsZ"; }); await w(800);
await pag.screenshot({ path: "cli/shots/_diagrama2d_m3.png" });
console.log("ventana:", await pag.evaluate(() => [...document.querySelectorAll("div")].filter((d) => /Axial|Diagrama/.test(d.textContent || "") && d.id).map((d) => d.id).slice(0, 5)));
await nav.close();
