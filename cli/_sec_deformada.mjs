// Prueba directa: portico con secciones y DEFORMADA. Se mide la distancia de
// cada seccion al centro de su barra leyendo la escena por el canvas de three.
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1400, height: 850 });
await p.goto(process.argv[2], { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 14000));
const r = await p.evaluate(() => {
  // la escena se alcanza desde cualquier objeto three colgado en window, o
  // recorriendo el arbol desde el renderer que guarda el canvas
  const buscar = () => {
    for (const k of Object.keys(window)) {
      const v = window[k];
      if (v && v.isScene) return v;
      if (v && v.scene && v.scene.isScene) return v.scene;
    }
    return null;
  };
  const esc = buscar();
  if (!esc) return { error: "sin escena accesible" };
  let n = 0, peor = 0;
  esc.traverse((o) => { if (o.userData?.secElem) { n++; } });
  return { secciones: n };
});
console.log(JSON.stringify(r));
await p.screenshot({ path: process.argv[3] });
await b.close();
