import puppeteer from "puppeteer";
const BASE = process.argv[2];
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const p = Buffer.from(JSON.stringify({ P_lat: 20, _si: 1 })).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
for (const preset of ["Metric SI", "Metric MKS", "U.S. Imperial"]) {
  const pag = await nav.newPage();
  await pag.evaluateOnNewDocument((pr) => { localStorage.clear(); localStorage.setItem("hk_unitsPreset", pr); }, preset);
  await pag.goto(`${BASE}/workspace/?t=benchmark-steel-cantilever&p=${p}`, { waitUntil: "networkidle2", timeout: 120000 });
  await new Promise((r) => setTimeout(r, 5000));
  const r = await pag.evaluate(async () => {
    const st = window.__hekatanStates; let fx = 0; st.nodeInputs.val.loads?.forEach((v) => (fx += v[0]));
    const e = await window.__hekatanEnlaceEjemplo(); const q = new URL(e.url).searchParams.get("p");
    return { fx, enlace: q ? atob(q.replace(/-/g, "+").replace(/_/g, "/")) : null };
  });
  console.log(preset.padEnd(14), "ΣFx =", r.fx.toFixed(6), "kN · enlace que genera:", r.enlace);
  await pag.close();
}
await nav.close();
