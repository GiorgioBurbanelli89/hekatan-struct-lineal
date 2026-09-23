// Escribe, para cada caso, el modelo de Hekatan (.heks) sobre LA MALLA DE ETABS y lo exporta a
// .e2k (ETABS), .s2k (SAP2000) y .f2k (SAFE) con cli/heks_a_csi.mjs. Todo queda ordenado en
// modelos/<caso>/ junto a los enlaces de lo que escribieron ETABS, SAP2000 y OpenSees.
//   node validation/losas_irregulares/generar_modelos.mjs
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, "..", "..");
const DATOS = join(RAIZ, "validation", "isse", "automesh", "etabs_poligono");
const CASOS = ["losa_L_hueco", "L_sin_hueco", "rect_con_hueco", "losa_T", "losa_ductos", "pentagono", "trapecio_hueco_girado"];

export function heksDeMalla(m) {
  const J = JSON.parse(readFileSync(join(DATOS, `${m}_etabs_malla_thin.json`), "utf-8"));
  const N = J.etabs.nudos, EL = J.etabs.elementos, R = J.etabs.restricciones ?? [];
  const L = [`# ${m}: malla que genero ETABS 22 (Auto Mesh de fabrica 1.25 m, Shell-Thin)`,
             `# losa maciza t = 0.20 m, E = 25e6 kN/m2, nu = 0.2, q = -10 kN/m2, apoyos de ETABS. kN, m`];
  N.forEach((p, i) => L.push(`node ${i + 1} ${p[0]} ${p[1]} ${p[2]}`));
  let k = 0;
  for (const e of EL) {
    if (e.length !== 3 && e.length !== 4) continue;
    k++;
    L.push(`${e.length === 4 ? "shell" : "tri"} ${k} ${e.map((i) => i + 1).join(" ")} 0.20 25e6`, `areaload ${k} -10`, `shelltype ${k} thin`);
  }
  R.forEach((r, i) => { if (r && r.some(Boolean)) L.push(`support ${i + 1} ${["ux", "uy", "uz", "rx", "ry", "rz"].filter((_, c) => r[c]).join(" ")}`); });
  L.push("solve", "");
  return L.join("\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  for (const m of CASOS) {
    const dir = join(AQUI, "modelos", m); mkdirSync(dir, { recursive: true });
    const heks = join(dir, `${m}.heks`); writeFileSync(heks, heksDeMalla(m));
    try {
      // NOAUTOMESH: la malla YA es la de ETABS; con DEFAULT ETABS la remalla (2.5 %)
      execFileSync("node", [join(RAIZ, "cli", "heks_a_csi.mjs"), heks, join(dir, m), "meshtype=NOAUTOMESH"], { stdio: "pipe" });
    } catch (e) { console.log(`${m}: heks_a_csi fallo: ${String(e.stderr || e).slice(0, 200)}`); }
    // lo que escribieron los otros programas, al lado
    for (const [de, a] of [[`${m}_etabs_malla_thin.EDB`, `${m}_ETABS.EDB`], [`${m}_sap_thin.sdb`, `${m}_SAP2000.sdb`],
                           [`${m}_opensees.tcl`, `${m}_OpenSees.tcl`], [`${m}_opensees.py`, `${m}_OpenSees.py`]])
      if (existsSync(join(DATOS, de))) copyFileSync(join(DATOS, de), join(dir, a));
    console.log(m, "->", dir);
  }
  // los mismos .heks, embebidos para el ejemplo del workspace (categoria «2️⃣ Shells · ✅ Validación CSI»)
  const ts = ["// GENERADO por validation/losas_irregulares/generar_modelos.mjs — no editar a mano.",
              "// Malla que genero ETABS 22 (Shell-Thin, 1.25 m); validado contra ETABS, SAP2000, OpenSees y numpy.",
              "export const MODELOS: Record<string, string> = {"];
  for (const m of CASOS) ts.push(`  ${JSON.stringify(m)}: ${JSON.stringify(heksDeMalla(m))},`);
  ts.push("};", "");
  const dEj = join(RAIZ, "examples", "src", "validacion-losas-csi"); mkdirSync(dEj, { recursive: true });
  writeFileSync(join(dEj, "modelos.ts"), ts.join("\n"));
  console.log("-> examples/src/validacion-losas-csi/modelos.ts");
}
