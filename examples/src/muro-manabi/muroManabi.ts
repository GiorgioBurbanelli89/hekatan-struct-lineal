/**
 * Muro de contención de Manabí — el MISMO muro de tres maneras: membrana, cáscara y sólido.
 *
 * Es el muro de la serie de vídeos: los datos salen del estudio de suelos de Portoviejo y de la
 * NEC, y antes pasó por GEO5 (Cantilever Wall y GEO5 FEM). La malla, los apoyos y las cargas
 * están en `malla.ts`; aquí solo se resuelve y se deja en el workspace.
 *
 * Los tres modelos van por `deform` (los muelles de balasto no los lee `hex8Solve`). Las cargas
 * son nodales: SAP2000 y ETABS reciben exactamente las mismas al exportar.
 */
import type { Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs } from "hekatan-fem";
import { deform, analyze } from "hekatan-fem";
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";
import { hex8Stress } from "../solid-cube-fem/h8";
import { mallaMuroManabi, MURO_MANABI, type MuroManabiMalla, type MuroManabiParams, type Seis } from "./malla";

const D = MURO_MANABI;
const G = 9.80665;
const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

export interface MuroManabiSolucion {
  malla: MuroManabiMalla;
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
  deformOutputs: DeformOutputs;
  analyzeOutputs: AnalyzeOutputs;
  /** presión de contacto ks·uz en cada nudo de la base, kN/m² (compresión negativa) */
  presion: Map<number, number>;
  /** suma de las fuerzas de los muelles y de los apoyos, kN */
  reaccion: [number, number, number];
  error?: string;
}

/** Resuelve el muro. `placa`: 1 = Shell-Thin (defecto), 0 = Shell-Thick. Solo cuenta en el modelo de cáscara. */
export function resolverMuroManabi(p: MuroManabiParams, placa = 1, incompatible = true): MuroManabiSolucion {
  const malla = mallaMuroManabi(p);
  const n = malla.elements.length;
  const todos = <T>(v: T) => new Map(malla.elements.map((_, i) => [i, v]));
  const elementInputs: any = {
    elasticities: todos(malla.E),
    poissonsRatios: todos(malla.nu),
    shearModuli: todos(malla.E / (2 * (1 + malla.nu))),
    densities: todos(p.gammaC / G),
  };
  if (malla.tipo === "solido") elementInputs.solidIncompatible = incompatible;
  else {
    elementInputs.thicknesses = malla.thicknesses;
    if (malla.tipo === "membrana") {
      // membrana en el solver (flexión 0) y en los exportadores (tipo 2), las dos cosas
      elementInputs.plateFormulations = todos(2);
      elementInputs.shellModifiers = todos([1, 1, 1, 0, 0, 0, 1, 1]);
      elementInputs.bendingModifiers = todos(0);
      elementInputs.membraneModifiers = todos(1);
    } else elementInputs.plateFormulations = todos(Math.round(placa) === 1 ? 1 : 0);
  }
  const nodeInputs: any = {
    supports: malla.supports, loads: malla.loads, springs: malla.springs, cargasPorPatron: malla.cargas,
  };
  const sol: MuroManabiSolucion = {
    malla, nodeInputs, elementInputs,
    deformOutputs: {} as DeformOutputs, analyzeOutputs: {} as AnalyzeOutputs,
    presion: new Map(), reaccion: [0, 0, 0],
  };
  if (!n) return sol;
  try {
    const nodes = malla.nodes as unknown as Node[], elements = malla.elements as unknown as Element[];
    sol.deformOutputs = deform(nodes, elements, nodeInputs, elementInputs, malla.springs);
    const U = sol.deformOutputs.deformations as Map<number, number[]>;
    if (malla.tipo === "solido") {
      const solidStress = new Map<number, number[][]>(), solidVonMises = new Map<number, number[]>();
      malla.elements.forEach((el, i) => {
        const coords = el.map((k) => malla.nodes[k]) as [number, number, number][];
        const u = el.flatMap((k) => { const d = U.get(k) ?? [0, 0, 0]; return [d[0], d[1], d[2]]; });
        const r = hex8Stress(coords, malla.E, malla.nu, u, incompatible);
        solidStress.set(i, r.stress); solidVonMises.set(i, r.vonMises);
      });
      sol.analyzeOutputs = { solidStress, solidVonMises } as any;
    } else sol.analyzeOutputs = analyze(nodes, elements, elementInputs, sol.deformOutputs);

    // lo que devuelve el terreno: muelles (k·u, hacia arriba si el nudo baja) y apoyos
    for (const s of malla.springs) sol.reaccion[s.dof] -= s.k * (U.get(s.node)?.[s.dof] ?? 0);
    const R = sol.deformOutputs.reactions as Map<number, number[]> | undefined;
    // del apoyo solo cuenta ux: uy está sujeto en todos los nudos (faja de muro) y no lleva carga
    if (R) for (const [k, r] of R) if (malla.supports.get(k)?.[0]) sol.reaccion[0] += r[0] ?? 0;
    for (const b of malla.base) sol.presion.set(b.node, p.ks * (U.get(b.node)?.[2] ?? 0));

    if (malla.tipo === "cascara") {
      // mapa de presión de contacto sobre la zapata, como en las zapatas del workspace
      const pressure = new Map<number, number[]>(); let mn = 0, mx = 0;
      malla.elements.forEach((el, i) => {
        if (!el.every((k) => sol.presion.has(k))) return;
        const v = el.map((k) => sol.presion.get(k)!);
        for (const q of v) { if (q < mn) mn = q; if (q > mx) mx = q; }
        pressure.set(i, v);
      });
      (sol.analyzeOutputs as any).pressure = pressure;
      (sol.analyzeOutputs as any).colorMapRanges = { pressure: [mx, mn] };
    }
  } catch (e: any) {
    sol.error = e?.message ?? String(e);
    console.warn("[muro-manabi]", sol.error);
  }
  return sol;
}

let ultimo: { p: MuroManabiParams; sol: MuroManabiSolucion } | null = null;

const kgfcm2 = (kPa: number) => kPa / 98.0665;
const tonf = (kN: number) => kN / G;

export const muroManabi: ExampleDef = {
  id: "muro-manabi",
  name: "Muro de contención de Manabí (membrana · cáscara · sólido)",
  // la categoría es la del modelo por defecto (membrana); la cáscara y el sólido se eligen dentro
  category: "2️⃣ Shells · 🕸 Membranas",
  benchmark: true,
  defaultShellResult: "displacementX",
  defaultSolidResult: "vonMises",
  params: {
    modelo: { default: D.modelo, label: "Modelo", folder: "Modelo", options: { "Membrana (sección)": 0, "Cáscara 3D": 1, "Sólido H8": 2 } },
    caso:   { default: D.caso, label: "Caso", folder: "Modelo", options: { "Estático": 0, "Sísmico (Mononobe-Okabe)": 1 } },
    ms:     P("Modelo", "tamaño de elemento (m)", D.ms, 0.05, 0.4, 0.05),
    L:      P("Modelo", "longitud de muro L (m)", D.L, 0.2, 5, 0.2),
    dp:     { default: D.dp, boolean: true, label: "membrana en deformación plana", folder: "Modelo" },
    placa:  { default: 1, label: "Placa de la cáscara", folder: "Modelo", options: { "Shell-Thin": 1, "Shell-Thick": 0 } },
    Hf:     P("Geometría", "alto del fuste (m)", D.Hf, 1, 8, 0.1),
    tTop:   P("Geometría", "canto en la coronación (m)", D.tTop, 0.15, 1, 0.05),
    tBase:  P("Geometría", "canto al pie del fuste (m)", D.tBase, 0.2, 1.2, 0.05),
    toe:    P("Geometría", "puntera (m)", D.toe, 0.2, 3, 0.1),
    heel:   P("Geometría", "talón (m)", D.heel, 0.2, 5, 0.1),
    tf:     P("Geometría", "canto de la zapata (m)", D.tf, 0.2, 1.2, 0.05),
    E:      P("Hormigón", "E (kN/m²)", Math.round(D.E), 1.5e7, 4e7, 1e5),
    nu:     P("Hormigón", "ν", D.nu, 0.1, 0.3, 0.01),
    gammaC: P("Hormigón", "γ hormigón (kN/m³)", D.gammaC, 20, 26, 0.5),
    gamma:  P("Relleno", "γ relleno (kN/m³)", D.gamma, 14, 22, 0.5),
    phi:    P("Relleno", "φ (°)", D.phi, 20, 45, 0.5),
    delta:  P("Relleno", "δ muro-suelo (°)", D.delta, 0, 30, 1),
    kh:     P("Sismo", "kh", D.kh, 0, 0.5, 0.001),
    kv:     P("Sismo", "kv (+ levanta)", D.kv, -0.3, 0.3, 0.001),
    ks:     P("Terreno", "módulo de balasto (kN/m³)", Math.round(D.ks), 5000, 300000, 500),
  },
  guide: [
    "«Modelo» cambia la idealización; la geometría, el terreno y las cargas son los mismos",
    "«Caso» sísmico añade el incremento de Mononobe-Okabe y la inercia del muro",
    "La base descansa sobre muelles de balasto; la punta de la puntera no se desplaza en x",
    "En 📊 Calculados: Ka, Kae, el desplazamiento de la coronación y la presión de contacto",
    "Exportar S2K / E2K lleva esta misma malla y estas mismas cargas a SAP2000 y ETABS",
  ],
  build: (p: Record<string, number>, states: BuildStates) => {
    const pm = { ...D, ...p } as unknown as MuroManabiParams;
    const sol = resolverMuroManabi(pm, p.placa);
    ultimo = { p: pm, sol };
    states.nodes.val = sol.malla.nodes.map((q) => [q[0], q[1], q[2]] as Node);
    states.elements.val = sol.malla.elements.map((e) => [...e] as Element);
    states.nodeInputs.val = sol.nodeInputs;
    states.elementInputs.val = sol.elementInputs;
    states.deformOutputs.val = sol.deformOutputs;
    states.analyzeOutputs.val = sol.analyzeOutputs;
    states.objects3D.val = [];
    if ((states as any).springs) (states as any).springs.val = sol.malla.springs;
  },
  computedLabels: () => {
    if (!ultimo) return {};
    const { p, sol } = ultimo, m = sol.malla, s = m.info.suma;
    const out: Record<string, string> = {
      "Nudos / elementos": `${m.info.nudos} / ${m.info.elementos}`,
      "Ka (Coulomb)": m.info.Ka.toFixed(4),
      "Kae (Mononobe-Okabe)": m.info.Kae.toFixed(4),
      "ψ = atan(kh / (1 − kv))": `${m.info.psi.toFixed(2)}°`,
      "Peso del muro": `${(-s.PP[2]).toFixed(2)} kN = ${tonf(-s.PP[2]).toFixed(2)} tonf`,
      "Relleno sobre el talón": `${(-s.RELLENO[2]).toFixed(2)} kN = ${tonf(-s.RELLENO[2]).toFixed(2)} tonf`,
      "Empuje estático (horizontal)": `${(-s.EMPUJE[0]).toFixed(2)} kN = ${tonf(-s.EMPUJE[0]).toFixed(2)} tonf`,
    };
    if (Math.round(p.caso) === 1)
      out["Sismo (incremento + inercia del muro)"] = `${(-s.SISMO[0]).toFixed(2)} kN = ${tonf(-s.SISMO[0]).toFixed(2)} tonf`;
    if (sol.error) { out["Solver"] = `falló: ${sol.error}`; return out; }
    const U = sol.deformOutputs.deformations as Map<number, number[]> | undefined;
    const ux = U?.get(m.nudoCoronacion)?.[0] ?? 0;
    out["ux en la coronación"] = `${(ux * 1000).toFixed(4)} mm`;
    let mn = Infinity, mx = -Infinity;
    sol.presion.forEach((v) => { if (v < mn) mn = v; if (v > mx) mx = v; });
    if (Number.isFinite(mn)) {
      out["Presión de contacto máxima"] = `${(-mn).toFixed(1)} kN/m² = ${kgfcm2(-mn).toFixed(2)} kgf/cm²`;
      out["Presión de contacto mínima"] = `${(-mx).toFixed(1)} kN/m² = ${kgfcm2(-mx).toFixed(2)} kgf/cm²`
        + (mx > 0 ? " (tracción: el lineal no despega)" : "");
    }
    out["Reacción del terreno (x, z)"] = `${sol.reaccion[0].toFixed(2)} , ${sol.reaccion[2].toFixed(2)} kN`;
    return out;
  },
};
