// Casillas «🖱 Al pasar el cursor»: con «info de áreas» y «matriz K de áreas» apagadas no sale nada sobre una cáscara.
import puppeteer from "puppeteer";
const [BASE, PNG] = process.argv.slice(2);
const URL = `${BASE}/workspace/?t=muro-manabi&p=eyJtb2RlbG8iOjEsImNmIjoxLCJMIjozLCJzQ2YiOjEuNSwibXMiOjAuMTV9`;
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 7000));
const casillas = await pag.evaluate(() => [...document.querySelectorAll(".tp-lblv_l")].map((e) => e.innerText.trim()).filter((t) => /info de|matriz K/.test(t)));
console.log("casillas:", casillas.join(" | "));
const visible = async () => { await pag.mouse.move(800, 520); await new Promise((r) => setTimeout(r, 300)); await pag.mouse.move(806, 524); await new Promise((r) => setTimeout(r, 3500));
  return pag.evaluate(() => ({ recuadro: [...document.querySelectorAll("div")].some((d) => d.style.whiteSpace === "pre-line" && d.style.display === "block" && /Shell|Nodo|Frame/.test(d.textContent || "")),
    tarjetaK: !!window.__hkKLocalHover?.abierta?.() })); };
console.log("encendidas:", JSON.stringify(await visible()));
await pag.evaluate(() => { const p = window.__hekatanHoverPrefs; p.areas.val = false; p.kAreas.val = false; p.nudos.val = false; });
await pag.mouse.move(100, 900); await new Promise((r) => setTimeout(r, 800));
console.log("apagadas:", JSON.stringify(await visible()));
await pag.screenshot({ path: PNG });
await pag.evaluate(() => { const p = window.__hekatanHoverPrefs; p.areas.val = true; p.kAreas.val = true; p.nudos.val = true; });
await nav.close();
