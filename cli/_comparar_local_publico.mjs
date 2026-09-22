// ¿Da lo MISMO el local que el sitio público? Mismos ejemplos, mismas medidas, uno al lado del otro.
import puppeteer from "puppeteer";
const IDS = process.argv.slice(2);
const SITIOS = { local: "http://localhost:4600/workspace/", publico: "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/" };
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"] });
const med = async (base, id) => {
  const p = await b.newPage(); await p.setViewport({ width: 1400, height: 900 });
  const errs = []; p.on("pageerror", e => errs.push(String(e.message).slice(0, 90)));
  try {
    await p.goto(`${base}?t=${id}&v=${Date.now()}`, { waitUntil: "networkidle2", timeout: 150000 });
    await new Promise(r => setTimeout(r, 9000));
    const r = await p.evaluate(() => { const S = window.__hekatanStates, P = window.__hekatanParams?.() ?? {};
      const d = S.deformOutputs.val?.deformations; let uz = 0, fz = 0;
      d?.forEach(u => { if (Math.abs(u[2]) > Math.abs(uz)) uz = u[2]; });
      S.nodeInputs.val?.loads?.forEach?.(v => fz += v[2] || 0);
      return { n: S.nodes.val.length, e: S.elements.val.length, uz: +(uz * 1e6).toFixed(2), fz: +fz.toFixed(2),
               params: Object.keys(P).sort().join(","), tutor: typeof window.__hekatanTutorTest };
    });
    await p.close(); return { ...r, errs: errs.length };
  } catch (e) { await p.close(); return { error: String(e.message).slice(0, 80) }; }
};
for (const id of IDS) {
  const a = await med(SITIOS.local, id), c = await med(SITIOS.publico, id);
  const igual = JSON.stringify(a) === JSON.stringify(c);
  console.log(`\n${igual ? "IGUAL  " : "DISTINTO"} ${id}`);
  console.log("  local  ", JSON.stringify(a));
  console.log("  publico", JSON.stringify(c));
}
await b.close();
