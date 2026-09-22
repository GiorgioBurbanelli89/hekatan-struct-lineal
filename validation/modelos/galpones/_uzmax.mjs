import { resolverHeks } from "../../../tests/lib/heks.mjs";
const ol = console.log; console.log = () => {};
const H = await resolverHeks(process.argv[2]); console.log = ol;
let mx = 0; for (const v of H.deformOutputs.deformations.values()) mx = Math.max(mx, Math.hypot(v[0], v[1], v[2]));
console.log(process.argv[2].split("/").pop(), "|u|max mm", (mx * 1000).toFixed(4));
