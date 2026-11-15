/**
 * Deep Beam FEA (Calcpad, Mechanics > Finite Elements) — viga de gran peralte como MEMBRANA (tensión plana Q4).
 *
 * Mismo problema que `Deep Beam FEA.cpd` y `SAP 2000/Plane-20x10.s2k`: viga de 4 × 2 m, t = 0.1 m, E = 20000 MPa,
 * ν = 0.2, malla 20 × 10 (200 elementos, 231 nudos). Resortes verticales de 500500 / 1e6 / 500500 kN/m en los
 * tres primeros y tres últimos nudos de la base, U1 = 0 en el eje de simetría (x = 0) y 80 kN en cinco nudos
 * de la cara superior (10 + 20 + 20 + 20 + 10).
 *
 * Plano vertical X-Z (X horizontal, Z altura; Y = normal), x de −2 a 2 m como en el .s2k.
 * Solver: `planeQ4Solve` (Q4 isoparamétrico 2×2 Gauss). «Modos incompatibles» apagado = el Q4 de Calcpad;
 * encendido = el defecto de SAP2000 (Wilson). Medido (en 10⁻³ mm; ux esquina / uy bajo la carga / uy arriba):
 *   apagado  54.298 / 125.354 / 164.499  (= Calcpad = SAP2000 Plane sin modos incompatibles)
 *   encendido 54.366 / 125.965 / 165.351  (= SAP2000 Plane por defecto)
 */
import * as THREE from "three";
import van from "vanjs-core";
import { planeQ4Solve, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";
import { activeExampleVersion } from "../workspace/exampleVersion";

const NL = 20, NH = 10, L = 4, H = 2;

export const deepBeamFea: ExampleDef = {
  id: "deep-beam-fea",
  name: "Deep Beam FEA (Calcpad): membrana Q4 con resortes",
  category: "2️⃣ Shells · 🕸 Membranas",
  defaultShellResult: "displacementZ",
  availableShellResults: [
    "none", "membraneXX", "membraneYY", "membraneXY", "vonMises",
    "displacementX", "displacementZ",
  ],
  params: {
    incomp: { default: 0, boolean: true, label: "Modos incompatibles de Wilson (defecto de SAP2000)" },
  },
  build(p, states) {
    const l1 = L / NL, h1 = H / NH;
    const idx = (i: number, j: number) => i * (NH + 1) + j;
    const nodes2: [number, number][] = [];
    for (let i = 0; i <= NL; i++) for (let j = 0; j <= NH; j++) nodes2.push([i * l1, j * h1]);
    const elems: [number, number, number, number][] = [];
    for (let i = 0; i < NL; i++) for (let j = 0; j < NH; j++) elems.push([idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)]);

    const springs = ([[0, 500500], [1, 1e6], [2, 500500], [NL - 2, 500500], [NL - 1, 1e6], [NL, 500500]] as [number, number][])
      .map(([i, k]) => ({ node: idx(i, 0), dof: 1 as const, k }));
    const bcs: { node: number; dof: 0 | 1; value: number }[] = [];
    for (let j = 0; j <= NH; j++) bcs.push({ node: idx(NL / 2, j), dof: 0, value: 0 });          // U1 = 0 en el eje
    const cargas: [number, number][] = [[NL / 2 - 2, -10], [NL / 2 - 1, -20], [NL / 2, -20], [NL / 2 + 1, -20], [NL / 2 + 2, -10]];
    const pointLoads = cargas.map(([i, f]) => ({ node: idx(i, NH), fx: 0, fy: f }));

    const r = planeQ4Solve({
      E: 2e7, nu: 0.2, thickness: 0.1, nodes: nodes2, elements: elems, bcs, pointLoads, springs,
      incompatibleModes: !!p.incomp,
    });

    // (x, y) → (X, 0, Z) con x de −2 a 2
    const nodes: Node[] = nodes2.map(([x, y]) => [x - L / 2, 0, y]);
    const elements: Element[] = elems.map((e) => [...e] as Element);
    states.nodes.val = nodes;
    states.elements.val = elements;

    // Sin marcadores de apoyo: U1 = 0 en x = 0 ya está impuesto en planeQ4Solve (bcs) y aquí se dibuja como línea de simetría.
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    const loads = new Map<number, [number, number, number, number, number, number]>();
    cargas.forEach(([i, f]) => loads.set(idx(i, NH), [0, 0, f, 0, 0, 0]));
    states.nodeInputs.val = { supports, loads };

    const th = new Map<number, number>(), E = new Map<number, number>(), nu = new Map<number, number>(), rho = new Map<number, number>();
    elements.forEach((_, i) => { th.set(i, 0.1); E.set(i, 2e7); nu.set(i, 0.2); rho.set(i, 2.4); });
    states.elementInputs.val = { thicknesses: th, elasticities: E, poissonsRatios: nu, densities: rho };

    const deformations = new Map<number, [number, number, number, number, number, number]>();
    r.nodeResults.forEach((n, i) => deformations.set(i, [n.ux, 0, n.uy, 0, 0, 0]));
    states.deformOutputs.val = { deformations };

    const mXX = new Map<number, number[]>(), mYY = new Map<number, number[]>(), mXY = new Map<number, number[]>(), vm = new Map<number, number[]>();
    r.elementResults.forEach((er, i) => {
      mXX.set(i, [er.sigma_xx, er.sigma_xx, er.sigma_xx, er.sigma_xx]);
      mYY.set(i, [er.sigma_yy, er.sigma_yy, er.sigma_yy, er.sigma_yy]);
      mXY.set(i, [er.tau_xy, er.tau_xy, er.tau_xy, er.tau_xy]);
      vm.set(i, [er.vonMises, er.vonMises, er.vonMises, er.vonMises]);
    });
    states.analyzeOutputs.val = { membraneXX: mXX, membraneYY: mYY, membraneXY: mXY, vonMises: vm };

    // Resortes (bobina helicoidal roja con tierra rayada) y eje de simetría. Siguen a la deformada visual: la punta de cada
    // resorte va al nudo deformado (nodo + deformación × deformScale, el MISMO factor del visor) y la tierra queda fija.
    // Se reconstruyen al mover «Deformada» / escala de deformación / escala de símbolos (como en la zapata aislada).
    const tubo = (pts: THREE.Vector3[], radio: number, color: number): THREE.Mesh => {
      const ruta = new THREE.CurvePath<THREE.Vector3>();
      for (let k = 0; k + 1 < pts.length; k++) ruta.add(new THREE.LineCurve3(pts[k], pts[k + 1]));
      return new THREE.Mesh(new THREE.TubeGeometry(ruta, pts.length * 4, radio, 6, false), new THREE.MeshBasicMaterial({ color }));
    };
    const ROJO = 0xe5484d;
    const construir = (deformada: boolean, escala: number, simbolos: number): THREE.Object3D[] => {
      const amp = deformada ? escala : 0;
      const vis = Math.max(1, simbolos > 0 ? simbolos : (simbolos < 0 ? -1 / simbolos : 1));   // nunca menor que 1: con displayScale < 1 el resorte se vuelve un hilo
      const arriba = (n: number): [number, number] => {            // posición X, Z del nudo tal como la dibuja el visor
        const d = deformations.get(n)!;
        return [nodes[n][0] + d[0] * amp, nodes[n][2] + d[2] * amp];
      };
      const objs: THREE.Object3D[] = [];
      const LARGO = 0.34;                                          // cuerpo + dos terminales cuando no hay deformada
      const zTierra = Math.min(...springs.map((s) => arriba(s.node)[1])) - LARGO;   // tierra común, por debajo del nudo más hundido
      for (const s of springs) {
        const [xt, zt] = arriba(s.node);
        const x0 = xt;                                             // resorte VERTICAL bajo el nudo deformado (solo actúa en Z)
        const fuerte = s.k > 7e5;
        const a = (fuerte ? 0.075 : 0.052) * vis, rad = (fuerte ? 0.0095 : 0.0065) * vis;
        const lead = 0.05, total = zt - zTierra, cuerpo = Math.max(0.05, total - 2 * lead);
        const eje = (t: number): [number, number] => [x0 + (xt - x0) * t, zTierra + total * t];   // eje recto del pie a la punta
        const vueltas = 3.5, pasos = 24, pts: THREE.Vector3[] = [];
        const e0 = eje(0), e1 = eje(lead / total);
        pts.push(new THREE.Vector3(e0[0], 0, e0[1]), new THREE.Vector3(e1[0], 0, e1[1]));
        for (let k = 0; k <= vueltas * pasos; k++) {
          const t = (lead + cuerpo * (1 - k / (vueltas * pasos))) / total;      // de abajo (tierra) a arriba (nudo)
          const [cx, cz] = eje(t);
          const th = (k / pasos) * 2 * Math.PI;
          const ramp = Math.min(1, k / 6, (vueltas * pasos - k) / 6);
          pts.push(new THREE.Vector3(cx + a * ramp * Math.sin(th), a * ramp * (1 - Math.cos(th)) * 0.5 - a * 0.25 * ramp, cz));
        }
        const e2 = eje((lead + cuerpo) / total);
        pts.push(new THREE.Vector3(e2[0], 0, e2[1]), new THREE.Vector3(xt, 0, zt));
        objs.push(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5), pts.length * 3, rad, 8, false), new THREE.MeshBasicMaterial({ color: ROJO })));
      }
      // tierra: UNA barra por lado (los tres resortes comparten apoyo), rayas a 45° cada 0.1 m
      for (const lado of [springs.filter((s) => nodes[s.node][0] < 0), springs.filter((s) => nodes[s.node][0] > 0)]) {
        const xs = lado.map((s) => arriba(s.node)[0]);
        const xa = Math.min(...xs) - 0.12 * vis, xb = Math.max(...xs) + 0.12 * vis;
        objs.push(tubo([new THREE.Vector3(xa, 0, zTierra), new THREE.Vector3(xb, 0, zTierra)], 0.008 * vis, ROJO));
        for (let xr = xa + 0.1 * vis; xr <= xb + 1e-9; xr += 0.1 * vis) objs.push(tubo([new THREE.Vector3(xr, 0, zTierra), new THREE.Vector3(xr - 0.06 * vis, 0, zTierra - 0.06 * vis)], 0.005 * vis, ROJO));
      }
      // eje de simetría (U1 = 0): línea punteada naranja, del nudo deformado de la base al de la cara superior
      const zb = arriba(idx(NL / 2, 0))[1] - 0.1, zc = arriba(idx(NL / 2, NH))[1] + 0.1;
      const sim = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, zb), new THREE.Vector3(0, 0, zc)]),
        new THREE.LineDashedMaterial({ color: 0xf5a524, dashSize: 0.08, gapSize: 0.06 }));
      sim.computeLineDistances();
      objs.push(sim);
      return objs;
    };
    const ajustes = (document.querySelector("#viewer") as any)?.__settings;
    const version = activeExampleVersion.v;
    if (ajustes) {
      van.derive(() => {
        if (activeExampleVersion.v !== version) return;            // otro ejemplo ya cargado: no pisar sus objetos
        states.objects3D.val = construir(!!ajustes.deformedShape.val, Number(ajustes.deformScale.val) || 0, Number(ajustes.displayScale.val) || 1);
      });
    } else {
      states.objects3D.val = construir(true, 1, 1);
    }

    const get = (i: number, j: number) => r.nodeResults[idx(i, j)];
    console.log(
      `[Deep Beam FEA] modos incompatibles=${p.incomp ? "sí" : "no"} · ux(esquina)=${(get(0, 0).ux * 1e6).toFixed(3)}e-3 mm · ` +
      `uy(l/2,0)=${(get(NL / 2, 0).uy * 1e6).toFixed(3)}e-3 mm · uy(l/2,h)=${(get(NL / 2, NH).uy * 1e6).toFixed(3)}e-3 mm`,
    );
  },
};
