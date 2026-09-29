/**
 * BRAZOS RÍGIDOS AUTOMÁTICOS de ETABS («Automatic from Connectivity»), 29-sep-2026.
 *
 * La LEY del brazo ya está contra ETABS (`brazos-rigidos-etabs`, `brazos-portico-csi`: 0.000 %). Aquí se
 * mide la COLOCACIÓN automática, con la regla que dio ETABS en la sonda del 8-sep-2026
 * (`validation/isse/ETABS_DEFECTOS_QUE_ANADE.md`): viga ½ lado de columna por extremo, columna el canto
 * ENTERO de la viga arriba y 0 abajo, RZ = 0.
 *
 *   1. `rigidzone auto f` en el .heks = los mismos `endoffset` escritos a mano (canto y ancho declarados)
 *   2. sin canto ni ancho: el rectángulo equivalente de A e I da las mismas medidas
 *   3. `rigidzone auto 0` = sin brazos en la rigidez;  `rigidzone off` manda sobre `auto`
 * (Plantillas: con RZ = 0 el dual 4×4×4 da T₁ = 0.6754 s, igual que sin brazos; `cli/_modal_memoria.mjs`.)
 */
import { empaquetar, R } from "../lib/bundle.mjs";

const cargarCli = async () =>
  (await empaquetar(`export { cliModeler } from "${R}/examples/src/cli-modeler/cliModeler";\n`, "cliModeler")).cliModeler;

// pórtico de un vano (6 m) y un piso (3 m): columnas 0.40×0.40, viga 0.30×0.50
const E = 25e6, NU = 0.2;
const COL = { A: 0.16, I: 0.4 ** 4 / 12, J: 0.0036, D: 0.4, B: 0.4 };
const VIG = { A: 0.15, I22: 0.5 * 0.3 ** 3 / 12, I33: 0.3 * 0.5 ** 3 / 12, J: 0.0028, D: 0.5, B: 0.3 };

function heks({ auto, rz = 0, manual = false, dims = true, extra = [] }) {
  const L = ["node 1 0 0 0", "node 2 6 0 0", "node 3 0 0 3", "node 4 6 0 3"];
  const dc = dims ? ` ${COL.D} ${COL.B}` : "", dv = dims ? ` ${VIG.D} ${VIG.B}` : "";
  L.push(`frame 1 1 3 ${E} ${COL.A} ${COL.I} ${COL.I} ${COL.J} ${NU} 0${dc}`);
  L.push(`frame 2 2 4 ${E} ${COL.A} ${COL.I} ${COL.I} ${COL.J} ${NU} 0${dc}`);
  L.push(`frame 3 3 4 ${E} ${VIG.A} ${VIG.I22} ${VIG.I33} ${VIG.J} ${NU} 0${dv}`);
  if (manual) L.push(`endoffset 1 0 0.5 ${rz}`, `endoffset 2 0 0.5 ${rz}`, `endoffset 3 0.2 0.2 ${rz}`);
  if (auto) L.push(`rigidzone auto ${rz}`);
  L.push(...extra);
  L.push("support 1 fixed", "support 2 fixed", "load 3 50 0 -100 0 0 0", "load 4 0 30 -100 0 20 0", "solve");
  return L.join("\n");
}

async function resolver(cli, texto) {
  globalThis.window = { __hekatanCliScript: texto };
  const st = (v) => ({ val: v });
  const states = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}),
    deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
  cli.build({}, states);
  return { ei: states.elementInputs.val, def: states.deformOutputs.val };
}
const u = (r) => [2, 3].flatMap((n) => r.def.deformations.get(n).slice(0, 6));
const difRel = (a, b) => {
  const m = Math.max(...b.map(Math.abs));
  return (100 * Math.max(...a.map((x, i) => Math.abs(x - b[i])))) / m;
};

export const nombre = "brazos-automaticos";
export const descripcion = "brazos rígidos automáticos de ETABS (rigidzone auto y plantillas): colocación y RZ";

export async function correr() {
  const cli = await cargarCli();
  const filas = [];
  for (const rz of [0, 0.5, 1]) {
    const a = await resolver(cli, heks({ auto: true, rz })), m = await resolver(cli, heks({ manual: true, rz }));
    const d = difRel(u(a), u(m));
    const eo = [...(a.ei.endOffsets ?? new Map())].map(([k, v]) => `${k}:${v.map((x) => +x.toFixed(4)).join("/")}`).join(" ");
    filas.push({ que: `rigidzone auto ${rz} = endoffset a mano (col 0/0.5, viga 0.2/0.2)`, medido: d, limite: 1e-9,
                 ok: d < 1e-9, detalle: eo });
  }
  {
    const a = await resolver(cli, heks({ auto: true, rz: 1, dims: false })), m = await resolver(cli, heks({ manual: true, rz: 1 }));
    const d = difRel(u(a), u(m));
    filas.push({ que: "sin canto ni ancho: rectángulo equivalente de A e I", medido: d, limite: 1e-6, ok: d < 1e-6,
                 detalle: "h = √(12·I33/A): col 0.4, viga 0.5" });
  }
  {
    const sin = u(await resolver(cli, heks({})));
    const a0 = u(await resolver(cli, heks({ auto: true, rz: 0 })));
    const off = u(await resolver(cli, heks({ auto: true, rz: 1, extra: ["rigidzone off"] })));
    const a1 = u(await resolver(cli, heks({ auto: true, rz: 1 })));
    filas.push({ que: "rigidzone auto 0 = sin brazos (RZ = 0 no rigidiza)", medido: difRel(a0, sin), limite: 1e-9,
                 ok: difRel(a0, sin) < 1e-9, detalle: "" });
    filas.push({ que: "rigidzone off manda sobre auto", medido: difRel(off, sin), limite: 1e-9, ok: difRel(off, sin) < 1e-9, detalle: "" });
    const baja = (100 * (Math.abs(sin[0]) - Math.abs(a1[0]))) / Math.abs(sin[0]);
    filas.push({ que: "RZ = 1 rigidiza: ux del nudo 3 baja", medido: baja, limite: 0, ok: baja > 1, detalle: `${sin[0].toExponential(4)} → ${a1[0].toExponential(4)}` });
  }
  return filas;
}
