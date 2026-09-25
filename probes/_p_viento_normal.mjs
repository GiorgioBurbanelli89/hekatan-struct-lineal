// Viento perpendicular al zinc: parseS2k real de la Cancha → componentes nodales.
// Esperado (probe geométrico _p_normal_zinc): ΣFx=-222.752  ΣFy=0  ΣFz=-1332.6
// (antes, todo vertical: ΣFx=0, ΣFz=-1352.591; el viento pasó de -258.59 Fz a
//  Fx=-222.75 / Fz=-238.64).
import { readFileSync } from "fs";
import { empaquetar, R } from "../tests/lib/bundle.mjs";

const f = process.argv[2] ?? "C:\\Users\\j-b-j\\Downloads\\Cancha Parque v24.s2k";
const text = readFileSync(f, "utf8");
const mod = await empaquetar(
  `import { parseS2k } from "${R}/examples/src/shared/s2kParser"; export { parseS2k };`);

const logs = [];
const orig = console.log;
console.log = (...a) => { logs.push(a.join(" ")); orig(...a); };
const model = mod.parseS2k(text);
console.log = orig;

const rot = logs.find((l) => l.includes("rotadas a la normal"));
console.log(rot ? `OK mensaje: ${rot}` : "FALTA mensaje de rotación");

let Fx = 0, Fy = 0, Fz = 0;
model.nodeInputs?.loads?.forEach((v) => { Fx += v[0]; Fy += v[1]; Fz += v[2]; });
console.log(`ΣF nodal = (${Fx.toFixed(3)}, ${Fy.toFixed(3)}, ${Fz.toFixed(3)}) kN`);

let conFx = 0;
model.nodeInputs?.loads?.forEach((v) => { if (Math.abs(v[0]) > 1e-9) conFx++; });
console.log(`nudos con Fx≠0 = ${conFx}`);

const chk = (nombre, real, esp, tol) => {
  const ok = Math.abs(real - esp) <= tol;
  console.log(`${ok ? "✅" : "❌"} ${nombre}: ${real.toFixed(3)} (esperado ${esp} ±${tol})`);
  return ok;
};
let ok = !!rot;
// Geometría independiente (_p_normal_zinc): Fx=-222.752, Fz_viento=-238.641 →
// total Fz = -607.20 (viva+sobre) -238.64 -486.66 (peso) = -1332.5. El parser da
// -222.862/-1332.686 (Δ0.05 % por desempate de posiciones duplicadas en la cadena).
ok = chk("ΣFx (solo viento horizontal)", Fx, -222.9, 0.2) && ok;
ok = chk("ΣFy (todo en XZ)", Fy, 0, 1e-6) && ok;
ok = chk("ΣFz (viento ya no es todo vertical; antes -1352.591)", Fz, -1332.7, 0.3) && ok;
ok = chk("nudos con Fx (flechas anguladas)", conFx, 210, 20) && ok;
console.log(ok ? "TODO OK" : "FALLÓ");
process.exit(ok ? 0 : 1);
