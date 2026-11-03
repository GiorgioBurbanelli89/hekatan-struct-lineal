// Camino REAL de los botones de grabar: clic de verdad en ⏺ y 🎞 → getDisplayMedia (pantalla auto-elegida por flag) → parar → descarga.
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: false, channel: "chrome", args: ["--no-sandbox", "--auto-select-desktop-capture-source=Entire screen", "--auto-select-tab-capture-source-by-title=Hekatan", "--use-fake-ui-for-media-stream", "--window-size=1400,900"] });
const p = await b.newPage(); await p.setViewport({ width: 1400, height: 800 });
const err = []; p.on("pageerror", (e) => err.push(e.message)); const logs = []; p.on("console", (m) => { if (/grabar|gif|display|permission/i.test(m.text())) logs.push(m.text()); });
await p.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2" });
const w = (ms) => new Promise((r) => setTimeout(r, ms)); await w(4000);
let ok = 0, mal = 0; const check = (n, c, d = "") => { c ? ok++ : mal++; console.log((c ? "  ✓ " : "  ✗ ") + n + (d ? "  " + d : "")); };
await p.evaluate(() => { window.__desc = []; const o = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () { if (this.download) { const n = this.download; fetch(this.href).then((r) => r.blob()).then(async (bl) => { const b64 = await new Promise((ok) => { const f = new FileReader(); f.onload = () => ok(String(f.result).split(",")[1]); f.readAsDataURL(bl); }); window.__desc.push({ n, size: bl.size, tipo: bl.type, b64 }); }); } return o.apply(this, arguments); }; });
const aviso = () => p.evaluate(() => document.getElementById("hk-grabar-aviso")?.textContent || "");
for (const [id, ext, esp] of [["hk-grabar-btn", "mp4", "⏹"], ["hk-gif-btn", "gif", "⏹ GIF"]]) {
  const r = await p.evaluate((id) => { const e = document.getElementById(id); const q = e.getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2]; }, id);
  await p.mouse.click(r[0], r[1]); await w(4500);
  const t = await p.evaluate((id) => document.getElementById(id).textContent, id);
  check(`clic en ${id}: empieza a grabar`, t.includes("⏹"), `texto «${t}» · aviso «${await aviso()}»`);
  await p.mouse.click(r[0], r[1]);
  let d; for (let i = 0; i < 40 && !d; i++) { await w(1000); d = await p.evaluate((e) => window.__desc.find((x) => x.n.endsWith("." + e)), ext); }
  check(`${id}: al parar descarga .${ext}`, !!d && d.size > 5000, JSON.stringify({ n: d?.n, size: d?.size, tipo: d?.tipo }));
  if (d && process.env.OUT) (await import("fs")).writeFileSync(process.env.OUT + "/real_" + ext + "." + ext, Buffer.from(d.b64, "base64"));
}
if (logs.length) console.log("  consola:", logs.join(" | "));
check("sin errores de página", err.length === 0, err.join(" | "));
console.log(`\n${ok} ok · ${mal} fallan`); await b.close(); process.exit(mal ? 1 : 0);
