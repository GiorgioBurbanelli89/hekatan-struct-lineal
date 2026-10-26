/**
 * TORSIÓN EN VIGAS · 20 EDIFICIOS (regulares e irregulares) con el Insertion Point.
 *
 * Elige el edificio y la situación del cuadro «Insertion Point» de ETABS / SAP2000:
 *   · Centroid (10)                          el nudo cae en el centroide de la viga: sin desfase
 *   · Top Center (8) + casilla MARCADA       el valor por defecto: el desfase solo se DIBUJA, el análisis es idéntico al anterior
 *   · Top Center (8) + casilla DESMARCADA    barra rígida del nudo al centroide: K' = Rᵀ K R (Wilson §7.7, PDF p.120)
 * y mira el Tu: la envolvente de las combinaciones ACI (1.4D, 1.2D+1.6L, 1.2D+L±E, 0.9D±E; sismo en X e Y), sin agrietar.
 *
 * Referencia: ETABS 22 por OAPI, los 20 edificios en las tres situaciones: Struct = ETABS a ≤ 0.001 % en el Tu
 * (tests/casos/edificios_torsion_vs_etabs.mjs). Resultado: con la barra rígida el Tu baja 23-29 % en los 20.
 */
import { deform, analyze } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";
import { cargasDelCaso } from "../shared/cargasPorCaso";
import { EDIFICIOS, NOMBRES_EDIFICIOS, construirEdificio, jRect, E_HORMIGON, NU, G_HORMIGON, type Edificio, type EspecEdificio } from "./edificios";

const FC = 28;                                         // MPa (E = 25 GPa ≈ 4700·√f'c)
// T de SERVICIO (sin mayorar): D+L y D+L±E. Tu: combinaciones de resistencia ACI.
const SERVICIO = [{ D: 1, L: 1, X: 0, Y: 0 }, ...([[1, 0], [-1, 0], [0, 1], [0, -1]] as const).map(([x, y]) => ({ D: 1, L: 1, X: x, Y: y }))];
const SISMICOS = [{ n: "1.4D", D: 1.4, L: 0, X: 0, Y: 0 }, { n: "1.2D+1.6L", D: 1.2, L: 1.6, X: 0, Y: 0 }];
for (const [k, nm] of [["X", "X"], ["Y", "Y"]] as const) for (const sg of [1, -1]) {
  const base = { D: 1.2, L: 1, X: 0, Y: 0 }, baja = { D: 0.9, L: 0, X: 0, Y: 0 };
  (base as any)[k] = sg; (baja as any)[k] = sg;
  SISMICOS.push({ n: `1.2D+L${sg > 0 ? "+" : "-"}E${nm}`, ...base }, { n: `0.9D${sg > 0 ? "+" : "-"}E${nm}`, ...baja });
}

export function entradasElemento(S: EspecEdificio, B: Edificio, punto: number) {
  const m = () => new Map<number, number>();
  const ei = { elasticities: m(), poissonsRatios: m(), shearModuli: m(), densities: m(), areas: m(), momentsOfInertiaY: m(), momentsOfInertiaZ: m(),
    torsionalConstants: m(), thicknesses: m(), plateFormulations: m(), insertionOffsets: new Map<number, [number, number]>() };
  B.elements.forEach((_, i) => {
    ei.elasticities.set(i, E_HORMIGON); ei.poissonsRatios.set(i, NU); ei.shearModuli.set(i, G_HORMIGON); ei.densities.set(i, 0);   // el peso propio va dentro de D
    if (B.tipo[i] === "losa") { ei.thicknesses.set(i, S.t); ei.plateFormulations.set(i, 1); return; }
    const col = B.tipo[i] === "col"; const [t2, t3] = col ? [B.lado[i], B.lado[i]] : [S.bb, S.bh];
    ei.areas.set(i, t2 * t3); ei.momentsOfInertiaZ.set(i, t2 * t3 ** 3 / 12); ei.momentsOfInertiaY.set(i, t3 * t2 ** 3 / 12);
    ei.torsionalConstants.set(i, jRect(t2, t3));
    if (!col && punto === 2) ei.insertionOffsets.set(i, [-S.bh / 2, 0]);        // Top Center + casilla desmarcada
  });
  return ei;
}

export interface ResultadoTu { Tu: number; T: number; combo: string; nVigas: number; sobreUmbral: number; Tth: number; Tcr: number; }

/** Tu envolvente de las vigas: resuelve D, L, Ex y Ey por separado y combina (el análisis es lineal). */
export function calcularTu(S: EspecEdificio, B: Edificio, punto: number): ResultadoTu {
  const ei = entradasElemento(S, B, punto);
  const por: Record<string, Map<number, number[]>> = {};
  const casos: Array<[string, Map<number, any>]> = [["D", B.cargas.Dead], ["L", B.cargas.Live], ["X", B.cargas.Ex], ["Y", B.cargas.Ey]];
  for (const [c, loads] of casos) {
    const d = deform(B.nodes, B.elements, { supports: B.supports, loads }, ei as any);
    por[c] = (analyze(B.nodes, B.elements, ei as any, d).torsions ?? new Map()) as Map<number, number[]>;
  }
  const Acp = S.bb * S.bh, pcp = 2 * (S.bb + S.bh);
  const Tth = 0.75 * 0.083 * Math.sqrt(FC) * (Acp * 1e6) ** 2 / (pcp * 1e3) / 1e6, Tcr = 0.75 * 0.33 * Math.sqrt(FC) * (Acp * 1e6) ** 2 / (pcp * 1e3) / 1e6;
  let Tu = 0, T = 0, combo = "", nVigas = 0, sobre = 0;
  B.elements.forEach((_, i) => {
    if (B.tipo[i] !== "viga") return;
    nVigas++;
    let m = 0;
    for (const c of SISMICOS) {
      for (let k = 0; k < 2; k++) {
        const v = Math.abs(c.D * por.D.get(i)![k] + c.L * por.L.get(i)![k] + c.X * por.X.get(i)![k] + c.Y * por.Y.get(i)![k]);
        if (v > m) m = v; if (v > Tu) { Tu = v; combo = c.n; }
      }
    }
    for (const c of SERVICIO) for (let k = 0; k < 2; k++) T = Math.max(T, Math.abs(c.D * por.D.get(i)![k] + c.L * por.L.get(i)![k] + c.X * por.X.get(i)![k] + c.Y * por.Y.get(i)![k]));
    if (m > Tth) sobre++;
  });
  return { Tu, T, combo, nVigas, sobreUmbral: sobre, Tth, Tcr };
}

let ultimo: { a?: ResultadoTu; b?: ResultadoTu; punto: number; id: string } | null = null;

const P = (folder: string, label: string, def: number, options: Record<string, number>) => ({ default: def, label, folder, options });

export const edificiosTorsion: ExampleDef = {
  id: "edificios-torsion",
  name: "Torsión en vigas · 20 edificios (Insertion Point)",
  category: "4️⃣ Mixtos · 🏢 Edificios",
  patrones: [{ nombre: "Ex", tipo: "Seismic" }, { nombre: "Ey", tipo: "Seismic" }],
  defaultShellResult: "bendingXX",
  availableShellResults: ["none", "membraneXX", "membraneYY", "membraneXY", "vonMises", "bendingXX", "bendingYY", "bendingXY", "displacementX", "displacementY", "displacementZ"],
  hasModal: false,
  params: {
    tipo: P("Edificio", "Edificio (10 regulares · 10 irregulares)", 1, NOMBRES_EDIFICIOS),
    punto: P("Insertion Point de las vigas", "Punto cardinal y casilla", 2, {
      "Centroid (10)": 0, "Top Center (8) · casilla MARCADA (defecto)": 1, "Top Center (8) · casilla DESMARCADA (barra rígida)": 2,
    }),
    calcularTu: { default: 1, label: "Calcular Tu (4 casos + combinaciones)", folder: "Insertion Point de las vigas", boolean: true },
  },
  build(p, states) {
    const S = EDIFICIOS[Math.max(0, Math.min(EDIFICIOS.length - 1, Math.round(p.tipo)))];
    const punto = Math.round(p.punto);
    const B = construirEdificio(S);
    const ei = entradasElemento(S, B, punto);
    const loads = cargasDelCaso({ Dead: B.cargas.Dead, Live: B.cargas.Live, Ex: B.cargas.Ex, Ey: B.cargas.Ey });
    states.nodes.val = B.nodes;
    states.elements.val = B.elements;
    states.nodeInputs.val = { supports: B.supports, loads };
    states.elementInputs.val = ei as any;
    const d = deform(B.nodes, B.elements, states.nodeInputs.val, states.elementInputs.val);
    states.deformOutputs.val = d;
    states.analyzeOutputs.val = analyze(B.nodes, B.elements, states.elementInputs.val, d);
    states.objects3D.val = [];
    ultimo = { punto, id: S.id };
    if (p.calcularTu) {
      // el Tu de la situación elegida y el del centroide, para ver el cambio (marcada = centroide: el análisis es idéntico)
      ultimo.a = calcularTu(S, B, 0);
      ultimo.b = punto === 2 ? calcularTu(S, B, 2) : ultimo.a;
    }
  },
  computedLabels(p) {
    if (!ultimo || !ultimo.a || !ultimo.b) return { "Tu": "marca «Calcular Tu»" };
    const { a, b, punto } = ultimo;
    const cambio = 100 * (b.Tu / a.Tu - 1);
    const out: Record<string, string> = {
      "Tu envolvente · Centroid / casilla marcada": `${a.Tu.toFixed(3)} kN·m`,
      "Tu envolvente · Top Center desmarcada": punto === 2 ? `${b.Tu.toFixed(3)} kN·m` : "(elige «DESMARCADA»)",
      "Cambio del Tu con la barra rígida": punto === 2 ? `${cambio >= 0 ? "+" : ""}${cambio.toFixed(1)} %` : "—",
      "T de servicio (sin mayorar) · Centroid → elegido": `${a.T.toFixed(3)} → ${b.T.toFixed(3)} kN·m`,
      "Tu / T (factor de mayoración efectivo)": `${(a.Tu / a.T).toFixed(2)} → ${(b.Tu / b.T).toFixed(2)}`,
      "Combinación que manda": `${b.combo}`,
      "Vigas con Tu > φ·Tth (umbral de torsión)": `${a.sobreUmbral} → ${b.sobreUmbral} de ${a.nVigas}`,
      "φ·Tcr de la viga": `${a.Tcr.toFixed(2)} kN·m  (f'c = ${FC} MPa)`,
    };
    return out;
  },
};
