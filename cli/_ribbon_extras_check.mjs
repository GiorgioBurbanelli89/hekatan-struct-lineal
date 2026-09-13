// Comprueba «▾ Añadir a la cinta»: lista los botones y mandos de los paneles, añade uno de cada,
// el botón añadido dispara el del panel y el mando añadido despliega el control real.
//   node cli/_ribbon_extras_check.mjs     (dev server 4600)
import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 160)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const ev = (f, a) => pag.evaluate(f, a);
let k = 0; const foto = async (n) => { await espera(300); await pag.screenshot({ path: `cli/shots/ribbon_extras_${String(k++).padStart(2, "0")}_${n}.png`, clip: { x: 0, y: 0, width: 1280, height: 420 } }); };
const clicEl = async (fn, arg) => { const r = await ev((q) => { const f = new Function("arg", q.src); const el = f(q.arg); if (!el) return null; el.scrollIntoView?.({ block: "center" }); const rc = el.getBoundingClientRect(); return { x: rc.left + rc.width / 2, y: rc.top + rc.height / 2 }; }, { src: `return (${fn.toString()})(arg)`, arg }); if (!r) throw new Error("no está: " + arg); await pag.mouse.click(r.x, r.y); await espera(300); return r; };
const filas = []; const ok = (que, medido, pasa) => { filas.push({ que, medido, ok: pasa }); console.log((pasa ? "  ✓ " : "  ✗ ") + que + "  " + medido); };
await pag.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 }); await espera(3000);
await ev(() => { try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo", "0"); localStorage.removeItem("hk_ribbon_extra"); } catch (e) {} });
for (const id of ["hk-settings-toggle", "hk-pane-toggle"]) { try { await pag.click("#" + id); await espera(300); } catch (e) {} }
await espera(400); await foto("cinta");
await clicEl(() => document.getElementById("hk-ribbon-mas")); await foto("lista");
const n = await ev(() => { const L = document.getElementById("hk-ribbon-extras-lista"); return { items: L?.querySelectorAll("input[type=checkbox]").length ?? 0, carpetas: [...(L?.querySelectorAll("div") ?? [])].filter((d) => /uppercase/.test(d.style.textTransform)).length }; });
ok("lista: entradas", `${n.items} en ${n.carpetas} carpetas`, n.items > 40 && n.carpetas > 5);
// añadir un BOTÓN (Parábola) y un MANDO (Segmentos arc/círc)
await clicEl((re) => [...document.querySelectorAll("#hk-ribbon-extras-lista label")].find((l) => new RegExp(re).test(l.textContent || ""))?.querySelector("input"), "Parábola \\(3 ptos\\)");
await clicEl((re) => [...document.querySelectorAll("#hk-ribbon-extras-lista label")].find((l) => new RegExp(re).test(l.textContent || ""))?.querySelector("input"), "Segmentos arc");
await foto("marcados");
const extras = await ev(() => [...document.querySelectorAll("#hk-ribbon-extras button")].map((b) => b.textContent.replace(/\s+/g, " ").trim()));
ok("cinta: «Mis accesos» con 2 botones", JSON.stringify(extras), extras.length === 2);
await pag.keyboard.press("Escape"); await espera(200);
// el botón añadido dispara la herramienta del panel
await clicEl(() => [...document.querySelectorAll("#hk-ribbon-extras button")][0]);
const tool = await ev(() => window.__hekatanCadState?.get?.()?.tool);
ok("botón añadido → tool parabola", tool, tool === "parabola");
// el mando añadido despliega la fila real de Tweakpane
await clicEl(() => [...document.querySelectorAll("#hk-ribbon-extras button")][1]); await foto("mando_desplegado");
const pop = await ev(() => { const p = document.querySelector("#hk-ribbon .tp-dfwv"); return p ? { lbl: p.querySelector(".tp-lblv_l")?.textContent, slider: !!p.querySelector(".tp-sldv, input") } : null; });
ok("mando desplegado con su slider real", JSON.stringify(pop), !!pop && /Segmentos/.test(pop.lbl || "") && pop.slider);
await pag.keyboard.press("Escape"); await espera(300);
const vuelta = await ev(() => !!document.querySelector("#hk-pane-host .tp-lblv_l") && [...document.querySelectorAll("#hk-pane-host .tp-lblv_l")].some((l) => /Segmentos arc/.test(l.textContent || "")));
ok("al cerrar, la fila vuelve al panel", vuelta, vuelta);
// persiste al recargar
await pag.reload({ waitUntil: "networkidle2" }); await espera(3500);
const tras = await ev(() => document.querySelectorAll("#hk-ribbon-extras button").length);
ok("persiste tras recargar", tras, tras === 2);
const alto = await ev(() => Math.round(document.getElementById("hk-ribbon").getBoundingClientRect().height));
ok("la cinta sigue en dos filas", alto + " px", alto < 150);
console.log("errores:", errs.length ? errs : "ninguno"); ok("sin errores de página", errs.length, errs.length === 0);
const malas = filas.filter((f) => !f.ok); console.log(`\n${filas.length - malas.length}/${filas.length} OK`);
await nav.close(); process.exit(malas.length ? 1 : 0);
