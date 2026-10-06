/**
 * CARGA MÓVIL como SAP2000 — ejemplo de los Load Case «Multi-step Static» (5-oct-2026).
 *   K·u_i = r_i en cada paso: el camión avanza v·Δt por paso por el carril (CSiRefer p. 348 y 535-537).
 * El MISMO modelo armado en SAP2000 24 por OAPI (validation/casos-csi/sap_multipaso.py): viga continua 2 × 20 m,
 * barras de 1 m, 0.5 × 1.2 m, E = 2.5e7 kN/m², camión 35/145/145 kN a 4.3 m, 1 m/s, Δt 0.7 s, SF 1.2, y SC = 50 kN
 * en x = 10 m en TODOS los pasos. Test `node tests/run.mjs multipaso` → 0.000 % (101 pasos).
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import { deform, analyze, multiStepStatic, pasosVehiculoVivo, pasoUnico } from "hekatan-fem";

const E = 2.5e7, NU = 0.2;
// propiedades de la sección que devuelve SAP2000 (PropFrame.GetSectProps) para SetRectangle(1.2, 0.5)
const SEC = { A: 0.6, As2: 0.5, As3: 0.5, J: 0.03690796651957947, I22: 0.0125, I33: 0.072 };
// envolventes de SAP2000 24 (caso MS, 101 pasos; barras: extremos i y j)
const SAP = { uzMin: -0.02676299148918161, m3Max: 1360.424119332922, m3Min: -777.0171440625626, v2Max: 350.4998339977974, v2Min: -354.96690177559526, pasos: 101 };

let ultimo: { uz: number; m3Max: number; m3Min: number; v2Max: number; v2Min: number; pasos: number; ref: boolean } | null = null;

export const cargaMovilCsi: ExampleDef = {
  id: "carga-movil-sap2000",
  name: "Carga móvil (Multi-step Static) — igual que SAP2000",
  category: "1️⃣ Frames · 🎯 2 GDL Flexión",
  params: {
    luz: { default: 20, label: "Luz de cada vano (m)", folder: "Modelo", min: 5, max: 60, step: 1 },
    vanos: { default: 2, label: "N° de vanos", folder: "Modelo", min: 1, max: 4, step: 1 },
    v: { default: 1, label: "Velocidad (m/s)", folder: "Vehículo", min: 0.1, max: 30, step: 0.1 },
    dt: { default: 0.7, label: "Δt (s)", folder: "Vehículo", min: 0.05, max: 5, step: 0.05 },
  },
  guide: [
    "Multi-step Static = un análisis estático por paso: el camión avanza v·Δt entre pasos (sin efectos dinámicos)",
    "Cada eje es una carga concentrada DENTRO de la barra donde cae; la SC de 50 kN está en todos los pasos",
    "📊 Calculados: envolvente de Hekatan Struct y de SAP2000 (mismo modelo; con 2 × 20 m, 1 m/s y Δt 0.7 s)",
    "Settings › 🚚 Carga móvil: ▶ Calcular, ver cada paso y 🎞 animar el camión",
  ],
  build(p, states) {
    const L = p.luz, nv = Math.round(p.vanos), n = Math.round(L) * nv;
    const dx = (L * nv) / n;
    const nodes = Array.from({ length: n + 1 }, (_, k) => [k * dx, 0, 0]);
    const elements = Array.from({ length: n }, (_, k) => [k, k + 1]);
    const mapa = (v: number) => new Map(elements.map((_, e) => [e, v]));
    const ei: any = { elasticities: mapa(E), shearModuli: mapa(E / (2 * (1 + NU))), poissonsRatios: mapa(NU), densities: mapa(0),
      areas: mapa(SEC.A), momentsOfInertiaZ: mapa(SEC.I33), momentsOfInertiaY: mapa(SEC.I22), torsionalConstants: mapa(SEC.J),
      shearAreasZ: mapa(SEC.As2), shearAreasY: mapa(SEC.As3) };
    const supports = new Map<number, boolean[]>([[0, [true, true, true, true, false, false]]]);
    for (let v = 1; v <= nv; v++) supports.set(Math.round((v * L) / dx), [false, true, true, false, false, false]);
    const nSC = Math.round(10 / dx);
    const loads = new Map<number, number[]>([[nSC, [0, 0, -50, 0, 0, 0]]]);
    states.nodes.val = nodes as any; states.elements.val = elements as any;
    states.nodeInputs.val = { supports, loads } as any; states.elementInputs.val = ei;
    try {
      const d = deform(nodes as any, elements as any, states.nodeInputs.val, ei);
      states.deformOutputs.val = d; states.analyzeOutputs.val = analyze(nodes as any, elements as any, ei, d);
      const dur = 70 * (L * nv) / 40;
      const vl = pasosVehiculoVivo(nodes as any, elements as any, ei, [{ vehiculo: { nombre: "CAM3", ejes: [35, 145, 145], sep: [4.3, 4.3] },
        carril: { barras: elements.map((_, e) => e) }, v: p.v }], Math.round(dur / p.dt) * p.dt, p.dt);
      const R = multiStepStatic(nodes as any, elements as any, { supports } as any, ei, [{ pasos: vl, sf: 1.2 }, { pasos: pasoUnico(loads), sf: 1 }]);
      const o = { uz: 0, m3Max: -Infinity, m3Min: Infinity, v2Max: -Infinity, v2Min: Infinity, pasos: R.length,
        ref: L === 20 && nv === 2 && Math.abs(p.v - 1) < 1e-9 && Math.abs(p.dt - 0.7) < 1e-9 };
      for (const r of R) {
        for (const q of r.deformations.values()) o.uz = Math.min(o.uz, q[2]);
        for (const [, m] of r.bendingsZ) { o.m3Max = Math.max(o.m3Max, -m[0], m[1]); o.m3Min = Math.min(o.m3Min, -m[0], m[1]); }
        for (const [, v] of r.shearsY) { o.v2Max = Math.max(o.v2Max, -v[0], v[1]); o.v2Min = Math.min(o.v2Min, -v[0], v[1]); }
      }
      ultimo = o;
    } catch (e) { console.warn("[carga-movil-sap2000]", e); ultimo = null; }
    states.objects3D.val = [];
  },
  computedLabels() {
    const o: Record<string, string> = {};
    if (!ultimo) { o["Multi-step"] = "✗ no se pudo calcular"; return o; }
    const fila = (h: number, s: number, dec: number) => ultimo!.ref ? `${h.toFixed(dec)} · SAP2000 ${s.toFixed(dec)} (${(100 * (h / s - 1)).toFixed(4)} %)` : h.toFixed(dec);
    o["Pasos (dur/Δt + 1)"] = ultimo.ref ? `${ultimo.pasos} · SAP2000 ${SAP.pasos}` : String(ultimo.pasos);
    o["Uz mín (m)"] = fila(ultimo.uz, SAP.uzMin, 6);
    o["M3 máx (kN·m)"] = fila(ultimo.m3Max, SAP.m3Max, 3);
    o["M3 mín (kN·m)"] = fila(ultimo.m3Min, SAP.m3Min, 3);
    o["V2 máx (kN)"] = fila(ultimo.v2Max, SAP.v2Max, 3);
    o["V2 mín (kN)"] = fila(ultimo.v2Min, SAP.v2Min, 3);
    o["Referencia"] = ultimo.ref ? "SAP2000 24, mismo modelo (validation/casos-csi)" : "sin referencia con estos datos (2 × 20 m, 1 m/s, Δt 0.7 s la tiene)";
    return o;
  },
};
