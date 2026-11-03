/**
 * Importar el e2k «mercado» (ETABS 22, MERCADO 2.EDB): propiedades de sección y peso contra GetSectProps / Material
 * List by Section de ETABS, medidos por OAPI el 3-nov-2026 (unidades N-mm → aquí m, kN).
 *   - Cold Formed C 160x60x15x3 (purlins 1G): A 886.274 mm², J 2658.823, I33 3446011.965, I22 395180.065, As2 462, As3 324.
 *     Antes: C SIN labios y (D−tf)²/12 → A −7 %, I33 −49 %, I22 −73 %.
 *   - Filled Steel Pipe (CFT): el peso lleva el relleno. Antes el área transformada pesaba como acero solo:
 *     CB1/CA1 −4110 kN de 20700 kN de peso propio (Dead 20267 vs 24872 kN de ETABS).
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "e2k-mercado-secciones";
export const descripcion = "e2k mercado: Cold Formed C con labios y peso del relleno de los CFT contra ETABS 22";

export async function correr() {
  const mod = await empaquetar(`export { parseE2k } from "${R}/examples/src/shared/e2kParser";`, "e2k-mercado-secciones");
  const log = console.log, warn = console.warn;
  console.log = () => {}; console.warn = () => {};
  let m; try { m = mod.parseE2k(readFileSync(join(AQUI, "..", "datos", "e2k_mercado_secciones.e2k"), "latin1")); }
  finally { console.log = log; console.warn = warn; }
  const e = m.elementInputs, filas = [];
  const rel = (que, medido, ref, tol) => {
    const d = 100 * (medido - ref) / ref;
    filas.push({ que, crudo: true, medido: `${medido.toPrecision(6)} (${d >= 0 ? "+" : ""}${d.toFixed(2)} %)`, limite: `ETABS ${ref.toPrecision(6)} ±${tol} %`, ok: Math.abs(d) <= tol, detalle: "" });
  };
  const iC = m.elementNames ? [...m.elementNames.entries?.() ?? []].findIndex(([, n]) => n === "B2") : 1;
  const k = iC >= 0 ? iC : 1;
  // Cold Formed C 160x60x15x3 (mm² → m², mm⁴ → m⁴)
  rel("1G 160x60x15x3  A", e.areas.get(k), 886.274e-6, 0.01);
  rel("1G 160x60x15x3  J", e.torsionalConstants.get(k), 2658.823e-12, 0.01);
  rel("1G 160x60x15x3  I33 (fuerte)", e.momentsOfInertiaZ.get(k), 3446011.965e-12, 1);
  rel("1G 160x60x15x3  I22 (débil)", e.momentsOfInertiaY.get(k), 395180.065e-12, 3);
  rel("1G 160x60x15x3  As2 (alma)", e.shearAreasY.get(k), 462e-6, 0.01);
  rel("1G 160x60x15x3  As3 (alas)", e.shearAreasZ.get(k), 324e-6, 0.01);
  // CFT CB1 300x6 rellena de f'c=240: peso por metro = acero + hormigón (ETABS: A·γ real, no el área transformada con γ del acero)
  const g = 9.80665, k0 = 0;
  const As = Math.PI / 4 * (0.3 ** 2 - 0.288 ** 2), Ac = Math.PI / 4 * 0.288 ** 2;
  const pesoReal = As * 76.972865 + Ac * 23.563121;                 // kN/m
  const pesoHek = e.densities.get(k0) * g * e.areas.get(k0);        // densities = masa (t/m³)
  rel("CB1 300x6 CFT  peso kN/m (acero + relleno)", pesoHek, pesoReal, 0.05);
  return filas;
}
