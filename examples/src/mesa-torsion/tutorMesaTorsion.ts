/**
 * Tutor de la Mesa de Torsión — dentro de Hekatan Struct, con la voz grabada de Jorge.
 *
 * Usa el tutor del repo (`shared/tutorTest.ts`): ficha a la izquierda, modelo a la derecha,
 * cursor virtual, y en cada tiempo cambia el modelo delante del usuario (malla, factor J,
 * vista, diagrama de torsión, mapa de momentos de la losa).
 *
 * Voz: examples/public/tutoriales/mesa_torsion/p1..p8.mp3 (es-MX-JorgeNeural +14 %, de
 * presentaciones_torsion/voz). Los textos de la voz son los del campo `v` de
 * presentaciones_torsion/torsion_viga_losa.html. Los NÚMEROS de la ficha salen del modelo
 * ABIERTO (se leen de los resultados después de cada cambio); donde la voz cita un dato de
 * ETABS se dice que es de ETABS y se pone al lado el de Struct con la misma malla.
 *
 * Abrir: «📐 Diseño» → «Tutor del test», `window.__hekatanTutorTest()` o `?t=mesa-torsion&tutor=1`.
 */
import type { PasoTutor, Tiempo } from "../shared/tutorTest";

const G = 9.80665;
const w = () => window as any;
const st = () => w().__hekatanStates;
const f2 = (x: number) => (Number.isFinite(x) ? x.toFixed(2) : "—");
const f3 = (x: number) => (Number.isFinite(x) ? x.toFixed(3) : "—");

// ── Lecturas del modelo abierto ──────────────────────────────────────────────
const nudos = (): number[][] => st()?.nodes?.val ?? [];
const idx = () => st()?._mesaTorsionIdx;
const L = () => w().__hekatanParams?.()?.Lx ?? 6;
/** Nudos del borde sur a la cota de la losa (viga sur), ordenados en x. */
const sur = () => nudos().map((n, k) => [n, k] as const)
  .filter(([n]) => Math.abs(n[1]) < 1e-9 && n[2] > 1e-9).sort((a, b) => a[0][0] - b[0][0]).map(([, k]) => k);
const centroLosa = () => {
  const N = nudos(); let mejor = -1, d = 1e9;
  N.forEach((n, k) => { if (n[2] < 1e-9) return; const e = Math.hypot(n[0] - L() / 2, n[1] - L() / 2); if (e < d) { d = e; mejor = k; } });
  return mejor;
};
/** T_u = máx |T| en las vigas del caso visualizado (tonf·m). */
function Tu(): number {
  const a = st()?.analyzeOutputs?.val?.torsions, ix = idx();
  if (!a || !ix) return NaN;
  let m = 0;
  for (let e = ix.beamStart; e < ix.beamEnd; e++) { const t = a.get(e); if (t) m = Math.max(m, Math.abs(t[0]), Math.abs(t[1])); }
  return m / G;
}
/** m_yy de la losa en el centro del borde sur (tonf·m/m): joints promediados en el nudo, interpolado en x. */
function mBorde(): number {
  const ana = st()?.analyzeOutputs?.val, els = st()?.elements?.val, N = nudos();
  const byy = ana?.bendingYYjoint ?? ana?.bendingYY; if (!byy || !els) return NaN;
  const acc = new Map<number, [number, number]>();
  for (const [e, v] of byy as Map<number, number[]>) {
    const el = els[e]; if (!el || el.length !== 4) continue;
    el.forEach((nd: number, k: number) => { if (Math.abs(N[nd][1]) > 1e-9) return;
      const a = acc.get(nd) ?? [0, 0]; acc.set(nd, [a[0] + v[k], a[1] + 1]); });
  }
  const b = [...acc.entries()].map(([nd, [s, c]]) => ({ x: N[nd][0], m: s / c / G })).sort((p, q) => p.x - q.x);
  const x = L() / 2;
  for (let k = 0; k < b.length - 1; k++)
    if (x >= b[k].x - 1e-9 && x <= b[k + 1].x + 1e-9) return b[k].m + (b[k + 1].m - b[k].m) * (x - b[k].x) / (b[k + 1].x - b[k].x);
  return NaN;
}
/** φT_cr de ACI 318-19 §22.7.5.1 con la viga rectangular del modelo (sin alas), tonf·m. */
function phiTcr(): number {
  const p = w().__hekatanParams?.() ?? {};
  const fc = 2812.279 / 0.70307;                      // 4000Psi del .e2k, en psi
  const IN = 1 / 0.0254, b = (p.bViga ?? 0.3) * IN, h = (p.hViga ?? 0.5) * IN;
  const Tcr = 4 * Math.sqrt(fc) * (b * h) ** 2 / (2 * (b + h));   // lb·in
  return 0.75 * Tcr * 4.4482216 * 0.0254 / 9806.65;
}

// ── Acciones sobre la app ────────────────────────────────────────────────────
const espera = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
async function poner(p: Record<string, number>) {
  Object.assign(w().__hekatanParams(), p); w().__hekatanRebuild(); await espera(450);
}
function visor(frame?: string, shell?: string) {
  const s = w().__hekatanSettings?.(); if (!s) return;
  if (frame !== undefined && s.frameResults) s.frameResults.val = frame;
  if (shell !== undefined && s.shellResults) s.shellResults.val = shell;
}
/**
 * Vista. La isométrica se aleja un 35 % después de ponerla: la franja del
 * modelo es estrecha (el tutor ocupa la izquierda) y la mesa se salía por el borde.
 */
async function vista(v: "iso" | "plan" | "elevX" | "elevY") {
  w().__hekatanSetView?.(v);
  if (v !== "iso") return;
  await espera(200);
  const ctx = w().__hekatanViewerCtx?.(); if (!ctx) return;
  const t = ctx.controls.target, c = ctx.camera;
  if (c.isOrthographicCamera) c.zoom /= 1.35; else c.position.sub(t).multiplyScalar(1.35).add(t);
  c.updateProjectionMatrix(); ctx.controls.update?.(); ctx.render?.();
}

// Iteración ACI: se guarda para que el paso 7 use el factor al que llegó el 6.
let iter: Array<{ f: number; Tu: number }> = [];
async function iterarACI(pasos = 6) {
  iter = []; let f = 1;
  await poner({ factorJ: 1 });
  for (let k = 0; k < pasos; k++) {
    const t = Tu(); iter.push({ f, Tu: t });
    if (phiTcr() / t >= 0.95) break;
    f *= phiTcr() / t; await poner({ factorJ: +f.toFixed(4) });
  }
  return iter[iter.length - 1];
}

const BASE_PARAMS = { nMesh: 5, factorJ: 1, vigaNudos: 1, activeCase: 4, rigidOffsets: 0 };
const nota = (t: string) => `<p style="font-size:13px;color:#94a3b8;margin-top:8px">${t}</p>`;
const eq = (t: string) => `<div style="font:600 19px Cambria,serif;color:#fff;margin:8px 0 8px 12px">${t}</div>`;

export function pasosMesaTorsion(): PasoTutor[] {
  return [
    {
      titulo: "1. La mesa", audio: "tutoriales/mesa_torsion/p1.mp3", params: BASE_PARAMS,
      texto: () => `<p>Losa de 10 cm sobre cuatro vigas de borde (30×50) y cuatro columnas (40×40, base articulada). La losa se modela con <b>cáscaras</b> Shell-Thin y la viga con un <b>elemento frame</b>.</p>` +
        nota(`Modelo: Mesa torsiónT.e2k (ETABS 19.1), combinación UDCon2 = 1.2D + 1.6L + 1.2SCP, losa ${w().__hekatanParams?.().nMesh}×${w().__hekatanParams?.().nMesh}.`),
      tiempos: [
        { voz: "", ms: 3200, accion: async () => { await vista("iso"); visor("none", "displacementZ"); }, senalar: () => ({ nudos: [centroLosa()] }), globo: "Losa: cáscara Shell-Thin, t = 0.10 m" },
        { voz: "", ms: 3200, senalar: () => ({ nudos: sur() }), globo: "Viga 30×50: barra (frame)" },
        { voz: "", ms: 2800, senalar: () => ({ nudos: [0, sur()[0]] }), globo: "Columna 40×40, base articulada" },
      ],
    },
    {
      titulo: "2. Cómo se unen losa y viga (Wilson §7.7)", audio: "tutoriales/mesa_torsion/p2.mp3",
      texto: () => `<p>En Wilson el nodo <i>i</i> está en el plano medio de la losa y el <i>j</i> en el eje neutro de la viga; se unen con una <b>restricción rígida</b> (ec. 7.15):</p>` +
        eq("θ<sub>x</sub><sup>losa</sup> = θ<sub>x</sub><sup>viga</sup>") +
        `<p style="font-size:14px;color:#cbd5e1">Wilson, <i>Análisis Estático y Dinámico de Estructuras</i>, §7.7, Fig. 7.6, ec. (7.15), págs. 119–120.</p>` +
        nota("En Struct (brazos rígidos = 0) viga y losa COMPARTEN el nudo: la restricción queda en la igualdad de giros en cada nudo compartido."),
      tiempos: [
        { voz: "", ms: 6200, accion: () => vista("elevX"), senalar: () => ({ nudos: sur() }), globo: "θx losa = θx viga en cada nudo compartido" },
        { voz: "", ms: 6000, senalar: () => ({ nudos: [sur()[Math.floor(sur().length / 2)]] }), globo: "Nudo compartido losa–viga" },
      ],
    },
    {
      titulo: "3. Por eso la viga se tuerce", audio: "tutoriales/mesa_torsion/p3.mp3",
      texto: () => `<p>La losa cargada quiere girar en su borde; la viga lo impide con su rigidez torsional:</p>` + eq("T<sub>u</sub> = G·J·θ′") +
        `<p>Es <b>torsión de compatibilidad</b>: aparece porque la viga acompaña el giro de la losa.</p>` +
        `<p>En este modelo: <b>T<sub>u</sub> = ${f3(Tu())} tonf·m</b> (máximo, junto a la columna).</p>`,
      tiempos: [
        { voz: "", ms: 6000, accion: async () => { await vista("plan"); visor("contour:torsions", "none"); }, senalar: () => ({ nudos: [sur()[0], sur()[1]] }), globo: () => `T_u = ${f2(Tu())} tonf·m` },
        { voz: "", ms: 5200, senalar: () => ({ nudos: sur() }), globo: "Diagrama de torsión de la viga" },
      ],
    },
    {
      titulo: "4. ¿Es confiable esa T<sub>u</sub>? El mallado", audio: "tutoriales/mesa_torsion/p4.mp3",
      texto: () => `<p>La compatibilidad solo se cumple <b>en los nudos compartidos</b>. Wilson: <i>“podría ser necesario aplicar la restricción a varias secciones a lo largo del eje de la viga”</i>.</p>` +
        `<p>Losa ${w().__hekatanParams?.().nMesh}×${w().__hekatanParams?.().nMesh}: <b>${sur().length}</b> nudos compartidos · <b>T<sub>u</sub> = ${f3(Tu())} tonf·m</b>.</p>` +
        eq("dT/dx = m<sub>borde</sub>(x) ⇒ T<sub>u</sub> = ∫₀<sup>L/2</sup> m dx") +
        `<table style="font-size:13px;color:#cbd5e1;border-collapse:collapse"><tr><th style="padding:2px 8px">n</th><th style="padding:2px 8px">Struct</th><th style="padding:2px 8px">ETABS 22</th></tr>` +
        [[1, "0.000", "0.000"], [2, "2.615", "2.528"], [4, "5.040", "4.860"], [8, "5.849", "5.639"], [16, "6.059", "5.844"]]
          .map(([n, a, b]) => `<tr><td style="padding:1px 8px">${n}</td><td style="padding:1px 8px">${a}</td><td style="padding:1px 8px">${b}</td></tr>`).join("") + `</table>` +
        nota("Tabla: registros/2026-09-23_torsion_vs_malla.md (misma malla en los dos programas, brazos 0). A 32×32 T_u = −∫m dx al 1 %."),
      tiempos: [1, 2, 4, 8, 16].map((n): Tiempo => ({
        voz: "", ms: 3300, params: { nMesh: n },
        accion: () => { void vista("plan"); visor("contour:torsions", "none"); },
        senalar: () => ({ nudos: sur() }),
        globo: () => `${n}×${n}: ${sur().length} nudos compartidos · T_u = ${f2(Tu())} tonf·m`,
      })),
    },
    {
      titulo: "5. Modelo lineal: la viga no cumple", audio: "tutoriales/mesa_torsion/p5.mp3", params: { nMesh: 5, factorJ: 1 },
      texto: () => `<p>Con J bruta, malla 5×5 (la de ETABS): <b>T<sub>u</sub> = ${f3(Tu())} tonf·m</b> en Struct; la voz cita el de ETABS, 5.22 (Struct queda +3.7 % en torsión en todas las mallas).</p>` +
        `<p>φT<sub>cr</sub> = <b>${f3(phiTcr())} tonf·m</b> (ACI 318-19 §22.7.5.1, viga 30×50 sin alas, f'c = 4000 psi) → T<sub>u</sub> / φT<sub>cr</sub> = ${f2(Tu() / phiTcr())}.</p>` +
        nota("La interacción cortante–torsión 51.46 > 31.67 kgf/cm² y el O/S #45 son del diseño de ETABS: Struct no hace ese chequeo y no los verifica."),
      tiempos: [
        { voz: "", ms: 7000, accion: async () => { await vista("plan"); visor("contour:torsions", "none"); }, senalar: () => ({ nudos: [sur()[0], sur()[1]] }), globo: () => `T_u = ${f2(Tu())} > φT_cr = ${f2(phiTcr())} tonf·m` },
        { voz: "", ms: 6500, senalar: () => ({ nudos: sur() }), globo: "ETABS: O/S #45 (sobreesfuerzo cortante + torsión)" },
      ],
    },
    {
      titulo: "6. La viga se fisura: J se reduce", audio: "tutoriales/mesa_torsion/p6.mp3", params: { nMesh: 5, factorJ: 1 },
      texto: () => `<p>Si T<sub>u</sub> &gt; T<sub>cr</sub> la viga se fisura y su rigidez torsional cae. ACI 318 §22.7.3.2 permite diseñarla para φT<sub>cr</sub>. Se itera:</p>` +
        eq("f<sub>k+1</sub> = f<sub>k</sub> · φT<sub>cr</sub> / T<sub>u,k</sub>") +
        (iter.length ? `<table style="font-size:13px;color:#cbd5e1">` + iter.map((s, k) => `<tr><td style="padding:1px 8px">${k}</td><td style="padding:1px 8px">f = ${s.f.toFixed(4)}</td><td style="padding:1px 8px">T_u = ${f3(s.Tu)}</td><td style="padding:1px 8px">φT_cr/T_u = ${f3(phiTcr() / s.Tu)}</td></tr>`).join("") + `</table>` : "") +
        nota(`Struct, malla 5×5, φT_cr = ${f3(phiTcr())}. La voz cita el cálculo de ETABS (factor 0.0695, T_u = 2.00, φT_cr = 1.94); el φT_cr de ETABS no se reprodujo aquí. Reducir J e iterar es una aproximación secante de la viga fisurada. Solo vale en torsión de COMPATIBILIDAD; la de EQUILIBRIO no se reduce.`),
      tiempos: [0, 1, 2, 3, 4, 5].map((k): Tiempo => ({
        voz: "", ms: 3000,
        accion: async () => {
          if (k === 0) { iter = []; await poner({ factorJ: 1 }); }
          else {
            const u = iter[iter.length - 1];
            if (phiTcr() / u.Tu < 0.95) await poner({ factorJ: +(u.f * phiTcr() / u.Tu).toFixed(4) });
          }
          await vista("plan"); visor("contour:torsions", "none");
          const f = w().__hekatanParams().factorJ;
          if (!iter.length || iter[iter.length - 1].f !== f) iter.push({ f, Tu: Tu() });
        },
        senalar: () => ({ nudos: [sur()[0], sur()[1]] }),
        globo: () => `paso ${k}: factor J = ${w().__hekatanParams().factorJ.toFixed(4)} · T_u = ${f2(Tu())} tonf·m`,
      })),
    },
    {
      titulo: "7. El momento pasa a la losa", audio: "tutoriales/mesa_torsion/p7.mp3",
      texto: () => {
        const fin = iter.length ? iter[iter.length - 1].f : NaN;
        return `<p>El torque que la viga ya no toma lo toma la <b>losa</b>. Mapa: momento M22 de la losa (m<sub>yy</sub>).</p>` +
          `<p>Borde sur, centro: <b>m = ${f3(mBorde())} tonf·m/m</b> con factor J = ${w().__hekatanParams().factorJ.toFixed(4)}.</p>` +
          nota(`Lo que se conserva EXACTO es el momento del corte completo x = L/2: losa + vigas + empuje de pórtico H·h = 65.681 tonf·m con J bruta y con J reducida (malla 16×16); la losa pasa de 8.11 a 13.57. La suma borde + centro en UN punto no es constante (no es una franja sobre apoyos rígidos). La voz cita ETABS (−2.73 → −0.85); factor final de Struct: ${Number.isFinite(fin) ? fin.toFixed(4) : "—"}.`);
      },
      tiempos: [
        { voz: "", ms: 6200, accion: async () => { await poner({ factorJ: 1 }); await vista("iso"); visor("none", "bendingYY"); },
          senalar: () => ({ nudos: sur().filter((_, k, a) => Math.abs(k - (a.length - 1) / 2) <= 0.5) }), globo: () => `J bruta: m_borde = ${f2(mBorde())} tonf·m/m` },
        { voz: "", ms: 6300, accion: async () => { if (!iter.length) await iterarACI(); await poner({ factorJ: +iter[iter.length - 1].f.toFixed(4) }); await vista("iso"); visor("none", "bendingYY"); },
          senalar: () => ({ nudos: sur().filter((_, k, a) => Math.abs(k - (a.length - 1) / 2) <= 0.5) }), globo: () => `J fisurada: m_borde = ${f2(mBorde())} tonf·m/m` },
      ],
    },
    {
      titulo: "8. Conclusión para el diseño", audio: "tutoriales/mesa_torsion/p8.mp3",
      texto: () => `<p>• La T<sub>u</sub> lineal es un <b>máximo elástico</b>, confiable solo si la malla converge (T<sub>u</sub> sube al refinar: 0 → 2.62 → 5.04 → 5.85 → 6.06).<br>` +
        `• La <b>losa</b> se arma con los momentos <b>después</b> de fisurar la viga (positivo al centro +48 % a 16×16).<br>` +
        `• La <b>viga</b> igual lleva estribos cerrados y acero longitudinal para φT<sub>cr</sub>.<br>` +
        `• Solo aplica a torsión de <b>compatibilidad</b>; la de <b>equilibrio</b> (un volado colgado de la viga) no se reduce.<br>` +
        `• Reducir J e iterar es una aproximación secante del comportamiento no lineal.</p>`,
      tiempos: [
        { voz: "", ms: 9500, accion: async () => { await vista("iso"); visor("contour:torsions", "none"); }, senalar: "modelo" },
        { voz: "", ms: 9000, senalar: () => ({ nudos: sur() }), globo: "Estribos cerrados + longitudinal para φT_cr" },
      ],
    },
  ];
}
