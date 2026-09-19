/**
 * Alcantarilla cajón con carga móvil HL-93 (ejemplo `alcantarilla-carga-movil`).
 *
 * Hekatan va por el MISMO camino que la app: .heks → cliModeler → líneas de influencia
 * (shared/cargaMovil.ts) → superposición por posición. Árbitros: SAP2000 (juez) y OpenSeesPy (testigo),
 * el mismo modelo nudo a nudo, un caso estático por posición del camión (validation/carga-movil/).
 * Sin la referencia de un programa, al menos el equilibrio: ΣR = ΣP en cada posición.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { armar } from "../../validation/carga-movil/dump_alcantarilla.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "alcantarilla-carga-movil";
export const descripcion = "alcantarilla 2 celdas + HL-93: equilibrio en cada posición y M3/Uz contra SAP2000 y OpenSeesPy";

export async function correr() {
  const { m, modelo, veh, xs, IL } = await armar("ejemplo");
  const filas = [];
  let peorEq = 0, repartido = 0;
  const est = new Map();
  for (const x of xs) {
    const s = m.estadoEnPosicion(IL, veh, x);
    peorEq = Math.max(peorEq, Math.abs(s.sumaCargas - s.sumaReacciones));
    repartido = Math.max(repartido, s.pesos.repartido);
    est.set(+x.toFixed(6), s);
  }
  filas.push({ que: `equilibrio ΣR = ΣP en las ${xs.length} posiciones (kN)`, medido: peorEq, limite: 1e-6, ok: peorEq < 1e-6 });
  filas.push({ que: "todos los ejes caen en nudo (kN repartidos por palanca)", medido: repartido, limite: 0, ok: repartido === 0 });
  for (const prog of ["sap2000", "opensees"]) {
    const f = join(AQUI, "..", "datos", `alcantarilla_${prog}.json`);
    if (!existsSync(f)) { filas.push({ que: `referencia ${prog}`, medido: "falta", limite: "-", ok: prog !== "sap2000" ? false : true, detalle: "⏳ SAP2000 sin correr todavía" }); continue; }
    const R = JSON.parse(readFileSync(f, "utf-8"));
    let mU = 0, pU = 0, mM = 0, pM = 0;
    for (const [, r] of Object.entries(R.posiciones)) {
      const s = est.get(+r.xF.toFixed(6));
      r.Uz.forEach((u, n) => { pU = Math.max(pU, Math.abs(u)); mU = Math.max(mU, Math.abs(u - s.U[n * 6 + 2])); });
      r.M3.forEach(([a, b], e) => { pM = Math.max(pM, Math.abs(a), Math.abs(b)); mM = Math.max(mM, Math.abs(a - s.F[e * 6 + 4]), Math.abs(b - s.F[e * 6 + 5])); });
    }
    const eU = mU / pU * 100, eM = mM / pM * 100;
    filas.push({ que: `Uz vs ${prog} (5 posiciones, % del máx)`, medido: +eU.toFixed(5), limite: 0.01, ok: eU < 0.01 });
    filas.push({ que: `M3 vs ${prog} (5 posiciones, % del máx)`, medido: +eM.toFixed(5), limite: 0.01, ok: eM < 0.01 });
    let Mmax = -Infinity, Mmin = Infinity, Uz = 0;
    for (const s of est.values()) { for (let e = 0; e < IL.nE; e++) { Mmax = Math.max(Mmax, s.F[e * 6 + 4], s.F[e * 6 + 5]); Mmin = Math.min(Mmin, s.F[e * 6 + 4], s.F[e * 6 + 5]); }
      for (let n = 0; n < IL.nN; n++) Uz = Math.min(Uz, s.U[n * 6 + 2]); }
    for (const [k, v] of [["Mmax", Mmax], ["Mmin", Mmin], ["Uz", Uz]]) {
      const e = Math.abs(v - R.envolvente[k]) / Math.abs(R.envolvente[k]) * 100;
      filas.push({ que: `envolvente camión ${k} vs ${prog} (%)`, medido: +e.toFixed(5), limite: 0.01, ok: e < 0.01, detalle: `${v.toFixed(4)} vs ${R.envolvente[k].toFixed(4)}` });
    }
  }
  void modelo;
  return filas;
}
