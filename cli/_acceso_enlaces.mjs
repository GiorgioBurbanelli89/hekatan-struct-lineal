// Público: enlace corto ?k= (modelo importado, sin parámetros) y los paneles completos para los guiones de vídeo.
import puppeteer from "puppeteer";
const [k, png] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const p = await b.newPage(); await p.setViewport({ width: 1600, height: 1000 });
const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
await p.goto(`https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?k=${k}`, { waitUntil: "networkidle2", timeout: 240000 }); await new Promise((r) => setTimeout(r, 40000));
const a = await p.evaluate(() => { let rz = 0; for (const [, v] of (window.__hekatanStates.deformOutputs.val?.reactions ?? [])) rz += v[2];
  return { nudos: window.__hekatanStates.nodes.val.length, rz, grupos: [...document.querySelectorAll("#hk-acceso .ar-g")].map((g) => g.querySelector(".ar-t").textContent + ":" + g.querySelectorAll(".ar-f").length + " " + (g.querySelector(".ar-nada")?.textContent ?? "")) }; });
await p.keyboard.down("Alt"); await p.keyboard.press("3"); await p.keyboard.up("Alt"); await new Promise((r) => setTimeout(r, 800));
await p.screenshot({ path: png });
const nec = await p.evaluate(() => { window.__hekatanPaneles("todo"); return new Promise((r) => setTimeout(() => {
  const s = document.getElementById("settings"); const vis = (e) => e && e.getBoundingClientRect().x >= 0 && getComputedStyle(e).opacity !== "0";
  const fila = [...document.querySelectorAll("#settings .tp-fldv_t")].find((e) => /Sismo NEC/.test(e.textContent));
  r({ settingsVisible: vis(s), paneVisible: vis(document.getElementById("hk-pane-host")), carpetaNEC: !!fila, accesoTapado: document.getElementById("hk-acceso")?.style.visibility }); }, 1200)); });
console.log(JSON.stringify({ ...a, nec, errs }));
await b.close();
