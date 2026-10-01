import * as THREE from "three";
import van, { State } from "vanjs-core";
import { Node } from "hekatan-fem";
import { Settings } from "../settings/getSettings";
import { getTheme, onThemeChange } from "../../theme";

export function nodes(
  settings: Settings,
  derivedNodes: State<Node[]>,
  derivedDisplayScale: State<number>,
  elementos?: State<number[][]>
): THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial> {
  const t = getTheme();
  const points = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({ color: t.nodePoint })
  );
  onThemeChange((_n, c) => { points.material.color.setHex(c.nodePoint); });
  points.frustumCulled = false;

  // on settings.nodes, and derivedNodes update visuals
  van.derive(() => {
    if (!settings.nodes.val) return;
    const malla = (settings as any).malla ? (settings as any).malla.val : true;
    const els = elementos?.val ?? [];
    const ns = derivedNodes.val;
    // Sin «Malla de áreas» (1-oct-2026) los nudos que SOLO tocan cáscaras no se dibujan: miles de puntos dibujaban
    // la malla igual. Quedan los de las barras y los sueltos (apoyos, cargas en nudos de sólidos, etc.).
    let pts: number[] = [];
    if (malla || !els.some((e) => e.length === 3 || e.length === 4)) pts = ns.flat();
    else {
      const deCascara = new Uint8Array(ns.length), deBarra = new Uint8Array(ns.length);
      for (const e of els) {
        if (e.length === 2) { deBarra[e[0]] = 1; deBarra[e[1]] = 1; }
        else if (e.length === 3 || e.length === 4) for (const i of e) deCascara[i] = 1;
      }
      for (let i = 0; i < ns.length; i++) if (deBarra[i] || !deCascara[i]) pts.push(ns[i][0], ns[i][1], ns[i][2]);
    }
    points.geometry.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  });

  // on derivedDisplayScale, gridSize or nodes change update scale
  // Tamaño proporcional al EXTENT del modelo (consistente con loads/supports
  // que usan 8% del extent). Antes era proporcional a gridSize (constante)
  // lo que hacía los nodos minúsculos vs flechas en modelos pequeños.
  van.derive(() => {
    derivedDisplayScale.val; // trigger update
    derivedNodes.val;        // trigger update cuando cambia geometría

    if (!settings.nodes.rawVal) return;

    // Calcular extent del modelo
    const ns = derivedNodes.rawVal ?? [];
    let extent = settings.gridSize.val * 0.5;  // fallback inicial
    if (ns.length >= 2) {
      const mins = [Infinity, Infinity, Infinity];
      const maxs = [-Infinity, -Infinity, -Infinity];
      for (const n of ns) {
        for (let i = 0; i < 3; i++) {
          mins[i] = Math.min(mins[i], n[i]);
          maxs[i] = Math.max(maxs[i], n[i]);
        }
      }
      extent = Math.max(maxs[0]-mins[0], maxs[1]-mins[1], maxs[2]-mins[2], 0.1);
    }
    // 3% del extent (vs flechas que usan 8% — los nodos quedan ~40% del tamaño
    // de las flechas, proporcionalmente visibles sin dominar)
    const size = 0.03 * extent;
    points.material.size = size * derivedDisplayScale.rawVal;
  });

  // on settings.nodes update visibility
  van.derive(() => {
    points.visible = settings.nodes.val;
  });

  return points;
}
