// Sonda: qué llevan los menús «▶ Análisis ▾» y «📐 Diseño ▾» del DEPLOY PÚBLICO (19-sep-2026).
import puppeteer from "puppeteer";
import { mkdirSync } from "fs";
const URL0 = process.argv[2] || "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=plantillas";
const OUT = "cli/shots/_sonda_deploy"; mkdirSync(OUT, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
await pag.goto(URL0, { waitUntil: "networkidle2", timeout: 180000 });
await new Promise((r) => setTimeout(r, 7000));
for (const id of ["hk-analisis-btn", "hk-diseno-btn"]) {
  const antes = await pag.evaluate(() => document.querySelectorAll("body *").length);
  await pag.evaluate((id) => document.getElementById(id)?.click(), id);
  await new Promise((r) => setTimeout(r, 1200));
  const items = await pag.evaluate((id) => {
    const b = document.getElementById(id); const rb = b.getBoundingClientRect();
    // lo que apareció debajo del botón: elementos visibles cuyo borde superior está bajo el botón y cerca en x
    const vis = [...document.querySelectorAll("button, a, li, [role=menuitem], div")].filter((e) => {
      const r = e.getBoundingClientRect(); if (r.width < 40 || r.height < 14 || r.height > 60) return false;
      if (r.top < rb.bottom - 2 || r.top > rb.bottom + 420) return false;
      if (r.left > rb.left + 380 || r.right < rb.left - 20) return false;
      if (e.closest(".tp-rotv") || e.closest("#hk-ribbon")) return false;
      const t = (e.innerText || "").trim(); return t && t.length < 120 && e.children.length <= 3;
    });
    const out = []; const vistos = new Set();
    for (const e of vis) { const t = (e.innerText || "").trim().replace(/\s+/g, " "); if (vistos.has(t)) continue; vistos.add(t); out.push({ t, title: (e.title || "").slice(0, 140), id: e.id || "", dis: e.disabled === true || /disabled|proxim|desarrollo/i.test(e.className + " " + t + " " + (e.title || "")) }); }
    return out;
  }, id);
  console.log(`\n== ${id} (${antes} → ${await pag.evaluate(() => document.querySelectorAll("body *").length)} elementos): ${items.length} entradas`);
  for (const it of items) console.log(JSON.stringify(it));
  await pag.screenshot({ path: `${OUT}/menu_${id}.png` });
  await pag.keyboard.press("Escape"); await pag.mouse.click(640, 400); await new Promise((r) => setTimeout(r, 500));
}
await nav.close();
