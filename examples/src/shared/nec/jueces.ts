/**
 * CAPA NEC — LOS 4 JUECES EN VIVO (1-oct-2026). Un cálculo corto, para repetirlo cada vez que cambia el modelo
 * (muros, secciones, pisos, vanos, hormigón o acero) mientras se tantea:
 *   1. matriz de piso de Aguiar K_E (condensación: aguiar.ts) → K_xθ, K_yθ, ρ, e
 *   2. centro de masas y de rigidez por piso (el CR del bloque diagonal de la MISMA flexibilidad)
 *   3. irregularidad torsional NEC: Δmax/Δprom por piso con la FLE y ±5 % (como calcularNEC)
 *   4. los 3 primeros modos: T y participación de masa UX, UY, RZ (+ chequeo 1-2 traslación, 3 giro)
 * Coste: 3 cargas por piso (Aguiar) + 6 estáticos + un modal de 3 modos.
 */
import { deform, jointMass, modalAnalysis as modalCpp } from "hekatan-fem";
import { pisosDeModelo, type Piso } from "./pisos";
import { cortanteEstatico, type DatosSitio } from "./estatico";
import { cargasEnCM, derivas } from "./derivas";
import { matrizDePiso, type ResultadoAguiar } from "./aguiar";

export type Jueces = {
  pisos: Piso[]; aguiar: ResultadoAguiar;
  torsion: { k: number; X: number; Y: number }[]; torsionMax: { X: number; Y: number };
  modos: { T: number; ux: number; uy: number; rz: number }[]; chequeo: boolean[];
  ms: number;
};

const aMap = (o: any) => (o instanceof Map ? o : new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v])));

export function calcularJueces(nodes: number[][], elements: number[][], nodeInputs: any, ei: any, sitio: DatosSitio, ecc = 0.05): Jueces {
  const t0 = performance.now();
  const ni = { ...nodeInputs, supports: aMap(nodeInputs?.supports), diaphragms: aMap(nodeInputs?.diaphragms) };
  const pisos = pisosDeModelo(nodes, elements, ni, ei);
  if (!pisos.length) throw new Error("el modelo no tiene pisos");
  const masas = jointMass(nodes as any, elements as any, ei, { incluyeElementos: 1 });
  const esDia = ni.diaphragms.size ? (n: number) => ni.diaphragms.has(n) : undefined;
  const resolver = (loads: Map<number, any>) => deform(nodes as any, elements as any, { ...ni, loads } as any, ei).deformations as any;

  // 4. modal de 3 modos
  const out: any = modalCpp(nodes as any, elements as any, ni as any, ei, 3, 0, 0, 1, ni.diaphragms, ni.springs);
  const mp: number[][] = out.massParticipation ?? [];
  const modos = (out.frequencies ?? []).slice(0, 3).map((f: number, j: number) => ({ T: 1 / f, ux: mp[j]?.[0] ?? 0, uy: mp[j]?.[1] ?? 0, rz: mp[j]?.[5] ?? 0 }));
  const chequeo = modos.map((m: any, j: number) => (j < 2 ? m.rz < 0.10 && Math.max(m.ux, m.uy) > m.rz : m.rz > Math.max(m.ux, m.uy)));

  // 3. torsión: FLE de la NEC con T1 del modal, Ex, Ex±e, Ey, Ey±e
  const est = cortanteEstatico(sitio, pisos, modos[0]?.T);
  const F = est.pisos.map((p) => p.F);
  const rel = (dir: 0 | 1) => [0, 1, -1].map((s) => derivas(nodes, pisos, resolver(cargasEnCM(nodes, pisos, F, dir, s * ecc, masas, ni.diaphragms)), dir, 1, esDia));
  const rx = rel(0), ry = rel(1);
  const torsion = pisos.map((p, i) => ({ k: p.k, X: Math.max(...rx.map((r) => r[i].relacion)), Y: Math.max(...ry.map((r) => r[i].relacion)) }));

  // 1 y 2. Aguiar (y el CR de su bloque diagonal)
  const aguiar = matrizDePiso(nodes, elements, ni, ei, pisos, masas);
  return { pisos, aguiar, torsion, torsionMax: { X: Math.max(...torsion.map((t) => t.X)), Y: Math.max(...torsion.map((t) => t.Y)) },
    modos, chequeo, ms: performance.now() - t0 };
}
