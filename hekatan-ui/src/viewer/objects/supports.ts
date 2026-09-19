import * as THREE from "three";
import van, { State } from "vanjs-core";
import { Node } from "hekatan-fem";
import { Structure } from "hekatan-fem";
import { Settings } from "../settings/getSettings";

/**
 * Apoyos con el símbolo de su TIPO, como en SAP2000/ETABS (Jorge, 19-sep-2026: «veo que estás
 * poniendo un triángulo; hay empotramiento, rodillo y fijo, no veo resorte ni articulado»):
 *   • Empotrado (3 traslaciones + 3 giros)   → placa rayada bajo el nudo (rojo)
 *   • Articulado = fijo (3 traslaciones)      → pirámide con la punta en el nudo (verde)
 *   • Rodillo (1-2 traslaciones)              → pirámide + dos rodillos debajo (azul)
 *   • Solo giros / otra combinación           → cubo en alambre (gris)
 *   • Resorte (`springs` del nudo o de área)  → muelle en zigzag (naranja)
 * Tamaño: `simboloBase(extent)` · escala del slider (1 con el valor por defecto): proporcional al
 * modelo, igual en todos los ejemplos (medido con cli/_barrido_apoyos_cargas.mjs).
 */
export const SIMBOLO_FRACCION = 0.045;   // alto del símbolo = 4.5 % del tamaño del modelo
export const ESCALA_DEFECTO = Math.pow(10, -3 / 10);   // displayScale = -3 (defecto) → factor 1

export function extentDe(ns: Node[], gridSize: number): number {
  if (!ns || ns.length < 2) return gridSize * 0.5;
  const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (const n of ns) for (let i = 0; i < 3; i++) { if (n[i] < mn[i]) mn[i] = n[i]; if (n[i] > mx[i]) mx[i] = n[i]; }
  return Math.max(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2], 0.1);
}

// ── símbolos en tamaño unidad (alto 1, el nudo en el origen, hacia −Z) ──
const matFixed = new THREE.MeshBasicMaterial({ color: 0xc0392b });
const matPinned = new THREE.MeshBasicMaterial({ color: 0x2a9d8f });
const matRoller = new THREE.MeshBasicMaterial({ color: 0x3a86ff });
const lin = (c: number) => new THREE.LineBasicMaterial({ color: c });
const segs = (pts: number[], c: number) => {
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return new THREE.LineSegments(g, lin(c));
};

function simboloEmpotrado(): THREE.Object3D {
  const g = new THREE.Group();
  const placa = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.18), matFixed);
  placa.position.z = -0.09; g.add(placa);
  // rayado bajo la placa (la «tierra» del empotramiento)
  const p: number[] = [];
  for (let k = 0; k <= 5; k++) { const x = -0.6 + k * 0.24; p.push(x, -0.6, -0.18, x - 0.25, -0.6, -0.45, x, 0.6, -0.18, x - 0.25, 0.6, -0.45); }
  for (let k = 0; k <= 5; k++) { const y = -0.6 + k * 0.24; p.push(-0.6, y, -0.18, -0.6, y - 0.25, -0.45, 0.6, y, -0.18, 0.6, y - 0.25, -0.45); }
  g.add(segs(p, 0xe07a6f));
  return g;
}
function piramide(mat: THREE.Material): THREE.Mesh {
  const geo = new THREE.ConeGeometry(0.55, 0.8, 4); geo.rotateX(Math.PI / 2); geo.rotateZ(Math.PI / 4);
  geo.translate(0, 0, -0.4);   // la punta en el nudo
  return new THREE.Mesh(geo, mat);
}
function simboloArticulado(): THREE.Object3D {
  const g = new THREE.Group(); g.add(piramide(matPinned));
  const p: number[] = [];   // base con rayado
  for (let k = 0; k <= 4; k++) { const x = -0.6 + k * 0.3; p.push(x, -0.6, -0.8, x - 0.2, -0.6, -1.0); }
  p.push(-0.7, -0.6, -0.8, 0.7, -0.6, -0.8);
  g.add(segs(p, 0x7fd8cc));
  return g;
}
function simboloRodillo(): THREE.Object3D {
  const g = new THREE.Group(); g.add(piramide(matRoller));
  const esf = new THREE.SphereGeometry(0.13, 12, 8);
  for (const x of [-0.25, 0.25]) { const r = new THREE.Mesh(esf, matRoller); r.position.set(x, 0, -0.93); g.add(r); }
  g.add(segs([-0.7, 0, -1.06, 0.7, 0, -1.06], 0x9cc3ff));
  return g;
}
function simboloParcial(): THREE.Object3D {
  const e = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.6, 0.6, 0.6));
  const l = new THREE.LineSegments(e, lin(0xaaaaaa)); l.position.z = -0.3; return l;
}
function simboloResorte(): THREE.Object3D {
  const p: number[] = []; const n = 6, a = 0.22;
  let prev = [0, 0, 0];
  const pts = [[0, 0, 0], [0, 0, -0.15]];
  for (let k = 0; k < n; k++) pts.push([k % 2 ? -a : a, 0, -0.15 - (k + 0.5) * (0.7 / n)]);
  pts.push([0, 0, -0.85], [0, 0, -1.0]);
  for (const q of pts.slice(1)) { p.push(...prev, ...q); prev = q; }
  p.push(-0.3, 0, -1.0, 0.3, 0, -1.0);
  return segs(p, 0xf4a261);
}

export function supports(
  structure: Structure,
  settings: Settings,
  derivedNodes: State<Node[]>,
  derivedDisplayScale: State<number>,
  objects3D?: State<THREE.Object3D[]>
): THREE.Group {
  const group = new THREE.Group();
  group.name = "supportsGroup";
  const tam = () => SIMBOLO_FRACCION * extentDe(derivedNodes.rawVal ?? [], settings.gridSize.rawVal)
    * (derivedDisplayScale.rawVal / ESCALA_DEFECTO);

  van.derive(() => {
    settings.deformedShape.val; // triggers update
    if (!settings.supports.val) return;
    group.clear();
    const nodes = derivedNodes.val;
    const ni: any = structure.nodeInputs?.val ?? {};
    const con = new Set<number>();
    ni.supports?.forEach((dofs: boolean[], index: number) => {
      const pos = nodes[index]; if (!pos) return;
      const d = dofs ?? [];
      const nT = (d[0] ? 1 : 0) + (d[1] ? 1 : 0) + (d[2] ? 1 : 0);
      const nR = (d[3] ? 1 : 0) + (d[4] ? 1 : 0) + (d[5] ? 1 : 0);
      if (nT === 0 && nR === 0) return;
      const o = nT === 3 && nR === 3 ? simboloEmpotrado()
        : nT === 3 ? simboloArticulado()
        : nT >= 1 ? simboloRodillo()
        : simboloParcial();
      o.position.set(pos[0], pos[1], pos[2]); group.add(o); con.add(index);
    });

    // Resortes: los del nudo (node ≥ 0) y los de ÁREA (node < 0 = −(elemento+1): sus nudos).
    // Si el ejemplo ya dibuja sus muelles (objects3D, zapatas), no se repiten.
    const yaDibujados = (objects3D?.rawVal?.length ?? 0) > 0;
    if (!yaDibujados && Array.isArray(ni.springs) && ni.springs.length) {
      const els = structure.elements?.val ?? [];
      const nudosM = new Set<number>();
      for (const s of ni.springs) {
        if (s.node >= 0) { if (s.dof === 2 || s.dof === undefined) nudosM.add(s.node); }
        else (els[-s.node - 1] ?? []).forEach((n: number) => nudosM.add(n));
      }
      let lista = [...nudosM].filter((n) => nodes[n] && !con.has(n));
      const MAX = 160;   // un campo regular, no un bosque (igual que las cargas de área)
      if (lista.length > MAX) {
        const xs = lista.map((i) => nodes[i][0]), ys = lista.map((i) => nodes[i][1]);
        const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
        const nc = Math.max(2, Math.round(Math.sqrt(MAX)));
        const mejor = new Map<string, { i: number; d: number }>();
        for (const i of lista) {
          const u = x1 - x0 < 1e-9 ? 0 : (nodes[i][0] - x0) / (x1 - x0), v = y1 - y0 < 1e-9 ? 0 : (nodes[i][1] - y0) / (y1 - y0);
          const cu = Math.min(nc - 1, Math.floor(u * nc)), cv = Math.min(nc - 1, Math.floor(v * nc));
          const d = Math.hypot(u * nc - (cu + 0.5), v * nc - (cv + 0.5)), k = cu + "," + cv, y = mejor.get(k);
          if (!y || d < y.d) mejor.set(k, { i, d });
        }
        lista = [...mejor.values()].map((m) => m.i);
      }
      for (const n of lista) { const o = simboloResorte(); o.position.set(nodes[n][0], nodes[n][1], nodes[n][2]); group.add(o); }
    }
    const s = tam(); group.children.forEach((c) => c.scale.set(s, s, s));
  });

  van.derive(() => {
    derivedDisplayScale.val; // triggers update
    if (!settings.supports.rawVal) return;
    const s = tam(); group.children.forEach((c) => c.scale.set(s, s, s));
  });

  van.derive(() => { group.visible = settings.supports.val; });
  return group;
}
