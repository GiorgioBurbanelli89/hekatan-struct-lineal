/**
 * Panel «🚚 Carga móvil» del workspace (5-oct-2026): Load Cases de SAP2000 que pasean un vehículo por un carril.
 *   · Multi-step Static: K·u_i = r_i, un estático por paso (CSiRefer p. 348 y 535-537). = SAP2000 0.000 %
 *     (tests/casos/multipaso_sap2000.mjs).
 * El carril sale solo: la cadena de barras HORIZONTALES más alta del modelo (el tablero), ordenada por su eje.
 * Las cargas del caso aplicado ahora (flechas) entran como patrón de UN paso: están en todos los pasos.
 */
import type { State } from "vanjs-core";
import { multiStepStatic, pasosVehiculoVivo, pasoUnico, tramosCarril, largoCarril, type ResultadoPaso } from "hekatan-fem";

export interface ModeloCargaMovil {
  nodes: State<any[]>; elements: State<any[]>; nodeInputs: State<any>; elementInputs: State<any>;
  deformOutputs: State<any>; analyzeOutputs: State<any>;
}

/** Vehículos: ejes kN, separaciones m (CSiRefer p. 515, Fig. 92: HL-93 = 8/32/32 k a 14 ft). */
export const VEHICULOS = [
  { nombre: "Camión HL-93 (35/145/145 kN · 4.3/4.3 m)", ejes: [35, 145, 145], sep: [4.3, 4.3] },
  { nombre: "Eje simple 100 kN", ejes: [100], sep: [] as number[] },
  { nombre: "Tándem HL-93 (110/110 kN · 1.2 m)", ejes: [110, 110], sep: [1.2] },
];

/** Carril automático: barras horizontales a la cota más alta, encadenadas de un extremo al otro. */
export function carrilAutomatico(nodes: number[][], elements: number[][]): number[] {
  const hz = elements.map((e, k) => ({ e, k })).filter(({ e }) => e.length === 2 &&
    Math.abs(nodes[e[1]][2] - nodes[e[0]][2]) < 1e-6 * (1 + Math.hypot(nodes[e[1]][0] - nodes[e[0]][0], nodes[e[1]][1] - nodes[e[0]][1])));
  if (!hz.length) return [];
  const zmax = Math.max(...hz.map(({ e }) => nodes[e[0]][2]));
  const top = hz.filter(({ e }) => Math.abs(nodes[e[0]][2] - zmax) < 1e-6);
  const porNudo = new Map<number, number[]>();
  top.forEach(({ e, k }) => e.forEach((n) => porNudo.set(n, [...(porNudo.get(n) ?? []), k])));
  // arranca en el extremo de menor x (luego y) con una sola barra
  const extremos = [...porNudo.entries()].filter(([, l]) => l.length === 1).map(([n]) => n);
  const ini = (extremos.length ? extremos : [...porNudo.keys()]).sort((a, b) => nodes[a][0] - nodes[b][0] || nodes[a][1] - nodes[b][1])[0];
  const out: number[] = []; const usadas = new Set<number>(); let n = ini;
  for (;;) {
    const sig = (porNudo.get(n) ?? []).find((k) => !usadas.has(k));
    if (sig === undefined) break;
    usadas.add(sig); out.push(sig);
    const e = elements[sig]; n = e[0] === n ? e[1] : e[0];
  }
  return out;
}

export function montarCargaMovil(folder: any, estado: ModeloCargaMovil, pararOtrasAnimaciones: () => void) {
  const f = folder.addFolder({ title: "🚚 Carga móvil (Multi-step Static)", expanded: false });
  const op: Record<string, number> = {}; VEHICULOS.forEach((v, k) => (op[v.nombre] = k));
  const p = { veh: 0, v: 1, dt: 0.7, sf: 1, conCaso: true, paso: 1, info: "Carril = barras horizontales del tablero. ▶ Calcular." };
  f.addBinding(p, "veh", { label: "Vehículo", options: op });
  f.addBinding(p, "v", { label: "Velocidad (m/s)", min: 0.1, max: 30, step: 0.1 });
  f.addBinding(p, "dt", { label: "Δt (s)", min: 0.05, max: 5, step: 0.05 });
  f.addBinding(p, "sf", { label: "Factor del vehículo", min: 0, max: 5, step: 0.05 });
  f.addBinding(p, "conCaso", { label: "+ cargas del caso en cada paso" });
  f.addButton({ title: "▶ Calcular (un estático por paso)" }).on("click", () => calcular());
  f.addBinding(p, "info", { label: "", readonly: true, multiline: true, rows: 9 });
  f.addBinding(p, "paso", { label: "Paso a ver", min: 1, max: 2000, step: 1 }).on("change", () => verPaso(Math.min(res?.length ?? 1, Math.round(p.paso)) - 1));
  f.addButton({ title: "🎞 Animar el paso del vehículo" }).on("click", () => animar());
  f.addButton({ title: "⏹ Detener" }).on("click", () => parar(true));
  f.addButton({ title: "🎞 Cómo se usa (GIF)" }).on("click", () => {
    try { window.open(`${(import.meta as any).env?.BASE_URL ?? "./"}tutoriales/multi_step_static.gif`, "_blank"); } catch { /* nada */ }
  });

  let res: ResultadoPaso[] | null = null, antes: { d: any; a: any } | null = null, raf = 0;
  function calcular() {
    parar(true);
    const nodes = estado.nodes.val, elements = estado.elements.val, ni = estado.nodeInputs.val, ei = estado.elementInputs.val;
    const barras = carrilAutomatico(nodes, elements);
    if (!barras.length) { p.info = "✗ no hay barras horizontales para el carril"; f.refresh(); return; }
    const tr = tramosCarril(nodes as any, elements as any, { barras });
    const Lc = largoCarril(tr), V = VEHICULOS[p.veh];
    const largoV = V.sep.reduce((s, x) => s + x, 0);
    const dur = Math.ceil((Lc + largoV) / p.v / p.dt) * p.dt;   // hasta que el último eje sale del carril
    const t0 = performance.now();
    try {
      const vl = pasosVehiculoVivo(nodes as any, elements as any, ei, [{ vehiculo: { nombre: V.nombre, ejes: V.ejes, sep: V.sep }, carril: { barras }, v: p.v }], dur, p.dt);
      const pats = [{ pasos: vl, sf: p.sf }];
      if (p.conCaso && ni?.loads?.size) pats.push({ pasos: pasoUnico(ni.loads, ei?.frameFixedEnd), sf: 1 });
      const eiBase = { ...ei, frameFixedEnd: undefined, ...(p.conCaso ? {} : { frameLoads: undefined }) };
      res = multiStepStatic(nodes as any, elements as any, { ...ni, loads: new Map() }, eiBase, pats);
    } catch (e) { res = null; p.info = "✗ " + String(e); f.refresh(); return; }
    let uz = 0, mMax = -Infinity, mMin = Infinity;
    for (const r of res) {
      for (const d of r.deformations.values()) uz = Math.min(uz, d[2]);
      for (const [, m] of r.bendingsZ) { mMax = Math.max(mMax, -m[0], m[1]); mMin = Math.min(mMin, -m[0], m[1]); }
    }
    p.info = `Multi-step Static (SAP2000)\ncarril: ${barras.length} barras, ${Lc.toFixed(2)} m\n` +
      `${res.length} pasos (t = 0 … ${dur.toFixed(2)} s, Δt ${p.dt})\nenvolvente:\n  Uz mín = ${uz.toFixed(6)}\n` +
      `  M3 máx = ${mMax.toFixed(3)}\n  M3 mín = ${mMin.toFixed(3)}\n${(performance.now() - t0).toFixed(0)} ms · como SAP2000`;
    p.paso = 1; f.refresh();
  }
  function verPaso(k: number) {
    if (!res || !res[k]) return;
    if (!antes) antes = { d: estado.deformOutputs.val, a: estado.analyzeOutputs.val };
    const r = res[k];
    estado.deformOutputs.val = { deformations: r.deformations, reactions: r.reactions } as any;
    estado.analyzeOutputs.val = { ...(antes.a ?? {}), normals: r.normals, shearsY: r.shearsY, shearsZ: r.shearsZ,
      torsions: r.torsions, bendingsY: r.bendingsY, bendingsZ: r.bendingsZ } as any;
  }
  function parar(restaurar: boolean) {
    if (raf) cancelAnimationFrame(raf); raf = 0;
    if (restaurar && antes) { estado.deformOutputs.val = antes.d; estado.analyzeOutputs.val = antes.a; antes = null; }
  }
  function animar() {
    if (!res) { calcular(); if (!res) return; }
    pararOtrasAnimaciones(); parar(false);
    let k = 0, ultimoT = 0;
    const tick = (now: number) => {
      if (now - ultimoT >= 120) { ultimoT = now; verPaso(k); p.paso = k + 1; f.refresh(); k = (k + 1) % res!.length; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  return { calcular, verPaso, parar, resultado: () => res, params: p, folder: f };
}
