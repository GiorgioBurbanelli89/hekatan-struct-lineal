/**
 * Cortante V13/V23 (y M11/M22/M12) del Shell-Thin en los JOINTS contra SAP2000 24 (30-sep-2026).
 * Losa 5×4 de malla irregular apoyada en el borde, carga uniforme + puntual (validation/cortante-v13/sonda_sap.py).
 * Se le dan a analyze() los desplazamientos de SAP: así se mide solo la recuperación de esfuerzos.
 * Receta de CSI: momentos en Gauss 2×2 → campo bilineal → su derivada en cada Gauss (jacobiano del punto) →
 * extrapolada a las esquinas (hekatan-fem/src/utils/dkqJoints.ts, dkqJointShear).
 */
import { readFileSync } from "node:fs";
import { empaquetar, R } from "../lib/bundle.mjs";
export const nombre = "cortante-thin-sap";
export const descripcion = "V13/V23 del Shell-Thin joint a joint = SAP2000 (con sus desplazamientos)";
export async function correr() {
  const D = JSON.parse(readFileSync(`${R}/validation/cortante-v13/sonda_thin.json`, "utf-8"));
  const m = await empaquetar(`export { analyze } from "${R}/hekatan-fem/src/analyze";\n`, "cortante-thin-sap");
  const todos = (v) => new Map(D.els.map((_, i) => [i, v]));
  const ei = { elasticities: todos(D.E), poissonsRatios: todos(D.nu), shearModuli: todos(D.E / (2 * (1 + D.nu))), thicknesses: todos(D.t), plateFormulations: todos(1) };
  const ao = m.analyze(D.nodes, D.els, ei, { deformations: new Map(Object.entries(D.U).map(([k, v]) => [+k, v])), reactions: new Map() });
  return [["M11", "bendingXXjoint"], ["M22", "bendingYYjoint"], ["M12", "bendingXYjoint"], ["V13", "tranverseShearXjoint"], ["V23", "tranverseShearYjoint"]].map(([csi, h]) => {
    let err = 0, mx = 0;
    for (const f of D.shell) { const k = D.els[f.area].indexOf(f.pt), v = ao[h]?.get(f.area)?.[k]; mx = Math.max(mx, Math.abs(f[csi])); err = Math.max(err, Math.abs((v ?? NaN) - f[csi])); }
    const pct = err / mx * 100;
    return { que: `${csi} joint a joint vs SAP2000 (% del máx)`, medido: pct, limite: 1e-6, ok: pct <= 1e-6, detalle: `máx ${mx.toFixed(3)} kN·m/m o kN/m` };
  });
}
