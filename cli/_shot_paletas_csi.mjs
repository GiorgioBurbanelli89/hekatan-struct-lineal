#!/usr/bin/env node
// Verificacion visual: 3 paletas CSI (SAFE/ETABS/SAP2000) en el radier real.
import puppeteer from "puppeteer";
import { mkdirSync } from "fs";
import { join } from "path";

const OUT = "C:/Users/j-b-j/Desktop/ENTREGA RADIER MOD_002/evidencia_paletas";
mkdirSync(OUT, { recursive: true });

const URL = "http://localhost:4600/workspace/index.html?heks=/_local/radier_corregido.heks";

const browser = await puppeteer.launch({
  headless: "new",
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 1000 });
const errs = [];
page.on("pageerror", (e) => errs.push("pageerror: " + e.message));
page.on("console", (m) => { if (m.type() === "error") errs.push("console.error: " + m.text()); });

console.log("Abriendo", URL);
await page.goto(URL, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 8000));

function poner(page, campo) {
  return page.evaluate((c) => {
    const s = window.__hekatanSettings?.();
    if (!s) return { err: "sin __hekatanSettings" };
    const set = (k, v) => { if (s[k] && "val" in s[k]) s[k].val = v; else s[k] = v; };
    set("shellResults", c);
    return { ok: true, shellResults: s.shellResults?.val };
  }, campo);
}

const CAMPOS = [
  ["pressure", "presion"],
  ["displacementZ", "uz"],
];
const PALETAS = [
  ["safe", "SAFE"],
  ["etabs", "ETABS"],
  ["sap2000", "SAP2000"],
];

if (!(await page.evaluate(() => !!window.__hekatanColorPalette))) {
  console.error("ABORTA: sin __hekatanColorPalette");
  await browser.close();
  process.exit(1);
}

const resumen = [];
for (const [campo, campoTag] of CAMPOS) {
  const info = await poner(page, campo);
  console.log("Campo", campo, info);
  if (info.err) { console.error("ABORTA:", info.err); await browser.close(); process.exit(1); }
  await new Promise((r) => setTimeout(r, 3000));

  for (const [key, label] of PALETAS) {
    await page.evaluate((k) => { window.__hekatanColorPalette.val = k; }, key);
    await new Promise((r) => setTimeout(r, 2500));

    const chequeo = await page.evaluate(() => {
      const l = document.getElementById("legend");
      if (!l) return { estado: "NO EXISTE" };
      const r = l.getBoundingClientRect();
      const nums = [...l.querySelectorAll("p")].map((p) => p.textContent.trim());
      const marks = l.querySelectorAll(".marker").length;
      const bg = getComputedStyle(l).backgroundImage;
      return {
        estado: r.width > 0 ? "visible" : "oculta",
        nMarkers: marks,
        valores: nums,
        bgLen: bg.length,
        paletaActiva: window.__hekatanColorPalette.val,
      };
    });
    console.log(campoTag, label, chequeo);

    const file = join(OUT, `paleta_${key}_${campoTag}.png`);
    await page.screenshot({ path: file });
    resumen.push({ campo: campoTag, label, key, file, chequeo });
  }
}

console.log("Errores JS:", errs.length ? errs.slice(0, 20) : "ninguno");
await browser.close();
console.log(JSON.stringify(resumen, null, 2));
