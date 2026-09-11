/**
 * Importador CSI — E2K (ETABS) / F2K (SAFE) / S2K (SAP2000)
 *
 * ARCHIVO EXISTENTE, no archivo nuevo. La diferencia es de fondo y la marca
 * Jorge: **el existente NO lleva las configuraciones del nuevo**. Un modelo que
 * viene de un archivo trae SUS secciones, SUS materiales, SUS apoyos y SUS
 * cargas, y eso es lo que hay que enseñar. El de `new-blank` arranca con
 * valores por defecto porque no tiene de dónde sacarlos; este no.
 *
 * Lo que hacía antes y estaba mal: `main.ts` parseaba el e2k entero con
 * `parseE2k` —secciones, materiales, apoyos, cargas, plantas— y despues se
 * quedaba SOLO con los puntos y las lineas, tiraba el resto, y navegaba a
 * `new-blank`, que le ponia SUS secciones y SUS cargas por defecto (bCol,
 * hCol, bViga, hViga, tShell, Fz, Fx). O sea: el archivo existente acababa
 * mostrando la configuracion del nuevo, y los datos reales del e2k no se veian
 * porque se habian descartado por el camino.
 *
 * Ahora el modelo llega ENTERO y se muestra tal cual: cada barra con la
 * seccion que trae el archivo, los apoyos donde estan, y las cargas que tiene.
 * Los parametros del panel son solo para EDITAR lo importado (escala de la
 * vista, filtros por tipo), no para redefinir el modelo.
 */
import * as THREE from "three";
import type { Node, Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

/** Lo que deja `main.ts` al importar, ya deserializado. */
interface ModeloImportado {
  fuente: string;                 // "E2K" | "F2K" | "S2K"
  archivo: string;
  nodes: Node[];
  elements: Element[];
  tipos: string[];                // "COLUMN" | "BEAM" | "BRACE" | "AREA"
  secciones: string[];            // nombre de seccion por elemento
  plantas: string[];              // planta por elemento
  supports: [number, boolean[]][];
  loads: [number, number[]][];
  elementInputs: Record<string, [number, number][]>;
  info?: Record<string, unknown>;
}

const COLOR: Record<string, number> = {
  COLUMN: 0xef4444, BEAM: 0x22c55e, BRACE: 0x3b82f6, AREA: 0xf59e0b,
};

/**
 * La CUBIERTA de ETABS es una losa `MODELINGTYPE "Membrane"`: un paño que solo
 * trabaja EN SU PLANO y ata los nudos de la parte alta. Al exportar por OAPI un
 * EDB con la cubierta sin dibujar como área (o cuando el modelo llega con la
 * cubierta como pura carga), las áreas NO viajan y los tirantes/correas del
 * techo se quedan SUELTOS: no llegan a un apoyo y la matriz sale singular.
 *
 * Esto recupera los paños de cubierta a partir de la propia topología de barras:
 * cada cuadrilátero CERRADO (a-b-c-d-a, las 4 barras existen) por encima de la
 * media de alturas es un paño de techo, ahí es donde ETABS pone la membrana.
 * No se inventa geometría: los 4 nudos y los 4 lados ya están en el modelo.
 */
function detectarPanosCubierta(nodes: Node[], elements: Element[], zCorte: number): number[][] {
  const N = nodes.length;
  const key = (a: number, b: number) => (a < b ? a + "_" + b : b + "_" + a);
  const edge = new Set<string>();
  const adj: number[][] = Array.from({ length: N }, () => []);
  for (const e of elements) {
    if (e.length === 2) { edge.add(key(e[0], e[1])); adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); }
  }
  const has = (a: number, b: number) => edge.has(key(a, b));
  const vistos = new Set<string>();
  const panos: number[][] = [];
  for (let a = 0; a < N; a++) {
    for (const b of adj[a]) {
      if (b < a) continue;
      for (const c of adj[b]) {
        if (c === a) continue;
        for (const d of adj[c]) {
          if (d === b || d === a || !has(d, a)) continue;
          const ns = [a, b, c, d];
          const zm = (nodes[a][2] + nodes[b][2] + nodes[c][2] + nodes[d][2]) / 4;
          if (zm < zCorte) continue;
          const id = ns.slice().sort((x, y) => x - y).join("-");
          if (vistos.has(id)) continue;
          vistos.add(id);
          panos.push([a, b, c, d]);   // orden de anillo (a→b→c→d→a)
        }
      }
    }
  }
  return panos;
}

function vacio(states: any, msg: string) {
  states.nodes.val = [];
  states.elements.val = [];
  states.nodeInputs.val = { supports: new Map(), loads: new Map() };
  states.elementInputs.val = {
    elasticities: new Map(), shearModuli: new Map(), areas: new Map(),
    momentsOfInertiaY: new Map(), momentsOfInertiaZ: new Map(),
    torsionalConstants: new Map(), densities: new Map(), poissonsRatios: new Map(),
  };
  states.objects3D.val = [];
  console.log("[CSI Importer] " + msg);
}

export const csiImporter: ExampleDef = {
  id: "csi-importer",
  name: "Importar CSI (E2K/F2K/S2K)",
  category: "🧪 Utilidades",
  defaultShellResult: "none",
  availableShellResults: [],
  // Parametros SOLO de vista y edicion de lo importado. NADA de secciones ni
  // cargas por defecto: esas vienen del archivo.
  params: {
    verColumnas: { default: 1, boolean: true, label: "Columnas", folder: "👁 Ver por tipo" },
    verVigas: { default: 1, boolean: true, label: "Vigas", folder: "👁 Ver por tipo" },
    verDiagonales: { default: 1, boolean: true, label: "Diagonales", folder: "👁 Ver por tipo" },
    verAreas: { default: 1, boolean: true, label: "Áreas", folder: "👁 Ver por tipo" },
    // ── Cubierta como slab membrana (lo que ETABS no exportó como área) ──
    cubierta: { default: 0, boolean: true, label: "Poner cubierta (slab membrana)", folder: "🏠 Cubierta" },
    formaCubierta: {
      default: 2, label: "Formulación de la placa",
      options: { "Membrana (solo su plano)": 2, "Shell-Thin (Kirchhoff)": 1, "Shell-Thick (Mindlin)": 0 },
      folder: "🏠 Cubierta",
    },
    tCubierta: { default: 60, min: 20, max: 300, step: 5, label: "Espesor cubierta (mm)", folder: "🏠 Cubierta" },
  },
  computedLabels(_p, states) {
    const m: ModeloImportado | undefined = (window as any).__hekatanImportedModel;
    if (!m) return { "Archivo": "ninguno — usa 📥 Importar" };
    const porSec = new Map<string, number>();
    m.secciones?.forEach((s) => porSec.set(s, (porSec.get(s) ?? 0) + 1));
    const top = [...porSec.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
    const out: Record<string, string> = {
      "Archivo": `${m.archivo} (${m.fuente})`,
      "Nudos": String(m.nodes.length),
      "Elementos": String(m.elements.length),
      "Apoyos": String(m.supports?.length ?? 0),
      "Cargas": String(m.loads?.length ?? 0),
      "Plantas": String(new Set(m.plantas ?? []).size),
    };
    top.forEach(([s, n]) => { out[`  ${s}`] = `${n}`; });
    void states;
    return out;
  },
  build(p, states) {
    const m: ModeloImportado | undefined = (window as any).__hekatanImportedModel;
    const viejo = (window as any).__hekatanImportedCim;   // f2k de cimentacion

    if (!m) {
      if (viejo?.zapatas?.length) return zapatasF2k(viejo, states);
      return vacio(states, "Sin archivo. Usa el folder '📥 Importar archivo'.");
    }

    // ── El modelo del ARCHIVO, tal cual viene ──────────────────────────────
    const ver = (t: string) =>
      (t === "COLUMN" && p.verColumnas) || (t === "BEAM" && p.verVigas) ||
      (t === "BRACE" && p.verDiagonales) || (t === "AREA" && p.verAreas) ||
      !["COLUMN", "BEAM", "BRACE", "AREA"].includes(t);

    const nodes = m.nodes;
    const elements: Element[] = [];
    const idxOrig: number[] = [];
    m.elements.forEach((e, i) => {
      const t = m.tipos?.[i] ?? (e.length === 4 ? "AREA" : "BEAM");
      if (!ver(t)) return;
      elements.push(e);
      idxOrig.push(i);
    });

    // Los inputs de elemento se REMAPEAN al filtrar: si no, cada barra se
    // quedaria con las propiedades de otra.
    const ei: Record<string, Map<number, number>> = {};
    for (const [k, pares] of Object.entries(m.elementInputs ?? {})) {
      const orig = new Map(pares);
      const mp = new Map<number, number>();
      idxOrig.forEach((o, nuevo) => {
        const v = orig.get(o);
        if (v !== undefined) mp.set(nuevo, v);
      });
      ei[k] = mp;
    }
    for (const k of ["elasticities", "shearModuli", "areas", "momentsOfInertiaY",
                     "momentsOfInertiaZ", "torsionalConstants", "densities",
                     "poissonsRatios"]) {
      if (!ei[k]) ei[k] = new Map();
    }

    // ── Cubierta como slab membrana ───────────────────────────────────────
    // Acopla los nudos altos que quedaron sueltos (la membrana que ETABS no
    // exportó como área). Los paños salen de la topología real; la formulación
    // la elige el usuario (por defecto Membrana = solo trabaja en su plano).
    let panosCubierta: number[][] = [];
    if (p.cubierta && elements.length < 3000) {
      const zs = nodes.map((n) => n[2]);
      const zCorte = Math.min(...zs) + 0.5 * (Math.max(...zs) - Math.min(...zs));
      panosCubierta = detectarPanosCubierta(nodes, elements, zCorte);
      const E = 2.146e7, nu = 0.2, G = E / (2 * (1 + nu)), rho = 2.4;   // f'c=210 kg/cm²
      const tC = (p.tCubierta ?? 60) / 1000;                            // mm → m
      for (const q of panosCubierta) {
        const i = elements.length;
        elements.push(q as Element);
        ei.elasticities.set(i, E); ei.shearModuli.set(i, G);
        ei.poissonsRatios.set(i, nu); ei.densities.set(i, rho);
        (ei.thicknesses ??= new Map()).set(i, tC);
        (ei.plateFormulations ??= new Map()).set(i, p.formaCubierta ?? 2);
      }
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = {
      supports: new Map((m.supports ?? []) as any),
      loads: new Map((m.loads ?? []) as any),
    };
    states.elementInputs.val = ei as any;

    // Color por tipo, para que se lea de un vistazo que hay en el archivo
    const objs: THREE.Object3D[] = [];
    // Los paños de cubierta, como membrana traslúcida naranja sobre el techo.
    if (panosCubierta.length) {
      const pos: number[] = [];
      for (const q of panosCubierta) {
        const [a, b, c, d] = q.map((k) => nodes[k]);
        pos.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
        pos.push(a[0], a[1], a[2], c[0], c[1], c[2], d[0], d[1], d[2]);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.computeVertexNormals();
      objs.push(new THREE.Mesh(g, new THREE.MeshLambertMaterial({
        color: COLOR.AREA, transparent: true, opacity: 0.5, side: THREE.DoubleSide,
      })));
    }
    const porTipo = new Map<string, THREE.Vector3[]>();
    elements.forEach((e, i) => {
      const t = m.tipos?.[idxOrig[i]] ?? (e.length === 4 ? "AREA" : "BEAM");
      if (e.length !== 2) return;
      const a = nodes[e[0]], b = nodes[e[1]];
      if (!a || !b) return;
      const arr = porTipo.get(t) ?? [];
      arr.push(new THREE.Vector3(a[0], a[1], a[2]),
               new THREE.Vector3(b[0], b[1], b[2]));
      porTipo.set(t, arr);
    });
    for (const [t, pts] of porTipo) {
      if (!pts.length) continue;
      objs.push(new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: COLOR[t] ?? 0x94a3b8 })));
    }
    states.objects3D.val = objs;

    const secs = new Set(m.secciones ?? []);
    const forma = ["Shell-Thick", "Shell-Thin", "Membrana"][p.formaCubierta ?? 2] ?? "Membrana";
    console.log(`[CSI Importer] ${m.archivo} (${m.fuente}): ${nodes.length} nudos, `
      + `${elements.length}/${m.elements.length} elementos, `
      + `${secs.size} secciones, ${m.supports?.length ?? 0} apoyos, `
      + `${m.loads?.length ?? 0} cargas`
      + (panosCubierta.length ? `, cubierta: ${panosCubierta.length} paños (${forma})` : "")
      + `. Secciones: ${[...secs].join(", ")}`);
  },
};

/** Camino viejo: cimentacion de SAFE (f2k). Se mantiene tal cual funcionaba. */
function zapatasF2k(imported: any, states: any) {
  const nodes: Node[] = [];
  const elements: Element[] = [];
  const objects3D: THREE.Object3D[] = [];
  let nIdx = 0;
  const z0 = imported.Z ?? 0;
  for (const z of imported.zapatas) {
    const halfL = z.Lz / 2, halfB = z.Bz / 2;
    nodes.push([z.xC - halfL, z.yC - halfB, z0]); const n1 = nIdx++;
    nodes.push([z.xC + halfL, z.yC - halfB, z0]); const n2 = nIdx++;
    nodes.push([z.xC + halfL, z.yC + halfB, z0]); const n3 = nIdx++;
    nodes.push([z.xC - halfL, z.yC + halfB, z0]); const n4 = nIdx++;
    elements.push([n1, n2, n3, n4]);
    const colMesh = new THREE.Mesh(
      new THREE.BoxGeometry(z.bc, z.bc, 0.5),
      new THREE.MeshLambertMaterial({ color: 0x808080 }));
    colMesh.position.set(z.xCol, z.yCol, z0 + 0.25);
    objects3D.push(colMesh);
  }
  if (imported.vigasAmarre) {
    const vigasLines: THREE.Vector3[] = [];
    for (const v of imported.vigasAmarre) {
      const z = v.z ?? z0;
      const dx = v.x2 - v.x1, dy = v.y2 - v.y1;
      const len = Math.hypot(dx, dy);
      if (len < 1e-6) continue;
      vigasLines.push(new THREE.Vector3(v.x1, v.y1, z));
      vigasLines.push(new THREE.Vector3(v.x2, v.y2, z));
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(v.b, len, v.h),
        new THREE.MeshLambertMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.35 }));
      mesh.position.set((v.x1 + v.x2) / 2, (v.y1 + v.y2) / 2, z);
      mesh.rotateZ(Math.atan2(dy, dx) - Math.PI / 2);
      objects3D.push(mesh);
    }
    if (vigasLines.length) {
      objects3D.push(new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(vigasLines),
        new THREE.LineBasicMaterial({ color: 0x22d3ee, linewidth: 3 })));
    }
  }
  states.nodes.val = nodes;
  states.elements.val = elements;
  states.nodeInputs.val = { supports: new Map(), loads: new Map() };
  states.elementInputs.val = {
    elasticities: new Map(), shearModuli: new Map(), areas: new Map(),
    momentsOfInertiaY: new Map(), momentsOfInertiaZ: new Map(),
    torsionalConstants: new Map(), densities: new Map(), poissonsRatios: new Map(),
  };
  states.objects3D.val = objects3D;
  console.log(`[CSI Importer] f2k: ${imported.zapatas.length} zapatas + `
    + `${imported.vigasAmarre?.length ?? 0} vigas de amarre.`);
}
