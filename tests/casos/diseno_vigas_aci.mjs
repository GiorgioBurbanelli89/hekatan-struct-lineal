import { empaquetar, R } from "../lib/bundle.mjs";

const PSI_TO_MPA = 0.006894757293;
const TONF_TO_KN = 9.80665;

export const nombre = "diseno-vigas-aci";
export const descripcion = "Viga RC ACI 318-14/19: flexión, cortante, torsión y O/S #45 contra evidencia ETABS";

export async function correr() {
  const { designConcreteBeam, CONCRETE_ERROR_45 } = await empaquetar(
    `export { designConcreteBeam, CONCRETE_ERROR_45 } from "${R}/examples/src/shared/concreteBeamDesign";\n`,
    "diseno-vigas-aci",
  );
  const fc = 4000 * PSI_TO_MPA * 1000;
  const fy = 60000 * PSI_TO_MPA * 1000;
  const result = designConcreteBeam({
    code: "ACI 318-14",
    section: { b: 0.30, h: 0.50, coverToBarCenter: 1.75 * 0.0254 },
    material: { fc, fy, fys: fy },
    demand: {
      Mu: -3.992674 * TONF_TO_KN,
      Vu: 11.268646 * TONF_TO_KN,
      Tu: 5.2248 * TONF_TO_KN,
      Pu: 1.836471 * TONF_TO_KN,
    },
    stirrupSpacing: 0.30,
  });
  const reduced = designConcreteBeam({
    code: "ACI 318-14",
    section: { b: 0.30, h: 0.50, coverToBarCenter: 1.75 * 0.0254 },
    material: { fc, fy, fys: fy },
    demand: {
      Mu: 0,
      Vu: 1.271628 * TONF_TO_KN,
      Tu: 2.0047 * TONF_TO_KN,
      Pu: 1.271628 * TONF_TO_KN,
    },
    stirrupSpacing: 0.30,
  });
  return [
    { que: "Aoh ETABS", medido: result.section.Aoh, limite: 0.08678321, ok: Math.abs(result.section.Aoh - 0.08678321) < 1e-6 },
    { que: "ph ETABS", medido: result.section.ph, limite: 1.2444, ok: Math.abs(result.section.ph - 1.2444) < 1e-6 },
    { que: "status worst", medido: result.status, limite: "O/S #45", ok: result.status === "O/S #45", crudo: true },
    { que: "error exacto", medido: result.error, limite: CONCRETE_ERROR_45, ok: result.error === CONCRETE_ERROR_45, crudo: true },
    { que: "interacción", medido: result.interaction.ratio, limite: 1, ok: result.interaction.ratio > 1 },
    { que: "Tcr kN·m", medido: result.torsion.Tcr, limite: 26.2, ok: Math.abs(result.torsion.Tcr - 26.2) < 1.0 },
    { que: "Al worst cm²", medido: result.torsion.Al * 10000, limite: 13.93, ok: result.torsion.Al * 10000 > 10 },
    { que: "flexure top cm²", medido: result.flexure.AsTop * 10000, limite: 1, ok: result.flexure.AsTop * 10000 > 0 },
    { que: "ratio Tcr/Tu reduced", medido: reduced.torsion.criticalRatio, limite: 0.96743, ok: Math.abs(reduced.torsion.criticalRatio - 0.96743) < 0.03 },
  ];
}
