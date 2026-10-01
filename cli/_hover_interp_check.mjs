// El valor del recuadro cambia dentro de la cara y en la esquina vale el del joint (= SAP2000). node cli/_hover_interp_check.mjs <base>
import puppeteer from "puppeteer";
const URL = `${process.argv[2]}/workspace/?t=muro-manabi&p=` + Buffer.from(JSON.stringify({ modelo: 1, L: 1, ms: 0.1, cf: 0, caso: 0, lat: 0, apoyos: 1 })).toString("base64");
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 2000, height: 1250 });
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 7000));
await pag.evaluate(() => { const p = window.__hekatanHoverPrefs; p.nudos.val = false; p.kAreas.val = false; window.__hekatanPromediado.val = "ninguno"; window.__hekatanSettings().deformedShape.val = false; window.__hekatanSettings().shellResults.val = "bendingYY"; });
await pag.evaluate(() => {
  const v = [...document.querySelectorAll("div")].find((d) => d.__ctx); const { camera: cam, controls: ct, render } = v.__ctx;
  const N = window.__hekatanStates.nodes.val, t = cam.position.clone().set(N[164][0], N[164][1], N[164][2] + 0.35);
  const d = cam.position.distanceTo(ct.target); cam.up.set(0, 0, 1); ct.target.copy(t);
  cam.position.copy(t.clone().add(cam.position.clone().set(-1, 0, 0).multiplyScalar(cam.isOrthographicCamera ? d : 2.2)));
  if (cam.isOrthographicCamera) { cam.zoom *= 6; cam.updateProjectionMatrix(); } cam.lookAt(t); ct.update(); render();
});
await new Promise((r) => setTimeout(r, 800));
const P = await pag.evaluate(() => {
  const v = [...document.querySelectorAll("div")].find((d) => d.__ctx); const cam = v.__ctx.camera, cv = v.querySelector("canvas").getBoundingClientRect();
  const N = window.__hekatanStates.nodes.val, e = window.__hekatanStates.elements.val[305];
  return e.map((k) => { const q = cam.position.clone().set(...N[k]).project(cam); return [cv.left + (q.x * 0.5 + 0.5) * cv.width, cv.top + (-q.y * 0.5 + 0.5) * cv.height]; });
});
const leer = () => pag.evaluate(() => [...document.querySelectorAll("div")].find((q) => q.style.whiteSpace === "pre-line" && q.style.display === "block")?.textContent ?? "");
await pag.mouse.move(10, 1200);
for (const [a, b] of [[0.99, 0.99], [0.92, 0.92], [0.5, 0.5], [0.01, 0.01]]) {   // de la esquina del nudo 164 a la opuesta
  const x = P[0][0] + (P[2][0] - P[0][0]) * (1 - a), y = P[0][1] + (P[2][1] - P[0][1]) * (1 - b);
  await pag.mouse.move(x, y, { steps: 6 }); await new Promise((r) => setTimeout(r, 500));
  const t = await leer(); const g = (k) => (t.match(new RegExp(k + " = (-?[0-9.e-]+)")) || [])[1];
  console.log(t.split("\n")[3]?.slice(0, 48), "| M22", g("M22"), "V23", g("V23"));
}
await pag.mouse.move(P[0][0] + (P[2][0] - P[0][0]) * 0.3, P[0][1] + (P[2][1] - P[0][1]) * 0.3, { steps: 4 }); await new Promise((r) => setTimeout(r, 600));
if (process.argv[3]) await pag.screenshot({ path: process.argv[3] });
await nav.close();
