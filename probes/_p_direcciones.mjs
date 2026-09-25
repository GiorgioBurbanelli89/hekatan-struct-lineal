// ¿Qué DIRECCIONES traen las cargas del s2k? (Dir, CoordSys, Proj, componentes anguladas)
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
const cuenta = (tabla, campos) => {
  const c = {};
  for (const l of filas[tabla] ?? []) {
    const r = parse(l);
    const k = campos.map((cp) => `${cp}=${r[cp] ?? "-"}`).join(" ");
    c[k] = (c[k] ?? 0) + 1;
  }
  return c;
};
console.log("FRAME LOADS - DISTRIBUTED:", JSON.stringify(cuenta("FRAME LOADS - DISTRIBUTED", ["Dir", "CoordSys", "Proj", "Type"]), null, 1));
console.log("AREA LOADS - UNIFORM:", JSON.stringify(cuenta("AREA LOADS - UNIFORM", ["Dir", "CoordSys"])));
console.log("JOINT LOADS - FORCE (fx/fy/fz != 0):");
let n = 0, horiz = 0, resultant = [];
for (const l of filas["JOINT LOADS - FORCE"] ?? []) {
  const r = parse(l);
  const num = (s) => (s === undefined || s === "" ? 0 : +s);
  const fx = num(r.FX), fy = num(r.FY), fz = num(r.FZ);
  n++;
  if (Math.abs(fx) > 1e-9 || Math.abs(fy) > 1e-9) { horiz++; if (resultant.length < 5) resultant.push(`FX=${fx} FY=${fy} FZ=${fz}`); }
}
console.log(`  total=${n} conHorizontal=${horiz} ejemplos:`, resultant);
// ¿tablas de cargas con dirección que IGNOREMOS?
console.log("TABLAS con LOAD en el nombre:", Object.keys(filas).filter((k) => /LOAD/i.test(k)));
