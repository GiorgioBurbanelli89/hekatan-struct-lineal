/**
 * PANDEO LINEAL (Load Case «Buckling») contra SAP2000 24 por OAPI (1-oct-2026).
 *   [K − λ·G(r)]·Ψ = 0   (CSiRefer cap. XVIII; G de barra: flexión cúbica + cortante lineal, cap. XXII)
 * Modelos: columna en voladizo (1 y 4 trozos) y pórtico 3D con una columna girada 30° y apoyo articulado
 * (1 y 4 trozos). Referencia: validation/pandeo/sap_pandeo.py → sap_pandeo.json (con las propiedades de
 * sección que da SAP2000). El modelo entra por el .heks, como en la app; P sale del estático de r.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cargarFem, empaquetar, R } from "../lib/bundle.mjs";
import { RAIZ } from "../lib/wasm.mjs";

const cargarCli = async () =>
  (await empaquetar(`export { cliModeler } from "${R}/examples/src/cli-modeler/cliModeler";\n`, "cliModeler")).cliModeler;

function heks(M, props, E, nu) {
  const L = [];
  M.nodes.forEach((p, k) => L.push(`node ${k + 1} ${p[0]} ${p[1]} ${p[2]}`));
  M.frames.forEach((f, e) => {
    const s = props[`R${f[2]}x${f[3]}`];
    L.push(`frame ${e + 1} ${f[0] + 1} ${f[1] + 1} ${E} ${s.A} ${s.I22} ${s.I33} ${s.J} ${nu} 0`);
    L.push(`as ${e + 1} ${s.As2} ${s.As3}`);
    if (f[4]) L.push(`ang ${e + 1} ${f[4]}`);
  });
  for (const [k, s] of Object.entries(M.apoyos)) L.push(`support ${+k + 1} ${s.join(" ")}`);
  for (const [k, c] of Object.entries(M.cargas)) L.push(`load ${+k + 1} ${c.join(" ")}`);
  L.push("solve");
  return L.join("\n");
}

export const nombre = "pandeo-sap2000";
export const descripcion = "Pandeo lineal (Buckling) = SAP2000: factores λ de 6 modos, columna y pórtico 3D";
export async function correr() {
    const cli = await cargarCli(), fem = await cargarFem();
    const D = JSON.parse(readFileSync(join(RAIZ, "validation/pandeo/modelos.json"), "utf8"));
    const S = JSON.parse(readFileSync(join(RAIZ, "validation/pandeo/sap_pandeo.json"), "utf8"));
    const filas = [];
    for (const M of D.modelos) {
      const s = S[M.nombre];
      globalThis.window = { __hekatanCliScript: heks(M, s.props, D.E, D.nu) };
      const st = (v) => ({ val: v });
      const states = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}),
        deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
      cli.build({}, states);
      const r = fem.bucklingAnalysis(states.nodes.val, states.elements.val, states.nodeInputs.val, states.elementInputs.val,
        states.analyzeOutputs.val.normals, s.factores.length);
      let peor = 0; const det = [];
      s.factores.forEach((ref, k) => { const h = r?.factors?.[k] ?? NaN; const d = Math.abs(h / ref - 1) * 100; peor = Math.max(peor, isNaN(d) ? 1e9 : d); det.push(`${h?.toFixed?.(4)}/${ref.toFixed(4)}`); });
      filas.push({ que: `${M.nombre}: λ de ${s.factores.length} modos`, medido: peor, limite: 1e-4, ok: peor <= 1e-4, detalle: det.slice(0, 3).join("  ") });
    }
    return filas;
}
