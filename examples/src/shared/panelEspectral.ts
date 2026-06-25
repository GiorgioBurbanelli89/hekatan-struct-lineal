/**
 * Panel Tweakpane del análisis espectral dinámico (replica el diálogo Response Spectrum
 * de ETABS): combinación modal, combinación direccional, amortiguamiento, excentricidad
 * de diafragma (±%) y corrección periodic+rigid. Llama a responseSpectrum.ts + el espectro
 * NEC + el modal. Conecta con CM/CR (centroMasaRigidez.ts) para la excentricidad accidental.
 */
import type { ModalCombo, DirectionalCombo } from "./responseSpectrum";

export interface EspectralParams {
  modalCombo: ModalCombo;            // SRSS | CQC | ABS
  directionalCombo: DirectionalCombo; // SRSS | Absolute | CQC3
  damping: number;                   // ζ, default 0.05
  diaphragmEccentricity: number;     // ±% accidental (0.05) — usa CM/CR
  periodicRigid: boolean;            // corrección masa faltante (Gupta/Lindley-Yow)
  numModes: number;
}

export const defaultEspectralParams: EspectralParams = {
  modalCombo: "CQC",
  directionalCombo: "SRSS",
  damping: 0.05,
  diaphragmEccentricity: 0.05,
  periodicRigid: false,
  numModes: 12,
};

/**
 * Agrega el folder "Espectral dinámico (NEC)" a un pane Tweakpane.
 * @param pane   instancia Tweakpane (o un folder)
 * @param params objeto EspectralParams (mutado por los bindings)
 * @param onRun  callback que corre el análisis espectral con los params actuales
 */
export function addEspectralPanel(pane: any, params: EspectralParams, onRun: () => void) {
  const f = pane.addFolder({ title: "🌀 Espectral dinámico (NEC)", expanded: false });

  f.addBinding(params, "modalCombo", {
    label: "Comb. modal",
    options: { CQC: "CQC", SRSS: "SRSS", ABS: "ABS" },
  });
  f.addBinding(params, "directionalCombo", {
    label: "Comb. direccional",
    options: { SRSS: "SRSS", Absolute: "Absolute", CQC3: "CQC3" },
  });
  f.addBinding(params, "damping", { label: "Amortiguamiento ζ", min: 0.0, max: 0.2, step: 0.005 });
  f.addBinding(params, "diaphragmEccentricity", {
    label: "Excentricidad ± (diaf.)", min: 0, max: 0.15, step: 0.01,
  });
  f.addBinding(params, "periodicRigid", { label: "Periodic + Rigid" });
  f.addBinding(params, "numModes", { label: "N° modos", min: 1, max: 50, step: 1 });

  f.addButton({ title: "▶️ Correr espectral" }).on("click", onRun);
  return f;
}
