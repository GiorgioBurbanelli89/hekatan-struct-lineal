// COTA EDITABLE DEL SEGUNDO PUNTO (26-nov-2026): como la entrada dinámica de Math Studio (LispCad.js)
// y la cota que se toca del Croquis. PC: tras el primer nudo se teclea la longitud (y Tab → ángulo) y
// Enter pone el nudo a esa distancia exacta; encadena. Celular: caja tocable L / ∠ / ✓ / ✕.
//   node tests/entrada_dinamica_ui.mjs [url]      (servidor: npm run dev:examples, :4600)
import puppeteer from "puppeteer";
const URL = process.argv[2] || "http://localhost:4600/workspace/?t=new-blank";
const OUT = process.env.HK_SHOTS || ".";
const b = await puppeteer.launch({ headless: "new", channel: "chrome", args: ["--no-sandbox"] });
const w = (ms) => new Promise((r) => setTimeout(r, ms));
let ok = 0, mal = 0; const check = (n, c, d = "") => { c ? ok++ : mal++; console.log((c ? "  ✓ " : "  ✗ ") + n + (d ? "  " + d : "")); };
const err = [];
const near = (a, b, t = 1e-6) => Math.abs(a - b) <= t;
const distan = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

async function abrir(vp, movil) {
  const p = await b.newPage();
  if (movil) await p.emulate({ viewport: { ...vp, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, userAgent: "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36" });
  else await p.setViewport(vp);
  p.on("pageerror", (e) => err.push(e.message));
  await p.goto(URL, { waitUntil: "networkidle2" }); await w(5000);
  await p.evaluate(() => { window.__hekatanAxisSnap = false; window.__hekatanTrack = false; });
  // los avisos de bienvenida / «dibujo guardado» tapan medio celular
  await p.evaluate(() => { for (const bt of document.querySelectorAll("button")) if (/^(Entendido|Empezar en blanco)$/.test((bt.textContent || "").trim())) bt.click(); }); await w(400);
  return p;
}
const pts = (p) => p.evaluate(() => (window.__hekatanDrawingPoints?.rawVal || window.__hekatanDrawingPoints?.val || []).map((q) => [...q]));
const polys = (p) => p.evaluate(() => (window.__hekatanDrawingPolylines?.rawVal || []).map((q) => [...q]));
const pix = (p, x, y, z) => p.evaluate((x, y, z) => window.__hekatanAPixeles(x, y, z), x, y, z);
const vista = async (p, k) => {     // 1 Planta · 4 3D, con la herramienta en «select» y la caja vacía
  await p.evaluate(() => window.__hekatanCadState.setTool("select")); await w(200);
  await p.keyboard.press("Escape"); await w(200); await p.keyboard.press(k); await w(1200);
};
const linea = async (p) => { await p.evaluate(() => window.__hekatanCadState.setTool("line")); await w(300); };
// rects de los mandos visibles contra un rect (colisiones: feedback_struct_sin_colisiones_ui)
const choques = (p, sel) => p.evaluate((sel) => {
  // hit-test real (respeta lo recortado por overflow): una rejilla de puntos sobre cada caja propia
  const propios = [...document.querySelectorAll(sel)].filter((e) => e.getBoundingClientRect().width > 0);
  const res = new Set();
  for (const a of propios) { const r = a.getBoundingClientRect();
    for (let i = 0; i <= 8; i++) for (let j = 0; j <= 3; j++) {
      const x = r.left + 1 + (r.width - 2) * i / 8, y = r.top + 1 + (r.height - 2) * j / 3;
      for (const e of document.elementsFromPoint(x, y)) {
        if (propios.some((q) => q.contains(e)) || e.matches?.(sel)) continue;
        if (e.tagName === "CANVAS" || e === document.body || e === document.documentElement) break;
        if (/^(BUTTON|INPUT|SELECT|TEXTAREA)$/.test(e.tagName) || e.closest?.("button")) { res.add((e.id || e.tagName) + ":" + (e.textContent || e.value || "").slice(0, 14)); }
      } } }
  return [...res];
}, sel);

// ═══ 1. PC, PLANTA (2D): barra de 3.50 m tecleando la longitud ═══
{
  console.log("── PC · Planta XY");
  const p = await abrir({ width: 1500, height: 1000 }, false);
  await vista(p, "1"); await linea(p);
  const [x0, y0] = Object.values(await pix(p, 0, 0, 0));
  const [x1, y1] = Object.values(await pix(p, 2, 0.4, 0));
  await p.mouse.move(x0, y0); await w(250); await p.mouse.click(x0, y0); await w(400);
  await p.mouse.move((x0 + x1) / 2, (y0 + y1) / 2); await w(150); await p.mouse.move(x1, y1); await w(400);
  const vivo = await p.evaluate(() => { const i = document.getElementById("hk-rubber-label"), a = document.getElementById("hk-rubber-angle");
    const v = (e) => e && getComputedStyle(e).display !== "none"; return { L: v(i) ? i.value : null, A: v(a) ? a.value : null, foco: document.activeElement?.id }; });
  check("cota viva del 2.º punto junto al cursor (longitud + ángulo)", vivo.L !== null && vivo.A !== null, JSON.stringify(vivo));
  check("la cota tiene el foco (se escribe sin tocarla)", vivo.foco === "hk-rubber-label");
  await p.screenshot({ path: `${OUT}/_ed_pc_planta_cota.png`, clip: { x: Math.max(0, x0 - 150), y: Math.max(0, Math.min(y0, y1) - 150), width: 520, height: 300 } });
  await p.keyboard.type("3.5"); await w(150); await p.keyboard.press("Enter"); await w(600);
  let P = await pts(p);
  const A = P[P.length - 2], B = P[P.length - 1];
  check("barra de 3.50 m EXACTA (ORTO → +X)", near(distan(A, B), 3.5, 1e-9) && near(B[0], A[0] + 3.5, 1e-9) && near(B[1], A[1], 1e-9), JSON.stringify([A, B]));
  // encadenado por teclado, SIN mover el ratón: el tramo siguiente sale del nudo nuevo
  await p.keyboard.type("2"); await w(150); await p.keyboard.press("Enter"); await w(600);
  P = await pts(p); const C = P[P.length - 1];
  check("encadena: 2 m desde el nudo nuevo (antes salía del viejo)", near(distan(B, C), 2, 1e-9), JSON.stringify(C));
  // Tab → ángulo: 4 m a 30° en el plano XY
  const [x2, y2] = Object.values(await pix(p, C[0] + 1.5, C[1] + 1.2, 0));
  await p.mouse.move(x2, y2); await w(400);
  await p.keyboard.type("4"); await w(100); await p.keyboard.press("Tab"); await w(150);
  const focoA = await p.evaluate(() => document.activeElement?.id);
  check("Tab pasa al ángulo", focoA === "hk-rubber-angle", focoA);
  await p.keyboard.type("30"); await w(100);
  await p.screenshot({ path: `${OUT}/_ed_pc_planta_tab.png`, clip: { x: Math.max(0, x2 - 330), y: Math.max(0, y2 - 170), width: 520, height: 300 } });
  await p.keyboard.press("Enter"); await w(600);
  P = await pts(p); const D = P[P.length - 1];
  const esp = [C[0] + 4 * Math.cos(Math.PI / 6), C[1] + 4 * Math.sin(Math.PI / 6), C[2]];
  check("4 m a 30° (Tab) exactos", distan(D, esp) < 1e-8, JSON.stringify(D) + " esperado " + JSON.stringify(esp.map((v) => +v.toFixed(6))));
  const PL = (await polys(p)).filter((q) => q.length >= 2);
  // LÍNEA ≠ POLILÍNEA: 3 tramos = 3 entidades sueltas de 2 nudos, encadenadas por nudos compartidos
  check("LÍNEA: 3 tramos = 3 barras sueltas", PL.length === 3 && PL.every((q) => q.length === 2), JSON.stringify(PL));
  check("…con los nudos compartidos (b de un tramo = a del siguiente)", PL.length === 3 && PL[0][1] === PL[1][0] && PL[1][1] === PL[2][0], JSON.stringify(PL));
  // desHacer quita el ÚLTIMO TRAMO entero; Cerrar une con el PRIMER nudo de la cadena
  const tras = await p.evaluate(() => { const r = {}; window.__hekatanCadOption("u");
    r.u = window.__hekatanDrawingPolylines.rawVal.map((q) => [...q]); window.__hekatanCadOption("c");
    r.c = window.__hekatanDrawingPolylines.rawVal.map((q) => [...q]); return r; });
  const segU = tras.u.filter((q) => q.length >= 2), segC = tras.c.filter((q) => q.length >= 2);
  check("U (desHacer) quita el último tramo", segU.length === 2 && JSON.stringify(tras.u.at(-1)) === JSON.stringify([segU[1][1]]), JSON.stringify(tras.u));
  check("C (Cerrar) une el último nudo con el primero: 3 barras", segC.length === 3 && segC[2][1] === segC[0][0], JSON.stringify(tras.c));
  check("cota sin choques con botones", (await choques(p, "#hk-rubber-label, #hk-rubber-angle")).length === 0, JSON.stringify(await choques(p, "#hk-rubber-label, #hk-rubber-angle")));
  // clic-clic sigue igual
  await p.keyboard.press("Escape"); await w(300); await linea(p);
  const n0 = (await pts(p)).length;
  const [cx0, cy0] = Object.values(await pix(p, 0, 1.2, 0)), [cx1, cy1] = Object.values(await pix(p, 0, 2.6, 0));
  console.log('   clic sobre:', cx0, cy0, cx1, cy1, await p.evaluate((x, y) => document.elementFromPoint(x, y)?.tagName, cx0, cy0));
  await p.mouse.move(cx0, cy0); await w(200); await p.mouse.click(cx0, cy0); await w(300);
  await p.mouse.move(cx1, cy1); await w(300); await p.mouse.click(cx1, cy1); await w(400);
  P = await pts(p);
  check("clic-clic sigue funcionando (2 nudos más)", P.length === n0 + 2, `${n0} → ${P.length}`);
  await p.close();
}

// ═══ 2. PC, 3D ISOMÉTRICO: barra de 4.25 m ═══
{
  console.log("── PC · 3D iso");
  const p = await abrir({ width: 1500, height: 1000 }, false);
  await vista(p, "4"); await linea(p);
  const [x0, y0] = Object.values(await pix(p, 0, 0, 0));
  const [x1, y1] = Object.values(await pix(p, 0, 2.5, 0));
  await p.mouse.move(x0, y0); await w(250); await p.mouse.click(x0, y0); await w(400);
  await p.mouse.move((x0 + x1) / 2, (y0 + y1) / 2); await w(150); await p.mouse.move(x1, y1); await w(400);
  await p.screenshot({ path: `${OUT}/_ed_pc_iso_cota.png`, clip: { x: Math.max(0, Math.min(x0, x1) - 200), y: Math.max(0, Math.min(y0, y1) - 150), width: 560, height: 320 } });
  await p.keyboard.type("4.25"); await w(150); await p.keyboard.press("Enter"); await w(600);
  const P = await pts(p);
  const A = P[P.length - 2], B = P[P.length - 1];
  check("barra de 4.25 m EXACTA en la iso", near(distan(A, B), 4.25, 1e-9), JSON.stringify([A, B]));
  check("en el plano de trabajo (Δz = 0)", near(B[2], A[2], 1e-9));
  // ── COLUMNA POR CLIC y luego el cursor SUELTO: la goma y la cota siguen desde el tope ──
  // (Jorge, 26-nov-2026: tras la columna de 6 m el cursor quedaba suelto, sin goma desde el tope)
  await p.close();
}
// ═══ 2b. 3D ISO: COLUMNA POR CLIC y el cursor suelto (página nueva, vista iso de partida) ═══
{
  console.log("── PC · 3D iso · columna y cursor suelto");
  const p = await abrir({ width: 1500, height: 1000 }, false);
  await vista(p, "4");
  await p.evaluate(() => { window.__hekatanAxisSnap = true; });   // como viene de fábrica: el eje Z se engancha
  await linea(p);
  const [c0x, c0y] = Object.values(await pix(p, 0, 0, 0)), [c1x, c1y] = Object.values(await pix(p, 0, 0, 6));
  console.log('   columna en px:', [c0x, c0y, c1x, c1y].map(Math.round), await p.evaluate((x, y, a, b) => [document.elementFromPoint(x, y)?.tagName, document.elementFromPoint(a, b)?.tagName], c0x, c0y, c1x, c1y));
  await p.mouse.move(c0x, c0y); await w(250); await p.mouse.click(c0x, c0y); await w(400);
  await p.mouse.move(c0x, (c0y + c1y) / 2); await w(150); await p.mouse.move(c1x, c1y); await w(400);
  const angZ = await p.evaluate(() => ({ v: document.getElementById("hk-rubber-angle").value, bloq: document.getElementById("hk-rubber-angle").classList.contains("hk-bloq"), rot: document.getElementById("hk-dyn-rot-ang").textContent }));
  const solapeBadge = await p.evaluate(() => { const b = document.getElementById("hk-axis-lock-badge"), g = document.getElementById("hk-dyn-grupo");
    if (!b || getComputedStyle(b).display === "none") return false; const r = b.getBoundingClientRect(), q = g.getBoundingClientRect();
    return r.left < q.right && r.right > q.left && r.top < q.bottom && r.bottom > q.top; });
  check("el grupo no pisa el rótulo «⊥ ORTO Z»", !solapeBadge);
  check("ORTO Z: ángulo 90 EXACTO y bloqueado (🔒), no el de pantalla", angZ.v === "90" && angZ.bloq && angZ.rot === "🔒", JSON.stringify(angZ));
  try { await p.screenshot({ path: `${OUT}/_ed_iso_orto_z.png`, clip: { x: c1x - 260, y: c1y - 80, width: 520, height: 260 } }); } catch {}
  await p.mouse.click(c1x, c1y); await w(500);
  let Pc = await pts(p);
  const tope = Pc[Pc.length - 1];
  check("columna por clic: 6 m vertical", near(tope[2], 6, 1e-6) && near(tope[0], 0, 1e-6) && near(tope[1], 0, 1e-6), JSON.stringify(tope));
  const lecturas = [];
  for (const q of [[3, 0, 6], [0, 2.5, 6], [-2, -1.5, 6]]) {   // a la altura del tope: el plano sigue al último punto
    const s = await pix(p, ...q); await p.mouse.move(s.x, s.y, { steps: 5 }); await w(350);
    lecturas.push(await p.evaluate(() => {
      const i = document.getElementById("hk-rubber-label"), g = window.__hekatanRubberBand;
      const a = g.geometry.attributes.position.array;
      return { L: getComputedStyle(i).display !== "none" ? i.value : null, goma: g.visible, desde: [a[0], a[1], a[2]].map((v) => +v.toFixed(4)), hasta: [a[3], a[4], a[5]].map((v) => +v.toFixed(4)) };
    }));
  }
  console.log("   lecturas:", JSON.stringify(lecturas));
  // el GRUPO de entrada: L y ∠ juntos, rotulados, sin pisarse ni pisar la goma
  const grupo = await p.evaluate(() => {
    const R = (id) => { const e = document.getElementById(id); const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, vis: getComputedStyle(e).display !== "none" }; };
    const g = R("hk-dyn-grupo"), L = R("hk-rubber-label"), A = R("hk-rubber-angle");
    const dentro = (q) => q.x >= g.x - 0.5 && q.y >= g.y - 0.5 && q.x + q.w <= g.x + g.w + 0.5 && q.y + q.h <= g.y + g.h + 0.5;
    const pisa = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    const gm = window.__hekatanRubberBand.geometry.attributes.position.array;
    const pa = window.__hekatanAPixeles(gm[0], gm[1], gm[2]), pb = window.__hekatanAPixeles(gm[3], gm[4], gm[5]);
    let corta = false;                                   // ¿la goma (en pantalla) cruza el grupo?
    for (let t = 0; t <= 1; t += 0.01) { const x = pa.x + (pb.x - pa.x) * t, y = pa.y + (pb.y - pa.y) * t; if (x > g.x && x < g.x + g.w && y > g.y && y < g.y + g.h) { corta = true; break; } }
    return { g, L, A, dentro: dentro(L) && dentro(A), pisan: pisa(L, A), corta, rot: document.getElementById("hk-dyn-grupo").innerText.replace(/\s+/g, " ") };
  });
  check("un GRUPO: L y ∠ dentro, rotulados (L … m | ∠ … °)", grupo.g.vis && grupo.dentro && /L/.test(grupo.rot) && /m/.test(grupo.rot) && /°/.test(grupo.rot), JSON.stringify(grupo.rot));
  check("L y ∠ no se pisan, y el grupo no pisa la goma", !grupo.pisan && !grupo.corta, JSON.stringify({ pisan: grupo.pisan, corta: grupo.corta }));
  check("tras la columna, sin clic: la goma sale del TOPE en las 3 posiciones", lecturas.every((l) => l.goma && distan(l.desde, tope) < 1e-6));
  check("…y va HORIZONTAL a la altura del tope (el plano sigue al último punto)", lecturas.every((l) => Math.abs(l.hasta[2] - tope[2]) < 1e-6), JSON.stringify(lecturas.map((l) => l.hasta)));
  check("la cota viva (L) se ve y CAMBIA con el cursor", lecturas.every((l) => l.L && /^-?\d+\.\d\d$/.test(l.L)) && new Set(lecturas.map((l) => l.L)).size === 3);
  // el foco FUERA de la cota (como tras pinchar otro mando): «6» lo recoge el atajo global → antes era «Enter sin teclear» = terminar
  await p.evaluate(() => document.activeElement?.blur?.());
  await p.keyboard.type("6"); await w(120); await p.keyboard.press("Enter"); await w(600);
  Pc = await pts(p); const viga = Pc[Pc.length - 1];
  check("«6» + Enter (una sola cifra): viga de 6 m desde el tope", near(distan(viga, tope), 6, 1e-9), JSON.stringify(viga));
  const PLc = (await polys(p)).filter((q) => q.length >= 2);
  const PLi = PLc.slice(-2);
  check("columna y viga = 2 barras sueltas con el tope compartido", PLi.length === 2 && PLi[0][1] === PLi[1][0], JSON.stringify(PLi));
  const prompt = await p.evaluate(() => (document.body.innerText.match(/LÍNEA Precise[\s\S]{0,60}/) || [""])[0]);
  check("prompt con [Cerrar/desHacer] tras 2 tramos", /Cerrar/.test(prompt), prompt);
  const goma1 = await p.evaluate(() => window.__hekatanRubberBand.visible);
  const s2 = await pix(p, 1, 2, 0); await p.mouse.move(s2.x, s2.y, { steps: 3 }); await w(300);
  check("sigue encadenando tras el Enter (goma viva)", await p.evaluate(() => window.__hekatanRubberBand.visible), String(goma1));
  try { await p.screenshot({ path: `${OUT}/_ed_pc_iso_columna.png` }); } catch (e) { console.log('   (sin captura: ' + e.code + ')'); }
  await p.keyboard.press("Escape"); await w(400);
  const fin = await p.evaluate(() => ({ goma: window.__hekatanRubberBand.visible, last: (window.__hekatanDrawingPolylines.rawVal.at(-1) || []).length }));
  check("Esc termina (sin goma, nada abierto)", !fin.goma && fin.last === 0, JSON.stringify(fin));
  await p.close();
}

// ═══ 2c. PLANTA y 3D: PRIMER PUNTO a d de una barra existente, @dx,dy desde el último nudo, DESDE ═══
for (const [nom, tecla] of [["Planta", "1"], ["3D iso", "4"]]) {
  console.log(`── PC · ${nom}: primer punto a d de la barra, @, DESDE`);
  const p = await abrir({ width: 1500, height: 1000 }, false);
  await vista(p, tecla);
  await p.evaluate(() => { window.__hekatanDrawingPoints.val = [[0, 0, 0], [8, 0, 0]]; window.__hekatanDrawingPolylines.val = [[0, 1], []]; window.__hekatanRebuild?.(); });
  await w(400); await linea(p);
  const c = await pix(p, 3, 4.2, 0); await p.mouse.move(c.x - 30, c.y - 20); await w(150); await p.mouse.move(c.x, c.y); await w(400);
  const db = await p.evaluate(() => ({ vis: getComputedStyle(document.getElementById("hk-dist-barra")).display, d: document.getElementById("hk-dist-d").value, a: document.getElementById("hk-dist-a").value, txt: document.getElementById("hk-dist-barra").innerText.replace(/\s+/g, " ") }));
  check(`${nom}: junto a la barra sale [d … m | a … m] con nombre`, db.vis === "block" && /d/.test(db.txt) && /a/.test(db.txt) && parseFloat(db.d) > 3, JSON.stringify(db));
  try { await p.screenshot({ path: `${OUT}/_ed_${tecla}_dist_barra.png`, clip: { x: Math.max(0, c.x - 330), y: Math.max(0, c.y - 120), width: 560, height: 260 } }); } catch {}
  await p.keyboard.press("Tab"); await w(100);
  check(`${nom}: Tab lleva a d`, (await p.evaluate(() => document.activeElement?.id)) === "hk-dist-d");
  await p.keyboard.type("5"); await p.keyboard.press("Tab"); await p.keyboard.type("2"); await p.keyboard.press("Enter"); await w(500);
  let P = await pts(p);
  const ini = P[P.length - 1];
  check(`${nom}: primer punto a d = 5.00 y a = 2.00 EXACTOS`, distan(ini, [2, 5, 0]) < 1e-9, JSON.stringify(ini));
  // segundo punto: L tecleada (ORTO +X) → línea PARALELA a 5.00 m
  const c2 = await pix(p, 6, 5, 0); await p.mouse.move(c2.x, c2.y, { steps: 4 }); await w(400);
  await p.keyboard.type("4"); await p.keyboard.press("Enter"); await w(500);
  P = await pts(p); const fin = P[P.length - 1];
  check(`${nom}: la línea nueva es paralela a 5.00 m de la barra`, near(fin[1], 5, 1e-9) && near(ini[1], 5, 1e-9) && near(distan(ini, fin), 4, 1e-9), JSON.stringify([ini, fin]));
  // @dx,dy para el PRIMER punto (relativo al último nudo)
  await p.keyboard.press("Escape"); await w(300); await linea(p);
  const c3 = await pix(p, 1, 2, 0); await p.mouse.move(c3.x, c3.y, { steps: 3 }); await w(300);
  await p.evaluate(() => { const i = document.getElementById("hk-rubber-label"); i.focus(); i.select(); });
  await p.keyboard.type("@0,2"); await p.keyboard.press("Enter"); await w(500);
  P = await pts(p); const rel = P[P.length - 1];
  check(`${nom}: primer punto @0,2 desde el último nudo`, distan(rel, [fin[0], fin[1] + 2, fin[2]]) < 1e-9, JSON.stringify(rel));
  // DESDE: D, base = nudo (0,0,0), @1,1
  await p.keyboard.press("Escape"); await w(300); await linea(p);
  const c4 = await pix(p, 0.5, 1, 0); await p.mouse.move(c4.x, c4.y, { steps: 3 }); await w(300);
  await p.evaluate(() => { const i = document.getElementById("hk-rubber-label"); i.focus(); i.select(); });
  await p.keyboard.type("d"); await p.keyboard.press("Enter"); await w(200);
  check(`${nom}: DESDE espera el punto base`, (await p.evaluate(() => window.__hekatanDesde())) === "base");
  const o = await pix(p, 0, 0, 0); await p.mouse.move(o.x + 3, o.y + 2, { steps: 3 }); await w(250); await p.mouse.move(o.x, o.y); await w(300); await p.mouse.click(o.x, o.y); await w(400);
  await p.keyboard.type("1,1"); await p.keyboard.press("Enter"); await w(500);
  P = await pts(p); const ds = P[P.length - 1];
  check(`${nom}: DESDE base (0,0,0) + @1,1 = (1,1,0)`, distan(ds, [1, 1, 0]) < 1e-9, JSON.stringify(ds));
  // sin ORTO: el ángulo es libre (sin candado)
  await p.evaluate(() => { window.__hekatanOrthoMode = false; window.__hekatanPolarTrack = false; });
  const c5 = await pix(p, 3.3, 2.1, 0); await p.mouse.move(c5.x, c5.y, { steps: 4 }); await w(400);
  const libre = await p.evaluate(() => ({ v: document.getElementById("hk-rubber-angle").value, bloq: document.getElementById("hk-rubber-angle").classList.contains("hk-bloq") }));
  check(`${nom}: sin ORTO el ángulo es libre (sin 🔒)`, !libre.bloq && parseFloat(libre.v) > 5 && parseFloat(libre.v) < 85, JSON.stringify(libre));
  try { await p.screenshot({ path: `${OUT}/_ed_${tecla}_sin_orto.png`, clip: { x: Math.max(0, Math.min(c5.x, c4.x) - 280), y: Math.max(0, Math.min(c5.y, c4.y) - 160), width: 600, height: 320 } }); } catch {}
  await p.close();
}

// ═══ 3. CELULAR (toques): caja tocable L / ∠ / ✓ ═══
{
  console.log("── Celular 412×860 (toques)");
  const p = await abrir({ width: 412, height: 860 }, true);
  await vista(p, "1"); await linea(p);
  const [x0, y0] = Object.values(await pix(p, 0, 0, 0));
  await p.touchscreen.tap(x0, y0); await w(700);
  const caja = await p.evaluate(() => { const c = document.getElementById("hk-cota-tactil"); const r = c.getBoundingClientRect();
    return { vis: getComputedStyle(c).display, r: [r.left, r.top, r.width, r.height], L: document.getElementById("hk-cota-tactil-L").getAttribute("inputmode") }; });
  check("tras el 1.er toque aparece la caja tocable", caja.vis === "flex", JSON.stringify(caja));
  check("teclado numérico (inputmode=decimal)", caja.L === "decimal");
  check("la caja cabe en la pantalla", caja.r[0] >= 0 && caja.r[1] >= 0 && caja.r[0] + caja.r[2] <= 412 && caja.r[1] + caja.r[3] <= 860, JSON.stringify(caja.r));
  const ch = await choques(p, "#hk-cota-tactil");
  check("la caja no choca con ningún botón", ch.length === 0, JSON.stringify(ch));
  // tocar L, escribir 3,5 (coma del teclado del teléfono), tocar ✓
  const rL = await p.$eval("#hk-cota-tactil-L", (e) => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
  await p.touchscreen.tap(rL[0], rL[1]); await w(200);
  await p.keyboard.type("3,5"); await w(150);
  await p.screenshot({ path: `${OUT}/_ed_movil_caja.png` });
  const rOk = await p.$eval("#hk-cota-tactil-ok", (e) => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
  await p.touchscreen.tap(rOk[0], rOk[1]); await w(700);
  let P = await pts(p);
  let A = P[P.length - 2], B = P[P.length - 1];
  check("celular: barra de 3.50 m exacta (∠ 0°)", near(distan(A, B), 3.5, 1e-9) && near(B[0] - A[0], 3.5, 1e-9), JSON.stringify([A, B]));
  // encadena: la caja salta al nudo nuevo; 2 m a 90°
  const rA = await p.$eval("#hk-cota-tactil-A", (e) => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
  await p.touchscreen.tap(rA[0], rA[1]); await w(150);
  await p.evaluate(() => { document.getElementById("hk-cota-tactil-A").value = ""; }); await p.keyboard.type("90");
  const rL2 = await p.$eval("#hk-cota-tactil-L", (e) => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
  await p.touchscreen.tap(rL2[0], rL2[1]); await w(150); await p.keyboard.type("2"); await p.keyboard.press("Enter"); await w(700);
  P = await pts(p); const C = P[P.length - 1];
  check("celular: encadena 2 m a 90° desde el nudo nuevo", distan(C, [B[0], B[1] + 2, B[2]]) < 1e-9, JSON.stringify(C));
  // y una columna con @0,0,3
  await p.touchscreen.tap(rL2[0], rL2[1]); await w(100);
  await p.evaluate(() => { const i = document.getElementById("hk-cota-tactil-L"); i.focus(); i.value = "@0,0,3"; });
  await p.evaluate(() => document.getElementById("hk-cota-tactil-ok").click()); await w(600);
  P = await pts(p); const D = P[P.length - 1];
  check("celular: @0,0,3 = columna de 3 m", distan(D, [C[0], C[1], C[2] + 3]) < 1e-9, JSON.stringify(D));
  await p.screenshot({ path: `${OUT}/_ed_movil_cadena.png` });
  // ✕ termina: la caja se va
  await p.evaluate(() => document.getElementById("hk-cota-tactil-fin").click()); await w(500);
  check("✕ termina la línea y quita la caja", (await p.evaluate(() => getComputedStyle(document.getElementById("hk-cota-tactil")).display)) === "none");
  // toque-toque sigue igual
  await linea(p);
  const n0 = (await pts(p)).length;
  const [t0x, t0y] = Object.values(await pix(p, -1, 1, 0)), [t1x, t1y] = Object.values(await pix(p, 1.5, 1, 0));
  await p.touchscreen.tap(t0x, t0y); await w(500); await p.touchscreen.tap(t1x, t1y); await w(600);
  check("toque-toque sigue poniendo nudos", (await pts(p)).length >= n0 + 2, `${n0} → ${(await pts(p)).length}`);
  await p.close();
}
console.log(`\n${ok} ok · ${mal} fallan · errores de página ${err.length}`); if (err.length) console.log(err.slice(0, 5));
await b.close(); process.exit(mal || err.length ? 1 : 0);
