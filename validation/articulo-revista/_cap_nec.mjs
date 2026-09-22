import puppeteer from "puppeteer";
const OUT = process.argv[2];
const URL = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=test-m-dual";
const dormir = ms => new Promise(s => setTimeout(s, ms));
const b = await puppeteer.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH, headless: "new",
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  defaultViewport: { width: 1600, height: 950 } });
const p = await b.newPage();
await p.goto(URL, { waitUntil: "networkidle2", timeout: 120000 });
await dormir(25000);

// abrir la carpeta "Sismico NEC" del panel derecho
const ok = await p.evaluate(() => {
  const e = [...document.querySelectorAll("button")].find(e => (e.innerText || "").includes("Sísmico NEC"));
  if (!e) return false; e.click(); return true;
});
console.log("Sismico NEC:", ok);
await dormir(9000);
await p.screenshot({ path: `${OUT}/05_struct_sismico_nec.png` });

// texto de todo el panel derecho
const t = await p.evaluate(() => document.body.innerText);
console.log(t.split("\n").filter(l => /NEC|Sa|Cs|Zona|suelo|R |Cortante|V |W |tonf|Espectro|Fa|Fd|Fs|eta|η/.test(l)).slice(0, 70).join("\n"));
await b.close();
