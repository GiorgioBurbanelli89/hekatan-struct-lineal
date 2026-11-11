#!/usr/bin/env node
/**
 * Prueba el MCP de verdad: arranca `server.mjs` como lo arranca Claude (stdio) y le hace
 * las llamadas de un guion JSON. Sirve para probar herramientas nuevas sin reiniciar la sesión.
 *
 *   node mcp/llamar.mjs guion.json carpeta_png
 *   guion = [ { "tool": "abrir", "args": { "ejemplo": "new-blank" } }, { "tool": "captura" }, ... ]
 *
 * Imprime el texto de cada respuesta; las imágenes van a carpeta_png/NN_<tool>.png.
 * HEKATAN_URL por defecto = http://localhost:4600/workspace/ (Vite local).
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import fs from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const [, , guionArg, outDir = "mcp_png"] = process.argv;
const guion = JSON.parse(fs.readFileSync(guionArg, "utf8"));
fs.mkdirSync(outDir, { recursive: true });
const aqui = dirname(fileURLToPath(import.meta.url));
const t = new StdioClientTransport({ command: process.execPath, args: [join(aqui, "server.mjs")],
  env: { ...process.env, HEKATAN_URL: process.env.HEKATAN_URL || "http://localhost:4600/workspace/" } });
const c = new Client({ name: "probar", version: "1" });
await c.connect(t);
let i = 0;
for (const paso of guion) {
  i++;
  const t0 = Date.now();
  let r;
  try { r = await c.callTool({ name: paso.tool, arguments: paso.args || {} }, undefined, { timeout: 600000 }); }
  catch (e) { console.log(`#${i} ${paso.tool} EXCEPCIÓN ${e.message}`); continue; }
  for (const it of r.content || []) {
    if (it.type === "image") {
      const f = join(outDir, `${String(i).padStart(2, "0")}_${paso.nombre || paso.tool}.png`);
      fs.writeFileSync(f, Buffer.from(it.data, "base64"));
      console.log(`#${i} ${paso.tool} → ${f}`);
    } else if (process.env.COMPACTO) {
      fs.writeFileSync(join(outDir, `${String(i).padStart(2, "0")}_${paso.nombre || paso.tool}.txt`), it.text || "");
      let j = null; try { j = JSON.parse(it.text); } catch {}
      const cab = `#${i} ${paso.tool}${r.isError ? " ERROR" : ""} ${paso.nombre ? "[" + paso.nombre + "]" : JSON.stringify(paso.args || {}).slice(0, 90)}`;
      if (j && j.pasos) {
        console.log(`${cab} ok=${j.ok} creado=${JSON.stringify(j.creado)} faltan=${JSON.stringify(j.puntos_que_no_estan)}`);
        for (const p of j.pasos) console.log("    " + (typeof p === "string" ? p : `${JSON.stringify(p.pedido)} → ${JSON.stringify(p.creado)} desvío ${p.desvio} ${p.via}${p.aviso ? " ⚠ " + p.aviso.slice(0, 70) : ""}`));
        console.log("    cmd: " + (j.ventana_de_comandos || []).join(" | ").slice(0, 250));
      } else console.log(`${cab}\n    ${(it.text || "").replace(/\s+/g, " ").slice(0, 400)}`);
    } else console.log(`#${i} ${paso.tool}${r.isError ? " ERROR" : ""} (${Date.now() - t0} ms) ${paso.nombre ? "[" + paso.nombre + "] " : ""}${JSON.stringify(paso.args || {})}\n${it.text}`);
  }
}
await c.close();
process.exit(0);
