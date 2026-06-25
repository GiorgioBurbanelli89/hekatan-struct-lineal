/**
 * 🎓 Test M — 3 variantes del mismo edificio rectangular para comparar el aporte de cada
 * sistema: (1) SOLO PÓRTICOS (vigas+columnas, sin losa), (2) SOLO CON LOSA (pórtico + losa
 * ShellThin DKE), (3) DUAL (pórtico + losa + MUROS de corte ShellThin).
 *
 * Parametrización dinámica estilo Aguiar Falconí: vectores svx (vano en X), svy (vano en Y)
 * y sp (altura de cada piso). Al aumentar el N° de vanos/pisos, el Tweakpane agrega sliders
 * (un largo por vano y una altura por piso) vía dynamicParams().
 */
import type { ExampleDef, ParamDef } from "../workspace/exampleRegistry";
import { deform, analyze, modalAnalysis, type Node, type Element } from "hekatan-fem";
import { necSpectrum, cortanteBasal, periodoAproximado, espectroSvg, distribucionVertical, type SoilType, type Region } from "../shared/espectroNEC";
import { combineModal } from "../shared/responseSpectrum";

const SOILS: SoilType[] = ["A", "B", "C", "D", "E"];
const REGS: Region[] = ["Costa", "Sierra", "Oriente"];

const E = 2534564, NU = 0.20, RHO = 2.40277, G = E / (2 * (1 + NU));
const MAXB = 6, MAXF = 8;   // tope de vanos/pisos para los params

interface Sys { slab: boolean; walls: boolean; }

// vectores de vanos/alturas desde los params (svx_i, svy_j, sp_k); fallback al default
function coordsFrom(p: any) {
  const nbx = p.nbx | 0, nby = p.nby | 0, nF = p.nFloors | 0;
  const svx = Array.from({ length: nbx }, (_, i) => p[`svx_${i + 1}`] ?? 5);
  const svy = Array.from({ length: nby }, (_, j) => p[`svy_${j + 1}`] ?? 5);
  const sp = Array.from({ length: nF }, (_, k) => p[`sp_${k + 1}`] ?? 3);
  const cum = (a: number[]) => a.reduce((acc, v) => (acc.push(acc[acc.length - 1] + v), acc), [0]);
  return { nbx, nby, nF, svx, svy, sp, xC: cum(svx), yC: cum(svy), zC: cum(sp) };
}

function buildEdificio(p: any, states: any, sys: Sys) {
  const { bCol, bBeam, hBeam, tSlab, tWall, ms, q } = p;
  const { nbx, nby, nF, xC, yC, zC } = coordsFrom(p);
  const Lx = xC[nbx], Ly = yC[nby];
  const nodes: Node[] = []; const key = new Map<string, number>();
  const nid = (x: number, y: number, z: number) => {
    const k = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
    let i = key.get(k); if (i === undefined) { i = nodes.length; nodes.push([x, y, z]); key.set(k, i); } return i;
  };
  const elements: Element[] = []; const kinds: string[] = [];

  // columnas en cada nudo del grid, todos los pisos
  for (let i = 0; i <= nbx; i++) for (let j = 0; j <= nby; j++)
    for (let f = 0; f < nF; f++) { elements.push([nid(xC[i], yC[j], zC[f]), nid(xC[i], yC[j], zC[f + 1])]); kinds.push("col"); }
  // vigas sobre las líneas del grid, por piso
  for (let f = 1; f <= nF; f++) {
    const z = zC[f];
    for (let i = 0; i <= nbx; i++) for (let j = 0; j < nby; j++) { elements.push([nid(xC[i], yC[j], z), nid(xC[i], yC[j + 1], z)]); kinds.push("beam"); }
    for (let j = 0; j <= nby; j++) for (let i = 0; i < nbx; i++) { elements.push([nid(xC[i], yC[j], z), nid(xC[i + 1], yC[j], z)]); kinds.push("beam"); }
  }
  // grilla de mallado de losa: subdivide cada vano en ~ms
  const meshLine = (c: number[]) => { const out = [c[0]]; for (let i = 0; i < c.length - 1; i++) { const n = Math.max(1, Math.round((c[i + 1] - c[i]) / ms)); for (let s = 1; s <= n; s++) out.push(c[i] + (c[i + 1] - c[i]) * s / n); } return out; };
  if (sys.slab) {
    const xm = meshLine(xC), ym = meshLine(yC);
    for (let f = 1; f <= nF; f++) { const z = zC[f];
      for (let i = 0; i < xm.length - 1; i++) for (let j = 0; j < ym.length - 1; j++) {
        elements.push([nid(xm[i], ym[j], z), nid(xm[i + 1], ym[j], z), nid(xm[i + 1], ym[j + 1], z), nid(xm[i], ym[j + 1], z)]); kinds.push("slab");
      }
    }
  }
  // muro de corte (dual): plano x=0, primer vano en Y, toda la altura
  if (sys.walls) {
    const ym = meshLine([yC[0], yC[1]]), zm = meshLine(zC);
    for (let j = 0; j < ym.length - 1; j++) for (let k = 0; k < zm.length - 1; k++) {
      elements.push([nid(0, ym[j], zm[k]), nid(0, ym[j + 1], zm[k]), nid(0, ym[j + 1], zm[k + 1]), nid(0, ym[j], zm[k + 1])]); kinds.push("wall");
    }
  }

  const A_c = bCol * bCol, I_c = bCol ** 4 / 12, J_c = 0.141 * bCol ** 4;
  const A_v = bBeam * hBeam, Iy_v = bBeam * hBeam ** 3 / 12, Iz_v = hBeam * bBeam ** 3 / 12, J_v = bBeam * hBeam ** 3 / 12 + hBeam * bBeam ** 3 / 12;
  const m = <T,>() => new Map<number, T>();
  const elasticities = m<number>(), poissonsRatios = m<number>(), shearModuli = m<number>(), densities = m<number>(),
    areas = m<number>(), momentsOfInertiaY = m<number>(), momentsOfInertiaZ = m<number>(), torsionalConstants = m<number>(),
    thicknesses = m<number>(), plateFormulations = m<number>(), drillingTypes = m<number>(),
    shearAreasY = m<number>(), shearAreasZ = m<number>();
  kinds.forEach((k, e) => {
    elasticities.set(e, E); poissonsRatios.set(e, NU); densities.set(e, RHO); shearModuli.set(e, G);
    // ETABS: losa/muro = ShellThin DKE → plateFormulation 2 (DKMQ Katili). Frame = Timoshenko (As=5/6·A).
    if (k === "slab" || k === "wall") { thicknesses.set(e, k === "wall" ? tWall : tSlab); plateFormulations.set(e, 2); drillingTypes.set(e, 2); }
    else if (k === "col") { areas.set(e, A_c); momentsOfInertiaY.set(e, I_c); momentsOfInertiaZ.set(e, I_c); torsionalConstants.set(e, J_c); shearAreasY.set(e, 5/6*A_c); shearAreasZ.set(e, 5/6*A_c); }
    else { areas.set(e, A_v); momentsOfInertiaY.set(e, Iy_v); momentsOfInertiaZ.set(e, Iz_v); torsionalConstants.set(e, J_v); shearAreasY.set(e, 5/6*A_v); shearAreasZ.set(e, 5/6*A_v); }
  });
  const supports = new Map<number, boolean[]>();
  nodes.forEach((pt, i) => { if (Math.abs(pt[2]) < 1e-9) supports.set(i, [true, true, true, true, true, true]); });
  const loads = new Map<number, number[]>();
  if (sys.slab) kinds.forEach((k, e) => { if (k !== "slab") return; const pp = elements[e].map(n => nodes[n]); const a = Math.hypot(pp[1][0] - pp[0][0], pp[1][1] - pp[0][1]); const b = Math.hypot(pp[3][0] - pp[0][0], pp[3][1] - pp[0][1]); const me = q * a * b / 4; for (const n of elements[e]) { const c = loads.get(n) ?? [0, 0, 0, 0, 0, 0]; c[2] -= me; loads.set(n, c); } });
  else kinds.forEach((k, e) => { if (k !== "beam") return; const L = Math.hypot(...[0, 1, 2].map(d => nodes[elements[e][1]][d] - nodes[elements[e][0]][d])); const w = q * 2.5 * L / 2; for (const n of elements[e]) { const c = loads.get(n) ?? [0, 0, 0, 0, 0, 0]; c[2] -= w; loads.set(n, c); } });

  states.nodes.val = nodes;
  states.elements.val = elements;
  states.nodeInputs.val = { supports, loads };
  states.elementInputs.val = { elasticities, poissonsRatios, shearModuli, densities, areas, momentsOfInertiaY, momentsOfInertiaZ, torsionalConstants, thicknesses, plateFormulations, drillingTypes, shearAreasY, shearAreasZ };

  // ── Resolver y recuperar resultados → así se VE el aporte de losa/muros (shell results).
  try {
    states.deformOutputs.val = deform(nodes, elements, states.nodeInputs.val, states.elementInputs.val);
    states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, states.deformOutputs.val);
  } catch (e: any) { console.warn("[Test M] análisis:", e?.message); }
}

/** Modal del edificio. Masa = ρ/g (ρ=2.40277 es densidad de PESO; sin /g la f sale ÷3.13). */
// Tope de GDL para el modal: el eigensolver es DENSO (O(n³)). Por encima de
// ~1800 GDL (≈300 nodos) el solve tarda demasiado / se cuelga el navegador.
// En vez de colgar, avisamos y pedimos una malla más gruesa.
const MAX_MODAL_DOF = 1800;
// Peso sísmico W = Σ ρ·V (auto-peso de frames + shells), en kN.
function pesoSismico(nodes: any, elements: any, ei: any): number {
  let W = 0;
  elements.forEach((e: number[], i: number) => {
    const rho = ei.densities?.get(i) ?? RHO;
    if (e.length === 2) {
      const L = Math.hypot(...[0, 1, 2].map(d => nodes[e[1]][d] - nodes[e[0]][d]));
      W += rho * (ei.areas?.get(i) ?? 0) * L;
    } else {
      const q = e.map((n: number) => nodes[n]);
      const a = Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]);
      const b = Math.hypot(q[3][0] - q[0][0], q[3][1] - q[0][1], q[3][2] - q[0][2]);
      W += rho * (ei.thicknesses?.get(i) ?? 0) * a * b;
    }
  });
  return W;
}

// NEC-15: líneas de texto con el cortante basal usando el período del modal.
function necLineas(p: any, nodes: any, elements: any, ei: any, T1?: number): string[] {
  try {
    const Z = p.necZ ?? 0.40, R = p.necR ?? 8, I = p.necI ?? 1.0;
    const soil = SOILS[(p.necSoil ?? 4) | 0], region = REGS[(p.necReg ?? 0) | 0];
    const sp = necSpectrum({ Z, soil, region, I, R, phiP: 1, phiE: 1 });
    const hn = Math.max(...nodes.map((n: number[]) => n[2]), 1e-6);
    const T = (T1 && T1 > 0) ? T1 : periodoAproximado(hn);
    const W = pesoSismico(nodes, elements, ei);
    const { Cs, V, SaTa } = cortanteBasal(sp, T, W, { I, R, phiP: 1, phiE: 1 });
    return [
      `── SÍSMICO NEC-15 ──  Z=${Z} · suelo ${soil} · ${region} (η=${sp.eta}) · R=${R} · I=${I}`,
      `Sa meseta=${(sp.eta * Z * sp.Fa).toFixed(3)}g · T0=${sp.T0.toFixed(2)}s · Tc=${sp.Tc.toFixed(2)}s`,
      `T₁=${T.toFixed(3)}s → Sa(T₁)=${SaTa.toFixed(3)}g · Cs=${Cs.toFixed(4)} · W=${W.toFixed(0)}kN`,
      `⇒ Cortante basal estático V = Cs·W = ${V.toFixed(1)} kN`,
    ];
  } catch (ex: any) { console.warn("NEC test-m:", ex?.message); return []; }
}

// Malla GRUESA fija solo para el MODAL. El display usa malla fina (tipo ETABS ~0.6m),
// pero el eigensolver denso topa a MAX_MODAL_DOF. El período modal casi no cambia con la
// malla (la rigidez lateral la dan pórtico+muro, no el refinamiento de la losa), así que
// correr el modal sobre una malla gruesa aparte da el mismo T₁ y cortante NEC, sin colgar.
const MODAL_MS = 2.5;
function runModalEdificio(p: any, states: any, modalPanel: any, label: string, sys: Sys) {
  // Reconstruye el modelo en malla GRUESA dentro del estado REAL del viewer. Así el modal
  // Y su animación usan la MISMA malla: el animador deforma la malla mostrada con el modo,
  // y si la malla mostrada fuera la fina (~900 nodos) y el modo de la gruesa (~110), los
  // nodos sobrantes darían NaN y la animación se rompería. La malla fina estática se
  // restaura al volver al caso "Linear Static" (que reconstruye con el ms fino del display).
  try { buildEdificio({ ...p, ms: MODAL_MS }, states, sys); }
  catch (e: any) { console.warn("[Test M Modal] build coarse:", e?.message); return; }
  const nodes = states.nodes.val, elements = states.elements.val;
  const ni = states.nodeInputs.val, ei = states.elementInputs.val;
  if (!nodes?.length || !ei?.densities?.size) return;
  const dof = nodes.length * 6;
  if (dof > MAX_MODAL_DOF) {
    const msg = `Modal omitido: ${dof} GDL > ${MAX_MODAL_DOF} aún con malla gruesa (ms=${MODAL_MS}m). Bajá vanos/pisos.`;
    try { modalPanel.render({ frequencies: [], modeShapes: [], massParticipation: [] }, { title: label, properties: [msg] }); } catch {}
    return;
  }
  const eiMass = { ...ei, densities: new Map([...ei.densities].map(([k, v]: [number, number]) => [k, v / 9.80665])) };
  try {
    const out = modalAnalysis(nodes, elements, ni, eiMass, 12);
    const T1 = out.frequencies?.[0] ? 1 / out.frequencies[0] : undefined;
    const nec = necLineas(p, nodes, elements, ei, T1);
    // Gráfica del espectro NEC-15 + ANÁLISIS DINÁMICO (espectro de respuesta).
    let spectrumHtml: string | undefined;
    let dynLines: string[] = [];
    try {
      const Z = p.necZ ?? 0.40, R = p.necR ?? 8, I = p.necI ?? 1.0, zeta = 0.05;
      const soil = SOILS[(p.necSoil ?? 4) | 0], region = REGS[(p.necReg ?? 0) | 0];
      // FACTORES de análisis: NEC-15 (default) o ASCE 7-22. El espectro/suelo NO cambia (Ecuador).
      const esAsce = ((p.norma ?? 0) | 0) === 1;
      const irregular = !!(p.irregular ?? 0);
      const Cd = p.cd ?? 5.5;
      const sp = necSpectrum({ Z, soil, region, I, R, phiP: 1, phiE: 1 });
      spectrumHtml = espectroSvg(sp, T1);
      const W = pesoSismico(nodes, elements, ei);
      const hn = Math.max(...nodes.map((n: number[]) => n[2]), 1e-6);
      const Tap = (T1 && T1 > 0) ? T1 : periodoAproximado(hn);
      // ── ESTÁTICO: fuerza lateral equivalente NEC §6.3.  V = I·Sa(T)/(R·φ)·W ──
      const Vest = cortanteBasal(sp, Tap, W, { I, R, phiP: 1, phiE: 1 }).V;
      // ── DINÁMICO: espectral CQC modal + SRSS direccional.  V_i = I·Sad(Tᵢ)·partMasa_i·W ──
      const freqs = out.frequencies ?? [], mpart = out.massParticipation ?? [];
      const periods = freqs.map((f: number) => (f > 0 ? 1 / f : 0));
      const Vmod = (dir: number) => freqs.map((f: number, i: number) =>
        I * sp.Sad(f > 0 ? 1 / f : 0) * ((mpart[i]?.[dir]) ?? 0) * W);
      const Vx = combineModal(Vmod(0), periods, "CQC", zeta);
      const Vy = combineModal(Vmod(1), periods, "CQC", zeta);
      const Vdin = Math.hypot(Vx, Vy);
      // ── CONTROL del cortante dinámico mínimo (si no se alcanza → escalar) ──
      //   NEC-15 §6.2.2.b: 80% regular / 85% irregular.   ASCE 7-22 §12.9.1.4: 100%.
      const minR = esAsce ? 1.00 : (irregular ? 0.85 : 0.80);
      const ratio = Vest > 0 ? Vdin / Vest : 0;
      const fEsc = ratio < minR ? minR / Math.max(ratio, 1e-6) : 1.0;
      dynLines = [
        `══ NORMA DE ANÁLISIS: ${esAsce ? "ASCE 7-22 (factores)" : "NEC-15 (Ecuador)"} · peligro sísmico SIEMPRE Ecuador (Z, Fa/Fd/Fs, espectro NEC) ══`,
        `── CORTANTE BASAL — estático vs dinámico ──`,
        `ESTÁTICO V = ${Vest.toFixed(1)} kN  ·  DINÁMICO Vx=${Vx.toFixed(1)} Vy=${Vy.toFixed(1)} → V=${Vdin.toFixed(1)} kN  (CQC+SRSS, ζ=${zeta})`,
        `CONTROL Vdin/Vest = ${(ratio * 100).toFixed(0)} %  ${ratio >= minR ? `✓ ≥ ${(minR * 100).toFixed(0)}%` : `✗ < ${(minR * 100).toFixed(0)}% → escalar ×${fEsc.toFixed(2)}`}  (${esAsce ? "ASCE 7-22 §12.9.1.4" : `NEC-15 §6.2.2.b ${irregular ? "irregular" : "regular"}`})`,
      ];
      // ── DERIVAS DE PISO: V estático distribuido en altura → resolver → ΔM = 0.75·R·ΔE ≤ 2% ──
      try {
        const zl = [...new Set(nodes.map((n: number[]) => +n[2].toFixed(2)))].sort((a: number, b: number) => a - b).filter((z: number) => z > 0.05);
        const idsAt = (z: number) => nodes.map((n: number[], idx: number) => [n[2], idx]).filter((o: number[]) => Math.abs(o[0] - z) < 0.02).map((o: number[]) => o[1]);
        if (zl.length) {
          const Fx = distribucionVertical(Vest, zl.map(() => W / zl.length), zl, Tap);
          const loads = new Map<number, number[]>();
          zl.forEach((z, k) => { const ids = idsAt(z), f = Fx[k] / Math.max(ids.length, 1); ids.forEach((idx: number) => { const c = loads.get(idx) ?? [0, 0, 0, 0, 0, 0]; c[0] += f; loads.set(idx, c); }); });
          const d: any = deform(nodes, elements, { supports: ni.supports, loads }, ei);
          const U = d.deformations, ux = (idx: number) => ((U.get ? U.get(idx) : U[idx]) || [0])[0];
          const uxL = zl.map((z) => { const ids = idsAt(z); return ids.reduce((s: number, idx: number) => s + ux(idx), 0) / Math.max(ids.length, 1); });
          // amplificación elástico→inelástico:  NEC ΔM=0.75·R·ΔE  ·  ASCE δx=Cd·δxe/Ie
          const ampD = esAsce ? (Cd / Math.max(I, 1e-6)) : (0.75 * R);
          let pu = 0, pz = 0, dmax = 0;
          zl.forEach((z, k) => { const dM = ampD * (uxL[k] - pu), dr = Math.abs(dM) / Math.max(z - pz, 1e-6); dmax = Math.max(dmax, dr); pu = uxL[k]; pz = z; });
          const dForm = esAsce ? `δx=Cd·δxe/Ie (Cd=${Cd}, Ie=${I}) · ASCE §12.8.6` : `ΔM=0.75·R·ΔE (R=${R}) · NEC §6.3.9`;
          dynLines.push(`── DERIVAS DE PISO (${dForm}) ──  máx = ${(dmax * 100).toFixed(2)} %  ${dmax <= 0.02 ? "✓ ≤ 2%" : "✗ > 2% (no cumple)"}`);
        }
      } catch (e: any) { console.warn("derivas:", e?.message); }
      // ── COMBINACIONES DE CARGA SÍSMICA (NEC-SE-CG §3.4.3 / NEC-SE-DS) ──
      // E = sismo de diseño = ρ·V_din escalado a ≥80% del estático (factor fEsc).
      // ρ = factor de redundancia (1.0 para estructura regular). Mismas combos
      // que ASCE 7: la 5 gobierna gravedad+sismo, la 7 el vuelco (D mínima).
      // ρ = redundancia: NEC-15 no la usa (=1.0). ASCE 7-22 §12.3.4: 1.0 ó 1.3 (acá 1.0 regular).
      const rho = 1.0;
      const Edis = rho * Vdin * fEsc;                 // sismo horizontal de diseño Eh [kN]
      // Componente vertical:  NEC-15 §3.4.2 Ev=(2/3)·Eh  ·  ASCE 7-22 §12.4.2.2 Ev=0.2·Sa·D
      const Ev = esAsce ? (0.20 * sp.Sa(0) * W) : ((2 / 3) * Edis);
      const evForm = esAsce ? "Ev=0.2·Sa·D · ASCE §12.4.2.2" : "Ev=(2/3)·Eh · NEC §3.4.2";
      dynLines.push(
        `── COMBINACIONES DE CARGA SÍSMICA (NEC-SE-CG §3.4.3) ──`,
        `C5:  1.2 D + 1.0 L + 1.0 E        (gravedad + sismo)`,
        `C7:  0.9 D + 1.0 E                (vuelco · gravedad mínima)`,
        `   E = ρ·V_din${fEsc > 1.001 ? `·fEsc` : ""} = ${rho.toFixed(1)}·${Vdin.toFixed(1)}${fEsc > 1.001 ? `·${fEsc.toFixed(2)}` : ""} = ${Edis.toFixed(1)} kN  (ρ=${rho.toFixed(1)}${esAsce ? " ASCE" : " NEC"}) ;  Ev ≈ ${Ev.toFixed(1)} kN  [${evForm}]`,
      );
    } catch (e: any) { console.warn("dinámico espectral:", e?.message); }
    modalPanel.render(out, { title: label, spectrumHtml, properties: [
      `Modal animado en malla gruesa ms=${MODAL_MS}m (${dof} GDL). El colormap estático usa malla fina ms=${p.ms}m.`,
      ...nec, ...dynLines] });
    console.log(`[Test M Modal] ${label} — f₁=${out.frequencies?.[0]?.toFixed(4)} Hz (coarse ${dof} GDL)`);
  } catch (e: any) { console.warn("Modal Test M error:", e?.message); }
}

// params base (siempre visibles)
const BASE: Record<string, ParamDef> = {
  nbx:     { default: 2, min: 1, max: MAXB, step: 1, label: "N° vanos X", folder: "Geometría" },
  nby:     { default: 2, min: 1, max: MAXB, step: 1, label: "N° vanos Y", folder: "Geometría" },
  nFloors: { default: 4, min: 1, max: MAXF, step: 1, label: "N° pisos", folder: "Geometría" },
  ms:      { default: 0.75, min: 0.5, max: 2.5, step: 0.25, label: "Malla shell [m] (ETABS≈0.6)", folder: "Geometría" },
  tSlab:   { default: 0.20, min: 0.10, max: 0.35, step: 0.01, label: "Espesor losa [m]", folder: "Secciones" },
  tWall:   { default: 0.25, min: 0.15, max: 0.40, step: 0.05, label: "Espesor muro [m]", folder: "Secciones" },
  bCol:    { default: 0.40, min: 0.25, max: 0.70, step: 0.05, label: "Columna b [m]", folder: "Secciones" },
  bBeam:   { default: 0.30, min: 0.20, max: 0.50, step: 0.05, label: "Viga b [m]", folder: "Secciones" },
  hBeam:   { default: 0.50, min: 0.30, max: 0.80, step: 0.05, label: "Viga h [m]", folder: "Secciones" },
  q:       { default: 1.0, min: 0, max: 2.0, step: 0.1, label: "Carga [tonf/m²]", folder: "Cargas" },
  // NEC-SE-DS 2015 — el cortante basal aparece en el panel Modal (usa T₁ del modal)
  necZ:    { default: 0.40, min: 0.15, max: 0.50, step: 0.05, label: "NEC Z (zona)", folder: "Sísmico NEC" },
  necSoil: { default: 4, options: { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4 }, label: "NEC suelo", folder: "Sísmico NEC" },
  necReg:  { default: 0, options: { "Costa (η1.8)": 0, "Sierra (η2.48)": 1, "Oriente (η2.6)": 2 }, label: "NEC región", folder: "Sísmico NEC" },
  necR:    { default: 8, min: 1, max: 8, step: 0.5, label: "NEC R", folder: "Sísmico NEC" },
  necI:    { default: 1.0, min: 1.0, max: 1.5, step: 0.1, label: "NEC I", folder: "Sísmico NEC" },
  // ── FACTORES DE ANÁLISIS opcionales: NEC-15 (default) ↔ ASCE 7-22. El PELIGRO sísmico
  //    (Z, Fa/Fd/Fs, espectro, aceleración en roca) es SIEMPRE de Ecuador — solo cambian
  //    los factores de deriva (0.75R vs Cd/Ie), el control (80/85% vs 100%) y Ev (2/3·Eh vs 0.2·Sa·D).
  norma:     { default: 0, options: { "NEC-15 (Ecuador)": 0, "ASCE 7-22 (factores)": 1 }, label: "Normativa (factores)", folder: "Sísmico NEC" },
  irregular: { default: 0, boolean: true, label: "¿Irregular? → control 85% (NEC)", folder: "Sísmico NEC" },
  cd:        { default: 5.5, min: 3, max: 6.5, step: 0.5, label: "ASCE Cd (amplif. deriva)", folder: "Sísmico NEC" },
};

// dynamicParams: agrega svx_i / svy_j / sp_k según nbx, nby, nFloors (vectores de Aguiar)
function dynParams(p: Record<string, number>): Record<string, ParamDef> {
  const out: Record<string, ParamDef> = { ...BASE };
  const nbx = (p.nbx ?? 2) | 0, nby = (p.nby ?? 2) | 0, nF = (p.nFloors ?? 4) | 0;
  for (let i = 1; i <= nbx; i++) out[`svx_${i}`] = { default: 5, min: 2, max: 9, step: 0.25, label: `Vano X-${i} [m]`, folder: "Vanos X (svx)" };
  for (let j = 1; j <= nby; j++) out[`svy_${j}`] = { default: 5, min: 2, max: 9, step: 0.25, label: `Vano Y-${j} [m]`, folder: "Vanos Y (svy)" };
  for (let k = 1; k <= nF; k++) out[`sp_${k}`] = { default: 3, min: 2.4, max: 4.5, step: 0.05, label: `Piso ${k} h [m]`, folder: "Alturas (sp)" };
  return out;
}

// Default = von Mises (combina membrana + flexión) → el MURO de corte muestra su
// esfuerzo real (compresión vertical de membrana). Con "displacementZ" el muro
// salía azul porque es rígido y casi no baja en Z. Se agregan los campos de
// membrana (Nxx/Nyy/Nxy) para ver la acción in-plane del muro directamente.
// SIN availableShellResults → el muro/losa muestran la tabla COMPLETA de resultados shell
// como ETABS: F11/F22/F12 (membrana), FMax/FMin (principal), V13/V23/VMax (cortante),
// M11/M22/M12 (flexión), MMax/MMin (mom. principal), vonMises, desplazamientos. El filtro
// (filterShellResultOptions) oculta SOLO 'pressure' porque no es fundación.
const shellRes = { defaultShellResult: "vonMises" };

export const testMPortico: ExampleDef = {
  id: "test-m-portico", name: "🎓 Test M — Solo pórticos (sin losa)", category: "🎓 Test M",
  params: { ...BASE }, dynamicParams: dynParams, hasModal: true,
  build(p, states) { buildEdificio(p, states, { slab: false, walls: false }); },
  runModal(_p, states, modalPanel) { runModalEdificio(_p, states, modalPanel, "Test M — Solo pórticos", { slab: false, walls: false }); },
};
export const testMLosa: ExampleDef = {
  id: "test-m-losa", name: "🎓 Test M — Solo con losa (pórtico + losa)", category: "🎓 Test M",
  params: { ...BASE }, dynamicParams: dynParams, hasModal: true, ...shellRes,
  build(p, states) { buildEdificio(p, states, { slab: true, walls: false }); },
  runModal(_p, states, modalPanel) { runModalEdificio(_p, states, modalPanel, "Test M — Pórtico + losa", { slab: true, walls: false }); },
};
export const testMDual: ExampleDef = {
  id: "test-m-dual", name: "🎓 Test M — Dual (pórtico + losa + muros)", category: "🎓 Test M",
  params: { ...BASE }, dynamicParams: dynParams, hasModal: true, ...shellRes,
  build(p, states) { buildEdificio(p, states, { slab: true, walls: true }); },
  runModal(_p, states, modalPanel) { runModalEdificio(_p, states, modalPanel, "Test M — Dual (pórtico+losa+muros)", { slab: true, walls: true }); },
};
