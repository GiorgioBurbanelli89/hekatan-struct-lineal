import * as THREE from "three";
import van, { State } from "vanjs-core";
import { AnalyzeOutputs, Node } from "hekatan-fem";
import { Mesh } from "hekatan-fem";
import { Settings } from "../settings/getSettings";

import { ejesCSI, diagramaCSI, ladoPositivo } from "./utils/diagramaCSI";
import { ConstantResult } from "./resultObjects/ConstantResult";
import { LinearResult } from "./resultObjects/LinearResult";
import { IResultObject } from "./resultObjects/IResultObject";

enum ResultType {
  normals = "normals",
  shearsY = "shearsY",
  shearsZ = "shearsZ",
  torsions = "torsions",
  bendingsY = "bendingsY",
  bendingsZ = "bendingsZ",
}

export function frameResults(
  mesh: Mesh,
  settings: Settings,
  derivedNodes: State<Node[]>,
  deridedDisplayScale: State<number>
): THREE.Group {
  /**
   * El tamaño del diagrama sale del MODELO, no de la rejilla.
   *
   * Antes era `0.05 · gridSize`: con la rejilla de 30 m que trae el lienzo, un
   * pórtico de 6 m salía con un diagrama de metro y medio y el rótulo encima —
   * tapaba la estructura entera y había que irse a «Display scale» a bajarlo a
   * mano. Va con la diagonal de lo que hay dibujado, que es lo que hacen ETABS y
   * SAP: el diagrama se ve igual de grande en un edificio que en una viga.
   * `displayScale` sigue mandando encima, para el que quiera más o menos.
   */
  const tamañoBase = (): number => {
    const N = derivedNodes.rawVal;
    if (!N?.length) return 0.05 * settings.gridSize.rawVal;
    const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
    for (const n of N) for (let i = 0; i < 3; i++) {
      if (n[i] < mn[i]) mn[i] = n[i];
      if (n[i] > mx[i]) mx[i] = n[i];
    }
    const diag = Math.hypot(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]);
    if (!isFinite(diag) || diag <= 0) return 0.05 * settings.gridSize.rawVal;
    return 0.025 * diag;
  };

  // init
  const group = new THREE.Group();
  const resultObjects = {
    [ResultType.normals]: ConstantResult,
    [ResultType.shearsY]: ConstantResult,
    [ResultType.shearsZ]: ConstantResult,
    [ResultType.torsions]: ConstantResult,
    [ResultType.bendingsY]: LinearResult,
    [ResultType.bendingsZ]: LinearResult,
  };

  // on settings.elementResults & deformedShape, model clear and create visuals
  van.derive(() => {
    settings.deformedShape.val; // triggers update
    derivedNodes.val; // triggers update

    if (settings.frameResults.val == "none") return;

    group.children.forEach((c) => (c as IResultObject).dispose());
    group.clear();

    const resultType =
      ResultType[settings.frameResults.rawVal as keyof typeof ResultType];

    mesh.analyzeOutputs?.rawVal[resultType]?.forEach((result, index) => {
      const element = mesh.elements?.rawVal[index] ?? [0, 1]; // TODO: improve this
      const node1 = derivedNodes.rawVal[element[0]];
      const node2 = derivedNodes.rawVal[element[1]];
      // ⚠️ Si el nudo no está, `new THREE.Vector3(...node2)` revienta con
      // «a is not iterable» y se lleva por delante TODO el visor. Pasa al pedir un
      // diagrama en un modelo que aún no se ha calculado, o dibujado a mano en el
      // CAD: hay salidas de una corrida anterior y no hay nudos que las sostengan.
      // Se salta ese elemento y se sigue, que es lo que espera quien pulsa la tecla.
      if (!node1 || !node2) return;
      const length = new THREE.Vector3(...node2).distanceTo(
        new THREE.Vector3(...node1)
      );
      const maxResult = findMax(mesh.analyzeOutputs?.rawVal[resultType]);
      // Los ejes y el signo de ETABS (ver utils/diagramaCSI.ts). Antes iba la tríada
      // vieja de awatif con un `flipAxis` por tipo: V2 y M3 salían en HORIZONTAL, fuera
      // del plano del pórtico, y el momento con el signo cambiado.
      const ang = (mesh as any).elementInputs?.rawVal?.localAngles?.get?.(index) ?? 0;
      const ejes = ejesCSI(node1, node2, ang);
      const lado = ladoPositivo(resultType, ejes);
      const ex = new THREE.Vector3(...ejes.e1), ey = new THREE.Vector3(...lado);
      // la figura se dibuja en su plano x-y: x a lo largo de la barra, y hacia el lado
      // donde va un valor positivo
      const rotation = new THREE.Matrix4().makeBasis(ex, ey, ex.clone().cross(ey));
      const [di, dj] = diagramaCSI(resultType, result);
      // LinearResult escribe result[0] en el nudo i y −result[1] en el j;
      // ConstantResult escribe result[1]
      const res: [number, number] = resultObjects[resultType] === LinearResult ? [di, -dj] : [di, dj];
      const normalizedResult = res.map((n) => n / (maxResult === 0 ? 1 : maxResult));
      const resultObject = new resultObjects[resultType](
        node1,
        node2,
        length,
        rotation,
        res,
        normalizedResult,
        false
      );

      resultObject.updateScale(tamañoBase() * deridedDisplayScale.rawVal);

      group.add(resultObject);
    });
  });

  // on deridedDisplayScale update scale
  van.derive(() => {
    deridedDisplayScale.val; // trigger updates

    if (settings.frameResults.rawVal == "none") return;

    settings.gridSize.val;   // se sigue mirando: si no hay nada dibujado, manda la rejilla
    const size = tamañoBase();
    group.children.forEach((c) =>
      (c as IResultObject).updateScale(size * deridedDisplayScale.rawVal)
    );
  });

  // on settings.elementResults update viability
  van.derive(() => {
    group.visible = settings.frameResults.val != "none";
  });

  return group;
}

function findMax(nodeOutputs: AnalyzeOutputs[ResultType]): number {
  let max: number = 0;

  // ⚠️ En VALOR ABSOLUTO. Con `Math.max` a secas, un diagrama entero NEGATIVO
  // —el momento de un pórtico bajo viento, sin ir más lejos— dejaba el máximo en
  // 0, no se normalizaba nada y se dibujaban los kN·m EN CRUDO: picos de cientos
  // de metros tapando el edificio. El axil y el cortante se salvaban por poco.
  nodeOutputs?.forEach((node) => {
    const maxInNode = Math.max(...(node ?? [0, 0]).map((v) => Math.abs(v)));
    if (maxInNode > max) max = maxInNode;
  });

  return max;
}
