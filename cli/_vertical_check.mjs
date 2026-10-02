import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const err = []; pag.on("pageerror", (e) => err.push(String(e)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const P = Buffer.from(JSON.stringify({ tipo: 2, ejesX: "0,5,11,15", ejesY: "0,4.5,9.5", pisos: 4, h: 3, h1: 3.6, volXp: 1.2, volYm: 1.5, volXm: 0, volYp: 0, formLosa: 51, tlosa: 0.25, offsets: 0 })).toString("base64");
await pag.goto(`https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=plantillas&p=${P}&v=${Date.now()}`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(9000);
for (const [m, d] of [["CQC", "independiente"], ["SRSS", "SRSS"], ["CQC", "100-30"]]) {
  const t = await pag.evaluate((m, d) => { const n = window.__hekatanNEC; Object.assign(n.params, { modal: m, direccional: d, conVertical: 1 }); n.correr();
    return [...document.querySelectorAll("#hk-nec-panel b")].map((b) => b.parentElement).filter((x) => /Combinación|Sismo vertical/.test(x.innerText)).map((x) => x.innerText).slice(0, 1).join("").split("\n").filter((l) => /Componente|Combinación/.test(l)).join("\n"); }, m, d);
  console.log("==", m, d, "\n" + t);
}
await pag.evaluate(() => [...document.querySelectorAll("#hk-nec-panel b")].find((b) => b.innerText.includes("Componente"))?.scrollIntoView({ block: "start" }));
await espera(500); await pag.screenshot({ path: "cli/shots/aguiar/vertical.png" });
console.log("err", err); await nav.close();
