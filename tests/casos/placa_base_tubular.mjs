/**
 * Placa base de columna tubular (SHS 200×200×10 y RHS 250×150×8): hormigón SOLO COMPRESIÓN (Gap) y pernos
 * SOLO TRACCIÓN (Hook), placa y tubo de cáscaras unidos por nudos compartidos (soldadura).
 *
 * El ejemplo `placa-base-tubular` escribe el .heks y lo resuelve por cliModeler (el camino de la app).
 * Jueces, con el MISMO modelo nudo a nudo (hekatan-lisp/tests/placa_base/):
 *   - Abaqus 2024: S4 + SPRING1 NONLINEAR (abaqus_inp.py)
 *   - hoja 144/145 de Hekatan LISP: ShellMITC4 + conjunto activo, dentro de la hoja
 *   - solver de IDEA StatiCa (k2fem64 standalone, CGAP; idea_deck.py), SOL 106
 * Datos: tests/datos/placa_base_tubular_jueces.json (validation/placa-base-tubular/extraer_jueces.py).
 *
 * Lo que DECIDE la ley Gap/Hook (qué nudos tocan, qué pernos tiran, reacción del hormigón y tracción del
 * perno) se exige al nivel del juez; los desplazamientos llevan un límite propio porque son cuatro
 * cáscaras distintas (Abaqus S4, MITC4 de la hoja, el CQUAD4 de IDEA y el MITC4 + Wilson + ITW de Struct).
 */
import { readFileSync } from "node:fs";
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "placa-base-tubular";
export const descripcion = "Placa base tubular SHS/RHS (hormigón solo compresión + pernos solo tracción) vs Abaqus, hoja LISP e IDEA (k2fem64)";

export async function resolverPlacaTubular(caso, extra = {}) {
  const mod = await empaquetar(
    `export { cliModeler } from "${R}/examples/src/cli-modeler/cliModeler";\n` +
    `export { heksPlacaTubular, resumenPlacaTubular, PLACA_TUBULAR_DEF, CASOS_PLACA_TUBULAR } from "${R}/examples/src/placa-base-tubular/placaBaseTubular";\n`,
    "placaBaseTubular");
  const p = { ...mod.PLACA_TUBULAR_DEF, caso: caso === "rhs" ? 1 : 0, M: mod.CASOS_PLACA_TUBULAR[caso].M, ...extra };
  globalThis.window = { __hekatanCliScript: mod.heksPlacaTubular(p) };
  const st = (v) => ({ val: v });
  const states = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}),
                   deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
  mod.cliModeler.build({}, states);
  const U = states.deformOutputs.val.deformations;
  return { p, states, U, r: mod.resumenPlacaTubular(p, U), contacto: globalThis.window.__hekatanCliContacto };
}

/** σ de Von Mises (MPa) en el centro de cada elemento de placa, el mayor de las dos caras: N/t ± 6M/t². */
export function vonMisesCentroPlaca(a, t) {
  const out = [];
  for (let e = 0; e < 64; e++) {
    const n = [a.membraneXXcentro.get(e), a.membraneYYcentro.get(e), a.membraneXYcentro.get(e)];
    const m = [a.bendingXXcentro.get(e), a.bendingYYcentro.get(e), a.bendingXYcentro.get(e)];
    let v = 0;
    for (const s of [1, -1]) {
      const [sx, sy, sxy] = n.map((x, k) => x / t + (s * 6 * m[k]) / (t * t));
      v = Math.max(v, Math.sqrt(sx * sx - sx * sy + sy * sy + 3 * sxy * sxy) / 1000);
    }
    out.push(v);
  }
  return out;
}

export async function correr() {
  const D = JSON.parse(readFileSync(new URL("../datos/placa_base_tubular_jueces.json", import.meta.url), "utf-8"));
  const filas = [];
  for (const caso of ["shs", "rhs"]) {
    const J = D[caso];
    const { U, r, contacto, states } = await resolverPlacaTubular(caso);
    const n = 161;
    const uzH = Array.from({ length: n }, (_, i) => U.get(i)[2]);
    const CASO = caso.toUpperCase();
    // reacciones y levantamiento de cada juez con SUS desplazamientos (mismas cuentas)
    const muelles = (uz) => {
      let Rc = 0, lev = 0; const T = [];
      for (let q = 0; q < 81; q++) { if (uz[q] < 0) Rc += -J.kc[q] * uz[q]; else if (uz[q] > 0) lev++; }
      for (const q of J.nb) T.push(uz[q - 1] > 0 ? J.params.k_b * uz[q - 1] : 0);
      return { Rc, Tb: T.reduce((s, v) => s + v, 0), Tmax: Math.max(...T), lev, act: T.filter((v) => v > 0).length };
    };
    const ab = muelles(J.abaqus.U.map((u) => u[2]));
    const ho = muelles(J.hoja.U.map((u) => u[2]));
    const id = muelles(J.idea.uz_mm.map((u) => u / 1000));
    const pct = (a, b) => (Math.abs(a / b - 1) * 100);
    filas.push({ que: `${CASO} convergió (Gap + Hook)`, medido: contacto?.convergio ? 1 : 0, limite: 1, ok: !!contacto?.convergio, crudo: true,
                 detalle: `${contacto?.iteraciones} iteraciones (${contacto?.historial?.join(" → ")})` });
    filas.push({ que: `${CASO} ΣFz = N`, medido: pct(r.Rc - r.Tb, J.params.N), limite: 0.001, ok: pct(r.Rc - r.Tb, J.params.N) <= 0.001,
                 detalle: `${(r.Rc - r.Tb).toFixed(4)} kN` });
    for (const [nom, j, lim] of [["Abaqus", ab, 0.5], ["hoja LISP", ho, 0.5], ["IDEA k2fem64", id, 1.0]]) {
      filas.push({ que: `${CASO} reacción hormigón vs ${nom}`, medido: pct(r.Rc, j.Rc), limite: lim, ok: pct(r.Rc, j.Rc) <= lim,
                   detalle: `${r.Rc.toFixed(2)} vs ${j.Rc.toFixed(2)} kN` });
      filas.push({ que: `${CASO} tracción pernos vs ${nom}`, medido: pct(r.Tb, j.Tb), limite: 3 * lim, ok: pct(r.Tb, j.Tb) <= 3 * lim,
                   detalle: `${r.Tb.toFixed(2)} vs ${j.Tb.toFixed(2)} kN (activos ${r.pernosActivos} / ${j.act})` });
      const igual = r.levantados === j.lev && r.pernosActivos === j.act;
      filas.push({ que: `${CASO} mismos nudos levantados y pernos activos que ${nom}`, medido: igual ? 1 : 0, limite: 1, ok: igual, crudo: true,
                   detalle: `${r.levantados}/${j.lev} levantados · ${r.pernosActivos}/${j.act} pernos` });
    }
    // contacto nudo a nudo contra Abaqus
    let mism = 0;
    for (let q = 0; q < 81; q++) if ((uzH[q] < 0) === (J.abaqus.U[q][2] < 0)) mism++;
    filas.push({ que: `${CASO} contacto nudo a nudo vs Abaqus`, medido: mism, limite: 81, ok: mism === 81, crudo: true, detalle: `${mism}/81 nudos con el mismo estado` });
    // desplazamientos uz de los 161 nudos
    const peor = (ref) => { let mx = 0, d = 0; for (let i = 0; i < n; i++) { mx = Math.max(mx, Math.abs(ref[i])); d = Math.max(d, Math.abs(uzH[i] - ref[i])); } return 100 * d / mx; };
    const dA = peor(J.abaqus.U.map((u) => u[2])), dH = peor(J.hoja.U.map((u) => u[2])), dI = peor(J.idea.uz_mm.map((u) => u / 1000));
    filas.push({ que: `${CASO} uz 161 nudos vs Abaqus (% del máx)`, medido: dA, limite: 3, ok: dA <= 3, detalle: "otra cáscara (S4)" });
    filas.push({ que: `${CASO} uz 161 nudos vs hoja LISP (% del máx)`, medido: dH, limite: 3, ok: dH <= 3, detalle: "otra cáscara (MITC4)" });
    filas.push({ que: `${CASO} uz 161 nudos vs IDEA (% del máx)`, medido: dI, limite: 25, ok: dI <= 25, detalle: "IDEA vs Abaqus ya da 12-20 % en el tubo" });
    // uz de los pernos
    const ub = J.nb.map((q) => uzH[q - 1] * 1000), ua = J.nb.map((q) => J.abaqus.U[q - 1][2] * 1000), ui = J.nb.map((q) => J.idea.uz_mm[q - 1]);
    const mxb = Math.max(...ua);
    const db = Math.max(...ub.map((v, i) => Math.abs(v - ua[i]))) / mxb * 100;
    filas.push({ que: `${CASO} uz pernos vs Abaqus`, medido: db, limite: 2, ok: db <= 2,
                 detalle: `Struct ${Math.max(...ub).toFixed(4)} · Abaqus ${mxb.toFixed(4)} · IDEA ${Math.max(...ui).toFixed(4)} mm` });
    // Von Mises de la placa en el CENTRO de los 64 elementos (MPa), cara de arriba y de abajo, el mayor: lo mismo
    // que se lee de Abaqus (S11 S22 S12 en los puntos 1 y 5 de la sección, POSITION=CENTROIDAL)
    const vmH = vonMisesCentroPlaca(states.analyzeOutputs.val, J.params.t_p);
    // límite elemento a elemento: la hoja (MITC4 sin modos incompatibles) contra Abaqus ya da 10.4 % (SHS) y 8.8 % (RHS)
    for (const [nom, ref, lim] of [["Abaqus", J.abaqus.vm, 8], ["hoja LISP", J.hoja.vm, 11]]) {
      const mR = Math.max(...ref), mH = Math.max(...vmH);
      let d = 0; for (let e = 0; e < 64; e++) d = Math.max(d, Math.abs(vmH[e] - ref[e]));
      filas.push({ que: `${CASO} Von Mises máx placa vs ${nom}`, medido: pct(mH, mR), limite: 3, ok: pct(mH, mR) <= 3,
                   detalle: `Struct ${mH.toFixed(2)} vs ${mR.toFixed(2)} MPa` });
      filas.push({ que: `${CASO} Von Mises 64 elementos vs ${nom} (% del máx)`, medido: 100 * d / mR, limite: lim, ok: 100 * d / mR <= lim,
                   detalle: `peor |Δσ| ${d.toFixed(2)} MPa` });
    }
  }
  return filas;
}
