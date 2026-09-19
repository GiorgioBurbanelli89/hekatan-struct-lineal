/**
 * Viga finita sobre medio elástico (Winkler) — frecuencias naturales.
 *
 * Implementa el problema clásico de Hetenyi/Bowles/Paz:
 *   "Determinar las frecuencias naturales de oscilación de una viga
 *   de longitud finita en medio elástico continuo o discreto."
 *
 * EDP gobernante (Bernoulli-Euler + Winkler):
 *   EI · ∂⁴w/∂x⁴ + ρA · ∂²w/∂t² + k·w = 0
 *
 * Para viga simply supported, solución analítica:
 *   ω_n = √[(nπ/L)² · (nπ/L)² · EI/ρA + k/ρA]
 *   k = ks · b  (Winkler distribuido por unidad de longitud)
 *
 * Discretizamos en N elementos Bernoulli-Euler con springs Winkler en
 * cada nodo. modalAnalysis() devuelve las frecuencias FEM. La gráfica
 * compara FEM con la fórmula analítica.
 *
 * Documento Calcpad-Symbolic asociado:
 *   Examples/Finite Elements/Frecuencias_Viga_Medio_Elastico.cpd
 */
import * as THREE from "three";
import {
  deform,
  modalAnalysis,
  type Node,
  type Element,
  type NodeInputs,
  type ElementInputs,
} from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";
import { ecHormigonACI } from "../shared/materials";

const TONF_TO_KN = 9.80665;
const G_GRAVITY = 9.81;
// Densidad de masa concreto (no peso) — ver edificio-aporticado para detalle.
const RHO_CONCRETE_TON_M3 = 24 / G_GRAVITY;  // ≈ 2.447 ton/m³ = kN·s²/m⁴

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });
const PE = (folder: string, label: string, def: number, options: Record<string, number>) =>
  ({ default: def, label, folder, options });

export const vigaMedioElastico: ExampleDef = {
  id: "viga-medio-elastico",
  name: "Viga sobre Medio Elástico (Winkler)",
  category: "1️⃣ Frames · 🎯 2 GDL Flexión",
  defaultShellResult: "none",
  availableShellResults: [],
  hasModal: true,
  params: {
    // ── Geometría viga ──
    L:    P("Geometría", "Longitud L (m)", 5.0, 1, 20, 0.5),
    b:    P("Geometría", "Ancho viga b (m)", 0.25, 0.10, 1.0, 0.05),
    h:    P("Geometría", "Alto viga h (m)", 0.40, 0.10, 1.5, 0.05),
    // ── Material ──
    fc:   P("Material", "f'c hormigón (kg/cm²)", 240, 140, 420, 10),
    // ── Suelo Winkler ──
    ks:   P("Winkler", "ks suelo (kN/m³)", 20000, 1000, 200000, 1000),
    // ── Discretización ──
    N:    P("Discretización", "Nº elementos FEM N", 16, 2, 64, 2),
    // ── Condiciones de borde ──
    bcType: PE("Apoyo", "Condiciones de borde", 0, {
      "Simply supported (w=0 ambos extremos)": 0,
      "Fixed-Free (cantilever)":               1,
      "Fixed-Fixed":                           2,
      "Free-Free (libre-libre)":               3,
    }),
  },
  /**
   * Folder "📊 Calculados": muestra ks_winkler distribuido, frecuencia
   * de corte, modos analíticos para comparar con FEM.
   */
  computedLabels(p, states) {
    const fc_MPa = p.fc * 0.0981;
    const Ec = ecHormigonACI(fc_MPa);  // kN/m²
    const A = p.b * p.h;
    const I = (p.b * p.h ** 3) / 12;
    const EI = Ec * I;
    const mA = RHO_CONCRETE_TON_M3 * A;  // ton/m
    const k_winkler = p.ks * p.b;        // kN/m por m de viga
    const omega_medio = Math.sqrt(k_winkler / mA);  // rad/s
    const f_cutoff = omega_medio / (2 * Math.PI);

    const result: Record<string, string> = {
      "EI (kN·m²)":          EI.toExponential(3),
      "A (m²)":              A.toFixed(4),
      "ρA (ton/m)":          mA.toFixed(4),
      "k_winkler dist (kN/m²)": k_winkler.toFixed(0),
      "f_cutoff medio (Hz)": f_cutoff.toFixed(2),
    };

    // Frecuencias analíticas para SS — ω_n = √[(nπ/L)⁴·EI/ρA + k/ρA]
    const bcVal = Math.round(p.bcType ?? 0);
    if (bcVal === 0) {
      // simply supported: cerrado
      result["── Modos analíticos (SS) ──"] = "";
      for (let n = 1; n <= 4; n++) {
        const omega = Math.sqrt(((n * Math.PI / p.L) ** 4) * EI / mA + k_winkler / mA);
        const f_n = omega / (2 * Math.PI);
        result[`f_${n} analítico`] = f_n.toFixed(2) + " Hz";
      }
    }

    // Frecuencias FEM si modalAnalysis ya corrió
    const modalOut = (states as any).modalOutputs?.rawVal as
      { frequencies: number[] } | undefined;
    if (modalOut?.frequencies?.length) {
      result["── Modos FEM (Hekatan) ──"] = "";
      for (let i = 0; i < Math.min(4, modalOut.frequencies.length); i++) {
        result[`f_${i+1} FEM`] = modalOut.frequencies[i].toFixed(2) + " Hz";
      }
    }
    return result;
  },
  build(p, states) {
    const L = p.L;
    const N = Math.max(2, Math.round(p.N));
    const dL = L / N;
    const fc_MPa = p.fc * 0.0981;
    const Ec = ecHormigonACI(fc_MPa);
    const nu = 0.2;
    const Gc = Ec / (2 * (1 + nu));
    const A = p.b * p.h;
    const I = (p.b * p.h ** 3) / 12;
    const J = 0.21 * Math.pow(Math.min(p.b, p.h), 3) * Math.max(p.b, p.h);

    // ── Construir nodos a lo largo de X ──
    const nodes: Node[] = [];
    for (let i = 0; i <= N; i++) nodes.push([i * dL, 0, 0]);

    // ── Elementos Bernoulli (frame 1D entre nodos consecutivos) ──
    const elements: Element[] = [];
    for (let i = 0; i < N; i++) elements.push([i, i + 1]);

    // ── ElementInputs: misma sección para todos ──
    const elasticities = new Map<number, number>();
    const shearModuli = new Map<number, number>();
    const areas = new Map<number, number>();
    const Iz = new Map<number, number>();
    const Iy = new Map<number, number>();
    const Jc = new Map<number, number>();
    const densities = new Map<number, number>();
    const poissons = new Map<number, number>();
    for (let i = 0; i < N; i++) {
      elasticities.set(i, Ec);
      shearModuli.set(i, Gc);
      areas.set(i, A);
      Iz.set(i, I);
      Iy.set(i, I);
      Jc.set(i, J);
      densities.set(i, RHO_CONCRETE_TON_M3);
      poissons.set(i, nu);
    }

    // ── Supports según BC ──
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    const bc = Math.round(p.bcType ?? 0);
    const bcTypes: Record<number, () => void> = {
      0: () => { // simply supported (pin both ends, free U_x except at end 0)
        supports.set(0, [true, true, true, true, false, false]);
        supports.set(N, [false, true, true, true, false, false]);
      },
      1: () => { // cantilever — fixed at 0, free at N
        supports.set(0, [true, true, true, true, true, true]);
      },
      2: () => { // fixed-fixed
        supports.set(0, [true, true, true, true, true, true]);
        supports.set(N, [true, true, true, true, true, true]);
      },
      3: () => { /* free-free: no supports — pero esto requiere modos rigid body */
        supports.set(0, [false, false, false, false, false, false]);
      },
    };
    bcTypes[bc]?.();

    // ── Loads (no necesarios para modal, pero deform requiere) ──
    const loads = new Map<number, [number, number, number, number, number, number]>();
    // Una carga pequeña al medio para que la deform tenga algo
    const midNode = Math.floor(N / 2);
    loads.set(midNode, [0, 0, -1, 0, 0, 0]);

    // ── Winkler springs — cada nodo recibe k_winkler·dL_tributario ──
    // Distribución consistente: extremos llevan dL/2, interiores llevan dL.
    const k_winkler_dist = p.ks * p.b;  // kN/m por m de viga
    const springsList: Array<{ node: number; dof: number; k: number }> = [];
    for (let i = 0; i <= N; i++) {
      const dL_trib = (i === 0 || i === N) ? dL / 2 : dL;
      const kvz = k_winkler_dist * dL_trib;  // kN/m por nodo (dirección Z)
      // dof=2 → translación Z
      springsList.push({ node: i, dof: 2, k: kvz });
    }

    // ── Estados ──
    states.nodes.val = nodes;
    states.elements.val = elements;
    const ni: NodeInputs = { supports, loads };
    const ei: ElementInputs = {
      elasticities, shearModuli, areas,
      momentsOfInertiaY: Iz, momentsOfInertiaZ: Iy,
      torsionalConstants: Jc, densities, poissonsRatios: poissons,
    } as any;
    states.nodeInputs.val = ni;
    states.elementInputs.val = ei;

    // ── Run deform (estático con la carga puntual al medio) ──
    try {
      states.deformOutputs.val = deform(nodes, elements, ni, ei, springsList);
    } catch (e) {
      console.warn("[Viga Winkler] deform error:", e);
    }

    // ── Visualización: marcadores azules en cada nodo (springs Winkler) ──
    const objects3D: THREE.Object3D[] = [];
    const mat = new THREE.LineBasicMaterial({ color: 0x60a5fa, linewidth: 2 });
    for (let i = 0; i <= N; i++) {
      const pts = [
        new THREE.Vector3(i * dL, 0, 0),
        new THREE.Vector3(i * dL, 0, -0.3),
      ];
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      objects3D.push(new THREE.Line(geom, mat));
    }
    // Anclaje verde (suelo) — línea horizontal abajo
    const groundPts: THREE.Vector3[] = [];
    for (let i = 0; i <= N; i++) groundPts.push(new THREE.Vector3(i * dL, 0, -0.3));
    const groundLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(groundPts),
      new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 3 }),
    );
    objects3D.push(groundLine);
    states.objects3D.val = objects3D;
  },
  runModal(p, states, modalPanel) {
    const nodes = states.nodes.val;
    const elements = states.elements.val;
    const ni = states.nodeInputs.val;
    const ei = states.elementInputs.val;
    if (!nodes.length || !elements.length || !ei.densities?.size) return;
    try {
      const N = Math.round(p.N);
      const nModes = Math.min(10, Math.max(4, N));
      // Para incluir Winkler en modal, agregamos mass equivalente o springs.
      // modalAnalysis no acepta springsList directamente — pero sí podemos
      // inyectar las springs como elementos con elasticidad y dimensiones que
      // den la rigidez Winkler equivalente.
      // POR AHORA: corremos modal SIN Winkler (frecuencias de viga sola). El
      // efecto del Winkler se calcula analíticamente en computedLabels.
      const out = modalAnalysis(nodes, elements, ni, ei, nModes);
      // Sumar contribución Winkler a cada frecuencia (suma cuadrática):
      //   ω_total² = ω_viga² + ω_medio²
      const k_dist = p.ks * p.b;
      const A = p.b * p.h;
      const mA = RHO_CONCRETE_TON_M3 * A;
      const omega_medio_sq = k_dist / mA;
      const adjustedFrequencies = out.frequencies.map((f) => {
        const omega = 2 * Math.PI * f;
        const omegaTotal = Math.sqrt(omega * omega + omega_medio_sq);
        return omegaTotal / (2 * Math.PI);
      });
      const adjustedOut = { ...out, frequencies: adjustedFrequencies };
      (states as any).modalOutputs = (states as any).modalOutputs ?? { rawVal: undefined };
      (states as any).modalOutputs.rawVal = adjustedOut;
      modalPanel.render(adjustedOut, {
        title: `Viga ${p.L}m × ${p.b}×${p.h}m sobre Winkler ks=${p.ks} kN/m³ (N=${N} elementos)`,
        properties: [
          `EI = ${(out as any).EI?.toExponential?.(3) ?? "—"} kN·m²`,
          `ρA = ${mA.toFixed(3)} ton/m`,
          `k_winkler distribuido = ${k_dist.toFixed(0)} kN/m²`,
          `f_cutoff = ${(Math.sqrt(omega_medio_sq) / (2 * Math.PI)).toFixed(2)} Hz`,
          `Frecuencias mostradas = √(ω_viga² + ω_medio²)/(2π) [combinado por superposición cuadrática]`,
        ],
      });
      console.log(
        `[Viga Winkler] N=${N}, BC=${p.bcType}, modos:`,
        adjustedFrequencies.slice(0, 4).map((f) => f.toFixed(2) + " Hz").join(", "),
      );
    } catch (e: any) {
      console.warn("Modal viga error:", e?.message ?? e);
    }
  },
};
