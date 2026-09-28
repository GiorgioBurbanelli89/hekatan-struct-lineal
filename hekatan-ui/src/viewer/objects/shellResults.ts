import * as THREE from "three";
import van, { State } from "vanjs-core";
import { Mesh, Node } from "hekatan-fem";
import { Settings } from "../settings/getSettings";
import { getColorMap } from "../../color-map/getColorMap";

export function shellResults(
  mesh: Mesh,
  settings: Settings,
  derivedNodes: State<Node[]>,
  colorMapValues: State<number[]>
): THREE.Object3D {
  // Init
  // El colormap va por NUDO y enseña UNA familia cada vez: con un campo de sólido elegido se
  // pinta la piel de los hexaedros; si no, las cáscaras. En un modelo mixto (tubo de acero
  // relleno de hormigón) los dos comparten nudos, y pintar las cáscaras con el valor del
  // sólido sería enseñar en el acero la tensión del hormigón.
  const familia = van.derive<"cascara" | "solido">(() =>
    (settings.solidResults?.val ?? "none") !== "none" ? "solido" : "cascara");
  const colorMap = getColorMap(derivedNodes, mesh.elements, colorMapValues, familia);

  // Events
  // Se ve si hay un campo de cáscara O de sólido elegido: el colormap es el mismo objeto. Con
  // solo `shellResults`, un modelo de sólidos tenía que encender «FVM» de cáscara para pintarse.
  van.derive(() => {
    const cascara = settings.shellResults.val != "none";
    const solido = (settings.solidResults?.val ?? "none") != "none";
    colorMap.visible = cascara || solido;
  });

  return colorMap;
}
