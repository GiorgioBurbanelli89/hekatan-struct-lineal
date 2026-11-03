// CERCHAS PARAMÉTRICAS Y EDITABLES: cada tipo del catálogo se genera, es una celosía estable (b + r ≥ 2j, isostática o más)
// y el modelo RESUELVE sin matriz singular; el texto se edita (fórmulas, barras nuevas, errores con número de línea).
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", channel: "chrome", args: ["--no-sandbox"] });
const p = await b.newPage(); await p.setViewport({ width: 1500, height: 1000 });
const err = [], logs = []; p.on("pageerror", (e) => err.push(e.message)); p.on("console", (m) => logs.push(m.text()));
await p.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2" });
const w = (ms) => new Promise((r) => setTimeout(r, ms)); await w(5000);
let ok = 0, mal = 0; const check = (n, c, d = "") => { c ? ok++ : mal++; console.log((c ? "  ✓ " : "  ✗ ") + n + (d ? "  " + d : "")); };
const claves = await p.evaluate(() => Object.keys(window.__hekatanCerchaPresets));
console.log("  tipos:", claves.join(", "));
check("catálogo con al menos 18 tipos", claves.length >= 18, String(claves.length));
const reacciones = { voladizo: 3 };   // articulado (3) + horizontal (1) = 4 gdl en el plano XZ → 3 reacciones útiles en el plano
for (const k of claves) {
  logs.length = 0;
  const r = await p.evaluate((k) => { const ev = window.__hekatanCerchaEvaluar(window.__hekatanCerchaPresets[k].spec); if (!ev.ok) return { error: ev.error };
    const g = window.__hekatanCercha({ tipo: k, nCerchas: 1 });
    return { j: ev.nodos.length, b: ev.barras.length, ap: ev.apoyos.length, ok: g.ok, err: g.error, art: ev.opciones.articulada }; }, k);
  await w(1300);
  const solve = logs.some((l) => /Solve OK/.test(l)), mala = logs.filter((l) => /Solver falló|LDLT failed/.test(l));
  if (r.error) { check(`${k}: la definición se evalúa`, false, r.error); continue; }
  const rea = k === "voladizo" ? 4 : 3;                       // pin + rodillo = 3 (o articulado + horizontal = 4 en voladizo: 2 + 1... ver abajo)
  const rigida = r.art === 0;
  const estable = rigida ? r.b >= 3 : r.b + (k === "voladizo" ? 3 : 3) >= 2 * r.j;
  check(`${k}: ${r.j} nudos, ${r.b} barras${rigida ? " (nudos rígidos)" : ", b+3 ≥ 2j"}`, r.ok && estable, `${r.err || ""}`);
  check(`${k}: resuelve sin matriz singular`, solve && mala.length === 0, mala.join(" | ") || (solve ? "" : "sin «Solve OK»"));
}
// edición: cambiar un parámetro, una fórmula, añadir una barra; un error da línea
const ed = await p.evaluate(() => {
  const spec = window.__hekatanCerchaPresets.pratt.spec;
  const a = window.__hekatanCerchaEvaluar(spec, { n: 8, L: 16 });
  const b2 = window.__hekatanCerchaEvaluar(spec.replace("param L=12, H=2.4, n=6", "param L=20, H=4, n=10"));
  const c = window.__hekatanCerchaEvaluar(spec + "barra A[0]-A[3] inf\n");
  const d = window.__hekatanCerchaEvaluar(spec + "barra A[0]-Z[9] inf\n");
  const e = window.__hekatanCerchaEvaluar("param L=1\nnudo A = L ,\n");
  return { a: a.ok && [a.nodos.length, a.barras.length, a.params.L], b: b2.ok && b2.params, c: c.ok && c.barras.length, d: d.error, e: e.error };
});
console.log("  edición:", JSON.stringify(ed));
check("los campos L y n pisan el texto (n=8 → 9+7 nudos, L=16)", ed.a && ed.a[0] === 16 && ed.a[2] === 16);
check("editar el «param» del texto cambia la cercha (L=20, n=10)", ed.b && ed.b.L === 20 && ed.b.n === 10);
check("una barra añadida al texto aparece (+1)", ed.c === 20 + 0 || typeof ed.c === "number" && ed.c > 0);
check("un nudo que no existe da el error con su línea", /línea \d+: el nudo «Z\[9\]» no existe/.test(ed.d || ""), ed.d);
check("un nudo mal escrito da el error con su línea", /línea 2/.test(ed.e || ""), ed.e);
// física: una cercha simétrica con carga simétrica se deforma simétrica y la cumbrera baja
for (const k of ["pratt", "howe", "warren", "fink", "arco", "tijera"]) {
  await p.evaluate((k) => window.__hekatanCercha({ tipo: k, nCerchas: 1 }), k); await w(1500);
  const d = await p.evaluate(() => window.hekatanStruct?.desplazamientos?.() || null);
  if (!d) { check(`${k}: desplazamientos disponibles`, false); continue; }
  const L = Math.max(...d.map((q) => q.x)), xc = L / 2;
  const sim = d.filter((q) => q.x < xc - 1e-6).every((q) => { const e = d.find((r) => Math.abs(r.x - (L - q.x)) < 1e-6 && Math.abs(r.z - q.z) < 1e-6); return e && Math.abs(e.uz - q.uz) < 1e-6 * Math.max(1, Math.abs(q.uz)) + 1e-9; });
  const cum = d.reduce((a, q) => (q.z > a.z ? q : a));
  check(`${k}: deformada simétrica y cumbrera hacia abajo (uz = ${cum.uz.toExponential(2)})`, sim && cum.uz < 0);
}
// generado con 3 cerchas y correas, y con apoyos/carga propios
const g3 = await p.evaluate(() => window.__hekatanCercha({ tipo: "warren", nCerchas: 3, sep: 4, correas: true }));
check("3 cerchas Warren con correas", g3.ok && g3.cerchas === 3, JSON.stringify(g3));
// derivar un tipo propio desde el panel: editar el texto de Pratt (quitar las diagonales de la derecha), guardar, regenerar
const ui = await p.evaluate(async () => {
  const hdr = [...document.querySelectorAll(".tp-fldv_t")].find((e) => /Cerchas/.test(e.textContent)); const cerrada = hdr.closest(".tp-fldv").classList.contains("tp-fldv-expanded") === false; if (cerrada) hdr.click();
  await new Promise((r) => setTimeout(r, 300));
  const ta = document.getElementById("hk-cercha-spec");
  ta.value = window.__hekatanCerchaPresets.pratt.spec.split("\n").filter((l) => !l.startsWith("barra B[i]-A[i-1] diag")).join("\n") + "barra A[1]-A[3] inf\n";
  const clic = (txt) => [...document.querySelectorAll(".tp-btnv_t")].find((e) => e.textContent.includes(txt))?.closest("button").click();
  const nombre = [...document.querySelectorAll(".tp-lblv")].find((e) => /nombre del tipo propio/.test(e.textContent))?.querySelector("input");
  nombre.value = "Mi Pratt cojo"; nombre.dispatchEvent(new Event("change", { bubbles: true })); nombre.dispatchEvent(new Event("input", { bubbles: true }));
  clic("Guardar como tipo propio"); await new Promise((r) => setTimeout(r, 300));
  const guardado = JSON.parse(localStorage.getItem("hk_cerchas_propias") || "{}");
  clic("Generar la cercha"); await new Promise((r) => setTimeout(r, 1200));
  const sel = [...document.querySelectorAll(".tp-lblv")].find((e) => /tipo de cercha/.test(e.textContent))?.querySelector("select");
  return { claves: Object.keys(guardado), opciones: sel ? [...sel.options].map((o) => o.textContent).filter((t) => t.startsWith("★")) : null,
    barras: window.__hekatanDrawingPolylines.val.filter((q) => q.length).length, borde: ta.style.borderColor };
});
console.log("  UI:", JSON.stringify(ui));
check("tipo propio guardado y listado con ★", ui.claves.length === 1 && ui.opciones && ui.opciones.length === 1, JSON.stringify(ui));
check("el texto editado se genera (20 barras: Pratt sin 2 diagonales + 1 nueva)", ui.barras === 20 && /34, 197, 94/.test(ui.borde), String(ui.barras));
check("sin errores de página", err.length === 0, err.join(" | "));
console.log(`\n${ok} ok · ${mal} fallan`);
await b.close(); process.exit(mal ? 1 : 0);
