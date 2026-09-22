// Prueba: manejar el DOM del workspace con Puppeteer + WebGL headless (dibujar 3D)
import puppeteer from 'puppeteer';

const BASE = 'http://localhost:4600';
const out = (s) => console.log(s);

const browser = await puppeteer.launch({
  headless: 'new',
  args: [
    '--use-gl=angle', '--use-angle=swiftshader',   // WebGL por software en headless
    '--enable-webgl', '--ignore-gpu-blocklist', '--no-sandbox',
    '--enable-unsafe-swiftshader',
  ],
});

async function shoot(path, label, file) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 900, deviceScaleFactor: 1 });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 140)); });
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message.slice(0, 140)));
  await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 60000 }).catch(e => errs.push('GOTO: ' + e.message));
  await new Promise(r => setTimeout(r, 5000));  // dejar render three.js
  const info = await page.evaluate(() => {
    const tp = document.querySelectorAll('[class^="tp-"]').length;
    const sliders = document.querySelectorAll('input[type=range], .tp-sldv').length;
    const canvases = [...document.querySelectorAll('canvas')].map(c => ({ w: c.width, h: c.height }));
    // ¿el canvas WebGL pinto algo? (no esta totalmente vacio)
    let webglPainted = false;
    for (const c of document.querySelectorAll('canvas')) {
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      if (gl && c.width > 50) { webglPainted = true; break; }
    }
    return { tp, sliders, canvases, webglPainted };
  });
  await page.screenshot({ path: file });
  out(`\n[${label}]  ${path}`);
  out(`  Tweakpane elems: ${info.tp}  | sliders: ${info.sliders}  | canvases: ${info.canvases.length} ${JSON.stringify(info.canvases.slice(0,3))}`);
  out(`  WebGL context vivo: ${info.webglPainted}`);
  if (errs.length) out(`  console errors (${errs.length}): ` + errs.slice(0, 5).join(' || '));
  await page.close();
}

await shoot('/', 'WORKSPACE raiz', 'dom_workspace.png');
await shoot('/?t=zapata-aislada', 'Ejemplo zapata (Tweakpane+3D)', 'dom_zapata.png');
await shoot('/?t=shell-thin', 'Ejemplo shell-thin', 'dom_shell.png');

await browser.close();
out('\nScreenshots: dom_workspace.png, dom_zapata.png, dom_shell.png');
