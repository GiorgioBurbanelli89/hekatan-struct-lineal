import { resolverHeks } from "../tests/lib/heks.mjs";
const H = await resolverHeks(process.argv[2]);
const U = H.deformOutputs.deformations, R = H.deformOutputs.reactions;
const ei = H.elementInputs ?? H.states?.elementInputs?.val;
for (const [i, t] of ei.thicknesses) console.log("shell", i, "t", t, "rho", ei.densities.get(i).toFixed(6), "pf", ei.plateFormulations?.get(i), "bend", ei.bendingModifiers?.get(i), "deck", !!ei.deckSections?.get(i));
const cargados = [1, 2, 5, 6, 9, 10]; // idx de nodos 2,3,6,7,10,11
for (const k of cargados) console.log("nodo", k + 1, "ux mm", (U.get(k)[0] * 1000).toFixed(6));
let fz = 0; for (const [k, r] of R) if (k < 4) fz += r[2];
console.log("Fz reacciones panel 1 (kN):", fz.toFixed(4));
