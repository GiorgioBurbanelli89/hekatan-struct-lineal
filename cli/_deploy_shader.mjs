import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 1000 });
await p.goto(`https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-dual`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 8000));
const r = await p.evaluate(() => {
  const s = window.__hekatanSettings?.(); s.shellResults.val = "vonMises"; s.deformedShape.val = false;
  const ctx = [...document.querySelectorAll("div")].map(d => d.__ctx).find(Boolean);
  let cm = null; ctx.scene.traverse((o) => { if (o.name === "__hekatan_shell_colormap") cm = o; });
  ctx.scene.traverse((o) => { if ((o.isMesh || o.isLineSegments || o.isPoints || o.isLine) && o !== cm) o.visible = false; });
  ctx.render?.();
  const tex = cm.material.uniforms.cmap.value; const d = tex.image.data; const at = (t) => { const i = Math.round(t * 255) * 4; return [d[i], d[i + 1], d[i + 2]]; };
  return { frag: cm.material.fragmentShader, vert: cm.material.vertexShader.slice(0, 400), tex: { t0: at(0), t013: at(0.13), t06: at(0.6), t069: at(0.69), t1: at(1) }, texW: tex.image.width, colorSpace: tex.colorSpace, uniforms: Object.keys(cm.material.uniforms) };
});
await new Promise((r) => setTimeout(r, 1200)); await p.screenshot({ path: "cli/shots/deploy/_solo_colormap.png" });
console.log(JSON.stringify(r)); await nav.close();
