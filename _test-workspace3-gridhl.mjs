import puppeteer from "puppeteer";
const URL = "http://localhost:4600/workspace3/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1300, height: 850 });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto(URL, { waitUntil: "networkidle2", timeout: 45000 });
await page.waitForSelector("canvas", { timeout: 20000 });
await sleep(3500); // init viewer + __ctx

const box = await page.$eval("canvas", (c) => { const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });

// Mover el mouse sobre varias zonas del grid (real pointermove)
const move = async (fx, fy) => { await page.mouse.move(box.x + box.w * fx, box.y + box.h * fy, { steps: 4 }); await sleep(250); };
await move(0.5, 0.55);
await move(0.45, 0.5);
await move(0.55, 0.6);

// ¿Hay un Group ámbar visible (nuestro highlight) en la escena?
const probe = await page.evaluate(() => {
  let el = null; document.querySelectorAll("*").forEach((e) => { if (e.__ctx) el = e; });
  const ctx = el?.__ctx;
  const scene = ctx?.scene;
  if (!scene) return { hasScene: false };
  let any = null;
  scene.traverse((o) => {
    if (o.children?.some((c) => c.geometry?.type === "RingGeometry")) {
      any = { type: o.type, visible: o.visible, pos: o.position.toArray(), scale: o.scale.x };
    }
  });
  // info de cámara y settings
  const cam = ctx.camera;
  const s = ctx.settings;
  return {
    hasScene: true,
    markerExists: !!any,
    marker: any,
    camPos: cam?.position?.toArray?.().map((v) => +v.toFixed(2)),
    gridStep: s?.gridStep?.rawVal ?? null,
    cursorSnap: s?.cursorSnap?.rawVal ?? null,
  };
});

// Forzar pointermove directo sobre el canvas vía dispatch (por si bubbling falla)
await page.evaluate((b) => {
  const cv = document.querySelector("canvas");
  const ev = new PointerEvent("pointermove", { clientX: b.x + b.w * 0.5, clientY: b.y + b.h * 0.5, bubbles: true });
  cv.dispatchEvent(ev);
}, box);
await sleep(300);
const probe2 = await page.evaluate(() => {
  let el = null; document.querySelectorAll("*").forEach((e) => { if (e.__ctx) el = e; });
  const scene = el?.__ctx?.scene; let any = null;
  scene?.traverse((o) => { if (o.children?.some((c) => c.geometry?.type === "RingGeometry")) any = { visible: o.visible, pos: o.position.toArray().map((v)=>+v.toFixed(2)) }; });
  return any;
});
console.log("AFTER dispatch:", JSON.stringify(probe2));

await page.screenshot({ path: "workspace3-gridhl.png" });
console.log(JSON.stringify({ probe, errors: errors.slice(0, 8) }, null, 2));
await browser.close();
