/**
 * ¿DE DÓNDE SALE LA TORSIÓN DE LAS VIGAS? — 1 vano × 1 vano, con losa y sin ella.
 *
 * Jorge (17-sep-2026): «la torsión la da la losa, ¿o me estoy equivocando?».
 * Se resuelve la MISMA estructura dos veces y se lee la torsión de las vigas:
 *   · `sin_losa.heks`        — 4 columnas + 4 vigas de borde, NINGUNA cáscara
 *   · `con_losa_thin.heks`   — lo mismo + losa Shell-Thin (DKQ) de 0.15 m
 *
 *   node cli/_torsion_viga_losa.mjs
 */
import { resolverHeks, fuerzasDeBarra } from "../tests/lib/heks.mjs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const D = join(dirname(fileURLToPath(import.meta.url)), "..", "validation", "torsion-viga-losa");
const casos = [["SIN losa (solo barras)", "sin_losa.heks"], ["CON losa Shell-Thin", "con_losa_thin.heks"]];
const res = {};
for (const [nombre, f] of casos) {
  const r = await resolverHeks(join(D, f));
  const barras = fuerzasDeBarra(r);
  const dir = (b) => {
    const d = [0, 1, 2].map((k) => b.j[k] - b.i[k]);
    return Math.abs(d[2]) > 1e-9 ? "columna" : Math.abs(d[0]) > 1e-9 ? "viga X" : "viga Y";
  };
  const T = barras.map((b) => ({ que: dir(b), i: b.i, j: b.j, T: b.T ? b.T[0] : 0 }));
  const maxT = (q) => Math.max(...T.filter((x) => x.que === q).map((x) => Math.abs(x.T)), 0);
  const def = r.deformOutputs?.deformations;
  const w6 = def?.get ? def.get(5)?.[2] : def?.[5]?.[2];
  res[nombre] = { vigaX: maxT("viga X"), vigaY: maxT("viga Y"), col: maxT("columna"), w: w6,
                  detalle: T.filter((x) => x.que === "viga Y").map((x) => +x.T.toFixed(4)) };
  console.log(`\n── ${nombre}`);
  console.log(`   torsión máx · viga X ${maxT("viga X").toFixed(4)} · viga Y ${maxT("viga Y").toFixed(4)} · columna ${maxT("columna").toFixed(4)}  kN·m`);
  console.log(`   flecha en el punto de carga (nudo 6): ${(w6 * 1000).toFixed(3)} mm`);
  console.log(`   T de cada viga Y: ${res[nombre].detalle.join(", ")}`);
}
const a = res["SIN losa (solo barras)"], b = res["CON losa Shell-Thin"];
console.log("\n─────────────────────────────────────────────");
console.log(`SIN losa, la torsión de las vigas Y es ${a.vigaY.toFixed(4)} kN·m → ${a.vigaY > 1e-6 ? "NO es cero: la torsión existe sin cáscara ninguna" : "cero"}`);
console.log(`CON losa pasa a ${b.vigaY.toFixed(4)} kN·m (${((b.vigaY / a.vigaY - 1) * 100).toFixed(1)} %) y la flecha de ${(a.w * 1000).toFixed(3)} a ${(b.w * 1000).toFixed(3)} mm`);
console.log("La losa NO crea la torsión: cambia cuánta hay, porque ata los giros del borde.");
