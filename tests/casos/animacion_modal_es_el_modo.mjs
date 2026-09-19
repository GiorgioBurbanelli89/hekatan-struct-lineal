/**
 * LO QUE EL VISOR DIBUJA AL ANIMAR UN MODO ¿ES EL MODO?
 *
 * Este caso existe por el fallo del 18-sep-2026
 * (`registros/2026-09-18_revision_deformada_modal.md`): el visor animaba la
 * deformada del caso DEAD en vez de la forma modal φ. Lo dibujado era
 * exactamente **30.427 veces** la deformada de gravedad — 12 comprobaciones
 * independientes (4 nudos × 3 componentes) con el mismo factor a cinco cifras.
 *
 * Nadie lo cazó porque los arneses miraban «pageerror: 0» y capturas bonitas, y
 * porque los NÚMEROS del modal estaban bien: periodos a 0.3 % de SAP2000 y MAC
 * 0.9999 nudo a nudo. Lo que estaba mal era el DIBUJO. De ahí la regla de este
 * caso: **no se mira si cargó, se miden los nudos que el visor tiene puestos**.
 *
 * ── Cómo se mide ────────────────────────────────────────────────────────────
 * Con el bundle LOCAL (`npm run build:deploy`) servido por `http.createServer` y
 * el Chrome del sistema (`PUPPETEER_EXECUTABLE_PATH`). No contra el sitio
 * público: en headless el público no termina el modal (medido 25 y 40 min).
 *
 * En varios instantes del ciclo se lee `mesh.nodes` (lo DIBUJADO) y se le resta
 * la posición sin deformar que publica el animador (`settings.__modoAnim.orig`).
 * Ese vector se compara contra φ (`window.__hekatanModalResultados()`) y contra
 * la deformada estática del caso (`states.deformOutputs`). Ver `tests/lib/visor_modal.mjs`.
 *
 * ── Por qué NO hay un límite fijo «coseno con Dead ≤ 0.2» ───────────────────
 * Porque reprobaría a un programa CORRECTO: en `test-m-dual` el propio φ₁ tiene
 * coseno **0.379** con la deformada de gravedad (medido). Son dos vectores del
 * mismo edificio; no tienen por qué ser perpendiculares. Lo que delata el fallo
 * es que lo dibujado se parezca a Dead **más que φ**: con el fallo puesto daba
 * 1.000 contra 0.379 → exceso 0.62. Se mide ese EXCESO, con límite 0.02.
 *
 * ── Qué modelos ─────────────────────────────────────────────────────────────
 * Tres, para que sea rápido y siga corriendo en cada `npm test`: el dual del
 * artículo (losa + muros, 545 nudos, el único con deformada de gravedad grande),
 * un pórtico 2D de barras y la plantilla dual. Las OTRAS plantillas y los ~140
 * ejemplos se barren aparte con `node cli/check_animacion_modal.mjs`, que tarda
 * demasiado para meterlo en cada corrida.
 */
import { abrirVisor, enganchar, medirModelo, hayBundle } from "../lib/visor_modal.mjs";

export const nombre = "animacion-modal-es-el-modo";
export const descripcion =
  "lo DIBUJADO al animar un modo es φ y no la deformada de Dead (visor real, bundle local)";

/** Los tres modelos del caso rápido. `tipo` solo lo usan las plantillas. */
const MODELOS = [
  { id: "test-m-dual", tipo: null, mote: "dual art." },   // losa + muros, Dead grande
  { id: "plantillas", tipo: 0, mote: "plant.2D" },        // pórtico 2D de barras
  { id: "plantillas", tipo: 6, mote: "plant.dual" },      // pórtico + losa + muros
];

// Límites. Ninguno se subió para que pasara: todos están medidos muy por dentro
// (cos φ = 0.999999999999996, exceso Dead = 1e-16, coseno entre modos ≤ 0.035).
const LIM = {
  cosPhi: 0.999,        // ≥ : lo dibujado ES la forma modal
  excesoDead: 0.02,     // ≤ : no se parece a Dead más que φ
  cosEntreModos: 0.2,   // ≤ : cambiar de modo cambia el dibujo
  ampMinRel: 0.5,       // ≤ : el ciclo pasa por cero (no es una deformada congelada)
  picoRel: 0.8,         // ≥ : la amplitud del ciclo no se apaga ni se dispara
  dispEscala: 1e-6,     // ≤ : el dibujo es un escalado de UNA forma fija
};

export async function correr() {
  const filas = [];
  if (!hayBundle()) {
    return [{ que: "bundle del visor", medido: "falta", limite: "website/src/examples",
              ok: false, crudo: true, detalle: "corré: npm run build:deploy" }];
  }
  const v = await abrirVisor({ puerto: 4793 });
  enganchar(v);
  try {
    for (const m of MODELOS) {
      const r = await medirModelo(v.pag, { id: m.id, tipo: m.tipo, muestras: 18 });
      const et = m.mote;
      if (r.estado !== "ok") {
        filas.push({ que: `${et}: anima`, medido: r.estado, limite: "ok", ok: false,
                     crudo: true, detalle: r.nota || "" });
        continue;
      }
      // (a) lo dibujado ES φ — en el modo 1 y en los modos 2 y 3
      filas.push({
        que: `${et}: cos(dibujo, φ)`, medido: r.cosPhiTodosMin.toFixed(6),
        limite: `>= ${LIM.cosPhi}`, ok: r.cosPhiTodosMin >= LIM.cosPhi, crudo: true,
        detalle: `${r.nMuestras} instantes · ${r.nNudos} nudos · ${r.nModos} modos`,
      });
      // (b) NO es la deformada del caso Dead disfrazada
      filas.push({
        que: `${et}: exceso vs Dead`, medido: r.excesoDead.toExponential(2),
        limite: `<= ${LIM.excesoDead}`, ok: r.excesoDead <= LIM.excesoDead, crudo: true,
        detalle: r.deadNulo ? "la deformada del caso es nula: no hay impostor que medir"
                            : `cos(dibujo,Dead)=${r.cosDeadMax.toFixed(4)} contra cos(φ,Dead)=${r.cosPhiDead.toFixed(4)}`,
      });
      // (c) la componente dibujada dominante es la que dice la participación de masa
      const dirs = ["Ux", "Uy", "Uz"];
      filas.push({
        que: `${et}: dirección modo 1`,
        medido: r.dirOk === null ? "sin participación" : dirs[r.dirDibujada],
        limite: r.dirParticipacion != null ? dirs[r.dirParticipacion] : "—",
        ok: r.dirOk !== false, crudo: true,
        detalle: `participación ${r.participacion.map((p, i) => dirs[i] + " " + (p * 100).toFixed(1) + "%").join(" · ")}`,
      });
      // (d) cambiar de modo CAMBIA la forma dibujada
      if (r.cosEntreModosMax !== null) filas.push({
        que: `${et}: modos distintos`, medido: r.cosEntreModosMax.toFixed(4),
        limite: `<= ${LIM.cosEntreModos}`, ok: r.cosEntreModosMax <= LIM.cosEntreModos, crudo: true,
        detalle: r.modos.filter((x) => x.i > 0).map((x) => `modo${x.i + 1}:${(x.cosConModo1 ?? 0).toFixed(3)}`).join(" "),
      });
      // (e) oscila: los dos signos y pasa cerca de cero
      const oscila = r.hayPositivos && r.hayNegativos && r.ampMinRel <= LIM.ampMinRel;
      filas.push({
        que: `${et}: oscila`, medido: oscila ? "sí" : "no", limite: "sí", ok: oscila, crudo: true,
        detalle: `amp min/max = ${r.ampMinRel.toFixed(3)} · signos ${r.hayPositivos ? "+" : ""}${r.hayNegativos ? "−" : ""}`,
      });
      // (f) amplitud estable y forma fija
      filas.push({
        que: `${et}: amplitud estable`, medido: r.picoRel.toFixed(4),
        limite: `>= ${LIM.picoRel}`, ok: r.picoRel >= LIM.picoRel && r.dispersionEscala <= LIM.dispEscala,
        crudo: true, detalle: `dispersión |d|/|amp| = ${r.dispersionEscala.toExponential(1)}`,
      });
      // (g) el colormap del caso anterior NO se queda pegado al entrar en modal
      const limpio = r.shellResults === "none" && (r.solidResults === "none" || r.solidResults == null);
      filas.push({
        que: `${et}: colormap limpio`, medido: `${r.shellResults}/${r.solidResults}`,
        limite: "none/none", ok: limpio, crudo: true,
        detalle: r.colormapSucio ? `se ensució a «${r.colormapSucio}» antes de correr el modal`
                                 : "no se pudo ensuciar (el ejemplo no tiene shellResults)",
      });
    }
    if (v.errores.length) filas.push({
      que: "errores de página", medido: String(v.errores.length), limite: "0",
      ok: false, crudo: true, detalle: v.errores.slice(0, 2).join(" | "),
    });
  } finally {
    await v.cerrar();
  }
  return filas;
}
