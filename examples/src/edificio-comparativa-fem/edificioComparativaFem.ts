/**
 * Edificio · Comparativa FEM cruzada
 *
 * Verificación cruzada del solver Hekatan contra otros 4 solvers FEM
 * (OpenSeesPy / OpenSees TCL / CalculiX / Code Aster). El propósito NO es
 * "validar" Hekatan contra un solver comercial, sino mostrar que el solver
 * de Hekatan converge a las mismas frecuencias modales que solvers
 * académicos open-source de uso generalizado en investigación sísmica.
 *
 * Modelo de prueba:
 *   • 4×4 columnas × 3 pisos
 *   • Vanos 5m × 5m
 *   • Altura piso 3m
 *   • Hormigón f'c=210 kg/cm² (E=21.5 GPa)
 *   • Columnas 0.40×0.40 m
 *   • Vigas 0.30×0.40 m
 *   • Losa 0.15 m (opcional)
 *
 * Resultados validados contra ETABS 22 + OpenSeesPy v3.5:
 *
 *   FRAME PURO (sin losa):
 *     T₁_OpenSeesPy = 0.3383 s (referencia)
 *     T₁_Hekatan    = 0.3496 s   →  Δ = +3.3%  ✓
 *     T₃_OpenSeesPy = 0.3111 s (torsional)
 *     T₃_Hekatan    = 0.3190 s   →  Δ = +2.5%  ✓
 *
 *   CON LOSA MEMBRANE + DIAFRAGMA SEMIRIGID:
 *     T₁_ETABS_Membrane = 0.6718 s
 *     T₁_OpenSees_Shell = 0.7437 s
 *
 * Validación detallada en `validation/python-etabs-verificado/`:
 *   - 13_ejecuta_los_3.py  (ETABS + OpenSeesPy)
 *   - TABLA_FINAL_VALIDACION.md
 */
import { edificioAporticado } from "../edificio-aporticado/edificioAporticado";
import type { ExampleDef } from "../workspace/exampleRegistry";

const base = edificioAporticado.params;
const params: typeof base = { ...base };

// Override defaults para que coincidan con el modelo de validación
params.nVanosX  = { ...base.nVanosX,  default: 3 };
params.nVanosY  = { ...base.nVanosY,  default: 3 };
params.nPisos   = { ...base.nPisos,   default: 3 };
params.spanX    = { ...base.spanX,    default: 5.0 };
params.spanY    = { ...base.spanY,    default: 5.0 };
params.hPiso    = { ...base.hPiso,    default: 3.0 };
params.fcConcr  = { ...base.fcConcr,  default: 210 };
params.colSize  = { ...base.colSize,  default: 0.40 };
params.vigaB    = { ...base.vigaB,    default: 0.30 };
params.vigaH    = { ...base.vigaH,    default: 0.40 };
params.matCol   = { ...base.matCol,   default: 0 };  // Hormigón
params.matViga  = { ...base.matViga,  default: 0 };
params.slabT    = { ...base.slabT,    default: 0.15 };
params.slabOn   = { ...base.slabOn,   default: 0 };  // Default OFF (frame puro = caso baseline)

export const edificioComparativaFem: ExampleDef = {
  id: "edificio-comparativa-fem",
  name: "Edificio · Comparativa FEM cruzada",
  category: "1️⃣ Frames · 🎯 n GDL Sistemas",
  benchmark: true,  // 🏁 Comparativa cruzada Hekatan vs OpenSees / CalculiX / Code Aster
  defaultShellResult: "vonMises",
  availableShellResults: [
    "none", "pressure",
    "membraneXX", "membraneYY", "membraneXY",
    "membranePrincipalMax", "membranePrincipalMin", "vonMises",
    "tranverseShearX", "tranverseShearY", "transverseShearMax",
    "bendingXX", "bendingYY", "bendingXY",
    "bendingPrincipalMax", "bendingPrincipalMin",
    "displacementX", "displacementY", "displacementZ",
  ],
  hasModal: true,
  params,
  build: edificioAporticado.build,
  runModal: edificioAporticado.runModal,
  computedLabels: (p, states) => {
    const base = edificioAporticado.computedLabels?.(p, states) ?? {};
    return {
      ...base,
      "── 🧪 TEST · Comparación 5 solvers · 5 configuraciones ──": "",
      "📐 Modelo": "4×4 cols × 3 pisos · Vanos 5m · h=3m · f'c=210",

      "── A. FRAME PURO ──": "",
      "A · Hekatan T₁": "0.3496 s",
      "A · OpenSeesPy T₁": "0.3383 s · Δ −3.2%",
      "A · OpenSees TCL T₁": "0.3383 s (idem solver)",
      "A · ETABS 22 T₁": "≈ 0.34 s",
      "A · CalculiX T₁": "TBD (.inp generado)",
      "A · Code Aster T₁": "TBD (.comm generado)",

      "── B. + LOSA Membrane ──": "",
      "B · OpenSeesPy ShellMITC4 T₁": "0.2909 s (full shell, +bending)",
      "B · ETABS Membrane Slab T₁": "0.6718 s (referencia)",
      "B · ETABS ShellThin SemiR T₁": "0.6179 s",
      "B · ETABS ShellThin Rigid T₁": "0.6178 s",
      "B · Hekatan Memb sin cracked": "0.5044 s · -25% (más rígido)",
      "B · Hekatan Memb + Cracked": "0.7329 s · +9.1% ✅ (ETABS-like)",
      "B · ✓ Receta Hekatan=ETABS": "slabType=Membrane + cracked=On",

      "── C. + LOSA + 2 MUROS perimet. ──": "",
      "C · OpenSeesPy T₁": "0.1731 s · T₂=0.050 (muros rigidizan Y)",
      "C · ETABS 2 muros P1/P2": "0.4134 s / T₂=0.1861",
      "C · Hekatan T₁": "TBD (bracesMode=perimetrales)",

      "── D. + DIAGONALES fachadas ──": "",
      "D · OpenSeesPy T₁": "0.3447 s · T₂=0.240 (X-bracing)",
      "D · ETABS X-bracing": "TBD",
      "D · Hekatan T₁": "TBD (bracesMode=todas)",

      "── E. MIXTO (losa+muros+diag) ──": "",
      "E · OpenSeesPy T₁": "0.1740 s · T₂=0.049",
      "E · ETABS Mixto": "TBD",
      "E · Hekatan Mixto T₁": "TBD",

      "── DICTAMEN ──": "",
      "✓ Frame puro Hekatan↔OpenSees": "3.3% (VALIDADO)",
      "✓ Memb+Cracked Hekatan↔ETABS": "9.1% (VALIDADO)",
      "✓ ASCE 7-22 §12.9.1.1": "≥90% Σ MPF X+Y al modo 6-10",
      "✓ CSI Manual §4.12 W/g": "Bug masa corregido",
      "📋 Receta para coincidir ETABS": "Membrane + Cracked + Self-weight",
      "→ Próximo": "ejecutar Hekatan con muros + diagonales",
    };
  },
  dynamicParams: edificioAporticado.dynamicParams,
};
