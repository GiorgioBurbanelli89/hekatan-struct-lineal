// ¿Las secciones siguen a la deformada? Se mide la distancia de cada seccion al
// centro de SU barra. Si el bug esta, algunas quedan a metros de distancia.
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1500, height: 900 });
const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 140)));
await p.goto(process.argv[2], { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 17000));
const medir = async (etiqueta) => {
  const d = await p.evaluate(() => {
    const V = window.__hekatanViewer || window.viewer;
    let esc = null;
    // la escena de three, se busque como se busque
    const cand = [V?.scene, window.__hekatanScene, window.scene].filter(Boolean);
    esc = cand[0];
    if (!esc) {
      // ultimo recurso: recorrer los canvas y sacar la escena del renderer
      return { error: "sin escena" };
    }
    let n = 0, peor = 0, suma = 0;
    esc.traverse((o) => {
      const el = o.userData?.secElem;
      if (!el) return;
      const nd = window.__hekatanNodes?.val ?? window.__hekatanNodes;
      if (!nd) return;
      const a = nd[el[0]], c = nd[el[1]];
      if (!a || !c) return;
      const mx = (a[0] + c[0]) / 2, my = (a[1] + c[1]) / 2, mz = (a[2] + c[2]) / 2;
      const d = Math.hypot(o.position.x - mx, o.position.y - my, o.position.z - mz);
      n++; suma += d; peor = Math.max(peor, d);
    });
    return { n, peor: +peor.toFixed(4), media: n ? +(suma / n).toFixed(4) : 0 };
  });
  console.log(etiqueta, JSON.stringify(d));
};
await medir("al abrir:");
console.log("errores:", errs.slice(0, 3));
await p.screenshot({ path: process.argv[3] });
await b.close();
