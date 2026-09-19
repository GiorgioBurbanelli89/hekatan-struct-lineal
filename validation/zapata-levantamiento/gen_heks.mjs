/**
 * Escribe los .heks de la zapata excéntrica:
 *   zapata_6casos_n60.heks  una malla 60x60 (todas las huellas caen en ella) y 6 patrones E0..BI
 *   node validation/zapata-levantamiento/gen_heks.mjs
 */
import { writeFileSync } from "node:fs";
import { empaquetar, R } from "../../tests/lib/bundle.mjs";
const mod = await empaquetar(`export * from "${R}/examples/src/zapata-excentrica/zapataExcentrica";`, "zapexc-gen");
export const PATRONES = [["E0", 0, 0], ["E1_12", 1 / 12, 0], ["E1_6", 1 / 6, 0], ["E1_4", 0.25, 0], ["E1_3", 1 / 3, 0], ["BI", 0.25, 1 / 6]];
const t = mod.heksZapataExcentrica({ n: 60 }, PATRONES);
writeFileSync(new URL("./zapata_6casos_n60.heks", import.meta.url), t);
console.log("ok", t.split("\n").length, "líneas");
// Das 9.ª ed., ejemplo 6.10 (p. 247): el ejemplo de Struct
writeFileSync(new URL("./das_ej610.heks", import.meta.url), mod.heksZapataExcentrica(mod.DAS_EJ610, [["DAS", mod.DAS_EJ610.exL, mod.DAS_EJ610.eyB]]));
writeFileSync(new URL("../../examples/src/zapata-excentrica/das_ej610.heks", import.meta.url), mod.heksZapataExcentrica(mod.DAS_EJ610));
console.log("das", mod.zapataRigidaSinTraccion(mod.DAS_EJ610, 400), mod.areaEfectivaDas(1.5, 1.5, 0.15, 0.3));
