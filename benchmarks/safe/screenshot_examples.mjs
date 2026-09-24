// Screenshots de los 6 ejemplos workspace para verificar colormap
import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "fs";

const BASE = "https://giorgioburbanelli89.github.io/hekatan-struct/workspace/";
const OUT_DIR = "./screenshots";
mkdirSync(OUT_DIR, { recursive: true });

const examples = [
  { id: "zapata-aislada-validacion", label: "1-zapata-aislada" },
  { id: "safe-bench-losa-cimentacion", label: "2-losa" },
  { id: "safe-bench-zapata-combinada", label: "3-combinada" },
  { id: "safe-bench-zapata-conectada", label: "4-conectada" },
  { id: "safe-bench-viga-cimentacion", label: "5-viga" },
  { id: "safe-bench-zapata-comparativa", label: "6-comparativa" },
];

const browser = await puppeteer.launch({ headless: "new" });

for (const ex of examples) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  const url = `${BASE}?t=${ex.id}`;
  console.log(`→ ${ex.label}: ${url}`);
  try {
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
    // Esperar a que el viewer cargue (WASM + Three.js + auto-fit)
    await new Promise(r => setTimeout(r, 8000));
    const path = `${OUT_DIR}/${ex.label}.png`;
    await page.screenshot({ path, fullPage: false });
    console.log(`  saved ${path}`);
  } catch (e) {
    console.error(`  ERROR ${ex.label}: ${e.message}`);
  }
  await page.close();
}

await browser.close();
console.log("Done");
