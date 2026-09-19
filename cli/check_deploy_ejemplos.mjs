// Abre ejemplos del deploy PUBLICO y COMPRUEBA UN NUMERO. No solo que no reviente.
//
//   node cli/check_deploy_ejemplos.mjs [--local] [--sellar] [id ...]
//
// Hasta el 18-sep-2026 esto aprobaba con `errs.length === 0 && info.canvas`: no
// leia ni un numero. Con 229 `catch {}` vacios en el arbol TS, cualquier fallo de
// calculo se convertia en `pageerror: 0` y el test pasaba. Es el criterio con el
// que el bug de la deformada estuvo meses sin que saltara nada.
//
// Ahora, por cada id, se comprueban DOS cosas:
//
//  1. EQUILIBRIO, contra la carga realmente aplicada. No es "SRz = carga total":
//     `deform` calcula la reaccion como R = K*u, asi que la carga que cae SOBRE
//     un nudo con apoyo se va al suelo y nunca aparece en la reaccion
//     (medido en el galpon el 9-ago-2026). El invariante que SI se cumple es
//
//         SRz  +  S(Fz de los nudos LIBRES en Z)  =  0
//
//     Se compara con tolerancia relativa. Un solver que no equilibra, un modelo
//     con nudos huerfanos o unas cargas que no llegaron se ven aqui.
//
//  2. REGRESION contra un valor GUARDADO por id (`cli/shots/deploy/_esperado.json`):
//     numero de nudos, numero de elementos y FLECHA MAXIMA |uz|. Si el ejemplo
//     cambia de resultado, el chequeo FALLA y hay que mirar por que — no se sube
//     el limite, se explica el cambio y se vuelve a sellar a mano con `--sellar`.
//
// Sale con codigo 1 si algo no cuadra.
import puppeteer from "puppeteer";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const LOCAL = args.includes("--local");
const SELLAR = args.includes("--sellar");
const ids = args.filter((a) => !a.startsWith("--"));
const IDS = ids.length ? ids
  : ["plantillas", "edificio-aporticado", "mezanine", "galpon", "zapata-aislada", "cli-modeler"];

const BASE = LOCAL
  ? "http://localhost:4600/workspace/"
  : "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/";

// Tolerancias. El equilibrio es una identidad algebraica: se le deja 0.5 % por
// el redondeo del solver iterativo en modelos grandes, no mas.
const TOL_EQUILIBRIO = 0.005;   // 0.5 % de la carga aplicada en nudos libres
const TOL_FLECHA     = 0.01;    // 1 % contra el valor sellado

const ESPERADO = "cli/shots/deploy/_esperado.json";
mkdirSync("cli/shots/deploy", { recursive: true });
const esperado = existsSync(ESPERADO) ? JSON.parse(readFileSync(ESPERADO, "utf-8")) : {};

// Chrome: el que haya. Si puppeteer no trajo el suyo (`npx puppeteer browsers
// install chrome`), se usa el del sistema via PUPPETEER_EXECUTABLE_PATH.
const CHROME = process.env.PUPPETEER_EXECUTABLE_PATH;
const nav = await puppeteer.launch({
  headless: "new",
  ...(CHROME ? { executablePath: CHROME } : {}),
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"],
});

const res = [];
for (const id of IDS) {
  const p = await nav.newPage();
  await p.setViewport({ width: 1500, height: 1000 });
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e.message).slice(0, 120)));
  const t0 = Date.now();
  try {
    await p.goto(`${BASE}?t=${id}`, { waitUntil: "networkidle2", timeout: 120000 });
    await new Promise((r) => setTimeout(r, 9000));

    // ── Lo que se puede MEDIR desde dentro de la pagina ──
    const info = await p.evaluate(() => {
      const st = window.__hekatanStates;
      const out = {
        canvas: !!document.querySelector("canvas"),
        webgl: !document.body.innerText.includes("no pudo crear un contexto WebGL"),
        titulo: document.querySelector(".tp-rotv_t")?.textContent?.trim() ?? null,
        nLabels: document.querySelectorAll(".tp-lblv_l").length,
        caseId: (typeof window.__hekatanCaseId === "function" ? window.__hekatanCaseId() : null),
        hayStates: !!st,
      };
      if (!st) return out;
      const nodes = st.nodes?.val ?? [];
      const elements = st.elements?.val ?? [];
      const loads = st.nodeInputs?.val?.loads;
      const supports = st.nodeInputs?.val?.supports;
      const deforms = st.deformOutputs?.val?.deformations;
      const reacs = st.deformOutputs?.val?.reactions;
      out.nNodes = nodes.length;
      out.nElems = elements.length;
      out.nDeform = deforms ? deforms.size : 0;
      out.nReac = reacs ? reacs.size : 0;

      // Flecha maxima |uz| (unidades del modelo, m)
      let uzMax = 0, uMax = 0, nan = 0;
      deforms?.forEach((d) => {
        for (let k = 0; k < 6; k++) if (!Number.isFinite(d[k])) nan++;
        const uz = Math.abs(d[2] ?? 0);
        if (Number.isFinite(uz) && uz > uzMax) uzMax = uz;
        const u = Math.hypot(d[0] ?? 0, d[1] ?? 0, d[2] ?? 0);
        if (Number.isFinite(u) && u > uMax) uMax = u;
      });
      out.uzMax = uzMax;
      out.uMax = uMax;
      out.nanDeform = nan;

      // Equilibrio: SRz + S(Fz en nudos LIBRES en Z) = 0
      let sFzLibres = 0, sFzApoyos = 0, sRz = 0;
      loads?.forEach((f, n) => {
        const fz = f?.[2] ?? 0;
        if (!Number.isFinite(fz)) return;
        const sup = supports?.get(n);
        if (sup && sup[2]) sFzApoyos += fz; else sFzLibres += fz;
      });
      reacs?.forEach((r) => { const rz = r?.[2] ?? 0; if (Number.isFinite(rz)) sRz += rz; });
      out.sFzLibres = sFzLibres;
      out.sFzApoyos = sFzApoyos;
      out.sRz = sRz;
      return out;
    });

    await p.screenshot({ path: `cli/shots/deploy/${id}.png` });

    // ── Los asserts, aqui fuera ──
    const fallos = [];
    if (errs.length) fallos.push(`${errs.length} pageerror: ${errs[0]}`);
    if (!info.canvas) fallos.push("sin <canvas>");
    if (!info.hayStates) fallos.push("no expone __hekatanStates (no se puede comprobar nada)");
    if (info.nanDeform > 0) fallos.push(`${info.nanDeform} NaN en la deformada`);

    // 1) equilibrio
    let residuo = null;
    if (info.hayStates && info.nReac > 0 && Math.abs(info.sFzLibres + info.sFzApoyos) > 1e-9) {
      // Ver la nota del barrido: el invariante va con la carga TOTAL, no solo
      // con la de los nudos libres. Medido el 18-sep-2026 en un voladizo:
      // SRz + total = -8e-13 y SRz + libres = 0.75 (la media carga del apoyo).
      const sFzTotal = info.sFzLibres + info.sFzApoyos;
      residuo = Math.abs(info.sRz + sFzTotal) / Math.abs(sFzTotal);
      if (residuo > TOL_EQUILIBRIO) {
        fallos.push(`equilibrio Z: SRz=${info.sRz.toFixed(3)} + SFz(total)=` +
          `${sFzTotal.toFixed(3)} deja ${(residuo * 100).toFixed(2)} % ` +
          `(limite ${(TOL_EQUILIBRIO * 100).toFixed(1)} %)`);
      }
    }

    // 2) regresion contra el valor sellado
    const ref = esperado[id];
    if (!ref) {
      if (SELLAR) {
        esperado[id] = { nNodes: info.nNodes, nElems: info.nElems, uzMax: info.uzMax };
      } else {
        fallos.push(`sin valor sellado en ${ESPERADO} (correr una vez con --sellar)`);
      }
    } else {
      if (ref.nNodes !== info.nNodes) fallos.push(`nudos ${info.nNodes} != sellado ${ref.nNodes}`);
      if (ref.nElems !== info.nElems) fallos.push(`elementos ${info.nElems} != sellado ${ref.nElems}`);
      const d = Math.abs(info.uzMax - ref.uzMax) / Math.max(Math.abs(ref.uzMax), 1e-12);
      if (ref.uzMax > 1e-12 && d > TOL_FLECHA) {
        fallos.push(`flecha max |uz| = ${info.uzMax.toExponential(4)} contra ` +
          `${Number(ref.uzMax).toExponential(4)} sellado (${(d * 100).toFixed(2)} %)`);
      }
      if (SELLAR) esperado[id] = { nNodes: info.nNodes, nElems: info.nElems, uzMax: info.uzMax };
    }

    res.push({
      id, ok: fallos.length === 0, ms: Date.now() - t0, pageerror: errs.length,
      nNodes: info.nNodes, nElems: info.nElems,
      uzMax: info.uzMax, sRz: info.sRz, sFzLibres: info.sFzLibres,
      residuoEquilibrio: residuo, caseId: info.caseId,
      fallos,
    });
  } catch (e) {
    res.push({ id, ok: false, fallos: [String(e).slice(0, 160)] });
  }
  await p.close();
}
await nav.close();

if (SELLAR) {
  writeFileSync(ESPERADO, JSON.stringify(esperado, null, 2) + "\n");
  console.log(`[sellado] ${ESPERADO} actualizado con ${Object.keys(esperado).length} ids`);
}

for (const r of res) console.log(JSON.stringify(r));
const malos = res.filter((r) => !r.ok);
console.log(`\n${res.length - malos.length}/${res.length} ok`);
for (const r of malos) console.log(`  FALLA ${r.id}: ${(r.fallos ?? []).join(" | ")}`);
process.exit(malos.length ? 1 : 0);
