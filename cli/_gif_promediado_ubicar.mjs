import puppeteer from "puppeteer";
const URL = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=muro-manabi&p=eyJtb2RlbG8iOjEsImNmIjoxLCJMIjozLCJzQ2YiOjEuNSwibXMiOjAuMTV9";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 7000));
console.log(await pag.evaluate(() => [...document.querySelectorAll(".tp-lblv")].map((e) => {
  const l = e.querySelector(".tp-lblv_l")?.innerText?.trim(), s = e.querySelector("select"), r = e.getBoundingClientRect();
  return s && /cáscara|Promediado|Rango|Paleta/.test(l) ? `${l} | ${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.width)}x${Math.round(r.height)} | ${[...s.options].map((o) => o.value + "=" + o.text).join("; ").slice(0, 300)}` : null;
}).filter(Boolean).join("\n")));
await nav.close();
