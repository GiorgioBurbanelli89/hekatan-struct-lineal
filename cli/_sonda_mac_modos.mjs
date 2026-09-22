// ¿Se REPITE la forma al cambiar de modo? MAC entre las formas ANIMADAS (diferencia de posiciones en 2 instantes)
import puppeteer from "puppeteer";
const casos = [["boveda", "7nF68EUiy5UVJuli", 80], ["muro_corte", "UePx9ALhS7Re3kG", 12]];
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const [nom, cod, nm] of casos) {
  const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 950 });
  await p.goto(`https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?m=${cod}&modal=${nm}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await p.waitForFunction(() => !!document.getElementById("modal-results")?.innerText?.includes("MODAL"), { timeout: 240000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 4000));
  const poner = (idx) => p.evaluate((idx) => {
    const f = [...document.querySelectorAll("#settings .tp-lblv")].find(e => e.querySelector(".tp-lblv_l")?.textContent.trim() === "Modo");
    const s = f?.querySelector("select"); if (!s) return "sin Modo";
    s.value = s.options[idx].value; s.dispatchEvent(new Event("change", { bubbles: true })); return s.options[idx].textContent.trim();
  }, idx);
  const pos = () => p.evaluate(() => (window.__hekatanStates?.nodes?.val ?? []).map(n => [n[0], n[1], n[2]]));
  const formas = [];
  for (const k of [0, 1, 2]) {
    const txt = await poner(k); await new Promise(r => setTimeout(r, 2500));
    // la mayor diferencia entre varias muestras: la amplitud de la forma que se está animando
    const muestras = []; for (let s = 0; s < 8; s++) { muestras.push(await pos()); await new Promise(r => setTimeout(r, 90)); }
    let best = null, bestN = -1;
    for (let a = 0; a < muestras.length; a++) for (let b = a + 1; b < muestras.length; b++) {
      const d = muestras[a].flatMap((q, i) => [q[0] - muestras[b][i][0], q[1] - muestras[b][i][1], q[2] - muestras[b][i][2]]);
      const nrm = Math.hypot(...d); if (nrm > bestN) { bestN = nrm; best = d; }
    }
    formas.push({ txt, d: best, amp: bestN });
  }
  const mac = (a, b) => { let ab = 0, aa = 0, bb = 0; for (let i = 0; i < a.length; i++) { ab += a[i] * b[i]; aa += a[i] * a[i]; bb += b[i] * b[i]; } return (ab * ab) / (aa * bb || 1); };
  console.log(JSON.stringify({ modelo: nom, modos: formas.map(f => f.txt), amplitud: formas.map(f => +f.amp.toExponential(2)),
    MAC_1_2: +mac(formas[0].d, formas[1].d).toFixed(3), MAC_1_3: +mac(formas[0].d, formas[2].d).toFixed(3), MAC_2_3: +mac(formas[1].d, formas[2].d).toFixed(3) }));
  await p.close();
}
await nav.close();
