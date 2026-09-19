#!/usr/bin/env node
/**
 * Regenera `cli/shots/deploy/_ids.txt` DESDE EL REGISTRO del workspace.
 *
 *     node cli/gen_ids_deploy.mjs           (escribe el fichero)
 *     node cli/gen_ids_deploy.mjs --ver     (solo enseña qué cambiaría)
 *
 * POR QUÉ (18-sep-2026): ese fichero se escribió UNA vez a mano el 9-sep
 * (commit 5c6d1fbc3) y nunca más. Medido con `check_animacion_modal.mjs`: de sus
 * 140 líneas, **37 no son ejemplos del workspace** y `?t=<id>` no carga ninguna —
 * son órdenes del CAD (`talud`, `puente`, `eiffel`, `burj`, `opera`, `muro-q4`…),
 * capítulos de los tutoriales (`intro_fem`, `stiffness_bar`, `shell_q4`…), capas
 * del dibujo (`1st-floor`) o páginas sueltas (`workspace_existent`). Un barrido
 * contra esa lista se pasa minutos abriendo páginas que no existen y, lo peor,
 * NO mira los ejemplos que sí están y no figuran en ella.
 *
 * La lista sana es la del registro, que es la única verdad de qué carga `?t=`:
 * se lee `window.__hekatanExamples` del bundle local. Los ids sueltos que no son
 * ejemplos se prueban con sus propios arneses (`ctl_deploy_cad`, tutoriales), no con éste.
 *
 * ⚠️ Necesita el bundle: npm run build:deploy
 */
import { abrirVisor, hayBundle } from "../tests/lib/visor_modal.mjs";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const AQUI = dirname(fileURLToPath(import.meta.url));
const SALIDA = join(AQUI, "shots", "deploy", "_ids.txt");
const SOLO_VER = process.argv.includes("--ver");

if (!hayBundle()) { console.error("no hay bundle: npm run build:deploy"); process.exit(2); }

const v = await abrirVisor({ puerto: 4797 });
let registro;
try {
  await v.pag.goto(v.url("workspace/?t=plantillas"), { waitUntil: "domcontentloaded", timeout: 180000 }).catch(() => {});
  await v.pag.waitForFunction(() => Array.isArray(window.__hekatanExamples), { timeout: 120000 });
  registro = await v.pag.evaluate(() => window.__hekatanExamples);
} finally { await v.cerrar(); }

const nuevos = registro.map((e) => e.id).sort();
const viejos = existsSync(SALIDA)
  ? readFileSync(SALIDA, "utf8").split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
  : [];
const fuera = viejos.filter((id) => !nuevos.includes(id));
const entran = nuevos.filter((id) => !viejos.includes(id));

console.log(`registro: ${nuevos.length} ejemplos  ·  fichero viejo: ${viejos.length} líneas`);
console.log(`SALEN (${fuera.length}, no son ejemplos del workspace): ${fuera.join(", ") || "—"}`);
console.log(`ENTRAN (${entran.length}, ejemplos que faltaban): ${entran.join(", ") || "—"}`);
console.log(`con modal: ${registro.filter((e) => e.hasModal).length}`);

if (SOLO_VER) { console.log("\n(--ver: no se escribió nada)"); process.exit(0); }
writeFileSync(SALIDA, nuevos.join("\n") + "\n");
console.log(`\nescrito ${SALIDA} con ${nuevos.length} ids`);
