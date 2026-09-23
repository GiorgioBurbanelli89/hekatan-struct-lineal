/**
 * Estudio: T_u de las vigas de la Mesa de Torsión contra el mallado de la losa.
 *
 *   node cli/estudio_torsion_malla.mjs
 *
 * Escribe registros/2026-09-23_torsion_vs_malla.{json,md}. Hekatan sale del
 * mismo ejemplo del menú (tests/lib/mesaMalla.mjs); ETABS de
 * tests/datos/mesa_torsion_malla_etabs.json (tests/datos/gen_mesa_malla_etabs.py).
 */
import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { RAIZ } from "../tests/lib/wasm.mjs";
import { cargarMesa, correrMesa, phiTcrACI } from "../tests/lib/mesaMalla.mjs";

const mesa = await cargarMesa();
const ETABS = JSON.parse(readFileSync(join(RAIZ, "tests/datos/mesa_torsion_malla_etabs.json"), "utf-8"));
const eDe = (n) => ETABS.mallas.find((m) => m.n === n);
const r4 = (x) => (Number.isFinite(x) ? Math.round(x * 1e4) / 1e4 : null);

const NS = [1, 2, 4, 5, 8, 16, 32];
const mallas = NS.map((n) => {
  const r = correrMesa(mesa, n), e = eDe(n);
  return {
    n, Tu: r4(r.Tu), m_borde: r4(r.mBorde), integral_m: r4(r.integral),
    flecha: r4(r.flecha_mm), flecha_en_nudo: r.flechaNudo, m_centro: r4(r.mCentro),
    T1: r4(r.T1), T3: r4(r.T3),
    etabs: e ? { Tu: r4(e.Tu), T1: r4(e.T1), T3: r4(e.T3) } : null,
    perfilT: r.perfilT.map((s) => [r4(s.x0), r4(s.x1), r4(s.Tj)]),
    borde: r.borde.map((b) => [r4(b.x), r4(b.m)]),
  };
});

const se = correrMesa(mesa, 16, { vigaNudos: 0 });
const solo_extremos = {
  n_losa: 16, Tu: r4(se.Tu), m_borde: r4(se.mBorde), integral_m: r4(se.integral),
  flecha: r4(se.flecha_mm), m_centro: r4(se.mCentro), T1: r4(se.T1), T3: r4(se.T3),
  etabs_n1: eDe(1) ? { Tu: r4(eDe(1).Tu) } : null,
};

// ── Iteración ACI 318-19 §22.7.3.2 con la malla convergida (n = 16) ──
const aci = phiTcrACI({ b: 0.30, h: 0.50 });
const N_ACI = 16, iteracion_aci = [];
let f = 1;
for (let k = 0; k < 30; k++) {
  const r = correrMesa(mesa, N_ACI, { factorJ: f, modal: false });
  const ratio = aci.phiTcr / r.Tu;
  iteracion_aci.push({ paso: k, factor_J: r4(f), Tu: r4(r.Tu), ratio: r4(ratio),
                       m_borde: r4(r.mBorde), m_centro: r4(r.mCentro), flecha: r4(r.flecha_mm) });
  if (ratio >= 0.95) break;
  f = f * ratio;
}

const json = {
  modelo: "Mesa torsiónT.e2k (ETABS 19.1, Seproinca 2020): losa 6x6 t=0.10 Shell-Thin, vigas V30x50, columnas C40x40 articuladas, 4000Psi E=2534564 tonf/m2",
  caso: "UDCon2 = 1.2 Dead(peso propio) + 1.6 Live(0.5 tonf/m2) + 1.2 SCP(1.0 tonf/m2), del .e2k",
  unidades: "tonf, m; T_u y m en tonf·m y tonf·m/m; flecha en mm; periodos en s",
  notas: [
    "Viga analizada: la sur (y=0). T_u = max |T| en las vigas (sale en el extremo, cara de columna).",
    "m_borde = M_yy de la losa en el nudo central del borde sur (joints sin suavizar promediados; n=1: interpolado entre esquinas).",
    "integral_m = ∫_0^{L/2} m(x) dx por trapecios sobre los nudos del borde. Equilibrio de la media viga: T_u(apoyo) = -∫ m dx.",
    "flecha: w en el centro de la losa (n impar: media de las 4 esquinas del elemento central).",
    "Brazos rígidos OFF en Hekatan y ETABS. Masa modal como ETABS (K_M): viga en las esquinas, lateral, por piso.",
    "ETABS: 22 por OAPI, FLOORMESHMAXSIZE = 6/n, mismo combo, viga partida en los nudos de la losa.",
  ],
  aci: { ...Object.fromEntries(Object.entries(aci).map(([k, v]) => [k, r4(v)])), malla_n: N_ACI,
         formula: "φT_cr = 0.75·4·λ·√f'c·Acp²/pcp (psi, in), viga rectangular 30x50 sin alas" },
  mallas, solo_extremos, iteracion_aci,
};
writeFileSync(join(RAIZ, "registros/2026-09-23_torsion_vs_malla.json"), JSON.stringify(json, null, 1));

const pct = (a, b) => (b ? `${((a / b - 1) * 100).toFixed(1)} %` : "—");
const L = [];
L.push("# T_u de las vigas vs mallado de la losa — Mesa de Torsión (2026-09-23)", "");
L.push(`Modelo: ${json.modelo}.`, `Caso: ${json.caso}. Unidades: ${json.unidades}.`, "");
json.notas.forEach((t) => L.push(`- ${t}`));
L.push("", "## 1. Convergencia de malla (Hekatan vs ETABS 22)", "");
L.push("| n | T_u Hekatan | T_u ETABS | dif | m_borde | ∫₀^{L/2} m dx | flecha centro | T3 Hekatan | T3 ETABS | dif |");
L.push("|---|---|---|---|---|---|---|---|---|---|");
for (const m of mallas) {
  L.push(`| ${m.n} | ${m.Tu.toFixed(3)} | ${m.etabs ? m.etabs.Tu.toFixed(3) : "—"} | ${m.etabs && m.etabs.Tu > 1e-6 ? pct(m.Tu, m.etabs.Tu) : "—"} | ${m.m_borde.toFixed(3)} | ${m.integral_m.toFixed(3)} | ${m.flecha.toFixed(2)}${m.flecha_en_nudo ? "" : "*"} | ${m.T3.toFixed(4)} | ${m.etabs ? m.etabs.T3.toFixed(4) : "—"} | ${m.etabs ? pct(m.T3, m.etabs.T3) : "—"} |`);
}
L.push("", "\* sin nudo en el centro: media de las esquinas del elemento central (n = 1 es la cabeza de columna).");
L.push("", "## 2. Equilibrio de la media viga: T_u(apoyo) vs −∫₀^{L/2} m(x) dx", "");
L.push("| n | T_u | −∫ m dx | razón |", "|---|---|---|---|");
for (const m of mallas) L.push(`| ${m.n} | ${m.Tu.toFixed(3)} | ${(-m.integral_m).toFixed(3)} | ${m.integral_m ? (m.Tu / -m.integral_m).toFixed(3) : "—"} |`);
L.push("", "## 3. Viga unida a la losa SOLO en sus extremos (losa 16×16, viga de una pieza)", "");
L.push(`T_u = ${solo_extremos.Tu.toFixed(4)} · m_borde = ${solo_extremos.m_borde.toFixed(4)} · flecha centro = ${solo_extremos.flecha.toFixed(1)} mm (compatible 16×16: ${mallas.find(m => m.n === 16).flecha.toFixed(1)} mm) · T3 = ${solo_extremos.T3.toFixed(4)} s. ETABS con n = 1 (mismo caso: la viga no comparte nudos intermedios): T_u = ${eDe(1).Tu.toExponential(1)}.`);
L.push("", `## 4. Iteración ACI 318-19 §22.7.3.2 (malla ${N_ACI}×${N_ACI})`, "");
L.push(`f'c = ${aci.fc_psi.toFixed(0)} psi · Acp = ${aci.Acp_in2.toFixed(1)} in² · pcp = ${aci.pcp_in.toFixed(2)} in · T_cr = ${aci.Tcr.toFixed(3)} · **φT_cr = ${aci.phiTcr.toFixed(3)} tonf·m** (φ = 0.75, λ = 1, sección sin alas).`, "");
L.push("| paso | factor J | T_u | φT_cr/T_u | m_borde | m_centro | flecha |", "|---|---|---|---|---|---|---|");
for (const s of iteracion_aci) L.push(`| ${s.paso} | ${s.factor_J.toFixed(4)} | ${s.Tu.toFixed(3)} | ${s.ratio.toFixed(3)} | ${s.m_borde.toFixed(3)} | ${s.m_centro.toFixed(3)} | ${s.flecha.toFixed(2)} |`);
writeFileSync(join(RAIZ, "registros/2026-09-23_torsion_vs_malla.md"), L.join("\n") + "\n");
console.log(L.join("\n"));
