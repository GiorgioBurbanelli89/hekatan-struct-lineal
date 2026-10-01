/**
 * Worker del análisis modal.
 *
 * El modal es SÍNCRONO: mientras el WASM resuelve, el hilo principal se queda
 * bloqueado. Medido con el galpón (431 nudos, 882 elementos, 12 modos): la
 * página se congela más de 30 s — no responde ni al ratón, y ni siquiera se
 * puede capturar la pantalla. Aquí se corre aparte y la UI sigue viva.
 *
 * Los Map no viajan por `postMessage` sin más: se mandan como pares
 * [clave, valor] y se rearman a este lado.
 */
import { modalAnalysis } from "hekatan-fem";

type Pares = [number, unknown][];

function aMapa(p: Pares | undefined): Map<number, any> | undefined {
  // un campo que no es mapa (elementInputs.unidades = "tonf-m") pasa tal cual: new Map("tonf-m") revienta
  return Array.isArray(p) ? new Map(p as [number, any][]) : (p as any);
}

// Señal de vida: si esto no llega, el worker ni siquiera arrancó (fallo al
// resolver el módulo, no al calcular) y hay que mirar el bundler, no el solver.
(self as any).postMessage({ vivo: true });

self.onmessage = async (ev: MessageEvent) => {
  const { nodes, elements, nodeInputs, elementInputs, nModes } = ev.data ?? {};
  try {
    const ni: any = {};
    for (const [k, v] of Object.entries(nodeInputs ?? {})) {
      ni[k] = aMapa(v as Pares);
    }
    const ei: any = {};
    for (const [k, v] of Object.entries(elementInputs ?? {})) {
      ei[k] = aMapa(v as Pares);
    }
    const m = (modalAnalysis as any)(nodes, elements, ni, ei, nModes);
    // Las salidas también pueden traer Map: se aplanan igual.
    const plano: any = {
      frequencies: m?.frequencies ?? [],
      massParticipation: m?.massParticipation ?? [],
      modeShapes: m?.modeShapes ?? [],
    };
    (self as any).postMessage({ ok: true, m: plano });
  } catch (e: any) {
    (self as any).postMessage({ ok: false, error: e?.message ?? String(e) });
  }
};
