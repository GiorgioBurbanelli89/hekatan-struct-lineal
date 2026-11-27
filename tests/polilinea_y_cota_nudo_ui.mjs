// POLILÍNEA sigue desde el último nudo + COTA PROVISIONAL editable desde un nudo (27-nov-2026, Jorge:
// «la línea dibuja elementos separados, la polilínea seguidos desde donde quedó el último nodo» y
// «una cota ficticia editable permite dibujar al inicio desde el otro nudo inicial de la línea»).
//   node tests/polilinea_y_cota_nudo_ui.mjs [url]      (servidor: npm run dev:examples, :4600)
import puppeteer from "puppeteer";
const URL = process.argv[2] || "http://localhost:4600/workspace/?t=new-blank";
const OUT = process.env.HK_SHOTS || ".";
const b = await puppeteer.launch({ headless: "new", channel: "chrome", args: ["--no-sandbox"] });
const w = (ms) => new Promise((r) => setTimeout(r, ms));
let ok = 0, mal = 0; const check = (n, c, d = "") => { c ? ok++ : mal++; console.log((c ? "  ✓ " : "  ✗ ") + n + (d ? "  " + d : "")); };
const err = [];
const distan = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const pts = (p) => p.evaluate(() => (window.__hekatanDrawingPoints?.rawVal || []).map((q) => [...q]));
const polys = (p) => p.evaluate(() => (window.__hekatanDrawingPolylines?.rawVal || []).map((q) => [...q]).filter((q) => q.length));
const pix = (p, x, y, z) => p.evaluate((x, y, z) => window.__hekatanAPixeles(x, y, z), x, y, z);
const cmd = async (p, t) => { await p.evaluate((t) => { const i = document.getElementById("hk3-cmd-input"); i.focus(); i.value = t; i.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })); }, t); await w(350); };

for (const [nom, tecla] of [["Planta", "1"], ["3D iso", "4"]]) {
  console.log(`── ${nom}`);
  const p = await b.newPage(); await p.setViewport({ width: 1500, height: 1000 });
  p.on("pageerror", (e) => err.push(e.message));
  await p.goto(URL, { waitUntil: "networkidle2" }); await w(5000);
  await p.evaluate(() => { window.__hekatanAxisSnap = false; window.__hekatanTrack = false;
    for (const bt of document.querySelectorAll("button")) if (/^(Entendido|Empezar en blanco)$/.test((bt.textContent || "").trim())) bt.click(); });
  await p.keyboard.press("Escape"); await p.keyboard.press(tecla); await w(1200);

  // 1. LÍNEA 0,0 → 4,0 → 4,3 : dos barras sueltas
  for (const t of ["l", "0,0,0", "4,0,0", "4,3,0"]) await cmd(p, t);
  await p.keyboard.press("Escape"); await w(400);
  let PL = await polys(p);
  check(`${nom}: LÍNEA = 2 barras sueltas`, JSON.stringify(PL) === "[[0,1],[1,2]]", JSON.stringify(PL));

  // 2. POLILÍNEA: arranca en el último nudo (4,3) — @2,0 y @0,3 encadenan desde ahí
  await cmd(p, "pl");
  const semilla = await p.evaluate(() => (window.__hekatanDrawingPolylines.rawVal.at(-1) || []).slice());
  check(`${nom}: POLILÍNEA arranca en el último nudo (3)`, JSON.stringify(semilla) === "[2]", JSON.stringify(semilla));
  await cmd(p, "@2,0"); await cmd(p, "@0,3");
  let P = await pts(p); PL = await polys(p);
  check(`${nom}: POLILÍNEA seguida desde (4,3): [2,3,4]`, PL.some((q) => JSON.stringify(q) === "[2,3,4]") && distan(P[3], [6, 3, 0]) < 1e-9 && distan(P[4], [6, 6, 0]) < 1e-9, JSON.stringify({ PL, P: P.slice(2) }));
  await p.keyboard.press("Escape"); await w(400);

  // 3. POLILÍNEA + N: empieza suelta donde se diga
  await cmd(p, "pl"); await cmd(p, "n");
  const vacia = await p.evaluate(() => (window.__hekatanDrawingPolylines.rawVal.at(-1) || []).length);
  check(`${nom}: N suelta el arranque`, vacia === 0, String(vacia));
  await cmd(p, "10,0,0"); await cmd(p, "12,0,0");
  PL = await polys(p); P = await pts(p);
  const ult = PL[PL.length - 1];
  check(`${nom}: tras N, polilínea nueva suelta en (10,0)`, ult.length === 2 && distan(P[ult[0]], [10, 0, 0]) < 1e-9, JSON.stringify(ult));
  await p.keyboard.press("Escape"); await w(400);
  await p.evaluate(() => { window.__hekatanCadState.setTool("select"); }); await p.keyboard.press("Escape"); await w(300);

  // 4. COTA DESDE NUDO: LÍNEA, cursor cerca del nudo (0,0) lejos de barras → [d … m desde nudo 1]; Tab, 2.5, Enter
  await p.evaluate(() => { window.__hekatanDrawingPoints.val = [[0, 0, 0], [0, 6, 0]]; window.__hekatanDrawingPolylines.val = [[0, 1], []]; window.__hekatanRebuild?.(); window.__hekatanOrthoMode = true; });
  await w(400); await cmd(p, "l");
  const c = await pix(p, -1.0, -0.15, 0); await p.mouse.move(c.x + 20, c.y + 5); await w(150); await p.mouse.move(c.x, c.y, { steps: 3 }); await w(400);
  const ng = await p.evaluate(() => ({ vis: getComputedStyle(document.getElementById("hk-dist-nudo")).display, d: document.getElementById("hk-dist-n").value, txt: document.getElementById("hk-dist-nudo").innerText.replace(/\s+/g, " "), info: window.__hekatanDistNudo() }));
  check(`${nom}: cerca del nudo sale la cota editable [d … m desde nudo]`, ng.vis === "block" && /desde nudo 1/.test(ng.txt) && parseFloat(ng.d) >= 0.5, JSON.stringify({ vis: ng.vis, d: ng.d, txt: ng.txt }));
  try { await p.screenshot({ path: `${OUT}/_cn_${tecla}_cota_nudo.png`, clip: { x: Math.max(0, c.x - 320), y: Math.max(0, c.y - 140), width: 560, height: 280 } }); } catch {}
  await p.evaluate(() => { const i = document.getElementById("hk-rubber-label"); i.focus(); });
  await p.keyboard.press("Tab"); await w(100);
  check(`${nom}: Tab lleva a d del nudo`, (await p.evaluate(() => document.activeElement?.id)) === "hk-dist-n");
  await p.keyboard.type("2.5"); await p.keyboard.press("Enter"); await w(500);
  P = await pts(p); const ini = P[P.length - 1];
  check(`${nom}: primer punto a d = 2.50 EXACTO del nudo, con ORTO sobre −X`, distan(ini, [-2.5, 0, 0]) < 1e-9, JSON.stringify(ini));
  // sigue la goma: 3 m en +Y por teclado
  const c2 = await pix(p, -2.5, 2, 0); await p.mouse.move(c2.x, c2.y, { steps: 4 }); await w(400);
  await p.keyboard.type("3"); await p.keyboard.press("Enter"); await w(500);
  P = await pts(p);
  check(`${nom}: luego L = 3 desde ese punto`, distan(P[P.length - 1], [-2.5, 3, 0]) < 1e-9, JSON.stringify(P[P.length - 1]));
  await p.close();
}
console.log(`\n${ok} ok · ${mal} fallan · errores de página ${err.length}`, err.slice(0, 3));
await b.close();
process.exit(mal || err.length ? 1 : 0);
