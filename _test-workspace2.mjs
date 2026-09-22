import puppeteer from "puppeteer";

const URL = "http://localhost:4600/workspace2/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 800 });

const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto(URL, { waitUntil: "networkidle2", timeout: 30000 });
await page.waitForSelector("#hk2-bar", { timeout: 15000 });
await page.waitForSelector("canvas", { timeout: 15000 });
await sleep(2800); // init del viewer (__ctx/camera)

const statusText = () => page.$eval("#hk2-bar span", (s) => s.textContent);
const before = await statusText();

// ¿viewer con __ctx/camera listo?
const ctxReady = await page.evaluate(() => {
  let el = null;
  document.querySelectorAll("*").forEach((e) => { if (e.__ctx) el = e; });
  return { hasCtx: !!el, camera: !!(el && el.__ctx && el.__ctx.camera), sceneChildren: el?.__ctx?.scene?.children?.length ?? null };
});

const box = await page.$eval("canvas", (c) => { const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
const click = async (fx, fy) => { await page.mouse.click(box.x + box.w * fx, box.y + box.h * fy); await sleep(250); };

// MODO NODO (default): 3 clics → 3 nodos
await click(0.42, 0.52);
await click(0.58, 0.52);
await click(0.58, 0.40);
const afterNodes = await statusText();

// MODO LÍNEA: clic en 2 nodos → 1 barra
const btns = await page.$$("#hk2-bar button");
await btns[1].click(); // ／ Línea
await sleep(150);
await click(0.42, 0.52);
await click(0.58, 0.52);
const afterLines = await statusText();

// MODO ÁREA: 4 nodos nuevos → 1 losa Q4
await btns[2].click(); // ▦ Área
await sleep(150);
await click(0.30, 0.30);
await click(0.50, 0.30);
await click(0.50, 0.46);
await click(0.30, 0.46);
const afterArea = await statusText();

const sceneAfter = await page.evaluate(() => {
  let el = null; document.querySelectorAll("*").forEach((e) => { if (e.__ctx) el = e; });
  return el?.__ctx?.scene?.children?.length ?? null;
});

await page.screenshot({ path: "workspace2-area-test.png" });
console.log(JSON.stringify({ before, afterNodes, afterLines, afterArea, ctxReady, sceneAfter, errors: errors.slice(0, 8) }, null, 2));
await browser.close();
