import * as THREE from "three";
import van, { State } from "vanjs-core";
import { Node, Structure, SectionShape } from "hekatan-fem";
import { Settings } from "../settings/getSettings";
import { getTransformationMatrixBeam } from "./utils/getTransformationMatrixBeam";
import { Text } from "./Text";

/**
 * Draws filled cross-sections at the midpoint of each beam element.
 * Uses sectionShapes from elementInputs for accurate geometry:
 *   - "rect": filled rectangle b × h (cyan)
 *   - "circ": filled circle with diameter d (cyan)
 *   - "I": I-beam with flanges and web (orange)
 */
function getSectionLabel(shape: SectionShape): string {
  if (shape.name) return shape.name; // e.g. "W14x82"
  if (shape.type === "rect") {
    const b = (shape.b! * 100).toFixed(0);
    const h = (shape.h! * 100).toFixed(0);
    return `${b}x${h}`;
  }
  if (shape.type === "circ") {
    return `D${(shape.d! * 100).toFixed(0)}`;
  }
  return "";
}

export function sections(
  structure: Structure,
  settings: Settings,
  derivedNodes: State<Node[]>,
  derivedDisplayScale?: State<number>
): THREE.Group {
  const group = new THREE.Group();
  // Sub-grupo dedicado solo a los chips de texto "30x50" / "40x40" — su visibilidad
  // se gobierna independiente del resto del grupo (formas celestes) con
  // `settings.sectionLabels`. Si `settings.sections=true` y `sectionLabels=false`,
  // las formas se ven pero los textos no.
  const labelsGroup = new THREE.Group();
  group.add(labelsGroup);

  // ── Shape builders: return { fill: BufferGeometry, outline: BufferGeometry } ──

  function makeRect(b: number, h: number) {
    const hb = b / 2, hh = h / 2;

    // Filled quad (two triangles)
    const fillVerts = new Float32Array([
      0, -hb, -hh,  0,  hb, -hh,  0,  hb,  hh,
      0, -hb, -hh,  0,  hb,  hh,  0, -hb,  hh,
    ]);
    const fill = new THREE.BufferGeometry();
    fill.setAttribute("position", new THREE.BufferAttribute(fillVerts, 3));

    // Outline
    const outVerts = new Float32Array([
      0, -hb, -hh,  0,  hb, -hh,  0,  hb,  hh,  0, -hb,  hh,  0, -hb, -hh,
    ]);
    const outline = new THREE.BufferGeometry();
    outline.setAttribute("position", new THREE.BufferAttribute(outVerts, 3));

    return { fill, outline };
  }

  function makeCirc(d: number, seg = 24) {
    const r = d / 2;

    // Filled fan (triangles from center)
    const fv = new Float32Array(seg * 9);
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * Math.PI * 2;
      const a1 = ((i + 1) / seg) * Math.PI * 2;
      fv[i * 9]     = 0; fv[i * 9 + 1] = 0;             fv[i * 9 + 2] = 0;
      fv[i * 9 + 3] = 0; fv[i * 9 + 4] = r * Math.cos(a0); fv[i * 9 + 5] = r * Math.sin(a0);
      fv[i * 9 + 6] = 0; fv[i * 9 + 7] = r * Math.cos(a1); fv[i * 9 + 8] = r * Math.sin(a1);
    }
    const fill = new THREE.BufferGeometry();
    fill.setAttribute("position", new THREE.BufferAttribute(fv, 3));

    // Outline
    const ov = new Float32Array((seg + 1) * 3);
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      ov[i * 3] = 0; ov[i * 3 + 1] = r * Math.cos(a); ov[i * 3 + 2] = r * Math.sin(a);
    }
    const outline = new THREE.BufferGeometry();
    outline.setAttribute("position", new THREE.BufferAttribute(ov, 3));

    return { fill, outline };
  }

  function makeI(bf: number, d: number, tfIn?: number, twIn?: number) {
    const tf = tfIn ?? d * 0.08;
    const tw = twIn ?? bf * 0.07;
    const hb = bf / 2, hd = d / 2;
    const hweb = hd - tf;
    const htw = tw / 2;

    // I-shape as 3 filled rectangles: top flange, web, bottom flange
    const quads: number[] = [];
    function addQuad(y0: number, z0: number, y1: number, z1: number) {
      quads.push(0, y0, z0,  0, y1, z0,  0, y1, z1,  0, y0, z0,  0, y1, z1,  0, y0, z1);
    }
    // Bottom flange
    addQuad(-hb, -hd, hb, -hweb);
    // Web
    addQuad(-htw, -hweb, htw, hweb);
    // Top flange
    addQuad(-hb, hweb, hb, hd);

    const fill = new THREE.BufferGeometry();
    fill.setAttribute("position", new THREE.BufferAttribute(new Float32Array(quads), 3));

    // I-beam outline
    const outVerts = new Float32Array([
      // Bottom flange
      0, -hb, -hd,   0,  hb, -hd,   0,  hb, -hweb,
      // Web right side up
      0,  htw, -hweb,  0,  htw,  hweb,
      // Top flange
      0,  hb,  hweb,  0,  hb,  hd,   0, -hb,  hd,
      // Top flange left
      0, -hb,  hweb,
      // Web left side down
      0, -htw,  hweb,  0, -htw, -hweb,
      // Bottom flange left
      0, -hb, -hweb,  0, -hb, -hd,
    ]);
    const outline = new THREE.BufferGeometry();
    outline.setAttribute("position", new THREE.BufferAttribute(outVerts, 3));

    return { fill, outline };
  }

  /** Hollow rectangular section (HSS / tubular) */
  function makeHSS(b: number, h: number, t: number) {
    const hb = b / 2, hh = h / 2;
    const bi = hb - t, hi = hh - t;

    // Outer rect - inner rect = hollow shape (4 quads: top, bottom, left, right walls)
    const quads: number[] = [];
    function addQuad(y0: number, z0: number, y1: number, z1: number) {
      quads.push(0, y0, z0, 0, y1, z0, 0, y1, z1, 0, y0, z0, 0, y1, z1, 0, y0, z1);
    }
    // Bottom wall
    addQuad(-hb, -hh, hb, -hi);
    // Top wall
    addQuad(-hb, hi, hb, hh);
    // Left wall
    addQuad(-hb, -hi, -bi, hi);
    // Right wall
    addQuad(bi, -hi, hb, hi);

    const fill = new THREE.BufferGeometry();
    fill.setAttribute("position", new THREE.BufferAttribute(new Float32Array(quads), 3));

    // Outline: outer + inner rectangles
    const ov = new Float32Array([
      // Outer
      0, -hb, -hh, 0, hb, -hh, 0, hb, -hh, 0, hb, hh,
      0, hb, hh, 0, -hb, hh, 0, -hb, hh, 0, -hb, -hh,
      // Inner
      0, -bi, -hi, 0, bi, -hi, 0, bi, -hi, 0, bi, hi,
      0, bi, hi, 0, -bi, hi, 0, -bi, hi, 0, -bi, -hi,
    ]);
    const outline = new THREE.BufferGeometry();
    outline.setAttribute("position", new THREE.BufferAttribute(ov, 3));

    return { fill, outline };
  }

  /** CFT: steel tube outline + concrete fill inside */
  function makeCFT(b: number, h: number, t: number) {
    const hb = b / 2, hh = h / 2;
    const bi = hb - t, hi = hh - t;

    // Concrete fill (inner rectangle)
    const concFill = new THREE.BufferGeometry();
    const cv = new Float32Array([
      0, -bi, -hi, 0, bi, -hi, 0, bi, hi,
      0, -bi, -hi, 0, bi, hi, 0, -bi, hi,
    ]);
    concFill.setAttribute("position", new THREE.BufferAttribute(cv, 3));

    // Steel walls (4 quads)
    const quads: number[] = [];
    function addQuad(y0: number, z0: number, y1: number, z1: number) {
      quads.push(0, y0, z0, 0, y1, z0, 0, y1, z1, 0, y0, z0, 0, y1, z1, 0, y0, z1);
    }
    addQuad(-hb, -hh, hb, -hi); // bottom wall
    addQuad(-hb, hi, hb, hh);   // top wall
    addQuad(-hb, -hi, -bi, hi); // left wall
    addQuad(bi, -hi, hb, hi);   // right wall

    const steelFillGeom = new THREE.BufferGeometry();
    steelFillGeom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(quads), 3));

    // Outline: outer + inner
    const ov = new Float32Array([
      0, -hb, -hh, 0, hb, -hh, 0, hb, -hh, 0, hb, hh,
      0, hb, hh, 0, -hb, hh, 0, -hb, hh, 0, -hb, -hh,
      0, -bi, -hi, 0, bi, -hi, 0, bi, -hi, 0, bi, hi,
      0, bi, hi, 0, -bi, hi, 0, -bi, hi, 0, -bi, -hi,
    ]);
    const outline = new THREE.BufferGeometry();
    outline.setAttribute("position", new THREE.BufferAttribute(ov, 3));

    return { concFill, steelFillGeom, outline };
  }

  // ── L (angle) ──
  function makeL(b: number, h: number, t: number) {
    // L-shape: vertical leg (h) + horizontal leg (b), thickness t
    const pts: number[] = [];
    // 6 vertices of L-shape (CCW)
    const v = [
      [0, -b/2, -h/2],    // bottom-left
      [0, -b/2+t, -h/2],  // bottom inner
      [0, -b/2+t, h/2-t], // inner corner
      [0, b/2, h/2-t],    // right of top flange
      [0, b/2, h/2],      // top-right
      [0, -b/2, h/2],     // top-left
    ];
    // Triangulate L (4 triangles)
    const tri = [0,1,2, 0,2,5, 2,3,4, 2,4,5];
    for (const i of tri) pts.push(...v[i]);
    const fill = new THREE.BufferGeometry();
    fill.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    // Outline
    const ol: number[] = [];
    for (let i = 0; i < v.length; i++) {
      const j = (i + 1) % v.length;
      ol.push(...v[i], ...v[j]);
    }
    const outline = new THREE.BufferGeometry();
    outline.setAttribute("position", new THREE.BufferAttribute(new Float32Array(ol), 3));
    return { fill, outline };
  }

  // ── 2L (double angle) ──
  function make2L(b: number, h: number, t: number, gap: number) {
    const g2 = gap / 2;
    const pts: number[] = [];
    // Left L (mirrored)
    const vL = [
      [0, -b-g2, -h/2], [0, -t-g2, -h/2], [0, -t-g2, h/2-t],
      [0, -g2, h/2-t], [0, -g2, h/2], [0, -b-g2, h/2],
    ];
    // Right L
    const vR = [
      [0, g2, -h/2], [0, g2+t, -h/2], [0, g2+t, h/2-t],
      [0, b+g2, h/2-t], [0, b+g2, h/2], [0, g2, h/2],
    ];
    const triIdx = [0,1,2, 0,2,5, 2,3,4, 2,4,5];
    for (const i of triIdx) pts.push(...vL[i]);
    for (const i of triIdx) pts.push(...vR[i]);
    const fill = new THREE.BufferGeometry();
    fill.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    const ol: number[] = [];
    for (const v of [vL, vR]) {
      for (let i = 0; i < v.length; i++) {
        const j = (i + 1) % v.length;
        ol.push(...v[i], ...v[j]);
      }
    }
    const outline = new THREE.BufferGeometry();
    outline.setAttribute("position", new THREE.BufferAttribute(new Float32Array(ol), 3));
    return { fill, outline };
  }

  // ── C (channel) ──
  function makeC(bf: number, d: number, tf: number, tw: number) {
    const hd = d / 2, hb = bf;
    // U-shape: web on left, flanges top/bottom extending right
    const v = [
      [0, -hb, -hd],     // bottom-right of bottom flange
      [0, -hb, -hd+tf],  // inner bottom flange
      [0, -tw, -hd+tf],  // web inner bottom
      [0, -tw, hd-tf],   // web inner top
      [0, -hb, hd-tf],   // inner top flange
      [0, -hb, hd],      // top-right of top flange
      [0, 0, hd],         // top-left
      [0, 0, -hd],        // bottom-left
    ];
    const tri = [0,1,7, 1,6,7, 1,2,6, 2,5,6, 2,3,5, 3,4,5];
    const pts: number[] = [];
    for (const i of tri) pts.push(...v[i]);
    const fill = new THREE.BufferGeometry();
    fill.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    const ol: number[] = [];
    for (let i = 0; i < v.length; i++) {
      const j = (i + 1) % v.length;
      ol.push(...v[i], ...v[j]);
    }
    const outline = new THREE.BufferGeometry();
    outline.setAttribute("position", new THREE.BufferAttribute(new Float32Array(ol), 3));
    return { fill, outline };
  }

  // ── 2C (double channel) ──
  function make2C(bf: number, d: number, tf: number, tw: number, gap: number) {
    const hd = d / 2, g2 = gap / 2;
    // Two C-channels back to back
    const pts: number[] = [];
    // Left C (webs facing each other)
    const vL = [
      [0, -bf, -hd], [0, -bf, -hd+tf], [0, -g2-tw, -hd+tf],
      [0, -g2-tw, hd-tf], [0, -bf, hd-tf], [0, -bf, hd],
      [0, -g2, hd], [0, -g2, -hd],
    ];
    const vR = vL.map(p => [p[0], -p[1], p[2]]); // mirror
    const tri = [0,1,7, 1,6,7, 1,2,6, 2,5,6, 2,3,5, 3,4,5];
    for (const i of tri) pts.push(...vL[i]);
    for (const i of tri) pts.push(...vR[i]);
    const fill = new THREE.BufferGeometry();
    fill.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    const ol: number[] = [];
    for (const v of [vL, vR]) {
      for (let i = 0; i < v.length; i++) {
        const j = (i + 1) % v.length;
        ol.push(...v[i], ...v[j]);
      }
    }
    const outline = new THREE.BufferGeometry();
    outline.setAttribute("position", new THREE.BufferAttribute(new Float32Array(ol), 3));
    return { fill, outline };
  }

  // ── T (tee) ──
  function makeT(bf: number, d: number, tf: number, tw: number) {
    const hb = bf / 2, hd = d / 2;
    const htw = tw / 2;
    // T-shape: flange on top, stem going down
    const v = [
      [0, -htw, -hd],  // stem bottom-left
      [0, htw, -hd],   // stem bottom-right
      [0, htw, hd-tf], // stem top-right
      [0, hb, hd-tf],  // flange right bottom
      [0, hb, hd],     // flange right top
      [0, -hb, hd],    // flange left top
      [0, -hb, hd-tf], // flange left bottom
      [0, -htw, hd-tf],// stem top-left
    ];
    const tri = [0,1,7, 1,2,7, 6,7,5, 2,3,4, 2,4,5, 2,5,7];
    const pts: number[] = [];
    for (const i of tri) pts.push(...v[i]);
    const fill = new THREE.BufferGeometry();
    fill.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    const ol: number[] = [];
    for (let i = 0; i < v.length; i++) {
      const j = (i + 1) % v.length;
      ol.push(...v[i], ...v[j]);
    }
    const outline = new THREE.BufferGeometry();
    outline.setAttribute("position", new THREE.BufferAttribute(new Float32Array(ol), 3));
    return { fill, outline };
  }

  // ── Pipe (circular hollow section) ──
  function makePipe(d: number, t: number, seg = 24) {
    const ro = d / 2, ri = ro - t;
    // Outer and inner circles as triangle strip
    const pts: number[] = [];
    for (let i = 0; i < seg; i++) {
      const a1 = (i / seg) * Math.PI * 2;
      const a2 = ((i + 1) / seg) * Math.PI * 2;
      const co1 = Math.cos(a1), si1 = Math.sin(a1);
      const co2 = Math.cos(a2), si2 = Math.sin(a2);
      // Quad between outer and inner
      pts.push(0, ro*co1, ro*si1, 0, ro*co2, ro*si2, 0, ri*co2, ri*si2);
      pts.push(0, ro*co1, ro*si1, 0, ri*co2, ri*si2, 0, ri*co1, ri*si1);
    }
    const fill = new THREE.BufferGeometry();
    fill.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    // Outline: outer + inner circles
    const ol: number[] = [];
    for (let i = 0; i < seg; i++) {
      const a1 = (i / seg) * Math.PI * 2;
      const a2 = ((i + 1) / seg) * Math.PI * 2;
      ol.push(0, ro*Math.cos(a1), ro*Math.sin(a1), 0, ro*Math.cos(a2), ro*Math.sin(a2));
      ol.push(0, ri*Math.cos(a1), ri*Math.sin(a1), 0, ri*Math.cos(a2), ri*Math.sin(a2));
    }
    const outline = new THREE.BufferGeometry();
    outline.setAttribute("position", new THREE.BufferAttribute(new Float32Array(ol), 3));
    return { fill, outline };
  }

  // ── Materials ──
  const concreteFill = new THREE.MeshBasicMaterial({
    color: 0x00ccff, transparent: true, opacity: 0.35,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const concreteLine = new THREE.LineBasicMaterial({ color: 0x00ccff });
  const steelFill = new THREE.MeshBasicMaterial({
    color: 0xff9900, transparent: true, opacity: 0.4,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const steelLine = new THREE.LineBasicMaterial({ color: 0xff9900 });

  // Helper: detect if element is vertical (column) based on node positions
  function isColumnElement(n1: Node, n2: Node): boolean {
    const dx = Math.abs(n2[0] - n1[0]);
    const dy = Math.abs(n2[1] - n1[1]);
    const dz = Math.abs(n2[2] - n1[2]);
    // Vertical if Z-displacement dominates (Y-up: use index 2 for Z in awatif)
    // In awatif Y-up: vertical elements go along Y axis
    // Z is vertical for edificio, Y is vertical for beams/3d examples
    return (dz > dx && dz > dy) || (dy > dx && dy > dz);
  }

  // ── Rebuild on change ──
  van.derive(() => {
    settings.deformedShape.val;
    settings.secColumns.val;
    settings.secBeams.val;
    settings.secFloor.val;

    const showCols = settings.secColumns.rawVal;
    const showBeams = settings.secBeams.rawVal;
    if (!showCols && !showBeams) { group.children.forEach((c) => { if (c instanceof Text) (c as Text).dispose(); }); group.clear(); return; }

    group.children.forEach((c) => { if (c instanceof Text) (c as Text).dispose(); });
    group.clear();

    const elems = structure.elements?.val;
    const inputs = structure.elementInputs?.val;
    if (!elems || !inputs) return;

    const shapes = inputs.sectionShapes;
    const floorFilter = settings.secFloor.rawVal; // -1 = all

    elems.forEach((element, idx) => {
      if (element.length !== 2) return;

      const node1 = derivedNodes.rawVal[element[0]];
      const node2 = derivedNodes.rawVal[element[1]];
      if (!node1 || !node2) return;

      // Filter by column/beam
      const isCol = isColumnElement(node1, node2);
      if (isCol && !showCols) return;
      if (!isCol && !showBeams) return;

      // Filter by floor (approximate: use min Y of element to determine floor)
      if (floorFilter >= 0) {
        const minY = Math.min(node1[1], node2[1]);
        const maxY = Math.max(node1[1], node2[1]);
        // Estimate floor height from grid (use gridSize as proxy)
        const gs = settings.gridSize.rawVal || 3;
        const floorIdx = Math.floor(minY / gs + 0.01);
        if (floorIdx !== floorFilter) return;
      }

      const shape = shapes?.get(idx);
      if (!shape) return;

      const mid: [number, number, number] = [
        (node1[0] + node2[0]) / 2,
        (node1[1] + node2[1]) / 2,
        (node1[2] + node2[2]) / 2,
      ];
      const rotMatrix = getTransformationMatrixBeam(node1, node2);

      if (shape.type === "CFT") {
        // CFT: concrete fill + steel tube walls + outline
        const cft = makeCFT(shape.b!, shape.h!, shape.tw ?? shape.b! * 0.05);
        // Concrete core
        const concMesh = new THREE.Mesh(cft.concFill, concreteFill);
        concMesh.position.set(...mid);
        concMesh.rotation.setFromRotationMatrix(rotMatrix);
        concMesh.userData.e = idx;
        group.add(concMesh);
        // Steel walls
        const steelMesh = new THREE.Mesh(cft.steelFillGeom, steelFill);
        steelMesh.position.set(...mid);
        steelMesh.rotation.setFromRotationMatrix(rotMatrix);
        steelMesh.userData.e = idx;
        group.add(steelMesh);
        // Outline
        const line = new THREE.Line(cft.outline, steelLine);
        line.position.set(...mid);
        line.rotation.setFromRotationMatrix(rotMatrix);
        line.userData.e = idx;
        group.add(line);
      } else {
        let geom: { fill: THREE.BufferGeometry; outline: THREE.BufferGeometry };
        let fillMat: THREE.MeshBasicMaterial;
        let lineMat: THREE.LineBasicMaterial;

        switch (shape.type) {
          case "rect":
            geom = makeRect(shape.b!, shape.h!);
            fillMat = concreteFill; lineMat = concreteLine;
            break;
          case "circ":
            geom = makeCirc(shape.d!);
            fillMat = concreteFill; lineMat = concreteLine;
            break;
          case "I":
            geom = makeI(shape.b!, shape.h!, shape.tf, shape.tw);
            fillMat = steelFill; lineMat = steelLine;
            break;
          case "HSS":
            geom = makeHSS(shape.b!, shape.h!, shape.tw ?? shape.b! * 0.05);
            fillMat = steelFill; lineMat = steelLine;
            break;
          case "CFT":
            geom = makeCFT(shape.b!, shape.h!, shape.tw ?? shape.b! * 0.05);
            fillMat = steelFill; lineMat = steelLine;
            break;
          case "L":
            geom = makeL(shape.b ?? shape.h!, shape.h!, shape.t ?? shape.tw ?? 0.003);
            fillMat = steelFill; lineMat = steelLine;
            break;
          case "2L":
            geom = make2L(shape.b ?? shape.h!, shape.h!, shape.t ?? shape.tw ?? 0.003, shape.dis ?? 0.01);
            fillMat = steelFill; lineMat = steelLine;
            break;
          case "C":
          case "coldC":
            geom = makeC(shape.b!, shape.h!, shape.tf ?? shape.t ?? 0.003, shape.tw ?? shape.t ?? 0.003);
            fillMat = steelFill; lineMat = steelLine;
            break;
          case "2C":
            geom = make2C(shape.b!, shape.h!, shape.tf ?? 0.005, shape.tw ?? 0.005, shape.dis ?? 0.01);
            fillMat = steelFill; lineMat = steelLine;
            break;
          case "T":
            geom = makeT(shape.b!, shape.h!, shape.tf ?? 0.01, shape.tw ?? 0.006);
            fillMat = steelFill; lineMat = steelLine;
            break;
          case "pipe":
            geom = makePipe(shape.d!, shape.tw ?? shape.d! * 0.05);
            fillMat = steelFill; lineMat = steelLine;
            break;
          default:
            return;
        }

        // Filled face
        const meshObj = new THREE.Mesh(geom.fill, fillMat);
        meshObj.position.set(...mid);
        meshObj.rotation.setFromRotationMatrix(rotMatrix);
        meshObj.userData.e = idx;
        group.add(meshObj);

        // Outline
        const line = new THREE.Line(geom.outline, lineMat);
        line.position.set(...mid);
        line.rotation.setFromRotationMatrix(rotMatrix);
        line.userData.e = idx;
        group.add(line);
      }

      // Label — va al sub-grupo `labelsGroup` para que su visibilidad sea
      // independiente de las formas (ver settings.sectionLabels).
      const label = getSectionLabel(shape);
      if (label) {
        const steelTypes = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"];
        const color = steelTypes.includes(shape.type) ? "#ff9900" : "#00ccff";
        const text = new Text(label, color, "transparent");
        text.position.set(mid[0], mid[1], mid[2]);
        const size = 0.05 * settings.gridSize.rawVal * 0.5;
        text.updateScale(size * (derivedDisplayScale?.rawVal ?? 1));
        labelsGroup.add(text);
      }
    });
  });

  // ── Seguir a los nudos ──
  // El rebuild de arriba lee `derivedNodes.rawVal` (a propósito: rehacer 400+ mallas en cada fotograma
  // de la animación del modo es caro), así que los glifos se quedaban donde estaba la barra al
  // construirlos. Con la deformada o el modo animado quedaban perfiles naranjas FLOTANDO lejos de las
  // barras (Jorge, 15-sep-2026: «quedan unos puntos amarillos»). Aquí solo se mueven y giran.
  van.derive(() => {
    const N = derivedNodes.val;
    const elems = structure.elements?.rawVal;
    if (!elems) return;
    for (const o of group.children) {
      const e = o.userData?.e;
      if (e === undefined) continue;
      const el = elems[e];
      const a = el && N[el[0]], b = el && N[el[1]];
      if (!a || !b) continue;
      o.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
      o.rotation.setFromRotationMatrix(getTransformationMatrixBeam(a, b));
    }
  });

  // on derivedDisplayScale change update label sizes
  if (derivedDisplayScale) {
    van.derive(() => {
      derivedDisplayScale.val;
      if (!settings.sections.rawVal) return;
      const size = 0.05 * settings.gridSize.val * 0.5;
      labelsGroup.children.forEach((c) => {
        if (c instanceof Text) (c as Text).updateScale(size * derivedDisplayScale.rawVal);
      });
    });
  }

  van.derive(() => {
    group.visible = settings.sections.val;
  });
  // Visibility independiente para los chips de texto. Notar que aunque
  // sectionLabels esté en true, si sections=false el group entero está
  // oculto, así que los labels también; eso es el comportamiento deseado.
  van.derive(() => {
    labelsGroup.visible = settings.sectionLabels.val;
  });

  return group;
}
