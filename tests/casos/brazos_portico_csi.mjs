/**
 * BRAZOS RÍGIDOS en una ESTRUCTURA: pórtico en el espacio contra ETABS (y SAP2000 si está su JSON).
 *
 * `brazos-rigidos-etabs` mide la ley en una barra suelta. Aquí se mide donde importa: un pórtico de
 * un vano y un piso con los brazos donde los pone CSI (la viga, medio canto de columna en cada
 * extremo; la columna, medio canto de viga arriba) y RZ = 0, 0.5 y 1.
 *
 *   LAT, VERT, FUERA  cargas nodales: desplazamientos y giros de los nudos 3 y 4
 *   W                 carga de VANO sobre la viga (la carga sobre el brazo va directa al nudo)
 *   modal             masas nodales, material sin masa: el periodo depende SOLO de la rigidez
 *
 * Referencia: `validation/brazos-rigidos/ref_portico_csi.py` (OAPI). Las propiedades de sección
 * (A, As2, As3, J, I22, I33) son las que devuelve el programa, no una cuenta aparte.
 * El modelo entra por el `.heks` (directiva `endoffset`), como en la app.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { cargarFem, empaquetar, R } from "../lib/bundle.mjs";
import { RAIZ } from "../lib/wasm.mjs";

const cargarCli = async () =>
  (await empaquetar(`export { cliModeler } from "${R}/examples/src/cli-modeler/cliModeler";\n`, "cliModeler")).cliModeler;

function heks(ref, rz, pat) {
  const s = ref.secciones, c = s.COL, v = s.VIG;
  const L = [];
  for (const [k, p] of Object.entries(ref.nudos)) L.push(`node ${k} ${p[0]} ${p[1]} ${p[2]}`);
  // frame id nI nJ E A I22 I33 J nu rho
  L.push(`frame 1 1 3 ${ref.E} ${c.Area} ${c.I22} ${c.I33} ${c.Torsion} ${ref.nu} 0`);
  L.push(`frame 2 2 4 ${ref.E} ${c.Area} ${c.I22} ${c.I33} ${c.Torsion} ${ref.nu} 0`);
  L.push(`frame 3 3 4 ${ref.E} ${v.Area} ${v.I22} ${v.I33} ${v.Torsion} ${ref.nu} 0`);
  L.push(`as 1 ${c.As2} ${c.As3}`, `as 2 ${c.As2} ${c.As3}`, `as 3 ${v.As2} ${v.As3}`);
  L.push(`endoffset 1 0 ${ref.off_col} ${rz}`, `endoffset 2 0 ${ref.off_col} ${rz}`);
  L.push(`endoffset 3 ${ref.off_viga} ${ref.off_viga} ${rz}`);
  L.push("support 1 fixed", "support 2 fixed");
  L.push(`mass 3 ${ref.masa}`, `mass 4 ${ref.masa}`);
  if (pat === "W") L.push(`frameload 3 0 0 ${-ref.W}`);
  else for (const [k, f] of Object.entries(ref.cargas[pat])) L.push(`load ${k} ${f.join(" ")}`);
  L.push("solve");
  return L.join("\n");
}

async function resolver(cli, texto) {
  globalThis.window = { __hekatanCliScript: texto };
  const st = (v) => ({ val: v });
  const states = {
    nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}),
    deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]),
  };
  cli.build({}, states);
  return { nodes: states.nodes.val, elements: states.elements.val, ni: states.nodeInputs.val,
           ei: states.elementInputs.val, def: states.deformOutputs.val, an: states.analyzeOutputs.val };
}

/**
 * Esfuerzos [P V2 V3 T M2 M3] de CSI a la distancia x del nudo inicial, por EQUILIBRIO del tramo
 * [0, x] a partir de las fuerzas de extremo de `analyze` (f = k·u + empotramiento, en el NUDO):
 *     F(x) = −F_I − q·x        M(x) = −M_I + x·(e1 × F_I) + (x²/2)·(e1 × q)
 * ETABS reporta en la CARA del brazo («No output forces are produced within the end offset»), así
 * que se lleva el valor del nudo a la estación de ETABS. M2 con el signo de CSI.
 */
function enEstacion(fI, q, x) {
  const F = [fI[0], fI[1], fI[2]], M = [fI[3], fI[4], fI[5]];
  const cruz = (v) => [0, -v[2], v[1]];                    // e1 × v
  const Fx = [0, 1, 2].map((k) => -F[k] - q[k] * x);
  const cF = cruz(F), cq = cruz(q);
  const Mx = [0, 1, 2].map((k) => -M[k] + x * cF[k] + (x * x / 2) * cq[k]);
  return [Fx[0], Fx[1], Fx[2], Mx[0], -Mx[1], Mx[2]];
}
const BARRAS = { C1: 0, C2: 1, V1: 2 };
const CAMPOS = ["P", "V2", "V3", "T", "M2", "M3"];

export const nombre = "brazos-portico-csi";
export const descripcion = "pórtico con end length offsets (RZ 0, 0.5, 1): estático, carga de vano y modal contra CSI";

export async function correr() {
  const fem = await cargarFem();
  const cli = await cargarCli();
  const filas = [];
  for (const [prog, fichero] of [["ETABS", "brazos_portico_etabs.json"], ["SAP2000", "brazos_portico_sap2000.json"]]) {
    const ruta = join(RAIZ, "tests/datos", fichero);
    if (!existsSync(ruta)) continue;
    const ref = JSON.parse(readFileSync(ruta, "utf-8"));
    for (const caso of ref.casos) {
      let ultimo = null;
      for (const pat of Object.keys(caso.despl)) {
        const r = await resolver(cli, heks(ref, caso.rz, pat));
        ultimo = r;
        let mx = 0, peor = 0, donde = "";
        for (const k of ["3", "4"]) {
          const h = r.def.deformations.get(Number(k) - 1), e = caso.despl[pat][k];
          for (let c = 0; c < 6; c++) mx = Math.max(mx, Math.abs(e[c]));
          for (let c = 0; c < 6; c++) {
            const d = Math.abs(h[c] - e[c]);
            if (d > peor) { peor = d; donde = `nudo ${k} gdl ${c + 1}: ${h[c].toExponential(6)} vs ${e[c].toExponential(6)}`; }
          }
        }
        const p = (100 * peor) / mx;
        filas.push({ que: `${prog} RZ=${caso.rz} · ${pat}: desplazamientos y giros`, medido: p, limite: 0.01, ok: p < 0.01,
                     detalle: donde || "12 componentes iguales" });

        // esfuerzos de las tres barras en las dos estaciones de CSI (las caras de los brazos)
        const a = r.an;
        const mapas = [a.normals, a.shearsY, a.shearsZ, a.torsions, a.bendingsY, a.bendingsZ];
        let pico = 0, peorF = 0, dondeF = "";
        for (const [nom, idx] of Object.entries(BARRAS)) {
          const e = caso.barras[pat][nom];
          const fI = mapas.map((mp) => mp.get(idx)[0]);
          let q = [0, 0, 0];
          if (pat === "W" && nom === "V1") {
            const el = r.elements[idx];
            const T = fem.getTransformationMatrix([r.nodes[el[0]], r.nodes[el[1]]], 0);
            q = [0, 1, 2].map((i) => T[i][2] * -ref.W);
          }
          [0, 1].forEach((s) => {
            const h = enEstacion(fI, q, e.sta[s]);
            CAMPOS.forEach((c, k) => {
              pico = Math.max(pico, Math.abs(e[c][s]));
              const d = Math.abs(h[k] - e[c][s]);
              if (d > peorF) { peorF = d; dondeF = `${nom} ${c} en x=${e.sta[s]}: ${h[k].toFixed(5)} vs ${e[c][s].toFixed(5)}`; }
            });
          });
        }
        const pf = (100 * peorF) / pico;
        filas.push({ que: `${prog} RZ=${caso.rz} · ${pat}: esfuerzos en la cara del brazo`, medido: pf, limite: 0.01, ok: pf < 0.01,
                     detalle: dondeF || "36 valores iguales" });
      }
      // modal: solo masa lateral (la fuente de masa de ETABS por defecto); SAP2000 cuenta la vertical
      const lateral = prog === "ETABS" ? 1 : 0;
      const mo = fem.modalAnalysis(ultimo.nodes, ultimo.elements, ultimo.ni, ultimo.ei, caso.periodos.length, lateral, 0, 1);
      const T = Array.from(mo.frequencies, (f) => 1 / f).sort((a, b) => b - a);
      let peorT = 0, cual = "";
      caso.periodos.forEach((t, i) => {
        const d = (100 * Math.abs(T[i] - t)) / t;
        if (d >= peorT) { peorT = d; cual = `modo ${i + 1}: ${T[i]?.toFixed(6)} vs ${t.toFixed(6)} s`; }
      });
      filas.push({ que: `${prog} RZ=${caso.rz} · periodos (${caso.periodos.length} modos)`, medido: peorT, limite: 0.01,
                   ok: peorT < 0.01, detalle: cual });
    }
  }
  // `rigidzone`: el factor de todo el modelo manda sobre el rz de cada `endoffset`
  {
    const ruta = join(RAIZ, "tests/datos/brazos_portico_etabs.json");
    if (existsSync(ruta)) {
      const ref = JSON.parse(readFileSync(ruta, "utf-8"));
      const ux = async (texto) => (await resolver(cli, texto)).def.deformations.get(2)[0];
      const con1 = heks(ref, 1, "LAT");
      const e0 = ref.casos.find((c) => c.rz === 0).despl.LAT["3"][0];
      const e05 = ref.casos.find((c) => c.rz === 0.5).despl.LAT["3"][0];
      const NL = String.fromCharCode(10);
      const d0 = (100 * Math.abs((await ux(con1.replace("solve", "rigidzone 0" + NL + "solve"))) - e0)) / e0;
      const d05 = (100 * Math.abs((await ux("rigidzone 0.5" + NL + con1)) - e05)) / e05;
      const dOff = (100 * Math.abs((await ux(con1.replace("solve", "rigidzone off" + NL + "solve"))) - e0)) / e0;
      filas.push({ que: "`rigidzone 0` con brazos escritos a 1 = ETABS con RZ = 0", medido: d0, limite: 0.01, ok: d0 < 0.01, detalle: "ux del nudo 3, patrón LAT" });
      filas.push({ que: "`rigidzone 0.5` antes de los `endoffset` = ETABS con RZ = 0.5", medido: d05, limite: 0.01, ok: d05 < 0.01, detalle: "ux del nudo 3, patrón LAT" });
      filas.push({ que: "`rigidzone off` (SAP2000, sin brazos) = la barra de nudo a nudo", medido: dOff, limite: 0.01, ok: dOff < 0.01, detalle: "misma rigidez que RZ = 0" });
    }
  }
  if (!filas.length) filas.push({ que: "referencia de CSI", medido: 1, limite: 0, ok: false, detalle: "falta tests/datos/brazos_portico_etabs.json" });
  return filas;
}
