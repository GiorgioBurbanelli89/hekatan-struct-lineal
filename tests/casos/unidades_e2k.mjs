/**
 * UNIDADES del .e2k: Hekatan lee un .e2k REAL en CUALQUIER sistema de unidades igual que ETABS.
 *
 * Jorge, 22-sep-2026: «los e2k siempre dicen en qué unidades están, ojo con eso» · «hay que hacer
 * test para las unidades en Hekatan Struct, ETABS y SAP2000».
 *
 * Oráculo = ETABS 22: `validation/modelos/unidades/etabs_unidades.py` abre cada fichero, lo lee por
 * la OAPI en kN-m y guarda en `tests/datos/unidades_etabs/<fichero>.json` lo que ENTENDIÓ. Los ficheros
 * los escribió ETABS (no Hekatan), cada uno en su sistema:
 *     Paz_13_1          TONF  M      test-2-cantilever  N   MM
 *     perimeter_walls   KN    M      ref_riochico       KGF M
 * (+ la casa MOD_001 en KGF M si está su copia privada en registros/privado_LB, que no se sube.)
 *
 * Qué se compara, todo en kN-m:
 *   COTAS       la caja de los nudos
 *   E           cada módulo que usa un elemento de Hekatan es el de un material de ETABS
 *   PESO ESP.   ídem con ρ·g de las barras
 *   ÁREAS       m² de cáscara por propiedad (se lee cada AREAASSIGN por planta)
 *   CARGAS      Σ de TODAS las cargas (punto, área, barra), todos los patrones, SIN peso propio:
 *               ETABS lo resuelve con el peso propio a cero y se suma su reacción en la base
 *
 * Lo que destapó al escribirlo: un AREA asignado a VARIAS plantas se quedaba solo en la última
 * (MOD_001 perdía 23 de 36 losas nervadas), y las losas nervadas/reticulares pesaban solo la loseta.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, "..", "..", "..");
const DATOS = join(AQUI, "..", "datos", "unidades_etabs");
const FICHEROS = {
  Paz_13_1: join(RAIZ, "_integ", "Etabs Powershell", "Paz_13_1.e2k"),
  "test-2-cantilever": join(RAIZ, "_integ", "validation", "01-membrana-drilling", "e2k", "test-2-cantilever.e2k"),
  perimeter_walls: join(RAIZ, "Validaciones con python", "perimeter_walls.e2k"),
  ref_riochico: join(RAIZ, "galpon-bodega-electoral", "ref_riochico.e2k"),
  MOD_001_LB: join(RAIZ, "registros", "privado_LB", "MOD_001_LB.e2k"),   // privado: solo si está
};
const ORACULO_PRIVADO = { MOD_001_LB: join(RAIZ, "registros", "privado_LB", "etabs_LB.json") };
const G = 9.80665;
/** Diferencia de CARGA ya explicada (no de unidades), con su límite y su causa. */
const CARGA_CONOCIDA = {
  ref_riochico: [1.2, "2 ABERTURAS (AREAASSIGN … OPENING \"Yes\", 5.25 m²) dentro de losas cargadas: ETABS no carga el " +
    "hueco y Hekatan no lee las aberturas (carga, peso y rigidez de la losa entera). Barras = ETABS exacto. ⏳ recortar la malla"],
};
const TOL = 1e-4;   // relativo: los .e2k traen 6-7 cifras

export const nombre = "unidades-e2k";
export const descripcion = "un .e2k real de ETABS en TONF-M, N-MM, KN-M o KGF-M se lee igual que ETABS (kN-m)";

const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-9);

export async function correr() {
  const m = await empaquetar(`const g=globalThis; g.window=g;
import { parseE2k } from "${R}/examples/src/shared/e2kParser"; export { parseE2k };`, "unidades-e2k");
  const filas = [];
  for (const [nom, fich] of Object.entries(FICHEROS)) {
    const orj = ORACULO_PRIVADO[nom] ?? join(DATOS, nom + ".json");
    if (!existsSync(fich) || !existsSync(orj)) continue;
    const O = JSON.parse(readFileSync(orj, "utf-8"));
    const txt = readFileSync(fich, "latin1");
    const uni = O.units.map((u) => u.replace(/"/g, "")).join("-");
    const logs = console.log, info = console.info, warn = console.warn;
    console.log = console.info = console.warn = () => {};
    let M, M0;
    try {
      M = m.parseE2k(txt);
      M0 = m.parseE2k(txt.replace(/SELFWEIGHT\s+[\d.eE+-]+/g, "SELFWEIGHT 0"));   // cargas SIN peso propio
    } finally { console.log = logs; console.info = info; console.warn = warn; }
    const N = M.nodes, E = M.elements, ei = M.elementInputs;
    const et = `${nom} (${uni})`;

    // COTAS
    const caja = [0, 1, 2].map((k) => Math.min(...N.map((n) => n[k]))).concat([0, 1, 2].map((k) => Math.max(...N.map((n) => n[k]))));
    const dCaja = Math.max(...caja.map((v, k) => Math.abs(v - O.caja[k])));
    filas.push({ que: `${et}: cotas`, medido: dCaja * 1000, limite: 1, ok: dCaja <= 1e-3, crudo: false,
      detalle: `caja [${caja.map((v) => v.toFixed(3)).join(", ")}] m · peor ${(dCaja * 1000).toFixed(3)} mm` });

    // E y peso específico: cada valor que usa Hekatan es el de algún material de ETABS
    const Es = Object.values(O.materiales).map((x) => x.E), Gs = Object.values(O.materiales).map((x) => x.gamma);
    let peorE = 0, peorG = 0;
    ei.elasticities?.forEach((v) => { peorE = Math.max(peorE, Math.min(...Es.map((e) => rel(v, e)))); });
    E.forEach((e, i) => { if (e.length !== 2) return; const r = ei.densities?.get(i); if (r) peorG = Math.max(peorG, Math.min(...Gs.map((g) => rel(r * G, g)))); });
    filas.push({ que: `${et}: E de los materiales`, medido: peorE * 100, limite: TOL * 100, ok: peorE <= TOL,
      detalle: `ETABS ${Es.map((e) => e.toExponential(4)).join(" · ")} kN/m²` });
    filas.push({ que: `${et}: peso específico (barras)`, medido: peorG * 100, limite: TOL * 100, ok: peorG <= TOL,
      detalle: `ETABS ${Gs.map((g) => g.toFixed(3)).join(" · ")} kN/m³` });

    // ÁREAS por propiedad
    const asig = new Map([...txt.matchAll(/AREAASSIGN\s+"([^"]+)"\s+"([^"]+)"\s+SECTION\s+"([^"]+)"/g)].map((x) => [x[1] + "@" + x[2], x[3]]));
    const aH = {};
    E.forEach((e, i) => {
      if (e.length === 2) return;
      const p = e.map((n) => N[n]); let nx = 0, ny = 0, nz = 0;
      for (let k = 0; k < p.length; k++) { const q = p[k], r = p[(k + 1) % p.length]; nx += (q[1] - r[1]) * (q[2] + r[2]); ny += (q[2] - r[2]) * (q[0] + r[0]); nz += (q[0] - r[0]) * (q[1] + r[1]); }
      const prop = asig.get(M.elementNames[i] + "@" + M.elementStories[i]) ?? "?";
      aH[prop] = (aH[prop] ?? 0) + 0.5 * Math.hypot(nx, ny, nz);
    });
    let peorA = 0; const malas = [];
    for (const [prop, o] of Object.entries(O.cascaras)) {
      if (prop === "None" || !(o.area > 0)) continue;
      const ascii = (t) => t.replace(/[^ -~]/g, "");   // «Ó» llega en utf-8, latin-1 o «?» según quién lo leyó
      const clave = Object.keys(aH).find((k) => ascii(k) === ascii(prop));
      const r = rel(aH[clave] ?? 0, o.area); peorA = Math.max(peorA, r);
      if (r > TOL) malas.push(`${prop} ${(aH[clave] ?? 0).toFixed(2)}/${o.area.toFixed(2)} m²`);
    }
    if (Object.keys(O.cascaras).length)
      filas.push({ que: `${et}: m² de cáscara por propiedad`, medido: peorA * 100, limite: TOL * 100, ok: peorA <= TOL,
        detalle: malas.length ? "Hekatan/ETABS: " + malas.join(" · ") : `${Object.keys(O.cascaras).length} propiedades` });

    // CARGAS sin peso propio: Σ de las componentes, todos los patrones
    const sH = [0, 0, 0]; M0.nodeInputs.loads?.forEach((v) => { for (let k = 0; k < 3; k++) sH[k] += v[k] || 0; });
    const sE = [0, 0, 0];
    if (O.reaccionSinPeso) for (let k = 0; k < 3; k++) sE[k] = -O.reaccionSinPeso[k];   // ETABS resuelto: −ΣR = ΣF
    else {
      for (const v of Object.values(O.cargaPuntualFZ ?? {})) for (let k = 0; k < 3; k++) sE[k] += (Array.isArray(v) ? v[k] : k === 2 ? v : 0);
      for (const v of Object.values(O.cargaAreaGrav ?? {})) sE[2] -= v;   // gravedad = hacia −Z
    }
    const esc = Math.max(...sE.map(Math.abs), 1e-9), dC = Math.max(...sH.map((v, k) => Math.abs(v - sE[k]))) / esc;
    const [lim, causa] = CARGA_CONOCIDA[nom] ?? [0.1, ""];
    filas.push({ que: `${et}: cargas (sin peso propio)`, medido: dC * 100, limite: lim, ok: dC * 100 <= lim,
      detalle: `Hekatan [${sH.map((v) => v.toFixed(2)).join(", ")}] · ETABS [${sE.map((v) => v.toFixed(2)).join(", ")}] kN` + (causa ? " · " + causa : "") });
  }
  return filas;
}
