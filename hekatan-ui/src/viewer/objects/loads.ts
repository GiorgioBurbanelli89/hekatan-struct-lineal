import * as THREE from "three";
import van, { State } from "vanjs-core";
import { Node } from "hekatan-fem";
import { Structure } from "hekatan-fem";
import { Settings } from "../settings/getSettings";
import { Text } from "./Text";

export function loads(
  structure: Structure,
  settings: Settings,
  derivedNodes: State<Node[]>,
  derivedDisplayScale: State<number>
): THREE.Group {
  const group = new THREE.Group();
  group.name = "loadsGroup";

  /** Compute arrow size based on actual model extent (5% of bounding box diagonal) */
  function getArrowSize(nodes: Node[]): number {
    if (nodes.length < 2) return 0.12 * settings.gridSize.rawVal;
    const mins = [Infinity, Infinity, Infinity];
    const maxs = [-Infinity, -Infinity, -Infinity];
    for (const n of nodes) {
      for (let i = 0; i < 3; i++) {
        mins[i] = Math.min(mins[i], n[i]);
        maxs[i] = Math.max(maxs[i], n[i]);
      }
    }
    const extent = Math.max(maxs[0] - mins[0], maxs[1] - mins[1], maxs[2] - mins[2], 0.1);
    return 0.08 * extent;
  }

  // on settings.loads & deformedShape, and model clear and create visuals
  van.derive(() => {
    settings.deformedShape.val; // trigger update

    if (!settings.loads.val) return;

    group.children.forEach((o: any) => o.dispose?.());
    group.clear();

    const nodes = derivedNodes.val;
    const size = getArrowSize(nodes);

    // ── Cuántas flechas dibujar, y por qué NO una por nudo ──────────────────
    //
    // Jorge, mirando un edificio con losa: *«veo cargas puntuales… esa
    // deformación visual no está bien, esas cargas»*, y *«debe ser el mismo que
    // usa ETABS visualmente»*.
    //
    // Tenía razón. Una carga de superficie acaba SIEMPRE como fuerzas en los
    // nudos —así funciona un FEM— pero eso es un detalle interno del solver, y
    // dibujarlo tal cual convierte una losa mallada a 0.5 m en un bosque de
    // 5476 flechas que tapa el modelo y se lee como si hubiera miles de cargas
    // puntuales. ETABS no lo hace: guarda la carga como `Area Load Assignment`
    // sobre el objeto (sus propios rótulos: «Shell Loads - Uniform», «Area Load
    // Assignments») y dibuja un campo REGULAR de flechas, con una densidad que
    // no depende de la malla.
    //
    // Aquí se hace lo mismo sin cambiar el modelo: si hay más nudos cargados que
    // `MAX_FLECHAS`, se reparten en una rejilla y se dibuja UNA por celda — la
    // que caiga más cerca del centro de la celda. El campo queda uniforme y con
    // la misma densidad tanto si la losa tiene 200 nudos como 20 000.
    //
    // ⚠️ Las flechas pasan a ser una REPRESENTACIÓN del campo de carga, no un
    // inventario. El modelo no cambia: la comprobación de que la carga es la
    // correcta es que las reacciones sumen lo aplicado (`plantillas_modelo_sano`
    // lo mide, y da 0.000 %).
    const MAX_FLECHAS = 240;
    const cargados: number[] = [];
    structure.nodeInputs?.val?.loads?.forEach((load, index) => {
      if (!nodes[index]) return;
      if (load.slice(0, 3).some((v: number) => Math.abs(v) > 1e-15)) cargados.push(index);
    });

    let dibujar: number[] = cargados;
    if (cargados.length > MAX_FLECHAS) {
      // Rejilla en planta con ~MAX_FLECHAS celdas; una flecha por celda ocupada.
      const xs = cargados.map((i) => nodes[i][0]), ys = cargados.map((i) => nodes[i][1]);
      const x0 = Math.min(...xs), x1 = Math.max(...xs);
      const y0 = Math.min(...ys), y1 = Math.max(...ys);
      // Los niveles se tratan aparte: si no, dos plantas se pisarían en la misma
      // celda y solo se vería la carga de una.
      //
      // ⚠️ `derivedNodes` son las coordenadas DEFORMADAS. Redondear su `z` a
      // cuatro decimales daba un «nivel» por nudo —tres mil en vez de cuatro— y
      // el submuestreo no reducía nada: seguían saliendo 2953 flechas. Hay que
      // agrupar con una TOLERANCIA proporcional a la altura del modelo, que es
      // lo único que separa plantas de ruido de la deformada.
      const zsRaw = cargados.map((i) => nodes[i][2]);
      const zTol = Math.max(1e-6, (Math.max(...zsRaw) - Math.min(...zsRaw)) / 40);
      const nivel = (z: number) => Math.round(z / zTol);
      const zs = new Set(zsRaw.map(nivel));
      const porNivel = Math.max(4, Math.floor(MAX_FLECHAS / Math.max(1, zs.size)));
      const nc = Math.max(2, Math.round(Math.sqrt(porNivel)));
      const mejor = new Map<string, { i: number; d: number }>();
      for (const i of cargados) {
        const u = (x1 - x0) < 1e-9 ? 0 : (nodes[i][0] - x0) / (x1 - x0);
        const v = (y1 - y0) < 1e-9 ? 0 : (nodes[i][1] - y0) / (y1 - y0);
        const cu = Math.min(nc - 1, Math.floor(u * nc));
        const cv = Math.min(nc - 1, Math.floor(v * nc));
        const clave = `${cu},${cv},${nivel(nodes[i][2])}`;
        // el mas cercano al CENTRO de su celda, para que el campo salga regular
        const d = Math.hypot(u * nc - (cu + 0.5), v * nc - (cv + 0.5));
        const y = mejor.get(clave);
        if (!y || d < y.d) mejor.set(clave, { i, d });
      }
      dibujar = [...mejor.values()].map((m) => m.i);
    }

    // UNA FLECHA POR COMPONENTE, con su largo y su valor — como ETABS.
    // Antes era una flecha por nudo en la dirección de la SUMA: en una combinación con peso
    // y sismo en el mismo nudo salía INCLINADA, y todas medían igual (Jorge: «se ve feo
    // solo la suma de cargas en diferentes sentidos»). Ahora la vertical y la horizontal
    // van cada una por su lado; el largo sigue a la magnitud (con un mínimo para que se
    // vea) y la punta toca el nudo. Vertical en naranja, lateral en rojo.
    let maxAbs = 0;
    for (const index of dibujar) {
      const load = structure.nodeInputs!.val!.loads!.get(index)!;
      for (let c = 0; c < 3; c++) maxAbs = Math.max(maxAbs, Math.abs(load[c]));
    }
    const conValor = dibujar.length <= 60;
    const fmt = (v: number) => {
      const a = Math.abs(v);
      return a >= 100 ? v.toFixed(0) : a >= 10 ? v.toFixed(1) : v.toFixed(2);
    };
    for (const index of dibujar) {
      const load = structure.nodeInputs!.val!.loads!.get(index)!;
      const position = nodes[index];
      if (!position) continue;
      for (let c = 0; c < 3; c++) {
        const v = load[c];
        if (!(Math.abs(v) > 1e-9 * (maxAbs || 1))) continue;
        const dir = new THREE.Vector3(c === 0 ? Math.sign(v) : 0, c === 1 ? Math.sign(v) : 0, c === 2 ? Math.sign(v) : 0);
        const rel = 0.45 + 0.55 * (maxAbs ? Math.abs(v) / maxAbs : 1);
        const arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(...position), 1,
          c === 2 ? 0xee9b00 : 0xe5382b, 0.3, 0.3);
        arrow.userData = { nudo: position, dir, rel };
        group.add(arrow);
        if (conValor) {
          const t = new Text(fmt(v), c === 2 ? "#f5b642" : "#ff6b5e");
          t.userData = { nudo: position, dir, rel, texto: true };
          group.add(t);
        }
      }
    }
    colocar(size * derivedDisplayScale.rawVal);
  });

  /** Tamaño y sitio de cada flecha y su valor: la punta en el nudo, la cola hacia fuera. */
  function colocar(escala: number) {
    group.children.forEach((o: any) => {
      const u = o.userData;
      if (!u?.dir) return;
      const largo = escala * u.rel;
      const cola = new THREE.Vector3(...u.nudo).addScaledVector(u.dir, -largo * (u.texto ? 1.12 : 1));
      o.position.copy(cola);
      if (u.texto) o.updateScale(escala * 0.38);
      else o.scale.set(largo, largo, largo);
    });
  }

  van.derive(() => {
    derivedDisplayScale.val; // triggers update

    if (!settings.loads.rawVal) return;

    colocar(getArrowSize(derivedNodes.rawVal) * derivedDisplayScale.rawVal);
  });

  // on settings.loads update update visibility
  van.derive(() => {
    group.visible = settings.loads.val;
  });

  return group;
}
