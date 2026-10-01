/**
 * CAPA NEC — irregularidades en planta y en elevación, AUTOMÁTICAS por geometría y por el análisis, con corrección
 * manual por tipo («auto / sí / no»), 1-oct-2026. Leído de los PDF (no de memoria):
 *
 * NEC-15 (NEC-SE-DS 2015), Tablas 13 y 14, pág. 50-52:
 *   planta  P1 torsional Δmax > 1.2·(Δ1+Δ2)/2 con torsión accidental · P2 retrocesos A > 0.15·B y C > 0.15·D ·
 *           P3 discontinuidad del piso (aberturas > 50 % del área, o rigidez del piso que cambia > 50 %) ·
 *           P4 ejes no paralelos.  φPi = 0.9;  φP = φPA·φPB, φPA = mín(tipos 1-3), φPB = tipo 4.
 *   elevac. E1 piso flexible K < 0.70·K_sup o < 0.80·prom(3 sup.) · E2 masa m > 1.5·m_adyacente (salvo cubierta más
 *           liviana) · E3 geométrica a > 1.3·b.  φEi = 0.9;  φE = φEA·φEB, φEA = tipo 1, φEB = tipos 2-3.
 *           Si ΔMi < 1.30·ΔMi+1 en todos los pisos → sin tipos 1-3. Sistema DUAL → φE = 1.
 * Borrador NEC-SE-DS 12-09-2023, §5.3.2, Tablas 5.1 y 5.2 (pág. 10-13): NO hay φ; la irregularidad trae requisitos:
 *   H1 torsional RIT = Δmax/Δprom > 1.2 → la torsión accidental se amplifica con Ax = (δmax/1.2·δprom)², 1 ≤ Ax ≤ 3
 *      (§6.2.4.3, ec. 6.7) y la deriva se mide en los bordes (§6.2.5) · H2 retrocesos > 20 % · H3 discontinuidad del
 *      diafragma (abertura > 25 % o rigidez > 50 %) · H4 desfase fuera del plano · H5 ejes no paralelos.
 *   V1 piso blando (como E1; no aplica si ninguna deriva > 1.30·la del piso superior, ni a 1 piso) · V2 geométrica
 *      1.3 · V3 discontinuidad en el plano del elemento vertical · V4 piso débil (resistencia: SOLO manual).
 */
import type { Piso } from "./pisos";
import type { DerivaPiso } from "./derivas";
import type { Norma } from "./estatico";

export type Forzar = -1 | 0 | 1;                  // −1 automático, 0 no, 1 sí
export type ClaveIrr = "P1" | "P2" | "P3" | "P4" | "P5" | "E1" | "E2" | "E3" | "E4" | "E5";
export type Irregularidad = { clave: ClaveIrr; nombre: string; grupo: "planta" | "elevación"; auto: boolean | null; valor: boolean; manual: boolean; detalle: string };
export type ResultadoIrr = { lista: Irregularidad[]; phiP: number; phiE: number; irregular: boolean; Ax?: { X: number[]; Y: number[] } };

export const NOMBRES: Record<ClaveIrr, string> = {
  P1: "Torsional", P2: "Retrocesos en esquinas", P3: "Discontinuidad del piso", P4: "Ejes no paralelos",
  P5: "Desfase fuera del plano (borrador)", E1: "Piso flexible / blando", E2: "Distribución de masa (NEC-15)",
  E3: "Geométrica en elevación", E4: "Discontinuidad del elemento vertical (borrador)", E5: "Piso débil, resistencia (borrador, manual)",
};

type Entrada = {
  norma: Norma; dual: boolean; nodes: number[][]; elements: number[][]; pisos: Piso[];
  derivasEst: Record<string, DerivaPiso[]>; Vpiso: number[]; forzar?: Partial<Record<ClaveIrr, Forzar>>;
};

export function detectar(e: Entrada): ResultadoIrr {
  const { norma, nodes, elements, pisos } = e, borr = norma === "borrador";
  const z = (n: number) => nodes[n][2];
  const plano = (el: number[]) => el.length >= 3 && el.every((n) => Math.abs(z(n) - z(el[0])) < 1e-6);
  const vertical = (el: number[]) => el.length === 2 ? Math.abs(z(el[1]) - z(el[0])) > 0.9 * Math.hypot(...[0, 1, 2].map((c) => nodes[el[1]][c] - nodes[el[0]][c]))
    : el.length >= 3 && Math.max(...el.map(z)) - Math.min(...el.map(z)) > 1e-3;
  const lista: Irregularidad[] = [];
  const pone = (clave: ClaveIrr, auto: boolean | null, detalle: string, aplica = true) => {
    if (!aplica) return;
    const f = e.forzar?.[clave] ?? -1, manual = f !== -1;
    lista.push({ clave, nombre: NOMBRES[clave], grupo: clave[0] === "P" ? "planta" : "elevación", auto, valor: manual ? f === 1 : !!auto, manual, detalle });
  };

  // ── P1 torsional: el peor Δmax/Δprom de Ex, Ex±e, Ey, Ey±e (todas las derivas ya llevan la torsión accidental)
  const rel = Math.max(...Object.values(e.derivasEst).flatMap((v) => v.map((d) => d.relacion)));
  pone("P1", rel > 1.2, `Δmax/Δprom = ${rel.toFixed(3)} ${rel > 1.2 ? ">" : "≤"} 1.2 (con ±5 %)`);

  // ── geometría de cada planta: losas rasterizadas
  const plantas = pisos.map((p) => {
    const losas = elements.filter((el) => plano(el) && Math.abs(z(el[0]) - p.z) < 1e-3);
    const pts = losas.length ? losas.flatMap((el) => el.map((n) => nodes[n])) : p.nudos.map((n) => nodes[n]);
    const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const Lx = x1 - x0, Ly = y1 - y0, N = 60, hx = Lx / N, hy = Ly / N;
    const lleno: boolean[][] = Array.from({ length: N }, () => new Array(N).fill(!losas.length));
    for (const el of losas) {
      const P = el.map((n) => nodes[n]);
      const bx0 = Math.min(...P.map((q) => q[0])), bx1 = Math.max(...P.map((q) => q[0])), by0 = Math.min(...P.map((q) => q[1])), by1 = Math.max(...P.map((q) => q[1]));
      for (let i = Math.max(0, Math.floor((bx0 - x0) / hx)); i < Math.min(N, Math.ceil((bx1 - x0) / hx)); i++)
        for (let j = Math.max(0, Math.floor((by0 - y0) / hy)); j < Math.min(N, Math.ceil((by1 - y0) / hy)); j++)
          if (!lleno[i][j] && dentro(x0 + (i + 0.5) * hx, y0 + (j + 0.5) * hy, P)) lleno[i][j] = true;
    }
    const area = lleno.flat().filter(Boolean).length / (N * N) * Lx * Ly;
    // entrantes en las 4 esquinas: tramo vacío desde la esquina a lo largo de cada borde
    const esquinas = [[0, 0, 1, 1], [N - 1, 0, -1, 1], [0, N - 1, 1, -1], [N - 1, N - 1, -1, -1]].map(([i0, j0, di, dj]) => {
      let a = 0; while (a < N && !lleno[i0 + di * a][j0]) a++;
      let c = 0; while (c < N && !lleno[i0][j0 + dj * c]) c++;
      return { ax: (a / N) * Lx, cy: (c / N) * Ly };
    });
    const retro = esquinas.reduce((s, q) => s + q.ax * q.cy, 0);
    return { Lx, Ly, area, abertura: Math.max(0, Lx * Ly - area - retro) / (Lx * Ly), esquinas, conLosa: losas.length > 0 };
  });
  const limRet = borr ? 0.20 : 0.15;
  const ret = plantas.map((q) => Math.max(...q.esquinas.map((c) => Math.min(c.ax / q.Lx, c.cy / q.Ly))));
  const rMax = Math.max(...ret);
  pone("P2", rMax > limRet, `entrante: ${(rMax * 100).toFixed(0)} % de la planta (límite ${limRet * 100} % en las dos direcciones)`);

  const limAb = borr ? 0.25 : 0.50;
  const ab = Math.max(...plantas.map((q) => q.abertura));
  let cambio = 0;
  for (let i = 1; i < plantas.length; i++) if (plantas[i].conLosa && plantas[i - 1].conLosa)
    cambio = Math.max(cambio, Math.abs(plantas[i].area - plantas[i - 1].area) / Math.max(plantas[i].area, plantas[i - 1].area));
  pone("P3", ab > limAb || cambio > 0.5, `aberturas ${(ab * 100).toFixed(0)} % del piso (límite ${limAb * 100} %) · cambio de área entre pisos ${(cambio * 100).toFixed(0)} % (límite 50 %)`);

  // ── P4 ejes no paralelos: barras y muros horizontales en planta fuera de 0°/90° (±5°) respecto al eje dominante
  const ang: number[] = [];
  elements.forEach((el) => { if (el.length === 2 && !vertical(el)) { const dx = nodes[el[1]][0] - nodes[el[0]][0], dy = nodes[el[1]][1] - nodes[el[0]][1];
    if (Math.hypot(dx, dy) > 0.3) ang.push(((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 90); } });
  const base = ang.length ? moda(ang) : 0;
  const fuera = ang.filter((a) => { const d = Math.abs(a - base) % 90; return Math.min(d, 90 - d) > 5; }).length;
  pone("P4", fuera > 0, `${fuera} barra(s) fuera de 0°/90° (±5°) respecto al eje principal (${base.toFixed(1)}°)`);

  // ── elementos verticales discontinuos (columna o muro que arranca sobre un piso sin nada debajo)
  const llegaDesdeAbajo = new Set<number>();
  elements.forEach((el) => { if (vertical(el)) { const top = el.reduce((a, n) => (z(n) > z(a) ? n : a), el[0]); llegaDesdeAbajo.add(top);
    el.forEach((n) => { if (z(n) > Math.min(...el.map(z)) + 1e-3) llegaDesdeAbajo.add(n); }); } });
  let desfase = 0;
  elements.forEach((el) => { if (!vertical(el)) return; const zb = Math.min(...el.map(z)); if (zb < 1e-3) return;
    const bajos = el.filter((n) => Math.abs(z(n) - zb) < 1e-3); if (bajos.some((n) => !llegaDesdeAbajo.has(n))) desfase++; });
  pone("P5", desfase > 0, `${desfase} elemento(s) vertical(es) sin continuidad hacia abajo`, borr);

  // ── E1 piso flexible / blando: K = V/(Δprom·h) con la carga en el CM (sin excentricidad)
  const rig = (k: string) => (e.derivasEst[k] ?? []).map((d, i) => e.Vpiso[i] / Math.max(d.prom * d.h, 1e-30));
  const flex = (k: string) => {
    const K = rig(k), D = (e.derivasEst[k] ?? []).map((d) => d.max), n = K.length;
    if (n < 2 || (borr && n === 1)) return { malo: false, txt: "" };
    if (D.every((d, i) => i === n - 1 || d <= 1.3 * D[i + 1])) return { malo: false, txt: "ninguna deriva > 1.30·la del piso de arriba" };
    for (let i = 0; i < n - 1; i++) {
      const sup = K.slice(i + 1, i + 4), prom3 = sup.reduce((a, b) => a + b, 0) / sup.length;
      if (K[i] < 0.7 * K[i + 1] || (sup.length === 3 && K[i] < 0.8 * prom3)) return { malo: true, txt: `piso ${i + 1}: K ${(K[i] / K[i + 1] * 100).toFixed(0)} % del de arriba` };
    }
    return { malo: false, txt: "K ≥ 70 % del piso de arriba y ≥ 80 % de los 3 de arriba" };
  };
  const fx = flex("Ex"), fy = flex("Ey");
  pone("E1", fx.malo || fy.malo, `X: ${fx.txt} · Y: ${fy.txt}`);

  // ── E2 masa (NEC-15)
  let mMal = "";
  for (let i = 0; i < pisos.length && !mMal; i++) for (const j of [i - 1, i + 1]) {
    if (j < 0 || j >= pisos.length) continue;
    const cubiertaLiviana = i === pisos.length - 1 && pisos[i].masa < pisos[i - 1]?.masa;
    if (!cubiertaLiviana && pisos[i].masa > 1.5 * pisos[j].masa) { mMal = `piso ${i + 1}: ${(pisos[i].masa / pisos[j].masa).toFixed(2)}× el piso ${j + 1}`; break; }
  }
  pone("E2", !!mMal, mMal || "ningún piso > 1.5× un adyacente", !borr);

  // ── E3 geométrica: dimensión en planta del sistema vertical (columnas y muros) por piso
  const dims = pisos.map((p, i) => {
    const z0 = i ? pisos[i - 1].z : 0, pts: number[][] = [];
    elements.forEach((el) => { if (vertical(el) && Math.min(...el.map(z)) >= z0 - 1e-3 && Math.max(...el.map(z)) <= p.z + 1e-3) el.forEach((n) => pts.push(nodes[n])); });
    if (!pts.length) return [0, 0];
    return [0, 1].map((c) => Math.max(...pts.map((q) => q[c])) - Math.min(...pts.map((q) => q[c])));
  });
  let gMal = "";
  for (let i = 0; i + 1 < dims.length && !gMal; i++) for (const c of [0, 1]) {
    const a = Math.max(dims[i][c], dims[i + 1][c]), b = Math.min(dims[i][c], dims[i + 1][c]);
    if (b > 0 && a > 1.3 * b) { gMal = `pisos ${i + 1}-${i + 2}, ${"XY"[c]}: ${(a / b).toFixed(2)}`; break; }
  }
  pone("E3", !!gMal, gMal || "ninguna dimensión > 1.3× la del piso adyacente");
  pone("E4", desfase > 0, `${desfase} elemento(s) vertical(es) con desfase`, borr);
  pone("E5", null, "resistencia del piso: no se calcula en el análisis lineal; indíquela a mano", borr);

  // ── coeficientes NEC-15 / Ax del borrador
  const v = (k: ClaveIrr) => !!lista.find((q) => q.clave === k)?.valor;
  let phiP = 1, phiE = 1;
  if (!borr) {
    phiP = (v("P1") || v("P2") || v("P3") ? 0.9 : 1) * (v("P4") ? 0.9 : 1);
    phiE = e.dual ? 1 : (v("E1") ? 0.9 : 1) * (v("E2") || v("E3") ? 0.9 : 1);
  }
  let Ax: ResultadoIrr["Ax"];
  if (borr && v("P1")) {
    const amp = (ks: string[]) => pisos.map((_, i) => Math.min(3, Math.max(1, Math.max(...ks.map((k) => e.derivasEst[k]?.[i]?.relDesp ?? 1)) / 1.2) ** 2));
    Ax = { X: amp(["Ex+e", "Ex−e"]), Y: amp(["Ey+e", "Ey−e"]) };
  }
  return { lista, phiP, phiE, irregular: lista.some((q) => q.valor), Ax };
}

function dentro(x: number, y: number, P: number[][]): boolean {
  let c = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++)
    if ((P[i][1] > y) !== (P[j][1] > y) && x < ((P[j][0] - P[i][0]) * (y - P[i][1])) / (P[j][1] - P[i][1]) + P[i][0]) c = !c;
  return c;
}

function moda(a: number[]): number {
  const cubo = new Map<number, number>();
  for (const v of a) { const k = Math.round(v) % 90; cubo.set(k, (cubo.get(k) ?? 0) + 1); }
  return [...cubo.entries()].sort((p, q) => q[1] - p[1])[0][0];
}
