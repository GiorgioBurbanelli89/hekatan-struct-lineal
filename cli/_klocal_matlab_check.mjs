// Comprueba el script MATLAB de la K local de barra (📄 K local .m) contra el MOTOR:
//   1. puppeteer abre un ejemplo con barras y pide el .m de varias barras (window.__hekatanKLocalMatlab)
//   2. MATLAB R2017a (el de verdad, no Octave) ejecuta los .m en UNA sesion y vuelca K a CSV (17 cifras)
//   3. el oráculo es el C++ del motor: didactic_solve → getLocalStiffnessMatrix con los MISMOS datos
//      (sin liberaciones ni muelles: didactic no los recibe; esas barras se marcan aparte)
// Uso: node cli/_klocal_matlab_check.mjs [ejemplo] [url base]  → cli/shots/klocal/*.m, *.csv
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { cargarFem } from "../tests/lib/bundle.mjs";
const ejemplo = process.argv[2] || "plantillas";
const base = process.argv[3] || "http://localhost:4600/workspace/";
const out = path.resolve("cli/shots/klocal"); fs.mkdirSync(out, { recursive: true });
const MATLAB = "C:/Program Files/MATLAB/R2017a/bin/matlab.exe";

const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 900 });
const errores = []; pag.on("pageerror", (e) => errores.push(String(e).slice(0, 200)));
await pag.goto(`${base}?t=${ejemplo}`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx && !!window.__hekatanKLocalMatlab, { timeout: 120000 });
await new Promise((r) => setTimeout(r, 5000));

// barras a probar: la primera, una del medio, la última, y (si hay) una con liberaciones y una con As explícita
const datos = await pag.evaluate(() => {
  const h = document.querySelector("#viewer"); const m = h.__mesh || h.__ctx?.mesh;
  return null;
});
const lista = await pag.evaluate(() => {
  const fn = window.__hekatanKLocalMatlab;
  // el mesh lo tiene la ventana del diagrama; se recorren índices hasta que falle
  const barras = [];
  for (let i = 0; i < 5000; i++) {
    try { const s = fn(i); if (s) barras.push(i); } catch (e) { if (!/no es una barra/.test(String(e))) break; }
  }
  return barras;
});
console.log(`${ejemplo}: ${lista.length} barras`);
if (!lista.length) { console.log("FALLA: no hay barras"); await nav.close(); process.exit(1); }
const elegir = [...new Set([lista[0], lista[Math.floor(lista.length / 2)], lista[lista.length - 1]])];

const casos = [];
for (const idx of elegir) {
  const r = await pag.evaluate((idx) => window.__hekatanKLocalMatlab(idx), idx);
  const f = path.join(out, r.nombre); fs.writeFileSync(f, r.texto);
  // los datos que el script lleva escritos (para dárselos al oráculo)
  const g = (k) => { const m = r.texto.match(new RegExp(`^${k}\\s*=\\s*([^;]+);`, "m")); return m ? m[1].trim() : null; };
  const vec = (k) => g(k).replace(/[\[\]]/g, "").trim().split(/\s+/).map(Number);
  casos.push({ idx, f, xi: vec("xi"), xj: vec("xj"), E: +g("E"), G: +g("G"), A: +g("A"), Iz: +g("Iz"), Iy: +g("Iy"), J: +g("J"),
    AsY: +g("AsY"), AsZ: +g("AsZ"), libera: /Liberaciones/.test(r.texto), muelles: /Muelles de empotramiento/.test(r.texto) });
}
console.log("pageerror:", errores.length, errores.slice(0, 2));
await nav.close();

// MATLAB arranca lento (~20 s): todos los .m en una sola sesion
const cmds = casos.map((c) => { const f = c.f.replace(/\\/g, "/"); return `clear K; run('${f}'); dlmwrite('${f.replace(/\.m$/, ".csv")}', K, 'precision', 17);`; }).join(" ");
const log = path.join(out, "matlab_log.txt");
for (const c of casos) { try { fs.unlinkSync(c.f.replace(/\.m$/, ".csv")); } catch {} }
execFileSync(MATLAB, ["-nodesktop", "-nosplash", "-wait", "-logfile", log, "-r", `try, ${cmds} disp('MATLAB_OK'); catch e, disp(['MATLAB_ERROR: ' e.message]); end; exit`], { stdio: "ignore", timeout: 600000 });
const txtLog = fs.readFileSync(log, "utf8");
if (!/MATLAB_OK/.test(txtLog)) { console.log("FALLA MATLAB:", txtLog.split(String.fromCharCode(10)).filter((l) => /ERROR|Error/.test(l)).join(" | ")); process.exit(1); }
console.log("MATLAB R2017a: los", casos.length, "scripts corrieron sin error");
const fem = await cargarFem();
let peor = 0, ok = true;
for (const c of casos) {
  const csv = c.f.replace(/\.m$/, ".csv").replace(/\\/g, "/");
  const Koct = fs.readFileSync(csv, "utf8").trim().split(/\r?\n/).map((l) => l.split(",").map(Number));
  const M = (v) => new Map([[0, v]]);
  const res = fem.didacticSolveCpp([c.xi, c.xj], [[0, 1]], { supports: new Map([[0, [true, true, true, true, true, true]]]) },
    { elasticities: M(c.E), shearModuli: M(c.G), areas: M(c.A), momentsOfInertiaZ: M(c.Iz), momentsOfInertiaY: M(c.Iy),
      torsionalConstants: M(c.J), shearAreasY: M(c.AsY), shearAreasZ: M(c.AsZ) });
  const Kc = res.elements[0].K_local;
  let maxK = 0, maxD = 0, dondeD = "";
  for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) {
    maxK = Math.max(maxK, Math.abs(Kc[i][j]));
    const d = Math.abs(Koct[i][j] - Kc[i][j]);
    if (d > maxD) { maxD = d; dondeD = `(${i + 1},${j + 1}) matlab ${Koct[i][j]} motor ${Kc[i][j]}`; }
  }
  const rel = maxD / (maxK || 1);
  const comparable = !c.libera && !c.muelles;
  if (comparable) { peor = Math.max(peor, rel); if (rel > 1e-10) ok = false; }
  console.log(`barra ${c.idx + 1}: L=${Math.hypot(...c.xj.map((v, k) => v - c.xi[k])).toFixed(3)} E=${c.E} A=${c.A} Iz=${c.Iz} AsZ=${c.AsZ}` +
    ` · max|K|=${maxK.toExponential(4)} · dif máx relativa=${rel.toExponential(2)} ${dondeD}` +
    (comparable ? "" : "  [con liberaciones/muelles: el oráculo didáctico no los recibe → no comparable]"));
}
console.log(ok ? `OK: MATLAB R2017a (.m) = motor C++ (peor ${peor.toExponential(2)})` : "FALLA");
process.exit(ok ? 0 : 1);
