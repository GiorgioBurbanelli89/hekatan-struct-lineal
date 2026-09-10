import * as THREE from "three";
import van, { State } from "vanjs-core";
import { AnalyzeOutputs, Node } from "hekatan-fem";
import { Mesh } from "hekatan-fem";
import { Settings } from "../settings/getSettings";

import { getTransformationMatrixBeam } from "./utils/getTransformationMatrixBeam";
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
      const normalizedResult = result?.map(
        (n) => n / (maxResult === 0 ? 1 : maxResult)
      );
      const rotation = getTransformationMatrixBeam(node1, node2);
      const resultObject = new resultObjects[resultType](
        node1,
        node2,
        length,
        rotation,
        result ?? [0, 0],
        normalizedResult ?? [0, 0],
        [
          ResultType.normals,
          ResultType.shearsZ,
          ResultType.torsions,
          ResultType.bendingsY,
        ].includes(resultType)
          ? true
          : false
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
