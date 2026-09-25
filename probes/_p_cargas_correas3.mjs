// ¿Quiénes son las 186 barras con carga? (¿correas?) ¿y las 1093 sin carga?
import { readFileSync } from "fs";
const f = process.argv[2] ?? "C:\\Users\\j-b-j\\Downloads\\Cancha Parque v24.s2k";
const lineas = readFileSync(f, "utf8").split(/\r?\n/);
const parse = (l) => Object.fromEntries([...l.matchAll(/(\w+)=("[^"]*"|\S+)/g)]
  .map((m) => [m[1], m[2].replace(/^"|"$/g, "")]));
let tabla = "", filas = {};
for (const l of lineas) {
  const m = l.match(/^TABLE:\s*"([^"]+)"/);
  if (m) { tabla = m[1]; continue; }
  if (tabla && /^\s*\w+=/.test(l)) (filas[tabla] ??= []).push(l);
}
const conn = (filas["CONNECTIVITY - FRAME"] ?? []).map(parse);
const sec = (filas["FRAME SECTION ASSIGNMENTS"] ?? []).map(parse);
const conCarga = new Set((filas["FRAME LOADS - DISTRIBUTED"] ?? []).map((l) => parse(l).Frame));
const secDe = Object.fromEntries(sec.map((s) => [s.Frame, s.FrameSec ?? s.Section]));

const agrupa = (sel) => {
  const c = {};
  for (const fr of conn) if (sel(fr)) {
    const k = `${secDe[fr.Frame] ?? "?"} L=${(+fr.Length).toFixed(2)}`;
    c[k] = (c[k] ?? 0) + 1;
  }
  return c;
};
const conC = conn.filter((f) => conCarga.has(f.Frame));
const sinC = conn.filter((f) => !conCarga.has(f.Frame));
console.log("CON carga:", conC.length, "\n", JSON.stringify(agrupa(() => true) && (() => {
  const c = {}; for (const fr of conC) { const k = `${secDe[fr.Frame] ?? "?"} L=${(+fr.Length).toFixed(2)}`; c[k] = (c[k] ?? 0) + 1; } return c;
})(), null, 1));
console.log("SIN carga:", sinC.length, "\n", JSON.stringify((() => {
  const c = {}; for (const fr of sinC) { const k = `${secDe[fr.Frame] ?? "?"} L=${(+fr.Length).toFixed(2)}`; c[k] = (c[k] ?? 0) + 1; } return c;
})(), null, 1));
// rangos de nombres: ¿las cargas caen en un bloque numérico continuo?
const nums = conC.map((f) => +f.Frame).sort((a, b) => a - b);
console.log("frames con carga: min", nums[0], "max", nums[nums.length - 1]);
let tramos = [], ini = nums[0], prev = nums[0];
for (const n of nums.slice(1)) { if (n !== prev + 1) { tramos.push([ini, prev]); ini = n; } prev = n; }
tramos.push([ini, prev]);
console.log("tramos:", JSON.stringify(tramos.slice(0, 20)), "total tramos", tramos.length);
// ¿patrones de carga definidos y casos?
console.log("LOAD PATTERNS:", (filas["LOAD PATTERN DEFINITIONS"] ?? []).map((l) => l.trim().slice(0, 90)));
console.log("CASE STATIC ASSIGN:", (filas["CASE - STATIC 1 - LOAD ASSIGNMENTS"] ?? []).map((l) => l.trim().slice(0, 90)));
