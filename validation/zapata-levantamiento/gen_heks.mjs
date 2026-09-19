/**
 * Escribe los .heks de la zapata excéntrica:
 *   zapata_6casos_n60.heks  una malla 60x60 (todas las huellas caen en ella) y 6 patrones E0..BI
 *   ../../examples/src/zapata-excentrica/zapata_excentrica.heks  el del ejemplo (e/L = 1/4, n = 40)
 *   node validation/zapata-levantamiento/gen_heks.mjs
 */
import { writeFileSync } from "node:fs";
import { empaquetar, R } from "../../tests/lib/bundle.mjs";
const mod = await empaquetar(`export * from "${R}/examples/src/zapata-excentrica/zapataExcentrica";`, "zapexc-gen");
export const PATRONES = [["E0", 0, 0], ["E1_12", 1 / 12, 0], ["E1_6", 1 / 6, 0], ["E1_4", 0.25, 0], ["E1_3", 1 / 3, 0], ["BI", 0.25, 1 / 6]];
const t = mod.heksZapataExcentrica({ n: 60 }, PATRONES);
writeFileSync(new URL("./zapata_6casos_n60.heks", import.meta.url), t);
writeFileSync(new URL("../../examples/src/zapata-excentrica/zapata_excentrica.heks", import.meta.url), mod.heksZapataExcentrica({ n: 40, exL: 0.25 }));
console.log("ok", t.split("\n").length, "líneas");
