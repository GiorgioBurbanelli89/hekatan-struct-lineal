// Importa el MISMO .e2k en local y en el público y compara lo que entra.
import puppeteer from "puppeteer";
const f = process.argv[2];
const SITIOS = { local: "http://localhost:4600/workspace/?t=edificio-frame-nec", publico: "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-frame-nec" };
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"] });
for (const [nom, url] of Object.entries(SITIOS)) {
  const p = await b.newPage(); await p.setViewport({ width: 1400, height: 900 });
  p.on("dialog", async d => await d.accept());
  await p.goto(url + "&v=" + Date.now(), { waitUntil: "networkidle2", timeout: 180000 });
  await new Promise(r => setTimeout(r, 12000));
  const ch = p.waitForFileChooser({ timeout: 20000 });
  await p.evaluate(() => { const b = [...document.querySelectorAll("button,.tp-btnv_b")].find(e => /Importar/i.test(e.textContent) && /E2K/i.test(e.textContent) && e.textContent.length < 45); b?.click(); });
  await (await ch).accept([f]);
  await new Promise(r => setTimeout(r, 25000));
  console.log(nom, JSON.stringify(await p.evaluate(() => { const S = window.__hekatanStates; let fz = 0;
    S.nodeInputs.val?.loads?.forEach?.(v => fz += v[2] || 0);
    const t = S.elementInputs.val?.thicknesses; const esp = t ? [...new Set([...t.values()].map(v => +v.toFixed(3)))].sort() : [];
    return { n: S.nodes.val.length, e: S.elements.val.length, fz: +fz.toFixed(1), esp }; })));
  await p.close();
}
await b.close();
