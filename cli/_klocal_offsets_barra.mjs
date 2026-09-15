// ¿La barra trae brazos rígidos (rigidOffsets / endOffsets) o liberaciones? Lee los elementInputs del modelo.
import puppeteer from "puppeteer";
const url = process.argv[2] || "http://localhost:4600/workspace/?t=plantillas";
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 900 });
await pag.goto(url, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!window.__hekatanMallaK, { timeout: 120000 }); await new Promise((r) => setTimeout(r, 5000));
const r = await pag.evaluate(() => {
  const m = window.__hekatanMallaK, ei = m.elementInputs.rawVal, N = m.nodes.rawVal, E = m.elements.rawVal;
  const cuenta = (k) => ei[k]?.size ?? 0;
  const a = N[E[0][0]], b = N[E[0][1]];
  return { barra1: { nudos: E[0], xi: a, xj: b, L: Math.hypot(b[0]-a[0], b[1]-a[1], b[2]-a[2]),
      rigidOffsets: ei.rigidOffsets?.get?.(0) ?? null, endOffsets: ei.endOffsets?.get?.(0) ?? null,
      releases: ei.momentReleases?.get?.(0) ?? null, ang: ei.localAngles?.get?.(0) ?? null },
    modelo: { rigidOffsets: cuenta("rigidOffsets"), endOffsets: cuenta("endOffsets"), momentReleases: cuenta("momentReleases"),
      partialFixitySprings: cuenta("partialFixitySprings"), localAngles: cuenta("localAngles") } };
});
console.log(JSON.stringify(r, null, 1));
await nav.close();
