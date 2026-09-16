/**
 * `torsion safe`: la semantica de SAFE como opcion CON NOMBRE en el `.heks`
 * (la regla de Jorge: primero SAP2000, luego cada programa anadiendo lo suyo con
 * nombre, como `deck etabs` o `etabsjoint`).
 *
 * SAFE 20 analiza las vigas con 0.1·J. Medido el 5-sep-2026 con el mini-modelo
 * m3 (dos zapatas 4×4 Shell-Thick sobre Winkler, dos pedestales y una viga de
 * amarre cargada a torsion): SAFE leyendo el f2k con la J de Hekatan tal cual da
 * en los topes Rx = 1.568e-2 y 1.678e-3 rad; Hekatan con la J de la viga ×0.1 da
 * 1.5675e-2 y 1.678e-3. Con J×3, ×9 y ×27 en el f2k, SAFE sigue la curva de
 * Hekatan con 0.3J, 0.9J y 2.7J. No hay tabla ni preferencia que lo cambie.
 *
 * Aqui se vigila:
 *   · sin directiva = SAP2000/ETABS (la J del .heks entra entera);
 *   · con `torsion safe` Hekatan reproduce a SAFE nudo a nudo (Uz y giros);
 *   · `torsion <f>` acepta un factor cualquiera.
 * La referencia es lo que devolvio SAFE (`tests/datos/cimentacion_mini_m3_safe_j1.json`),
 * no un numero a mano.
 */
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { resolverHeks } from "../lib/heks.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "torsion-safe-directiva";
export const descripcion = "`torsion safe` en el .heks: la viga con 0.1·J, como SAFE; sin directiva, como SAP2000/ETABS";

export async function correr() {
  const filas = [];
  const base = readFileSync(join(AQUI, "..", "datos", "cimentacion_mini_m3.heks"), "utf-8");
  const S = JSON.parse(readFileSync(join(AQUI, "..", "datos", "cimentacion_mini_m3_safe_j1.json"), "utf-8"));
  const dir = mkdtempSync(join(tmpdir(), "hkTorsion-"));
  const con = (texto, tag) => { const f = join(dir, tag + ".heks"); writeFileSync(f, texto, "utf-8"); return resolverHeks(f); };

  const sin = await con(base, "sin");
  const safe = await con(base.replace("\nsolve", "\ntorsion safe\nsolve"), "safe");
  const medio = await con(base.replace("\nsolve", "\ntorsion 0.5\nsolve"), "medio");

  // la J de la viga de amarre (frame 3) es la que cambia
  const J = (m, e) => m.elementInputs.torsionalConstants.get(e);
  const J0 = 0.00127345;
  filas.push({ que: "sin directiva: J de la viga entera", medido: Math.abs(J(sin, 2) / J0 - 1) * 100, limite: 1e-6, ok: Math.abs(J(sin, 2) / J0 - 1) < 1e-8, detalle: `${J(sin, 2)} = la del .heks` });
  filas.push({ que: "torsion safe: J × 0.1", medido: Math.abs(J(safe, 2) / (0.1 * J0) - 1) * 100, limite: 1e-6, ok: Math.abs(J(safe, 2) / (0.1 * J0) - 1) < 1e-8, detalle: `${J(safe, 2)}` });
  filas.push({ que: "torsion 0.5: J × 0.5", medido: Math.abs(J(medio, 2) / (0.5 * J0) - 1) * 100, limite: 1e-6, ok: Math.abs(J(medio, 2) / (0.5 * J0) - 1) < 1e-8, detalle: `${J(medio, 2)}` });

  // contra SAFE, nudo a nudo: Uz (% del maximo) y giros en los dos topes (nudos 26 y 52, 1-based)
  const cmp = (m, tag) => {
    const U = m.deformOutputs.deformations;
    let umax = 0; for (const [, u] of U) umax = Math.max(umax, Math.abs(u[2]));
    let peor = 0;
    for (const s of S.nudos) { const u = U.get(s.i); if (u) peor = Math.max(peor, Math.abs(s.u[2] - u[2]) / umax * 100); }
    const rx = [25, 51].map(i => { const s = S.nudos.find(n => n.i === i); return Math.abs(U.get(i)[3] / s.u[3] - 1) * 100; });
    return { peor, rxPeor: Math.max(...rx) };
  };
  const a = cmp(safe, "safe"), b = cmp(sin, "sin");
  filas.push({ que: "torsion safe vs SAFE: peor Uz (% del maximo)", medido: a.peor, limite: 0.1, ok: a.peor <= 0.1, detalle: "SAFE imprime U con 0.0005 mm de resolucion" });
  filas.push({ que: "torsion safe vs SAFE: giro Rx en los topes (%)", medido: a.rxPeor, limite: 1.0, ok: a.rxPeor <= 1.0, detalle: "SAFE imprime los giros con 4-5 cifras" });
  filas.push({ que: "SIN directiva vs SAFE: el giro NO cierra (es otra estructura)", crudo: true, medido: `${b.rxPeor.toFixed(1)} %`, limite: "> 50 %", ok: b.rxPeor > 50, detalle: "Hekatan/SAP2000/ETABS dan un tercio del giro de SAFE" });
  return filas;
}
