// Graba el galpon vibrando en sus modos 1, 2 y 3 — para el video del modal.
import puppeteer from "puppeteer";
import fs from "fs";
const [url, dir] = process.argv.slice(2);
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir, { recursive: true });
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1280, height: 720 });
await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 22000));
// fuera los paneles: que se vea solo la estructura
await p.evaluate(() => {
  for (const id of ["settings", "hk-pane-host", "modal-results", "hk-cad-tit",
                    "hk3-cmdline", "hk-cad-status", "hk-agente-lanzador",
                    "hk-caja-negra-btn", "hk-grabar-btn", "hk-gif-btn",
                    "hk-sec-btn", "hk-agente-explicar", "legend"]) {
    const e = document.getElementById(id); if (e) e.style.display = "none";
  }
  document.querySelectorAll(".tp-dfwv,#hk-pane-toggle").forEach((e) => (e.style.display = "none"));
});
await new Promise((r) => setTimeout(r, 1500));
let n = 0;
for (const modo of [1, 2, 3]) {
  await p.evaluate((m) => {
    window.__hekatanSetModalMode?.(m);
    window.__hekatanRunModalAnimate?.();
  }, modo);
  await new Promise((r) => setTimeout(r, 2500));
  for (let k = 0; k < 48; k++) {            // 4 s por modo a 12 fps
    await p.screenshot({ path: `${dir}/f${String(++n).padStart(5, "0")}.png` });
    await new Promise((r) => setTimeout(r, 83));
  }
  console.log("modo", modo, "->", n, "fotogramas");
}
await b.close();
