/**
 * SÓLIDOS EN EL VISOR Y EN EL WORKSPACE (28-sep-2026).
 *
 * Dos cosas que ningún test miraba, porque todos los de sólidos comprueban el SOLVER:
 *
 *  1. Lo que el visor hace con un hexaedro: la piel (qué caras se dibujan) y las tensiones en
 *     los nudos (extrapolación de Gauss + promedio). Son identidades, así que se comprueban
 *     contra la cuenta exacta: un campo trilineal sobre un cubo se extrapola sin error.
 *  2. Que el ejemplo del workspace `muro-contencion-solido` monta hexaedros de verdad y da el
 *     mismo número que SAP2000 (u_x de coronación −2.621654 mm, SD con modos incompatibles,
 *     medido el 2-sep-2026 en `muro_solido_sap_inc.json`).
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "solidos-visor";
export const descripcion = "sólidos H8: piel, tensiones en los nudos y el ejemplo del workspace contra SAP2000";
const SAP_UX = -2.621654e-3;
const pct = (a, b) => Math.abs(a - b) / Math.abs(b) * 100;

/** Malla de nx × ny × nz cubos de lado 1, numeración H8 de Hekatan. */
function bloque(nx, ny, nz) {
  const id = (i, j, k) => k * (nx + 1) * (ny + 1) + j * (nx + 1) + i;
  const nodes = [];
  for (let k = 0; k <= nz; k++) for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) nodes.push([i, j, k]);
  const elements = [];
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++)
    elements.push([id(i, j, k), id(i + 1, j, k), id(i + 1, j + 1, k), id(i, j + 1, k),
                   id(i, j, k + 1), id(i + 1, j, k + 1), id(i + 1, j + 1, k + 1), id(i, j + 1, k + 1)]);
  return { nodes, elements };
}

export async function correr() {
  const v = await empaquetar(`
    export * from "${R}/hekatan-ui/src/viewer/objects/utils/solidos";
    export { muroContencionSolido } from "${R}/examples/src/muro-contencion-solido/muroContencionSolido";
    export { mallaMuroSolido, MURO_SOLIDO_DEFAULT } from "${R}/examples/src/muro-contencion-solido/malla";
  `, "solidos-visor");
  const filas = [];

  // ── 1. la piel ──
  const uno = bloque(1, 1, 1), ocho = bloque(2, 2, 2);
  const p1 = v.pielDeSolidos(uno.elements), p8 = v.pielDeSolidos(ocho.elements);
  filas.push({ que: "piel de 1 hexaedro", crudo: true, medido: `${p1.length} caras`, limite: "6 caras", ok: p1.length === 6 });
  filas.push({ que: "piel de un bloque 2×2×2", crudo: true, medido: `${p8.length} caras de ${8 * 6}`, limite: "24 caras (las 12 interiores no se dibujan)", ok: p8.length === 24 });
  // las normales, hacia fuera: (b−a)×(c−a) apunta del centro del bloque hacia la cara
  let haciaDentro = 0;
  for (const c of p8) {
    const [a, b, cc] = c.nudos.map((n) => ocho.nodes[n]);
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], w = [cc[0] - a[0], cc[1] - a[1], cc[2] - a[2]];
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
    const centro = c.nudos.reduce((s, k) => [s[0] + ocho.nodes[k][0] / 4, s[1] + ocho.nodes[k][1] / 4, s[2] + ocho.nodes[k][2] / 4], [0, 0, 0]);
    const fuera = [centro[0] - 1, centro[1] - 1, centro[2] - 1];
    if (n[0] * fuera[0] + n[1] * fuera[1] + n[2] * fuera[2] <= 0) haciaDentro++;
  }
  filas.push({ que: "normales de la piel hacia fuera", crudo: true, medido: `${haciaDentro} hacia dentro`, limite: "0", ok: haciaDentro === 0 });
  // con un elemento oculto, la cara que compartía pasa a ser piel (el corte queda relleno)
  const pCorte = v.pielDeSolidos(ocho.elements, (ei) => ei !== 0);
  filas.push({ que: "bloque 2×2×2 con un hexaedro oculto", crudo: true, medido: `${pCorte.length} caras`, limite: "24 caras (salen 3, entran 3)", ok: pCorte.length === 24 });

  // ── 2. la extrapolación: cada fila suma 1 ──
  const sumas = v.EXTRAPOLA_H8.map((f) => f.reduce((a, b) => a + b, 0));
  const peorSuma = Math.max(...sumas.map((s) => Math.abs(s - 1)));
  filas.push({ que: "extrapolación Gauss→nudo: cada fila suma 1", crudo: true, medido: peorSuma.toExponential(2), limite: "< 1e-14", ok: peorSuma < 1e-14 });

  // ── 3. campo TRILINEAL σ = a + b·x + c·y + d·z + e·xy + f·yz + g·xz + h·xyz ──
  // Se muestrea en los puntos de Gauss de cada cubo y se pide el valor en los nudos: exacto.
  const G = 1 / Math.sqrt(3);
  const S = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
  const campo = (x, y, z, k) => (k + 1) * (3 - 2 * x + 5 * y + 0.7 * z + 1.3 * x * y - 0.4 * y * z + 2.1 * x * z + 0.9 * x * y * z);
  const tens = new Map();
  ocho.elements.forEach((e, ei) => {
    const c = e.reduce((s, n) => [s[0] + ocho.nodes[n][0] / 8, s[1] + ocho.nodes[n][1] / 8, s[2] + ocho.nodes[n][2] / 8], [0, 0, 0]);
    tens.set(ei, S.map((s) => {
      const x = c[0] + 0.5 * G * s[0], y = c[1] + 0.5 * G * s[1], z = c[2] + 0.5 * G * s[2];
      return [0, 1, 2, 3, 4, 5].map((k) => campo(x, y, z, k));
    }));
  });
  let peorCampo = 0;
  const NOMBRES = ["sigmaXX", "sigmaYY", "sigmaZZ", "tauXY", "tauYZ", "tauXZ"];
  NOMBRES.forEach((nom, k) => {
    const nod = v.tensionEnNudos(ocho.elements, tens, nom);
    ocho.nodes.forEach((p, n) => {
      const ex = campo(p[0], p[1], p[2], k), me = nod.get(n)?.[0];
      peorCampo = Math.max(peorCampo, Math.abs(me - ex) / Math.abs(ex));
    });
  });
  filas.push({ que: "campo trilineal: 6 componentes en los 27 nudos", medido: peorCampo * 100, limite: 1e-10, ok: peorCampo * 100 <= 1e-10, detalle: "Gauss → nudo → promedio, contra el valor exacto" });

  // ── 4. von Mises: tracción uniaxial σ → σ; cortante puro τ → √3·τ ──
  const vmU = v.vonMisesDe([250, 0, 0, 0, 0, 0]), vmT = v.vonMisesDe([0, 0, 0, 100, 0, 0]);
  filas.push({ que: "von Mises de tracción uniaxial 250", medido: pct(vmU, 250), limite: 1e-12, ok: pct(vmU, 250) <= 1e-12, detalle: `${vmU}` });
  filas.push({ que: "von Mises de cortante puro 100", medido: pct(vmT, 100 * Math.sqrt(3)), limite: 1e-12, ok: pct(vmT, 100 * Math.sqrt(3)) <= 1e-12, detalle: `${vmT} = √3·100` });
  // y sale de las componentes YA promediadas: en un nudo entre dos estados opuestos da 0
  const dos = bloque(2, 1, 1), tOp = new Map();
  tOp.set(0, S.map(() => [100, 0, 0, 0, 0, 0]));
  tOp.set(1, S.map(() => [-100, 0, 0, 0, 0, 0]));
  const vmNudo = v.tensionEnNudos(dos.elements, tOp, "vonMises");
  const enMedio = vmNudo.get(1)?.[0], enExtremo = vmNudo.get(0)?.[0];
  filas.push({ que: "von Mises con las componentes promediadas", crudo: true, medido: `${enMedio} en el nudo compartido, ${enExtremo} en el extremo`, limite: "0 y 100", ok: Math.abs(enMedio) < 1e-12 && Math.abs(enExtremo - 100) < 1e-10 });

  // ── 5. el ejemplo del workspace, con los datos del caso de SAP2000 ──
  const ex = v.muroContencionSolido;
  const params = Object.fromEntries(Object.entries(ex.params).map(([k, d]) => [k, d.default]));
  params.gammaC = 0; params.relleno = 0;            // el caso arbitrado va sin peso propio ni relleno
  const st = () => ({ val: undefined, rawVal: undefined });
  const states = { nodes: st(), elements: st(), nodeInputs: st(), elementInputs: st(), deformOutputs: st(), analyzeOutputs: st(), objects3D: st() };
  ex.build(params, states);
  const nHex = states.elements.val.filter((e) => e.length === 8).length;
  const otros = states.elements.val.length - nHex;
  filas.push({ que: "el ejemplo monta hexaedros de 8 nudos", crudo: true, medido: `${states.nodes.val.length} nudos, ${nHex} hexaedros, ${otros} de otro tipo`, limite: "612 nudos, 330 hexaedros, 0 de otro tipo", ok: states.nodes.val.length === 612 && nHex === 330 && otros === 0, detalle: "antes: 1980 cáscaras falsas de 1 mm" });
  const mm = v.mallaMuroSolido(v.MURO_SOLIDO_DEFAULT);
  const ux = states.deformOutputs.val.deformations.get(mm.nudoCoronacion)?.[0] ?? NaN;
  filas.push({ que: "ejemplo del workspace vs SAP2000, u_x coronación", medido: pct(ux, SAP_UX), limite: 1e-5, ok: pct(ux, SAP_UX) <= 1e-5, detalle: `${ux.toExponential(7)} vs ${SAP_UX.toExponential(7)} m` });
  const ao = states.analyzeOutputs.val;
  const nSt = ao.solidStress instanceof Map ? ao.solidStress.size : 0;
  filas.push({ que: "el ejemplo deja las tensiones de los 330 hexaedros", crudo: true, medido: `${nSt} elementos`, limite: "330", ok: nSt === 330 });
  const etiquetas = ex.computedLabels(params, states);
  filas.push({ que: "folder «Calculados» del ejemplo", crudo: true, medido: `${Object.keys(etiquetas).length} valores, ux = ${etiquetas["ux en la coronación"]}`, limite: "ux = -2.6217 mm", ok: etiquetas["ux en la coronación"] === "-2.6217 mm" });
  return filas;
}
