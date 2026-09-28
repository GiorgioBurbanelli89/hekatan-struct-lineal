/**
 * Muro de contención en VOLADIZO con SÓLIDOS H8 — validado contra SAP2000.
 *
 * La misma malla (`malla.ts`) se arma en SAP2000 por OAPI
 * (galpon-bodega-electoral/sap_h8_modelo.py) con los mismos apoyos y las mismas cargas
 * nodales, y se carea nudo a nudo en tests/casos/muro_contencion_solido_sap2000.mjs. El H8
 * lleva los modos incompatibles de flexión de Wilson–Taylor, que es lo que SAP2000 trae por
 * defecto en sus sólidos (2-sep-2026).
 *
 * Empuje activo de Rankine p = Ka·(γ·z + q0) sobre la cara trasera del alzado, base de la
 * zapata fija.
 *
 * Desde el 28-sep-2026 corre DENTRO del workspace, con hexaedros de verdad. Antes era una
 * página aparte que dibujaba las 6 caras de cada hexaedro como cáscaras de 1 mm (también las
 * interiores, dos veces cada una) y el campo se elegía con un deslizador 0·1·2.
 */
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";
import { mallaMuroSolido, MURO_SOLIDO_DEFAULT, type MuroSolidoMalla } from "./malla";
import { resolverSolidoEnWorkspace, rangoDeTension, type SolucionSolido } from "../shared/solidosWorkspace";

const D = MURO_SOLIDO_DEFAULT;
const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

// Lo último que se construyó, para el folder «Calculados».
let ultimo: { malla: MuroSolidoMalla; sol: SolucionSolido } | null = null;

export const muroContencionSolido: ExampleDef = {
  id: "muro-contencion-solido",
  name: "Muro de contención en SÓLIDOS H8 (vs SAP2000)",
  category: "3️⃣ Sólidos",
  benchmark: true,
  defaultSolidResult: "vonMises",
  params: {
    H:     P("Geometría", "H alzado (m)", D.H, 1, 10, 0.2),
    t:     P("Geometría", "t alzado en la base (m)", D.t, 0.2, 1.0, 0.1),
    tTop:  P("Geometría", "t coronación (m)", D.t, 0.1, 1.0, 0.05),
    toe:   P("Geometría", "puntera (m)", D.toe, 0.2, 3, 0.1),
    heel:  P("Geometría", "talón (m)", D.heel, 0.2, 5, 0.1),
    tf:    P("Geometría", "canto zapata (m)", D.tf, 0.2, 1.0, 0.1),
    L:     P("Geometría", "longitud L (m)", D.L, 0.2, 5, 0.2),
    ms:    P("Malla", "tamaño de elemento (m)", D.ms, 0.1, 0.5, 0.05),
    incompatible: { default: 1, boolean: true, label: "modos incompatibles (como SAP2000)", folder: "Malla" },
    E:     P("Material", "E hormigón (kN/m²)", D.E, 1e7, 4e7, 1e6),
    nu:    P("Material", "ν", D.nu, 0.1, 0.3, 0.01),
    gammaC: P("Material", "peso propio γc (kN/m³, 0 = sin)", 24, 0, 26, 1),
    Ka:    P("Relleno", "Ka (Rankine)", D.Ka, 0.2, 0.6, 0.01),
    gamma: P("Relleno", "γ relleno (kN/m³)", D.gamma, 14, 22, 0.5),
    q0:    P("Relleno", "sobrecarga q0 (kN/m²)", D.q0, 0, 50, 1),
    relleno: { default: 1, boolean: true, label: "el relleno pesa sobre el talón", folder: "Relleno" },
  },
  guide: [
    "El empuje de Rankine entra por la cara trasera del alzado, hacia −x",
    "En Settings → «Resultados de sólido» se elige σxx, σzz, von Mises o un desplazamiento",
    "Con «t coronación» menor que «t alzado» la pantalla sale inclinada",
    "«✂️ Cortes X/Y/Z» deja ver las tensiones por dentro del sólido",
  ],
  build: (p: Record<string, number>, states: BuildStates) => {
    const malla = mallaMuroSolido({
      H: p.H, t: p.t, tTop: p.tTop, toe: p.toe, heel: p.heel, tf: p.tf, L: p.L, ms: p.ms,
      E: p.E, nu: p.nu, Ka: p.Ka, gamma: p.gamma, q0: p.q0, gammaC: p.gammaC, relleno: p.relleno,
    });
    const sol = resolverSolidoEnWorkspace(states, {
      nodes: malla.nodes, elements: malla.elements, E: p.E, nu: p.nu,
      supports: malla.supports, loads: malla.loads,
      incompatible: Math.round(p.incompatible) === 1,
      rho: p.gammaC / 9.80665,
    });
    ultimo = { malla, sol };
  },
  computedLabels: () => {
    if (!ultimo) return {};
    const { malla, sol } = ultimo;
    const N = malla.nodes.length;
    const out: Record<string, string> = {
      "Nudos": String(N),
      "Hexaedros": String(malla.elements.length),
      "GDL": String(3 * N),
      "Empuje total": `${malla.info.empujeTotal.toFixed(2)} kN`,
    };
    if (malla.info.pesoPropio > 0) out["Peso propio"] = `${malla.info.pesoPropio.toFixed(2)} kN`;
    if (malla.info.pesoRelleno > 0) out["Relleno sobre el talón"] = `${malla.info.pesoRelleno.toFixed(2)} kN`;
    if (!sol.ok) { out["Solver"] = `falló: ${sol.error ?? "?"}`; return out; }
    const ux = sol.desplazamientos.get(malla.nudoCoronacion)?.[0] ?? 0;
    const [sxMin, sxMax] = rangoDeTension(sol.tensiones, 0);
    const [szMin, szMax] = rangoDeTension(sol.tensiones, 2);
    out["ux en la coronación"] = `${(ux * 1000).toFixed(4)} mm`;
    out["σxx (Gauss)"] = `${sxMin.toFixed(1)} … ${sxMax.toFixed(1)} kN/m²`;
    out["σzz (Gauss)"] = `${szMin.toFixed(1)} … ${szMax.toFixed(1)} kN/m²`;
    out["Tiempo de cálculo"] = `${sol.ms.toFixed(0)} ms`;
    return out;
  },
};
