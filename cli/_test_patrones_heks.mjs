import { resolverHeks } from "../tests/lib/heks.mjs";
const uz = async (f) => { globalThis.__hekatanFactoresPatron = f; const H = await resolverHeks("cli/shots/casos_combo/viga_dead_live.heks"); return H.deformOutputs.deformations.get(2)[2]; };
const ol = console.log; console.log = () => {};
const D = await uz({ Dead: 1 }), L = await uz({ Live: 1 }), C = await uz({ Dead: 1.2, Live: 1.6 }), T = await uz(undefined);
console.log = ol;
console.log(JSON.stringify({ Dead_mm: D * 1000, Live_mm: L * 1000, combo_1_2D_1_6L_mm: C * 1000, esperado_mm: (1.2 * D + 1.6 * L) * 1000, sin_factores_mm: T * 1000, D_mas_L_mm: (D + L) * 1000 }));
console.log("superposicion OK:", Math.abs(C - (1.2 * D + 1.6 * L)) < 1e-12, "· sin factores = D+L:", Math.abs(T - (D + L)) < 1e-12, "· Live distinto de Dead:", Math.abs(L - D) > 1e-9);
