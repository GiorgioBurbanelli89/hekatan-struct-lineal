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
export const descripcion = "K_E de piso (u_x, u_y, θz) por condensación: app = validación = SAP2000 (pórtico asimétrico 0.000 %); con cáscaras e y ρ vs SAP2000";

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
  const sap = JSON.parse(readFileSync(join(VAL, "sap_aguiar_resultado.json"), "utf8"));
  for (const nom of ["porticoAsim", "articulo", "molinete"]) {
    const walls = nom === "porticoAsim" || datos[nom].muros === "dynWallDefaults nWalls=1" ? undefined : datos[nom].muros;
    const p = { nbx: 2, nby: 2, nFloors: 4, ms: 1.0, nWalls: 1, tWall: 0.25, tSlab: 0.20, bCol: 0.40, bBeam: 0.30, hBeam: 0.50, q: 1.0, walls };
    const d = buildEdificio(p, nom === "porticoAsim" ? { slab: false, walls: false } : { slab: true, walls: true });
    if (nom === "porticoAsim") d.kinds.forEach((k, e) => { if (k === "col" && Math.abs(d.nodes[d.elements[e][0]][0]) < 1e-6) {
      d.ei.momentsOfInertiaY.set(e, d.ei.momentsOfInertiaY.get(e) * 4); d.ei.momentsOfInertiaZ.set(e, d.ei.momentsOfInertiaZ.get(e) * 4); } });
    d.kinds.forEach((k, e) => { if (k !== "beam") return; const y = d.ei.momentsOfInertiaY.get(e), z = d.ei.momentsOfInertiaZ.get(e);
      d.ei.momentsOfInertiaY.set(e, Math.min(y, z)); d.ei.momentsOfInertiaZ.set(e, Math.max(y, z)); });
    const ei = { ...d.ei, plateFormulations: new Map(), drillingTypes: new Map() };
    const eiM = { ...ei, densities: new Map([...ei.densities].map(([k, v]) => [k, v / GRAV])) };
    const ni = { supports: d.ni.supports };
    const r = m.calcularNEC(d.nodes, d.elements, ni, eiM, { sitio, irregular: false, nModos: 12, ecc: 0.05 });
    const masas = m.jointMass(d.nodes, d.elements, eiM, { incluyeElementos: 1 });
    const ag = m.matrizDePiso(d.nodes, d.elements, ni, ei, r.pisos, masas);
    // juez SAP2000 (validation/articulo-revista/sap_aguiar.py): K_E entera; con cáscaras solo e_y y ρ_y (la membrana difiere)
    const KS = sap[nom].KE_sap, mx = Math.max(...KS.flat().map(Math.abs));
    const dS = Math.max(...KS.flatMap((f, i) => f.map((v, j) => Math.abs(v - ag.KE[i][j])))) / mx * 100;
    if (nom === "porticoAsim") filas.push({ que: "pórtico asimétrico: K_E app vs SAP2000 (% del máx)", medido: dS, limite: 0.001, ok: dS <= 0.001,
      detalle: `e_y ${ag.pisos[0].ey.toFixed(3)} / ${sap[nom].pisos[0].sap.ey.toFixed(3)} m · ρy ${ag.pisos[0].rhoY.toFixed(3)} / ${sap[nom].pisos[0].sap.rho_y.toFixed(3)}` });
    else {
      const de = Math.max(...ag.pisos.map((q, k) => Math.abs(q.ey - sap[nom].pisos[k].sap.ey)));
      const dr = Math.max(...ag.pisos.map((q, k) => Math.abs(q.rhoY - sap[nom].pisos[k].sap.rho_y)));
      filas.push({ que: `${nom}: e_y vs SAP2000 (m)`, medido: de, limite: 0.05, ok: de <= 0.05, detalle: `K_E entera ${dS.toFixed(2)} % (membrana del muro)` });
      filas.push({ que: `${nom}: ρy vs SAP2000`, medido: dr, limite: 0.01, ok: dr <= 0.01, detalle: ag.pisos.map((q) => q.rhoY.toFixed(3)).join(" ") });
    }
    if (nom === "porticoAsim") continue;
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
