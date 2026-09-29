import puppeteer from "puppeteer";
const B = process.env.B || "http://localhost:4790/hekatan-struct-lineal";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
for (const u of [B + "/eiffel/", B + "/zapata-aislada/", B + "/workspace/?m=2by5mBd4y2Vv3OLX&t=new-blank"]) {
  const p = await nav.newPage(); const e = []; p.on("pageerror", (x) => e.push(x.message));
  await p.goto(u, { waitUntil: "domcontentloaded", timeout: 120000 }).catch(() => {}); await new Promise((r) => setTimeout(r, 15000));
  const n = await p.evaluate(() => ({ url: location.pathname + location.search.slice(0, 40), nudos: window.__hekatanStates?.nodes?.val?.length ?? -1 }));
  console.log(u.replace(B, ""), "→", n.url, "·", n.nudos, "nudos ·", e.length, "errores");
  await p.screenshot({ path: "cli/shots/estribo/wt_" + u.split(/[/?=&]/).filter(Boolean).slice(-3).join("_") + ".png" }); await p.close();
}
await nav.close();
