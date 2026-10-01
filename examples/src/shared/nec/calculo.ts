/**
 * CAPA NEC — todo junto (30-sep-2026): pisos → estático → derivas con ±5 % → CR → modal → espectral CQC → control.
 * Un solo punto de entrada para el panel del workspace, la CLI y las pruebas. Cada pieza está validada aparte:
 *   masa y CM por piso = ETABS (Assembled Joint Masses) a 4 decimales · periodos = SAP2000 · estático con las
 *   mismas cargas = SAP2000 a 1e-9 % · CR = ETABS «Centers Of Mass And Rigidity» (X a 4 decimales, Y a ≤ 2 mm).
 */
import { deform, jointMass, modalAnalysis as modalCpp } from "hekatan-fem";
import { pisosDeModelo, type Piso } from "./pisos";
import { cortanteEstatico, espectro, type DatosSitio, type Estatico } from "./estatico";
import { cargasEnCM, derivas, centrosDeRigidez, type DerivaPiso } from "./derivas";
import { espectralPorPiso, escalaDinamico, type Espectral } from "./espectral";

export type OpcionesNEC = { sitio: DatosSitio; irregular: boolean; nModos: number; ecc: number; agrietadas?: boolean };

/**
 * Inercias agrietadas NEC-SE-DS §6.1.6 (1-oct-2026): vigas 0.5·Ig, columnas 0.8·Ig, muros 0.6·Ig. Barra vertical
 * (< 20° de la vertical) = columna, el resto = viga; cáscara vertical = muro (sus 6 modificadores de membrana y flexión
 * × 0.6, el cortante transversal tal cual); losas sin tocar. Devuelve una COPIA: el modelo en pantalla no cambia.
 */
/**
 * Unidades (1-oct-2026). La capa NEC trabaja en kN-m con la densidad como MASA (t/m³). Un ejemplo en tonf-m (E en
 * tonf/m², densidad = PESO en tonf/m³, como test-m) lo declara con `elementInputs.unidades = "tonf-m"`: aquí la
 * densidad pasa a masa (÷ g) y todo sale en tonf. Sin esto el modal veía una rigidez 9.81 veces menor (T × 3.13).
 */
export function enMasa(ei: any): any {
  if (ei?.unidades !== "tonf-m") return ei;
  return { ...ei, densities: new Map([...(ei.densities ?? new Map())].map(([k, v]: [number, number]) => [k, v / 9.80665])), unidades: "tonf-m/masa" };
}
export const unidadFuerza = (ei: any) => (String(ei?.unidades ?? "").startsWith("tonf-m") ? "tonf" : "kN");

export function agrietar(nodes: number[][], elements: number[][], ei: any): any {
  const iy = new Map(ei.momentsOfInertiaY ?? []), iz = new Map(ei.momentsOfInertiaZ ?? []), sm = new Map(ei.shellModifiers ?? []);
  elements.forEach((e, k) => {
    const p = e.map((n) => nodes[n]);
    if (e.length === 2) {
      const d = [0, 1, 2].map((c) => p[1][c] - p[0][c]), L = Math.hypot(...d);
      const f = L > 0 && Math.abs(d[2]) / L > Math.cos((20 * Math.PI) / 180) ? 0.8 : 0.5;
      if (iy.has(k)) iy.set(k, (iy.get(k) as number) * f);
      if (iz.has(k)) iz.set(k, (iz.get(k) as number) * f);
    } else if (e.length >= 3) {
      const zs = p.map((q) => q[2]);
      if (Math.max(...zs) - Math.min(...zs) < 1e-6) return;                     // losa: horizontal
      const v = (sm.get(k) as number[] | undefined) ?? [1, 1, 1, 1, 1, 1, 1, 1];
      sm.set(k, v.map((x, j) => (j < 6 ? x * 0.6 : x)));
    }
  });
  return { ...ei, momentsOfInertiaY: iy, momentsOfInertiaZ: iz, shellModifiers: sm };
}

export type ResultadoNEC = {
  pisos: Piso[];
  cr: [number, number][];
  modos: { T: number; ux: number; uy: number; rz: number }[];
  chequeoModos: string[];
  estatico: Estatico;
  derivasEst: Record<string, DerivaPiso[]>;          // Ex, Ex+e, Ex−e, Ey, Ey+e, Ey−e
  dinamico: { X: Espectral; Y: Espectral; escX: ReturnType<typeof escalaDinamico>; escY: ReturnType<typeof escalaDinamico>; minimo: number };
  torsional: { X: boolean; Y: boolean; peorX: number; peorY: number };
  /** índice de estabilidad por piso Qi = Pi·Δi/(Vi·hi) (NEC §6.3.8), Δ = deriva elástica promedio del piso, sin excentricidad */
  estabilidad: { X: number[]; Y: number[]; max: number };
  /** masa participativa acumulada con nModos (NEC: ≥ 90 % en X e Y) */
  sumaMasa: { ux: number; uy: number; rz: number };
  agrietadas: boolean;
  unidad: string;
};

const aMap = (o: any) => (o instanceof Map ? o : new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v])));

export function calcularNEC(nodes: number[][], elements: number[][], nodeInputs: any, elementInputsIn: any, o: OpcionesNEC): ResultadoNEC {
  const eiM = enMasa(elementInputsIn);
  const elementInputs = o.agrietadas ? agrietar(nodes, elements, eiM) : eiM;
  const ni = { ...nodeInputs, supports: aMap(nodeInputs.supports), diaphragms: aMap(nodeInputs.diaphragms) };
  const pisos = pisosDeModelo(nodes, elements, ni, elementInputs);
  if (!pisos.length) throw new Error("el modelo no tiene pisos (ni diafragmas ni cotas con masa)");
  const masas = jointMass(nodes as any, elements as any, elementInputs, { incluyeElementos: 1 });
  const esDia = ni.diaphragms.size ? (n: number) => ni.diaphragms.has(n) : undefined;
  const resolver = (loads: Map<number, any>) => deform(nodes as any, elements as any, { ...ni, loads } as any, elementInputs).deformations as any;

  // modal (la misma llamada con la que los periodos dan SAP2000 a 4 decimales)
  const out: any = modalCpp(nodes as any, elements as any, ni as any, elementInputs, o.nModos, 0, 0, 1, ni.diaphragms, ni.springs);
  const mp: number[][] = out.massParticipation ?? [];
  const modos = (out.frequencies ?? []).map((f: number, j: number) => ({ T: 1 / f, ux: mp[j]?.[0] ?? 0, uy: mp[j]?.[1] ?? 0, rz: mp[j]?.[5] ?? 0 }));
  const chequeoModos: string[] = [];
  modos.slice(0, 3).forEach((m: any, j: number) => {
    const tras = Math.max(m.ux, m.uy);
    if (j < 2) chequeoModos.push(`modo ${j + 1}: ${m.rz < 0.10 && tras > m.rz ? "✓" : "✗"} traslacional (RZ ${(m.rz * 100).toFixed(1)} % ${m.rz < 0.10 ? "<" : "≥"} 10 %; UX ${(m.ux * 100).toFixed(1)} % · UY ${(m.uy * 100).toFixed(1)} %)`);
    else chequeoModos.push(`modo 3: ${m.rz > tras ? "✓" : "✗"} rotacional (RZ ${(m.rz * 100).toFixed(1)} % frente a ${(tras * 100).toFixed(1)} % de traslación)`);
  });

  const T1 = modos[0]?.T;
  const estatico = cortanteEstatico(o.sitio, pisos, T1);
  const F = estatico.pisos.map((p) => p.F);
  const derivasEst: Record<string, DerivaPiso[]> = {};
  for (const [dir, s, nom] of [[0, 0, "Ex"], [0, 1, "Ex+e"], [0, -1, "Ex−e"], [1, 0, "Ey"], [1, 1, "Ey+e"], [1, -1, "Ey−e"]] as [0 | 1, number, string][]) {
    const L = cargasEnCM(nodes, pisos, F, dir, s * o.ecc, masas, ni.diaphragms);
    derivasEst[nom] = derivas(nodes, pisos, resolver(L), dir, o.sitio.R, esDia);
  }
  const cr = centrosDeRigidez(nodes, pisos, ni.diaphragms, resolver);

  const sp = espectro(o.sitio);
  const red = o.sitio.I / (o.sitio.R * (o.sitio.norma === "NEC-15" ? (o.sitio.phiP ?? 1) * (o.sitio.phiE ?? 1) : 1));
  const minimo = o.sitio.norma === "borrador" ? 1.0 : o.irregular ? 0.85 : 0.80;
  const X = espectralPorPiso(nodes, pisos, out, masas, sp.Sa, red, 0, o.sitio.R, esDia);
  const Y = espectralPorPiso(nodes, pisos, out, masas, sp.Sa, red, 1, o.sitio.R, esDia);
  const escX = escalaDinamico(X.V, estatico.V, minimo), escY = escalaDinamico(Y.V, estatico.V, minimo);

  const peor = (ks: string[]) => Math.max(...ks.flatMap((k) => derivasEst[k].map((d) => d.relacion)));
  const peorX = peor(["Ex", "Ex+e", "Ex−e"]), peorY = peor(["Ey", "Ey+e", "Ey−e"]);
  const Q = (k: string) => estatico.pisos.map((pe, i) => {
    const P = estatico.pisos.slice(i).reduce((a, q) => a + q.w, 0);
    return (P * derivasEst[k][i].prom) / pe.Vpiso;
  });
  const QX = Q("Ex"), QY = Q("Ey");
  const sumaMasa = { ux: mp.reduce((a, v) => a + (v?.[0] ?? 0), 0), uy: mp.reduce((a, v) => a + (v?.[1] ?? 0), 0), rz: mp.reduce((a, v) => a + (v?.[5] ?? 0), 0) };
  return {
    estabilidad: { X: QX, Y: QY, max: Math.max(...QX, ...QY) }, sumaMasa, agrietadas: !!o.agrietadas, unidad: unidadFuerza(elementInputsIn),
    pisos, cr, modos, chequeoModos, estatico, derivasEst,
    dinamico: { X, Y, escX, escY, minimo },
    torsional: { X: peorX > 1.2, Y: peorY > 1.2, peorX, peorY },
  };
}
