export type ConcreteBeamCode = "ACI 318-14" | "ACI 318-19";

export interface ConcreteBeamSection {
  b: number;
  h: number;
  coverToBarCenter?: number;
  compressionCoverToBarCenter?: number;
}

export interface ConcreteBeamMaterial {
  fc: number;
  fy: number;
  fys?: number;
  lambda?: number;
  Es?: number;
  phiFlexure?: number;
  phiShearTorsion?: number;
  phiCriticalTorsion?: number;
  concreteShearCapacity?: number;
  combinedAdditiveCoefficient?: number;
}

export interface ConcreteBeamDemand {
  Mu: number;
  Vu: number;
  Tu: number;
  Pu?: number;
  station?: number;
}

export interface ConcreteBeamDesignInput {
  code?: ConcreteBeamCode;
  section: ConcreteBeamSection;
  material: ConcreteBeamMaterial;
  demand: ConcreteBeamDemand;
  stirrupSpacing?: number;
}

export interface ConcreteBeamSectionProperties {
  b: number;
  h: number;
  d: number;
  dp: number;
  bw: number;
  Acp: number;
  pcp: number;
  Aoh: number;
  A0: number;
  ph: number;
  coverToBarCenter: number;
}

export interface ConcreteBeamFlexureResult {
  Mu: number;
  beta1: number;
  cMax: number;
  aMax: number;
  a: number;
  AsRequired: number;
  AsMin: number;
  AsMax: number;
  AsTension: number;
  AsCompression: number;
  AsTop: number;
  AsBottom: number;
  tensionSide: "top" | "bottom" | "none";
  compressionSteelRequired: boolean;
  flexureRatio: number;
}

export interface ConcreteBeamShearResult {
  Vu: number;
  Vc: number;
  Vmax: number;
  phiVc: number;
  phiVmax: number;
  AvsRequired: number;
  AvsMinimum: number;
  Avs: number;
  shearRatio: number;
  shearPass: boolean;
}

export interface ConcreteBeamTorsionResult {
  Tu: number;
  Tth: number;
  Tcr: number;
  phiTth: number;
  phiTcr: number;
  criticalRatio: number;
  criticalPass: boolean;
  torsionRequired: boolean;
  AlRequired: number;
  AlMinimum: number;
  Al: number;
  AtOverS: number;
  torsionPass: boolean;
}

export interface ConcreteBeamInteractionResult {
  demandStress: number;
  capacityStress: number;
  ratio: number;
  pass: boolean;
  errorCode?: number;
  error?: string;
}

export interface ConcreteBeamDesignResult {
  code: ConcreteBeamCode;
  station: number;
  section: ConcreteBeamSectionProperties;
  flexure: ConcreteBeamFlexureResult;
  shear: ConcreteBeamShearResult;
  torsion: ConcreteBeamTorsionResult;
  interaction: ConcreteBeamInteractionResult;
  status: "OK" | "O/S V" | "O/S T" | "O/S #45";
  error?: string;
}

export const CONCRETE_ERROR_45 = "Shear stress due to shear force and torsion together exceeds maximum allowed.";
export const KGF_CM2_TO_KN_M2 = 98.0665;
export const ETABS_TORSION_COVER = 1.75 * 0.0254;

const positive = (value: number): number => Math.max(0, value);
const finite = (value: number, fallback = 0): number => Number.isFinite(value) ? value : fallback;

export function concreteSectionProperties(section: ConcreteBeamSection): ConcreteBeamSectionProperties {
  const coverToBarCenter = Math.max(0, finite(section.coverToBarCenter, ETABS_TORSION_COVER));
  const dp = Math.max(0, finite(section.compressionCoverToBarCenter, coverToBarCenter));
  const d = section.h - coverToBarCenter;
  const bw = section.b;
  const innerB = Math.max(1e-9, bw - 2 * coverToBarCenter);
  const innerH = Math.max(1e-9, section.h - 2 * coverToBarCenter);
  const Aoh = innerB * innerH;
  return {
    b: bw,
    h: section.h,
    d,
    dp,
    bw,
    Acp: bw * section.h,
    pcp: 2 * (bw + section.h),
    Aoh,
    A0: 0.85 * Aoh,
    ph: 2 * innerB + 2 * innerH,
    coverToBarCenter,
  };
}

function beta1(fcKgfCm2: number): number {
  return Math.min(0.85, Math.max(0.65, 0.85 - 0.05 * (fcKgfCm2 - 281) / 69.5));
}

function flexuralMomentCapacity(
  fc: number,
  fy: number,
  Es: number,
  b: number,
  d: number,
  dp: number,
  MuAbs: number,
  phi: number,
): ConcreteBeamFlexureResult {
  const fcKgfCm2 = fc / KGF_CM2_TO_KN_M2;
  const fcMPa = fc / 1000;
  const fyMPa = fy / 1000;
  const b1 = beta1(fcKgfCm2);
  const cMax = (0.003 / (0.003 + 0.005)) * d;
  const aMax = b1 * cMax;
  const discriminant = d * d - (2 * MuAbs) / (0.85 * fc * phi * b);
  const a = discriminant <= 0 ? d : d - Math.sqrt(discriminant);
  const asMin = Math.max((3 * Math.sqrt(fcMPa)) / fyMPa * b * d, (200 / fyMPa) * b * d);
  const asMax = 0.04 * b * d;
  let asRequired = 0;
  let asCompression = 0;
  let compressionSteelRequired = false;
  if (MuAbs > 0) {
    if (a <= aMax) {
      asRequired = MuAbs / Math.max(1e-12, phi * fy * Math.max(1e-9, d - a / 2));
    } else {
      compressionSteelRequired = true;
      const C = 0.85 * fc * b * aMax;
      const Muc = C * (d - aMax / 2) * phi;
      const Mus = Math.max(0, MuAbs - Muc);
      const fsPrime = Math.min(fy, Es * 0.003 * Math.max(0, cMax - dp) / Math.max(1e-12, cMax));
      const compressionDenominator = (fsPrime - 0.85 * fc) * (d - dp) * phi;
      asCompression = compressionDenominator > 1e-9 ? Mus / compressionDenominator : 0;
      const as1 = Muc / Math.max(1e-12, fy * (d - aMax / 2) * phi);
      const as2 = Mus / Math.max(1e-12, fy * (d - dp) * phi);
      asRequired = as1 + as2;
    }
  }
  const asTension = Math.min(asMax, Math.max(asMin, asRequired));
  const asCompressionLimited = Math.min(asMax, Math.max(asMin, asCompression));
  const momentCapacity = phi * asTension * fy * Math.max(0, d - a / 2);
  const flexureRatio = MuAbs <= 1e-12 ? 0 : MuAbs / Math.max(1e-12, momentCapacity);
  return {
    Mu: MuAbs,
    beta1: b1,
    cMax,
    aMax,
    a,
    AsRequired: asRequired,
    AsMin: asMin,
    AsMax: asMax,
    AsTension: asTension,
    AsCompression: asCompressionLimited,
    AsTop: 0,
    AsBottom: 0,
    tensionSide: MuAbs <= 1e-12 ? "none" : "bottom",
    compressionSteelRequired,
    flexureRatio,
  };
}

function torsionLimits(
  fc: number,
  Acp: number,
  pcp: number,
  Ag: number,
  Pu: number,
  lambda: number,
): { Tth: number; Tcr: number } {
  const fcPsi = fc / 6.894757293;
  const acpIn2 = Acp / (0.0254 * 0.0254);
  const pcpIn = pcp / 0.0254;
  const puLb = positive(Pu) * 224.808943;
  const axialRatio = puLb / Math.max(1e-12, 4 * acpIn2 * Math.sqrt(fcPsi));
  const factor = 1 + axialRatio;
  const base = lambda * Math.sqrt(fcPsi) * acpIn2 * acpIn2 / Math.max(1e-12, pcpIn) * 0.000112984829;
  return { Tth: 2 * base * factor, Tcr: 4 * base * factor };
}

export function designConcreteBeam(input: ConcreteBeamDesignInput): ConcreteBeamDesignResult {
  const section = concreteSectionProperties(input.section);
  const material = input.material;
  const demand = input.demand;
  const code = input.code ?? "ACI 318-19";
  const fc = positive(material.fc);
  const fy = positive(material.fy);
  const fys = positive(material.fys ?? fy);
  const lambda = positive(material.lambda ?? 1);
  const Es = positive(material.Es ?? 200_000_000);
  const phiFlexure = positive(material.phiFlexure ?? 0.9);
  const phiShearTorsion = positive(material.phiShearTorsion ?? 0.75);
  const phiCriticalTorsion = positive(material.phiCriticalTorsion ?? phiShearTorsion);
  const Mu = finite(demand.Mu);
  const Vu = Math.abs(finite(demand.Vu));
  const Tu = Math.abs(finite(demand.Tu));
  const Pu = finite(demand.Pu ?? 0);
  const fcKgfCm2 = fc / KGF_CM2_TO_KN_M2;
  const fcMPa = fc / 1000;
  const fyMPa = fy / 1000;
  const fysMPa = fys / 1000;
  const flexure = flexuralMomentCapacity(fc, fy, Es, section.b, section.d, section.dp, Math.abs(Mu), phiFlexure);
  if (Mu > 1e-12) {
    flexure.AsBottom = flexure.AsTension;
    flexure.AsTop = flexure.AsCompression;
    flexure.tensionSide = "bottom";
  } else if (Mu < -1e-12) {
    flexure.AsTop = flexure.AsTension;
    flexure.AsBottom = flexure.AsCompression;
    flexure.tensionSide = "top";
  } else {
    flexure.AsTop = flexure.AsMin;
    flexure.AsBottom = flexure.AsMin;
  }
  const concreteShearCapacity = material.concreteShearCapacity ?? 0.53 * lambda * Math.sqrt(fcKgfCm2) * KGF_CM2_TO_KN_M2 * section.bw * section.d;
  const Vc = positive(concreteShearCapacity);
  const Vmax = Vc + 0.66 * Math.sqrt(fcMPa) * 1000 * section.bw * section.d;
  const phiVc = phiShearTorsion * Vc;
  const phiVmax = phiShearTorsion * Vmax;
  const AvsRequired = positive((Vu - phiVc) / Math.max(1e-12, phiShearTorsion * fys * section.d));
  const spacing = positive(input.stirrupSpacing ?? 0.3);
  const AvsMinimum = Math.max(
    0.075 * Math.sqrt(fcMPa) * 1000 * section.bw / Math.max(1, fy),
    0.35 * section.bw / Math.max(1, fy * spacing),
  );
  const Avs = Math.max(AvsRequired, AvsMinimum);
  const shearRatio = Vu <= 1e-12 ? 0 : Vu / Math.max(1e-12, phiVmax);
  const shearPass = Vu <= phiVmax + 1e-9;
  const limits = torsionLimits(fc, section.Acp, section.pcp, section.b * section.h, Pu, lambda);
  const phiTth = phiCriticalTorsion * limits.Tth;
  const phiTcr = phiCriticalTorsion * limits.Tcr;
  const criticalRatio = Tu <= 1e-12 ? 0 : phiTcr / Tu;
  const criticalPass = Tu <= phiTcr + 1e-9;
  const torsionRequired = Tu > phiTth + 1e-9;
  const AtOverS = torsionRequired ? Tu / Math.max(1e-12, 2 * phiShearTorsion * section.A0 * fys) : 0;
  const alRequired = torsionRequired ? Tu * section.ph / Math.max(1e-12, 2 * phiShearTorsion * section.A0 * fy) : 0;
  const alMinA = positive(0.5 * Math.sqrt(fcMPa) * 1000 * section.Acp / Math.max(1, fy) - AtOverS * section.ph);
  const Al = torsionRequired ? Math.max(alRequired, alMinA) : 0;
  const torsionPass = Tu <= phiTcr + 1e-9;
  const demandStress = Math.sqrt(
    Math.pow(Vu / Math.max(1e-12, section.bw * section.d), 2) +
    Math.pow(Tu * section.ph / Math.max(1e-12, 1.7 * section.Aoh * section.Aoh), 2),
  );
  const additiveCoefficient = material.combinedAdditiveCoefficient ?? 2;
  const capacityStress = phiShearTorsion * (
    Vc / Math.max(1e-12, section.bw * section.d) +
    additiveCoefficient * Math.sqrt(fcKgfCm2) * KGF_CM2_TO_KN_M2
  );
  const interactionRatio = demandStress / Math.max(1e-12, capacityStress);
  const interactionPass = interactionRatio <= 1 + 1e-9;
  let status: ConcreteBeamDesignResult["status"] = "OK";
  let error: string | undefined;
  if (!interactionPass) {
    status = "O/S #45";
    error = CONCRETE_ERROR_45;
  } else if (!shearPass) {
    status = "O/S V";
  } else if (!torsionPass) {
    status = "O/S T";
  }
  return {
    code,
    station: finite(demand.station),
    section,
    flexure,
    shear: {
      Vu,
      Vc,
      Vmax,
      phiVc,
      phiVmax,
      AvsRequired,
      AvsMinimum,
      Avs,
      shearRatio,
      shearPass,
    },
    torsion: {
      Tu,
      Tth: limits.Tth,
      Tcr: limits.Tcr,
      phiTth,
      phiTcr,
      criticalRatio,
      criticalPass,
      torsionRequired,
      AlRequired: alRequired,
      AlMinimum: alMinA,
      Al,
      AtOverS,
      torsionPass,
    },
    interaction: {
      demandStress,
      capacityStress,
      ratio: interactionRatio,
      pass: interactionPass,
      errorCode: interactionPass ? undefined : 45,
      error: interactionPass ? undefined : CONCRETE_ERROR_45,
    },
    status,
    error,
  };
}

export function selectControllingBeamStation(results: ConcreteBeamDesignResult[]): ConcreteBeamDesignResult | undefined {
  return results.reduce<ConcreteBeamDesignResult | undefined>((current, result) => {
    if (!current) return result;
    if (result.interaction.ratio > current.interaction.ratio) return result;
    return current;
  }, undefined);
}
