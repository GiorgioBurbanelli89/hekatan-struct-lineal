import puppeteer from "puppeteer";
const [BASE, id] = process.argv.slice(2);
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1500, height: 950 });
await pag.evaluateOnNewDocument(() => { localStorage.clear(); localStorage.setItem("hk_unitsPreset", "Metric MKS"); });
await pag.goto(`${BASE}/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 180000 });
await new Promise((r) => setTimeout(r, 7000));
const foto = () => pag.evaluate(() => {
  const st = window.__hekatanStates, d = st.deformOutputs.val.deformations, r = st.deformOutputs.val.reactions;
  const sum = [0, 0, 0, 0, 0, 0]; r?.forEach((x) => x.forEach((v, k) => (sum[k] += v)));
  let mx = [0, 0, 0]; d?.forEach((x) => { for (let k = 0; k < 3; k++) if (Math.abs(x[k]) > Math.abs(mx[k])) mx[k] = x[k]; });
  const loads = st.nodeInputs.val.loads; let sl = [0, 0, 0]; loads?.forEach((x) => { for (let k = 0; k < 3; k++) sl[k] += x[k]; });
  const ei = st.elementInputs.val; const E0 = ei.elasticities?.get?.(0), rho0 = ei.densities?.get?.(0);
  return { caso: window.__hekatanActiveCase, combo: window.__hekatanActiveCombo, sumR: sum.map((v) => +v.toFixed(4)), umax: mx, sumCargas: sl.map((v) => +v.toFixed(4)),
           nudos: st.nodes.val.length, elems: st.elements.val.length, E0, rho0, unid: window.__hekatanForceUnit };
});
const a = await foto(); console.log("MKS   ", JSON.stringify(a));
await pag.evaluate(async () => { window.__hekatanRebuild(); await new Promise((r) => setTimeout(r, 6000)); });
console.log("rebuild", JSON.stringify(await foto()));
await pag.evaluate(async () => {
  const sel = [...document.querySelectorAll(".tp-lblv")].find((b) => b.querySelector(".tp-lblv_l")?.textContent?.trim() === "Preset")?.querySelector("select");
  const opt = [...sel.options].find((o) => o.textContent.startsWith("Metric SI")); sel.value = opt.value; sel.dispatchEvent(new Event("change", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 6000));
});
const b = await foto(); console.log("->SI  ", JSON.stringify(b));
await nav.close();
