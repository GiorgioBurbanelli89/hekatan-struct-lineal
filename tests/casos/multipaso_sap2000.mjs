/**
 * MULTI-STEP STATIC (Load Case de SAP2000) contra SAP2000 24 por OAPI (5-oct-2026).
 *   K·u_i = r_i por paso (CSiRefer p. 348): patrón «Vehicle Live» (camión 35/145/145 kN a 4.3 m, 1 m/s,
 *   Δt 0.7 s, 70 s → 101 pasos, SF 1.2) + patrón de un paso SC (50 kN en x = 10) en TODOS los pasos.
 *   Viga continua 2 × 20 m, barras de 1 m: los ejes caen DENTRO de las barras (carga concentrada en vano).
 * Referencia: validation/casos-csi/sap_multipaso.py → sap_multipaso.json (juez SAP2000).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cargarFem } from "../lib/bundle.mjs";
import { RAIZ } from "../lib/wasm.mjs";

export function modeloViga(D, props) {
  const M = D.modelo;
  const nodes = M.nodes.map((p) => [...p]);
  const elements = M.frames.map((f) => [...f]);
  const G = M.E / (2 * (1 + M.NU));
  const mapa = (v) => new Map(elements.map((_, e) => [e, v]));
  const elementInputs = {
    elasticities: mapa(M.E), shearModuli: mapa(G), areas: mapa(props.A),
    momentsOfInertiaZ: mapa(props.I33), momentsOfInertiaY: mapa(props.I22), torsionalConstants: mapa(props.J),
    shearAreasZ: mapa(props.As2), shearAreasY: mapa(props.As3),
  };
  const supports = new Map(Object.entries(M.apoyos).map(([k, s]) => [+k, s.map(Boolean)]));
  return { nodes, elements, elementInputs, nodeInputs: { supports } };
}

/** Diagrama CSI [P, V2, V3, T, M2, M3] de la barra e en su extremo (0 = i, 1 = j). */
export function diagramaCSI(r, e, ext) {
  const f = ["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].map((k) => r[k].get(e)[ext]);
  const d = ext === 0 ? f.map((v) => -v) : f;
  d[4] = -d[4];
  return d;
}

export const nombre = "multipaso-sap2000";
export const descripcion = "Multi-step Static (Vehicle Live por un carril) = SAP2000: Uz, reacciones, V2 y M3 en 101 pasos";
export async function correr() {
  const fem = await cargarFem();
  const D = JSON.parse(readFileSync(join(RAIZ, "tests/datos/sap_multipaso.json"), "utf8"));
  const M = D.modelo, m = modeloViga(D, D.props);
  const carril = { barras: m.elements.map((_, e) => e) };
  const cam = M.camion, mu = M.multi;
  const pasosVL = fem.pasosVehiculoVivo(m.nodes, m.elements, m.elementInputs,
    [{ vehiculo: { nombre: cam.nombre, ejes: cam.ejes, sep: cam.sep }, carril, estacion: mu.estacion, t0: mu.t0, dir: 1, v: mu.v }], mu.dur, mu.dt);
  const sc = fem.pasoUnico(new Map(Object.entries(M.SC).map(([k, v]) => [+k, v])));
  const R = fem.multiStepStatic(m.nodes, m.elements, m.nodeInputs, m.elementInputs, [{ pasos: pasosVL, sf: mu.sf_vl }, { pasos: sc, sf: mu.sf_sc }]);
  const filas = [];
  const nP = D.disp["0"].step.length;
  filas.push({ que: "nº de pasos (dur/Δt + 1)", medido: Math.abs(R.length - nP), limite: 0, ok: R.length === nP, detalle: `${R.length} / SAP ${nP}` });
  // desplazamientos: % del máximo de cada GDL en todo el caso
  for (const [g, nom] of [[2, "Uz"], [4, "Ry"]]) {
    let max = 0, peor = 0, donde = "";
    for (const q of Object.keys(D.disp)) for (const v of D.disp[q].v[g]) max = Math.max(max, Math.abs(v));
    for (const q of Object.keys(D.disp)) D.disp[q].v[g].forEach((ref, s) => {
      const h = R[s].deformations.get(+q)[g], d = Math.abs(h - ref) / max * 100;
      if (d > peor) { peor = d; donde = `nudo ${q} paso ${s + 1}: ${h.toExponential(6)} / ${ref.toExponential(6)}`; }
    });
    filas.push({ que: `${nom} 41 nudos × ${nP} pasos (% del máx)`, medido: peor, limite: 1e-4, ok: peor <= 1e-4, detalle: donde });
  }
  // reacciones Fz
  {
    let max = 0, peor = 0, donde = "";
    for (const q of Object.keys(D.reac)) for (const v of D.reac[q].v[2]) max = Math.max(max, Math.abs(v));
    for (const q of Object.keys(D.reac)) D.reac[q].v[2].forEach((ref, s) => {
      const h = R[s].reactions.get(+q)?.[2] ?? 0, d = Math.abs(h - ref) / max * 100;
      if (d > peor) { peor = d; donde = `apoyo ${q} paso ${s + 1}: ${h.toFixed(6)} / ${ref.toFixed(6)}`; }
    });
    filas.push({ que: `Fz reacciones × ${nP} pasos (% del máx)`, medido: peor, limite: 1e-4, ok: peor <= 1e-4, detalle: donde });
  }
  // fuerzas de barra en los extremos (estación 0 y L)
  for (const [c, nom] of [[1, "V2"], [5, "M3"]]) {
    let max = 0, peor = 0, donde = "";
    const campo = ["P", "V2", "V3", "T", "M2", "M3"][c];
    for (const e of Object.keys(D.frame)) for (const v of D.frame[e][campo]) max = Math.max(max, Math.abs(v));
    for (const e of Object.keys(D.frame)) {
      const F = D.frame[e];
      F.sta.forEach((sta, k) => {
        const ext = Math.abs(sta) < 1e-9 ? 0 : Math.abs(sta - 1) < 1e-9 ? 1 : -1;
        if (ext < 0) return;
        const s = F.step[k] - 1, ref = F[campo][k], h = diagramaCSI(R[s], +e, ext)[c];
        const d = Math.abs(h - ref) / max * 100;
        if (d > peor) { peor = d; donde = `barra ${e} ${ext ? "j" : "i"} paso ${s + 1}: ${h.toFixed(5)} / ${ref.toFixed(5)}`; }
      });
    }
    filas.push({ que: `${nom} extremos de 40 barras × ${nP} pasos (% del máx)`, medido: peor, limite: 1e-4, ok: peor <= 1e-4, detalle: donde });
  }
  return filas;
}
