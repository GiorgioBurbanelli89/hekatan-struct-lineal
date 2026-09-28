/**
 * Placa Q4 — Mindlin-Reissner (WASM), con selector de condición de borde.
 *
 * Graduado desde la página con panel propio (`plate-q4/main.ts`, hasta el
 * 28-sep-2026): dibujaba en un canvas 2D propio con un selector de campo
 * (w, βx, βy, Mxx, Myy, Mxy, Qx, Qy) y comparaba w contra la serie de Navier
 * (solo válida para apoyo simple). Aquí el modelo se resuelve igual
 * (`plateQ4Solve`, mismos parámetros y mismo valor de `theoryType` que usaba
 * — la página vieja NUNCA lo pasaba, así que corría con el 0 por defecto de
 * `plateQ4Solve`, Mindlin-Reissner) y el resultado se vuelca al visor del
 * workspace exactamente como lo hace `plate-thin/plateThin.ts`.
 */
import { plateQ4Solve, type Node } from "hekatan-fem";
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";

/** Serie de Navier (apoyo simple, carga uniforme) — del panel viejo `plate-q4/main.ts` líneas 38-48. */
function navierW(a: number, b: number, q: number, D: number, x: number, y: number, nTerms = 50): number {
  let w = 0;
  for (let m = 1; m <= nTerms; m += 2) {
    for (let n = 1; n <= nTerms; n += 2) {
      const amn = (m * Math.PI / a) ** 2 + (n * Math.PI / b) ** 2;
      const qmn = 16 * q / (Math.PI ** 2 * m * n);
      w += qmn / (D * amn ** 2) * Math.sin(m * Math.PI * x / a) * Math.sin(n * Math.PI * y / b);
    }
  }
  return w;
}

let ultimo: {
  clamped: boolean;
  wMax: number; wCenter: number;
  maxMxx: number; maxMyy: number; maxMxy: number; maxQx: number; maxQy: number;
  wNavier: number; errNavier: number;
} | null = null;

export const plateQ4: ExampleDef = {
  id: "plate-q4",
  name: "Placa Q4 — estudio",
  category: "2️⃣ Shells · 🧱 Placas",
  benchmark: true,
  // El panel viejo abría con `resultType = "w"` (desplazamiento transversal).
  defaultShellResult: "displacementZ",
  availableShellResults: [
    "none", "pressure",
    "bendingXX", "bendingYY", "bendingXY",
    "bendingPrincipalMax", "bendingPrincipalMin",
    "tranverseShearX", "tranverseShearY", "transverseShearMax",
    "displacementX", "displacementY", "displacementZ",
  ],
  guide: [
    "«Condición de borde» elige apoyo simple o empotrado en los 4 bordes",
    "Con apoyo simple, «Calculados» compara w en el centro contra la serie de Navier",
    "Con empotrado no hay fórmula de Navier: la comparación no aplica (se avisa en la etiqueta)",
    "8 salidas por nudo/elemento: w, βx, βy (deformada) y Mxx, Myy, Mxy, Qx, Qy (colormap)",
  ],
  params: {
    Lx: { default: 10, min: 1, max: 30, step: 1, label: "Lx (m)", folder: "Geometría" },
    Ly: { default: 10, min: 1, max: 30, step: 1, label: "Ly (m)", folder: "Geometría" },
    nx: { default: 16, min: 2, max: 64, step: 2, label: "nx elementos", folder: "Malla" },
    ny: { default: 16, min: 2, max: 64, step: 2, label: "ny elementos", folder: "Malla" },
    t:  { default: 0.2,  min: 0.05, max: 2,   step: 0.05, label: "espesor t (m)", folder: "Material" },
    E:  { default: 30e6, min: 1e6,  max: 100e6, step: 1e6, label: "E (kN/m²)", folder: "Material" },
    nu: { default: 0.3,  min: 0,    max: 0.45, step: 0.05, label: "ν", folder: "Material" },
    // q = magnitud de carga uniforme descendente en kN/m² (+). Internamente se aplica como -q,
    // igual que el `Math.abs(_p)` que el panel viejo le pasaba a la serie de Navier.
    q:  { default: 10, min: 0, max: 50, step: 1, label: "q presión ↓ (kN/m²)", folder: "Cargas" },
    bcType: {
      default: 0,
      options: { "simplemente apoyada": 0, "empotrada": 1 },
      label: "Condición de borde",
      folder: "Cargas",
    },
  },
  build(p: Record<string, number>, states: BuildStates) {
    const clamped = Math.round(p.bcType) === 1;
    const bcType = clamped ? "clamped" : "simply-supported";
    const nx = Math.round(p.nx), ny = Math.round(p.ny);

    const out = plateQ4Solve({
      E: p.E, nu: p.nu, thickness: p.t,
      theoryType: 0,              // 0 = Mindlin-Reissner: el defecto que ya usaba el panel viejo
      meshLx: p.Lx, meshLy: p.Ly,
      meshNx: nx, meshNy: ny,
      bcType,
      pressure: -p.q,             // aplicar carga hacia abajo
    });

    const nodes: Node[] = out.nodeResults.map((n) => [n.x, n.y, 0]);
    const elems = out.elementResults.map((e) => e.nodes);
    states.nodes.val = nodes;
    states.elements.val = elems as number[][];

    const thicknesses = new Map<number, number>();
    elems.forEach((_, i) => thicknesses.set(i, p.t));

    // ── Supports/loads para visualización (plateQ4Solve los aplicó internamente) ──
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const A_trib_full = (p.Lx / nx) * (p.Ly / ny);
    nodes.forEach((n, i) => {
      const onEdge = Math.abs(n[0]) < 1e-6 || Math.abs(n[0] - p.Lx) < 1e-6 ||
                     Math.abs(n[1]) < 1e-6 || Math.abs(n[1] - p.Ly) < 1e-6;
      if (onEdge) supports.set(i, [true, true, true, clamped, clamped, false]);
      const corner = (Math.abs(n[0]) < 1e-6 || Math.abs(n[0] - p.Lx) < 1e-6) &&
                     (Math.abs(n[1]) < 1e-6 || Math.abs(n[1] - p.Ly) < 1e-6);
      const factor = corner ? 0.25 : onEdge ? 0.5 : 1.0;
      const Fz = -p.q * A_trib_full * factor;
      loads.set(i, [0, 0, Fz, 0, 0, 0]);
    });

    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = { thicknesses };

    const deformations = new Map<number, [number, number, number, number, number, number]>();
    out.nodeResults.forEach((n, i) => {
      deformations.set(i, [0, 0, n.w, n.bx, n.by, 0]);
    });
    states.deformOutputs.val = { deformations };

    // Poblar analyzeOutputs con las 5 resultantes por elemento (Mxx/Myy/Mxy/Qx/Qy)
    const bendingXX = new Map<number, number[]>();
    const bendingYY = new Map<number, number[]>();
    const bendingXY = new Map<number, number[]>();
    const tranverseShearX = new Map<number, number[]>();
    const tranverseShearY = new Map<number, number[]>();
    out.elementResults.forEach((er, i) => {
      bendingXX.set(i, [er.Mxx, er.Mxx, er.Mxx, er.Mxx]);
      bendingYY.set(i, [er.Myy, er.Myy, er.Myy, er.Myy]);
      bendingXY.set(i, [er.Mxy, er.Mxy, er.Mxy, er.Mxy]);
      tranverseShearX.set(i, [er.Qx, er.Qx, er.Qx, er.Qx]);
      tranverseShearY.set(i, [er.Qy, er.Qy, er.Qy, er.Qy]);
    });
    states.analyzeOutputs.val = { bendingXX, bendingYY, bendingXY, tranverseShearX, tranverseShearY };
    states.objects3D.val = [];

    // ── Comparación con la serie de Navier (solo apoyo simple, como el panel viejo) ──
    const D = (p.E * p.t ** 3) / (12 * (1 - p.nu ** 2));
    const wCenter = Math.abs(out.centerW ?? out.maxW);
    let wNavier = NaN, errNavier = NaN;
    if (!clamped) {
      wNavier = navierW(p.Lx, p.Ly, Math.abs(p.q), D, p.Lx / 2, p.Ly / 2);
      errNavier = Math.abs((wCenter - wNavier) / wNavier) * 100;
    }
    ultimo = {
      clamped, wMax: out.maxW, wCenter,
      maxMxx: out.maxMxx, maxMyy: out.maxMyy, maxMxy: out.maxMxy,
      maxQx: out.maxQx, maxQy: out.maxQy,
      wNavier, errNavier,
    };
  },
  computedLabels: () => {
    if (!ultimo) return {};
    const out: Record<string, string> = {
      "w máximo |w|": `${ultimo.wMax.toExponential(4)} m`,
      "w en el centro": `${ultimo.wCenter.toExponential(4)} m`,
      "Mxx máximo": `${ultimo.maxMxx.toExponential(4)} kN·m/m`,
      "Myy máximo": `${ultimo.maxMyy.toExponential(4)} kN·m/m`,
      "Mxy máximo": `${ultimo.maxMxy.toExponential(4)} kN·m/m`,
      "Qx máximo": `${ultimo.maxQx.toExponential(4)} kN/m`,
      "Qy máximo": `${ultimo.maxQy.toExponential(4)} kN/m`,
    };
    if (ultimo.clamped) {
      out["w Navier (analítico)"] = "no aplica — la serie de Navier es solo para apoyo simple";
    } else {
      out["w Navier (analítico)"] = `${ultimo.wNavier.toExponential(4)} m`;
      out["Δ Hekatan vs Navier"] = `${ultimo.errNavier.toFixed(2)} %`;
    }
    return out;
  },
};
