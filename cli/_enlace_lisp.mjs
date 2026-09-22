// Mete una hoja .lisp dentro de un enlace de Hekatan LISP web (deflate-raw + base64url),
// igual que el boton «Compartir» de la web.  node cli/_enlace_lisp.mjs hoja.lisp [solo]
import fs from "fs";
import zlib from "zlib";
const t = fs.readFileSync(process.argv[2]);
const b = zlib.deflateRawSync(t, { level: 9 });
const h = b.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const extra = process.argv[3] === "solo" ? "&solo=1" : "";
console.log("https://giorgioburbanelli89.github.io/hekatan-lisp/#h=" + h + extra);
console.error("caracteres del enlace:", h.length);
