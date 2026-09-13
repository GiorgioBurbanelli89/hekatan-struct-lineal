import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
const errs = []; pag.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 200)); });
await pag.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 3000));
console.log(await pag.evaluate(() => ({ snapEnCinta: [...document.querySelectorAll("#hk-ribbon button")].filter((b) => /SNAP|ORTO|OSNAP/.test(b.textContent)).map((b) => b.textContent.trim()), rotulos: [...document.querySelectorAll("#hk-ribbon div")].map((d) => d.textContent.trim()).filter((t) => /Vista/.test(t) && t.length < 60) })));
console.log("console errors:", errs.slice(0, 5));
await nav.close();
