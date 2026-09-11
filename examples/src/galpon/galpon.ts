/**
 * Galpón (nave industrial) — columnas + cerchas arqueadas con diagonales + correas.
 * Portado desde FEM Studio `galpon(...)`.
 */
import { deform, analyze, modalAnalysis, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";
import { paramsSeccion, seccionDe, formaSeccionDe, etiquetasSeccion, nombreSeccion, toLocalInertia, FORMAS }
  from "../shared/paramsSeccion";

const Es = 200e6, nu_s = 0.3, Gs = Es / (2 * (1 + nu_s));
/**
 * ⚠️ `densities` es masa, NO peso. Con E en kN/m² y coordenadas en m, la masa
 * tiene que ir en toneladas: `ρ = γ/g`. El motor lumpea `m = ρ·A·L`
 * (`getGlobalMassMatrix.cpp`), así que poner 78 (kN/m³) pesaba 9.81× de más y
 * el modo 1 salía a 0.0855 Hz (T = 11.7 s) en vez de a 0.268 Hz: √9.81 = 3.1321.
 */
const gamma_s = 78, G_GRAVITY = 9.81, rho_s = gamma_s / G_GRAVITY;  // 7.951 t/m³

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

export const galpon: ExampleDef = {
  id: "galpon",
  name: "Galpón (nave industrial)",
  category: "1️⃣ Frames · 🎯 n GDL Sistemas",
  defaultShellResult: "none",
  availableShellResults: ["none", "membraneXX", "membraneYY", "vonMises"],
  hasModal: true,
  params: {
    span:     P("Geometría", "Luz (m)", 12, 6, 30, 0.5),
    length:   P("Geometría", "Largo (m)", 20, 6, 60, 1),
    height:   P("Geometría", "Altura columna (m)", 6, 3, 15, 0.5),
    archRise: P("Geometría", "Flecha arco (m)", 3, 0.5, 8, 0.25),
    xDiv:     P("Geometría", "Div. X (arco)", 8, 4, 20, 1),
    yDiv:     P("Geometría", "Div. Y (longitud)", 4, 2, 12, 1),
    /**
     * La sección se define por su FORMA y sus DIMENSIONES, no por un área
     * suelta: con 20 cm² cabe un cuadrado de 4.47 cm, un IPE 160 o un tubo, y
     * su inercia se diferencia en veintiséis veces.
     *
     * Por defecto **tubo 150×150×6**, que es lo que se usa en una nave: sus dos
     * inercias son iguales, así que no depende de cómo esté girado el perfil.
     * Medido: T₁ = 0.82 s, dentro del 0.3–0.8 s que se espera de una nave de
     * acero. Con un IPE 160 —seleccionable— sale T₁ = 1.76 s, porque su eje
     * débil es **12 veces más flojo** y aquí las barras también flectan en él;
     * para usarlo de verdad haría falta orientar cada perfil con `ang`.
     */
    ...paramsSeccion("Secciones", { forma: FORMAS["Tubo rectangular"], h: 150, b: 150, t: 6,
                                    tf: 7.4, tw: 5.0 }),
    CM:       P("Cargas", "CM por nodo (kN)", -1, -10, 0, 0.1),
    cubierta: { default: 1, boolean: true, label: "Cubierta (membrana)", folder: "Cubierta" },
    tCub:     P("Cubierta", "Espesor cubierta (mm)", 6, 1, 25, 1),
    qCub:     P("Cubierta", "Carga cubierta (kN/m²)", -0.15, -3, 0, 0.05),
  },
  build(p, states) {
    const span = p.span, length = p.length, height = p.height, archRise = p.archRise;
    const xDiv = Math.round(p.xDiv), yDiv = Math.round(p.yDiv);
    const archZ = (x: number) => height + archRise * (1 - Math.pow(2 * x / span - 1, 2));
    const yn = yDiv + 1;

    const nodes: Node[] = [];
    const nid: number[][] = [];
    for (let iy = 0; iy < yn; iy++) {
      const row: number[] = [];
      const y = (length / yDiv) * iy;
      row.push(nodes.length); nodes.push([0, y, 0]);
      row.push(nodes.length); nodes.push([span, y, 0]);
      row.push(nodes.length); nodes.push([0, y, height]);
      for (let ix = 1; ix < xDiv; ix++) {
        const x = (span / xDiv) * ix;
        row.push(nodes.length); nodes.push([x, y, archZ(x)]);
      }
      row.push(nodes.length); nodes.push([span, y, height]);
      nid.push(row);
    }

    const elements: Element[] = [];
    // Por cada cercha (a lo largo de Y): columnas + arco
    for (let iy = 0; iy < yn; iy++) {
      const r = nid[iy];
      elements.push([r[0], r[2]]);                 // columna izq
      elements.push([r[1], r[r.length - 1]]);      // columna der
      for (let i = 2; i < r.length - 1; i++) elements.push([r[i], r[i + 1]]);  // arco
    }
    // Correas (longitudinales) entre cerchas
    for (let iy = 0; iy < yDiv; iy++)
      for (let iNode = 2; iNode < nid[0].length; iNode++)
        elements.push([nid[iy][iNode], nid[iy + 1][iNode]]);
    // Cruces (diagonales en techo para rigidizar)
    for (let iy = 0; iy < yDiv; iy++)
      for (let iNode = 2; iNode < nid[0].length - 1; iNode += 2)
        elements.push([nid[iy][iNode], nid[iy + 1][iNode + 1]]);

    // ── Cubierta: paños Q4 de MEMBRANA sobre el techo ──────────────────────
    // Cada paño va entre dos cerchas (iy, iy+1) y dos nodos del arco (k, k+1).
    // Sus 4 esquinas SON nodos de correa (las correas cruzan todos los nodos de
    // techo), así que la carga de la cubierta baja a las correas por los nudos
    // compartidos — es el «la membrana reparte a las correas» de una nave real.
    const cubierta = p.cubierta > 0.5;
    const tCub = p.tCub / 1000;            // mm → m
    const nFrames = elements.length;       // todo lo de arriba son barras
    const panels: number[][] = [];
    if (cubierta) {
      for (let iy = 0; iy < yDiv; iy++)
        for (let k = 2; k < nid[0].length - 1; k++) {
          const q = [nid[iy][k], nid[iy][k + 1], nid[iy + 1][k + 1], nid[iy + 1][k]];
          panels.push(q);
          elements.push(q as unknown as Element);
        }
    }
    // Área 3D de un cuadrilátero (dos triángulos por el producto cruz).
    const areaQuad = (q: number[]) => {
      const P0 = nodes[q[0]], P1 = nodes[q[1]], P2 = nodes[q[2]], P3 = nodes[q[3]];
      const cross = (a: number[], b: number[], c: number[]) => {
        const u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]], v = [c[0]-a[0], c[1]-a[1], c[2]-a[2]];
        const x = u[1]*v[2]-u[2]*v[1], y = u[2]*v[0]-u[0]*v[2], z = u[0]*v[1]-u[1]*v[0];
        return 0.5 * Math.hypot(x, y, z);
      };
      return cross(P0, P1, P2) + cross(P0, P2, P3);
    };

    // Supports en base de columnas (empotrados)
    const supports = new Map<number,[boolean,boolean,boolean,boolean,boolean,boolean]>();
    for (let iy = 0; iy < yn; iy++) {
      supports.set(nid[iy][0], [true, true, true, true, true, true]);
      supports.set(nid[iy][1], [true, true, true, true, true, true]);
    }

    // Cargas verticales (CM) en nodos del arco (techo)
    const loads = new Map<number,[number,number,number,number,number,number]>();
    const addFz = (n: number, fz: number) => {
      const cur = loads.get(n) ?? [0, 0, 0, 0, 0, 0];
      cur[2] += fz; loads.set(n, cur as [number,number,number,number,number,number]);
    };
    if (p.CM !== 0) {
      for (let iy = 0; iy < yn; iy++)
        for (let i = 2; i < nid[iy].length; i++)
          addFz(nid[iy][i], p.CM);
    }
    // Carga de la cubierta (kN/m²): tributaria a las 4 esquinas de cada paño =
    // los nudos de correa. Así «la membrana reparte a las correas».
    if (cubierta && p.qCub !== 0) {
      for (const q of panels) {
        const fn = p.qCub * areaQuad(q) / 4;
        for (const n of q) addFz(n, fn);
      }
    }

    /**
     * Perfil metálico uniforme. Antes esto era `A = p.barA` con
     * `I = A²/12` — la inercia de un CUADRADO MACIZO de lado √A: con 20 cm²,
     * 4.47×4.47 cm. Un IPE 160 de la MISMA área tiene 26 veces más inercia, y
     * √26 = 5.1 es justo lo que le faltaba al periodo (11.7 s contra 0.73 s).
     * Ahora la sección se define por su forma y sus dimensiones, y A, I33, I22
     * y J salen de las fórmulas de `cadSections.ts`.
     */
    const sec = seccionDe(p);
    const A = sec.A;
    const { moiZ, moiY } = toLocalInertia(sec);
    const elasticities = new Map<number, number>();
    const shearModuli = new Map<number, number>();
    const areas = new Map<number, number>();
    // Nombrados por lo que SON en la convencion CSI (ver CLAUDE.md): I33 es el
    // eje fuerte y va en `momentsOfInertiaZ`; I22 el debil, en
    // `momentsOfInertiaY`. Antes los mapas se llamaban Iz/Iy y se asignaban
    // CRUZADOS; con las dos inercias iguales no se notaba, pero con un perfil
    // de verdad el eje fuerte habria acabado flectando por el debil.
    const I33 = new Map<number, number>();
    const I22 = new Map<number, number>();
    const J = new Map<number, number>();
    const densities = new Map<number, number>();
    const poissons = new Map<number, number>();
    // La FORMA, para el visor: sin esto la vista extruida no tiene poligono que
    // barrer y el galpon se sigue viendo con lineas.
    const forma = formaSeccionDe(p);
    const sectionShapes = new Map<number, any>();
    const thicknesses = new Map<number, number>();
    // 2 = Membrane (solo trabaja en su plano) para los paños de cubierta, así
    // el e2k/s2k salen con MODELINGTYPE "Membrane" y no como placa gruesa.
    const plateFormulations = new Map<number, number>();
    // Barras (0 .. nFrames-1): sección de acero.
    for (let i = 0; i < nFrames; i++) {
      elasticities.set(i, Es); shearModuli.set(i, Gs); poissons.set(i, nu_s);
      densities.set(i, rho_s);
      areas.set(i, A); I33.set(i, moiZ); I22.set(i, moiY); J.set(i, sec.J);
      sectionShapes.set(i, forma);
    }
    // Paños de cubierta (nFrames .. fin): membrana delgada, peso via qCub.
    for (let i = nFrames; i < elements.length; i++) {
      elasticities.set(i, Es); shearModuli.set(i, Gs); poissons.set(i, nu_s);
      thicknesses.set(i, tCub); densities.set(i, 0);
      plateFormulations.set(i, 2);   // Membrane
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = {
      elasticities, shearModuli, areas,
      momentsOfInertiaY: I22, momentsOfInertiaZ: I33, torsionalConstants: J,
      densities, poissonsRatios: poissons, sectionShapes, thicknesses, plateFormulations,
    };
    const deformOut = deform(nodes, elements, states.nodeInputs.val, states.elementInputs.val);
    states.deformOutputs.val = deformOut;
    states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, deformOut);
    states.objects3D.val = [];
  },
  /** Lo que sale de la forma y las dimensiones, a la vista. */
  computedLabels: (p) => etiquetasSeccion(p),
  runModal(p, states, modalPanel) {
    const nodes = states.nodes.val;
    const elements = states.elements.val;
    const ni = states.nodeInputs.val;
    const ei = states.elementInputs.val;
    if (!nodes.length || !elements.length || !ni.supports?.size || !ei.densities?.size) return;
    try {
      const out = modalAnalysis(nodes, elements, ni, ei, 12);
      modalPanel.render(out, {
        title: `Galpón L=${p.span}m largo=${p.length}m`,
        properties: [`Altura ${p.height}m + arco ${p.archRise}m  ·  ${nombreSeccion(p)}  ·  A=${(seccionDe(p).A*1e4).toFixed(1)} cm²  acero`],
      });
    } catch (e: any) { console.warn("Modal galpón error:", e.message); }
  },
};
