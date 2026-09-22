/**
 * TEST COMPLETO: abre TODOS los ejemplos del workspace y comprueba que
 *
 *   1. carga sin errores de JS
 *   2. hay modelo (nudos y elementos)
 *   3. el desplegable de resultados de cascara ofrece TODOS los campos,
 *      con M12 (la torsion) entre ellos
 *   4. deja un PNG de cada uno para MIRARLO
 *
 *   node cli/test_todos_ejemplos.mjs                  # todos, contra el dev local
 *   node cli/test_todos_ejemplos.mjs --deploy         # contra GitHub Pages
 *   node cli/test_todos_ejemplos.mjs galpon plantillas  # solo esos
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const deploy = args.includes("--deploy");
const soloEstos = args.filter((a) => !a.startsWith("--"));
const BASE = deploy
  ? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/"
  : "http://localhost:4600/workspace/";

const SALIDA = "cli/shots/test_ejemplos";
fs.mkdirSync(SALIDA, { recursive: true });

// los campos que el visor tiene que ofrecer SIEMPRE que haya cascaras
const ESPERADOS = ["M11", "M22", "M12", "F11", "F22", "F12", "FVM", "Uz"];

let ids = fs.readFileSync("cli/shots/deploy/_ids.txt", "utf8").split(/\r?\n/).filter(Boolean);
if (soloEstos.length) ids = ids.filter((i) => soloEstos.some((s) => i.includes(s)));

const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const filas = [];

for (const id of ids) {
  const p = await b.newPage();
  await p.setViewport({ width: 1400, height: 900 });
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
  p.on("console", (m) => { if (m.type() === "error" && !/favicon/.test(m.text())) errs.push(m.text().slice(0, 120)); });

  let r = { id, nudos: 0, elems: 0, campos: 0, faltan: [], errs: [], abrio: false };
  try {
    await p.goto(BASE + "?t=" + encodeURIComponent(id), { waitUntil: "networkidle0", timeout: 60000 });
    // se espera al MODELO, no a un tiempo fijo
    await p.waitForFunction(
      () => {
        const s = window.__hekatanStates;
        return s && s.nodes && s.nodes.val && s.nodes.val.length > 0;
      },
      { timeout: 45000 }
    ).catch(() => {});
    await new Promise((x) => setTimeout(x, 1500));

    r = await p.evaluate((esperados) => {
      const s = window.__hekatanStates;
      const nudos = s?.nodes?.val?.length ?? 0;
      const elems = s?.elements?.val?.length ?? 0;
      // el <select> de cascara es el unico que tiene la opcion "M11"
      const selects = [...document.querySelectorAll("select")];
      const shell = selects.find((x) => [...x.options].some((o) => o.value === "M11"));
      const visibles = shell
        ? [...shell.options].filter((o) => o.style.display !== "none" && !o.hidden).map((o) => o.value)
        : [];
      const hayCascaras = (s?.elements?.val ?? []).some((e) => e.length >= 3);
      return {
        nudos, elems, hayCascaras,
        campos: visibles.length,
        faltan: hayCascaras ? esperados.filter((e) => !visibles.includes(e)) : [],
        abrio: true,
      };
    }, ESPERADOS);
    r.id = id;
    r.errs = errs.slice(0, 2);
    await p.screenshot({ path: `${SALIDA}/${id}.png` });
  } catch (e) {
    r.errs = [String(e).slice(0, 110)];
  }
  filas.push(r);
  const mal = r.errs.length || !r.nudos || r.faltan.length;
  console.log(
    (mal ? "FALLA " : "  ok  ") + id.padEnd(34) +
    String(r.nudos).padStart(5) + " nudos " + String(r.elems).padStart(5) + " elem " +
    String(r.campos).padStart(3) + " campos" +
    (r.faltan.length ? "  FALTAN: " + r.faltan.join(",") : "") +
    (r.errs.length ? "  ERR: " + r.errs[0] : "")
  );
  await p.close();
}
await b.close();

const fallan = filas.filter((f) => f.errs.length || !f.nudos || f.faltan.length);
console.log("\n=======================================");
console.log(`${filas.length - fallan.length} de ${filas.length} bien · PNG en ${SALIDA}/`);
if (fallan.length) {
  console.log(`\n${fallan.length} con problema:`);
  fallan.forEach((f) => console.log("  ·", f.id, f.faltan.length ? "faltan " + f.faltan.join(",") : (f.nudos ? f.errs[0] : "sin modelo")));
}
fs.writeFileSync(`${SALIDA}/_informe.json`, JSON.stringify(filas, null, 1));
process.exit(fallan.length ? 1 : 0);
