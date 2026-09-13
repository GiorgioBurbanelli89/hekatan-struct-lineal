import * as THREE from "three";
import van, { State } from "vanjs-core";
import { Node, Structure } from "hekatan-fem";
import { Settings } from "../settings/getSettings";
import { getTransformationMatrixBeam } from "./utils/getTransformationMatrixBeam";

/**
 * 🧱 VISTA EXTRUIDA — las barras con su sección real y las cáscaras con su
 * espesor, no líneas y planos.
 *
 * ## Cómo lo hace ETABS, leído del binario
 *
 * `CSIOpenGL.dll` —el módulo que dibuja— trae `DTSweep`, `DTSweepContext`,
 * `AddHole`, `AddSteinerPoint`, `AddTriangle`: es **Poly2Tri**, una
 * triangulación de Delaunay con restricciones. O sea que ETABS **triangula el
 * polígono de la sección**, huecos incluidos, y barre esos triángulos a lo
 * largo de la barra. No tiene una malla por tipo de perfil: tiene el contorno.
 *
 * Aquí se hace igual, y encaja con el Section Designer, que ya devuelve
 * contornos: `THREE.Shape` con sus `holes` + `ExtrudeGeometry` triangula
 * (earcut, el mismo problema resuelto igual) y extruye. Una forma nueva no
 * necesita nada: si sabe dar su contorno, se extruye.
 *
 * ## Los ejes
 *
 * La sección se dibuja en el plano local 2-3 y se barre a lo largo del eje 1,
 * con la tríada de CSI (eje 1 = i→j, eje 2 = en el plano vertical hacia arriba,
 * eje 3 = 1×2): si la extrusión usara otra, enseñaría una viga tumbada donde el
 * modelo tiene una de canto — y eso es justo lo que hay que ver de un vistazo.
 *
 * ⚠️ `getTransformationMatrixBeam` devuelve un **`THREE.Matrix4`**, no una
 * matriz de filas: `T[2][0]` no es un error de números, es `undefined`. Y lo
 * peor es que reventaba DENTRO del `van.derive`, que se traga la excepción: no
 * salía nada en consola, no había `pageerror`, y el modelo simplemente seguía
 * dibujado con líneas. Se usa igual que en `sections.ts` — sección en el plano
 * x=0, eje de la barra en +X — y esa es la referencia a mirar, no la memoria.
 */

/** Contorno y huecos de una sección, en el plano local (3, 2) y en metros. */
export interface ContornoSeccion {
  contorno: Array<[number, number]>;
  huecos?: Array<Array<[number, number]>>;
}

/**
 * El contorno de una `SectionShape`. Devuelve null si no se sabe dibujar.
 *
 * ⚠️ Los nombres de los campos son los de `hekatan-fem/data-model.ts`, y hay
 * que mirarlos ahí y no suponerlos: el canto es **`h`**, no `d` — `d` es el
 * DIAMETRO y solo lo usan `circ` y `pipe`. Y los tipos son
 * `rect · circ · I · HSS · CFT · L · 2L · C · 2C · T · pipe · coldC`, no los
 * nombres del Section Designer. Con los nombres inventados no fallaba nada:
 * simplemente no se dibujaba una sola barra, que es peor.
 */
export function contornoDeSeccion(sh: any): ContornoSeccion | null {
  if (!sh) return null;
  const t = sh.type as string;
  const P = (x: number, y: number): [number, number] => [x, y];
  const rect = (b: number, h: number): Array<[number, number]> =>
    [P(-b / 2, -h / 2), P(b / 2, -h / 2), P(b / 2, h / 2), P(-b / 2, h / 2)];
  const circ = (dia: number, n = 24): Array<[number, number]> => {
    const r = dia / 2, p: Array<[number, number]> = [];
    for (let i = 0; i < n; i++) {
      const a = (2 * Math.PI * i) / n;
      p.push(P(r * Math.cos(a), r * Math.sin(a)));
    }
    return p;
  };
  const b = sh.b ?? 0, h = sh.h ?? 0, dia = sh.d ?? 0;
  // Espesores: `t` es el uniforme (L y conformada); `tw`/`tf` los del perfil.
  const tw = sh.tw ?? sh.t ?? 0, tf = sh.tf ?? sh.t ?? 0;

  switch (t) {
    case "rect":
      return b && h ? { contorno: rect(b, h) } : null;
    case "circ":
      return dia ? { contorno: circ(dia) } : null;
    case "pipe":
      return dia && tw ? { contorno: circ(dia), huecos: [circ(dia - 2 * tw).reverse()] } : null;
    case "HSS":
      // Tubo rectangular: el hueco al revés, para que reste.
      return b && h && tw ? { contorno: rect(b, h),
        huecos: [rect(b - 2 * tw, h - 2 * (tf || tw)).reverse()] } : null;
    case "CFT":
      // Relleno de hormigón: por fuera es el mismo tubo, y macizo — se dibuja
      // lleno a propósito, que es lo que se ve en obra.
      return b && h ? { contorno: rect(b, h) } : null;
    case "I":
      if (!(b && h && tw && tf)) return null;
      return { contorno: [
        P(-b / 2, -h / 2), P(b / 2, -h / 2), P(b / 2, -h / 2 + tf), P(tw / 2, -h / 2 + tf),
        P(tw / 2, h / 2 - tf), P(b / 2, h / 2 - tf), P(b / 2, h / 2), P(-b / 2, h / 2),
        P(-b / 2, h / 2 - tf), P(-tw / 2, h / 2 - tf), P(-tw / 2, -h / 2 + tf), P(-b / 2, -h / 2 + tf),
      ] };
    case "C":
    case "2C":
    case "coldC":
      if (!(b && h && tw && tf)) return null;
      // El alma a la izquierda y las dos alas a la derecha.
      return { contorno: [
        P(-b / 2, -h / 2), P(b / 2, -h / 2), P(b / 2, -h / 2 + tf), P(-b / 2 + tw, -h / 2 + tf),
        P(-b / 2 + tw, h / 2 - tf), P(b / 2, h / 2 - tf), P(b / 2, h / 2), P(-b / 2, h / 2),
      ] };
    case "T":
      if (!(b && h && tw && tf)) return null;
      return { contorno: [
        P(-tw / 2, -h / 2), P(tw / 2, -h / 2), P(tw / 2, h / 2 - tf), P(b / 2, h / 2 - tf),
        P(b / 2, h / 2), P(-b / 2, h / 2), P(-b / 2, h / 2 - tf), P(-tw / 2, h / 2 - tf),
      ] };
    case "L":
    case "2L":
      if (!(b && h && tw)) return null;
      return { contorno: [
        P(-b / 2, -h / 2), P(b / 2, -h / 2), P(b / 2, -h / 2 + tw), P(-b / 2 + tw, -h / 2 + tw),
        P(-b / 2 + tw, h / 2), P(-b / 2, h / 2),
      ] };
    default:
      // Cotas sin tipo conocido: el rectángulo que las envuelve. Y si no hay ni
      // cotas, NADA — dibujar una sección inventada es peor que no dibujarla.
      return b && h ? { contorno: rect(b, h) } : (dia ? { contorno: circ(dia) } : null);
  }
}

/**
 * Cuando el ejemplo NO declara la forma: el **rectángulo equivalente** que sale
 * de A, I22 e I33, que sí están siempre porque son lo que come el solver.
 *
 *     b·h = A            (misma área → mismo peso y mismo axil)
 *     h/b = √(I33/I22)   (misma esbeltez → se ve por dónde flecta)
 *
 * No es la sección real y no se hace pasar por ella: se dibuja en OTRO color.
 * Pero tampoco es un invento — sale de la rigidez que el modelo está usando de
 * verdad, y enseña lo único que importa de un vistazo: una viga de canto se ve
 * de canto y una tumbada, tumbada. Hoy solo 10 de los ~58 ejemplos declaran
 * `sectionShapes`; sin esto, en los otros 48 la vista extruida no dibuja nada.
 */
export function rectanguloEquivalente(
  A?: number, I22?: number, I33?: number,
): ContornoSeccion | null {
  if (!A || A <= 0 || !I22 || !I33 || I22 <= 0 || I33 <= 0) return null;
  const r = Math.sqrt(Math.sqrt(I33 / I22));   // h/b
  const b = Math.sqrt(A / r), h = A / b;
  if (!isFinite(b) || !isFinite(h) || b <= 0 || h <= 0) return null;
  return { contorno: [[-b / 2, -h / 2], [b / 2, -h / 2], [b / 2, h / 2], [-b / 2, h / 2]] };
}

/** Un `THREE.Shape` con sus huecos, listo para extruir. */
function aShape(c: ContornoSeccion): THREE.Shape {
  const s = new THREE.Shape();
  c.contorno.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  for (const h of c.huecos ?? []) {
    const p = new THREE.Path();
    h.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y)));
    p.closePath();
    s.holes.push(p);
  }
  return s;
}

/**
 * La vista extruida del modelo.
 *
 * Se recalcula cuando cambian los nudos (para que siga a la deformada) o el
 * ajuste `extruded`.
 */
export function extrusion(
  structure: Structure,
  settings: Settings,
  derivedNodes: State<Node[]>,
): THREE.Group {
  const group = new THREE.Group();
  // Con nombre para poder CONTARLO desde fuera: sin eso se cuentan las mallas
  // de toda la escena (los nudos son esferas) y siempre sale un numero grande
  // que no dice si se extruyo algo.
  group.name = "extrusion";
  const matBarra = new THREE.MeshLambertMaterial({
    color: 0x7fb3ff, transparent: true, opacity: 0.92, side: THREE.DoubleSide });
  // Otro color a propósito para el rectángulo equivalente: quien lo mire tiene
  // que poder distinguir «esta es la sección» de «esta es la equivalente».
  const matEquiv = new THREE.MeshLambertMaterial({
    color: 0xc0a060, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
  const matShell = new THREE.MeshLambertMaterial({
    color: 0xb0bec5, transparent: true, opacity: 0.85, side: THREE.DoubleSide });

  // ⚠️ Luces PROPIAS. La escena solo las pone si el ejemplo trae `solids`, asi
  // que sin esto un material Lambert sale NEGRO: se extruye bien y parece que
  // no se extruyo nada. Cuelgan del grupo a proposito — con `visible = false`
  // three ni las recorre, asi que se apagan con la vista.
  const luces = new THREE.Group();
  luces.add(new THREE.AmbientLight(0xffffff, 0.55));
  const l1 = new THREE.DirectionalLight(0xffffff, 0.75); l1.position.set(30, 25, 40);
  const l2 = new THREE.DirectionalLight(0xffffff, 0.35); l2.position.set(-25, -20, 15);
  luces.add(l1, l2);

  let corridas = 0;
  van.derive(() => {
    const on = settings.extruded?.val ?? false;
    (globalThis as any).__extrusionDebug = { corridas: ++corridas, on };
    group.visible = on;
    // Fuera lo anterior: una malla extruida por barra se acumula rápido y en un
    // modelo de mil barras eso es memoria que no se suelta.
    for (const h of [...group.children]) {
      if (h === luces) continue;
      group.remove(h);
      (h as THREE.Mesh).geometry?.dispose?.();
    }
    if (!group.children.includes(luces)) group.add(luces);
    if (!on) return;

    const nodes = derivedNodes.val ?? [];
    const elements = structure.elements?.val ?? [];
    const ei: any = structure.elementInputs?.val ?? {};
    const formas: Map<number, any> = ei.sectionShapes ?? new Map();
    const espesores: Map<number, number> = ei.thicknesses ?? new Map();

    let fallo = "";
    try {
    elements.forEach((el: number[], i: number) => {
      // ── BARRAS: el contorno barrido a lo largo del eje 1 ──
      if (el.length === 2) {
        let c = contornoDeSeccion(formas.get(i));
        let real = true;
        if (!c) {
          c = rectanguloEquivalente(ei.areas?.get(i),
            ei.momentsOfInertiaY?.get(i), ei.momentsOfInertiaZ?.get(i));
          real = false;
        }
        if (!c) return;                       // sin datos no se inventa nada
        const n1 = nodes[el[0]], n2 = nodes[el[1]];
        if (!n1 || !n2) return;
        const L = Math.hypot(n2[0] - n1[0], n2[1] - n1[1], n2[2] - n1[2]);
        if (L < 1e-9) return;
        const geo = new THREE.ExtrudeGeometry(aShape(c), {
          depth: L, bevelEnabled: false, curveSegments: 4 });
        // `ExtrudeGeometry` crece en +Z y dibuja la seccion en (x, y). La
        // matriz de la barra —la MISMA que usa `sections.ts`— espera lo otro:
        // la seccion en el plano x=0 y el eje de la barra en +X. Se arregla con
        // la permutacion ciclica x→y→z→x, que lleva el +Z de la extrusion al
        // +X de la barra y de paso pone b en el eje local 2 y h en el 3, igual
        // que `makeRect` de sections.
        geo.applyMatrix4(new THREE.Matrix4().set(
          0, 0, 1, 0,
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 0, 1));
        const mesh = new THREE.Mesh(geo, real ? matBarra : matEquiv);
        mesh.position.set(n1[0], n1[1], n1[2]);
        mesh.rotation.setFromRotationMatrix(getTransformationMatrixBeam(n1, n2));
        group.add(mesh);
        return;
      }
      // ── CÁSCARAS: el polígono con su espesor, medio arriba y medio abajo ──
      if (el.length === 3 || el.length === 4) {
        const t = espesores.get(i);
        if (!t || t <= 0) return;
        const p = el.map((k) => nodes[k]).filter(Boolean);
        if (p.length < 3) return;
        // Normal del polígono, para saber hacia dónde dar el espesor.
        const u = [p[1][0] - p[0][0], p[1][1] - p[0][1], p[1][2] - p[0][2]];
        const v = [p[2][0] - p[0][0], p[2][1] - p[0][1], p[2][2] - p[0][2]];
        const nx = u[1] * v[2] - u[2] * v[1];
        const ny = u[2] * v[0] - u[0] * v[2];
        const nz = u[0] * v[1] - u[1] * v[0];
        const ln = Math.hypot(nx, ny, nz);
        if (ln < 1e-12) return;
        const n = [nx / ln, ny / ln, nz / ln];
        const pos: number[] = [];
        const cara = (s: number) => p.map((q) => [q[0] + n[0] * s, q[1] + n[1] * s, q[2] + n[2] * s]);
        // Punto de inserción como ETABS (e2k real: losas `CARDINALPOINT "TOP"`,
        // muros `"MIDDLE"`): una LOSA (o bóveda, normal con componente vertical)
        // se dibuja por su cara SUPERIOR y el espesor cuelga hacia ABAJO; un muro
        // se dibuja por su plano medio y el espesor va mitad y mitad. Antes todo
        // iba ±t/2 y la losa sobresalía medio canto por encima del nivel.
        // (Jorge, 13-sep-2026: «esa es la parte superior… las losas desde la
        // parte superior hacia abajo».)
        const esLosa = Math.abs(n[2]) > 0.5;
        const haciaAbajo = n[2] > 0 ? -1 : 1;           // el sentido de la normal que baja
        const A = esLosa ? cara(0) : cara(+t / 2);
        const B = esLosa ? cara(haciaAbajo * t) : cara(-t / 2);
        const tri = (a: number[], b: number[], c: number[]) => pos.push(...a, ...b, ...c);
        // dos tapas
        for (const f of [A, B]) {
          tri(f[0], f[1], f[2]);
          if (f.length === 4) tri(f[0], f[2], f[3]);
        }
        // y el canto
        for (let k = 0; k < p.length; k++) {
          const k2 = (k + 1) % p.length;
          tri(A[k], B[k], B[k2]);
          tri(A[k], B[k2], A[k2]);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        geo.computeVertexNormals();
        group.add(new THREE.Mesh(geo, matShell));
      }
    });
    } catch (e: any) { fallo = String(e?.message ?? e); }
    (globalThis as any).__extrusionDebug = {
      corridas, on, fallo, nElementos: elements.length, nFormas: formas.size,
      nEspesores: espesores.size, mallas: group.children.length - 1 };
  });

  return group;
}
