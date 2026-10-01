/**
 * ESTADO ESTACIONARIO (Load Case «Steady State») contra SAP2000 24 por OAPI (1-oct-2026).
 *   [K − ω²M + i·(dK·K + dM·M)]·a = p      (CSiRefer cap. XXV; amortiguamiento histerético dK = 0.04)
 * Pórtico 3D de validation/pandeo (4 trozos) con la masa del hormigón (23.5 kN/m³), carga armónica 20 kN en X y 2 kN en
 * Y, 40 frecuencias de 0.5 a 20 Hz. Referencia: validation/estacionario/sap_ss.py → sap_ss.json (parte real e imaginaria).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cargarFem, empaquetar, R } from "../lib/bundle.mjs";
import { RAIZ } from "../lib/wasm.mjs";

const cargarCli = async () =>
  (await empaquetar(`export { cliModeler } from "${R}/examples/src/cli-modeler/cliModeler";\n`, "cliModeler")).cliModeler;

export const nombre = "estacionario-sap2000";
export const descripcion = "Steady State = SAP2000: desplazamiento complejo (Re, Im) del nudo de control en 40 frecuencias";
export async function correr() {
  const cli = await cargarCli(), fem = await cargarFem();
  const D = JSON.parse(readFileSync(join(RAIZ, "validation/pandeo/modelos.json"), "utf8"));
  const S = JSON.parse(readFileSync(join(RAIZ, "validation/estacionario/sap_ss.json"), "utf8"));
  const M = D.modelos.find((m) => m.nombre === "portico_4"); const top = S.top; const rho = S.gamma / 9.80665;
  const L = [];
  M.nodes.forEach((p, k) => L.push(`node ${k + 1} ${p[0]} ${p[1]} ${p[2]}`));
  M.frames.forEach((f, e) => {
    const s = S.props[`R${f[2]}x${f[3]}`];
    L.push(`frame ${e + 1} ${f[0] + 1} ${f[1] + 1} ${D.E} ${s.A} ${s.I22} ${s.I33} ${s.J} ${D.nu} ${rho}`, `as ${e + 1} ${s.As2} ${s.As3}`);
    if (f[4]) L.push(`ang ${e + 1} ${f[4]}`);
  });
  for (const [k, s] of Object.entries(M.apoyos)) L.push(`support ${+k + 1} ${s.join(" ")}`);
  L.push(`load ${top + 1} 20 2 0 0 0 0`, "solve");
  globalThis.window = { __hekatanCliScript: L.join("\n") };
  const st = (v) => ({ val: v });
  const states = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}), deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
  cli.build({}, states);
  const o = S.opciones["1"]; const fr = [...new Set(o.stepnum)].sort((a, b) => a - b);
  const r = fem.steadyStateAnalysis(states.nodes.val, states.elements.val, states.nodeInputs.val, states.elementInputs.val,
    { frecuencias: fr, dK: 0.04, dM: 0, nudos: [top] });
  let umax = 0; for (const u of o.u) for (let c = 0; c < 3; c++) umax = Math.max(umax, Math.abs(u[c]));
  let peor = 0, det = "";
  fr.forEach((f, k) => {
    const re = o.u[o.steptype.findIndex((t, i) => o.stepnum[i] === f && t.startsWith("Real"))];
    const im = o.u[o.steptype.findIndex((t, i) => o.stepnum[i] === f && t.startsWith("Imag"))];
    const a = r?.re.get(top)?.[k], b = r?.im.get(top)?.[k];
    if (!a || !b) { peor = 1e9; return; }
    for (let c = 0; c < 6; c++) { const d = Math.max(Math.abs(a[c] - re[c]), Math.abs(b[c] - im[c])) / umax * 100; if (d > peor) { peor = d; det = `f ${f} Hz gdl ${c}: ${a[c].toExponential(4)}${b[c] >= 0 ? "+" : ""}${b[c].toExponential(4)}i vs ${re[c].toExponential(4)}${im[c] >= 0 ? "+" : ""}${im[c].toExponential(4)}i`; } }
  });
  const filas = [{ que: "fuerzas: Re e Im de u en 40 frecuencias (% del máximo)", medido: peor, limite: 1e-3, ok: peor <= 1e-3, detalle: det }];
  const A = S.opciones.acel;
  if (A) {
    const ra = fem.steadyStateAnalysis(states.nodes.val, states.elements.val, states.nodeInputs.val, states.elementInputs.val,
      { frecuencias: fr, dK: 0.04, dM: 0, cargas: [{ tipo: 1, dir: 0, s: 1, fase: 0 }], nudos: [top] });
    let um = 0, pe = 0; for (const u of A.u) for (let c = 0; c < 3; c++) um = Math.max(um, Math.abs(u[c]));
    fr.forEach((f, k) => {
      const re = A.u[A.steptype.findIndex((t, i) => A.stepnum[i] === f && t.startsWith("Real"))];
      const im = A.u[A.steptype.findIndex((t, i) => A.stepnum[i] === f && t.startsWith("Imag"))];
      const a = ra?.re.get(top)?.[k], b = ra?.im.get(top)?.[k];
      if (!a || !b) { pe = 1e9; return; }
      for (let c = 0; c < 6; c++) pe = Math.max(pe, Math.max(Math.abs(a[c] - re[c]), Math.abs(b[c] - im[c])) / um * 100);
    });
    filas.push({ que: "aceleración en la base X: Re e Im (% del máximo)", medido: pe, limite: 1e-3, ok: pe <= 1e-3, detalle: "" });
  }
  return filas;
}
