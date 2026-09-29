/**
 * Exportar a Fortran los resultados activos: pulsa la entrada del menú Exportar con distintos
 * resultados a la vista, guarda el .f90, lo COMPILA con gfortran, lo corre y compara lo que imprime
 * con los números del modelo (máximos leídos de la página).
 *   node cli/ctl_exportar_fortran.mjs [--base http://localhost:4600]
 */
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const i = process.argv.indexOf("--base");
const BASE = i >= 0 ? process.argv[i + 1] : "http://localhost:4600";
const DIR = "cli/shots/ctl_exportar_fortran";
mkdirSync(DIR, { recursive: true });
const GF = process.env.GFORTRAN || "C:/Program Files/GNU Octave/Octave-10.1.0/mingw64/bin/gfortran.exe";
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1600, height: 1000 });
const errores = [];
pag.on("pageerror", (e) => errores.push(e.message));
pag.on("dialog", (d) => { errores.push("dialogo: " + d.message()); d.dismiss().catch(() => {}); });
let fallos = 0;
const ok = (c, t) => { console.log(`${c ? "ok  " : "FALLA"} ${t}`); if (!c) fallos++; };

const CASOS = [
  { id: "estribo-puente", poner: { shellResults: "bendingYY", nodeResults: "reactions" }, nombre: "estribo_M22_reacciones" },
  { id: "estribo-puente", poner: { shellResults: "membranePrincipalMax" }, nombre: "estribo_FMax" },
  { id: "plantillas", poner: { frameResults: "contour:bendingsZ", nodeResults: "deformations" }, nombre: "plantillas_M3_U" },
  { id: "estribo-puente", poner: {}, nombre: "estribo_sin_activos" },
];
for (const c of CASOS) {
  await pag.goto(`${BASE}/workspace/index.html?t=${c.id}`, { waitUntil: "networkidle2", timeout: 180000 });
  await pag.waitForFunction(() => !!window.__hekatanStates?.elements?.val?.length && !!window.__hekatanSettings, { timeout: 120000 });
  await espera(4000);
  const esperado = await pag.evaluate((poner) => {
    const s = window.__hekatanSettings();
    for (const k of ["nodeResults", "frameResults", "shellResults", "solidResults"]) s[k].val = poner[k] ?? "none";
    const st = window.__hekatanStates, an = st.analyzeOutputs.val, df = st.deformOutputs.val;
    const out = {};
    if (poner.shellResults === "bendingYY") { let mx = -1e99; an.bendingYY.forEach((a) => a.forEach((x) => { mx = Math.max(mx, x); })); out.max = mx; }
    if (poner.frameResults) { let mx = -1e99; an.bendingsZ.forEach((a, e) => { if (st.elements.val[e].length === 2) mx = Math.max(mx, a[0], a[1]); }); out.max = mx; }
    if (poner.nodeResults === "reactions" || !Object.keys(poner).length) { const s3 = [0, 0, 0]; df.reactions.forEach((r) => { for (let k = 0; k < 3; k++) s3[k] += r[k]; }); out.sumR = s3; }
    if (poner.shellResults === "membranePrincipalMax") { let mx = -1e99; an.membraneXX.forEach((xx, e) => { const yy = an.membraneYY.get(e), xy = an.membraneXY.get(e); xx.forEach((a, k) => { mx = Math.max(mx, (a + yy[k]) / 2 + Math.hypot((a - yy[k]) / 2, xy[k])); }); }); out.max = mx; }
    return out;
  }, c.poner);
  await espera(600);
  // por el MENÚ, como el usuario
  await pag.evaluate(() => { document.querySelectorAll("#hk-menus button").forEach((b) => { if (/Exportar/.test(b.textContent)) b.click(); }); });
  await espera(500);
  await pag.screenshot({ path: `${DIR}/${c.nombre}_menu.png` });
  await pag.evaluate(() => {
    const it = Array.from(document.querySelectorAll("div,button")).filter((e) => /Fortran \(\.f90\)/.test(e.textContent || "") && e.children.length < 4);
    (it[it.length - 1] ?? it[0])?.click();
  });
  await espera(800);
  const f90 = await pag.evaluate(() => window.__hekatanUltimoFortran ?? null);
  ok(!!f90, `${c.nombre}: el menú exporta el .f90`);
  if (!f90) continue;
  const ruta = `${DIR}/${c.nombre}.f90`;
  writeFileSync(ruta, f90);
  let salida = "";
  try {
    execFileSync(GF, ["-O2", "-Wall", ruta, "-o", `${DIR}/${c.nombre}.exe`], { stdio: "pipe" });
    salida = execFileSync(`${DIR}/${c.nombre}.exe`, { encoding: "utf-8" });
  } catch (e) { salida = "ERROR: " + (e.stderr?.toString() ?? e.message).slice(0, 600); }
  writeFileSync(`${DIR}/${c.nombre}.salida.txt`, salida);
  ok(!salida.startsWith("ERROR"), `${c.nombre}: compila con gfortran y corre (${f90.split("\n").length} líneas)`);
  console.log("      " + salida.trim().split("\n").join("\n      "));
  const num = (re) => { const m = salida.match(re); return m ? m.slice(1).map(Number) : null; };
  if (esperado.max !== undefined) {
    const got = num(/(?:M22|M3|FMax) max =\s+(\S+)/);
    ok(got && Math.abs(got[0] - esperado.max) <= 1e-6 * Math.abs(esperado.max), `${c.nombre}: máximo Fortran ${got?.[0]} = modelo ${esperado.max}`);
  }
  if (esperado.sumR) {
    const got = num(/Fx Fy Fz \(kN\)\s+=\s+(\S+)\s+(\S+)\s+(\S+)/);
    ok(got && got.every((x, k) => Math.abs(x - esperado.sumR[k]) <= 1e-6 * (Math.abs(esperado.sumR[k]) + 1)), `${c.nombre}: ΣR Fortran ${got?.join(" ")} = modelo ${esperado.sumR.map((x) => x.toFixed(3)).join(" ")}`);
  }
}
ok(errores.length === 0, "0 errores ni diálogos " + errores.join(" | "));
await nav.close();
console.log(fallos ? `${fallos} FALLOS` : "TODO BIEN");
process.exit(fallos ? 1 : 0);
