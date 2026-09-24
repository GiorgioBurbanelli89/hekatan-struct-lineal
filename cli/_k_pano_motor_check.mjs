/**
 * «Ver K local · paño»: la K que enseña la web = la del MOTOR (solo formulaciones publicadas).
 *   · Shell-Thick (defecto, MITC4 + ITW 13): se LEE de didactic_solve (deform.wasm).
 *     Control de ejes: la membrana leída del motor = itwMembraneK (tipo 13) en ejesLocalesQ4.
 *   · Simetría y cuerpo rígido (K·u_rigido = 0) de cada bloque.
 *   · Shell-Thin Q4 = DKQ (mirror validado a 1e-11 contra kelem_native); T3 Thin/DKMQ/DSE: aviso.
 *   node cli/_k_pano_motor_check.mjs
 */
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const mod = await empaquetar(`export { kPano, kLocalMotor, ejesLocalesQ4 } from "${R}/hekatan-fem/src/utils/shellElementK";
export { itwMembraneK } from "${R}/hekatan-fem/src/utils/itwJoints";`, "kpanomotor");
const casos = [
  { n: "cuadrado 1x1", P: [[0,0,0],[1,0,0],[1,1,0],[0,1,0]], E: 2.2e7, nu: 0.2, t: 0.20 },
  { n: "trapecio", P: [[0,0,0],[4,0,0],[3.2,2.5,0],[0.6,2.2,0]], E: 2.1e7, nu: 0.25, t: 0.30 },
  { n: "inclinado 3D", P: [[0,0,0],[3,0,0.8],[3,2,0.8],[0,2,0]], E: 2.2e7, nu: 0.2, t: 0.12 },
];
let fallos = 0;
const ok = (c, txt) => { console.log((c ? "OK   " : "FALLO") + " " + txt); if (!c) fallos++; };
const maxAbs = (K) => Math.max(...K.flat().map(Math.abs));
const asim = (K) => { let d = 0; for (let a = 0; a < K.length; a++) for (let b = 0; b < K.length; b++) d = Math.max(d, Math.abs(K[a][b] - K[b][a])); return d / maxAbs(K); };
for (const c of casos) {
  const r = mod.kPano(c.P, c.E, c.nu, c.t, {});
  const { xl, yl } = mod.ejesLocalesQ4(c.P);
  const Kts = mod.itwMembraneK(xl, yl, c.E, c.nu, c.t, { tipo: 13 });
  let d = 0; for (let a = 0; a < 12; a++) for (let b = 0; b < 12; b++) d = Math.max(d, Math.abs(Kts[a][b] - r.membrana[a][b]));
  ok(d / maxAbs(Kts) < 1e-8, `${c.n} · membrana motor vs itwMembraneK(13): ${(d / maxAbs(Kts) * 100).toExponential(2)} %`);
  ok(asim(r.flexion) < 1e-10 && asim(r.membrana) < 1e-10, `${c.n} · simetría flexión ${asim(r.flexion).toExponential(1)} membrana ${asim(r.membrana).toExponential(1)}`);
  // w rígido (w=1 en todos) → K·u = 0
  const u = Array.from({ length: 12 }, (_, i) => (i % 3 === 0 ? 1 : 0));
  const f = r.flexion.map((row) => row.reduce((s, v, j) => s + v * u[j], 0));
  ok(Math.max(...f.map(Math.abs)) / maxAbs(r.flexion) < 1e-9, `${c.n} · flexión: traslación w rígida da fuerza 0`);
  console.log("      " + r.formulacion);
}
const t3 = mod.kPano([[0,0,0],[2,0,0],[0.5,1.5,0]], 2.2e7, 0.2, 0.2, {});
ok(t3.flexion?.length === 9 && t3.membrana?.length === 9 && asim(t3.flexion) < 1e-10, "triángulo Thick: bloques 9x9 del motor, simétricos · " + t3.formulacion);
const thin = mod.kPano(casos[1].P, 2.1e7, 0.25, 0.3, { tipoPlaca: 1 });
ok(thin.flexion?.length === 12 && thin.membrana?.length === 12, "Q4 Thin: " + thin.formulacion);
for (const tp of [3, 4]) { const x = mod.kPano(casos[0].P, 2.2e7, 0.2, 0.2, { tipoPlaca: tp }); ok(x.flexion === null && /no disponible/.test(x.aviso), `placa ${tp}: ${x.aviso}`); }
const t3thin = mod.kPano([[0,0,0],[2,0,0],[0.5,1.5,0]], 2.2e7, 0.2, 0.2, { tipoPlaca: 1 });
ok(t3thin.flexion === null, "triángulo Thin (DKT): " + t3thin.aviso);
console.log(fallos ? fallos + " FALLO(S)" : "todo OK"); process.exit(fallos ? 1 : 0);
