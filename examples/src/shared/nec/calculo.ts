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

export type OpcionesNEC = { sitio: DatosSitio; irregular: boolean; nModos: number; ecc: number };

export type ResultadoNEC = {
  pisos: Piso[];
  cr: [number, number][];
  modos: { T: number; ux: number; uy: number; rz: number }[];
  chequeoModos: string[];
  estatico: Estatico;
  derivasEst: Record<string, DerivaPiso[]>;          // Ex, Ex+e, Ex−e, Ey, Ey+e, Ey−e
  dinamico: { X: Espectral; Y: Espectral; escX: ReturnType<typeof escalaDinamico>; escY: ReturnType<typeof escalaDinamico>; minimo: number };
  torsional: { X: boolean; Y: boolean; peorX: number; peorY: number };
};

const aMap = (o: any) => (o instanceof Map ? o : new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v])));

export function calcularNEC(nodes: number[][], elements: number[][], nodeInputs: any, elementInputs: any, o: OpcionesNEC): ResultadoNEC {
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
  return {
    pisos, cr, modos, chequeoModos, estatico, derivasEst,
    dinamico: { X, Y, escX, escY, minimo },
    torsional: { X: peorX > 1.2, Y: peorY > 1.2, peorX, peorY },
  };
}
