// Importa un .e2k en Hekatan Struct (selector nativo) y saca F11/F22 de las cáscaras (Dead) + ΣFz.
//   node cli/_importar_e2k_f11.mjs URL fichero.e2k salida.json png
import puppeteer from "puppeteer";
import { writeFileSync } from "node:fs";
const [url, fichero, out, png] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const p = await b.newPage(); await p.setViewport({ width: 1600, height: 950 });
const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 150)));
p.on("dialog", async (d) => { console.log("aviso:", d.message().slice(0, 130).replace(/\n/g, " ")); await d.accept(); });
await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 16000));
const chooser = p.waitForFileChooser({ timeout: 20000 });
const ok = await p.evaluate(() => { const b = [...document.querySelectorAll("button,.tp-btnv_b")].find((e) => { const t = (e.textContent || "").replace(/\s+/g, " ").trim(); return /Importar/i.test(t) && /e2k|ETABS/i.test(t) && t.length < 45; }); if (b) { b.click(); return true; } return false; });
console.log("boton:", ok);
const fc = await chooser; await fc.accept([fichero]);
await new Promise((r) => setTimeout(r, 30000));
const r = await p.evaluate(() => {
  const S = window.__hekatanStates; const N = S.nodes.val, E = S.elements.val, a = S.analyzeOutputs?.val || {};
  const ser = (m) => m ? [...m.entries()] : null;
  return { n: N.length, e: E.length, keys: Object.keys(a), nodes: N, elements: E,
    fxx: ser(a.membraneXXjoint), fyy: ser(a.membraneYYjoint), fxxc: ser(a.membraneXXcentro),
    reac: S.deformOutputs?.val?.reactions ? [...S.deformOutputs.val.reactions.entries()] : null };
});
console.log("n", r.n, "e", r.e, "keys", r.keys.join(","), "errores", errs.slice(0, 3));
writeFileSync(out, JSON.stringify(r)); await p.screenshot({ path: png }); await b.close();
