/**
 * ETABS 22 como SEGUNDO juez de los casos nuevos (6-oct-2026): lo que ya es = SAP2000 (juez), ahora contra ETABS.
 * Referencia: validation/casos-csi/etabs_juez.py → etabs_juez.json (misma malla, sin brazos automáticos, sin diafragmas).
 *  · Buckling de barras: ETABS da OTRAS propiedades de sección que SAP (J del rectángulo +0.5 %, As −1.4e-7): Struct se
 *    arma con las de ETABS (`props` del json), como hace el test de SAP2000 con las suyas.
 *  · Buckling de cáscaras (Q4, triángulos, modificadores; Shell-Thin): el mismo modelo que contra SAP2000.
 *  · Hyperstatic: la viga 2 × 20 m del test de SAP2000.
 * ETABS NO tiene Multi-step Static ni Moving Load (no hay tablas de esos casos, ni carriles/vehículos: son de SAP2000 y
 * CSiBridge). Steady State y PSD SÍ existen (por tablas: validation/casos-csi/etabs_estacionario.py), pero la OAPI no
 * trae SetOptionSteadyState/SetOptionPSD y la tabla «Joint Displacements» solo da las ENVOLVENTES Real/Imag máx/mín a
 * 4 cifras: no hay Re/Im por frecuencia con que comparar a 6 decimales. Hyperstatic: el HYP de ETABS solo toma TENDONES.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { cargarFem, empaquetar, R } from "../lib/bundle.mjs";
import { RAIZ } from "../lib/wasm.mjs";
import { modeloStruct } from "./pandeo_cascara_sap2000.mjs";
import { modeloViga, diagramaCSI } from "./multipaso_sap2000.mjs";
import { cargasTendon } from "./hiperestatico_sap2000.mjs";

export const nombre = "casos-etabs";
export const descripcion = "ETABS 22 (2º juez): Buckling de barras y cáscaras y Hyperstatic = Struct (ya = SAP2000)";
const par = (hs, ref) => hs.reduce((b, h) => (Math.abs(h / ref - 1) < Math.abs(b / ref - 1) ? h : b), Infinity);

export async function correr() {
  const ruta = join(RAIZ, "validation/casos-csi/etabs_juez.json");
  if (!existsSync(ruta)) return [{ que: "referencia de ETABS", medido: 1, limite: 0, ok: false, detalle: "falta etabs_juez.json" }];
  const EJ = JSON.parse(readFileSync(ruta, "utf8")), fem = await cargarFem(), filas = [];
  // ── barras ──
  if (EJ.pandeo) {
    const cli = (await empaquetar(`export { cliModeler } from "${R}/examples/src/cli-modeler/cliModeler";\n`, "cliModeler")).cliModeler;
    const D = JSON.parse(readFileSync(join(RAIZ, "validation/pandeo/modelos.json"), "utf8"));
    for (const M of D.modelos) {
      const e = EJ.pandeo[M.nombre]; if (!e) continue;
      const L = [];
      M.nodes.forEach((p, k) => L.push(`node ${k + 1} ${p[0]} ${p[1]} ${p[2]}`));
      M.frames.forEach((f, i) => { const s = e.props[`R${f[2]}x${f[3]}`];
        L.push(`frame ${i + 1} ${f[0] + 1} ${f[1] + 1} ${D.E} ${s.A} ${s.I22} ${s.I33} ${s.J} ${D.nu} 0`); L.push(`as ${i + 1} ${s.As2} ${s.As3}`);
        if (f[4]) L.push(`ang ${i + 1} ${f[4]}`); });
      for (const [k, s] of Object.entries(M.apoyos)) L.push(`support ${+k + 1} ${s.join(" ")}`);
      for (const [k, c] of Object.entries(M.cargas)) L.push(`load ${+k + 1} ${c.join(" ")}`);
      L.push("solve");
      const prev = globalThis.window; globalThis.window = { __hekatanCliScript: L.join("\n") };
      const st = (v) => ({ val: v }); const S = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}), deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
      cli.build({}, S); globalThis.window = prev;
      const r = fem.bucklingAnalysis(S.nodes.val, S.elements.val, S.nodeInputs.val, S.elementInputs.val, S.analyzeOutputs.val.normals, e.factores.length + 2);
      let peor = 0; for (const f of e.factores) peor = Math.max(peor, Math.abs(par(r.factors, f) / f - 1) * 100);
      filas.push({ que: `barras ${M.nombre}: λ de ${e.factores.length} modos vs ETABS`, medido: peor, limite: 1e-4, ok: peor <= 1e-4,
        detalle: `${par(r.factors, e.factores[0]).toFixed(6)} / ETABS ${e.factores[0].toFixed(6)}` });
    }
  }
  // ── cáscaras ──
  if (EJ.pandeo_cascara) {
    const D = JSON.parse(readFileSync(join(RAIZ, "validation/pandeo_cascara/modelos.json"), "utf8"));
    for (const M of D.modelos) {
      const e = EJ.pandeo_cascara[M.nombre]; if (!e) continue;
      // ETABS REMALLA algunas losas (placa 4×2 y losa de triángulos 4×4: 17/41 nudos de análisis contra 15/25): no es el
      // mismo modelo → omitido, dicho. ⚠️ Las losas van en la cota 3 m en ETABS: en la de la BASE (z = 0) ETABS no daba
      // los modos fuera del plano (λ1 = 5767 en vez de 9.06).
      if (e.nudos_analisis !== e.nudos_modelo) { filas.push({ que: `cáscaras ${M.nombre}: OMITIDO (ETABS remalla: ${e.nudos_analisis} nudos de análisis, el modelo ${e.nudos_modelo})`, medido: 0, limite: 1, ok: true, detalle: "no es la misma malla" }); continue; }
      const m = modeloStruct(M, D.E, D.nu), tri = M.panos.some((c) => c.length === 3);
      const d = fem.deform(m.nodes, m.elements, m.nodeInputs, m.elementInputs);
      const r = fem.bucklingAnalysis(m.nodes, m.elements, m.nodeInputs, m.elementInputs, undefined, e.factores.length + 4, d.deformations);
      let pf = 0, pp = 0;
      for (const f of e.factores.filter((x) => Math.abs(x) > 0.5)) { const dd = Math.abs(par(r.factors, f) / f - 1) * 100; if (Math.abs(f) < 1000) pf = Math.max(pf, dd); else pp = Math.max(pp, dd); }
      const lim = tri ? 1e-3 : 1e-4, limP = tri ? 2e-3 : 1e-4;
      filas.push({ que: `cáscaras ${M.nombre}: λ vs ETABS (fuera del plano)`, medido: pf, limite: lim, ok: pf <= lim && pp <= limP,
        detalle: `${par(r.factors, e.factores[0]).toFixed(6)} / ETABS ${e.factores[0].toFixed(6)} · en el plano ${pp.toExponential(1)} %` });
    }
  }
  // ── Hyperstatic ──
  if (EJ.hiperestatico) {
    const D = JSON.parse(readFileSync(join(RAIZ, "tests/datos/sap_hiperestatico.json"), "utf8"));
    const m = modeloViga(D, D.props), { loads, frameLoads } = cargasTendon(D, m);
    const H = fem.hyperstaticAnalysis(m.nodes, m.elements, { ...m.nodeInputs, loads }, { ...m.elementInputs, frameLoads });
    const E2 = EJ.hiperestatico;
    let rmax = 0, dr = 0;
    for (const [q, r] of Object.entries(E2.PT.reac)) { rmax = Math.max(rmax, Math.abs(r[2])); dr = Math.max(dr, Math.abs(H.reaccionesBase.get(+q)[2] - r[2])); }
    filas.push({ que: "Hyperstatic: reacciones del caso base PT vs ETABS", medido: (100 * dr) / rmax, limite: 1e-4, ok: (100 * dr) / rmax <= 1e-4, detalle: `máx |ΔFz| ${dr.toExponential(2)} kN` });
    // El HYP de ETABS sale NULO (desplazamientos 0, sin fuerzas de barra; definido con SupportType «Springs»): su
    // Hyperstatic toma solo las cargas de TENDONES del caso base, y aquí el pretensado va como cargas equivalentes.
    const uh = Math.max(...Object.values(E2.HYP.disp).map((u) => Math.abs(u[2])));
    filas.push({ que: "Hyperstatic HYP en ETABS: OMITIDO (ETABS da 0: su caso solo toma tendones)", medido: 0, limite: 1, ok: true, crudo: true,
      detalle: `máx |Uz| ETABS ${uh.toExponential(1)} · sin fuerzas de barra` });
  }
  return filas;
}
