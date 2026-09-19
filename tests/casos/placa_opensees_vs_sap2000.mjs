/**
 * LA PLACA PURA en TRES programas, con SAP2000 de JUEZ.
 *
 * Placa cuadrada de 10 m simplemente apoyada, malla 8x8, carga uniforme, y se
 * barre el espesor t/L = 0.001, 0.01, 0.05, 0.1, 0.2. Se mide la flecha del
 * nudo CENTRAL (5, 5) en:
 *
 *   - Hekatan Struct  -> `plateFormulations = 0` (Shell-Thick: MITC4 + modos
 *     incompatibles de Wilson), resuelto por `cliModeler` con el .heks real.
 *   - OpenSees        -> `ShellMITC4` + `ElasticMembranePlateSection`, mismo
 *     mallado nudo a nudo, mismas cargas nodales
 *     (`validation/opensees/heks_a_opensees.py`, que come el dump del .heks).
 *   - SAP2000         -> **el juez**: elemento PlateThick (tipo 4 de su enum),
 *     medido por OAPI el 17-sep-2026 con
 *     `python validation/opensees/csi_modal_fuerzas.py sap pl_<t>_dump.json pl_<t>_sap.json --placa`
 *     y guardado en `validation/opensees/pl_<t>_sap.json`.
 *
 * Por que SAP2000 y no ETABS: una losa suelta apoyada en su perimetro, sin
 * columnas, no le devuelve a ETABS ni un desplazamiento (0 nudos) — es su
 * semantica de edificios. Esta medido en validation/opensees/README.md.
 *
 * POR QUE ESTE CASO VALE LA PENA (y no es "otro test de placa mas"):
 * `placa-thick-thin-sano` mide Hekatan contra ETABS. Este mide a Hekatan Y a un
 * motor INDEPENDIENTE (OpenSees) contra el mismo juez, y por eso puede separar
 * dos cosas que de otro modo se confunden: un error de Hekatan, o que la placa
 * gruesa de CSI simplemente NO es un MITC4. Lo medido dice lo segundo: los dos
 * se desvian de SAP2000 con el MISMO signo y casi la misma magnitud.
 *
 * ── LO YA MEDIDO (validation/opensees/README.md, 17-sep-2026) ───────────────
 *
 *   | t/L   | Hekatan Thick | OpenSees ShellMITC4 | separacion entre los dos |
 *   |-------|---------------|---------------------|--------------------------|
 *   | 0.001 |    +0.574 %   |       +0.288 %      |          0.286 %         |
 *   | 0.01  |    -0.025 %   |       -0.309 %      |          0.284 %         |
 *   | 0.05  |    -1.061 %   |       -1.320 %      |          0.259 %         |
 *   | 0.1   |    +0.367 %   |       +0.144 %      |          0.223 %         |
 *   | 0.2   |    +1.924 %   |       +1.760 %      |          0.164 %         |
 *
 * Los LIMITES de abajo salen de ESA tabla, no de una idea: cada uno es el valor
 * medido redondeado hacia arriba con ~0.4 % de margen. No son tolerancias de
 * ingenieria (no se "acepta" un 2 %): son un CERCO. Si un cambio en la placa
 * mueve cualquiera de estos numeros, el test se entera.
 *
 * ── SE SALTA LIMPIAMENTE, sin hacer fallar la suite, si: ────────────────────
 *   - faltan los `pl_<t>_sap.json`  -> hay que correr SAP2000 (comando arriba);
 *   - no hay python con openseespy  -> solo se miden las filas de Hekatan.
 * En los dos casos lo dice en la salida con el comando que hay que correr.
 */
import { existsSync, readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { resolverHeks } from "../lib/heks.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const VAL = join(AQUI, "..", "..", "validation", "opensees");
const PY = process.env.PYTHON || "python";

// t/L barridos, y lo MEDIDO el 17-sep-2026 (README de validation/opensees).
// `limHek` / `limOs` = |medido| + ~0.4 % de margen, redondeado.
// `limSep` = |difHek - difOs| medida (max 0.286 %) acotada en 0.5 %: es la
// afirmacion fuerte del banco — los dos motores se apartan de CSI IGUAL.
const CASOS = [
  { tL: 0.001, medHek: +0.574, limHek: 1.0, medOs: +0.288, limOs: 0.7, limSep: 0.5 },
  { tL: 0.01,  medHek: -0.025, limHek: 0.5, medOs: -0.309, limOs: 0.7, limSep: 0.5 },
  { tL: 0.05,  medHek: -1.061, limHek: 1.5, medOs: -1.320, limOs: 1.8, limSep: 0.5 },
  { tL: 0.1,   medHek: +0.367, limHek: 0.8, medOs: +0.144, limOs: 0.6, limSep: 0.5 },
  { tL: 0.2,   medHek: +1.924, limHek: 2.5, medOs: +1.760, limOs: 2.3, limSep: 0.5 },
];

const L = 10;                       // lado de la placa, m (el de los .heks)
const CENTRO = [L / 2, L / 2];      // el nudo cuya flecha se mide

export const nombre = "placa-opensees-vs-sap2000";
export const descripcion =
  "placa apoyada 8x8, barrido de espesor: Hekatan y OpenSees contra SAP2000 (el juez), misma malla";

/** Fila de "saltado": no cuenta como fallo, pero se ve en la tabla. */
const saltado = (que, porque) => ({
  que, medido: "SALTADO", limite: "-", ok: true, crudo: true, detalle: porque,
});

/** Indice del nudo (5,5) dentro de una lista de coordenadas. */
function iCentro(nodes) {
  for (let i = 0; i < nodes.length; i++) {
    const [x, y] = nodes[i];
    if (Math.abs(x - CENTRO[0]) < 1e-9 && Math.abs(y - CENTRO[1]) < 1e-9) return i;
  }
  return -1;
}

/** Vuelca un modelo ya resuelto al JSON que come heks_a_opensees.py. */
function volcar(r, ruta) {
  const plano = (o) => {
    if (o instanceof Map) return Object.fromEntries([...o].map(([k, v]) => [k, plano(v)]));
    if (Array.isArray(o)) return o.map(plano);
    if (o && typeof o === "object")
      return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, plano(v)]));
    return o;
  };
  writeFileSync(ruta, JSON.stringify({
    nodes: r.nodes, elements: r.elements,
    nodeInputs: plano(r.nodeInputs), elementInputs: plano(r.elementInputs),
    deformations: plano(r.deformOutputs.deformations ?? {}),
    reactions: plano(r.deformOutputs.reactions ?? {}),
  }));
}

export async function correr() {
  // 1. ¿esta la medida de SAP2000? Sin juez no hay banco.
  const faltan = CASOS.filter((c) => !existsSync(join(VAL, `pl_${c.tL}_sap.json`)))
                      .map((c) => c.tL);
  if (faltan.length) {
    return [saltado("SAP2000 (el juez)",
      `faltan pl_{${faltan.join(",")}}_sap.json — con SAP2000 instalado: ` +
      `python validation/opensees/csi_modal_fuerzas.py sap pl_<t>_dump.json pl_<t>_sap.json --placa`)];
  }
  // 2. ¿hay OpenSees? Si no, se miden solo las filas de Hekatan y se dice.
  const hayOs = spawnSync(PY, ["-c", "import openseespy.opensees"],
                          { stdio: "ignore" }).status === 0;
  const tmp = mkdtempSync(join(tmpdir(), "hek_placa_os_"));

  const filas = [];
  if (!hayOs) {
    filas.push(saltado("OpenSees (ShellMITC4)",
      `no hay '${PY}' con openseespy — instalar: pip install openseespy. ` +
      `Solo se miden las filas de Hekatan contra SAP2000`));
  }

  for (const c of CASOS) {
    const heks = join(VAL, `pl_${c.tL}.heks`);
    if (!existsSync(heks)) {
      filas.push(saltado(`t/L = ${c.tL}`, `falta ${heks}`));
      continue;
    }

    // --- SAP2000: el juez ------------------------------------------------
    const S = JSON.parse(readFileSync(join(VAL, `pl_${c.tL}_sap.json`), "utf-8"));
    const nSap = S.nudos.find((n) => Math.abs(n.x - CENTRO[0]) < 1e-9 &&
                                     Math.abs(n.y - CENTRO[1]) < 1e-9);
    if (!nSap || !S.nudos.length) {
      // La trampa del driver: con 0 nudos leidos "peor 0.000 %" parece que clava
      // cuando lo que pasa es que el programa no devolvio nada.
      filas.push(saltado(`t/L = ${c.tL}`, "SAP2000 no devolvio el nudo central"));
      continue;
    }
    const wSap = nSap.u[2];

    // --- Hekatan ----------------------------------------------------------
    const r = await resolverHeks(heks);
    const ic = iCentro(r.nodes);
    const wHek = r.deformOutputs.deformations?.get(ic)?.[2];
    if (!Number.isFinite(wHek)) {
      filas.push(saltado(`t/L = ${c.tL}`, "Hekatan no devolvio flecha en el centro"));
      continue;
    }
    const difHek = (wHek / wSap - 1) * 100;
    filas.push({
      que: `t/L = ${c.tL} · Hekatan vs SAP2000`,
      medido: Math.abs(difHek), limite: c.limHek, ok: Math.abs(difHek) <= c.limHek,
      detalle: `${wHek.toExponential(6)} vs ${wSap.toExponential(6)} m ` +
               `(${difHek >= 0 ? "+" : ""}${difHek.toFixed(3)} %; medido 17-sep ${c.medHek.toFixed(3)} %)`,
    });
    if (!hayOs) continue;

    // --- OpenSees ---------------------------------------------------------
    // Mismo dump que come SAP2000: misma malla, mismos nudos, mismas cargas.
    const dump = join(tmp, `pl_${c.tL}_dump.json`);
    const out = join(tmp, `os_${c.tL}.json`);
    volcar(r, dump);
    // El 3er argumento son los modos: 1, porque la placa no lleva masa y el
    // eigen falla — el script lo captura y sigue. Aqui solo interesa el estatico.
    const p = spawnSync(PY, [join(VAL, "heks_a_opensees.py"), dump, out, "1",
                             "--elem=ShellMITC4"], { encoding: "utf-8" });
    if (p.status !== 0 || !existsSync(out)) {
      filas.push(saltado(`t/L = ${c.tL} · OpenSees`,
        `heks_a_opensees.py fallo: ${(p.stderr || p.stdout || "").trim().split("\n").pop()}`));
      continue;
    }
    const O = JSON.parse(readFileSync(out, "utf-8"));
    const wOs = O.desp?.[String(ic)]?.[2];
    if (!Number.isFinite(wOs)) {
      filas.push(saltado(`t/L = ${c.tL} · OpenSees`, "sin desplazamiento en el nudo central"));
      continue;
    }
    const difOs = (wOs / wSap - 1) * 100;
    filas.push({
      que: `t/L = ${c.tL} · OpenSees vs SAP2000`,
      medido: Math.abs(difOs), limite: c.limOs, ok: Math.abs(difOs) <= c.limOs,
      detalle: `${wOs.toExponential(6)} vs ${wSap.toExponential(6)} m ` +
               `(${difOs >= 0 ? "+" : ""}${difOs.toFixed(3)} %; medido 17-sep ${c.medOs.toFixed(3)} %)`,
    });
    // La afirmacion del banco: los dos motores se apartan de CSI IGUAL.
    const sep = Math.abs(difHek - difOs);
    filas.push({
      que: `t/L = ${c.tL} · Hekatan y OpenSees se apartan igual`,
      medido: sep, limite: c.limSep, ok: sep <= c.limSep && Math.sign(difHek) === Math.sign(difOs),
      detalle: `Hek ${difHek.toFixed(3)} % y OS ${difOs.toFixed(3)} %: mismo signo, ` +
               `separados ${sep.toFixed(3)} % (medido 17-sep ${Math.abs(c.medHek - c.medOs).toFixed(3)} %)`,
    });
  }
  return filas;
}
