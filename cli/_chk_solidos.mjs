import puppeteer from "puppeteer";
const IDS = ["solid-cube-fem","bulbo-presiones-suelo","muro-contencion-solido","columna-cft-h8","bolt-hole-detail"];
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"] });
for (const id of IDS) {
  const p = await b.newPage(); await p.setViewport({ width: 1600, height: 950 });
  const errs = []; p.on("pageerror", e => errs.push(String(e).slice(0,160)));
  p.on("console", m => { if (m.type()==="error") errs.push("console: " + m.text().slice(0,160)); });
  await p.goto(`http://localhost:4600/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 180000 });
  await new Promise(r => setTimeout(r, 14000));
  const info = await p.evaluate(() => {
    const S = window.__hekatanStates ?? {};
    const sol = S.analyzeOutputs?.val?.solidVonMises;
    return { nudos: S.nodes?.val?.length ?? 0, elems: S.elements?.val?.length ?? 0,
      defor: S.deformOutputs?.val?.deformations?.size ?? 0,
      solidos: sol ? (sol.size ?? Object.keys(sol).length) : 0,
      avisoPanelPropio: !!document.body.innerText.match(/panel propio|Abrir ejemplo/i) };
  });
  await p.screenshot({ path: `cli/shots/solidos_${id}.png` });
  console.log(id, JSON.stringify(info), "errores:", errs.slice(0,3));
  await p.close();
}
await b.close();
