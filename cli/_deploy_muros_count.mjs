import puppeteer from "puppeteer";
const id = process.argv[2] ?? "test-m-dual";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 1000 });
await p.goto(`https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 8000));
const r = await p.evaluate(() => {
  const s = window.__hekatanStates; const N = s.nodes.val, E = s.elements.val;
  let muros = 0, losas = 0, barras = 0;
  for (const e of E) { if (e.length === 4) { const xs = new Set(e.map(i => N[i][0].toFixed(4))), ys = new Set(e.map(i => N[i][1].toFixed(4))), zs = new Set(e.map(i => N[i][2].toFixed(4))); if (zs.size === 1) losas++; else if (xs.size === 1 || ys.size === 1) muros++; } else if (e.length === 2) barras++; }
  const ctx = document.querySelector("#viewer, .viewer")?.__ctx ?? [...document.querySelectorAll("div")].map(d => d.__ctx).find(Boolean);
  const cam = ctx?.camera?.position; const leg = document.getElementById("legend")?.getBoundingClientRect(); const par = document.getElementById("parameters")?.getBoundingClientRect();
  const labels = [...document.querySelectorAll("#legend p")].map(e => e.innerText);
  return { nudos: N.length, muros, losas, barras, cam: cam ? [cam.x, cam.y, cam.z].map(v => +v.toFixed(2)) : null, legend: leg ? [leg.left, leg.right] : null, panelDer: par ? [par.left] : null, labels };
});
console.log(JSON.stringify(r)); await nav.close();
