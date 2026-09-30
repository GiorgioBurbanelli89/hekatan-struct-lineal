import * as THREE from "three";
import van, { State } from "vanjs-core";
import { Node } from "hekatan-fem";
import { Structure } from "hekatan-fem";
import { Settings } from "../settings/getSettings";

/**
 * Los GDL que son RESTRICCIÓN DE PLANO y no apoyo: `[ux, uy, uz, rx, ry, rz]` en true.
 * (Rama fix-apoyos-tests, c02e6bbc0 del 27-sep-2026, traída a main el 30-sep-2026.)
 *
 * Regla (la de «Available DOFs» de SAP2000/ETABS para un modelo plano):
 *   1. se toma lo que está atado en TODOS los nudos del modelo (la intersección);
 *   2. el modelo tiene que ser plano en un eje coordenado k (todos los nudos con la
 *      misma coordenada k, en la geometría SIN deformar);
 *   3. y esa intersección tiene que caber en uno de los dos juegos de GDL que un
 *      modelo plano no usa: el de la membrana o pórtico plano {u_k, r_a, r_b} —con
 *      el giro normal r_k si además es una membrana sin giros, o una celosía plana—,
 *      o el de la placa {u_a, u_b, r_k}.
 * Un apoyo de verdad ata GDL que el modelo SÍ usa, así que nunca entra aquí.
 */
export function restriccionDePlano(
  sups: Map<number, boolean[]> | undefined,
  nodos: Node[] | undefined
): boolean[] {
  const nada = [false, false, false, false, false, false];
  if (!sups || !nodos || nodos.length < 3) return nada;
  const comun = [true, true, true, true, true, true];
  for (let n = 0; n < nodos.length; n++) {
    const d = sups.get(n) as boolean[] | undefined;
    if (!d) return nada; // un nudo sin ninguna atadura: no hay restricción general
    for (let k = 0; k < 6; k++) if (!d[k]) comun[k] = false;
  }
  if (!comun.some(Boolean)) return nada;
  let ext = 0;
  const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (const p of nodos)
    for (let k = 0; k < 3; k++) { if (p[k] < mn[k]) mn[k] = p[k]; if (p[k] > mx[k]) mx[k] = p[k]; }
  for (let k = 0; k < 3; k++) ext = Math.max(ext, mx[k] - mn[k]);
  const cabe = (juego: number[]) => comun.every((x, g) => !x || juego.includes(g));
  for (let k = 0; k < 3; k++) {
    if (mx[k] - mn[k] > 1e-9 * Math.max(1, ext)) continue; // no es plano en este eje
    const a = (k + 1) % 3, b = (k + 2) % 3;
    if (cabe([k, 3 + a, 3 + b, 3 + k]) || cabe([a, b, 3 + k])) return comun;
  }
  return nada;
}

/**
 * PLANOS DE SIMETRÍA (30-sep-2026, Jorge: «arregla esos triángulos, son nodos»): una faja de muro
 * ata en las dos caras de los extremos (y = 0 y y = L) lo que pide la simetría —u normal a la cara y
 * los dos giros del plano, o solo u normal en sólidos— en TODOS sus nudos. Eso es una condición de
 * contorno de simetría, no un apoyo, y dibujarla llena la cara de triángulos.
 *
 * Regla: para cada cara del modelo con normal HORIZONTAL (X o Y; las caras de normal Z no entran, para
 * no esconder nunca un apoyo vertical) se toma la intersección de lo atado en todos sus nudos; lo que
 * de ella cae en el juego de simetría {u_k, r_a, r_b} se devuelve por nudo para no dibujarlo. Si a un
 * nudo le queda algo atado aparte (el apoyo en x de la puntera, un empotramiento), se sigue dibujando.
 */
export function restriccionDeSimetria(
  sups: Map<number, boolean[]> | undefined,
  nodos: Node[] | undefined
): Map<number, boolean[]> {
  const out = new Map<number, boolean[]>();
  if (!sups || !nodos || nodos.length < 4) return out;
  const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (const p of nodos)
    for (let k = 0; k < 3; k++) { if (p[k] < mn[k]) mn[k] = p[k]; if (p[k] > mx[k]) mx[k] = p[k]; }
  const ext = Math.max(1, mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]);
  for (const k of [0, 1]) {
    if (mx[k] - mn[k] <= 1e-9 * ext) continue;            // plano en k: lo cubre restriccionDePlano
    const a = (k + 1) % 3, b = (k + 2) % 3;
    const juego = [k, 3 + a, 3 + b];
    for (const v of [mn[k], mx[k]]) {
      const cara: number[] = [];
      nodos.forEach((p, n) => { if (Math.abs(p[k] - v) <= 1e-9 * ext) cara.push(n); });
      if (cara.length < 4) continue;
      const comun = [true, true, true, true, true, true];
      let todos = true;
      for (const n of cara) {
        const d = sups.get(n) as boolean[] | undefined;
        if (!d) { todos = false; break; }
        for (let g = 0; g < 6; g++) if (!d[g]) comun[g] = false;
      }
      if (!todos) continue;
      const mascara = comun.map((x, g) => x && juego.includes(g));
      if (!mascara.some(Boolean)) continue;
      for (const n of cara) {
        const prev = out.get(n) ?? [false, false, false, false, false, false];
        out.set(n, prev.map((x, g) => x || mascara[g]));
      }
    }
  }
  return out;
}

export function supports(
  structure: Structure,
  settings: Settings,
  derivedNodes: State<Node[]>,
  derivedDisplayScale: State<number>
): THREE.Group {
  const group = new THREE.Group();
  // ── Símbolos por TIPO de apoyo (convención estructural) ──
  //   • Empotrado  (3 traslac. + 3 rot. fijas) → CUBO rojo (rigidez total)
  //   • Articulado (3 traslac. fijas, rot. libres) → PIRÁMIDE verde (apex en el nodo)
  //   • Rodillo / parcial (menos restricciones) → PIRÁMIDE azul
  const boxGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const coneGeo = new THREE.ConeGeometry(0.45, 0.7, 4); // pirámide 4 lados
  coneGeo.rotateX(Math.PI / 2);    // apex → +Z (convención Z-up)
  coneGeo.translate(0, 0, -0.35);  // apex en el origen local, base hacia abajo
  const matFixed = new THREE.MeshBasicMaterial({ color: 0x9b2226 });  // rojo
  const matPinned = new THREE.MeshBasicMaterial({ color: 0x2a9d8f }); // verde
  const matRoller = new THREE.MeshBasicMaterial({ color: 0x3a86ff }); // azul
  // Helper: extent del modelo (igual que en nodes.ts). Si el modelo es más
  // chico que el grid, los apoyos se escalan al modelo. Si es más grande,
  // siguen siendo proporcionales. Evita apoyos GIGANTES con gridSize=20 y
  // modelos de spanTotal<10m (caso típico de pórticos planos).
  const computeExtent = (): number => {
    const ns = derivedNodes.rawVal ?? [];
    if (ns.length < 2) return settings.gridSize.val * 0.5;
    let mins = [Infinity, Infinity, Infinity];
    let maxs = [-Infinity, -Infinity, -Infinity];
    for (const n of ns) {
      for (let i = 0; i < 3; i++) {
        if (n[i] < mins[i]) mins[i] = n[i];
        if (n[i] > maxs[i]) maxs[i] = n[i];
      }
    }
    return Math.max(maxs[0] - mins[0], maxs[1] - mins[1], maxs[2] - mins[2], 0.1);
  };

  // Factor 0.025 del extent — apoyos pequeños y discretos.
  // Los apoyos son visualmente ~ tamaño del nodo (0.03·extent), un poco
  // menos. Con BoxGeometry(0.5,0.5,0.5) el cubo final = 0.5·0.025·extent
  // = ~1.25% del extent del modelo. Para spanTotal=12m → cubo ~0.15m,
  // marcador discreto que NO domina la vista.
  const computeSize = () => 0.08 * computeExtent();
  // El display scale escala TODOS los marcadores por igual, incluidos los
  // apoyos. Antes había un piso Math.max(...,1) que los congelaba en 1× para
  // cualquier escala <1 (mitad inferior del slider) → el usuario veía un
  // "punto que no cambia" al bajar la escala. Ahora escalan proporcional al
  // slider como nodos, cargas y etiquetas, manteniendo el control coherente.
  const effScale = () => derivedDisplayScale.rawVal;

  // on settings.support & deformedShape, and model clear and create visuals
  van.derive(() => {
    settings.deformedShape.val; // triggers update

    if (!settings.supports.val) return;

    group.clear();

    const size = computeSize();
    // Restricción de PLANO y planos de SIMETRÍA: no son apoyos (ver arriba). Se miran sobre la geometría
    // SIN deformar; un nudo solo se dibuja si le queda algo atado aparte de eso.
    const sups = structure.nodeInputs?.val.supports as Map<number, boolean[]> | undefined;
    const nodosBase = structure.nodes?.val ?? derivedNodes.val;
    const dePlano = restriccionDePlano(sups, nodosBase);
    const deSimetria = restriccionDeSimetria(sups, nodosBase);
    structure.nodeInputs?.val.supports?.forEach((dofs, index) => {
      const position = derivedNodes.val[index];
      if (!position) return; // do not create if node does not exist

      // Elegir el símbolo según los DOF restringidos.
      const d = (dofs as boolean[]) ?? [];
      const sim = deSimetria.get(index);
      if (!d.some((x, k) => x && !dePlano[k] && !(sim && sim[k]))) return;   // nudo libre: no es apoyo
      const nT = (d[0] ? 1 : 0) + (d[1] ? 1 : 0) + (d[2] ? 1 : 0); // traslaciones fijas
      const nR = (d[3] ? 1 : 0) + (d[4] ? 1 : 0) + (d[5] ? 1 : 0); // rotaciones fijas
      let mesh: THREE.Mesh;
      if (nT >= 3 && nR >= 3)       mesh = new THREE.Mesh(boxGeo, matFixed);    // empotrado
      else if (nT >= 3 && nR === 0) mesh = new THREE.Mesh(coneGeo, matPinned);  // articulado
      else                          mesh = new THREE.Mesh(coneGeo, matRoller);  // rodillo/parcial

      mesh.position.set(position[0], position[1], position[2]);
      const scale = size * effScale();
      mesh.scale.set(scale, scale, scale);

      group.add(mesh);
    });
  });

  // on derivedDisplayScale or gridSize update scale
  van.derive(() => {
    derivedDisplayScale.val; // triggers update

    if (!settings.supports.rawVal) return;

    const size = computeSize();
    const scale = size * effScale();
    group.children.forEach((c) => c.scale.set(scale, scale, scale));
  });

  // on settings.supports update visibility
  van.derive(() => {
    group.visible = settings.supports.val;
  });

  return group;
}
