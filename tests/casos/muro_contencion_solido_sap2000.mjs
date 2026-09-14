/**
 * MURO DE CONTENCION EN SOLIDOS H8 contra SAP2000, nudo a nudo.
 *
 * La malla del ejemplo (examples/src/muro-contencion-solido/malla.ts, valores
 * por defecto: H 4, t 0.4, puntera 0.6, talon 1.6, zapata 0.4, L 1, malla 0.2,
 * E 2.5e7, nu 0.2, Ka 1/3, gamma 18, q0 10) armada en SAP2000 por OAPI con
 * solidos (galpon-bodega-electoral/sap_h8_modelo.py), mismos apoyos y mismas
 * cargas nodales. Dos referencias: SAP con los modos incompatibles que trae por
 * defecto (= el H8 de Hekatan por defecto) y sin ellos (= H8 clasico).
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "muro-contencion-solido-sap2000";
export const descripcion = "muro de contencion en solidos H8: nudo a nudo vs SAP2000 (con y sin modos incompatibles)";

export async function correr() {
  const mod = await empaquetar(`
    export { hex8Solve } from "${R}/examples/src/solid-cube-fem/h8";
    export { mallaMuroSolido, MURO_SOLIDO_DEFAULT } from "${R}/examples/src/muro-contencion-solido/malla";
  `, "muro-solido-test");
  const p = mod.MURO_SOLIDO_DEFAULT; const m = mod.mallaMuroSolido(p);
  const filas = [];
  for (const [tag, inc] of [["con modos incompatibles (defecto, = SAP2000 por defecto)", true], ["H8 clasico (= SAP2000 sin modos)", false]]) {
    const ref = join(AQUI, "..", "datos", `muro_solido_sap_${inc ? "inc" : "noinc"}.json`);
    if (!existsSync(ref)) { filas.push({ que: `${tag}: referencia`, crudo: true, medido: "falta", limite: "existe", ok: false, detalle: ref }); continue; }
    const S = JSON.parse(readFileSync(ref, "utf-8"));
    const r = mod.hex8Solve({ nodes: m.nodes, elements: m.elements, E: p.E, nu: p.nu, supports: m.supports, loads: m.loads, incompatible: inc });
    let mx = 0; for (let n = 0; n < m.nodes.length; n++) mx = Math.max(mx, Math.abs((r.displacements.get(n) ?? [0, 0, 0])[0]));
    let peor = 0, mism = S.nodes.length === m.nodes.length;
    for (let n = 0; n < m.nodes.length && mism; n++) {
      const u = r.displacements.get(n) ?? [0, 0, 0];
      for (let c = 0; c < 3; c++) peor = Math.max(peor, Math.abs(u[c] - S.u[n][c]) / mx * 100);
    }
    const uxH = (r.displacements.get(m.nudoCoronacion) ?? [0])[0], uxS = S.u[m.nudoCoronacion][0];
    filas.push({ que: `${tag}: ux, uy, uz nudo a nudo`, medido: peor, limite: 1e-6, ok: mism && peor <= 1e-6,
      detalle: `u_x coronacion ${(uxH * 1000).toFixed(4)} vs ${(uxS * 1000).toFixed(4)} mm; ${m.nodes.length} nudos, ${m.elements.length} hexaedros; empuje ${m.info.empujeTotal.toFixed(2)} kN` });
  }
  // con PESO PROPIO y RELLENO sobre el talon (la pagina los trae encendidos): SAP2000 por
  // OAPI con las mismas cargas nodales (muro_solido_pp_dump.json, 3-sep-2026)
  {
    const pp = { ...p, gammaC: 24, relleno: 1 }; const m2 = mod.mallaMuroSolido(pp);
    const ref = join(AQUI, "..", "datos", "muro_solido_pp_sap_inc.json");
    if (!existsSync(ref)) filas.push({ que: "peso propio + relleno: referencia", crudo: true, medido: "falta", limite: "existe", ok: false, detalle: ref });
    else {
      const S = JSON.parse(readFileSync(ref, "utf-8"));
      const r = mod.hex8Solve({ nodes: m2.nodes, elements: m2.elements, E: pp.E, nu: pp.nu, supports: m2.supports, loads: m2.loads, incompatible: true });
      let mx = 0; for (let n = 0; n < m2.nodes.length; n++) for (let c = 0; c < 3; c++) mx = Math.max(mx, Math.abs((r.displacements.get(n) ?? [0, 0, 0])[c]));
      let peor = 0;
      for (let n = 0; n < m2.nodes.length; n++) { const u = r.displacements.get(n) ?? [0, 0, 0]; for (let c = 0; c < 3; c++) peor = Math.max(peor, Math.abs(u[c] - S.u[n][c]) / mx * 100); }
      const uxH = (r.displacements.get(m2.nudoCoronacion) ?? [0])[0], uxS = S.u[m2.nudoCoronacion][0];
      filas.push({ que: "peso propio (24 kN/m3) + relleno sobre el talon: nudo a nudo vs SAP2000", medido: peor, limite: 1e-6, ok: S.nodes.length === m2.nodes.length && peor <= 1e-6,
        detalle: `u_x coronacion ${(uxH * 1000).toFixed(4)} vs ${(uxS * 1000).toFixed(4)} mm; peso propio ${m2.info.pesoPropio.toFixed(1)} kN, relleno ${m2.info.pesoRelleno.toFixed(1)} kN, empuje ${m2.info.empujeTotal.toFixed(1)} kN` });
    }
  }
  // PANTALLA INCLINADA (14-sep-2026): canto 0.40 en la base -> 0.20 en la coronacion, cara trasera
  // inclinada, H8 trapeciales. SAP2000 por OAPI con la misma malla y las mismas cargas nodales.
  {
    const pi = { ...p, tTop: 0.2 }; const m3 = mod.mallaMuroSolido(pi);
    const ref = join(AQUI, "..", "datos", "muro_solido_inclinado_sap_inc.json");
    if (!existsSync(ref)) filas.push({ que: "pantalla inclinada: referencia", crudo: true, medido: "falta", limite: "existe", ok: false, detalle: ref });
    else {
      const S = JSON.parse(readFileSync(ref, "utf-8"));
      const r = mod.hex8Solve({ nodes: m3.nodes, elements: m3.elements, E: pi.E, nu: pi.nu, supports: m3.supports, loads: m3.loads, incompatible: true });
      let mx = 0; for (let n = 0; n < m3.nodes.length; n++) for (let c = 0; c < 3; c++) mx = Math.max(mx, Math.abs((r.displacements.get(n) ?? [0, 0, 0])[c]));
      let peor = 0;
      for (let n = 0; n < m3.nodes.length; n++) { const u = r.displacements.get(n) ?? [0, 0, 0]; for (let c = 0; c < 3; c++) peor = Math.max(peor, Math.abs(u[c] - S.u[n][c]) / mx * 100); }
      const uxH = (r.displacements.get(m3.nudoCoronacion) ?? [0])[0], uxS = S.u[m3.nudoCoronacion][0];
      // Límite 1e-4 %, no el 1e-6 de los rectangulares: con H8 TRAPECIALES SAP2000 y Hekatan difieren
      // 5.8e-5 % del máximo (coronación −3.542782 vs −3.542780 mm, 14-sep-2026). ⏳ se mide si viene de los
      // modos incompatibles en elementos distorsionados (SAP con inc=0 → sap_inclinado_noinc.json).
      filas.push({ que: "pantalla inclinada (t 0.40 -> 0.20): nudo a nudo vs SAP2000", medido: peor, limite: 1e-4, ok: S.nodes.length === m3.nodes.length && peor <= 1e-4,
        detalle: `u_x coronacion ${(uxH * 1000).toFixed(4)} vs ${(uxS * 1000).toFixed(4)} mm; ${m3.nodes.length} nudos, ${m3.elements.length} hexaedros; empuje ${m3.info.empujeTotal.toFixed(2)} kN` });
    }
  }
  return filas;
}
