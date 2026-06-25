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
  // init
  const group = new THREE.Group();

  // Helper: extent del modelo (igual que nodes.ts y supports.ts).
  // Antes los frame results usaban "0.05 * gridSize" → con gridSize=20m
  // default los diagramas eran ENORMES (1m de altura) sobre modelos chicos.
  // Ahora son proporcionales al span real del modelo.
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
  // 2.5% del extent — diagramas más chicos para no chocar con labels
  // ni con el deformed shape. Antes era 5% pero quedaba muy dominante
  // cuando había muchos frames con resultados visibles a la vez.
  const computeSize = () => 0.025 * computeExtent();
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

      const size = computeSize();
      resultObject.updateScale(size * deridedDisplayScale.rawVal);

      group.add(resultObject);
    });
  });

  // on deridedDisplayScale update scale
  van.derive(() => {
    deridedDisplayScale.val; // trigger updates

    if (settings.frameResults.rawVal == "none") return;

    const size = computeSize();
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

  nodeOutputs?.forEach((node) => {
    const maxInNode = Math.max(...(node ?? [0, 0]));
    if (maxInNode > max) max = maxInNode;
  });

  return max;
}
