/**
 * E2K: UN VANO (6 x 6 m) contra ETABS 22 (OAPI), con las propiedades del galpon del mercado: 4 columnas CC 1 200x6 (empotradas), VP I530X15+I150X6
 * en y=0 e y=6 (CARDINALPT 8), correas 1G 160x60x15x3 articuladas (RELEASE TI M2I M2J M3I M3J) cada 1 m, membrana A36 4 mm ONEWAYLOADDIST,
 * pendiente 3 %, Dead 0.392 / Live 0.686 kN/m2 y cargas laterales de 1 kN en los nudos de y=6. Generador: `tests/datos/e2k_vano_simple_genera_etabs.py`.
 *   A     : 6 panos de 1x6 m, correas ENTERAS (sus nudos solo en los bordes de los panos: sin nudos colgados).
 *   A1m   : lo mismo con correas partidas cada 1 m -> 5 nudos por borde que CUELGAN del lado de cada pano.
 *   B     : sobrecubierta: x 0..3 panos 1x6, x 3..6 panos 1x4 (y 1..5) + cordones Tubo 50 (y=1 e y=5) -> nudos (3,1),(3,5) y los de la correa x=3 cuelgan (caso x=30 m).
 *   Baddr : B con ADDRESTRAINT "Yes" en las areas (importando el e2k editado en ETABS).
 * HALLAZGO: en estos casos el desplazamiento y las reacciones de ETABS NO dependen del edge constraint (B y Baddr: identicos a 12 cifras) y la malla de la
 * membrana (1 Q4, partida en nudos, tamMembrana 1.25) tampoco cambia el resultado de Hekatan: la membrana casi no trabaja (traslacion rigida del techo, sin cortante).
 */
import { cargarMod, medir } from "../lib/vano_cmp.mjs";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "e2k-vano-simple";
export const descripcion = "e2k: un vano 6x6 del galpon vs ETABS 22 (correas enteras/1 m, sobrecubierta con nudos colgados, ADDRESTRAINT, mallas de la membrana)";

export async function correr() {
  const mod = await cargarMod();
  const filas = [];
  const fila = (que, medido, limite, ok, detalle = "") => filas.push({ que, crudo: true, medido, limite, ok, detalle });
  const f = (x, n = 4) => x.toFixed(n);
  const vars = [["A", "correas enteras, sin nudos colgados"], ["A1m", "correas cada 1 m (nudos colgados del borde de los panos 1x6)"], ["B", "sobrecubierta 1x4 + Tubo 50 (nudos colgados en x=3)"]];
  const mallas = [["1 Q4 por pano", { membranaEnNudos: false }], ["membranaEnNudos (defecto)", {}], ["tamMembrana 1.25", { tamMembrana: 1.25 }]];
  const U = {};
  for (const [v, desc] of vars) for (const [mn, opc] of mallas) {
    const m = await medir(mod, v, opc);
    U[`${v}|${mn}`] = m;
    for (const pat of ["Dead", "Live", "LATX", "LATY"]) {
      const d = m.pat[pat];
      const lat = pat.startsWith("LAT");
      // Ux/Uy de Dead y Live valen ~0.001 mm: se mide el peor nudo en mm (el rms relativo de un ruido no dice nada)
      const lim = lat ? [0.05, 0.05, 0.002] : [0.002, 0.005, 0.06];
      const nom = `${v} ${mn} ${pat}`;
      fila(`${nom}: peor nudo |Ux|/|Uy|/|Uz| (mm, 4 dec.)`, `${f(d.peor[0])} / ${f(d.peor[1])} / ${f(d.peor[2])}  (max ETABS ${f(d.max[0], 3)} / ${f(d.max[1], 3)} / ${f(d.max[2], 3)}; rms ${f(d.U[0], 2)} / ${f(d.U[1], 2)} / ${f(d.U[2], 2)} %)`,
        `<= ${lim[0]} / ${lim[1]} / ${lim[2]} mm`, d.peor[0] <= lim[0] && d.peor[1] <= lim[1] && d.peor[2] <= lim[2], desc);
      fila(`${nom}: suma de reacciones (Fx/Fy/Fz) Hek vs ETABS`, `${d.Rtot.map((x) => f(x, 3)).join(" / ")} vs ${d.Etot.map((x) => f(x, 3)).join(" / ")} kN`, "|dif| <= 0.02 kN", d.Rtot.every((x, k) => Math.abs(x - d.Etot[k]) <= 0.02), `reacciones nudo a nudo rms Fx/Fy/Fz ${d.R.map((x) => f(x, 2)).join(" / ")} %`);
    }
  }
  // empuje horizontal de la pendiente 3 % y axil de los cordones Tubo 50 (B, lateral X): ETABS 0.08/0.10/0.03 kN vs Hek ~0.12/0.13/0.10
  { const d = U["B|membranaEnNudos (defecto)"].pat.LATX, ts = d.axil.filter((a) => a.sec.startsWith("Tubo")), w = Math.max(...ts.map((a) => Math.abs(a.hek - a.etabs)));
    fila("B LATX: axil de los 6 cordones Tubo 50 (peor |Hek - ETABS|)", `${f(w)} kN de ${f(Math.max(...ts.map((a) => a.etabs)))} kN (carga lateral 7 kN)`, "<= 0.10 kN", w <= 0.10, "residuo 1 % de la carga, la membrana casi no trabaja; abierto"); }
  // la malla de la membrana no cambia a Hekatan (el vano no la solicita): mismo Uz en B con las 3 mallas
  { const a = U["B|1 Q4 por pano"].pat.Live, b = U["B|tamMembrana 1.25"].pat.Live;
    fila("B Live: Uz del peor nudo igual con 1 Q4 y con tamMembrana 1.25", `${f(a.peor[2])} / ${f(b.peor[2])} mm`, "dif <= 0.001 mm", Math.abs(a.peor[2] - b.peor[2]) <= 0.001, "documenta: el vano no discrimina la malla (hace falta cortante en el plano)"); }
  // ETABS: ADDRESTRAINT Yes/No identico en las referencias (B vs Baddr)
  { const rb = JSON.parse(readFileSync(join(AQUI, "..", "datos", "e2k_vano_simple_B_ref.json"), "utf-8")), ra = JSON.parse(readFileSync(join(AQUI, "..", "datos", "e2k_vano_simple_Baddr_ref.json"), "utf-8"));
    const k3 = (p) => p.map((v) => Math.round(v * 1000)).join("|"), pa = new Map(Object.entries(ra.pts).map(([n, p]) => [k3(p), n]));
    let w = 0; for (const pat of ["Dead", "Live", "LATX", "LATY"]) for (const [k, v] of Object.entries(rb.JointDispl[pat])) { const o = ra.JointDispl[pat][pa.get(k3(rb.pts[k]))]; for (let i = 0; i < 3; i++) w = Math.max(w, Math.abs(v[i] - o[i])); }
    fila("ETABS: ADDRESTRAINT Yes vs No en B, peor |dU| de todos los nudos y patrones", `${w.toExponential(1)} m`, "<= 1e-7 m (0.0001 mm)", w <= 1e-7, "el edge constraint no cambia nada en este vano"); }
  return filas;
}
