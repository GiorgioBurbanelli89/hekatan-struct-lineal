/**
 * Solver H8 — wrapper TypeScript del WASM nativo C++ (Eigen sparse Cholesky).
 *
 * Reemplaza la implementación TS pura anterior por bridge a hex8_solve()
 * compilado de hex8_wasm.cpp. Speedup esperado:
 *   - 4×4×4 cube (375 DOF):  TS ~100ms → WASM ~5-10ms (10-20×)
 *   - 8×8×8 cube (2187 DOF): TS ~10s → WASM ~50-200ms (50-100×)
 *   - 16×16×16 (12288 DOF):  TS imposible → WASM ~1-3s
 *
 * Algoritmo en C++ idéntico al original TS:
 *   - 8 funciones de forma N_i(ξ,η,ζ)
 *   - Integración Gauss 2×2×2
 *   - Matriz constitutiva isótropa Lamé
 *   - Solver Eigen SimplicialLDLT (sparse Cholesky)
 *   - Recovery σ + vonMises en 8 puntos Gauss
 *
 * Vive en el paquete del motor desde el 28-sep-2026. Antes estaba dentro de un
 * ejemplo (`examples/src/solid-cube-fem/h8.ts`) y los demás ejemplos de sólidos y
 * el lector del `.heks` lo importaban de ahí: el solver de todos era privado de uno.
 */
import createModule from "./cpp/built/deform.js";

// @ts-ignore — WASM module init asíncrono
const mod: any = await createModule();

export type Vec3 = [number, number, number];
export type Hex8 = [number, number, number, number, number, number, number, number];

export interface Hex8SolveInput {
  nodes: Vec3[];
  elements: Hex8[];
  E: number;
  nu: number;
  /** Map node → [fixUx, fixUy, fixUz] */
  supports: Map<number, [boolean, boolean, boolean]>;
  /** Map node → [Fx, Fy, Fz] in kN */
  loads: Map<number, [number, number, number]>;
  /**
   * Modos incompatibles de flexion (Wilson-Taylor), 9 GDL internos condensados.
   * Es el "Incompatible Bending Modes" que SAP2000 trae ACTIVADO por defecto en
   * sus solidos, y por eso es el defecto aqui. `false` = H8 clasico (= SAP2000
   * con la opcion apagada a 1e-12 %, medido en el bloque de suelo de Serquen).
   */
  incompatible?: boolean;
}

export interface Hex8SolveOutput {
  /** Map node → [ux, uy, uz] */
  displacements: Map<number, Vec3>;
  /** Map element → von Mises stress per Gauss point (8 values) */
  vonMisesPerElement: Map<number, number[]>;
  /**
   * Reacciones en los apoyos, nudo → [Rx, Ry, Rz] (kN). El C++ fija los apoyos con un resorte de
   * penalización PEN sobre la diagonal (`hex8_wasm.cpp`), así que la fuerza que el apoyo hace sobre
   * la estructura es −PEN·u en cada gdl fijo. Antes no se devolvían y el equilibrio de los modelos
   * de sólidos no se podía comprobar (29-sep-2026).
   */
  reactions: Map<number, Vec3>;
  /** Map element → 6-component stress per Gauss point: [σxx,σyy,σzz,τxy,τyz,τxz][] */
  stressPerElement: Map<number, number[][]>;
  /** Tiempo total del solver en ms (medido en C++) */
  elapsedMs: number;
}

/** Helper: alocar y copiar al heap WASM. */
function allocateF64(data: number[]): number {
  const buf = new Float64Array(data);
  const ptr = mod._malloc(buf.length * 8);
  mod.HEAPF64.set(buf, ptr / 8);
  return ptr;
}
function allocateI32(data: number[]): number {
  const buf = new Int32Array(data);
  const ptr = mod._malloc(buf.length * 4);
  // HEAPI32 = HEAP32 view (signed)
  new Int32Array(mod.HEAPF64.buffer).set(buf, ptr / 4);
  return ptr;
}

/**
 * Función principal: invoca hex8_solve C++ vía WASM y reformatea outputs.
 */
export function hex8Solve(input: Hex8SolveInput): Hex8SolveOutput {
  const { nodes, elements, E, nu, supports, loads } = input;
  const N = nodes.length;
  const numElements = elements.length;
  const gc: number[] = [];

  // ── Nodes flat: [x1,y1,z1, x2,y2,z2, ...] ──
  const nodesFlat: number[] = [];
  for (const p of nodes) { nodesFlat.push(p[0], p[1], p[2]); }
  const nodesPtr = allocateF64(nodesFlat);
  gc.push(nodesPtr);

  // ── Elements flat: [n0..n7, n0..n7, ...] ──
  const elemsFlat: number[] = [];
  for (const e of elements) { elemsFlat.push(...e); }
  const elemsPtr = allocateI32(elemsFlat);
  gc.push(elemsPtr);

  // ── Supports flat: [node, fixUx, fixUy, fixUz, ...] ──
  const supFlat: number[] = [];
  supports.forEach(([fx, fy, fz], n) => {
    supFlat.push(n, fx ? 1 : 0, fy ? 1 : 0, fz ? 1 : 0);
  });
  const supPtr = allocateI32(supFlat.length > 0 ? supFlat : [0]);
  gc.push(supPtr);

  // ── Loads flat: [node, fx, fy, fz, ...] ──
  const loadsFlat: number[] = [];
  loads.forEach(([fx, fy, fz], n) => {
    loadsFlat.push(n, fx, fy, fz);
  });
  const loadsPtr = allocateF64(loadsFlat.length > 0 ? loadsFlat : [0]);
  gc.push(loadsPtr);

  // ── Output pointers (C++ escribe addresses) ──
  const dispPtrOut = mod._malloc(4); gc.push(dispPtrOut);
  const dispSizeOut = mod._malloc(4); gc.push(dispSizeOut);
  const vmPtrOut = mod._malloc(4); gc.push(vmPtrOut);
  const vmSizeOut = mod._malloc(4); gc.push(vmSizeOut);
  const stPtrOut = mod._malloc(4); gc.push(stPtrOut);
  const stSizeOut = mod._malloc(4); gc.push(stSizeOut);
  const elapsedPtrOut = mod._malloc(8); gc.push(elapsedPtrOut);

  // ── Llamar al C++ ──
  mod._hex8_solve(
    nodesPtr, N,
    elemsPtr, numElements,
    E, nu,
    supPtr, supports.size,
    loadsPtr, loads.size,
    dispPtrOut, dispSizeOut,
    vmPtrOut, vmSizeOut,
    stPtrOut, stSizeOut,
    elapsedPtrOut,
    input.incompatible === false ? 0 : 1,
  );

  // ── Leer output pointers ──
  const dispDataPtr = mod.HEAPU32[dispPtrOut / 4];
  const dispSize = mod.HEAPU32[dispSizeOut / 4];
  const vmDataPtr = mod.HEAPU32[vmPtrOut / 4];
  const vmSize = mod.HEAPU32[vmSizeOut / 4];
  const stDataPtr = mod.HEAPU32[stPtrOut / 4];
  const stSize = mod.HEAPU32[stSizeOut / 4];
  const elapsedMs = mod.HEAPF64[elapsedPtrOut / 8];

  // ── Parse displacements: [u0x,u0y,u0z, u1x,u1y,u1z, ...] ──
  const dispView = new Float64Array(mod.HEAPF64.buffer, dispDataPtr, dispSize);
  const displacements = new Map<number, Vec3>();
  for (let i = 0; i < N; i++) {
    displacements.set(i, [dispView[3 * i], dispView[3 * i + 1], dispView[3 * i + 2]]);
  }

  // ── Parse vonMises: [vm1..vm8, vm1..vm8, ...] (8 per element) ──
  const vmView = new Float64Array(mod.HEAPF64.buffer, vmDataPtr, vmSize);
  const vonMisesPerElement = new Map<number, number[]>();
  for (let e = 0; e < numElements; e++) {
    const arr: number[] = [];
    for (let g = 0; g < 8; g++) arr.push(vmView[e * 8 + g]);
    vonMisesPerElement.set(e, arr);
  }

  // ── Parse stresses: [σxx,σyy,σzz,τxy,τyz,τxz, ...] (6×8 per element) ──
  const stView = new Float64Array(mod.HEAPF64.buffer, stDataPtr, stSize);
  const stressPerElement = new Map<number, number[][]>();
  for (let e = 0; e < numElements; e++) {
    const gaussList: number[][] = [];
    for (let g = 0; g < 8; g++) {
      const sBase = (e * 8 + g) * 6;
      gaussList.push([
        stView[sBase + 0], stView[sBase + 1], stView[sBase + 2],
        stView[sBase + 3], stView[sBase + 4], stView[sBase + 5],
      ]);
    }
    stressPerElement.set(e, gaussList);
  }

  // ── Free heap allocations ──
  for (const ptr of gc) mod._free(ptr);
  mod._free(dispDataPtr);
  mod._free(vmDataPtr);
  mod._free(stDataPtr);

  // ── Reacciones: −PEN·u en los gdl fijos. PEN TIENE que ser el de hex8_wasm.cpp ──
  const reactions = new Map<number, Vec3>();
  input.supports.forEach((fix, n) => {
    const u = displacements.get(n);
    if (!u || !fix.some(Boolean)) return;
    reactions.set(n, [0, 1, 2].map((k) => (fix[k] ? -HEX8_PEN * u[k] : 0)) as Vec3);
  });

  return { displacements, reactions, vonMisesPerElement, stressPerElement, elapsedMs };
}

/** La penalización de los apoyos en `hex8_wasm.cpp` (`const double PEN = 1e15`). */
export const HEX8_PEN = 1e15;

/**
 * Tensiones de UN H8 ya resuelto — para los solidos que van MEZCLADOS con barras
 * y cascaras por `deform` (que no las da). Misma recuperacion que hex8Solve
 * (`_hex8_stress` del WASM): 8 puntos de Gauss x [sxx, syy, szz, sxy, syz, sxz]
 * y su von Mises. `u` son los 24 desplazamientos [ux, uy, uz] por nudo.
 */
export function hex8Stress(coords: Vec3[], E: number, nu: number, u: number[], incompatible = true):
  { stress: number[][]; vonMises: number[] } {
  const gc: number[] = [];
  const cPtr = allocateF64(coords.flatMap(p => [p[0], p[1], p[2]])); gc.push(cPtr);
  const uPtr = allocateF64(u); gc.push(uPtr);
  const sPtr = mod._malloc(48 * 8); gc.push(sPtr);
  const vPtr = mod._malloc(8 * 8); gc.push(vPtr);
  mod._hex8_stress(cPtr, E, nu, uPtr, incompatible ? 1 : 0, sPtr, vPtr);
  const sf = Array.from(new Float64Array(mod.HEAPF64.buffer, sPtr, 48));
  const vonMises = Array.from(new Float64Array(mod.HEAPF64.buffer, vPtr, 8));
  const stress: number[][] = [];
  for (let g = 0; g < 8; g++) stress.push(sf.slice(g * 6, g * 6 + 6));
  gc.forEach(p => mod._free(p));
  return { stress, vonMises };
}
