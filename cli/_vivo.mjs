// Navegador VISIBLE y controlable: se queda abierto con puerto 9222 para que otros guiones
// (cli/_ir.mjs) lo lleven a la página que se esté arreglando. Jorge: «debes mostrar el navegador
// en vivo de lo que vas haciendo».
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
mkdirSync("cli/shots/en_vivo", { recursive: true });
const b = await puppeteer.launch({ headless: false, defaultViewport: null,
  userDataDir: "C:/Users/j-b-j/AppData/Local/Temp/hk_vivo_perfil",
  args: ["--no-sandbox","--start-maximized","--remote-debugging-port=9222",
         "--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"] });
const p = (await b.pages())[0] ?? (await b.newPage());
await p.goto(process.argv[2] ?? "http://localhost:4600/workspace/", { waitUntil: "networkidle2", timeout: 180000 });
console.log("VIVO");
await new Promise(() => {});                 // se queda abierto
