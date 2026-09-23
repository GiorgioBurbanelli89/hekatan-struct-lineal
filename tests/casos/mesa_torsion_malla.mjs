/**
 * Mesa de Torsión — T_u de viga vs mallado de la losa, contra ETABS 22.
 *
 * Wilson §7.7: viga y losa solo son compatibles en los nudos que comparten. Con
 * la losa n×n y la viga partida en esos nudos, T_u SUBE al refinar y converge;
 * con n = 1 (o la viga de una pieza, unida solo en sus extremos) la losa no le
 * impone giro relativo a la viga y T_u = 0 exacto, en Hekatan y en ETABS.
 *
 * Árbitro: tests/datos/mesa_torsion_malla_etabs.json (gen_mesa_malla_etabs.py,
 * ETABS 22 OAPI, FLOORMESHMAXSIZE = 6/n, brazos 0, UDCon2, viga sur).
 * Tolerancia de T_u: 4.5 %, la misma del T err máx de mesa_torsion_fuerzas —
 * Hekatan sale +3.7 % en torsión en TODAS las mallas (sesgo abierto, no de malla).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RAIZ } from "../lib/wasm.mjs";
import { cargarMesa, correrMesa } from "../lib/mesaMalla.mjs";

export const nombre = "mesa-torsion-malla";
export const descripcion = "Mesa de torsión: T_u y T3 vs malla de la losa (1..32) contra ETABS 22";

export async function correr() {
  const REF = JSON.parse(readFileSync(join(RAIZ, "tests/datos/mesa_torsion_malla_etabs.json"), "utf-8"));
  const mesa = await cargarMesa();
  const filas = [];
  const Tus = [];
  for (const e of REF.mallas) {
    const r = correrMesa(mesa, e.n);
    Tus.push(r.Tu);
    if (e.Tu < 1e-9) {
      filas.push({ que: `n=${e.n}: T_u = 0 (ETABS ${e.Tu.toExponential(1)})`, medido: r.Tu, limite: 1e-6,
                   ok: r.Tu < 1e-6, detalle: "sin nudos intermedios la viga no se tuerce" });
    } else {
      const d = Math.abs(r.Tu / e.Tu - 1) * 100;
      filas.push({ que: `n=${e.n}: T_u vs ETABS`, medido: d, limite: 4.5, ok: d <= 4.5,
                   detalle: `${r.Tu.toFixed(4)} vs ${e.Tu.toFixed(4)} tonf·m` });
    }
    const d3 = Math.abs(r.T3 / e.T3 - 1) * 100;
    filas.push({ que: `n=${e.n}: T3 vs ETABS`, medido: d3, limite: 1.0, ok: d3 <= 1.0,
                 detalle: `${r.T3.toFixed(5)} vs ${e.T3.toFixed(5)} s` });
    if (e.n === 32) {
      const razon = r.Tu / -r.integral;
      filas.push({ que: "n=32: equilibrio T_u / (−∫₀^{L/2} m dx)", medido: razon, limite: 0.98,
                   ok: razon >= 0.98 && razon <= 1.02, detalle: `${r.Tu.toFixed(4)} / ${(-r.integral).toFixed(4)}` });
    }
  }
  const crece = Tus.every((t, i) => i === 0 || t > Tus[i - 1]);
  filas.push({ que: "T_u crece al refinar (1→32)", medido: crece ? 1 : 0, limite: 1, ok: crece,
               detalle: Tus.map((t) => t.toFixed(3)).join(" → ") });
  // Estática del corte x = L/2: M_losa + M_vigas + H·h = momento estático, sea cual sea la J.
  for (const fJ of [1, 0.1]) {
    const r = correrMesa(mesa, 16, { factorJ: fJ, modal: false });
    const tot = r.Mlosa + r.Mvigas + r.Mportico, d = Math.abs(tot / r.Mest - 1) * 100;
    filas.push({ que: `J·${fJ}: M_losa + M_vigas + H·h = M estático (corte x = L/2)`, medido: d, limite: 0.01,
                 ok: d <= 0.01, detalle: `${r.Mlosa.toFixed(3)} + ${r.Mvigas.toFixed(3)} + ${r.Mportico.toFixed(3)} = ${tot.toFixed(3)} vs ${r.Mest.toFixed(3)} tonf·m` });
  }
  const se = correrMesa(mesa, 16, { vigaNudos: 0, modal: false });
  filas.push({ que: "viga unida solo en los extremos: T_u = 0", medido: se.Tu, limite: 1e-6,
               ok: se.Tu < 1e-6, detalle: `flecha centro ${se.flecha_mm.toFixed(1)} mm` });
  return filas;
}
