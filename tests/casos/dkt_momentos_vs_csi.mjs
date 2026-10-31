/**
 * DKT: MOMENTOS del triangulo Shell-Thin contra SAP2000 24 y ETABS 22 (30-oct-2026).
 *
 * Antes el triangulo reportaba el campo CST (constante, sin flexion de placa): Mxx centro 2166.9 donde
 * CSI da 1662.8. Ahora `analyze` usa la B del DKT en los 3 nudos (utils/dktJoints.ts).
 * Referencia: SAP2000 24 (Plate-Thin) y ETABS 22 (Shell-Thin, NOAUTOMESH) por OAPI, triangulo escaleno
 * (0,0) (2,0.5) (0.5,1.5), t = 0.1, E = 24850000, nu = 0.2, desplazamientos impuestos de
 * w = x³/6 + x·y²/2 (hoja `hekatan-school/PLACAS_BATOZ/placa_DKT.lisp`). Aqui se aplican como CARGAS
 * (las reacciones de SAP) con el nudo 1 fijo: los desplazamientos reproducen los impuestos.
 */
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolverHeks } from "../lib/heks.mjs";

export const nombre = "dkt-momentos-vs-csi";
export const descripcion = "Shell-Thin triangulo (DKT): M11/M22/M12 en los 3 joints = SAP2000 y ETABS";

const fThin = [3644.278276, -82.364302, -555.595142, -2513.109557, 642.343285, -3290.592954, -1131.168719, 2393.328875, -1745.615377];
const P = [[0, 0], [2, 0.5], [0.5, 1.5]];
const SAP = [[-611.491059, -740.226019, 836.777239], [5144.695506, 4237.836331, 700.908084], [455.257503, 1573.941943, 2153.497718]];
const ETABS = [[-611.490864, -740.226179, 836.777226], [5144.69518, 4237.835935, 700.908183], [455.257903, 1573.942229, 2153.497644]];

async function resolver(tipo) {
  const f = fThin;
  const L = P.map((p, i) => `node ${i + 1} ${p[0]} ${p[1]} 0`);
  L.push("tri 1 1 2 3 0.1 24850000", `shelltype 1 ${tipo}`);
  P.forEach((_, i) => L.push(`support ${i + 1} ux uy rz` + (i === 0 ? " uz rx ry" : "")));
  for (let i = 1; i < 3; i++) L.push(`load ${i + 1} 0 0 ${f[3 * i]} ${f[3 * i + 1]} ${f[3 * i + 2]} 0`);
  L.push("solve", "");
  const fp = join(mkdtempSync(join(tmpdir(), "dkt-")), "dkt.heks"); writeFileSync(fp, L.join("\n"));
  return (await resolverHeks(fp)).analyzeOutputs;
}

export async function correr() {
  const a = await resolver("thin");
  const med = [a.bendingXXjoint.get(0), a.bendingYYjoint.get(0), a.bendingXYjoint.get(0)];   // [campo][nudo]
  const filas = [];
  for (const [nom, ref] of [["SAP2000", SAP], ["ETABS", ETABS]]) {
    let num = 0, den = 0;
    for (let n = 0; n < 3; n++) for (let c = 0; c < 3; c++) { num += (med[c][n] - ref[n][c]) ** 2; den += ref[n][c] ** 2; }
    const e = 100 * Math.sqrt(num / den);
    filas.push({ que: `DKT M11/M22/M12 en los 3 joints vs ${nom}`, medido: e, limite: 0.001, ok: e <= 0.001, detalle: "% norma, signo CSI" });
  }
  const cen = a.bendingXXcentro.get(0);
  filas.push({ que: "Mxx centroide = media de los joints (SAP 1662.82)", medido: Math.abs(cen - 1662.8206) / 1662.8206 * 100, limite: 0.001, ok: Math.abs(cen - 1662.8206) / 1662.8206 * 100 <= 0.001, detalle: `${cen.toFixed(4)}` });
  // cortante V13/V23 del Shell-Thin (SAP2000: constante en el elemento, V = -(dM11/dx+dM12/dy), -(dM22/dy+dM12/dx))
  const vx = a.tranverseShearXjoint?.get(0)?.[0], vy = a.tranverseShearYjoint?.get(0)?.[0];
  const ev = 100 * Math.hypot(vx - (-3928.102218), vy - (-464.414828)) / Math.hypot(3928.102218, 464.414828);
  filas.push({ que: "DKT V13/V23 vs SAP2000 (-3928.1022, -464.4148)", medido: ev, limite: 0.001, ok: ev <= 0.001, detalle: `${vx?.toFixed(4)}, ${vy?.toFixed(4)}` });
  return filas;
}
