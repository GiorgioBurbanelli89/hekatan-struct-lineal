#!/usr/bin/env node
/**
 * La convergencia de un banco ITW, en cuadros PNG y en GIF.
 *
 *   node cli/gif_itw_convergencia.mjs [ejemplo] [mallas separadas por coma]
 *   node cli/gif_itw_convergencia.mjs itw-test-4-hemisferio 4,6,8,10,12,14,16,20
 *
 * Por qué existe: un banco que **bloquea** da un número feo en malla gruesa, y
 * ese número solo no dice si el elemento está roto o si simplemente necesita
 * malla. Lo que lo distingue es la **serie**, y la serie se entiende mirándola.
 *
 * Sale:
 *   cli/shots/itw/<ejemplo>_NNN.png     ← los cuadros. MIRARLOS.
 *   cli/shots/itw/<ejemplo>.gif         ← la serie entera
 *   cli/shots/itw/<ejemplo>.txt         ← malla, δ y error, en texto
 *
 * El GIF es para el registro y para enseñarlo; **el juicio se hace sobre los
 * PNG**, que es donde se ve si dibujó.
 *
 * Mueve los parámetros por `window.__hekatanParams()` y vuelve a construir
 * con `window.__hekatanRebuild()`, o sea por el mismo camino que el usuario
 * cuando arrastra el slider — no por dentro del solver.
 */
import puppeteer from "puppeteer";
import { execFileSync } from "child_process";
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "itw");
mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };

const EJ = process.argv[2] || "itw-test-4-hemisferio";
const MALLAS = (process.argv[3] || "4,6,8,10,12,14,16,20")
  .split(",").map((s) => parseInt(s.trim(), 10)).filter(Boolean);

if (!existsSync(raiz)) {
  console.error(`no hay build en ${raiz} — corre antes:\n` +
    "  MSYS_NO_PATHCONV=1 DEPLOY_BASE=/hekatan-struct-lineal/ npm run build -w examples");
  process.exit(2);
}

const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => srv.listen(4704, r));

const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox",
         "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1200, height: 820 });
const errores = [];
pag.on("pageerror", (e) => errores.push(e.message));

await pag.goto(`http://localhost:4704${BASE}workspace/?t=${EJ}`,
               { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 9000));
await pag.keyboard.press("Escape");            // cierra la ayuda del CAD
// deformada encendida
await pag.evaluate(() => {
  const f = Array.from(document.querySelectorAll(".tp-lblv"))
    .find((x) => /Deformed shape|Deformada/i.test(x.textContent || ""));
  const c = f?.querySelector("input[type=checkbox]");
  if (c && !c.checked) c.click();
});

const lineas = [];
let k = 0;
for (const m of MALLAS) {
  const ok = await pag.evaluate((na, nb) => {
    const p = window.__hekatanParams?.();
    if (!p) return "sin __hekatanParams() — ¿build viejo?";
    // Los dos nombres que usan los ejemplos ITW para las divisiones.
    if ("na" in p) { p.na = na; p.nb = nb; }
    else if ("nx" in p) { p.nx = na; p.nz = nb; }
    else return "el ejemplo no tiene na/nb ni nx/nz";
    window.__hekatanRebuild?.();
    return "ok";
  }, m, m);
  if (ok !== "ok") { console.error(ok); break; }
  await new Promise((r) => setTimeout(r, 2200));

  // El número que el propio panel enseña, no uno recalculado aparte.
  const lab = await pag.evaluate(() => {
    const out = {};
    for (const f of document.querySelectorAll(".tp-lblv")) {
      const t = (f.querySelector(".tp-lblv_l")?.textContent || "").trim();
      const v = f.querySelector("input")?.value;
      if (t && v !== undefined) out[t] = v;
    }
    return out;
  });
  const d = lab["δ calculado"] ?? "?", e = lab["error"] ?? "?";
  lineas.push(`${String(m).padStart(2)}x${m}   δ = ${String(d).padEnd(14)} ${e}`);
  await pag.screenshot({ path: join(OUT, `${EJ}_${String(k).padStart(3, "0")}.png`) });
  console.log(`  ${lineas.at(-1)}`);
  k++;
}

writeFileSync(join(OUT, `${EJ}.txt`), lineas.join("\n") + "\n", "utf-8");
await nav.close();
srv.close();

if (errores.length) console.log(`\n⚠️ errores JS: ${errores.length} — ${errores[0].slice(0, 120)}`);
try {
  execFileSync("ffmpeg", ["-y", "-framerate", "1.2",
    "-i", join(OUT, `${EJ}_%03d.png`),
    "-vf", "scale=900:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse",
    join(OUT, `${EJ}.gif`)], { stdio: "pipe" });
  const sz = statSync(join(OUT, `${EJ}.gif`)).size;
  console.log(`\nlisto → cli/shots/itw/${EJ}.gif  (${(sz / 1024).toFixed(0)} KB)`);
} catch (e) {
  console.log("\n(sin ffmpeg: quedan los PNG, que es lo que se mira igualmente)");
}
console.log(`      cuadros → cli/shots/itw/${EJ}_*.png   ${k} cuadros`);
