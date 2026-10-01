import puppeteer from "puppeteer";
const URL = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=muro-manabi&p=" + Buffer.from(JSON.stringify({ modelo: 1, cf: 1, L: 3, sCf: 1.5, ms: 0.3 })).toString("base64");
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 7000));
const b = await pag.evaluate(() => { const e = [...document.querySelectorAll("button")].find((x) => x.innerText.includes("Exportar") && x.getBoundingClientRect().y < 40); const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
await pag.mouse.click(b[0], b[1]); await new Promise((r) => setTimeout(r, 800));
console.log(b, await pag.evaluate(() => [...document.querySelectorAll("#hk-menus *, [id*=menu] *")].filter((e) => e.children.length === 0 && e.innerText?.trim() && e.getBoundingClientRect().height > 0).map((e) => { const r = e.getBoundingClientRect(); return `${e.innerText.trim()} @${Math.round(r.x + r.width / 2)},${Math.round(r.y + r.height / 2)}`; }).join("\n")));
await nav.close();
