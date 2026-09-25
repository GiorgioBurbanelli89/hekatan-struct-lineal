// Diagnóstico v2: formato SAP2000 key=value (no CSV). Cuentas por tabla.
import { readFileSync } from "fs";
const f = process.argv[2] ?? "C:\\Users\\j-b-j\\Downloads\\Cancha Parque v24.s2k";
const txt = readFileSync(f, "utf8");
const lineas = txt.split(/\r?\n/);

const conteo = {};            // tabla -> nº de filas de datos
let tabla = "";
const filasPorTabla = {};
for (const l of lineas) {
  const m = l.match(/^TABLE:\s*"([^"]+)"/);
  if (m) { tabla = m[1]; continue; }
  if (!tabla || /^\s*$/.test(l)) continue;
  if (/^\s*GRID\s|\^\s*$/.test(l)) continue;          // línea de campos (empieza con ^)
  if (/^\s*\w+=/.test(l)) {                            // fila de datos key=value
    conteo[tabla] = (conteo[tabla] ?? 0) + 1;
    (filasPorTabla[tabla] ??= []).push(l);
  }
}
const tablasLoad = Object.entries(conteo).filter(([t]) => /LOAD|WEIGHT|MASS/i.test(t));
console.log("== tablas con LOAD/WEIGHT/MASS ==");
for (const [t, n] of tablasLoad) console.log(`  ${n}\t${t}`);

const fl = filasPorTabla["FRAME LOADS - DISTRIBUTED"] ?? [];
const fu = filasPorTabla["FRAME LOADS - UNIFORM"] ?? [];
const parse = (l) => Object.fromEntries([...l.matchAll(/(\w+)=("[^"]*"|\S+)/g)]
  .map((m) => [m[1], m[2].replace(/^"|"$/g, "")]));

// frames definidos
const frames = new Set((filasPorTabla["CONNECTIVITY - FRAME"] ?? [])
  .map((l) => parse(l).Frame).filter(Boolean));

// ¿cómo se reparten las cargas?
const resumen = (filas, etiqueta) => {
  const porPatron = {}, conFrame = new Set(), rangos = [], muestra = [];
  for (const l of filas) {
    const p = parse(l);
    porPatron[p.LoadPat ?? p.LoadPattern ?? "?"] = (porPatron[p.LoadPat ?? p.LoadPattern ?? "?"] ?? 0) + 1;
    if (p.Frame) conFrame.add(p.Frame);
    if ((p.RangeType ?? "").toLowerCase() !== "none" && p.RangeType) rangos.push(l.trim().slice(0, 160));
    if (muestra.length < 3) muestra.push(l.trim().slice(0, 200));
  }
  const sinCarga = [...frames].filter((n) => !conFrame.has(n));
  return { etiqueta, filas: filas.length, porPatron, framesDistintosConFila: conFrame.size,
    framesDefinidos: frames.size, framesSinFila: sinCarga.length,
    ejemplosSinFila: sinCarga.slice(0, 12), filasConRango: rangos.length,
    ejemplosRango: rangos.slice(0, 4), muestra };
};
if (fl.length) console.log("\n== FRAME LOADS - DISTRIBUTED ==\n" + JSON.stringify(resumen(fl, "dist"), null, 1));
if (fu.length) console.log("\n== FRAME LOADS - UNIFORM ==\n" + JSON.stringify(resumen(fu, "uni"), null, 1));
