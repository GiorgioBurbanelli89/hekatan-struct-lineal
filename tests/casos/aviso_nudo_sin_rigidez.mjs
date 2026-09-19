/**
 * Un nudo con carga que NO pertenece a ningún frame/shell/sólido/muelle/apoyo
 * queda con la diagonal de K en CERO: `getZerosIndices` (deform.cpp) lo saca
 * del sistema y la carga desaparece SIN AVISO. Así se coló el bug real del
 * radier_dne.heks (hallazgo del agente de diseño, commit d676553d7, 19-sep-2026):
 * 7 nudos colgados de `edge lineal` — que este motor todavía no ata
 * (`EDGE_LINEAL_EN_MOTOR = false` en cliModeler.ts) — se tragaban 1348 kN de
 * Dead, 653 de DNE y 355 de Live sin una sola línea en la consola.
 *
 * Este caso NO reproduce la geometría de `edge` (eso ya lo prueba el propio
 * radier_dne.heks): monta el caso MÍNIMO — un nudo suelto con una carga — y
 * exige que `cliModeler` lo detecte ANTES de resolver, lo reporte en
 * `window.__hekatanCliNudosSinRigidez` y en `window.__hekatanCliErrors`, y que
 * el desequilibrio Σcargas/Σreacciones resultante también se avise (> 0.1 %).
 *
 * Y al revés: un modelo SIN nudos sueltos no debe disparar ningún aviso — si
 * el detector fuera demasiado ancho (falso positivo), este caso lo agarra.
 */
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolverHeks } from "../lib/heks.mjs";

const P = 50; // kN, carga en el nudo suelto

function guionConNudoSuelto() {
  return [
    "node 1 0 0 0",
    "node 2 4 0 0",
    "node 3 4 4 0",
    "node 4 0 4 0",
    "node 99 2 2 0",  // nudo SUELTO: no aparece en ningun frame/shell/solido/muelle
    "support 1 fixed",
    "support 2 fixed",
    "support 3 fixed",
    "support 4 fixed",
    "shell 1 1 2 3 4 0.20 25e6",
    "load 4 0 0 -10",            // carga normal, en un nudo CON rigidez
    // `load` no admite comentario `#` en la misma linea (solo `support` lo filtra
    // hoy) — el 8vo token se leeria como nombre de PATRON. Comentario aparte.
    `load 99 0 0 -${P}`,          // esta se pierde si nadie avisa
    "solve",
  ].join("\n") + "\n";
}

function guionSano() {
  return [
    "node 1 0 0 0",
    "node 2 4 0 0",
    "node 3 4 4 0",
    "node 4 0 4 0",
    "support 1 fixed",
    "support 2 fixed",
    "support 3 fixed",
    "support 4 fixed",
    "shell 1 1 2 3 4 0.20 25e6",
    "load 4 0 0 -10",
    "solve",
  ].join("\n") + "\n";
}

export const nombre = "aviso-nudo-sin-rigidez";
export const descripcion =
  "Carga en un nudo sin rigidez: cliModeler tiene que avisarlo (nudo, kN perdidos, desequilibrio) — no perderla en silencio";

export async function correr() {
  const dir = mkdtempSync(join(tmpdir(), "hkAvisoRigidez-"));
  const filas = [];

  // ── caso ROTO: nudo 99 suelto, con carga ──────────────────────────────
  // (`resolverHeks` arma su propio `globalThis.window` en cada llamada; se lee
  // DESPUES de resolver, con el mismo objeto que dejó `cliModeler.build`.)
  const rutaRoto = join(dir, "roto.heks");
  writeFileSync(rutaRoto, guionConNudoSuelto(), "utf-8");
  await resolverHeks(rutaRoto);
  const avisoRigidez = globalThis.window.__hekatanCliNudosSinRigidez;
  const errores = globalThis.window.__hekatanCliErrors ?? [];
  const equilibrio = globalThis.window.__hekatanCliEquilibrio;

  filas.push({
    que: "detecta el nudo 99 (suelto) como sin rigidez",
    medido: avisoRigidez?.nudos?.includes(99) ? 1 : 0, limite: 1,
    ok: !!avisoRigidez?.nudos?.includes(99),
    detalle: `nudos reportados: ${JSON.stringify(avisoRigidez?.nudos ?? [])}`,
  });

  const perdidoFz = Math.abs(avisoRigidez?.perdidaPorPatron?.Dead?.[2] ?? 0);
  filas.push({
    que: `Fz perdido en Dead = ${P} kN (el que se aplicó al nudo 99)`,
    medido: Math.abs(perdidoFz - P), limite: 1e-6,
    ok: Math.abs(perdidoFz - P) < 1e-6,
    detalle: `perdidoFz=${perdidoFz}`,
  });

  const hayAvisoEnErrores = errores.some((e) => /sin rigidez/i.test(e));
  filas.push({
    que: "el aviso queda en window.__hekatanCliErrors (ventana de comandos)",
    medido: hayAvisoEnErrores ? 1 : 0, limite: 1,
    ok: hayAvisoEnErrores,
    detalle: errores.join(" | ").slice(0, 200),
  });

  filas.push({
    que: "el desequilibrio Σcargas/Σreacciones también se avisa (> 0.1 %)",
    medido: equilibrio?.pctErr ?? 0, limite: Infinity,
    ok: (equilibrio?.pctErr ?? 0) > 0.1,
    detalle: `pctErr=${equilibrio?.pctErr}, ΣcargasFz=${equilibrio?.sumCargasFz}, ΣreaccionesFz=${equilibrio?.sumReaccionesFz}`,
  });

  // ── caso SANO: mismo modelo sin el nudo suelto — CERO avisos ──────────
  const rutaSano = join(dir, "sano.heks");
  writeFileSync(rutaSano, guionSano(), "utf-8");
  await resolverHeks(rutaSano);
  const avisoSano = globalThis.window.__hekatanCliNudosSinRigidez;
  const erroresSano = (globalThis.window.__hekatanCliErrors ?? []).filter((e) => /sin rigidez|Equilibrio/i.test(e));

  filas.push({
    que: "un modelo SANO (sin nudos sueltos) no dispara el aviso — sin falsos positivos",
    medido: avisoSano ? 1 : 0, limite: 0,
    ok: avisoSano === null && erroresSano.length === 0,
    detalle: `avisoSano=${JSON.stringify(avisoSano)}, erroresSano=${JSON.stringify(erroresSano)}`,
  });

  return filas;
}
