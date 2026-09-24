// El botón «🎬 Tutorial» de la barra de arriba: abre el panel, lista los grupos y clips, reproduce, Siguiente,
// enlaces a LISP web, Esc cierra, y el enlace «Abrir este modelo» carga el modelo RESUELTO en la app.
//   node cli/_tutorial_boton_check.mjs [url del workspace]      (PUPPETEER_EXECUTABLE_PATH si puppeteer no trae su Chrome)
import puppeteer from "puppeteer";
const URL0 = process.argv[2] || "http://localhost:4600/workspace/?t=new-blank";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--autoplay-policy=no-user-gesture-required"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
const errores = []; pag.on("pageerror", (e) => errores.push(String(e).slice(0, 200)));
await pag.goto(URL0, { waitUntil: "networkidle2", timeout: 120000 }); await pag.waitForSelector("#hk-cad-tutorial", { timeout: 60000 }); await new Promise((r) => setTimeout(r, 2500));
const w = (ms) => new Promise((r) => setTimeout(r, ms));
let ok = 0, n = 0; const t = (que, c, det = "") => { n++; if (c) ok++; console.log((c ? "✓" : "x"), que, det); };
const b = await pag.evaluate(() => { const b = document.getElementById("hk-cad-tutorial"); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, txt: b.textContent, enc: document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === b }; });
t("botón en la barra de arriba", !!b && b.enc, JSON.stringify(b));
await pag.mouse.click(b.x, b.y); await w(1500);
const st = await pag.evaluate(() => ({ grupos: document.querySelectorAll("#hk-tut details.grupo").length, abiertos: document.querySelectorAll("#hk-tut details.grupo[open]").length, items: document.querySelectorAll("#hk-tut .it").length,
  hojas: [...document.querySelectorAll("#hk-tut .hojas a")].map((a) => a.href.slice(0, 90)), modelos: [...document.querySelectorAll("#hk-tut .modelos a")].map((a) => a.href) }));
t("grupos y clips", st.grupos >= 6 && st.items >= 50 && st.abiertos === 1, `${st.grupos} grupos, ${st.items} clips, ${st.abiertos} abierto`);
t("enlaces a Hekatan LISP web (pública)", st.hojas.length >= 3 && st.hojas.every((h) => h.startsWith("https://giorgioburbanelli89.github.io/hekatan-lisp/#ej=")), st.hojas[0]);
t("enlaces «Abrir este modelo»", st.modelos.length >= 3 && st.modelos.every((m) => /workspace\/\?heks=/.test(m)), st.modelos[0]);
const it = await pag.evaluate(() => { const r = document.querySelectorAll("#hk-tut .it")[2].getBoundingClientRect(); return { x: r.left + 40, y: r.top + 20 }; });
await pag.mouse.click(it.x, it.y); await w(3000);
const v = await pag.evaluate(() => { const v = document.querySelector("#hk-tut video"); return { src: v.src.split("/").pop(), t: v.currentTime, dur: v.duration, w: v.videoWidth, err: v.error?.code ?? null }; });
t("el clip 3 se reproduce", v.src === "warren_02.mp4" && v.t > 0.5 && v.w === 1280, JSON.stringify(v));
await pag.screenshot({ path: process.env.HK_SHOT || "cli/shots/_tutorial_panel.png" });
const sig = await pag.evaluate(() => { const r = document.getElementById("hk-tut-sig").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, enc: document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.id }; });
await pag.mouse.click(sig.x, sig.y); await w(800);
t("Siguiente ▶ (con el mouse, sin nada encima)", sig.enc === "hk-tut-sig" && (await pag.evaluate(() => document.querySelector("#hk-tut video").src.split("/").pop())) === "warren_03.mp4", sig.enc);
// un grupo plegado se abre con un clic en su título
const g2 = await pag.evaluate(() => { const s = document.querySelectorAll("#hk-tut details.grupo > summary")[1]; s.scrollIntoView({ block: "center" }); const r = s.getBoundingClientRect(); return { x: r.left + 60, y: r.top + 10 }; });
await pag.mouse.click(g2.x, g2.y); await w(500);
t("el segundo grupo se despliega", await pag.evaluate(() => document.querySelectorAll("#hk-tut details.grupo")[1].open));
await pag.keyboard.press("Escape"); await w(400);
t("Esc cierra", !(await pag.evaluate(() => !!document.getElementById("hk-tut"))));
// el modelo por enlace: abre RESUELTO
for (const m of st.modelos) {
  const p2 = await nav.newPage(); await p2.setViewport({ width: 1280, height: 720 }); const e2 = []; p2.on("pageerror", (e) => e2.push(String(e).slice(0, 160)));
  await p2.goto(m, { waitUntil: "networkidle2", timeout: 120000 }); await w(6000);
  const r = await p2.evaluate(() => { const S = window.__hekatanStates; const D = S?.deformOutputs?.rawVal?.deformations; let uz = 0; if (D) for (const [, d] of D) uz = Math.max(uz, Math.abs(d[2]), Math.abs(d[0]), Math.abs(d[1])); return { nudos: S?.nodes?.rawVal?.length ?? 0, elems: S?.elements?.rawVal?.length ?? 0, umax_mm: +(uz * 1000).toFixed(3) }; });
  const nombre = decodeURIComponent(m).split("/").pop();
  t("modelo por enlace: " + nombre, r.nudos > 0 && r.umax_mm > 0 && e2.length === 0, JSON.stringify(r) + (e2.length ? " " + e2.join("|") : ""));
  if (/warren/.test(nombre)) { t("Warren: 13 nudos, 23 barras, 0.298 mm (= ETABS 22)", r.nudos === 13 && r.elems === 23 && Math.abs(r.umax_mm - 0.298) < 0.002, JSON.stringify(r)); await p2.screenshot({ path: "cli/shots/_tutorial_modelo_warren.png" }); }
  await p2.close();
}
t("sin errores de página", errores.length === 0, errores.join(" | "));
console.log(`${ok}/${n}`); await nav.close(); process.exit(ok === n ? 0 : 1);
