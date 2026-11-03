// GALPÓN CURVO PARAMÉTRICO: el generador escribe el dibujo (nudos, barras, áreas, secciones, cargas) y new-blank lo resuelve.
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", channel: "chrome", args: ["--no-sandbox"] });
const p = await b.newPage(); await p.setViewport({ width: 1500, height: 1000 });
const err = [], logs = []; p.on("pageerror", (e) => err.push(e.message)); p.on("console", (m) => logs.push(m.text()));
await p.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2" });
const w = (ms) => new Promise((r) => setTimeout(r, ms)); await w(5000);
let ok = 0, mal = 0; const check = (n, c, d = "") => { c ? ok++ : mal++; console.log((c ? "  ✓ " : "  ✗ ") + n + (d ? "  " + d : "")); };
const gen = (P) => p.evaluate((P) => window.__hekatanGalponCurvo(P), P);
const cuenta = () => p.evaluate(() => ({ col: window.__hekatanSelectByDir("columnas"), por: window.__hekatanSelectByDir("porticos"), cor: window.__hekatanSelectByDir("correas"),
  dia: window.__hekatanSelectByDir("diagonales"), cub: window.__hekatanSelectByDir("cubierta"), zap: window.__hekatanSelectByDir("zapatas"),
  sec: window.__hekatanManualSections.size, apoyos: window.__hekatanManualSupports.size, dist: window.__hekatanManualDistLoads.size }));
// 1) por defecto = el galpón dibujado a mano: 3 pórticos, arco de 12 tramos
const r = await gen({});
console.log("  defecto →", JSON.stringify(r));
check("3 pórticos, 69 nudos (45 + 24 de zapatas)", r.porticos === 3 && r.nudos === 69, JSON.stringify(r));
let c = await cuenta(); console.log("  ", JSON.stringify(c));
check("6 columnas, 36 tramos de arco, 26 correas, 48 diagonales", c.col === 6 && c.por === 36 && c.cor === 26 && c.dia === 48);
check("24 paños de cubierta y 6 zapatas", c.cub === 24 && c.zap === 6);
check("cada barra con su sección CHS (6+36+26+48 = 116)", c.sec === 116, String(c.sec));
check("carga en los 36 tramos de arco", c.dist === 36);
// 2) la geometría responde a los parámetros
await gen({ luz: 30, flecha: 8, nSeg: 16, nPorticos: 5, sep: 5, hCol: 4 });
c = await cuenta();
check("5 pórticos × 16 tramos: 80 tramos de arco, 10 columnas, 4×17 = 68 correas", c.por === 80 && c.col === 10 && c.cor === 68, JSON.stringify(c));
const alt = await p.evaluate(() => { const pts = window.__hekatanDrawingPoints.val; return { zMax: Math.max(...pts.map((q) => q[2])), xMin: Math.min(...pts.map((q) => q[0])), yMax: Math.max(...pts.map((q) => q[1])) }; });
check("cima a hCol + flecha = 12; luz 30 y largo 4 × 5 = 20 (las zapatas de 2 m sobresalen 1 m: x = −16, y = 21)", Math.abs(alt.zMax - 12) < 1e-6 && alt.xMin === -16 && alt.yMax === 21, JSON.stringify(alt));
// 3) diagonales cada 2 vanos, sin zapata (apoyos en la base), sin cubierta
await gen({ nPorticos: 4, diagCadaN: 2, zapataLado: 0, cubierta: false, empotrado: true });
c = await cuenta();
check("4 pórticos, diagonales solo en los vanos 1 y 3 = 2×12×2 = 48, sin áreas, 8 apoyos empotrados", c.dia === 48 && c.cub === 0 && c.zap === 0 && c.apoyos === 8, JSON.stringify(c));
// 4) se resuelve: con zapatas y suelo el modelo da «Solve OK»
logs.length = 0; await gen({ nPorticos: 3 }); await w(2500);
const solve = logs.filter((l) => /Solve OK/.test(l)).slice(-1)[0] || "";
const fallo = logs.filter((l) => /Solver falló|LDLT failed/.test(l));
console.log("  " + (solve || logs.filter((l) => /NewBlank/.test(l)).slice(-1)[0]));
check("el modelo resuelve (Solve OK) sin avisos de matriz singular", /Solve OK/.test(solve) && fallo.length === 0, fallo.join(" | "));
check("sin errores de página", err.length === 0, err.join(" | "));
console.log(`\n${ok} ok · ${mal} fallan`);
await b.close(); process.exit(mal ? 1 : 0);
