/**
 * PLACA BASE DE COLUMNA TUBULAR (SHS / RHS) con hormigón SOLO COMPRESIÓN y pernos SOLO TRACCIÓN.
 *
 * Es el MISMO modelo que las hojas 144 (SHS 200×200×10) y 145 (RHS 250×150×8) de Hekatan LISP y que sus
 * jueces (hekatan-lisp/tests/placa_base/: abaqus_inp.py, idea_deck.py): mismos nudos, mismas cáscaras,
 * mismos muelles y mismas cargas, nudo a nudo.
 *
 *   placa      9×9 nudos en z = 0, 64 cáscaras Q4 de espesor t_p (rejilla con líneas en ±fx, ±ax, ±ax/2, 0)
 *   tubo       16 nudos por anillo (la línea media de la pared, ±ax / ±ay), 5 anillos hasta H = 0.1 m, 80 Q4
 *   soldadura  el anillo de abajo del tubo SON nudos de la placa (nudos compartidos: unión rígida)
 *   hormigón   muelle de área nodal (∫N_i dA = área tributaria) k_c = 60 000 MN/m³, solo compresión
 *              (el Gap de CSI; `areaspring … nodal compresion`)
 *   pernos     4 muelles de nudo k_b = E·A_b/L_b en (±fx, ±fy), solo tracción (`spring … traccion`)
 *   carga      N y M en el anillo de arriba como tensiones de Navier σ = −N/A − M·y/I sobre la pared
 *              (fuerza nodal = σ·ℓ·t, ℓ = media de los dos lados del nudo)
 *   apoyos     solo lo que quita el sólido rígido en el plano: nudo 41 (centro) ux uy, nudo 45 uy
 *
 * Unidades kN, m. Lo no lineal (qué nudos tocan y qué pernos tiran) lo resuelve el conjunto activo de
 * `shared/muellesSoloCompresion.ts`, exacto para esta ley (la energía es convexa).
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import { cliModeler } from "../cli-modeler/cliModeler";

/** Datos de los dos casos, copiados de hekatan-lisp/tests/placa_base/params_{shs,rhs}.json */
export const CASOS_PLACA_TUBULAR = {
  shs: { nombre: "SHS 200 × 200 × 10 (hoja 144)", bx: 0.2, dy: 0.2, t_c: 0.01, Lx: 0.2, Ly: 0.2, fx: 0.125, fy: 0.125, N: 300, M: 40 },
  rhs: { nombre: "RHS 250 × 150 × 8 (hoja 145)", bx: 0.15, dy: 0.25, t_c: 0.008, Lx: 0.175, Ly: 0.225, fx: 0.1, fy: 0.15, N: 300, M: 50 },
} as const;

/**
 * Lo que dieron los jueces con este modelo (5-oct-2026, registros/2026-10-05_placa_base_columna_tubular_fem_aisc_abaqus.md):
 * hoja de Hekatan LISP, Abaqus (S4 + SPRING1 no lineales) y el solver de IDEA StatiCa (k2fem64, CGAP).
 */
export const JUECES_PLACA_TUBULAR = {
  shs: { hoja: { Rc: 356.96, Tb: 28.48 }, abaqus: { Rc: 357.07, Tb: 28.54, uzPerno: 0.1155 }, idea: { uzPerno: 0.1162 }, levantados: 38, pernos: 2 },
  rhs: { hoja: { Rc: 367.82, Tb: 33.91 }, abaqus: { Rc: 367.96, Tb: 33.98, uzPerno: 0.1375 }, idea: { uzPerno: 0.1385 }, levantados: null, pernos: 2 },
} as const;

export interface ParamsPlacaTubular {
  caso: number;      // 0 = SHS, 1 = RHS
  N: number;         // kN, compresión positiva
  M: number;         // kN·m, alrededor de x (tracción en el lado y < 0)
  t_p: number;       // espesor de la placa (m)
  t_c?: number;      // espesor del tubo (m); por defecto el del caso
  k_c: number;       // módulo de balasto del hormigón bajo la placa (kN/m³)
  A_b: number;       // área resistente del perno (cm²); 3.53 = la de las hojas (M24)
  L_b: number;       // longitud elástica del perno (m)
}

export const PLACA_TUBULAR_DEF: ParamsPlacaTubular = { caso: 0, N: 300, M: 40, t_p: 0.025, k_c: 60e6, A_b: 3.53, L_b: 0.3 };

const E_ACERO = 210e6, NU_ACERO = 0.3, NZ = 5, H_TUBO = 0.1;
/** El anillo del tubo: (columna, fila) 1-based en la rejilla 9×9, empezando en (-ax, -ay) y en sentido antihorario */
const PI_X = [3, 4, 5, 6, 7, 7, 7, 7, 7, 6, 5, 4, 3, 3, 3, 3];
const PI_Y = [3, 3, 3, 3, 3, 4, 5, 6, 7, 7, 7, 7, 7, 6, 5, 4];

/** Geometría y cargas del modelo (lo mismo que abaqus_inp.py). */
export function modeloPlacaTubular(p: ParamsPlacaTubular) {
  const c = p.caso === 1 ? CASOS_PLACA_TUBULAR.rhs : CASOS_PLACA_TUBULAR.shs;
  const t_c = p.t_c ?? c.t_c;
  const ax = (c.bx - t_c) / 2, ay = (c.dy - t_c) / 2;
  const xs = [-c.Lx, -c.fx, -ax, -ax / 2, 0, ax / 2, ax, c.fx, c.Lx];
  const ys = [-c.Ly, -c.fy, -ay, -ay / 2, 0, ay / 2, ay, c.fy, c.Ly];
  const nx = 9, np = 81;
  const X: number[][] = [];
  for (let j = 0; j < nx; j++) for (let i = 0; i < nx; i++) X.push([xs[i], ys[j], 0]);
  const Pn = PI_X.map((_, k) => (PI_Y[k] - 1) * nx + PI_X[k]);            // id (1-based) del nudo de placa del anillo
  for (let l = 1; l <= NZ; l++) for (let k = 0; k < 16; k++) X.push([xs[PI_X[k] - 1], ys[PI_Y[k] - 1], (H_TUBO * l) / NZ]);
  const tubo = (l: number, k: number) => (l === 0 ? Pn[k - 1] : np + (l - 1) * 16 + k);
  const placa: number[][] = [], pared: number[][] = [];
  for (let j = 1; j < nx; j++) for (let i = 1; i < nx; i++) { const q = (j - 1) * nx + i; placa.push([q, q + 1, q + nx + 1, q + nx]); }
  for (let l = 1; l <= NZ; l++) for (let k = 1; k <= 16; k++) { const k2 = (k % 16) + 1; pared.push([tubo(l - 1, k), tubo(l - 1, k2), tubo(l, k2), tubo(l, k)]); }
  const pernos = [nx + 2, nx + 8, 7 * nx + 2, 7 * nx + 8];                 // (±fx, ±fy): nudos 11, 17, 65, 71
  // carga: Navier sobre la pared, ℓ = media de los dos lados del nudo
  const px = PI_X.map((i) => xs[i - 1]), py = PI_Y.map((j) => ys[j - 1]);
  const ell = px.map((_, k) => {
    const a = (k + 15) % 16, b = (k + 1) % 16;
    return (Math.hypot(px[k] - px[a], py[k] - py[a]) + Math.hypot(px[k] - px[b], py[k] - py[b])) / 2;
  });
  const A_t = ell.reduce((s, e) => s + e * t_c, 0);
  const I_t = ell.reduce((s, e, k) => s + e * t_c * py[k] ** 2, 0);
  const F = new Map<number, number>();
  for (let k = 0; k < 16; k++) F.set(np + (NZ - 1) * 16 + k + 1, (-p.N / A_t - (p.M * py[k]) / I_t) * ell[k] * t_c);
  const A_b = p.A_b * 1e-4;
  const k_b = (E_ACERO * A_b) / p.L_b;
  return { c, t_c, ax, ay, xs, ys, X, placa, pared, pernos, F, k_b, A_t, I_t, anillo: Pn };
}

/** El .heks del modelo (lo que la app resuelve; también lo lee el test). */
export function heksPlacaTubular(p: ParamsPlacaTubular): string {
  const m = modeloPlacaTubular(p);
  const L: string[] = [];
  L.push(`# Placa base de columna tubular ${m.c.nombre}: N = ${p.N} kN, M = ${p.M} kN·m. Unidades kN, m.`);
  L.push(`# Mismo modelo que la hoja de Hekatan LISP, Abaqus (S4 + SPRING1) y el solver de IDEA (k2fem64), nudo a nudo.`);
  m.X.forEach((q, i) => L.push(`node ${i + 1} ${+q[0].toFixed(10)} ${+q[1].toFixed(10)} ${+q[2].toFixed(10)}`));
  // placa (1..64) y tubo (65..144): acero E = 210 GPa, ν = 0.3, sin carga de superficie, ρ 7.85 t/m³
  m.placa.forEach((e, i) => L.push(`shell ${i + 1} ${e.join(" ")} ${p.t_p} ${E_ACERO} 0 7.85`));
  m.pared.forEach((e, i) => L.push(`shell ${65 + i} ${e.join(" ")} ${m.t_c} ${E_ACERO} 0 7.85`));
  L.push(`shellnu 1-${64 + m.pared.length} ${NU_ACERO}`);
  L.push(`# hormigón bajo la placa: muelle de área nodal SOLO COMPRESIÓN (Gap de CSI)`);
  for (let i = 1; i <= 64; i++) L.push(`areaspring ${i} ${p.k_c} nodal compresion`);
  L.push(`# pernos de anclaje: muelle de nudo k = E·A/L SOLO TRACCIÓN (Hook de CSI)`);
  for (const q of m.pernos) L.push(`spring ${q} uz ${+m.k_b.toFixed(6)} traccion`);
  L.push(`# sólido rígido en el plano: centro ux uy, nudo 45 uy`);
  L.push(`support 41 1 1 0 0 0 0`);
  L.push(`support 45 0 1 0 0 0 0`);
  for (const [q, f] of m.F) L.push(`load ${q} 0 0 ${+f.toFixed(10)} 0 0 0`);
  L.push(`selfweight 0`);
  L.push(`solve`);
  return L.join("\n") + "\n";
}

/** Resumen de los muelles a partir de los desplazamientos (mismas cuentas que comparar.py de la hoja). */
export function resumenPlacaTubular(p: ParamsPlacaTubular, U: Map<number, number[]>) {
  const m = modeloPlacaTubular(p);
  const nx = 9;
  const kc: number[] = [];
  for (let j = 1; j <= nx; j++) for (let i = 1; i <= nx; i++) {
    const i0 = Math.max(i - 1, 1), i1 = Math.min(i + 1, nx), j0 = Math.max(j - 1, 1), j1 = Math.min(j + 1, nx);
    kc.push((p.k_c * (m.xs[i1 - 1] - m.xs[i0 - 1]) / 2) * ((m.ys[j1 - 1] - m.ys[j0 - 1]) / 2));
  }
  const uz = (q: number) => U.get(q - 1)?.[2] ?? 0;
  let Rc = 0, lev = 0, pmax = 0;
  for (let q = 1; q <= 81; q++) { const u = uz(q); if (u < 0) { Rc += -kc[q - 1] * u; pmax = Math.max(pmax, -p.k_c * u); } else if (u > 0) lev++; }
  const Tb = m.pernos.map((q) => (uz(q) > 0 ? m.k_b * uz(q) : 0));
  return { Rc, Tb: Tb.reduce((s, v) => s + v, 0), Tmax: Math.max(...Tb), pernosActivos: Tb.filter((v) => v > 0).length,
           levantados: lev, pmax, uzPernos: m.pernos.map(uz), kc, k_b: m.k_b };
}

export const placaBaseTubular: ExampleDef = {
  id: "placa-base-tubular",
  name: "Placa base de columna tubular (SHS/RHS): hormigón solo compresión + pernos solo tracción · vs Abaqus e IDEA",
  category: "2️⃣ Shells · 🔩 Conexiones",
  defaultShellResult: "pressure",
  // desde el lado comprimido (y > 0): el tubo no tapa la presión del hormigón
  viewFrom: [1, 1, 1],
  availableShellResults: [
    "none", "pressure", "vonMises",
    "displacementZ", "displacementX", "displacementY",
    "bendingXX", "bendingYY", "bendingXY",
    "membraneXX", "membraneYY", "membraneXY",
  ],
  params: {
    caso: { default: 0, label: "Columna", folder: "Columna", options: { "SHS 200×200×10": 0, "RHS 250×150×8": 1 }, regenOnChange: true },
    N: { default: 300, min: 0, max: 1500, step: 1, label: "N compresión (kN)", folder: "Cargas" },
    M: { default: 40, min: 0, max: 120, step: 0.5, label: "M alrededor de x (kN·m)", folder: "Cargas" },
    t_p: { default: 0.025, min: 0.01, max: 0.06, step: 0.001, label: "Espesor placa (m)", folder: "Placa" },
    k_c: { default: 60e6, min: 1e6, max: 2e8, step: 1e5, label: "Balasto hormigón (kN/m³)", folder: "Hormigón y pernos" },
    A_b: { default: 3.53, min: 1, max: 12, step: 0.01, label: "Área perno (cm²)", folder: "Hormigón y pernos" },
    L_b: { default: 0.3, min: 0.1, max: 1, step: 0.01, label: "Longitud elástica perno (m)", folder: "Hormigón y pernos" },
  },
  onParamChange(k: string, params: any) {
    // al cambiar de columna, el momento de su hoja (SHS 40, RHS 50 kN·m)
    if (k === "caso") params.M = params.caso === 1 ? CASOS_PLACA_TUBULAR.rhs.M : CASOS_PLACA_TUBULAR.shs.M;
  },
  build(pr: any, states: any, mp: any) {
    const p = { ...PLACA_TUBULAR_DEF, ...pr } as ParamsPlacaTubular;
    (window as any).__hekatanCliScript = heksPlacaTubular(p);
    cliModeler.build({}, states, mp);
  },
  computedLabels(pr: any, states: any) {
    const p = { ...PLACA_TUBULAR_DEF, ...pr } as ParamsPlacaTubular;
    const out: Record<string, string> = {};
    const U = states?.deformOutputs?.val?.deformations as Map<number, number[]> | undefined;
    if (!U?.size) return out;
    const r = resumenPlacaTubular(p, U);
    out["Hormigón: reacción"] = `${r.Rc.toFixed(2)} kN (p máx ${(r.pmax / 1000).toFixed(2)} MPa)`;
    out["Pernos: tracción"] = `${r.Tb.toFixed(2)} kN · ${r.pernosActivos} de 4 activos · T máx ${r.Tmax.toFixed(2)} kN`;
    out["ΣFz"] = `${(r.Rc - r.Tb).toFixed(3)} kN (N = ${p.N})`;
    out["Nudos levantados"] = `${r.levantados} de 81`;
    out["uz pernos (mm)"] = r.uzPernos.map((v) => (v * 1000).toFixed(4)).join(" · ");
    const k = (window as any).__hekatanCliContacto;
    if (k) out["Iteraciones (Gap/Hook)"] = `${k.iteraciones}: ${k.historial.join(" → ")}`;
    // los jueces solo valen con los datos de la hoja
    const def = p.caso === 1 ? CASOS_PLACA_TUBULAR.rhs : CASOS_PLACA_TUBULAR.shs;
    const J = p.caso === 1 ? JUECES_PLACA_TUBULAR.rhs : JUECES_PLACA_TUBULAR.shs;
    if (p.N === def.N && p.M === def.M && p.t_p === 0.025 && p.k_c === 60e6 && p.A_b === 3.53 && p.L_b === 0.3) {
      out["Juez Abaqus (R hormigón / T pernos)"] = `${J.abaqus.Rc} / ${J.abaqus.Tb} kN`;
      out["Juez hoja LISP (R / T)"] = `${J.hoja.Rc} / ${J.hoja.Tb} kN`;
      out["Juez uz perno Abaqus / IDEA"] = `${J.abaqus.uzPerno} / ${J.idea.uzPerno} mm`;
    }
    return out;
  },
} as ExampleDef;
