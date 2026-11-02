/**
 * Test rápido roundtrip F2K: parsea el archivo del usuario y reporta lo extraído.
 * Uso: node test_f2k_roundtrip.mjs
 */
import { readFileSync } from "fs";
import { parseZapataF2k } from "./f2kImporter.ts";

const path = (process.env.USERPROFILE ?? "") + "\\Documents\\Zapata aislada.f2k";
const text = readFileSync(path, "utf8");
const params = parseZapataF2k(text);
console.log("Parsed F2K params:");
console.log(JSON.stringify(params, null, 2));
