/** Dibujar en 3D SIN cambiar de vista (isométrica): los ejes rojo/verde/azul se enganchan solos. */
import puppeteer from "puppeteer"; import fs from "node:fs"; import { join, dirname } from "path"; import { fileURLToPath } from "url";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "shots", "iso3d"); fs.mkdirSync(OUT, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 2000, height: 1152 });
const err = []; pag.on("pageerror", e => err.push(String(e).slice(0, 200)));
const esp = m => new Promise(r => setTimeout(r, m));
await pag.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 }); await esp(5000);
await pag.evaluate(() => { localStorage.clear(); });
const mover = async (x, y) => { await pag.mouse.move(x, y, { steps: 6 }); await esp(120); };
const clic = async (x, y) => { await mover(x, y); await pag.mouse.click(x, y); await esp(250); };
const nodos = () => pag.evaluate(() => JSON.stringify((window.__hekatanDrawingPoints?.val ?? []).map(p => p.map(v => +v.toFixed(2)))));
await pag.evaluate(() => window.__hekatanCadState?.setTool?.("line")); await esp(400);
// pasos: [x,y,z] del MUNDO (se proyectan a pantalla) o "esc" para cortar la cadena
const aPx = ([x, y, z]) => pag.evaluate(([x, y, z]) => {
  const c = document.querySelector("#viewer").__ctx.camera; c.updateMatrixWorld(); c.updateProjectionMatrix();
  const cv = document.querySelector("#viewer canvas") ?? document.querySelector("canvas"); const r = cv.getBoundingClientRect();
  const v = new c.position.constructor(x, y, z).project(c);
  return [(v.x * 0.5 + 0.5) * r.width + r.left, (-v.y * 0.5 + 0.5) * r.height + r.top];
}, [x, y, z]);
const pasos = JSON.parse(process.argv[2] ?? "[[0,0,0],[0,0,6]]");
let i = 0;
for (const p of pasos) {
  if (p === "esc") { await pag.keyboard.press("Escape"); await esp(200);
    await pag.evaluate(() => window.__hekatanCadState?.setTool?.("line")); await esp(300); continue; }
  if (p.h) { const [hx, hy] = await aPx(p.h); await mover(hx, hy); await esp(300); console.log("hover", JSON.stringify(p.h)); continue; }
  const [x, y] = await aPx(p); await clic(x, y); i++; console.log(i, JSON.stringify(p), "->", await nodos());
}
await pag.screenshot({ path: join(OUT, "iso3d.png") });
console.log("errores:", err.length, err.join(" | "));
await nav.close();
