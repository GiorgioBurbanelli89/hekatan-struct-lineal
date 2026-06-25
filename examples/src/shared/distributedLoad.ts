// =============================================================================
// distributedLoad.ts — Cargas distribuidas (FEM + visualización)
// =============================================================================
// Hekatan-FEM solo soporta cargas PUNTUALES en nodos. Esta utilidad convierte
// cargas distribuidas en sus equivalentes nodales usando métodos estándar:
//
// 1. LINEAL (kN/m sobre frame element):
//    Método de Fixed-End Moments (FEM). Para un elemento de longitud L con
//    carga uniforme q en dirección global d:
//      · F en cada extremo:        q · L / 2
//      · M_perp en extremo i:      +q · L² / 12  (sobre componente perpendicular)
//      · M_perp en extremo j:      -q · L² / 12
//    En nodos interiores de mallas refinadas, los M_FEM de dos elementos
//    adyacentes se cancelan y solo quedan las F.
//    → `applyDistLoadToBeam` + `makeDistLoadArrows`
//
// 2. ÁREA (kN/m² sobre shell Q4):
//    Lumped consistent load. Para un elemento Q4 con presión uniforme p:
//      · F en cada nodo corner:    p · A / 4   (donde A = area del shell)
//    Solo F en la dirección de p. No hay momento de empotramiento porque
//    el shell Q4 distribuye uniformemente. Esto es equivalente al "lumped
//    mass matrix" approach que usan ETABS/SAFE para Uniform Load.
//    → `applyAreaLoadToShell` + `makeAreaLoadArrows`
// =============================================================================
import * as THREE from "three";

/**
 * Dirección global de la carga distribuida.
 * "Z-"= gravedad sobre vigas (default). "X+", "Y-", etc.
 */
export type LoadDirection = "X+" | "X-" | "Y+" | "Y-" | "Z+" | "Z-";

const DIRECTION_VECTORS: Record<LoadDirection, [number, number, number]> = {
  "X+": [ 1, 0, 0], "X-": [-1, 0, 0],
  "Y+": [ 0, 1, 0], "Y-": [ 0,-1, 0],
  "Z+": [ 0, 0, 1], "Z-": [ 0, 0,-1],
};

/**
 * Convierte una carga distribuida q [kN/m] sobre un elemento de frame en
 * cargas nodales equivalentes (Fixed-End Moments) y las suma al mapa loads.
 *
 * SIGNO de q: magnitud positiva en la dirección `direction`. Para gravedad
 * usar q > 0 + direction "Z-" (NO q negativo con "Z+").
 *
 * Asume vigas horizontales o columnas verticales con carga perpendicular.
 * Para carga axial (along element), solo F_axial (no momentos).
 *
 * @param loads Map nodal a mutar (se acumula con loads.set existentes)
 * @param nodes Array de coordenadas de nodos
 * @param elem  [iIdx, jIdx] del elemento
 * @param q     Magnitud kN/m (positivo)
 * @param direction Dirección global de la carga
 */
export function applyDistLoadToBeam(
  loads: Map<number, [number, number, number, number, number, number]>,
  nodes: [number, number, number][],
  elem: [number, number],
  q: number,
  direction: LoadDirection = "Z-"
): void {
  if (q === 0) return;
  const [i, j] = elem;
  const ni = nodes[i], nj = nodes[j];
  const dx = nj[0] - ni[0];
  const dy = nj[1] - ni[1];
  const dz = nj[2] - ni[2];
  const L = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (L < 1e-12) return;

  // Vector unitario a lo largo del elemento (start → end)
  const t = [dx / L, dy / L, dz / L];
  // Vector de la carga (global)
  const d = DIRECTION_VECTORS[direction];
  const qx = q * d[0];
  const qy = q * d[1];
  const qz = q * d[2];

  // F nodal: la mitad en cada extremo (siempre, sea axial o transversal)
  const Fx_half = qx * L / 2;
  const Fy_half = qy * L / 2;
  const Fz_half = qz * L / 2;

  // Momentos: solo la componente PERPENDICULAR al elemento contribuye al
  // momento. Componente proyectada paralela al elemento (q · t) es carga
  // axial — no genera momento. La perpendicular sí.
  const qDotT = qx * t[0] + qy * t[1] + qz * t[2];
  const qPerp_x = qx - qDotT * t[0];
  const qPerp_y = qy - qDotT * t[1];
  const qPerp_z = qz - qDotT * t[2];

  // M_FEM = q_perp · L² / 12, alrededor del eje perpendicular a (t, q_perp).
  // El "eje" del momento es t × q_perp (mano derecha).
  const FEM_factor = L * L / 12;
  // Momento como vector: M = (t × q_perp) · L² / 12
  const Mx = (t[1] * qPerp_z - t[2] * qPerp_y) * FEM_factor;
  const My = (t[2] * qPerp_x - t[0] * qPerp_z) * FEM_factor;
  const Mz = (t[0] * qPerp_y - t[1] * qPerp_x) * FEM_factor;

  const addLoad = (idx: number, dFx: number, dFy: number, dFz: number,
                    dMx: number, dMy: number, dMz: number) => {
    const prev = loads.get(idx) ?? [0, 0, 0, 0, 0, 0];
    loads.set(idx, [prev[0] + dFx, prev[1] + dFy, prev[2] + dFz,
                    prev[3] + dMx, prev[4] + dMy, prev[5] + dMz]);
  };

  // Extremo i (start): +M
  addLoad(i, Fx_half, Fy_half, Fz_half,  Mx,  My,  Mz);
  // Extremo j (end):   -M
  addLoad(j, Fx_half, Fy_half, Fz_half, -Mx, -My, -Mz);
}

/**
 * Crea una visualización de carga distribuida: flechas equiespaciadas
 * perpendiculares al elemento apuntando en la dirección de la carga.
 *
 * @param p1 Coord del nodo i
 * @param p2 Coord del nodo j
 * @param q Magnitud (signo determina dirección visual también si q<0)
 * @param direction Dirección global de la carga
 * @param nArrows Cantidad de flechas a dibujar (default 5)
 * @param arrowLen Largo de cada flecha en metros (default 0.4)
 * @param color Color hex
 * @returns Group de Three.js con las flechas. userData.isDistLoad=true
 *          para que el viewer las pueda toggle con "Loads".
 */
export function makeDistLoadArrows(
  p1: [number, number, number],
  p2: [number, number, number],
  q: number,
  direction: LoadDirection = "Z-",
  nArrows = 6,
  arrowLen = 0.4,
  color = 0xff6600,
): THREE.Group {
  const group = new THREE.Group();
  if (q === 0) return group;

  const d = DIRECTION_VECTORS[direction];
  const sign = Math.sign(q);
  const dir = new THREE.Vector3(d[0] * sign, d[1] * sign, d[2] * sign).normalize();
  // Si q es negativo, invertimos la dirección visual (flecha sale en sentido contrario)
  if (q < 0) dir.negate();

  const start = new THREE.Vector3(...p1);
  const end = new THREE.Vector3(...p2);
  const elemDir = end.clone().sub(start);
  const L = elemDir.length();
  if (L < 1e-9) return group;

  const mat = new THREE.LineBasicMaterial({ color, depthTest: false });
  // Línea principal a lo largo de la viga, OFFSET hacia el origen de las flechas
  // (las flechas APUNTAN hacia la viga, así que la línea principal está a una
  // distancia `arrowLen` desde la viga en la dirección OPUESTA a `dir`).
  const offset = dir.clone().multiplyScalar(-arrowLen);
  const lineStart = start.clone().add(offset);
  const lineEnd = end.clone().add(offset);
  const lineGeom = new THREE.BufferGeometry().setFromPoints([lineStart, lineEnd]);
  const lineMesh = new THREE.Line(lineGeom, mat);
  (lineMesh.userData as any).isDistLoad = true;
  group.add(lineMesh);

  // Flechas equiespaciadas (n arrows interiores + 2 extremos = n+1 total)
  for (let i = 0; i <= nArrows; i++) {
    const t = i / nArrows;
    const tip = start.clone().lerp(end, t);            // punto SOBRE la viga
    const tail = tip.clone().add(offset);              // origen de la flecha
    // Línea de la flecha (tail → tip)
    const shaftGeom = new THREE.BufferGeometry().setFromPoints([tail, tip]);
    const shaft = new THREE.Line(shaftGeom, mat);
    group.add(shaft);
    // Punta (2 líneas formando una "V" en el tip)
    const headLen = arrowLen * 0.25;
    // Perpendicular en el plano de la pantalla — usar producto vectorial con un up arbitrario.
    // Para flecha en -Z, usar perpendicular en X.
    const perpA = new THREE.Vector3(dir.y, -dir.x, 0);
    if (perpA.lengthSq() < 1e-6) perpA.set(0, 1, 0); // fallback si dir vertical
    perpA.normalize();
    const headBase = tip.clone().add(dir.clone().multiplyScalar(-headLen));
    const headPt1 = headBase.clone().add(perpA.clone().multiplyScalar(headLen * 0.5));
    const headPt2 = headBase.clone().add(perpA.clone().multiplyScalar(-headLen * 0.5));
    const head1 = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([tip, headPt1]), mat
    );
    const head2 = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([tip, headPt2]), mat
    );
    group.add(head1, head2);
  }

  // Marcar todo el group como dist-load
  group.traverse(o => { (o.userData as any).isDistLoad = true; });
  return group;
}
