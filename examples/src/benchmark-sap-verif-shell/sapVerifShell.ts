/**
 * Manual de verificación de SAP2000 24 (Manuals\Verification\Analysis\Shells): dos ejemplos para VER en 3D lo que valida
 * `tests/casos/placa_rect_sap2000.mjs` y `tests/casos/anular_shear_sap2000.mjs`.
 *
 *  · 2-005  Placa rectangular (MacNeal & Harder 1985, Timoshenko): un cuarto de placa con simetría, t = 0.0001 in,
 *           E = 17 472 000 lb/in², ν = 0.3, carga uniforme 0.0001 lb/in² o carga central 0.0004 lb.
 *  · 2-012  Placa anular gruesa (Roark & Young 1975): r = 1.4 … 2 in, t = 0.5 in, E = 18 000 000 lb/in², carga lineal de
 *           800 lb/in en r = 1.8 in, apoyo simple en el borde interior, malla 6 × 96.
 *
 * El PDF está en in y lb; aquí se usan SUS NÚMEROS tal cual: 1 in se dibuja como 1 m, 1 psi como 1 kN/m² y 1 lb como 1 kN. La leyenda del visor
 * (poner «Desplazamiento = m») dice 4.06 y eso son 4.06 in. Solo en el 2-005 E y las cargas se multiplican por 1e8
 * (los desplazamientos NO cambian, es lineal): con t tan chico la tolerancia absoluta del elemento grueso daba un falso «Kaa singular» y caía al Q4 estándar.
 * Formulaciones (plateFormulations): 1 Thin = DKE + ITW (defecto) · 6 DKE literal del libro de Wilson · 0 MITC4 ·
 * 4 DSE de Wilson · 8 Thick CSI (la de SAP2000).
 */
import { deform, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

/** La flecha del PDF puede ser mayor que la placa (2-005: 103 mm contra 25 mm): la deformada se dibuja a una fracción para que se lea. */
function escalaVisible(ancho: number, wmax: number, fraccion = 0.25) {
  setTimeout(() => {
    const st = (document.querySelector("#viewer") as any)?.__settings;
    if (st?.deformScale && wmax > 0) st.deformScale.val = Math.min(Number(st.deformScale.val) || 1, fraccion * ancho / wmax);
  }, 500);
}
const FORMULACION = { "Thin · DKE de Wilson (= DKQ)": 1, "DKE literal del libro": 6, "Thick · MITC4": 0, "Thick · DSE de Wilson": 4, "Thick · CSI (SAP2000)": 8 };
const RESULTADOS = ["none", "displacementZ", "bendingXX", "bendingYY", "bendingXY", "transverseShearMax"];

// ---------------------------------------------------------------------------------------------- 2-005
const ESC = 1e8;
const LAM = 1, PSI = 1, LBF = 1;          // 1 in = 1 unidad del visor, 1 psi = 1 kN/m², 1 lb = 1 kN (los mismos números del PDF)
export const macnealHarderPlacaRect: ExampleDef = {
  id: "macneal-harder-1985-placa-rectangular",
  name: "MacNeal & Harder (1985) · Timoshenko (1959) · placa rectangular (SAP2000 2-005)",
  category: "2️⃣ Shells · 🧱 Placas",
  benchmark: true,
  defaultShellResult: "displacementZ",
  availableShellResults: RESULTADOS,
  params: {
    form: { default: 1, label: "Formulación de placa", options: FORMULACION },
    carga: { default: 1, label: "Carga", options: { "Uniforme 0.0001 lb/in²": 1, "Puntual central 0.0004 lb": 2 } },
    malla: { default: 4, label: "Malla del cuarto", options: { "4×4": 4, "16×16": 16 } },
    largo: { default: 1, label: "Largo (cuarto)", options: { "2×2 in (cuarto 1×1)": 1, "2×10 in (cuarto 1×5)": 5 } },
    borde: { default: 0, label: "Borde", options: { "Simple": 0, "Empotrado": 1 } },
  },
  build(p, states) {
    const pf = Math.round(p.form), n = Math.round(p.malla), ax = 1 * LAM, ay = Math.round(p.largo) * LAM, fijo = Math.round(p.borde) === 1;
    const E = 17472000 * PSI * ESC, NU = 0.3, T = 0.0001 * LAM;
    const id = (i: number, j: number) => i * (n + 1) + j;
    const nodes: Node[] = [], elements: Element[] = [];
    for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) nodes.push([ax * i / n, ay * j / n, 0]);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) elements.push([id(i, j), id(i + 1, j), id(i + 1, j + 1), id(i, j + 1)] as Element);
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) {
      const xb = i === n, yb = j === n, sx = i === 0, sy = j === 0;
      const rx = sy || (fijo && (xb || yb)), ry = sx || (fijo && (xb || yb));
      supports.set(id(i, j), [true, true, xb || yb, rx, ry, true]);               // placa pura: los GDL del plano van sujetos
    }
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const areaLoad = new Map<number, number>();
    if (Math.round(p.carga) === 2) loads.set(id(0, 0), [0, 0, -0.0004 * LBF * ESC / 4, 0, 0, 0]);       // un cuarto de la carga central
    else {                                                                                          // uniforme: fuerzas nodales consistentes
      const q = -0.0001 * PSI * ESC, A = (ax / n) * (ay / n);
      for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) {
        const f = ((i === 0 || i === n) ? 0.5 : 1) * ((j === 0 || j === n) ? 0.5 : 1);
        loads.set(id(i, j), [0, 0, q * A * f, 0, 0, 0]);
      }
      void areaLoad;
    }
    const em = (v: number) => new Map<number, number>(elements.map((_, k) => [k, v]));
    const ei = { thicknesses: em(T), elasticities: em(E), poissonsRatios: em(NU), densities: em(0), plateFormulations: em(pf) } as any;
    states.nodes.val = nodes;
    states.elements.val = elements;
    states.elementInputs.val = ei;
    // lo que se dibuja: sin triángulos de apoyo ni flechas (el apoyo y la carga ya están en el cálculo)
    states.nodeInputs.val = { supports: new Map(), loads: new Map() };      // sin flechas: la carga va ×1e8 y su rótulo sería absurdo
    const d = deform(nodes, elements, { supports, loads } as any, ei);
    states.deformOutputs.val = d;
    const c = d.deformations.get(id(0, 0)) as number[];
    escalaVisible(Math.max(ax, ay), Math.abs(c[2]));
    console.log(`[SAP 2-005] formulación pf=${pf} · malla ${n}×${n} · cuarto ${ax}×${ay} · ${fijo ? "empotrado" : "simple"} · Uz(centro) = ${(Math.abs(c[2]) / LAM).toFixed(4)} in`);
  },
};

// ---------------------------------------------------------------------------------------------- 2-012
export const roarkYoungAnular: ExampleDef = {
  id: "roark-young-1975-placa-anular",
  name: "Roark & Young (1975) · placa anular con cortante (SAP2000 2-012)",
  category: "2️⃣ Shells · 🧱 Placas",
  benchmark: true,
  defaultShellResult: "displacementZ",
  availableShellResults: RESULTADOS,
  params: {
    form: { default: 0, label: "Formulación de placa", options: FORMULACION },
    v13: { default: 1, label: "Modificadores de cortante v13 = v23", options: { "1 (normal)": 1, "1000 (cortante despreciable)": 1000 } },
  },
  build(p, states) {
    const pf = Math.round(p.form), v13 = Math.round(p.v13);
    const RI = 1.4 * LAM, RO = 2.0 * LAM, RL = 1.8 * LAM, T = 0.5 * LAM, E = 18e6 * PSI, NU = 0.3, Q = 800 * LBF / LAM, NR = 6, NT = 96;   // Q en kN/m
    const nodes: Node[] = [], idx: number[][] = [], elements: Element[] = [];
    for (let i = 0; i <= NR; i++) {
      idx.push([]);
      const r = RI + (RO - RI) * i / NR;
      for (let j = 0; j < NT; j++) { const a = 2 * Math.PI * j / NT; idx[i].push(nodes.length); nodes.push([r * Math.cos(a), r * Math.sin(a), 0]); }
    }
    for (let i = 0; i < NR; i++) for (let j = 0; j < NT; j++) { const k = (j + 1) % NT; elements.push([idx[i][j], idx[i][k], idx[i + 1][k], idx[i + 1][j]] as Element); }
    const iL = Math.round((RL - RI) / (RO - RI) * NR);
    const P = -Q * (2 * Math.PI * RL / NT);
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    nodes.forEach((_, n) => supports.set(n, [true, true, false, false, false, true]));
    for (const n of idx[0]) supports.set(n, [true, true, true, false, false, true]);             // apoyo simple en el borde interior
    const loads = new Map<number, [number, number, number, number, number, number]>();
    for (const n of idx[iL]) loads.set(n, [0, 0, P, 0, 0, 0]);
    const em = (v: number) => new Map<number, number>(elements.map((_, k) => [k, v]));
    const ei: any = { thicknesses: em(T), elasticities: em(E), poissonsRatios: em(NU), densities: em(0), plateFormulations: em(pf) };
    if (v13 !== 1) ei.shellModifiers = new Map(elements.map((_, k) => [k, [1, 1, 1, 1, 1, 1, v13, v13]]));
    states.nodes.val = nodes;
    states.elements.val = elements;
    states.elementInputs.val = ei;
    states.nodeInputs.val = { supports: new Map(), loads: new Map() };
    const d = deform(nodes, elements, { supports, loads } as any, ei);
    states.deformOutputs.val = d;
    let s = 0; for (const n of idx[NR]) s += (d.deformations.get(n) as number[])[2];
    escalaVisible(2 * RO, Math.abs(s / idx[NR].length));
    console.log(`[SAP 2-012] pf=${pf} v13=v23=${v13} · Uz borde exterior = ${(s / idx[NR].length / LAM).toExponential(6)} in (Roark: flexión −0.00521, suma −0.00534)`);
  },
};

// ---------------------------------------------------------------------------------------------- 2-001
const PATCH_XY: [number, number][] = [[0, 0], [0, 0.12], [0.04, 0.02], [0.08, 0.08], [0.18, 0.03], [0.16, 0.08], [0.24, 0], [0.24, 0.12]];
const PATCH_ELEMS: Element[] = [[1, 0, 2, 3], [0, 6, 4, 2], [6, 7, 5, 4], [7, 1, 3, 5], [2, 4, 5, 3]] as Element[];
const PATCH_BORDE = [0, 1, 6, 7], PATCH_INT = [2, 3, 4, 5];
/** Campo exacto del patch test: [Ux, Uy, Uz, Rx, Ry, Rz]. Rx = +dw/dy, Ry = −dw/dx. */
const patchCampo = (x: number, y: number) => [1e-3 * (x + y / 2), 1e-3 * (y + x / 2), 1e-3 * (x * x + x * y + y * y) / 2, 1e-3 * (x / 2 + y), -1e-3 * (x + y / 2), 0];

export const macnealHarderPatch: ExampleDef = {
  id: "macneal-harder-1985-patch-test",
  name: "MacNeal & Harder (1985) · patch test, 5 elementos irregulares (SAP2000 2-001)",
  category: "2️⃣ Shells · 🧱 Placas",
  benchmark: true,
  defaultShellResult: "displacementZ",
  availableShellResults: RESULTADOS,
  params: {
    form: { default: 1, label: "Formulación de placa", options: FORMULACION },
    caso: { default: 1, label: "Estado", options: { "Flexión (Uz, Rx, Ry)": 1, "Membrana (Ux, Uy)": 2 } },
  },
  build(p, states) {
    const pf = Math.round(p.form), flex = Math.round(p.caso) === 1;
    const E = 1e6, NU = 0.25, T = 0.001;                          // lb, in
    const gdls = flex ? [2, 3, 4] : [0, 1], quietos = flex ? [0, 1] : [2, 3, 4];
    const nodes: Node[] = PATCH_XY.map(([x, y]) => [x, y, 0]);
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    nodes.forEach((_, n) => { const f: boolean[] = [false, false, false, false, false, false]; for (const g of quietos) f[g] = true; supports.set(n, f as any); });
    const K = E * T * 1e8;                                        // muelle rígido: asiento prescrito = fuerza k·u en ese GDL
    const loads = new Map<number, [number, number, number, number, number, number]>(), springs: { node: number; dof: number; k: number }[] = [];
    for (const n of PATCH_BORDE) {
      const u = patchCampo(...PATCH_XY[n]), f = [0, 0, 0, 0, 0, 0];
      for (const g of gdls) { springs.push({ node: n, dof: g, k: K }); f[g] = K * u[g]; }
      loads.set(n, f as any);
    }
    const em = (v: number) => new Map<number, number>(PATCH_ELEMS.map((_, k) => [k, v]));
    const ei = { thicknesses: em(T), elasticities: em(E), poissonsRatios: em(NU), densities: em(0), plateFormulations: em(pf) } as any;
    states.nodes.val = nodes;
    states.elements.val = PATCH_ELEMS;
    states.elementInputs.val = ei;
    states.nodeInputs.val = { supports: new Map(), loads: new Map() };
    const d = deform(nodes, PATCH_ELEMS, { supports, loads } as any, ei, springs as any);
    states.deformOutputs.val = d;
    let peor = 0;
    for (const n of PATCH_INT) {
      const u = d.deformations.get(n) as number[]; const ex = patchCampo(...PATCH_XY[n]);
      const ref = Math.max(...PATCH_XY.map(([x, y]) => Math.abs(patchCampo(x, y)[gdls[0]])));
      for (const g of gdls) peor = Math.max(peor, Math.abs(u[g] - ex[g]) / ref * 100);
    }
    escalaVisible(0.24, Math.max(...nodes.map((_, n) => Math.abs((d.deformations.get(n) as number[])[gdls[0]]))), 0.1);
    console.log(`[MacNeal-Harder patch test] pf=${pf} · ${flex ? "flexión" : "membrana"} · error máximo en los 4 nudos interiores = ${peor.toExponential(2)} %`);
  },
};
