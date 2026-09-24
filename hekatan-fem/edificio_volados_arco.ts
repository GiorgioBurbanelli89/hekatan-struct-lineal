// Edificio 4 pisos rectangular, volados 1 m en 3 lados, esquinas en ARCO,
// vigas de borde + columnas H°A°. Geometría paramétrica + corre por el motor C++.
import { deformCpp } from "./src/deformCpp.ts";

const E = 2534564, nu = 0.20, rho = 2.40277, G = E / (2 * (1 + nu));
const sx = 5, sy = 5, nbx = 2, nby = 2;          // 2x2 vanos -> núcleo 10x10
const Lx = sx * nbx, Ly = sy * nby;
const cant = 1.0;                                 // volado 1 m
const nFloors = 4, hFloor = 3, ms = 1;           // 4 pisos, h=3 m, malla 1 m
const tSlab = 0.20, bCol = 0.40, bBeam = 0.30, hBeam = 0.50;

// --- contorno de la losa: rectángulo + volado 1m en +X, +Y, -Y (-X a ras), 2 esquinas en arco ---
const x0 = 0, x1 = Lx + cant, y0 = -cant, y1 = Ly + cant;   // bounding
function inside(xc: number, yc: number): boolean {
  if (xc < x0 - 1e-9 || xc > x1 + 1e-9 || yc < y0 - 1e-9 || yc > y1 + 1e-9) return false;
  // arco esquina +X,+Y (centro col (Lx,Ly), R=cant)
  if (xc > Lx && yc > Ly) return (xc - Lx) ** 2 + (yc - Ly) ** 2 <= cant * cant + 1e-9;
  // arco esquina +X,-Y (centro col (Lx,0), R=cant)
  if (xc > Lx && yc < 0) return (xc - Lx) ** 2 + (yc - 0) ** 2 <= cant * cant + 1e-9;
  return true;
}

// --- nodos (dedup por coord) ---
const nodes: number[][] = []; const key = new Map<string, number>();
const nid = (x: number, y: number, z: number) => { const k = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`; let i = key.get(k); if (i === undefined) { i = nodes.length; nodes.push([x, y, z]); key.set(k, i); } return i; };

const elements: number[][] = []; const kinds: string[] = [];
const nx = Math.round((x1 - x0) / ms), ny = Math.round((y1 - y0) / ms);
const colXY: [number, number][] = [];
for (let i = 0; i <= nbx; i++) for (let j = 0; j <= nby; j++) colXY.push([i * sx, j * sy]);

for (let f = 1; f <= nFloors; f++) {
  const z = f * hFloor;
  // losa: celdas Q4 cuyo centro está dentro del contorno (volados + arco)
  const cellNodes = new Map<string, boolean>();
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const xa = x0 + i * ms, ya = y0 + j * ms, xc = xa + ms / 2, yc = ya + ms / 2;
    if (!inside(xc, yc)) continue;
    const a = nid(xa, ya, z), b = nid(xa + ms, ya, z), c = nid(xa + ms, ya + ms, z), d = nid(xa, ya + ms, z);
    elements.push([a, b, c, d]); kinds.push("slab");
    for (const [px, py] of [[xa, ya], [xa + ms, ya], [xa + ms, ya + ms], [xa, ya + ms]]) cellNodes.set(`${px},${py}`, true);
  }
  // vigas de borde: aristas de losa que dan al exterior (una sola celda vecina)
  // (se detectan como aristas que aparecen 1 vez entre los Q4 de este piso)
  const edgeCount = new Map<string, [number, number]>();
  for (let e = 0; e < elements.length; e++) {
    if (kinds[e] !== "slab" || Math.abs(nodes[elements[e][0]][2] - z) > 1e-6) continue;
    const q = elements[e];
    for (let s = 0; s < 4; s++) { const a = q[s], b = q[(s + 1) % 4]; const k = a < b ? `${a}-${b}` : `${b}-${a}`; const c = edgeCount.get(k); edgeCount.set(k, c ? [c[0], c[1] + 1] : [a < b ? a : b, 1]); if (c) edgeCount.set(k, [c[0], c[1] + 1]); }
  }
  // recomputar borde correctamente
  const cnt = new Map<string, { a: number; b: number; n: number }>();
  for (let e = 0; e < elements.length; e++) {
    if (kinds[e] !== "slab" || Math.abs(nodes[elements[e][0]][2] - z) > 1e-6) continue;
    const q = elements[e];
    for (let s = 0; s < 4; s++) { const a = q[s], b = q[(s + 1) % 4]; const k = a < b ? `${a}-${b}` : `${b}-${a}`; const o = cnt.get(k); cnt.set(k, o ? { a: o.a, b: o.b, n: o.n + 1 } : { a, b, n: 1 }); }
  }
  for (const { a, b, n } of cnt.values()) if (n === 1) { elements.push([a, b]); kinds.push("beam"); }
}
// columnas H°A° (núcleo), de piso a piso (incluye base z=0)
for (const [x, y] of colXY) for (let f = 0; f < nFloors; f++) { elements.push([nid(x, y, f * hFloor), nid(x, y, (f + 1) * hFloor)]); kinds.push("col"); }

// --- inputs ---
const A_c = bCol * bCol, I_c = bCol ** 4 / 12, J_c = 0.141 * bCol ** 4;
const A_v = bBeam * hBeam, Iy_v = bBeam * hBeam ** 3 / 12, Iz_v = hBeam * bBeam ** 3 / 12, J_v = bBeam * hBeam ** 3 / 12 + hBeam * bBeam ** 3 / 12;
const M = () => new Map<number, number>();
const thicknesses = M(), elasticities = M(), poissonsRatios = M(), densities = M(), plateFormulations = M(), drillingTypes = M(), areas = M(), momentsOfInertiaY = M(), momentsOfInertiaZ = M(), torsionalConstants = M(), shearModuli = M();
kinds.forEach((k, e) => {
  elasticities.set(e, E); poissonsRatios.set(e, nu); densities.set(e, rho);
  if (k === "slab") { thicknesses.set(e, tSlab); plateFormulations.set(e, 1); drillingTypes.set(e, 2); }
  else { shearModuli.set(e, G); if (k === "col") { areas.set(e, A_c); momentsOfInertiaY.set(e, I_c); momentsOfInertiaZ.set(e, I_c); torsionalConstants.set(e, J_c); } else { areas.set(e, A_v); momentsOfInertiaY.set(e, Iy_v); momentsOfInertiaZ.set(e, Iz_v); torsionalConstants.set(e, J_v); } }
});
const supports = new Map<number, boolean[]>();
nodes.forEach((p, i) => { if (Math.abs(p[2]) < 1e-9) supports.set(i, [true, true, true, true, true, true]); });
// gravedad: presión 1 tonf/m² en losas (nodal q*A/4)
const loads = new Map<number, number[]>();
kinds.forEach((k, e) => { if (k !== "slab") return; for (const n of elements[e]) { const cur = loads.get(n) ?? [0, 0, 0, 0, 0, 0]; cur[2] -= 1.0 * ms * ms / 4; loads.set(n, cur); } });

const out = await deformCpp(nodes as any, elements as any, { supports, loads } as any, { thicknesses, elasticities, poissonsRatios, densities, plateFormulations, drillingTypes, areas, momentsOfInertiaY, momentsOfInertiaZ, torsionalConstants, shearModuli } as any);
let wmax = 0, voladoMax = 0;
nodes.forEach((p, i) => { const uz = out.deformations.get(i)?.[2] ?? 0; wmax = Math.min(wmax, uz); if (p[0] > Lx + 0.4 || p[1] > Ly + 0.4 || p[1] < -0.4) voladoMax = Math.min(voladoMax, uz); });
console.log(`Edificio 4 pisos + volados 1m (3 lados) + esquinas en ARCO + vigas borde + columnas H°A°:`);
console.log(`  nodos=${nodes.length}  losas=${kinds.filter(k => k === "slab").length}  vigas=${kinds.filter(k => k === "beam").length}  columnas=${kinds.filter(k => k === "col").length}`);
console.log(`  w_max losa = ${(wmax * 1000).toFixed(3)} mm   flecha punta de volado = ${(voladoMax * 1000).toFixed(3)} mm`);
console.log(`  → CORRE en el motor C++ (ShellThin DKE + frames).`);
