/**
 * MURO DE MANABÍ (membrana · cáscara · sólido) contra SAP2000 y ETABS, nudo a nudo.
 *
 * El ejemplo `muro-manabi` armado en CSI por OAPI (galpon-bodega-electoral/csi_desde_dump.py) con
 * la MISMA malla, los mismos apoyos, los mismos muelles de balasto y las mismas cargas nodales,
 * en los dos casos (estático y sísmico). La membrana va como modelo plano («Available DOFs» UX,
 * UZ, RY). El sólido solo tiene árbitro en SAP2000: ETABS no tiene elemento sólido.
 *
 * Las referencias (tests/datos/muro_manabi_<programa>_<modelo>.json) las escribe
 * `node cli/muro_manabi_referencias.mjs <carpeta de salidas de CSI>`.
 *
 * Además, tres filas que no necesitan árbitro: el equilibrio con los muelles, y que las tres
 * idealizaciones del MISMO muro se parezcan (membrana = sólido; la cáscara, con el par del apoyo).
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "muro-manabi-vs-csi";
export const descripcion = "muro de Manabi (membrana, cascara, solido): nudo a nudo vs SAP2000 y ETABS, estatico y sismico";

const MODELOS = ["membrana", "cascara", "solido"], CASOS = ["Estatico", "Sismico"];

export async function correr() {
  const mod = await empaquetar(`
    const g = globalThis; g.window = g.window ?? g;
    export { resolverMuroManabi } from "${R}/examples/src/muro-manabi/muroManabi";
    export { MURO_MANABI } from "${R}/examples/src/muro-manabi/malla";
  `, "muro-manabi-test");
  const filas = [];
  // dos variantes: el modelo de los vídeos (apoyo fijo en x) y el de SUELO LATERAL (muelles en x: Barkan + Terzaghi)
  for (const [suf, over, nombreVar] of [["", { lat: 0 }, " [apoyo fijo en x]"], ["_lat1", { lat: 1 }, ""]]) {
  const sol = {};
  for (let m = 0; m < 3; m++) for (let c = 0; c < 2; c++)
    sol[`${MODELOS[m]}/${CASOS[c]}`] = mod.resolverMuroManabi({ ...mod.MURO_MANABI, ...over, modelo: m, caso: c }, 1);

  // 1) equilibrio: lo que devuelve el terreno (muelles + apoyo en x) = lo que se carga
  let peorEq = 0, donde = "";
  for (const [k, s] of Object.entries(sol)) {
    const F = [0, 0, 0]; s.malla.loads.forEach((f) => { F[0] += f[0]; F[2] += f[2]; });
    for (const i of [0, 2]) {
      const e = Math.abs(F[i] + s.reaccion[i]) / Math.max(1e-9, Math.hypot(F[0], F[2])) * 100;
      if (e > peorEq) { peorEq = e; donde = `${k} ${"x z"[i]}`; }
    }
  }
  filas.push({ que: "equilibrio con los muelles (6 modelos, x y z)" + nombreVar, medido: peorEq, limite: 1e-6, ok: peorEq <= 1e-6, detalle: `peor: ${donde}` });

  // 2) las tres idealizaciones, caso sísmico
  const ux = (k) => sol[k].deformOutputs.deformations.get(sol[k].malla.nudoCoronacion)[0];
  const pmax = (k) => { let v = 0; sol[k].presion.forEach((p) => { v = Math.max(v, -p); }); return v; };
  const dif = (a, b) => Math.abs(a - b) / Math.abs(b) * 100;
  const dMS = dif(ux("membrana/Sismico"), ux("solido/Sismico"));
  filas.push({ que: "coronacion: membrana (deformacion plana) vs solido" + nombreVar, medido: dMS, limite: 0.5, ok: dMS <= 0.5,
    detalle: `${(ux("membrana/Sismico") * 1000).toFixed(4)} vs ${(ux("solido/Sismico") * 1000).toFixed(4)} mm` });
  const dP = dif(pmax("cascara/Sismico"), pmax("membrana/Sismico"));
  filas.push({ que: "presion de contacto maxima: cascara vs membrana" + nombreVar, medido: dP, limite: 0.5, ok: dP <= 0.5,
    detalle: `${pmax("cascara/Sismico").toFixed(2)} vs ${pmax("membrana/Sismico").toFixed(2)} kN/m2 (sin el par del apoyo daba 75.3)` });

  // 3) contra CSI, nudo a nudo
  for (const [prog, modelos] of [["sap", MODELOS], ["etabs", suf ? [] : ["membrana", "cascara"]]]) for (const modelo of modelos) {
    const ref = join(AQUI, "..", "datos", `muro_manabi_${prog}_${modelo}${suf}.json`);
    if (!existsSync(ref)) { filas.push({ que: `${prog} ${modelo}: referencia`, crudo: true, medido: "falta", limite: "existe", ok: false, detalle: ref }); continue; }
    const S = JSON.parse(readFileSync(ref, "utf-8"));
    for (const caso of CASOS) {
      const u = S.casos[caso];
      if (!u) continue;                                   // el .e2k lleva UN caso: ETABS solo arbitra el sísmico
      const s = sol[`${modelo}/${caso}`], U = s.deformOutputs.deformations;
      const N = s.malla.nodes.length;
      let mx = 0; for (let n = 0; n < N; n++) for (let c = 0; c < 3; c++) mx = Math.max(mx, Math.abs(U.get(n)[c]));
      let peor = 0, pn = -1, casados = 0;
      for (let n = 0; n < N; n++) {
        if (!u[n]) continue;                              // nudo que el programa no dejó casar por coordenadas
        casados++;
        for (let c = 0; c < 3; c++) { const d = Math.abs(U.get(n)[c] - u[n][c]) / mx * 100; if (d > peor) { peor = d; pn = n; } }
      }
      const nc = s.malla.nudoCoronacion, lim = S.limite ?? 1e-4;
      filas.push({ que: `${S.programa} · ${modelo} · ${caso.toLowerCase()}: ux, uy, uz nudo a nudo${nombreVar}`,
        medido: peor, limite: lim, ok: casados >= N - 1 && peor <= lim,
        detalle: `coronacion ${(U.get(nc)[0] * 1000).toFixed(4)} vs ${(u[nc]?.[0] * 1000).toFixed(4)} mm; ${casados}/${N} nudos; peor nudo ${pn}; ${S.como}` });
    }
  }
  }
  return filas;
}
