import * as THREE from "three";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import van, { State } from "vanjs-core";
import { Mesh, Element, Node } from "hekatan-fem";
import { Settings } from "../settings/getSettings";
import { getTheme, onThemeChange } from "../../theme";

// Colores por tipo (activos cuando settings.colorByType=true)
// Pensados para alto contraste sobre fondo oscuro Y claro.
const COLOR_COLUMN  = new THREE.Color(0xFF8800);  // naranja — frames verticales
const COLOR_BEAM    = new THREE.Color(0x00CCCC);  // cyan — frames horizontales
const COLOR_ZAPATA  = new THREE.Color(0x00CC44);  // verde — shells de cimentación (z≤0)
const COLOR_LOSA    = new THREE.Color(0x3388FF);  // azul — shells de losa (z>0)
const COLOR_TRI     = new THREE.Color(0xFFCC00);  // amarillo — elementos triangulares

// Clasificación por geometría
function isVerticalFrame(n1: Node, n2: Node): boolean {
  const dx = Math.abs(n2[0] - n1[0]);
  const dy = Math.abs(n2[1] - n1[1]);
  const dz = Math.abs(n2[2] - n1[2]);
  return (dz > dx && dz > dy) || (dy > dx && dy > dz);
}
function isVerticalQ4(n0: Node, n1: Node, n2: Node, n3: Node): boolean {
  const v01 = [n1[0]-n0[0], n1[1]-n0[1], n1[2]-n0[2]];
  const v03 = [n3[0]-n0[0], n3[1]-n0[1], n3[2]-n0[2]];
  const nx = v01[1]*v03[2] - v01[2]*v03[1];
  const ny = v01[2]*v03[0] - v01[0]*v03[2];
  const nz = v01[0]*v03[1] - v01[1]*v03[0];
  const len = Math.sqrt(nx*nx + ny*ny + nz*nz);
  if (len < 1e-12) return false;
  return Math.abs(nz / len) < 0.5;
}
function isFooting(zAvg: number): boolean {
  // Cimentación: shell con centro a z ≤ 0 (o muy cerca). Convención Hekatan:
  // los slabs de zapatas se sitúan en z=0 o por debajo (pedestales subiendo).
  // Tolerancia ε para tratar shells exactamente en z=0 (zapatas planas) como
  // cimentación.
  return zAvg <= 1e-3;
}


/**
 * Deformada CURVA de una barra, como la dibuja ETABS con «Cubic Curve».
 *
 * Un nudo de portico no solo se desplaza: tambien GIRA. Con dos nudos hay
 * cuatro datos por plano — desplazamiento y giro en cada extremo — y eso
 * determina un polinomio de TERCER grado, que es la forma que toma una viga
 * elastica. No es una aproximacion para que quede lindo: son las funciones de
 * forma de Hermite, las MISMAS con las que el FEM armo la matriz de rigidez.
 *
 *   N1 = 1 - 3s^2 + 2s^3        N3 = 3s^2 - 2s^3
 *   N2 = L(s - 2s^2 + s^3)      N4 = L(-s^2 + s^3)
 *
 * Uniendo los extremos con una RECTA la columna sale derecha aunque los giros
 * de sus nudos digan otra cosa: se pierde justo lo que se quiere ver.
 */
function curvaHermite(
  pi: Node, pj: Node,
  di: number[] | undefined, dj: number[] | undefined,
  sXY: number, sZ: number, n = 8
): number[][] {
  const P = (p: Node, d: number[] | undefined): [number, number, number] => {
    const u = d ?? [0, 0, 0];
    return [p[0] + (u[0] || 0) * sXY,
            p[1] + (u[1] || 0) * sXY,
            p[2] + (u[2] || 0) * sZ];
  };
  const A = P(pi, di), B = P(pj, dj);
  const rotI = di && di.length >= 6 ? [di[3], di[4], di[5]] : null;
  const rotJ = dj && dj.length >= 6 ? [dj[3], dj[4], dj[5]] : null;
  if (!rotI && !rotJ) return [A, B];          // sin giros no hay curva

  // eje local x de la barra SIN deformar (la curva se monta sobre el)
  const ex = [pj[0] - pi[0], pj[1] - pi[1], pj[2] - pi[2]];
  const L = Math.hypot(ex[0], ex[1], ex[2]);
  if (L < 1e-9) return [A, B];
  ex[0] /= L; ex[1] /= L; ex[2] /= L;
  // dos perpendiculares cualesquiera, estables para barras verticales
  const ref: [number, number, number] =
    Math.abs(ex[2]) > 0.98 ? [0, 1, 0] : [0, 0, 1];
  const cross = (a: number[], b: number[]) =>
    [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  let ey = cross(ref, ex);
  const ny = Math.hypot(ey[0], ey[1], ey[2]) || 1;
  ey = [ey[0] / ny, ey[1] / ny, ey[2] / ny];
  const ez = cross(ex, ey);

  const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const desp = (d: number[] | undefined) => {
    const u = d ?? [0, 0, 0];
    return [(u[0] || 0) * sXY, (u[1] || 0) * sXY, (u[2] || 0) * sZ];
  };
  const ui = desp(di), uj = desp(dj);
  // componentes transversales y giros alrededor de los ejes perpendiculares
  const vI = dot(ui, ey), vJ = dot(uj, ey);
  const wI = dot(ui, ez), wJ = dot(uj, ez);
  const tzI = rotI ? dot(rotI, ez) * sXY : 0;
  const tzJ = rotJ ? dot(rotJ, ez) * sXY : 0;
  const tyI = rotI ? dot(rotI, ey) * sXY : 0;
  const tyJ = rotJ ? dot(rotJ, ey) * sXY : 0;
  const aI = dot(ui, ex), aJ = dot(uj, ex);       // axial: va lineal

  const pts: number[][] = [];
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    const N1 = 1 - 3 * t * t + 2 * t * t * t;
    const N2 = L * (t - 2 * t * t + t * t * t);
    const N3 = 3 * t * t - 2 * t * t * t;
    const N4 = L * (-t * t + t * t * t);
    const v = N1 * vI + N2 * tzI + N3 * vJ + N4 * tzJ;   // plano x-y:  v' =  θz
    const w = N1 * wI - N2 * tyI + N3 * wJ - N4 * tyJ;   // plano x-z:  w' = -θy
    const a = aI + (aJ - aI) * t;
    const base = [pi[0] + ex[0] * (t * L + a),
                  pi[1] + ex[1] * (t * L + a),
                  pi[2] + ex[2] * (t * L + a)];
    pts.push([base[0] + ey[0] * v + ez[0] * w,
              base[1] + ey[1] * v + ez[1] * w,
              base[2] + ey[2] * v + ez[2] * w]);
  }
  return pts;
}

export function elements(
  mesh: Mesh,
  settings: Settings,
  derivedNodes: State<Node[]>
): THREE.Group {
  const t = getTheme();
  const group = new THREE.Group();

  // Wireframe lines (delimitación visual entre sólidos H8 / áreas Q4)
  const lines = new THREE.LineSegments(
    new THREE.BufferGeometry(),
    // depthTest:false + renderOrder 3: la barra se pinta ENCIMA de la rejilla y de sus ejes.
    // Sin esto, un cordón dibujado en z = 0 caía justo sobre el eje X rojo y no se veía
    // (Jorge, Tutorial 9: «la línea inferior no se ve nada de nada»).
    new THREE.LineBasicMaterial({ color: t.elementLine, vertexColors: false, depthTest: false, transparent: true, opacity: 1 })
  );
  onThemeChange((_n, c) => { lines.material.color.setHex(c.elementLine); });
  lines.frustumCulled = false;
  // Render order alto + sin polygon offset → líneas siempre encima de cualquier
  // fill (incluyendo colormap) sin Z-fighting (las líneas son 1D, no compiten
  // por píxeles con triángulos rellenos).
  lines.renderOrder = 3;
  group.add(lines);

  // ── La MISMA línea, gruesa ────────────────────────────────────────────────
  // Jorge (19-sep-2026, tutoriales): «no se ve ninguna línea». WebGL pinta un
  // LineBasicMaterial SIEMPRE a 1 px (ignora `linewidth`): una barra blanca de 1 px
  // sobre fondo oscuro se funde al bajar el vídeo a 1280 y más en el panel de
  // tutoriales. Encima va un LineSegments2 (triángulos con ancho en píxeles de
  // pantalla) con la misma geometría y colores. La línea fina se queda debajo para
  // lo que ya la usaba; esta no se raycastea.
  const ANCHO_LINEA_PX = 2.2;
  const fatMat = new LineMaterial({
    color: t.elementLine, linewidth: ANCHO_LINEA_PX, worldUnits: false,
    depthTest: false, transparent: true, opacity: 1, vertexColors: false,
  });
  onThemeChange((_n, c) => { fatMat.color.setHex(c.elementLine); });
  const fat = new LineSegments2(new LineSegmentsGeometry(), fatMat);
  fat.frustumCulled = false;
  fat.renderOrder = 3;
  fat.raycast = () => {};                         // la selección sigue usando la fina
  fat.name = "__hekatan_element_lines_fat";
  // la resolución en CADA fotograma: así el grosor sigue bien al redimensionar
  const tam = new THREE.Vector2();
  fat.onBeforeRender = (renderer) => { renderer.getSize(tam); fatMat.resolution.set(tam.x, tam.y); };
  group.add(fat);
  (group as any).__disposeFat = () => { fat.geometry.dispose(); fatMat.dispose(); };

  // Solid faces for shell elements (Q4 = 4 nodes, CST = 3 nodes)
  // Uses vertex colors to differentiate walls (vertical) vs slabs (horizontal)
  const shellMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: t.shellOpacity,
    side: THREE.DoubleSide,
    depthWrite: false,
    // ── Polygon offset POSITIVO: empuja el shellMesh LEVÍSIMAMENTE hacia
    // ATRÁS en profundidad, evitando Z-fighting con el colormap (que ocupa
    // los mismos planos Q4). Patrón estándar Three.js: fill atrás, wireframe
    // adelante. Esto elimina los puntitos pixelados que aparecían cuando
    // colormap y shellMesh peleaban por el z-buffer.
    polygonOffset: true,
    polygonOffsetFactor: 1.0,
    polygonOffsetUnits: 1.0,
  });
  const shellMesh = new THREE.Mesh(new THREE.BufferGeometry(), shellMat);
  shellMesh.frustumCulled = false;
  // Marcar para que setupShellHoverTooltip filtre SOLO esto y no cilindros de
  // frames (que tienen muchos vertices y pueden engañar al raycaster).
  shellMesh.userData.isShellArea = true;
  shellMesh.name = "__hekatan_shell_area";
  group.add(shellMesh);

  // Colors from theme (mutable — updated on theme change)
  let wallColor = new THREE.Color(t.shellWall);
  let slabColor = new THREE.Color(t.shellSlab);
  let triColor  = new THREE.Color(t.shellTri);

  // React to theme changes
  onThemeChange((_n, c) => {
    wallColor = new THREE.Color(c.shellWall);
    slabColor = new THREE.Color(c.shellSlab);
    triColor  = new THREE.Color(c.shellTri);
    shellMat.opacity = c.shellOpacity;
    shellMat.needsUpdate = true;
  });

  // on nodes, elements, deformedShape, y todos los toggles de tipo → update
  van.derive(() => {
    settings.deformedShape.val;
    settings.elemColumns.val;
    settings.elemBeams.val;
    settings.elemFrames?.val;
    settings.elemZapatas?.val;
    settings.elemLosas?.val;
    settings.colorByType?.val;

    if (!settings.elements.val) return;

    const showFrames  = settings.elemFrames  ? settings.elemFrames.rawVal  : true;
    const showCols    = settings.elemColumns.rawVal;
    const showBeams   = settings.elemBeams.rawVal;
    const showZapatas = settings.elemZapatas ? settings.elemZapatas.rawVal : true;
    const showLosas   = settings.elemLosas   ? settings.elemLosas.rawVal   : true;
    const colorByType = settings.colorByType ? settings.colorByType.rawVal : false;
    const nodes = derivedNodes.val;
    const elems = mesh.elements?.val || [];

    // Helper: para cada elemento, decide si se muestra según los toggles.
    const showElement = (e: Element): boolean => {
      if (e.length === 2) {
        // Frame: filtrar por toggle padre Frames + sub-toggle Col/Beam
        if (!showFrames) return false;
        const n1 = nodes[e[0]], n2 = nodes[e[1]];
        if (!n1 || !n2) return true;
        const isCol = isVerticalFrame(n1, n2);
        return isCol ? showCols : showBeams;
      }
      if (e.length === 4) {
        // Q4 shell: filtrar por Zapata (z≤0) vs Losa (z>0)
        const ns = e.map(i => nodes[i]).filter(Boolean) as Node[];
        if (ns.length < 4) return true;
        const zAvg = (ns[0][2] + ns[1][2] + ns[2][2] + ns[3][2]) / 4;
        return isFooting(zAvg) ? showZapatas : showLosas;
      }
      if (e.length === 3) {
        // Triangle (CST): tratar como losa o zapata según z
        const ns = e.map(i => nodes[i]).filter(Boolean) as Node[];
        if (ns.length < 3) return true;
        const zAvg = (ns[0][2] + ns[1][2] + ns[2][2]) / 3;
        return isFooting(zAvg) ? showZapatas : showLosas;
      }
      return true;
    };

    // Wireframe buffer + colores por edge (cuando colorByType=ON)
    const wireVerts: number[] = [];
    const wireCols: number[] = [];
    // Solo las BARRAS van gruesas: los bordes de cáscara y sólido siguen finos, que
    // en una malla densa (Allianz, 480 paños) gruesos tapaban el colormap.
    const fatVerts: number[] = [];
    const fatCols: number[] = [];
    for (const e of elems) {
      const iv = wireVerts.length, ic = wireCols.length;
      try {
      if (!showElement(e)) continue;
      let edgeColor: THREE.Color | null = null;
      if (colorByType) {
        if (e.length === 2) {
          const n1 = nodes[e[0]], n2 = nodes[e[1]];
          if (n1 && n2) edgeColor = isVerticalFrame(n1, n2) ? COLOR_COLUMN : COLOR_BEAM;
        } else if (e.length === 4) {
          const ns = e.map(i => nodes[i]).filter(Boolean) as Node[];
          if (ns.length === 4) {
            const zAvg = (ns[0][2] + ns[1][2] + ns[2][2] + ns[3][2]) / 4;
            edgeColor = isFooting(zAvg) ? COLOR_ZAPATA : COLOR_LOSA;
          }
        } else if (e.length === 3) {
          edgeColor = COLOR_TRI;
        }
      }
      // BARRAS con la deformada encendida: se dibujan CURVAS (Hermite), como
      // el «Cubic Curve» de ETABS. Con una recta entre los extremos la columna
      // sale derecha aunque sus nudos hayan girado.
      if (e.length === 2 && settings.deformedShape.val) {
        const orig = mesh.nodes?.val ?? [];
        const defs = mesh.deformOutputs?.val?.deformations;
        const pi = orig[e[0]], pj = orig[e[1]];
        if (pi && pj && defs) {
          const sXY = Number.isFinite(settings.deformScale.val)
            ? settings.deformScale.val : 1;
          const sZ = sXY * (Number.isFinite(settings.deformScaleZ.val)
            ? settings.deformScaleZ.val : 1);
          const pts = curvaHermite(pi, pj, defs.get(e[0]), defs.get(e[1]),
                                   sXY, sZ);
          for (let k = 0; k < pts.length - 1; k++) {
            wireVerts.push(...pts[k], ...pts[k + 1]);
            if (colorByType && edgeColor) {
              wireCols.push(edgeColor.r, edgeColor.g, edgeColor.b);
              wireCols.push(edgeColor.r, edgeColor.g, edgeColor.b);
            }
          }
          continue;
        }
      }
      // BARRAS durante la animación modal: el animador mueve los nudos y deja en
      // `settings.__modoAnim` la foto sin deformar + el modo (6 GDL) + la amplitud del
      // cuadro. Con eso la barra sale CURVA como en la deformada estática; sin ello era
      // una recta entre nudos y un pórtico empotrado se veía girando rígido desde la base.
      const anim = (settings as any).__modoAnim as
        { orig: Node[]; shape: number[]; amp: number } | null | undefined;
      if (e.length === 2 && !settings.deformedShape.val && anim && anim.orig.length === nodes.length) {
        const pi = anim.orig[e[0]], pj = anim.orig[e[1]];
        if (pi && pj) {
          const di = anim.shape.slice(e[0] * 6, e[0] * 6 + 6);
          const dj = anim.shape.slice(e[1] * 6, e[1] * 6 + 6);
          const pts = curvaHermite(pi, pj, di, dj, anim.amp, anim.amp);
          for (let k = 0; k < pts.length - 1; k++) {
            wireVerts.push(...pts[k], ...pts[k + 1]);
            if (colorByType && edgeColor) {
              wireCols.push(edgeColor.r, edgeColor.g, edgeColor.b);
              wireCols.push(edgeColor.r, edgeColor.g, edgeColor.b);
            }
          }
          continue;
        }
      }
      for (const edge of elementToEdges(e)) {
        const a = nodes[edge[0]], b = nodes[edge[1]];
        if (!a || !b) continue;
        wireVerts.push(...a, ...b);
        if (colorByType && edgeColor) {
          wireCols.push(edgeColor.r, edgeColor.g, edgeColor.b);
          wireCols.push(edgeColor.r, edgeColor.g, edgeColor.b);
        }
      }
      } finally {
        if (e.length === 2 && wireVerts.length > iv) {
          for (let k = iv; k < wireVerts.length; k++) fatVerts.push(wireVerts[k]);
          for (let k = ic; k < wireCols.length; k++) fatCols.push(wireCols[k]);
        }
      }
    }
    lines.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(wireVerts, 3)
    );
    // la gruesa: geometría NUEVA en cada cambio (deformada, animación modal, ocultar…)
    {
      const g = new LineSegmentsGeometry();
      if (fatVerts.length >= 6) g.setPositions(fatVerts);
      const conColor = colorByType && fatCols.length === fatVerts.length && fatVerts.length >= 6;
      if (conColor) g.setColors(fatCols);
      fat.geometry.dispose();
      fat.geometry = g;
      if (fatMat.vertexColors !== conColor) { fatMat.vertexColors = conColor; fatMat.needsUpdate = true; }
      fat.visible = fatVerts.length >= 6 && lines.visible;
    }
    if (colorByType && wireCols.length === wireVerts.length) {
      lines.geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(wireCols, 3)
      );
      (lines.material as THREE.LineBasicMaterial).vertexColors = true;
      (lines.material as THREE.LineBasicMaterial).needsUpdate = true;
    } else {
      lines.geometry.deleteAttribute("color");
      (lines.material as THREE.LineBasicMaterial).vertexColors = false;
      (lines.material as THREE.LineBasicMaterial).needsUpdate = true;
    }

    // Solid shell faces (triangulate Q4 y CST elements) — solo elementos
    // que pasan el filtro de tipo (Zapata/Losa).
    const faceVerts: number[] = [];
    const faceColors: number[] = [];
    // Que elemento es cada triangulo (para el hover): aqui ademas se saltan los ocultos.
    const faceToElem: number[] = [];
    const faceLocal: number[] = [];   // 0 = triangulo [0,1,2], 1 = [0,2,3]

    for (let ei = 0; ei < elems.length; ei++) {
      const e = elems[ei];
      if (!showElement(e)) continue;
      if (e.length === 3) {
        const [a, b, c] = e;
        if (nodes[a] && nodes[b] && nodes[c]) {
          faceToElem.push(ei); faceLocal.push(0);
          faceVerts.push(...nodes[a], ...nodes[b], ...nodes[c]);
          const col = colorByType ? COLOR_TRI : triColor;
          for (let v = 0; v < 3; v++) faceColors.push(col.r, col.g, col.b);
        }
      } else if (e.length === 4) {
        const [a, b, c, d] = e;
        if (nodes[a] && nodes[b] && nodes[c] && nodes[d]) {
          let col: THREE.Color;
          if (colorByType) {
            const zAvg = (nodes[a][2] + nodes[b][2] + nodes[c][2] + nodes[d][2]) / 4;
            col = isFooting(zAvg) ? COLOR_ZAPATA : COLOR_LOSA;
          } else {
            col = isVerticalQ4(nodes[a], nodes[b], nodes[c], nodes[d]) ? wallColor : slabColor;
          }
          faceVerts.push(...nodes[a], ...nodes[b], ...nodes[c]);
          faceVerts.push(...nodes[a], ...nodes[c], ...nodes[d]);
          faceToElem.push(ei, ei); faceLocal.push(0, 1);
          for (let v = 0; v < 6; v++) faceColors.push(col.r, col.g, col.b);
        }
      }
    }
    shellMesh.userData.faceToElem = faceToElem;
    shellMesh.userData.faceLocal = faceLocal;
    if (faceVerts.length > 0) {
      shellMesh.geometry.dispose();
      shellMesh.geometry = new THREE.BufferGeometry();
      shellMesh.geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(faceVerts, 3)
      );
      shellMesh.geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(faceColors, 3)
      );
      shellMesh.geometry.computeVertexNormals();
      // Visibilidad final = hay geometria AND toggle faces ON
      shellMesh.visible = settings.faces ? settings.faces.rawVal : true;
    } else {
      shellMesh.visible = false;
    }
  });

  // on settings.elements update visibility
  van.derive(() => {
    group.visible = settings.elements.val;
  });

  // ── Toggle independiente para wireframe edges (delim. sólidos/áreas) ──
  // Permite ver el colormap "limpio" sin las líneas de delimitación, o ver
  // sólo las líneas sin el shellMesh fill, etc.
  van.derive(() => {
    if (settings.edges) { lines.visible = settings.edges.val; fat.visible = settings.edges.val; }
  });

  // ── Toggle independiente para Caras (shellMesh fill) ──
  // Cuando faces=OFF, las superficies coloreadas se ocultan pero edges/nodos
  // siguen visibles. Util para ver lineas frame detras de un shell.
  // CRITICO: leemos `.val` PRIMERO (registra dependencia reactiva) y solo
  // despues chequeamos si hay geometria. Sino la derive nunca re-corre.
  //
  // Cuando el colormap de resultados (shell/solid) está activo, las caras
  // sólidas de color uniforme TAPAN la gradiente. Se ocultan automáticamente
  // para que el colormap sea visible. Los wireframe edges y nodos siguen.
  van.derive(() => {
    if (!settings.faces) return;
    const facesOn = settings.faces.val;
    const shellOn = (settings.shellResults?.val ?? "none") !== "none";
    const solidOn = (settings.solidResults?.val ?? "none") !== "none";
    const resultsActive = shellOn || solidOn;
    if (shellMesh.geometry.attributes.position) {
      shellMesh.visible = facesOn && !resultsActive;
    } else if (!facesOn) {
      shellMesh.visible = false;
    }
  });

  return group;
}

// Utils
function elementToEdges(element: Element): Element[] {
  if (element.length === 2) return [element];
  if (element.length === 8) {
    // hexaedro H8: 12 aristas (cara inferior, cara superior, las 4 verticales)
    const e = element;
    return [[e[0], e[1]], [e[1], e[2]], [e[2], e[3]], [e[3], e[0]], [e[4], e[5]], [e[5], e[6]], [e[6], e[7]], [e[7], e[4]],
            [e[0], e[4]], [e[1], e[5]], [e[2], e[6]], [e[3], e[7]]] as Element[];
  }

  const edges: [number, number][] = [];

  for (let i = 0; i < element.length; i++) {
    edges.push([element[i], element[(i + 1) % element.length]]);
  }

  return edges;
}
