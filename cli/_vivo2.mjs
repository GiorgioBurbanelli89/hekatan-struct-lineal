// Navegador VISIBLE de verdad: SIN swiftshader (render por software = ventana negra en pantalla).
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: false, defaultViewport: null,
  userDataDir: "C:/Users/j-b-j/AppData/Local/Temp/hk_vivo_ok",
  args: ["--no-sandbox", "--start-maximized", "--remote-debugging-port=9223"] });
const p = (await b.pages())[0] ?? (await b.newPage());
await p.goto(process.argv[2], { waitUntil: "networkidle2", timeout: 180000 });
console.log("VIVO");
await new Promise(() => {});
