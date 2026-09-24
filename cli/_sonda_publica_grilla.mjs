// La grilla auxiliar, EN LA URL PÚBLICA. node cli/_sonda_publica_grilla.mjs
import puppeteer from "puppeteer";
const URL = process.argv[2] || "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=new-blank";
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const p = await nav.newPage(); await p.setViewport({ width: 1400, height: 860 });
const err = []; p.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
const esp = (m) => new Promise((r) => setTimeout(r, m));
await p.goto(URL, { waitUntil: "networkidle2", timeout: 180000 });
await p.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 }); await esp(5000);
await p.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());
const camA = await p.evaluate(() => { const c = document.querySelector("#viewer").__ctx.camera;
  return [c.position.x, c.position.y, c.position.z].map((q) => +q.toFixed(2)); });
const cz = await p.evaluate(() => { const i = [...document.querySelectorAll("#hk-ribbon input")]
  .find((e) => (e.title || "").includes("Cota Z")); if (!i) return null;
  const r = i.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
await p.mouse.click(cz.x, cz.y, { clickCount: 3 }); await p.keyboard.type("3.2"); await p.keyboard.press("Enter"); await esp(900);
const camB = await p.evaluate(() => { const c = document.querySelector("#viewer").__ctx.camera;
  return [c.position.x, c.position.y, c.position.z].map((q) => +q.toFixed(2)); });
const bAux = await p.evaluate(() => { const b = [...document.querySelectorAll("#hk-ribbon button")]
  .find((e) => (e.title || "").includes("grilla auxiliar")); if (!b) return null;
  const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
if (bAux) { await p.mouse.click(bAux.x, bAux.y); await esp(800); }
const niveles = await p.evaluate(() => (window.__hekatanLevels ?? []).map((l) => l.z));
const rejillas = await p.evaluate(() => { const o = [];
  document.querySelector("#viewer").__ctx.scene.traverse((x) => {
    if (typeof x.name === "string" && x.name.startsWith("hekatan-grid")) o.push(+x.position.z.toFixed(2)); });
  return o.sort((a, b) => a - b); });
await p.screenshot({ path: "cli/shots/_publico_grilla_aux.png" });
console.log("cámara:", camA, "→", camB, camA.every((v,i)=>Math.abs(v-camB[i])<0.02) ? "QUIETA ✓" : "SE MOVIÓ ✗");
console.log("botón ▦+:", bAux ? "está ✓" : "NO está ✗", "· niveles:", JSON.stringify(niveles), "· rejillas:", JSON.stringify(rejillas));
console.log("pageerror:", err.length, err.slice(0, 2));
await nav.close();
