/**
 * Matriz de rigidez en coordenadas de piso (Aguiar) por condensación — aguiar.ts (la app) contra el cálculo de
 * validación (validation/articulo-revista/torsion_aguiar.{mjs,py}) en el dual 2×2×4 del artículo y en el molinete.
 * Además: los periodos del modelo reducido (3 GDL por piso) contra el modal del modelo completo de cáscaras.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { empaquetar, R } from "../lib/bundle.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const HS = join(AQUI, "..", "..");
const VAL = join(HS, "validation", "articulo-revista");

export const nombre = "aguiar-piso";
export const descripcion = "K_E de piso (u_x, u_y, θz) por condensación: app = validación; T reducido ≈ modal";

export async function correr() {
  const TMP = join(process.env.TEMP || "/tmp", "hk_art_sismo"); mkdirSync(TMP, { recursive: true });
  const src = readFileSync(join(HS, "cli", "sweep_case.mjs"), "utf8").replace(/\r\n/g, "\n");
  const a = src.indexOf("// ────────── buildEdificio"), b = src.indexOf("// ────────── caso ──────────");
  writeFileSync(join(TMP, "_build_muros_t.mjs"),
    src.slice(a, b).replace("for (const w of dynWallDefaults(p))", "for (const w of (p.walls ?? dynWallDefaults(p)))") + "\nexport { buildEdificio, GRAV };\n");
  const { buildEdificio, GRAV } = await import(pathToFileURL(join(TMP, "_build_muros_t.mjs")).href);
  const m = await empaquetar(`export * from "${R}/examples/src/shared/nec/aguiar";\nexport * from "${R}/examples/src/shared/nec/calculo";\nexport { jointMass } from "${R}/hekatan-fem/src/index";\n`, "aguiarT");
  const ref = JSON.parse(readFileSync(join(VAL, "torsion_aguiar_resultado.json"), "utf8"));
  const datos = JSON.parse(readFileSync(join(VAL, "torsion_aguiar.json"), "utf8"));
  const sitio = { norma: "NEC-15", Z: 0.4, Fa: 1, Fd: 1.6, Fs: 1.9, eta: 1.8, r: 1.5, I: 1, R: 8, phiP: 1, phiE: 1, Ct: 0.055, alfa: 0.75 };
  const filas = [];
  for (const nom of ["articulo", "molinete"]) {
    const walls = datos[nom].muros === "dynWallDefaults nWalls=1" ? undefined : datos[nom].muros;
    const p = { nbx: 2, nby: 2, nFloors: 4, ms: 1.0, nWalls: 1, tWall: 0.25, tSlab: 0.20, bCol: 0.40, bBeam: 0.30, hBeam: 0.50, q: 1.0, walls };
    const d = buildEdificio(p, { slab: true, walls: true });
    d.kinds.forEach((k, e) => { if (k !== "beam") return; const y = d.ei.momentsOfInertiaY.get(e), z = d.ei.momentsOfInertiaZ.get(e);
      d.ei.momentsOfInertiaY.set(e, Math.min(y, z)); d.ei.momentsOfInertiaZ.set(e, Math.max(y, z)); });
    const ei = { ...d.ei, plateFormulations: new Map(), drillingTypes: new Map() };
    const eiM = { ...ei, densities: new Map([...ei.densities].map(([k, v]) => [k, v / GRAV])) };
    const ni = { supports: d.ni.supports };
    const r = m.calcularNEC(d.nodes, d.elements, ni, eiM, { sitio, irregular: false, nModos: 12, ecc: 0.05 });
    const masas = m.jointMass(d.nodes, d.elements, eiM, { incluyeElementos: 1 });
    const ag = m.matrizDePiso(d.nodes, d.elements, ni, ei, r.pisos, masas);
    // K_E: diferencia máxima relativa al mayor término del bloque de su piso
    let dif = 0;
    const KEr = ref[nom].pisos;
    ag.pisos.forEach((q, k) => {
      const esc = Math.max(Math.abs(KEr[k].Kxx), Math.abs(KEr[k].Kyy));
      for (const c of ["Kxx", "Kyy", "Kxt", "Kyt"]) dif = Math.max(dif, Math.abs(q[c] - KEr[k][c]) / esc);
      dif = Math.max(dif, Math.abs(q.Ktt - KEr[k].Ktt) / Math.abs(KEr[k].Ktt));
    });
    filas.push({ que: `${nom}: K_E app vs validación (% del máx)`, medido: dif * 100, limite: 1e-6, ok: dif * 100 <= 1e-6,
      detalle: `ρy ${ag.pisos.map((q) => q.rhoY.toFixed(3)).join(" ")} · e_y ${ag.pisos[0].ey.toFixed(3)} m` });
    const dT = Math.max(...[0, 1, 2].map((k) => Math.abs(ag.T[k] - ref[nom].T_aguiar[k]) / ref[nom].T_aguiar[k])) * 100;
    filas.push({ que: `${nom}: T reducido app vs validación (%)`, medido: dT, limite: 1e-6, ok: dT <= 1e-6, detalle: ag.T.slice(0, 3).map((t) => t.toFixed(4)).join(" ") });
    const dM = Math.max(...[0, 1, 2].map((k) => Math.abs(ag.T[k] - r.modos[k].T) / r.modos[k].T)) * 100;
    filas.push({ que: `${nom}: T reducido vs modal completo, modos 1-3 (%)`, medido: dM, limite: 2.5, ok: dM <= 2.5,
      detalle: `${ag.T.slice(0, 3).map((t) => t.toFixed(4)).join(" ")} / ${r.modos.slice(0, 3).map((q) => q.T.toFixed(4)).join(" ")}` });
  }
  return filas;
}
