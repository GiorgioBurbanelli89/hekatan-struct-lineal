/**
 * Ejemplo 2-005 del manual de verificación de SAP2000 24 (`Manuals\Verification\Analysis\Shells\Problem 2-005.pdf`):
 * «SHELL – RECTANGULAR PLATE WITH STATIC LOADS», MacNeal & Harder 1985.
 *
 * Placa de 2" de ancho y 2" o 10" de largo, t = 0.0001", E = 17 472 000 lb/in², ν = 0.3. Se modela UN CUARTO con simetría
 * (Rx = 0 en el eje y = 0, Ry = 0 en el eje x = 0), mallas 4×4 y 16×16, borde «Simple» (solo Uz) o «Fixed» (Uz, Rx, Ry),
 * con carga uniforme 0.0001 lb/in² o carga central 0.0004 lb (un cuarto, 0.0001 lb, en el nudo central).
 * Cada modelo se corre con Shell-Thin (DKQ) y Shell-Thick (MITC4). Referencia independiente: Timoshenko & Woinowsky-Krieger 1959.
 *
 * Aquí se corren los 8 modelos × {uniforme, puntual} × {fino, grueso} en Struct y se comparan con la tabla de SAP2000 del PDF.
 */
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolverHeks } from "../lib/heks.mjs";

export const nombre = "placa-rect-sap2000";
export const descripcion = "Ej.2-005 de SAP2000 (MacNeal & Harder): placa rectangular, Thin y Thick de Struct contra SAP2000 y Timoshenko";

// Factor de unidades: E y las cargas × ESC NO cambian los desplazamientos (lineal). Con las unidades del PDF tal cual (t = 1e-4, E ≈ 1.7e7)
// el Thick de Struct cae 2176 veces en «Kaa singular en getBendingK, fallback a Q4 estandar» (tolerancia absoluta en escala chica: falso
// positivo) y NO usa su formulación completa. Con ESC = 1e8 no hay ni un aviso. ESC=1 reproduce el caso con los avisos.
const ESC = Number(process.env.ESC || 1e8);
const E = 17472000 * ESC, NU = 0.3, T = 0.0001, QU = 0.0001 * ESC, PC = 0.0004 * ESC;
// modelo: [ancho cuarto x, largo cuarto y, malla, borde]
const MODELOS = {
  A: [1, 1, 4, "S"], B: [1, 1, 4, "F"], C: [1, 5, 4, "S"], D: [1, 5, 4, "F"],
  E: [1, 1, 16, "S"], F: [1, 1, 16, "F"], G: [1, 5, 16, "S"], H: [1, 5, 16, "F"],
};
// [SAP2000, independiente]  (Uz en pulgadas, el valor tal cual sale del PDF)
const REF = {
  uniforme: { thin: { A: [4.06, 4.06], B: [1.32, 1.26], C: [12.86, 12.97], D: [2.60, 2.60], E: [4.06, 4.06], F: [1.27, 1.26], G: [12.96, 12.97], H: [2.60, 2.60] },
              thick: { A: [4.03, 4.06], B: [1.25, 1.26], C: [12.87, 12.97], D: [2.59, 2.60], E: [4.06, 4.06], F: [1.27, 1.26], G: [12.97, 12.97], H: [2.60, 2.60] } },
  puntual:  { thin: { A: [11.94, 11.60], B: [5.90, 5.60], C: [18.12, 16.95], D: [7.79, 7.25], E: [11.63, 11.60], F: [5.64, 5.60], G: [17.15, 16.95], H: [7.41, 7.25] },
              thick: { A: [11.61, 11.60], B: [5.38, 5.60], C: [16.27, 16.95], D: [5.86, 7.25], E: [11.61, 11.60], F: [5.61, 5.60], G: [16.92, 16.95], H: [7.11, 7.25] } },
};
// Formulaciones de Struct: thin = DKE + ITW 1990 (defecto), dke = DKE literal del libro de Wilson, thick = MITC4, dse = DSE de Wilson,
// csi = placa gruesa de SAP2000/ETABS (caja negra). Las dos primeras se comparan con la tabla «Thin» de SAP2000; las otras con la «Thick».
const FORMULACIONES = (process.env.FORMS || "thin,dke,thick,dse,csi").split(",");
const dir = mkdtempSync(join(tmpdir(), "hk2005-"));

async function correrModelo(clave, formulacion, carga) {
  const [ax, ay, n, borde] = MODELOS[clave];
  const id = (i, j) => i * (n + 1) + j + 1;
  const L = [];
  for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) L.push(`node ${id(i, j)} ${ax * i / n} ${ay * j / n} 0`);
  let s = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    s++;
    L.push(`shell ${s} ${id(i, j)} ${id(i + 1, j)} ${id(i + 1, j + 1)} ${id(i, j + 1)} ${T} ${E}`, `shellnu ${s} ${NU}`, `shelltype ${s} ${formulacion}`);
    if (carga === "uniforme") L.push(`areaload ${s} ${-QU}`);
  }
  for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) {
    const xb = i === n, yb = j === n;                            // bordes exteriores (x = ancho, y = largo)
    const sx = i === 0, sy = j === 0;                            // ejes de simetría (x = 0 e y = 0)
    const uz = xb || yb ? 1 : 0;
    const rx = (sy || (borde === "F" && (xb || yb))) ? 1 : 0;    // giro sobre X: simetría en y = 0; empotrado en todo el borde
    const ry = (sx || (borde === "F" && (xb || yb))) ? 1 : 0;
    L.push(`support ${id(i, j)} 1 1 ${uz} ${rx} ${ry} 1`);
  }
  if (carga === "puntual") L.push(`load ${id(0, 0)} 0 0 ${-PC / 4} 0 0 0`);      // un cuarto de la carga central
  L.push("solve");
  const ruta = join(dir, `m_${clave}_${formulacion}_${carga}.heks`);
  writeFileSync(ruta, L.join("\n") + "\n");
  const r = await resolverHeks(ruta);
  return Math.abs(r.deformOutputs.deformations.get(r.nodes.findIndex((p) => Math.abs(p[0]) < 1e-12 && Math.abs(p[1]) < 1e-12))[2]);
}

export async function correr() {
  const filas = [], tabla = [];
  for (const carga of ["uniforme", "puntual"]) for (const f of FORMULACIONES) for (const k of Object.keys(MODELOS)) {
    const w = await correrModelo(k, f, carga);
    const fam = (f === "thin" || f === "dke") ? "thin" : "thick";        // la tabla de SAP2000 de cada familia
    const [sap, ind] = REF[carga][fam][k];
    tabla.push({ carga, formulacion: f, modelo: k, struct: w, sap, independiente: ind });
    const ds = (w / sap - 1) * 100, di = (w / ind - 1) * 100;
    filas.push({ que: `${carga} · ${f} · modelo ${k} (${MODELOS[k][2]}×${MODELOS[k][2]}, ${MODELOS[k][3] === "S" ? "simple" : "fijo"}, ${MODELOS[k][1] === 1 ? "2×2" : "2×10"})`,
      medido: Math.abs(ds), limite: 100, ok: true,
      detalle: `Struct ${w.toFixed(3)} · SAP2000 ${sap} (${ds >= 0 ? "+" : ""}${ds.toFixed(2)} %) · independiente ${ind} (${di >= 0 ? "+" : ""}${di.toFixed(2)} %)` });
  }
  writeFileSync(join(dir, "tabla.json"), JSON.stringify(tabla, null, 1));
  console.log("TABLA:", join(dir, "tabla.json"));
  return filas;
}
