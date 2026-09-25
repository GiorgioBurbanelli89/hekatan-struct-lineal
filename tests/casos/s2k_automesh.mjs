/**
 * FRAME AUTO MESH ASSIGNMENTS (AtJoints=Yes): SAP2000 parte la barra en los nudos que caen sobre ella.
 *
 * Medido el 25-sep-2026 con «Cancha Parque» (SAP2000 25.3.1, 1279 barras): las 14 columnas van de
 * 0 a 7.1 m y pasan por un nudo del arco a 6.3 m. SAP las parte ahí (1293 elementos de análisis) y
 * el arco queda unido a la columna. `parseS2k` ignoraba la tabla: el arco colgaba solo de la cabeza
 * y las flechas salían ×2.2 (122 % en el peor nudo). Con el corte: flecha máxima a 0.3 % de SAP.
 *
 * Aquí: columna empotrada de 4 m que pasa por el nudo 2 (z = 2) sin tocarlo, y un voladizo de 3 m
 * que sale de ese nudo con P en la punta. Sin el corte el voladizo es un mecanismo.
 * Árbitro analítico (Euler-Bernoulli, AS enormes):
 *   δ = P·Lv³/(3EI) + θ·Lv,   θ = (P·Lv)·h/(EI)   (giro de la columna a la altura h = 2 m)
 * y una carga trapezoidal en X sobre la columna ENTERA tiene que llegar a la base completa.
 */
import { empaquetar, R, cargarFem } from "../lib/bundle.mjs";

export const nombre = "s2k-automesh";
export const descripcion = "AutoMesh AtJoints del .s2k: la barra se parte en el nudo intermedio (Cancha Parque)";

const E = 2e8, I = 1e-5, A = 1e-2, P = 10, Lv = 3, h = 2;
const S2K = `TABLE:  "PROGRAM CONTROL"
   ProgramName=SAP2000   Version=24.1.0   CurrUnits="KN, m, C"
TABLE:  "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES"
   Material=M   UnitWeight=0   UnitMass=0   E1=${E}   G12=${E / 2.6}   U12=0.3
TABLE:  "FRAME SECTION PROPERTIES 01 - GENERAL"
   SectionName=S   Material=M   Shape=General   Area=${A}   TorsConst=${2 * I}   I33=${I}   I22=${I}   AS2=1000000   AS3=1000000
TABLE:  "LOAD PATTERN DEFINITIONS"
   LoadPat=L   DesignType=Live   SelfWtMult=0
TABLE:  "JOINT COORDINATES"
   Joint=1   CoordSys=GLOBAL   CoordType=Cartesian   XorR=0   Y=0   Z=0
   Joint=2   CoordSys=GLOBAL   CoordType=Cartesian   XorR=0   Y=0   Z=${h}
   Joint=3   CoordSys=GLOBAL   CoordType=Cartesian   XorR=0   Y=0   Z=4
   Joint=4   CoordSys=GLOBAL   CoordType=Cartesian   XorR=${Lv}   Y=0   Z=${h}
TABLE:  "CONNECTIVITY - FRAME"
   Frame=1   JointI=1   JointJ=3
   Frame=2   JointI=2   JointJ=4
TABLE:  "JOINT RESTRAINT ASSIGNMENTS"
   Joint=1   U1=Yes   U2=Yes   U3=Yes   R1=Yes   R2=Yes   R3=Yes
TABLE:  "FRAME SECTION ASSIGNMENTS"
   Frame=1   SectionType=General   AutoSelect=N.A.   AnalSect=S   DesignSect=S   MatProp=Default
   Frame=2   SectionType=General   AutoSelect=N.A.   AnalSect=S   DesignSect=S   MatProp=Default
TABLE:  "FRAME AUTO MESH ASSIGNMENTS"
   Frame=1   AutoMesh=Yes   AtJoints=Yes   AtFrames=No   NumSegments=0   MaxLength=0   MaxDegrees=0
   Frame=2   AutoMesh=Yes   AtJoints=Yes   AtFrames=No   NumSegments=0   MaxLength=0   MaxDegrees=0
TABLE:  "FRAME LOADS - DISTRIBUTED"
   Frame=1   LoadPat=L   CoordSys=GLOBAL   Type=Force   Dir=X   DistType=RelDist   RelDistA=0   RelDistB=1   FOverLA=1   FOverLB=3
TABLE:  "JOINT LOADS - FORCE"
   Joint=4   LoadPat=L   CoordSys=GLOBAL   F1=0   F2=0   F3=${-P}   M1=0   M2=0   M3=0
END TABLE DATA
`;

export async function correr() {
  const mod = await empaquetar(`export { parseS2k } from "${R}/examples/src/shared/s2kParser";\n`, "s2kAutomesh");
  const fem = await cargarFem();
  const m = mod.parseS2k(S2K);
  const filas = [];
  const nb = m.elements.filter((e) => e.length === 2).length;
  filas.push({ que: "la columna se parte en el nudo 2 (2 barras → 3 elementos)", medido: nb, limite: 3, crudo: true, ok: nb === 3,
    detalle: m.elementNames.join(", ") });
  // solo la puntual, para el árbitro de la flecha
  const soloP = mod.parseS2k(S2K.replace(/   Frame=1   LoadPat=L.*\n/, ""));
  const d = fem.deform(soloP.nodes, soloP.elements, soloP.nodeInputs, soloP.elementInputs);
  const uz = d.deformations.get(soloP.nodeNameToIdx.get("4"))?.[2] ?? NaN;
  const EI = E * I, ref = -(P * Lv ** 3 / (3 * EI) + (P * Lv * h / EI) * Lv + P * h / (E * A));
  const err = Math.abs(uz - ref) / Math.abs(ref) * 100;
  filas.push({ que: "flecha de la punta del voladizo = analítica", medido: err, limite: 0.05,
    ok: err < 0.05, detalle: `Hekatan ${(uz * 1000).toFixed(4)} mm, analítica ${(ref * 1000).toFixed(4)} mm` });
  // la trapezoidal 1→3 kN/m sobre 4 m: 8 kN en X, repartida entre los dos trozos
  const d2 = fem.deform(m.nodes, m.elements, m.nodeInputs, m.elementInputs);
  let Rx = 0; for (const [, r] of d2.reactions) Rx += r[0];
  filas.push({ que: "ΣRx de la trapezoidal sobre la columna partida", medido: (-Rx).toFixed(6), limite: "8.000000", crudo: true,
    ok: Math.abs(-Rx - 8) < 1e-6, detalle: "∫(1..3 kN/m)·4 m = 8 kN" });
  return filas;
}
