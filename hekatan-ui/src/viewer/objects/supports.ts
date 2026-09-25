import * as THREE from "three";
import van, { State } from "vanjs-core";
import { Node } from "hekatan-fem";
import { Structure } from "hekatan-fem";
import { Settings } from "../settings/getSettings";

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
    const sups = structure.nodeInputs?.val.supports;
    // Restricción de PLANO (p. ej. uy, rx, rz fijos en un muro X-Z): el mismo
    // patrón parcial puesto en la mayoría de los nudos NO es un apoyo, es lo que
    // ETABS/SAP2000 llaman «Available DOFs» del modelo, y no lo dibujan en los
    // nudos. Si se dibuja, un nudo libre parece articulado. Se cuenta cada patrón
    // parcial y el que cubra más de la mitad de los nudos no se pinta.
    const key = (d: boolean[]) => d.map((x) => (x ? 1 : 0)).join("");
    const nNodes = derivedNodes.val.length;
    const cuenta = new Map<string, number>();
    sups?.forEach((dofs) => {
      const d = (dofs as boolean[]) ?? [];
      if (d.every(Boolean) || !d.some(Boolean)) return;
      cuenta.set(key(d), (cuenta.get(key(d)) ?? 0) + 1);
    });
    const dePlano = new Set([...cuenta].filter(([, c]) => c > nNodes / 2).map(([k]) => k));

    sups?.forEach((dofs, index) => {
      const position = derivedNodes.val[index];
      if (!position) return; // do not create if node does not exist

      // Elegir el símbolo según los DOF restringidos.
      const d = (dofs as boolean[]) ?? [];
      if (dePlano.has(key(d))) return; // restricción de plano, no apoyo
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
