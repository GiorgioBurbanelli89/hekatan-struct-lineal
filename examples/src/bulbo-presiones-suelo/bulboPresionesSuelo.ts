/**
 * Bulbo de presiones bajo una carga rectangular — réplica de la Fig. SF-70 de Serquen.
 *
 * Caso canónico de mecánica de suelos:
 *   - masa de suelo Lx × Ly × Lz (20 × 20 × 10 m)
 *   - carga rectangular Rx × Ry centrada en la superficie (5 × 3 m)
 *   - el bulbo de tensión vertical σzz que da el método de los elementos finitos
 *
 * Malla de nx × ny × nz hexaedros H8. La del libro (40 × 40 × 20 = 32 000 elementos, 35 301
 * nudos) cabe desde el 2-sep-2026 (gradiente conjugado en el WASM, 9 s). Arbitrado con SAP2000
 * nudo a nudo a 2.5e-12 % en `tests/casos/serquen_h8_sap2000.mjs`, con los modos incompatibles
 * de flexión que SAP2000 trae por defecto.
 *
 * Desde el 28-sep-2026 corre DENTRO del workspace con hexaedros de verdad. Lo que cambia a la
 * vista respecto a la página de antes:
 *   - el campo es **σzz con su signo** (compresión negativa). Antes se pintaba |σzz| y la barra
 *     lo rotulaba «vonMises», que es otra magnitud;
 *   - la rebanada central es un CORTE del visor (plano Y), relleno, y se puede mover.
 */
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";
import type { Vec3, Hex8 } from "hekatan-fem";
import { resolverSolidoEnWorkspace, rangoDeTension, type SolucionSolido } from "../shared/solidosWorkspace";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

export interface BulboParams {
  Lx: number; Ly: number; Lz: number; nx: number; ny: number; nz: number;
  Es: number; nu: number; Rx: number; Ry: number; w: number;
}

export interface BulboMalla {
  nodes: Vec3[]; elements: Hex8[];
  supports: Map<number, [boolean, boolean, boolean]>;
  loads: Map<number, [number, number, number]>;
  /** Suma de las cargas nodales (kN, negativa hacia abajo). */
  cargaTotal: number;
}

/** La malla, pura: la misma cuenta que llevaba la página. */
export function mallaBulbo(p: BulboParams): BulboMalla {
  const nx = Math.round(p.nx), ny = Math.round(p.ny), nz = Math.round(p.nz);
  const { Lx, Ly, Lz } = p;
  const dx = Lx / nx, dy = Ly / ny, dz = Lz / nz;
  const idx = (i: number, j: number, k: number) => k * (nx + 1) * (ny + 1) + j * (nx + 1) + i;

  // z = 0 es la superficie (k = 0) y z = −Lz el fondo (k = nz)
  const nodes: Vec3[] = [];
  for (let k = 0; k <= nz; k++) for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++)
    nodes.push([-Lx / 2 + i * dx, -Ly / 2 + j * dy, -k * dz]);

  // H8: nudos 0-3 la cara de abajo (z menor = k+1), 4-7 la de arriba (k)
  const elements: Hex8[] = [];
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++)
    elements.push([
      idx(i, j, k + 1), idx(i + 1, j, k + 1), idx(i + 1, j + 1, k + 1), idx(i, j + 1, k + 1),
      idx(i, j, k), idx(i + 1, j, k), idx(i + 1, j + 1, k), idx(i, j + 1, k),
    ]);

  // Fondo fijo; caras laterales con rodillo (desplazamiento normal impedido)
  const supports = new Map<number, [boolean, boolean, boolean]>();
  for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) supports.set(idx(i, j, nz), [true, true, true]);
  for (let k = 0; k <= nz; k++) for (let j = 0; j <= ny; j++)
    for (const id of [idx(0, j, k), idx(nx, j, k)]) {
      const s = supports.get(id) ?? [false, false, false];
      supports.set(id, [true, s[1], s[2]]);
    }
  for (let k = 0; k <= nz; k++) for (let i = 0; i <= nx; i++)
    for (const id of [idx(i, 0, k), idx(i, ny, k)]) {
      const s = supports.get(id) ?? [false, false, false];
      supports.set(id, [s[0], true, s[2]]);
    }

  // Carga rectangular: fuerza nodal = w × área tributaria del nudo
  const x0 = -p.Rx / 2, x1 = p.Rx / 2, y0 = -p.Ry / 2, y1 = p.Ry / 2;
  const loads = new Map<number, [number, number, number]>();
  let cargaTotal = 0;
  for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
    const x = -Lx / 2 + i * dx, y = -Ly / 2 + j * dy;
    if (x < x0 - 1e-6 || x > x1 + 1e-6 || y < y0 - 1e-6 || y > y1 + 1e-6) continue;
    let ax = dx, ay = dy;
    if (i === 0 || i === nx) ax = dx / 2;
    if (j === 0 || j === ny) ay = dy / 2;
    const fz = -p.w * ax * ay;
    cargaTotal += fz;
    loads.set(idx(i, j, 0), [0, 0, fz]);
  }
  return { nodes, elements, supports, loads, cargaTotal };
}

let ultimo: { malla: BulboMalla; sol: SolucionSolido; p: Record<string, number> } | null = null;

export const bulboPresionesSuelo: ExampleDef = {
  id: "bulbo-presiones-suelo",
  name: "Bulbo de Presiones — Serquen SF-70",
  category: "3️⃣ Sólidos",
  benchmark: true,
  defaultSolidResult: "sigmaZZ",
  viewFrom: [1, -1, 1],
  params: {
    Lx: P("Suelo", "Lx suelo (m)", 20, 5, 40, 1),
    Ly: P("Suelo", "Ly suelo (m)", 20, 5, 40, 1),
    Lz: P("Suelo", "Lz suelo (m)", 10, 4, 20, 1),
    Es: P("Suelo", "Es suelo (kN/m²)", 20000, 5000, 100000, 1000),
    nu: P("Suelo", "ν suelo", 0.42, 0.20, 0.49, 0.01),
    nx: P("Malla", "nx (libro: 40)", 12, 6, 40, 2),
    ny: P("Malla", "ny (libro: 40)", 12, 6, 40, 2),
    nz: P("Malla", "nz (libro: 20)", 8, 4, 20, 2),
    Rx: P("Carga", "Rx carga (m)", 5, 1, 15, 0.5),
    Ry: P("Carga", "Ry carga (m)", 3, 1, 15, 0.5),
    w:  P("Carga", "w (kN/m²)", 100, 10, 500, 10),
    rebanada: { default: 1, boolean: true, label: "cortar por el plano central (y = 0)", folder: "Vista" },
    rango: P("Vista", "rango fijo de σzz (kN/m², 0 = automático)", 0, 0, 2000, 10),
  },
  guide: [
    "El corte por y = 0 deja ver el bulbo por dentro: se mueve en Settings → «✂️ Cortes X/Y/Z»",
    "El campo es σzz: la compresión es negativa",
    "Con un rango fijo, al subir la carga el bulbo crece en vez de reescalarse",
    "La malla del libro es 40 × 40 × 20; la de partida es más gruesa para que responda al instante",
  ],
  build: (p: Record<string, number>, states: BuildStates) => {
    const malla = mallaBulbo(p as unknown as BulboParams);
    const sol = resolverSolidoEnWorkspace(states, {
      nodes: malla.nodes, elements: malla.elements, E: p.Es, nu: p.nu,
      supports: malla.supports, loads: malla.loads, rho: 18 / 9.80665,
    });
    if (sol.ok && p.rango > 0)
      (states.analyzeOutputs.val as any).colorMapRanges = { sigmaZZ: [-p.rango, 0] };
    ultimo = { malla, sol, p };

    // El corte central. Se pide al visor, que corta los sólidos por elementos (relleno).
    const g: any = globalThis as any;
    if (g.__hekatanClip) {
      g.__hekatanClip.enableY = Math.round(p.rebanada) === 1;
      g.__hekatanClip.posY = 0;
      g.__hekatanClip.invertY = true;          // se conserva y ≥ 0: se mira el corte desde −y
      g.__hekatanClipApply?.();
    }
  },
  computedLabels: () => {
    if (!ultimo) return {};
    const { malla, sol } = ultimo;
    const N = malla.nodes.length;
    const out: Record<string, string> = {
      "Nudos": String(N),
      "Hexaedros": String(malla.elements.length),
      "GDL": String(3 * N),
      "Carga total": `${(-malla.cargaTotal).toFixed(1)} kN`,
    };
    if (!sol.ok) { out["Solver"] = `falló: ${sol.error ?? "?"}`; return out; }
    const [szMin, szMax] = rangoDeTension(sol.tensiones, 2);
    let uz = 0;
    sol.desplazamientos.forEach((u) => { if (Math.abs(u[2]) > Math.abs(uz)) uz = u[2]; });
    out["σzz (Gauss)"] = `${szMin.toFixed(1)} … ${szMax.toFixed(1)} kN/m²`;
    out["Asiento máximo"] = `${(uz * 1000).toFixed(3)} mm`;
    out["Tiempo de cálculo"] = `${sol.ms.toFixed(0)} ms`;
    return out;
  },
};
