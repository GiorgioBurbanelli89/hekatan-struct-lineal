import puppeteer from "puppeteer";
const BASE = process.argv[2], OUT = process.argv[3], ids = process.argv.slice(4);
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
for (const id of ids) {
  const [ex, q] = id.split("?");
  const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 900 });
  await pag.goto(`${BASE}/workspace/?t=${ex}${q ? "&" + q : ""}`, { waitUntil: "networkidle2", timeout: 120000 });
  await new Promise((r) => setTimeout(r, 5000));
  const info = await pag.evaluate(() => {
    const st = window.__hekatanStates; const s = st?.nodeInputs?.val?.supports;
    let conAtadura = 0; s?.forEach((d) => { if (d.some(Boolean)) conAtadura++; });
    const v = document.querySelector("#viewer"); const scene = v?.__ctx?.scene; let dibujados = 0;
    scene?.traverse((o) => { if (o.isMesh && (o.geometry?.type === "ConeGeometry" || o.geometry?.type === "BoxGeometry") && o.parent?.type === "Group") dibujados++; });
    return { nudos: st?.nodes?.val?.length, conAtadura, dibujados };
  });
  await pag.screenshot({ path: `${OUT}/${ex.replace(/[^a-z0-9-]/gi, "_")}.png` });
  console.log(ex, JSON.stringify(info));
  await pag.close();
}
await nav.close();
