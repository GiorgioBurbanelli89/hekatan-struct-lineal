/**
 * Nudo columna–viga de HORMIGÓN modelado con sólidos H8 (id histórico `solid-cube-fem`).
 *
 * Pese al id, no es un cubo ni se compara con CalculiX: es una columna empotrada en la base
 * y en el tope (entrepiso típico) con una viga en voladizo que sale de la mitad de su altura,
 * y una carga puntual vertical en el extremo libre de la viga.
 *
 * Geometría:
 *   - Columna vertical (eje Z), centrada en (0,0), de Lx_col × Ly_col × Lz
 *   - Viga horizontal (en +Y) en mitad de la columna (z = Lz/2),
 *     ancho W_beam (eje X), peralte H_beam (eje Z), longitud L_beam (eje Y)
 *   - La viga se ajusta a la rejilla de la columna (W y H «en la malla» pueden diferir de lo
 *     pedido): la sección que usan la malla y la fórmula es la AJUSTADA.
 *
 * Comparación (la de la página de antes, con sus rangos esperados):
 *   δ_EB    = P·L³/(3·E·I_viga)                   Euler-Bernoulli, empotramiento rígido
 *   δ_corte = P·L/(κ·G·A_viga), κ = 5/6            Timoshenko, sección rectangular
 *   δ_col   = θ_col·L, θ_col = M·Lz/(16·E·I_col)   giro de la columna biempotrada con el
 *                                                  momento M = P·L en la mitad
 *   δ_total = δ_EB + δ_corte + δ_col
 *   δ_H8    = media de uz en los nudos del extremo de la viga
 *   Esperado: δ_H8 entre un 20 y un 40 % por encima de δ_EB; frente a δ_total, < 15 %
 *   (< 5 % «pasa», 5-15 % «aceptable», > 15 % «revisar»).
 *
 * Desde el 28-sep-2026 corre DENTRO del workspace con hexaedros de verdad. La página de antes
 * dibujaba las caras exteriores como cáscaras de 1 mm y escribía el campo elegido en
 * `analyzeOutputs.vonMises`. El modelo (malla, apoyos, carga, E, ν, solver con modos
 * incompatibles) es el mismo, movido tal cual.
 */
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";
import type { Vec3, Hex8 } from "hekatan-fem";
import { resolverSolidoEnWorkspace, rangoDeTension, type SolucionSolido } from "../shared/solidosWorkspace";

export interface ColumnaVigaParams {
  Lx_col: number; Ly_col: number; Lz: number;
  W_beam: number; H_beam: number; L_beam: number;
  nx_col: number; ny_col: number; nz: number; ny_b: number;
  E: number; nu: number; P_tip: number;
}

export const COLUMNA_VIGA_DEFAULT: ColumnaVigaParams = {
  Lx_col: 0.40, Ly_col: 0.40, Lz: 3.00,
  W_beam: 0.20, H_beam: 0.50, L_beam: 1.50,
  nx_col: 4, ny_col: 4, nz: 12, ny_b: 6,
  E: 25e6, nu: 0.20, P_tip: -30,
};

export interface ColumnaVigaMalla {
  nodes: Vec3[];
  elements: Hex8[];
  supports: Map<number, [boolean, boolean, boolean]>;
  loads: Map<number, [number, number, number]>;
  /** Nudos de la cara del extremo libre de la viga (y = Ly_col/2 + L_beam). */
  tipNodes: number[];
  fz_tip: number;
  /** Sección de la viga ajustada a la rejilla de la columna. */
  W_b_snap: number;
  H_b_snap: number;
  nColumna: number;
}

/** La malla, pura: la misma cuenta que llevaba la página (dedup por coordenada a 4 decimales). */
export function mallaColumnaViga(p: ColumnaVigaParams): ColumnaVigaMalla {
  const { Lx_col, Ly_col, Lz, W_beam, H_beam, L_beam, P_tip } = p;
  const nx_col = Math.round(p.nx_col);
  const ny_col = Math.round(p.ny_col);
  const nz = Math.round(p.nz);
  const ny_b = Math.round(p.ny_b);

  // ── 1. Malla H8 con dedup por coordenada (para que la viga comparta nudos con la columna) ──
  const nodes3D: Vec3[] = [];
  const nodeMap = new Map<string, number>();
  const elemsH8: Hex8[] = [];
  const KEY_DEC = 4;
  function getOrAddNode(x: number, y: number, z: number): number {
    const key = `${x.toFixed(KEY_DEC)},${y.toFixed(KEY_DEC)},${z.toFixed(KEY_DEC)}`;
    let id = nodeMap.get(key);
    if (id === undefined) {
      nodes3D.push([x, y, z]);
      id = nodes3D.length - 1;
      nodeMap.set(key, id);
    }
    return id;
  }
  function addBox(
    x0: number, y0: number, z0: number,
    x1: number, y1: number, z1: number,
    nxx: number, nyy: number, nzz: number,
  ) {
    const dx = (x1 - x0) / nxx;
    const dy = (y1 - y0) / nyy;
    const dz = (z1 - z0) / nzz;
    for (let k = 0; k < nzz; k++) {
      for (let j = 0; j < nyy; j++) {
        for (let i = 0; i < nxx; i++) {
          elemsH8.push([
            getOrAddNode(x0 + i * dx,       y0 + j * dy,       z0 + k * dz),
            getOrAddNode(x0 + (i + 1) * dx, y0 + j * dy,       z0 + k * dz),
            getOrAddNode(x0 + (i + 1) * dx, y0 + (j + 1) * dy, z0 + k * dz),
            getOrAddNode(x0 + i * dx,       y0 + (j + 1) * dy, z0 + k * dz),
            getOrAddNode(x0 + i * dx,       y0 + j * dy,       z0 + (k + 1) * dz),
            getOrAddNode(x0 + (i + 1) * dx, y0 + j * dy,       z0 + (k + 1) * dz),
            getOrAddNode(x0 + (i + 1) * dx, y0 + (j + 1) * dy, z0 + (k + 1) * dz),
            getOrAddNode(x0 + i * dx,       y0 + (j + 1) * dy, z0 + (k + 1) * dz),
          ]);
        }
      }
    }
  }

  // Ajuste de la viga a la rejilla de la columna para un dedup limpio
  const col_dx = Lx_col / nx_col;
  const col_dz = Lz / nz;
  // n.º de celdas de la viga en x y z (al menos 2 para una flexión decente)
  let nx_b = Math.max(2, Math.round(W_beam / col_dx));
  // misma paridad que nx_col para que la viga quede centrada y alineada en x
  if (((nx_col - nx_b) & 1) !== 0) nx_b = Math.max(2, nx_b - 1);
  let nz_b = Math.max(2, Math.round(H_beam / col_dz));
  // el peralte debe ser múltiplo par de col_dz para centrarlo en z = Lz/2
  if ((nz_b & 1) !== 0) nz_b = Math.max(2, nz_b - 1);
  const W_b_snap = nx_b * col_dx;
  const H_b_snap = nz_b * col_dz;
  // z_mid: nudo central de la columna (k = nz/2)
  const k_mid = Math.round(nz / 2);
  const z_mid = k_mid * col_dz;
  const z_b_bot = z_mid - H_b_snap / 2;
  const z_b_top = z_mid + H_b_snap / 2;

  // Columna centrada en (0,0): x∈[-Lx/2, Lx/2], y∈[-Ly/2, Ly/2]
  const x_col_0 = -Lx_col / 2, x_col_1 = Lx_col / 2;
  const y_col_0 = -Ly_col / 2, y_col_1 = Ly_col / 2;
  addBox(x_col_0, y_col_0, 0, x_col_1, y_col_1, Lz, nx_col, ny_col, nz);
  const nColumna = elemsH8.length;

  // Viga: x∈[-W/2, W/2], y∈[Ly_col/2, Ly_col/2 + L_beam], z∈[z_b_bot, z_b_top]
  const x_b_0 = -W_b_snap / 2, x_b_1 = W_b_snap / 2;
  const y_b_1 = y_col_1 + L_beam;
  addBox(x_b_0, y_col_1, z_b_bot, x_b_1, y_b_1, z_b_top, nx_b, ny_b, nz_b);

  // ── 2. Apoyos: empotrar BASE (z=0) y TOPE (z=Lz) de la columna ──
  const supports = new Map<number, [boolean, boolean, boolean]>();
  nodes3D.forEach((q, id) => {
    const inCol = (q[0] >= x_col_0 - 1e-6 && q[0] <= x_col_1 + 1e-6 &&
                   q[1] >= y_col_0 - 1e-6 && q[1] <= y_col_1 + 1e-6);
    if (inCol && (Math.abs(q[2]) < 1e-6 || Math.abs(q[2] - Lz) < 1e-6)) {
      supports.set(id, [true, true, true]);
    }
  });

  // ── 3. Carga puntual −Z en el extremo libre de la viga, repartida a partes iguales ──
  const tipNodes: number[] = [];
  nodes3D.forEach((q, id) => {
    const onBeamTip =
      Math.abs(q[1] - y_b_1) < 1e-6 &&
      q[0] >= x_b_0 - 1e-6 && q[0] <= x_b_1 + 1e-6 &&
      q[2] >= z_b_bot - 1e-6 && q[2] <= z_b_top + 1e-6;
    if (onBeamTip) tipNodes.push(id);
  });
  const loads = new Map<number, [number, number, number]>();
  const fz_tip = tipNodes.length > 0 ? P_tip / tipNodes.length : 0;
  for (const id of tipNodes) loads.set(id, [0, 0, fz_tip]);

  return { nodes: nodes3D, elements: elemsH8, supports, loads, tipNodes, fz_tip, W_b_snap, H_b_snap, nColumna };
}

export interface ComparacionColumnaViga {
  P: number; L_beam: number; I_beam: number; I_col: number;
  delta_EB: number; delta_shear: number; delta_col: number; delta_total_an: number;
  delta_he: number; errEBpct: number; errTotalPct: number;
}

/** La comparación analítica de la página de antes, con la flecha medida en el extremo. */
export function compararColumnaViga(
  p: ColumnaVigaParams, m: ColumnaVigaMalla, desplazamientos: Map<number, Vec3>,
): ComparacionColumnaViga {
  const { E, nu, Lz, Lx_col, Ly_col, L_beam, P_tip } = p;
  let tipUzAvg = 0;
  for (const id of m.tipNodes) {
    const u = desplazamientos.get(id);
    if (u) tipUzAvg += u[2];
  }
  tipUzAvg /= Math.max(1, m.tipNodes.length);

  const I_beam = (m.W_b_snap * m.H_b_snap * m.H_b_snap * m.H_b_snap) / 12;
  const A_beam = m.W_b_snap * m.H_b_snap;
  const G = E / (2 * (1 + nu));
  const kappa = 5 / 6;  // factor de corrección de cortante, sección rectangular
  const delta_EB = (P_tip * L_beam * L_beam * L_beam) / (3 * E * I_beam);
  const delta_shear = (P_tip * L_beam) / (kappa * G * A_beam);
  // Columna biempotrada con M = P·L_beam en la mitad: θ = M·Lz/(16·E·I_col)
  const I_col = (Lx_col * Ly_col * Ly_col * Ly_col) / 12;  // flexión alrededor de X
  const M_joint = P_tip * L_beam;
  const theta_col = (M_joint * Lz) / (16 * E * I_col);
  const delta_col = theta_col * L_beam;
  const delta_total_an = delta_EB + delta_shear + delta_col;

  const errEBpct = Math.abs(tipUzAvg - delta_EB) / Math.abs(delta_EB || 1) * 100;
  const errTotalPct = Math.abs(tipUzAvg - delta_total_an) / Math.abs(delta_total_an || 1) * 100;
  return {
    P: P_tip, L_beam, I_beam, I_col,
    delta_EB, delta_shear, delta_col, delta_total_an,
    delta_he: tipUzAvg, errEBpct, errTotalPct,
  };
}

/** El «Status» de la página de antes. */
export function estadoComparacion(errTotalPct: number): string {
  return errTotalPct < 5 ? "✓ pasa (< 5 %)"
       : errTotalPct < 15 ? "⚠ aceptable (5-15 %)"
       : "✗ revisar (> 15 %)";
}

const D = COLUMNA_VIGA_DEFAULT;
const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

let ultimo: { p: ColumnaVigaParams; malla: ColumnaVigaMalla; sol: SolucionSolido } | null = null;

export const columnaVigaSolidos: ExampleDef = {
  id: "solid-cube-fem",
  name: "Nudo columna-viga en sólidos H8",
  category: "3️⃣ Sólidos",
  benchmark: true,
  defaultSolidResult: "vonMises",
  params: {
    Lx_col: P("Geometría", "Lx col (m)", D.Lx_col, 0.20, 0.80, 0.10),
    Ly_col: P("Geometría", "Ly col (m)", D.Ly_col, 0.20, 0.80, 0.10),
    Lz:     P("Geometría", "Altura col Lz (m)", D.Lz, 1.5, 6.0, 0.50),
    W_beam: P("Geometría", "W viga (m, ancho)", D.W_beam, 0.10, 0.40, 0.10),
    H_beam: P("Geometría", "H viga (m, peralte)", D.H_beam, 0.25, 1.00, 0.25),
    L_beam: P("Geometría", "L viga (m, voladizo)", D.L_beam, 0.50, 3.00, 0.25),
    nx_col: P("Malla", "nx col", D.nx_col, 2, 6, 2),
    ny_col: P("Malla", "ny col", D.ny_col, 2, 6, 2),
    nz:     P("Malla", "nz col", D.nz, 6, 18, 2),
    ny_b:   P("Malla", "ny viga", D.ny_b, 2, 12, 1),
    E:      P("Material", "E hormigón (kN/m²)", D.E, 15e6, 40e6, 1e6),
    nu:     P("Material", "ν hormigón", D.nu, 0.0, 0.30, 0.01),
    P_tip:  P("Cargas", "P extremo viga (kN, vertical)", D.P_tip, -200, 200, 10),
  },
  guide: [
    "La columna está empotrada en la base y en el tope; la viga sale en voladizo a media altura",
    "La carga P va repartida en los nudos de la cara del extremo libre de la viga",
    "«Calculados» compara la flecha H8 con E-B + cortante de Timoshenko + giro de la columna",
    "«✂️ Cortes» deja ver las tensiones dentro del nudo",
  ],
  build: (params: Record<string, number>, states: BuildStates) => {
    const p: ColumnaVigaParams = {
      Lx_col: params.Lx_col, Ly_col: params.Ly_col, Lz: params.Lz,
      W_beam: params.W_beam, H_beam: params.H_beam, L_beam: params.L_beam,
      nx_col: params.nx_col, ny_col: params.ny_col, nz: params.nz, ny_b: params.ny_b,
      E: params.E, nu: params.nu, P_tip: params.P_tip,
    };
    const malla = mallaColumnaViga(p);
    // La página llamaba a hex8Solve sin `incompatible`: su defecto es con modos incompatibles.
    const sol = resolverSolidoEnWorkspace(states, {
      nodes: malla.nodes, elements: malla.elements, E: p.E, nu: p.nu,
      supports: malla.supports, loads: malla.loads, incompatible: true,
    });
    ultimo = { p, malla, sol };
  },
  computedLabels: () => {
    if (!ultimo) return {};
    const { p, malla, sol } = ultimo;
    const N = malla.nodes.length;
    const e = (v: number) => v.toExponential(3);
    const out: Record<string, string> = {
      "Nudos": String(N),
      "Hexaedros": `${malla.elements.length} (columna ${malla.nColumna}, viga ${malla.elements.length - malla.nColumna})`,
      "GDL": String(3 * N),
      "Sección de la viga en la malla": `${malla.W_b_snap.toFixed(3)} × ${malla.H_b_snap.toFixed(3)} m`,
    };
    if (!sol.ok) { out["Solver"] = `falló: ${sol.error ?? "?"}`; return out; }
    const c = compararColumnaViga(p, malla, sol.desplazamientos);
    out["δ E-B = P·L³/(3·E·I)"] = `${e(c.delta_EB)} m`;
    out["δ Timoshenko = P·L/(κ·G·A)"] = `${e(c.delta_shear)} m`;
    out["δ giro columna = θ·L, θ = M·Lz/(16·E·Ic)"] = `${e(c.delta_col)} m`;
    out["δ TOTAL analítico"] = `${e(c.delta_total_an)} m`;
    out["δ extremo H8 (media de uz)"] = `${e(c.delta_he)} m`;
    out["Δ vs total analítico"] = `${c.errTotalPct.toFixed(2)} % (esperado < 15 %)`;
    out["Δ vs E-B puro"] = `${c.errEBpct.toFixed(2)} % (esperado 20-40 %)`;
    out["Estado"] = estadoComparacion(c.errTotalPct);
    out["I viga"] = `${e(c.I_beam)} m⁴`;
    out["L viga"] = `${c.L_beam.toFixed(2)} m`;
    out["P extremo"] = `${c.P.toFixed(2)} kN`;
    const [vmMin, vmMax] = (() => {
      let mn = Infinity, mx = -Infinity;
      sol.vonMises.forEach((g) => g.forEach((v) => { if (v < mn) mn = v; if (v > mx) mx = v; }));
      return Number.isFinite(mn) ? [mn, mx] : [0, 0];
    })();
    const [syMin, syMax] = rangoDeTension(sol.tensiones, 1);
    out["σyy (Gauss)"] = `${syMin.toFixed(1)} … ${syMax.toFixed(1)} kN/m²`;
    out["von Mises (Gauss)"] = `${vmMin.toFixed(1)} … ${vmMax.toFixed(1)} kN/m²`;
    out["Tiempo de cálculo"] = `${sol.ms.toFixed(0)} ms`;
    return out;
  },
};
