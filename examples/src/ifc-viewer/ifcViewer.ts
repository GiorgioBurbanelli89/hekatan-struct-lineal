/**
 * Visor de IFC — enseña el modelo arquitectónico (mallas B-rep de SketchUp) que
 * NO trae estructura semántica. Lo que hace ETABS al importar un IFC es DOS
 * cosas: (1) dibujar la geometría, (2) convertir los elementos lineales en
 * barras y los planos en áreas. Esto es el paso (1): ver el modelo. La conversión
 * a estructura (paso 2) es aparte.
 *
 * La malla llega en `window.__hekatanIfcMesh` (grupos {positions, color}) que deja
 * el lector `parseIfc` sobre el fichero que sube el usuario.
 */
import * as THREE from "three";
import type { ExampleDef } from "../workspace/exampleRegistry";

interface Grupo { positions: number[]; color: [number, number, number]; }

/** Caja del cluster más denso: parte por el hueco mayor del eje más largo. */
function cajaPrincipal(grupos: Grupo[], bboxTotal: [number[], number[]]): [number[], number[]] {
  const ax = [0, 1, 2].reduce((a, e) => (bboxTotal[1][e] - bboxTotal[0][e]) > (bboxTotal[1][a] - bboxTotal[0][a]) ? e : a, 0);
  const cen: number[] = [];
  for (const g of grupos) { const p = g.positions; for (let i = 0; i < p.length; i += 9) cen.push((p[i + ax] + p[i + 3 + ax] + p[i + 6 + ax]) / 3); }
  if (cen.length < 2) return bboxTotal;
  cen.sort((a, b) => a - b);
  let gi = 0, gmax = 0;
  for (let i = 1; i < cen.length; i++) { const d = cen[i] - cen[i - 1]; if (d > gmax) { gmax = d; gi = i; } }
  const span = cen[cen.length - 1] - cen[0];
  if (gmax < span * 0.15) return bboxTotal;   // un solo cluster
  const corte = (cen[gi] + cen[gi - 1]) / 2;
  const bajo = gi, alto = cen.length - gi;     // triángulos a cada lado
  const quedarseAlto = alto >= bajo;
  // bbox del lado elegido
  const mn = [1e30, 1e30, 1e30], mx = [-1e30, -1e30, -1e30];
  for (const g of grupos) { const p = g.positions;
    for (let i = 0; i < p.length; i += 9) {
      const c = (p[i + ax] + p[i + 3 + ax] + p[i + 6 + ax]) / 3;
      if ((quedarseAlto && c < corte) || (!quedarseAlto && c >= corte)) continue;
      for (let k = 0; k < 3; k++) for (const o of [0, 3, 6]) {
        const v = p[i + o + k]; if (v < mn[k]) mn[k] = v; if (v > mx[k]) mx[k] = v;
      }
    }
  }
  return [mn, mx];
}

export const ifcViewer: ExampleDef = {
  id: "ifc-viewer",
  name: "Ver IFC (arquitectura)",
  category: "🧪 Utilidades",
  defaultShellResult: "none",
  availableShellResults: [],
  params: {
    opacidad: { default: 100, min: 10, max: 100, step: 5, label: "Opacidad (%)", folder: "🏛 IFC" },
    caras: { default: 1, boolean: true, label: "Mostrar caras", folder: "🏛 IFC" },
  },
  computedLabels() {
    const M = (window as any).__hekatanIfcMesh;
    if (!M) return { "IFC": "ninguno — usa 📥 Importar IFC" };
    return {
      "Archivo": String(M.archivo ?? "ifc"),
      "Objetos (colores)": String(M.grupos?.length ?? 0),
      "Triángulos": String(M.nTri ?? 0),
      "Tamaño (m)": M.bbox ? M.bbox[1].map((v: number, i: number) => (v - M.bbox[0][i]).toFixed(1)).join(" × ") : "—",
    };
  },
  build(p, states) {
    const M = (window as any).__hekatanIfcMesh as { grupos: Grupo[]; bbox: [number[], number[]] } | undefined;
    if (!M || !M.grupos?.length) {
      states.nodes.val = []; states.elements.val = [];
      states.nodeInputs.val = { supports: new Map(), loads: new Map() };
      states.elementInputs.val = { elasticities: new Map(), shearModuli: new Map(), areas: new Map(),
        momentsOfInertiaY: new Map(), momentsOfInertiaZ: new Map(), torsionalConstants: new Map(),
        densities: new Map(), poissonsRatios: new Map() };
      states.objects3D.val = [];
      console.log("[IFC] Sin modelo. Usa '📥 Importar IFC'.");
      return;
    }
    const op = Math.max(0.1, Math.min(1, (p.opacidad ?? 100) / 100));
    const objs: THREE.Object3D[] = [];
    // Luces: el visor arma la escena sin luz propia para las mallas IFC; sin esto
    // un MeshLambert/Standard sale NEGRO. Se meten como objects3D.
    objs.push(new THREE.AmbientLight(0xffffff, 0.75));
    const dl1 = new THREE.DirectionalLight(0xffffff, 0.7); dl1.position.set(1, 1, 2);
    const dl2 = new THREE.DirectionalLight(0xffffff, 0.4); dl2.position.set(-1, -0.5, 1);
    objs.push(dl1, dl2);
    if (p.caras) for (const g of M.grupos) {
      if (!g.positions.length) continue;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(g.positions, 3));
      geo.computeVertexNormals();
      // MeshStandard con algo de emisivo: se ve el color aunque una cara quede a
      // contraluz (útil en un modelo cerrado de arquitectura).
      const col = new THREE.Color(g.color[0], g.color[1], g.color[2]);
      objs.push(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
        color: col, emissive: col.clone().multiplyScalar(0.25), roughness: 0.9, metalness: 0.0,
        transparent: op < 1, opacity: op, side: THREE.DoubleSide,
      })));
    }
    states.objects3D.val = objs;
    // Encuadre: un IFC de SketchUp puede traer VARIAS edificaciones lejos entre
    // sí (aquí la iglesia y otra construcción a ~120 m). Se encuadra el CLUSTER
    // más denso (más triángulos), partiendo por el hueco mayor del eje más largo.
    const [mn, mx] = cajaPrincipal(M.grupos, M.bbox);
    states.nodes.val = [[mn[0], mn[1], mn[2]], [mx[0], mx[1], mx[2]]];
    states.elements.val = [];
    states.nodeInputs.val = { supports: new Map(), loads: new Map() };
    states.elementInputs.val = { elasticities: new Map(), shearModuli: new Map(), areas: new Map(),
      momentsOfInertiaY: new Map(), momentsOfInertiaZ: new Map(), torsionalConstants: new Map(),
      densities: new Map(), poissonsRatios: new Map() };
    console.log(`[IFC] ${M.grupos.length} objetos, ${(M as any).nTri ?? "?"} triángulos.`);
  },
};
