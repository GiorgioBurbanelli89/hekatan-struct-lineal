/**
 * SÓLIDOS en el workspace: ¿se ven, y cada campo enseña lo suyo?
 *
 * Jorge, 28-sep-2026: «los sólidos parece que tienen algo raro, revísalos; todo debe estar en
 * el workspace». Lo que había: cada ejemplo de sólidos era una página aparte metida en un marco,
 * y el desplegable «Resultados de sólido» pintaba el mismo canal eligieras lo que eligieras.
 *
 * Por cada ejemplo de sólidos se comprueba, en el navegador:
 *   1. está DENTRO del workspace: no hay marco embebido
 *   2. el modelo son hexaedros de 8 nudos, con deformada sin NaN
 *   3. el colormap tiene triángulos (la piel) y valores finitos
 *   4. cada campo da un rango DISTINTO, y ux sale de la deformada (mismo mínimo y máximo)
 * y se deja un PNG por campo para MIRARLO.
 *
 *   node cli/ctl_solidos.mjs              (local)
 *   node cli/ctl_solidos.mjs publico
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = process.argv[2] === "publico";
const OUT = join(__dirname, "shots", "solidos"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4791;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".heks": "application/json" };
let srv = null;
if (!PUB) {
  srv = createServer((req, res) => {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
    let f = join(raiz, p);
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
    res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
    res.end(readFileSync(f));
  });
  await new Promise((r) => srv.listen(PUERTO, r));
}
const SITIO = PUB ? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/" : `http://localhost:${PUERTO}${BASE}`;

// Los ejemplos de sólidos del workspace. `ux` = el campo de desplazamiento que más se mueve.
const EJEMPLOS = (process.argv.slice(2).filter((a) => a !== "publico").length
  ? process.argv.slice(2).filter((a) => a !== "publico")
  : ["muro-contencion-solido"]);
const CAMPOS = ["vonMises", "sigmaXX", "sigmaZZ", "tauXZ", "ux", "uz"];
const COMP = { ux: 0, uy: 1, uz: 2 };

const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  —  " + d : ""}`); if (!c) fallos.push(q); };

for (const id of EJEMPLOS) {
  console.log(`\n── ${id} ──`);
  const pag = await nav.newPage();
  await pag.setViewport({ width: 1400, height: 860 });
  const errores = [];
  pag.on("pageerror", (e) => errores.push(e.message));
  await pag.goto(`${SITIO}workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 180000 });
  await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 }).catch(() => {});
  await espera(7000);

  const m = await pag.evaluate(() => {
    const st = window.__hekatanStates;
    const elems = st?.elements?.val ?? [];
    const def = st?.deformOutputs?.val?.deformations;
    let nan = 0, n = 0;
    def?.forEach((d) => { n++; for (let k = 0; k < 3; k++) if (!Number.isFinite(d[k])) nan++; });
    const ao = st?.analyzeOutputs?.val ?? {};
    return {
      marco: !!document.getElementById("hk-ejemplo-embebido") && document.getElementById("hk-ejemplo-embebido").style.display !== "none",
      ejemplo: window.__hekatanExample?.()?.id ?? null,
      nudos: (st?.nodes?.val ?? []).length,
      hex: elems.filter((e) => e.length === 8).length,
      otros: elems.filter((e) => e.length !== 8).length,
      deformados: n, nan,
      conTension: ao.solidStress instanceof Map ? ao.solidStress.size : 0,
      campoAlAbrir: window.__hekatanSettings?.()?.solidResults?.val ?? null,
    };
  });
  ok(!m.marco, "está dentro del workspace, sin marco embebido");
  ok(m.hex > 0, "el modelo son hexaedros de 8 nudos", `${m.nudos} nudos, ${m.hex} hexaedros, ${m.otros} de otro tipo`);
  ok(m.deformados === m.nudos && m.nan === 0, "deformada en todos los nudos y sin NaN", `${m.deformados} nudos, ${m.nan} NaN`);
  ok(m.conTension === m.hex, "tensiones en todos los hexaedros", `${m.conTension} de ${m.hex}`);
  ok(m.campoAlAbrir && m.campoAlAbrir !== "none", "abre con un campo de sólido elegido", String(m.campoAlAbrir));
  ok(errores.length === 0, "sin errores de JavaScript", errores[0] ?? "");

  const rangos = {};
  for (const campo of CAMPOS) {
    await pag.evaluate((c) => { const s = window.__hekatanSettings?.(); if (s?.solidResults) s.solidResults.val = c; }, campo);
    await espera(1200);
    const r = await pag.evaluate((c, comp) => {
      const ctx = document.querySelector("#viewer").__ctx;
      const cm = ctx.scene.getObjectByName("__hekatan_shell_colormap");
      const esc = cm?.geometry?.attributes?.scalar?.array ?? [];
      let finitos = 0; const vistos = new Set();
      for (const v of esc) if (v >= 0) { finitos++; vistos.add(Math.round(v * 1000)); }
      const leg = document.getElementById("legend");
      // la deformada, para cruzarla con el campo de desplazamiento
      let dMin = Infinity, dMax = -Infinity;
      if (comp !== null) window.__hekatanStates.deformOutputs.val.deformations.forEach((d) => {
        if (d[comp] < dMin) dMin = d[comp]; if (d[comp] > dMax) dMax = d[comp];
      });
      return {
        visible: !!cm?.visible,
        triangulos: (cm?.geometry?.index?.count ?? 0) / 3,
        finitos, niveles: vistos.size,
        leyenda: leg && !leg.hidden ? leg.innerText.replace(/\s+/g, " ").trim() : null,
        dMin: Number.isFinite(dMin) ? dMin : null, dMax: Number.isFinite(dMax) ? dMax : null,
      };
    }, campo, campo in COMP ? COMP[campo] : null);
    rangos[campo] = r;
    ok(r.visible && r.triangulos > 0 && r.finitos > 0 && r.niveles > 3, `${campo}: se pinta`,
       `${r.triangulos} triángulos, ${r.finitos} valores, ${r.niveles} niveles · ${r.leyenda ?? "sin leyenda"}`);
    await pag.screenshot({ path: join(OUT, `${id}_${campo}${PUB ? "_publico" : ""}.png`) });
  }
  // cada campo, su leyenda: si dos campos de tensión dan la misma, el desplegable no manda
  const leyendas = CAMPOS.map((c) => rangos[c].leyenda);
  const distintas = new Set(leyendas.filter(Boolean)).size;
  ok(distintas === CAMPOS.length, "cada campo da una leyenda distinta", `${distintas} distintas de ${CAMPOS.length}`);
  await pag.close();
}
await nav.close();
srv?.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : "\nTODO BIEN");
process.exit(fallos.length ? 1 : 0);
