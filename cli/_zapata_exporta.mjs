// Descarga de verdad el E2K, el S2K y el F2K de un ejemplo, y mira lo que traen.
//   node cli/_zapata_exporta.mjs <url> <carpeta>
import puppeteer from "puppeteer";
import fs from "fs";

const [url, dir] = process.argv.slice(2);
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir, { recursive: true });

const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1600, height: 950 });
// los exportadores avisan con alert(): sin esto la pagina se queda bloqueada
p.on("dialog", async (d) => { console.log("aviso:", d.message().slice(0, 100)); await d.accept(); });
const cdp = await p.createCDPSession();
await cdp.send("Page.setDownloadBehavior", { behavior: "allow", downloadPath: dir });

await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 18000));

for (const clave of ["E2K", "S2K", "F2K"]) {
  const ok = await p.evaluate((c) => {
    const btn = Array.from(document.querySelectorAll("button,.tp-btnv_b")).find((e) => {
      const t = (e.textContent || "").replace(/\s+/g, " ").trim();
      return t.includes("Exportar") && t.includes(c) && t.length < 45;
    });
    if (btn) { btn.click(); return true; }
    return false;
  }, clave);
  console.log(clave + ": " + (ok ? "pulsado" : "NO ESTA"));
  await new Promise((r) => setTimeout(r, 7000));
}
await b.close();

const files = fs.readdirSync(dir).filter((f) => !f.endsWith(".crdownload"));
if (!files.length) { console.log("no se descargo nada"); process.exit(0); }
for (const f of files) {
  const t = fs.readFileSync(dir + "/" + f, "utf8");
  const lineas = t.split("\n");
  const cuenta = (re) => lineas.filter((x) => re.test(x)).length;
  console.log("\n" + f + "  —  " + (t.length / 1024).toFixed(0) + " KB, " + lineas.length + " lineas");
  console.log("   puntos: " + cuenta(/^\s*(POINT|JOINT)\b/i) +
              "   areas: " + cuenta(/^\s*(AREA|SHELL)\b/i) +
              "   muelles: " + cuenta(/SPRING/i) +
              "   cargas: " + cuenta(/LOAD/i));
}
