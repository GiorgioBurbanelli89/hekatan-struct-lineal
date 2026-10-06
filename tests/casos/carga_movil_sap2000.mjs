/**
 * MOVING LOAD (Load Case de SAP2000, líneas de influencia) contra SAP2000 24 por OAPI (5-oct-2026).
 *   CSiRefer cap. XXVI: cada eje en cada punto de carga, los dos sentidos, carga de 0 a su valor (máx = solo lo
 *   positivo, mín = solo lo negativo), uniformes integradas sobre la línea de influencia lineal a trozos.
 * Viga continua 2 × 20 m (barras de 1 m, carril = las 40 barras, discretización 1 m). Casos:
 *   MLC camión 35/145/145 kN a 4.3/4.3 m · MLF + carril 9.3 kN/m · MLV separación trasera 4.3–9.0 m · MLU solo uniforme 1 kN/m.
 * Puntos de carga como SAP2000 (medido): el del nudo interior a 0.999·L de la barra anterior («Lane Centerline Points»),
 * la línea se interpola con esas abscisas. Límite 0.01 % del máximo: queda ~1e-5 relativo en la parte UNIFORME (la
 * integral de SAP sale 8e-5 mayor en 8.756; sin explicar) y −0.0036 kN donde SAP da 0 (V2 junto al apoyo central).
 * Referencia: validation/casos-csi/sap_movil.py → sap_movil.json (juez SAP2000).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cargarFem } from "../lib/bundle.mjs";
import { RAIZ } from "../lib/wasm.mjs";
import { modeloViga } from "./multipaso_sap2000.mjs";

export const nombre = "carga-movil-sap2000";
export const descripcion = "Moving Load (líneas de influencia, envolvente máx/mín) = SAP2000: Uz, reacciones, V2, M3";
export async function correr() {
  const fem = await cargarFem();
  const D = JSON.parse(readFileSync(join(RAIZ, "tests/datos/sap_movil.json"), "utf8"));
  const m = modeloViga(D, D.props);
  const carril = { barras: m.elements.map((_, e) => e) };
  const filas = [];
  for (const [caso, V] of Object.entries(D.modelo.vehiculos)) {
    const veh = { nombre: V.nombre, ejes: V.ejes, sep: V.sep, unif: V.unif, variable: V.var ? { k: V.var[0], dmax: V.var[1] } : undefined };
    const env = fem.cargaMovilEnvolvente(m.nodes, m.elements, m.nodeInputs, m.elementInputs, carril, [veh], { disc: 1 });
    const S = D.casos[caso];
    const comparar = (que, refs, hek) => {
      let max = 0, peor = 0, donde = "";
      for (const r of refs) max = Math.max(max, Math.abs(r.ref));
      for (const r of refs) { const h = hek(r), d = Math.abs(h - r.ref) / max * 100; if (d > peor || isNaN(d)) { peor = isNaN(d) ? 1e9 : d; donde = `${r.donde}: ${h?.toFixed?.(6)} / ${r.ref.toFixed(6)}`; } }
      filas.push({ que: `${caso} ${que} (% del máx)`, medido: peor, limite: 1e-2, ok: peor <= 1e-2, detalle: donde });
    };
    const refs = (obj, g) => Object.entries(obj).flatMap(([q, d]) => d.tipo.map((t, k) => ({ q: +q, mm: t === "Max" ? 0 : 1, ref: d.v[g][k], donde: `nudo ${q} ${t}` })));
    comparar("Uz", refs(S.disp, 2), (r) => env.disp.get(r.q)[r.mm][2]);
    comparar("Ry", refs(S.disp, 4), (r) => env.disp.get(r.q)[r.mm][4]);
    comparar("Fz", refs(S.reac, 2), (r) => env.reac.get(r.q)[r.mm][2]);
    for (const [c, campo] of [[1, "V2"], [5, "M3"]]) {
      const rr = [];
      for (const [e, F] of Object.entries(S.frame)) F.sta.forEach((sta, k) => {
        const ext = Math.abs(sta) < 1e-9 ? 0 : Math.abs(sta - 1) < 1e-9 ? 1 : -1;
        if (ext >= 0) rr.push({ e: +e, ext, mm: F.tipo[k] === "Max" ? 0 : 1, ref: F[campo][k], donde: `barra ${e} ${ext ? "j" : "i"} ${F.tipo[k]}` });
      });
      comparar(campo, rr, (r) => env.barras.get(r.e)[r.ext][r.mm][c]);
    }
  }
  return filas;
}
