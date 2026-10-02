/**
 * CAPA NEC — todo junto (30-sep-2026): pisos → estático → derivas con ±5 % → CR → modal → espectral CQC → control.
 * Un solo punto de entrada para el panel del workspace, la CLI y las pruebas. Cada pieza está validada aparte:
 *   masa y CM por piso = ETABS (Assembled Joint Masses) a 4 decimales · periodos = SAP2000 · estático con las
 *   mismas cargas = SAP2000 a 1e-9 % · CR = ETABS «Centers Of Mass And Rigidity» (X a 4 decimales, Y a ≤ 2 mm).
 */
import { deform, jointMass, modalAnalysis as modalCpp } from "hekatan-fem";
import { pisosDeModelo, type Piso } from "./pisos";
import { cortanteEstatico, espectro, ampDeriva, limiteDeriva, type DatosSitio, type Estatico } from "./estatico";
import { detectar, type ClaveIrr, type Forzar, type ResultadoIrr } from "./irregularidades";
import { cargasEnCM, derivas, centrosDeRigidez, type DerivaPiso } from "./derivas";
import { espectralPorPiso, escalaDinamico, combinarDir, combinarDir3, combinar, respuestaNudos, FACTOR_VERTICAL, type Espectral, type ComboModal, type ComboDir } from "./espectral";

export type OpcionesNEC = { sitio: DatosSitio; irregular?: boolean | null; nModos: number; ecc: number; agrietadas?: boolean;
  /** sistema dual (pórtico especial con muros): NEC-15 φE = 1 */ dual?: boolean;
  /** corrección manual de cada irregularidad: −1 automático, 0 no, 1 sí */ forzar?: Partial<Record<ClaveIrr, Forzar>>;
  /** combinación modal (CQC por defecto) y direccional (independiente = NEC-15 §3.5.1) */ modal?: ComboModal; direccional?: ComboDir;
  /** componente VERTICAL del espectral (U3 = ⅔·Sa) en la combinación direccional */ conVertical?: boolean };

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
  irregularidades: ResultadoIrr;
  /** derivas inelásticas DINÁMICAS (escaladas) con la combinación direccional elegida */
  dirDerivas: { metodo: ComboDir; X: number[]; Y: number[] };
  /** espectral VERTICAL (U3 = ⅔·Sa): cortante basal FZ, Uz máximo solo y combinado con X e Y */
  espVertical?: { FZ: number; uzMax: number; uzComb: number; metodo: ComboDir };
  /** sismo vertical en VOLADIZOS: NEC-15 §3.4.4 F_rev = ⅔·I·(η·Z·Fa)·Wp; borrador ec. 3.9 F_rev = ⅔·Ie·(2.4·Z·Fa)·W_vol */
  vertical: { coef: number; coefNEC11: number; pisos: { k: number; nudos: number; Wp: number; Frev: number }[] };
  sitio: DatosSitio;
  limiteDeriva: number;
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
  const amp = ampDeriva(o.sitio);
  const cr = centrosDeRigidez(nodes, pisos, ni.diaphragms, resolver);
  const sp = espectro(o.sitio);
  const sumaMasa = { ux: mp.reduce((a, v) => a + (v?.[0] ?? 0), 0), uy: mp.reduce((a, v) => a + (v?.[1] ?? 0), 0), rz: mp.reduce((a, v) => a + (v?.[5] ?? 0), 0) };

  /** estático (cortante, derivas Ex/Ex±e/Ey/Ey±e) con un sitio y una excentricidad por piso y dirección */
  const pasada = (sitio: DatosSitio, eccX: number[], eccY: number[]) => {
    const estatico = cortanteEstatico(sitio, pisos, T1);
    const F = estatico.pisos.map((p) => p.F);
    const derivasEst: Record<string, DerivaPiso[]> = {};
    for (const [dir, s, nom] of [[0, 0, "Ex"], [0, 1, "Ex+e"], [0, -1, "Ex−e"], [1, 0, "Ey"], [1, 1, "Ey+e"], [1, -1, "Ey−e"]] as [0 | 1, number, string][]) {
      const L = cargasEnCM(nodes, pisos, F, dir, (dir === 0 ? eccX : eccY).map((e) => s * e), masas, ni.diaphragms);
      derivasEst[nom] = derivas(nodes, pisos, resolver(L), dir, amp, esDia);
    }
    return { estatico, derivasEst };
  };
  const ecc0 = pisos.map(() => o.ecc);
  // 1.ª pasada: sin coeficientes de configuración → irregularidades (geometría + derivas con ±5 %)
  const p1 = pasada({ ...o.sitio, phiP: 1, phiE: 1 }, ecc0, ecc0);
  const irr = detectar({ norma: o.sitio.norma, dual: !!o.dual, nodes, elements, pisos, derivasEst: p1.derivasEst,
    Vpiso: p1.estatico.pisos.map((q) => q.Vpiso), forzar: o.forzar });
  // 2.ª pasada: NEC-15 con φP·φE (V = I·Sa/(R·φP·φE)·W); borrador con la torsión accidental × Ax por piso (ec. 6.7)
  const sitio: DatosSitio = { ...o.sitio, phiP: irr.phiP, phiE: irr.phiE };
  const { estatico, derivasEst } = irr.Ax || irr.phiP < 1 || irr.phiE < 1
    ? pasada(sitio, irr.Ax ? irr.Ax.X.map((a) => a * o.ecc) : ecc0, irr.Ax ? irr.Ax.Y.map((a) => a * o.ecc) : ecc0) : p1;

  const red = sitio.I / (sitio.R * (sitio.norma === "NEC-15" ? (sitio.phiP ?? 1) * (sitio.phiE ?? 1) : 1));
  const irregular = o.irregular === undefined || o.irregular === null ? irr.irregular : !!o.irregular;
  const minimo = sitio.norma === "borrador" ? 1.0 : irregular ? 0.85 : 0.80;
  const X = espectralPorPiso(nodes, pisos, out, masas, sp.Sa, red, 0, amp, esDia, 0.05, false, o.modal ?? "CQC");
  const Y = espectralPorPiso(nodes, pisos, out, masas, sp.Sa, red, 1, amp, esDia, 0.05, false, o.modal ?? "CQC");
  const escX = escalaDinamico(X.V, estatico.V, minimo), escY = escalaDinamico(Y.V, estatico.V, minimo);

  const peor = (ks: string[]) => Math.max(...ks.flatMap((k) => derivasEst[k].map((d) => d.relacion)));
  const peorX = peor(["Ex", "Ex+e", "Ex−e"]), peorY = peor(["Ey", "Ey+e", "Ey−e"]);
  // índice de estabilidad: NEC-15 Qi = Pi·Δi/(Vi·hi) (§6.3.8, Δ elástica); borrador θ = Px·Δ·Ie/(Vx·hsx·Cd) (ec. 6.9, Δ de
  // diseño = Cd·Δe/Ie) → los dos quedan P·Δe/(V·h) con Δe la deriva elástica
  const Q = (k: string) => estatico.pisos.map((pe, i) => {
    const P = estatico.pisos.slice(i).reduce((a, q) => a + q.w, 0);
    return (P * derivasEst[k][i].prom) / pe.Vpiso;
  });
  const QX = Q("Ex"), QY = Q("Ey");
  const dirM: ComboDir = o.direccional ?? "independiente";
  const dirDerivas = { metodo: dirM,
    X: X.pisos.map((p, i) => amp * combinarDir(p.deriva * escX.factor, Y.pisos[i].derivaPerp * escY.factor, dirM)),
    Y: Y.pisos.map((p, i) => amp * combinarDir(p.deriva * escY.factor, X.pisos[i].derivaPerp * escX.factor, dirM)) };
  const vertical = sismoVertical(nodes, elements, pisos, masas, sitio);
  let espVertical: ResultadoNEC["espVertical"];
  if (o.conVertical) {
    const md: ComboModal = o.modal ?? "CQC", f: number[] = out.frequencies ?? [], T = f.map((v) => (v > 0 ? 1 / v : 0));
    const Gv = 9.80665, rv = red * FACTOR_VERTICAL;
    const FZm = T.map((Tj, j) => { const A = rv * sp.Sa(Tj) * Gv, phi = out.modeShapes[j], esc = out.modeScales?.[j] ?? 1, Gam = out.participationFactors?.[j]?.[2] ?? 0;
      let v = 0; nodes.forEach((_, n) => { v += masas[n][2] * phi[6 * n + 2] * esc * Gam * A; }); return v; });
    const uz = respuestaNudos(nodes, out, sp.Sa, rv, 2, 2, md);
    const ux = respuestaNudos(nodes, out, sp.Sa, red, 0, 2, md), uy = respuestaNudos(nodes, out, sp.Sa, red, 1, 2, md);
    const dm = (o.direccional ?? "independiente") === "independiente" ? "SRSS" : (o.direccional as ComboDir);
    espVertical = { FZ: Math.abs(combinar(FZm, T, 0.05, md)), uzMax: Math.max(...uz), metodo: dm,
      uzComb: Math.max(...uz.map((z, i) => combinarDir3(ux[i], uy[i], z, dm))) };
  }
  return {
    estabilidad: { X: QX, Y: QY, max: Math.max(...QX, ...QY) }, sumaMasa, agrietadas: !!o.agrietadas, unidad: unidadFuerza(elementInputsIn),
    pisos, cr, modos, chequeoModos, estatico, derivasEst, irregularidades: irr, sitio, limiteDeriva: limiteDeriva(sitio), dirDerivas, vertical, espVertical,
    dinamico: { X, Y, escX, escY, minimo },
    torsional: { X: peorX > 1.2, Y: peorY > 1.2, peorX, peorY },
  };
}


/** Voladizos de cada piso = nudos FUERA del rectángulo de los elementos verticales (columnas y muros) de ese piso.
 *  F_rev = coef·W_p, reversible (hacia arriba y hacia abajo). NEC-15 §3.4.4: coef = ⅔·I·η·Z·Fa; borrador ec. 3.9:
 *  coef = ⅔·Ie·2.4·Z·Fa. Ev en general: ≥ ⅔·Eh (NEC-15 §3.4.2, borrador ec. 3.8). */
function sismoVertical(nodes: number[][], elements: number[][], pisos: Piso[], masas: number[][], s: DatosSitio) {
  const coef = s.norma === "NEC-15" ? (2 / 3) * s.I * (s.eta ?? 1.8) * s.Z * s.Fa : (2 / 3) * s.I * 2.4 * s.Z * s.Fa;
  const G = 9.80665;
  const out = pisos.map((p, i) => {
    const z0 = i ? pisos[i - 1].z : 0, pts: number[][] = [];
    elements.forEach((el) => { const zs = el.map((n) => nodes[n][2]); if (Math.max(...zs) - Math.min(...zs) > 1e-3 && Math.max(...zs) <= p.z + 1e-3 && Math.min(...zs) >= z0 - 1e-3) el.forEach((n) => pts.push(nodes[n])); });
    if (!pts.length) return { k: p.k, nudos: 0, Wp: 0, Frev: 0 };
    const x0 = Math.min(...pts.map((q) => q[0])) - 0.05, x1 = Math.max(...pts.map((q) => q[0])) + 0.05;
    const y0 = Math.min(...pts.map((q) => q[1])) - 0.05, y1 = Math.max(...pts.map((q) => q[1])) + 0.05;
    const fuera = p.nudos.filter((n) => { const q = nodes[n]; return Math.abs(q[2] - p.z) < 1e-3 && (q[0] < x0 || q[0] > x1 || q[1] < y0 || q[1] > y1); });
    const Wp = fuera.reduce((a, n) => a + masas[n][0] * G, 0);
    return { k: p.k, nudos: fuera.length, Wp, Frev: coef * Wp };
  });
  // NEC-11 §2.7.6.1 ec. (2-28): F_ver = ⅔·(Z·I·Fa)·Wp — sin η: el espectro plano de los voladizos es Z·Fa (§2.7.6.2)
  return { coef, coefNEC11: (2 / 3) * s.Z * s.I * s.Fa, pisos: out };
}