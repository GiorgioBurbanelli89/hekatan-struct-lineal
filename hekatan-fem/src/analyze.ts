import { multiply, matrix, Matrix, mean } from "mathjs";
import {
  Node,
  Element,
  AnalyzeOutputs,
  DeformOutputs,
  ElementInputs,
} from "./data-model";
import { csiThickJointMoments } from "./utils/csiThickJoints";
import { dkqJointMoments } from "./utils/dkqJoints";
import { itwJointForces } from "./utils/itwJoints";
import { getTransformationMatrix } from "./utils/getTransformationMatrix";
import {
  getLocalStiffnessMatrix,
  getIsotropicInPlaneConstitutiveMatrix,
  getOrthotropicInPlaneConstitutiveMatrix,
} from "./utils/getLocalStiffnessMatrix";

export function analyze(
  nodes: Node[],
  elements: Element[],
  elementInputs: ElementInputs,
  deformOutputs: DeformOutputs
): AnalyzeOutputs {
  const analyzeOutputs: AnalyzeOutputs = {
    normals: new Map(),
    shearsY: new Map(),
    shearsZ: new Map(),
    torsions: new Map(),
    bendingsY: new Map(),
    bendingsZ: new Map(),
    bendingXX: new Map(),
    bendingYY: new Map(),
    bendingXY: new Map(),
    membraneXX: new Map(),
    membraneYY: new Map(),
    membraneXY: new Map(),
    tranverseShearX: new Map(),
    tranverseShearY: new Map(),
    vonMises: new Map(),
  };

  // Momentos en los 4 JOINTS de cada Q4 (Shell-Thick de CSI con sus 10 gdl
  // internos recuperados, ver utils/csiThickJoints.ts). Sin promediar: es lo
  // que ETABS lista en AreaForceShell, por elemento y por joint.
  const jointBending: Map<number, number[][]> = new Map();
  const jointMembrane: Map<number, number[][]> = new Map();   // F11 F22 F12 en los 4 joints (ITW)
  const analyzeOutputsElements: {
    bendingXX: Map<number, number>;
    bendingYY: Map<number, number>;
    bendingXY: Map<number, number>;
    membraneXX: Map<number, number>;
    membraneYY: Map<number, number>;
    membraneXY: Map<number, number>;
    tranverseShearX: Map<number, number>;
    tranverseShearY: Map<number, number>;
    vonMises: Map<number, number>;
  } = {
    bendingXX: new Map(),
    bendingYY: new Map(),
    bendingXY: new Map(),
    membraneXX: new Map(),
    membraneYY: new Map(),
    membraneXY: new Map(),
    tranverseShearX: new Map(),
    tranverseShearY: new Map(),
    vonMises: new Map(),
  };

  elements.forEach((e, i) => {
    const elmNodes = e.map((e) => nodes[e]);

    const dxGlobal = e.reduce(
      (a, b) => {
        const d = deformOutputs.deformations?.get(b);
        return a.concat(d ?? [0, 0, 0, 0, 0, 0]);
      },
      [] as number[]
    );

    if (e.length === 2) {
      // Frame element
      const T = getTransformationMatrix(
        elmNodes,
        elementInputs?.localAngles?.get(i) ?? 0
      );
      const dxLocal = multiply(T, dxGlobal);
      const kLocal = getLocalStiffnessMatrix(elmNodes, elementInputs, i);
      let fLocal = multiply(kLocal, dxLocal);

      // ── FUERZAS DE EMPOTRAMIENTO PERFECTO ──
      //
      // Los esfuerzos de una barra con carga EN EL VANO son
      //
      //     f = k*u + f_empotramiento
      //
      // y aqui solo se hacia `k*u`. La carga repartida entra al sistema como
      // fuerzas nodales equivalentes —eso ya estaba bien, y por eso los
      // DESPLAZAMIENTOS salian exactos— pero al recuperar el esfuerzo de la
      // barra faltaba el termino del vano entero.
      //
      // Medido en el peldano 1 de la escalera de validacion, viga de 5 m con
      // 20 kN/m: Hekatan daba V = 3.71 donde ETABS da 53.71 (faltaban los
      // wL/2 = 50) y M = 15.06 donde ETABS da 45.17 (faltaban los
      // wL^2/12 = 41.67). N, V3 y M2 cuadraban al cuarto decimal, porque esos
      // no tienen carga en su plano — la firma exacta de este fallo.
      //
      // Signo: la carga nodal EQUIVALENTE que se aplica a la estructura es
      // -f_empotramiento. Aqui se arma f_empotramiento directamente, o sea con
      // el signo contrario al del reparto a los nudos.
      const w = elementInputs?.frameLoads?.get(i);
      if (w && (w[0] || w[1] || w[2])) {
        const a = elmNodes[0], b = elmNodes[1];
        const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
        const L = Math.hypot(d[0], d[1], d[2]);
        if (L > 1e-9) {
          const t = [d[0] / L, d[1] / L, d[2] / L];
          const c = (L * L) / 12;
          // t x w: el eje del momento de empotramiento
          const txw = [t[1] * w[2] - t[2] * w[1],
                       t[2] * w[0] - t[0] * w[2],
                       t[0] * w[1] - t[1] * w[0]];
          const feGlobal = [
            -w[0] * L / 2, -w[1] * L / 2, -w[2] * L / 2,
            -c * txw[0], -c * txw[1], -c * txw[2],
            -w[0] * L / 2, -w[1] * L / 2, -w[2] * L / 2,
            +c * txw[0], +c * txw[1], +c * txw[2],
          ];
          const feLocal = multiply(T, feGlobal);
          fLocal = fLocal.map((v: number, k: number) => v + feLocal[k]);
        }
      }

      analyzeOutputs.normals!.set(i, [fLocal[0], fLocal[6]]);
      analyzeOutputs.shearsY!.set(i, [fLocal[1], fLocal[7]]);
      analyzeOutputs.shearsZ!.set(i, [fLocal[2], fLocal[8]]);
      analyzeOutputs.torsions!.set(i, [fLocal[3], fLocal[9]]);
      analyzeOutputs.bendingsY!.set(i, [fLocal[4], fLocal[10]]);
      analyzeOutputs.bendingsZ!.set(i, [fLocal[5], fLocal[11]]);
    } else if (e.length === 4) {
      // Q4 shell element — stress recovery at centroid
      const q4Results = computeQ4ShellStresses(elmNodes, dxGlobal, elementInputs, i);
      analyzeOutputsElements.membraneXX.set(i, q4Results.Nx);
      analyzeOutputsElements.membraneYY.set(i, q4Results.Ny);
      analyzeOutputsElements.membraneXY.set(i, q4Results.Nxy);
      analyzeOutputsElements.bendingXX.set(i, q4Results.Mx);
      analyzeOutputsElements.bendingYY.set(i, q4Results.My);
      analyzeOutputsElements.bendingXY.set(i, q4Results.Mxy);
      if (q4Results.Mj) jointBending.set(i, q4Results.Mj);
      if (q4Results.Nj) jointMembrane.set(i, q4Results.Nj);
      analyzeOutputsElements.tranverseShearX.set(i, q4Results.Qx);
      analyzeOutputsElements.tranverseShearY.set(i, q4Results.Qy);
      analyzeOutputsElements.vonMises.set(i, q4Results.vonMises);
    } else if (e.length === 3) {
      // CST triangle element
      const T = getTransformationMatrix(
        elmNodes,
        elementInputs?.localAngles?.get(i) ?? 0
      );
      const dxLocal = multiply(T, dxGlobal);

      const materialStiffness3x3Matrix = getMaterialStiffnessMatrix3x3(
        elementInputs,
        i
      );
      const linearFieldMatrix3x6 = getLinearFieldMatrix3x6(elmNodes);
      const displacmentMattrix6x2 = getDisplacementMatrix6x2(dxGlobal);
      const elementArea = getElementArea(elmNodes);

      const fLocal = multiply(
        1 / (2 * elementArea),
        multiply(
          multiply(materialStiffness3x3Matrix, linearFieldMatrix3x6),
          displacmentMattrix6x2
        )
      );

      const fGlobal = fLocal.toArray() as number[][];
      const thickness = elementInputs.thicknesses?.get(i) ?? 1;

      const Nx = fGlobal[0][0] * thickness;
      const Ny = fGlobal[1][0] * thickness;
      const Nxy = fGlobal[2][0] * thickness;

      const Mx = fGlobal[0][1] * (thickness ** 3 / 12);
      const My = fGlobal[1][1] * (thickness ** 3 / 12);
      const Mxy = fGlobal[2][1] * (thickness ** 3 / 12);

      analyzeOutputsElements.membraneXX.set(i, Nx);
      analyzeOutputsElements.membraneYY.set(i, Ny);
      analyzeOutputsElements.membraneXY.set(i, Nxy);
      analyzeOutputsElements.bendingXX.set(i, Mx);
      analyzeOutputsElements.bendingYY.set(i, My);
      analyzeOutputsElements.bendingXY.set(i, Mxy);
    }
  });

  const { nodeToCentroidNodesMap, nodeToCentroidElementIndiciesMap } =
    getCentroidsMaps(nodes, elements);

  // ── CORTANTE TRANSVERSAL POR EQUILIBRIO, en las placas KIRCHHOFF ─────────
  //
  // En Kirchhoff el gamma transversal es CERO por definicion, asi que
  // `Q = Ds x gamma` solo devuelve ruido numerico amplificado por Ds = 5/6·G·t
  // (medido: x59 contra la solucion de Navier). El cortante hay que sacarlo del
  // EQUILIBRIO de la placa, que es lo que hace ETABS en Shell-Thin — y por eso
  // su V13 cambia con la formulacion (154.7 en Thin contra 48.6 en Thick) con
  // los momentos casi iguales:
  //
  //     Qx = dMx/dx + dMxy/dy        Qy = dMy/dy + dMxy/dx
  //
  // ⚠️ El gradiente NO se puede sacar dentro del elemento: en un Q4 bilineal las
  // segundas derivadas puras son cero. Se reconstruye a nivel de MALLA, por
  // minimos cuadrados con los centros de los elementos VECINOS (los que
  // comparten una arista, o sea dos nudos). Es la reconstruccion de gradiente
  // de toda la vida, y aguanta mallas irregulares.
  {
    const esK = (i: number) =>
      ((elementInputs as any)?.plateFormulations?.get(i) ?? 0) === 1;
    const centro = new Map<number, number[]>();
    const nodosDe = new Map<number, number[]>();
    elements.forEach((e, i) => {
      if (e.length !== 4) return;
      const P = (e as number[]).map((n) => nodes[n]);
      centro.set(i, [0, 1, 2].map((k) => P.reduce((sm, q) => sm + q[k], 0) / 4));
      nodosDe.set(i, e as number[]);
    });
    if ([...nodosDe.keys()].some(esK)) {
      const elemsDeNudo = new Map<number, number[]>();
      for (const [i, ns] of nodosDe) {
        for (const n of ns) {
          const a = elemsDeNudo.get(n) ?? [];
          a.push(i);
          elemsDeNudo.set(n, a);
        }
      }
      for (const [i, ns] of nodosDe) {
        if (!esK(i)) continue;
        const comparte = new Map<number, number>();
        for (const n of ns) {
          for (const j of elemsDeNudo.get(n) ?? []) {
            if (j !== i) comparte.set(j, (comparte.get(j) ?? 0) + 1);
          }
        }
        const vec = [...comparte].filter(([, c]) => c >= 2).map(([j]) => j);
        if (vec.length < 2) continue;          // sin vecinos suficientes, se deja
        const ci = centro.get(i)!;
        const grad = (campo: Map<number, number>): [number, number] => {
          let a11 = 0, a12 = 0, a22 = 0, b1 = 0, b2 = 0;
          const Vi = campo.get(i) ?? 0;
          for (const j of vec) {
            const cj = centro.get(j)!;
            const dx = cj[0] - ci[0], dy = cj[1] - ci[1];
            const dV = (campo.get(j) ?? 0) - Vi;
            a11 += dx * dx; a12 += dx * dy; a22 += dy * dy;
            b1 += dx * dV;  b2 += dy * dV;
          }
          const det = a11 * a22 - a12 * a12;
          if (Math.abs(det) < 1e-12) return [0, 0];
          return [(b1 * a22 - b2 * a12) / det, (a11 * b2 - a12 * b1) / det];
        };
        const gMx = grad(analyzeOutputsElements.bendingXX);
        const gMy = grad(analyzeOutputsElements.bendingYY);
        const gMxy = grad(analyzeOutputsElements.bendingXY);
        analyzeOutputsElements.tranverseShearX.set(i, gMx[0] + gMxy[1]);
        analyzeOutputsElements.tranverseShearY.set(i, gMy[1] + gMxy[0]);
      }
    }
  }

  elements.forEach((element, elementIndex) => {
    if (element.length !== 3 && element.length !== 4) return;
    const nNodes = element.length;
    const membraneXXs: number[] = new Array(nNodes).fill(0);
    const membraneYYs: number[] = new Array(nNodes).fill(0);
    const membraneXYs: number[] = new Array(nNodes).fill(0);
    const bendingXXs: number[] = new Array(nNodes).fill(0);
    const bendingYYs: number[] = new Array(nNodes).fill(0);
    const bendingXYs: number[] = new Array(nNodes).fill(0);
    const shearXs: number[] = new Array(nNodes).fill(0);
    const shearYs: number[] = new Array(nNodes).fill(0);
    const vmStress: number[] = new Array(nNodes).fill(0);

    element.forEach((nodeIndex, pos) => {
      // Solo los vecinos que son CASCARA: getCentroidsMaps mete tambien las barras
      // que tocan el nudo, y una barra no tiene campo de cascara (aportaba un 0 a la
      // media: en un nudo losa-columna el momento salia diluido un 40 %, medido
      // contra ETABS el 8-sep-2026).
      const elementIndicies = (nodeToCentroidElementIndiciesMap.get(nodeIndex) || [])
        .filter((ei) => elements[ei].length === 3 || elements[ei].length === 4);

      const avgField = (field: Map<number, number>) =>
        mean(elementIndicies.map((ei) => field.get(ei) ?? 0));

      const avgJointM = (campo: number, centro: Map<number, number>) =>
        mean(elementIndicies.map((ei) => {
          const nj = jointMembrane.get(ei);
          const pos2 = nj ? elements[ei].indexOf(nodeIndex) : -1;
          return nj && pos2 >= 0 ? nj[pos2][campo] : (centro.get(ei) ?? 0);
        }));
      membraneXXs[pos] = avgJointM(0, analyzeOutputsElements.membraneXX);
      membraneYYs[pos] = avgJointM(1, analyzeOutputsElements.membraneYY);
      membraneXYs[pos] = avgJointM(2, analyzeOutputsElements.membraneXY);
      // Flexion: la media, en este nudo, del valor que cada elemento vecino
      // tiene EN SU ESQUINA (el joint de CSI), no de su centroide. Si un vecino
      // no trae joints (placa delgada, triangulo), aporta su centroide.
      const avgJoint = (campo: number, centro: Map<number, number>) =>
        mean(elementIndicies.map((ei) => {
          const mj = jointBending.get(ei);
          const pos2 = mj ? elements[ei].indexOf(nodeIndex) : -1;
          return mj && pos2 >= 0 ? mj[pos2][campo] : (centro.get(ei) ?? 0);
        }));
      bendingXXs[pos] = avgJoint(0, analyzeOutputsElements.bendingXX);
      bendingYYs[pos] = avgJoint(1, analyzeOutputsElements.bendingYY);
      bendingXYs[pos] = avgJoint(2, analyzeOutputsElements.bendingXY);
      shearXs[pos] = avgField(analyzeOutputsElements.tranverseShearX);
      shearYs[pos] = avgField(analyzeOutputsElements.tranverseShearY);
      vmStress[pos] = avgField(analyzeOutputsElements.vonMises);
    });

    analyzeOutputs.membraneXX!.set(elementIndex, membraneXXs);
    analyzeOutputs.membraneYY!.set(elementIndex, membraneYYs);
    analyzeOutputs.membraneXY!.set(elementIndex, membraneXYs);
    analyzeOutputs.bendingXX!.set(elementIndex, bendingXXs);
    analyzeOutputs.bendingYY!.set(elementIndex, bendingYYs);
    analyzeOutputs.bendingXY!.set(elementIndex, bendingXYs);
    // sin promediar: el centroide y los 4 joints tal cual salen del elemento
    const njE = jointMembrane.get(elementIndex);
    const centroM = (q: number, m: Map<number, number>) => njE ? njE.reduce((s, v) => s + v[q], 0) / njE.length : (m.get(elementIndex) ?? 0);
    (analyzeOutputs.membraneXXcentro ??= new Map()).set(elementIndex, centroM(0, analyzeOutputsElements.membraneXX));
    (analyzeOutputs.membraneYYcentro ??= new Map()).set(elementIndex, centroM(1, analyzeOutputsElements.membraneYY));
    (analyzeOutputs.membraneXYcentro ??= new Map()).set(elementIndex, centroM(2, analyzeOutputsElements.membraneXY));
    if (njE) {
      (analyzeOutputs.membraneXXjoint ??= new Map()).set(elementIndex, njE.map((m) => m[0]));
      (analyzeOutputs.membraneYYjoint ??= new Map()).set(elementIndex, njE.map((m) => m[1]));
      (analyzeOutputs.membraneXYjoint ??= new Map()).set(elementIndex, njE.map((m) => m[2]));
    }
    const mjE = jointBending.get(elementIndex);
    // el centroide: la media de los 4 joints cuando los hay (con la extrapolacion
    // bilineal desde Gauss es exactamente el valor en el centro del campo de CSI;
    // la B bilineal de arriba coincide en M11/M22 pero no en M12), si no el de la B bilineal
    const centroDe = (q: number, m: Map<number, number>) => mjE ? mjE.reduce((s, v) => s + v[q], 0) / mjE.length : (m.get(elementIndex) ?? 0);
    (analyzeOutputs.bendingXXcentro ??= new Map()).set(elementIndex, centroDe(0, analyzeOutputsElements.bendingXX));
    (analyzeOutputs.bendingYYcentro ??= new Map()).set(elementIndex, centroDe(1, analyzeOutputsElements.bendingYY));
    (analyzeOutputs.bendingXYcentro ??= new Map()).set(elementIndex, centroDe(2, analyzeOutputsElements.bendingXY));
    if (mjE) {
      (analyzeOutputs.bendingXXjoint ??= new Map()).set(elementIndex, mjE.map((m) => m[0]));
      (analyzeOutputs.bendingYYjoint ??= new Map()).set(elementIndex, mjE.map((m) => m[1]));
      (analyzeOutputs.bendingXYjoint ??= new Map()).set(elementIndex, mjE.map((m) => m[2]));
    }
    analyzeOutputs.tranverseShearX!.set(elementIndex, shearXs);
    analyzeOutputs.tranverseShearY!.set(elementIndex, shearYs);
    analyzeOutputs.vonMises!.set(elementIndex, vmStress);
  });

  return analyzeOutputs;
}

/**
 * Q4 Shell Stress Recovery — Isoparametric formulation at centroid
 * Projects 3D nodes to local shell plane, computes membrane forces (Nx,Ny,Nxy)
 * and bending moments (Mx,My,Mxy) using shape function derivatives at center.
 * Same local coordinate system as shellQ4.cpp (deform solver).
 */
function computeQ4ShellStresses(
  elmNodes: Node[],
  dxGlobal: number[],
  elementInputs: ElementInputs,
  elemIdx: number
): { Nx: number; Ny: number; Nxy: number; Mx: number; My: number; Mxy: number;
     Qx: number; Qy: number; vonMises: number; Mj: number[][] | null; Nj: number[][] | null } {
  const E = elementInputs.elasticities?.get(elemIdx) ?? 0;
  const nu = elementInputs.poissonsRatios?.get(elemIdx) ?? 0;
  const t = elementInputs.thicknesses?.get(elemIdx) ?? 1;

  // --- Project to local 2D shell frame (same as shellQ4.cpp) ---
  const p0 = elmNodes[0], p1 = elmNodes[1], p2 = elmNodes[2], p3 = elmNodes[3];
  const v01 = [p1[0]-p0[0], p1[1]-p0[1], p1[2]-p0[2]];
  const v32 = [p2[0]-p3[0], p2[1]-p3[1], p2[2]-p3[2]];
  let lxR = [v01[0]+v32[0], v01[1]+v32[1], v01[2]+v32[2]];
  let magLx = Math.sqrt(lxR[0]*lxR[0] + lxR[1]*lxR[1] + lxR[2]*lxR[2]);
  if (magLx < 1e-14) magLx = 1;
  let localX = [lxR[0]/magLx, lxR[1]/magLx, lxR[2]/magLx];

  const d02 = [p2[0]-p0[0], p2[1]-p0[1], p2[2]-p0[2]];
  const d13 = [p3[0]-p1[0], p3[1]-p1[1], p3[2]-p1[2]];
  let lzR = [
    d02[1]*d13[2] - d02[2]*d13[1],
    d02[2]*d13[0] - d02[0]*d13[2],
    d02[0]*d13[1] - d02[1]*d13[0]
  ];
  let magLz = Math.sqrt(lzR[0]*lzR[0] + lzR[1]*lzR[1] + lzR[2]*lzR[2]);
  if (magLz < 1e-14) magLz = 1;
  let localZ = [lzR[0]/magLz, lzR[1]/magLz, lzR[2]/magLz];

  let localY = [
    localZ[1]*localX[2] - localZ[2]*localX[1],
    localZ[2]*localX[0] - localZ[0]*localX[2],
    localZ[0]*localX[1] - localZ[1]*localX[0]
  ];
  let magLy = Math.sqrt(localY[0]*localY[0] + localY[1]*localY[1] + localY[2]*localY[2]);
  if (magLy < 1e-14) magLy = 1;
  localY = [localY[0]/magLy, localY[1]/magLy, localY[2]/magLy];

  // ── EJES LOCALES DE LA CASCARA: la regla de CSI, no el orden de los nudos ──
  //
  // Antes el eje 1 se sacaba de la direccion del primer lado (v01 + v32), o sea
  // que dependia de COMO estuviera numerado el elemento. Para reportar M11 y M22
  // eso no vale: ETABS malla sus losas y numera cada celda como le toca, asi que
  // dos celdas vecinas de la MISMA losa salian con el eje 1 girado 90 grados una
  // respecto de la otra. Medido en el peldano 2 de la escalera: la celda `19-1`
  // va de (5,0) a (5,1), o sea que su "eje 1" apuntaba a +Y mientras el de ETABS
  // apunta a +X, y M11 y M22 salian cruzados en unas celdas si y en otras no.
  // Ninguna hipotesis global lo arreglaba porque el giro cambiaba por elemento.
  //
  // La regla de CSI (Area Local Axes, angulo 0) es:
  //   · eje 3 = normal al elemento
  //   · si el elemento es HORIZONTAL (normal vertical), eje 1 = +X global
  //   · si no, eje 1 = horizontal = Z x n, y el eje 2 apunta hacia arriba
  //
  // Esto solo toca lo que se REPORTA. La rigidez la arma el C++ con su propio
  // marco, y el resultado del solver no depende de el.
  {
    const vertical = Math.abs(localZ[2]);
    if (vertical > 1 - 1e-6) {
      // elemento horizontal: eje 1 = +X global
      localX = [1, 0, 0];
    } else {
      // eje 1 horizontal, perpendicular a la normal: Z x n
      const h = [-localZ[1], localZ[0], 0];
      const mh = Math.hypot(h[0], h[1], h[2]) || 1;
      localX = [h[0]/mh, h[1]/mh, h[2]/mh];
    }
    // eje 2 = eje 3 x eje 1, y se reortogonaliza el 1 por si acaso
    localY = [
      localZ[1]*localX[2] - localZ[2]*localX[1],
      localZ[2]*localX[0] - localZ[0]*localX[2],
      localZ[0]*localX[1] - localZ[1]*localX[0]
    ];
    const my2 = Math.hypot(localY[0], localY[1], localY[2]) || 1;
    localY = [localY[0]/my2, localY[1]/my2, localY[2]/my2];
    localX = [
      localY[1]*localZ[2] - localY[2]*localZ[1],
      localY[2]*localZ[0] - localY[0]*localZ[2],
      localY[0]*localZ[1] - localY[1]*localZ[0]
    ];
  }

  const cx = 0.25*(p0[0]+p1[0]+p2[0]+p3[0]);
  const cy = 0.25*(p0[1]+p1[1]+p2[1]+p3[1]);
  const cz = 0.25*(p0[2]+p1[2]+p2[2]+p3[2]);

  // Local 2D coordinates
  const xl: number[] = [], yl: number[] = [];
  for (let n = 0; n < 4; n++) {
    const dx = elmNodes[n][0] - cx, dy = elmNodes[n][1] - cy, dz = elmNodes[n][2] - cz;
    xl.push(dx*localX[0] + dy*localX[1] + dz*localX[2]);
    yl.push(dx*localY[0] + dy*localY[1] + dz*localY[2]);
  }

  // --- Transform global displacements to local shell frame ---
  const R = [localX, localY, localZ];
  const uLocal: number[] = new Array(24).fill(0);
  for (let n = 0; n < 4; n++) {
    const gi = n * 6;
    const li = n * 6;
    for (let r = 0; r < 3; r++) {
      uLocal[li + r] = R[r][0]*dxGlobal[gi] + R[r][1]*dxGlobal[gi+1] + R[r][2]*dxGlobal[gi+2];
    }
    for (let r = 0; r < 3; r++) {
      uLocal[li + 3 + r] = R[r][0]*dxGlobal[gi+3] + R[r][1]*dxGlobal[gi+4] + R[r][2]*dxGlobal[gi+5];
    }
  }

  // --- Material matrices ---
  const Dfactor = E / (1 - nu*nu);
  const Dm = [
    [Dfactor * t, Dfactor * nu * t, 0],
    [Dfactor * nu * t, Dfactor * t, 0],
    [0, 0, Dfactor * (1-nu)/2 * t]
  ];
  const t3_12 = t*t*t / 12;
  const Db = [
    [Dfactor * t3_12, Dfactor * nu * t3_12, 0],
    [Dfactor * nu * t3_12, Dfactor * t3_12, 0],
    [0, 0, Dfactor * (1-nu)/2 * t3_12]
  ];

  // --- Shape function derivatives at centroid (xi=0, eta=0) ---
  const dNdxi  = [-0.25, 0.25, 0.25, -0.25];
  const dNdeta = [-0.25, -0.25, 0.25, 0.25];

  let J00 = 0, J01 = 0, J10 = 0, J11 = 0;
  for (let n = 0; n < 4; n++) {
    J00 += dNdxi[n] * xl[n]; J01 += dNdxi[n] * yl[n];
    J10 += dNdeta[n] * xl[n]; J11 += dNdeta[n] * yl[n];
  }
  const detJ = J00*J11 - J01*J10;
  if (Math.abs(detJ) < 1e-20) {
    return { Nx: 0, Ny: 0, Nxy: 0, Mx: 0, My: 0, Mxy: 0, Qx: 0, Qy: 0, vonMises: 0, Mj: null, Nj: null };
  }
  const invJ00 = J11/detJ, invJ01 = -J01/detJ, invJ10 = -J10/detJ, invJ11 = J00/detJ;

  const dNdx: number[] = [], dNdy: number[] = [];
  for (let n = 0; n < 4; n++) {
    dNdx.push(invJ00*dNdxi[n] + invJ01*dNdeta[n]);
    dNdy.push(invJ10*dNdxi[n] + invJ11*dNdeta[n]);
  }

  // --- Membrane strains ---
  let epsXX = 0, epsYY = 0, gammaXY = 0;
  for (let n = 0; n < 4; n++) {
    const u = uLocal[n*6 + 0];
    const v = uLocal[n*6 + 1];
    epsXX += dNdx[n] * u;
    epsYY += dNdy[n] * v;
    gammaXY += dNdy[n] * u + dNdx[n] * v;
  }

  const Nx = Dm[0][0]*epsXX + Dm[0][1]*epsYY;
  const Ny = Dm[1][0]*epsXX + Dm[1][1]*epsYY;
  const Nxy = Dm[2][2]*gammaXY;

  // --- Curvaturas de flexion (Mindlin) ---
  //
  // theta_x es el giro ALREDEDOR DEL EJE x y theta_y alrededor del y, que es lo
  // que devuelve el solver. Con eso:
  //
  //     dw/dx =  theta_y        dw/dy = -theta_x
  //
  //     kappaXX =  d(theta_y)/dx
  //     kappaYY = -d(theta_x)/dy
  //     kappaXY =  d(theta_y)/dy - d(theta_x)/dx      (= 2*d²w/dxdy)
  //
  // ANTES esto usaba `-d(theta_x)/dx` y `-d(theta_y)/dy`, o sea las derivadas
  // CRUZADAS. Con los giros de verdad eso vale +w,xy y -w,xy: dos numeros
  // iguales y opuestos, y nulos en el centro de una placa por simetria. Es
  // exactamente lo que salia — en la cascara de esquina M11 = +4.76 y
  // M22 = -4.76, y en el centro las dos CERO donde la serie de Navier da -7.07.
  // Se estaba midiendo la torsion de la placa y llamandola flexion.
  //
  // La FLECHA siempre estuvo bien (0.700 mm contra 0.681 de Navier, la
  // diferencia es el cortante de Mindlin): el fallo vivia solo en la
  // recuperacion de esfuerzos, no en el solver.
  let kappaXX = 0, kappaYY = 0, kappaXY = 0;
  for (let n = 0; n < 4; n++) {
    const thetaX = uLocal[n*6 + 3];
    const thetaY = uLocal[n*6 + 4];
    kappaXX +=  dNdx[n] * thetaY;
    kappaYY += -dNdy[n] * thetaX;
    kappaXY +=  dNdy[n] * thetaY - dNdx[n] * thetaX;
  }

  // ── SIGNO DE CSI (8-sep-2026) ──
  //
  // Medido contra AreaForceShell de ETABS 22 y SAP2000 24 en las plantillas con
  // losa (3600 joints por plantilla): en el centro del elemento este campo es
  // EXACTAMENTE el de CSI con el signo cambiado (pendiente -1.000000). El
  // convenio de CSI es el de toda la vida (M11 positivo = traccion abajo: el
  // vano de una losa bajo gravedad sale positivo y la columna negativa), asi
  // que se reporta con ese signo y no con el de la curvatura del solver. Hasta
  // hoy el colormap salia al reves que ETABS.
  const SIGNO_CSI = -1;
  const Mx = SIGNO_CSI * (Db[0][0]*kappaXX + Db[0][1]*kappaYY);
  const My = SIGNO_CSI * (Db[1][0]*kappaXX + Db[1][1]*kappaYY);
  const Mxy = SIGNO_CSI * (Db[2][2]*kappaXY);

  // ── FUERZAS DE MEMBRANA EN LOS JOINTS (ITW tipo 12, la membrana de CSI) ──
  // Allman + burbuja recuperada + proyección del drilling, Gauss 2×2 extrapolado
  // (utils/itwJoints.ts). Signo: tracción positiva, el de CSI.
  let Nj: number[][] | null = null;
  if (Math.abs(detJ) > 1e-20) {
    const u12m: number[] = [];
    for (let n = 0; n < 4; n++) u12m.push(uLocal[n*6 + 0], uLocal[n*6 + 1], uLocal[n*6 + 5]);
    const tipoDrill = (elementInputs as any)?.drillingTypes?.get(elemIdx) ?? 12;
    const gammaFac = (elementInputs as any)?.drillingPenaltyScales?.get(elemIdx) ?? 0.4;
    const mm = (elementInputs as any)?.membraneModifiers?.get(elemIdx);
    const smod = (elementInputs as any)?.shellModifiers?.get(elemIdx);
    const mod = Array.isArray(smod) && smod.length >= 3 ? [smod[0], smod[1], smod[2]]
              : (typeof mm === "number" && mm !== 1 ? [mm, mm, mm] : null);
    try {
      Nj = itwJointForces(xl, yl, u12m, E, nu, t, { tipo: tipoDrill, gammaFac, mod });
      if (Nj && Nj.some((m) => m.some((v) => !Number.isFinite(v)))) Nj = null;
    } catch { Nj = null; }
  }

  // ── MOMENTOS EN LOS JOINTS (Shell-Thick de CSI, internos recuperados) ──
  //
  // El centroide con la B bilineal de arriba cuadra con CSI a 1e-6, pero
  // llevar ese unico numero a los nudos promediando centroides vecinos borra
  // el pico sobre la columna (4.2 donde ETABS lista 57.8). Con los 10 gdl
  // internos del elemento recuperados y la curvatura evaluada en cada esquina
  // sale 41.4 en ese nudo y 0.3 % en campo suave. Solo en la placa gruesa
  // (formulacion 0): la delgada (DKQ) tiene otra B y sigue por centroide.
  // La placa DELGADA (formulacion 1, el Shell-Thin = DKQ) tiene su propia B
  // (utils/dkqJoints.ts, espejo de plateDKQ.h) y se evalua directamente en las
  // esquinas: es el elemento de las plantillas (losa Thin por defecto).
  let Mj: number[][] | null = null;
  const esPlacaGruesa = ((elementInputs as any)?.plateFormulations?.get(elemIdx) ?? 0) !== 1;
  if (Math.abs(detJ) > 1e-20) {
    const u12: number[] = [];
    for (let n = 0; n < 4; n++) u12.push(uLocal[n*6 + 2], uLocal[n*6 + 3], uLocal[n*6 + 4]);
    try {
      // DKQ: en Gauss 2x2 y extrapolado bilinealmente a las esquinas. Medido el
      // 8-sep-2026 contra AreaForceShell en las 4 plantillas con losa Thin:
      // = ETABS 22 a 0.0000 % joint a joint (3600 joints por plantilla) y = SAP2000
      // 24 a 0.9 % (que es lo que SAP y ETABS difieren entre si). Evaluado
      // directamente en las esquinas el M12 de los elementos de esquina se iba
      // un 26 %: CSI extrapola desde Gauss, no evalua en el nudo.
      const modoDKQ = (globalThis as any).__hekatanDkqJoints ?? "gauss";
      Mj = (esPlacaGruesa ? csiThickJointMoments(xl, yl, u12, E, nu, t)
                          : dkqJointMoments(xl, yl, u12, E, nu, t, modoDKQ))
             .map((m) => m.map((v) => SIGNO_CSI * v));
      if (Mj.some((m) => m.some((v) => !Number.isFinite(v)))) Mj = null;
    } catch { Mj = null; }
  }

  // --- Transverse shear (Mindlin) ---
  //
  // ⚠️ OJO: ESTO SOLO VALE EN MINDLIN, Y HOY SE USA TAMBIEN EN KIRCHHOFF.
  //
  // `Q = Ds x gamma` es la ley constitutiva de Mindlin. En KIRCHHOFF el gamma
  // es CERO por definicion —lo dice el comentario de abajo—, asi que lo que
  // queda es RUIDO NUMERICO, y multiplicado por Ds = 5/6 x G x t (1.39e6 en una
  // placa de 20 cm) sale disparado.
  //
  // Medido el 30-ago-2026 con la placa 4x4 apoyada, t = 0.20, q = -10, que
  // tiene solucion analitica:
  //
  //     M11 centro    6.767   contra 7.66 de Navier      OK (malla 8x8)
  //     V13 borde   798.091   contra 13.52 teorico       x59
  //
  // Y por eso Hekatan da casi lo MISMO en thin y en thick (10388 y 10196),
  // mientras ETABS los distingue: 154.7 en Shell-Thin contra 48.6 en
  // Shell-Thick. Esa es su firma — en Thin, donde no hay gamma, ETABS saca el
  // cortante por EQUILIBRIO:
  //
  //     Qx = dMx/dx + dMxy/dy      Qy = dMy/dy + dMxy/dx
  //
  // Mientras esto no se arregle, `tranverseShearX/Y` NO es comparable con el
  // V13/V23 de ETABS ni sirve para dimensionar a cortante. Los momentos si:
  // estan validados contra Navier al 2 % (`placa-momentos-navier`).
  // shellQ4.cpp: γxz = dw/dx - θx_solver, donde θx_solver = -d[3]
  // → γxz = dw/dx - (-d[3]) = dw/dx + d[3]
  // En thin plate ideal: γxz = 0 → d[3] = -dw/dx ✓
  // Por construccion el γ residual reportado da Qx = Ds * γ.
  const kappa_s = 5.0/6.0;
  const G = E / (2*(1+nu));
  const Ds = kappa_s * G * t;
  let gammaXZ = 0, gammaYZ = 0;
  const N_vals = [0.25, 0.25, 0.25, 0.25];
  for (let n = 0; n < 4; n++) {
    const w = uLocal[n*6 + 2];
    const thetaX = uLocal[n*6 + 3];   // = -dw/dx en convencion solver
    const thetaY = uLocal[n*6 + 4];   // = -dw/dy en convencion solver
    gammaXZ += dNdx[n] * w + N_vals[n] * thetaX;  // dw/dx + thetaX = γxz
    gammaYZ += dNdy[n] * w + N_vals[n] * thetaY;  // dw/dy + thetaY = γyz
  }
  const Qx = Ds * gammaXZ;
  const Qy = Ds * gammaYZ;

  // --- Von Mises stress (max of top/bottom fiber) ---
  const sigXX_top = Nx/t + 6*Mx/(t*t);
  const sigYY_top = Ny/t + 6*My/(t*t);
  const sigXY_top = Nxy/t + 6*Mxy/(t*t);
  const vonMises_top = Math.sqrt(sigXX_top*sigXX_top - sigXX_top*sigYY_top + sigYY_top*sigYY_top + 3*sigXY_top*sigXY_top);

  const sigXX_bot = Nx/t - 6*Mx/(t*t);
  const sigYY_bot = Ny/t - 6*My/(t*t);
  const sigXY_bot = Nxy/t - 6*Mxy/(t*t);
  const vonMises_bot = Math.sqrt(sigXX_bot*sigXX_bot - sigXX_bot*sigYY_bot + sigYY_bot*sigYY_bot + 3*sigXY_bot*sigXY_bot);

  const vonMises = Math.max(vonMises_top, vonMises_bot);

  return { Nx, Ny, Nxy, Mx, My, Mxy, Qx, Qy, vonMises, Mj, Nj };
}

function getMaterialStiffnessMatrix3x3(
  elementInputs: ElementInputs,
  index: number
): Matrix {
  const elasticityX = elementInputs.elasticities?.get(index) ?? 0;
  const elasticityY = elementInputs.elasticitiesOrthogonal?.get(index) ?? 0;
  const poissonRatio = elementInputs.poissonsRatios?.get(index) ?? 0;
  const shearModulus = elementInputs.shearModuli?.get(index) ?? 0;
  const thickness = elementInputs.thicknesses?.get(index) ?? 0;

  const isOrthotropic = elasticityY > 0;
  return isOrthotropic
    ? getOrthotropicInPlaneConstitutiveMatrix(
        elasticityX,
        elasticityY,
        shearModulus,
        poissonRatio
      )
    : getIsotropicInPlaneConstitutiveMatrix(elasticityX, poissonRatio);
}

function getLinearFieldMatrix3x6(nodeCoordinates: Node[]): Matrix {
  const [x1, y1] = nodeCoordinates[0];
  const [x2, y2] = nodeCoordinates[1];
  const [x3, y3] = nodeCoordinates[2];

  const y23 = y2 - y3;
  const y31 = y3 - y1;
  const y12 = y1 - y2;

  const x32 = x3 - x2;
  const x13 = x1 - x3;
  const x21 = x2 - x1;

  return matrix([
    [y23, y31, y12, 0, 0, 0],
    [0, 0, 0, x32, x13, x21],
    [x32, x13, x21, y23, y31, y12],
  ]);
}

function getDisplacementMatrix6x2(dxLocal: number[]): Matrix {
  const [u1, u2, u3] = [dxLocal[0], dxLocal[6], dxLocal[12]];
  const [v1, v2, v3] = [dxLocal[1], dxLocal[7], dxLocal[13]];
  const [theta_y1, theta_y2, theta_y3] = [dxLocal[4], dxLocal[10], dxLocal[16]];
  const [theta_x1, theta_x2, theta_x3] = [dxLocal[3], dxLocal[9], dxLocal[15]];
  return matrix([
    [u1, -theta_y1],
    [u2, -theta_y2],
    [u3, -theta_y3],
    [v1, theta_x1],
    [v2, theta_x2],
    [v3, theta_x3],
  ]);
}

function getElementArea(nodeCoordinates: Node[]) {
  const [x1, y1] = nodeCoordinates[0];
  const [x2, y2] = nodeCoordinates[1];
  const [x3, y3] = nodeCoordinates[2];

  const x21 = x2 - x1;
  const x31 = x3 - x1;
  const y31 = y3 - y1;
  const y12 = y1 - y2;

  return 0.5 * (x21 * y31 - x31 * -y12);
}

function getCentroidsMaps(
  nodes: Node[],
  elements: Element[]
): {
  nodeToCentroidNodesMap: Map<number, Node[]>;
  nodeToCentroidElementIndiciesMap: Map<number, number[]>;
} {
  const nodeToCentroidNodesMap: Map<number, Node[]> = new Map();
  const nodeToCentroidElementIndiciesMap: Map<number, number[]> = new Map();
  elements.forEach((element, elementIndex) => {
    const elmNodes = element.map((index) => nodes[index]);
    const centroidNode = getCentroidFromNodes(elmNodes) as Node;
    element.forEach((nodeIndex) => {
      if (!nodeToCentroidNodesMap.has(nodeIndex)) {
        nodeToCentroidNodesMap.set(nodeIndex, []);
      }
      nodeToCentroidNodesMap.get(nodeIndex)?.push(centroidNode);

      if (!nodeToCentroidElementIndiciesMap.has(nodeIndex)) {
        nodeToCentroidElementIndiciesMap.set(nodeIndex, []);
      }
      nodeToCentroidElementIndiciesMap.get(nodeIndex)?.push(elementIndex);
    });
  });
  return {
    nodeToCentroidNodesMap: nodeToCentroidNodesMap,
    nodeToCentroidElementIndiciesMap: nodeToCentroidElementIndiciesMap,
  };
}

function getCentroidFromNodes(
  nodeCoordinates: Node[]
): [number, number, number] {
  const x =
    nodeCoordinates.reduce((sum, n) => sum + n[0], 0) / nodeCoordinates.length;
  const y =
    nodeCoordinates.reduce((sum, n) => sum + n[1], 0) / nodeCoordinates.length;
  const z =
    nodeCoordinates.reduce((sum, n) => sum + n[2], 0) / nodeCoordinates.length;
  return [x, y, z];
}

function getLinearlyInterpolatedValueInTriangle(
  targetNode: Node,
  n1: Node,
  n2: Node,
  n3: Node,
  f1: number,
  f2: number,
  f3: number
): number {
  const [x, y] = targetNode;
  const [x1, y1] = n1;
  const [x2, y2] = n2;
  const [x3, y3] = n3;

  const denominator = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
  const lambda1 = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / denominator;
  const lambda2 = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / denominator;
  const lambda3 = 1 - lambda1 - lambda2;

  return lambda1 * f1 + lambda2 * f2 + lambda3 * f3;
}
