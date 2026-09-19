// Prueba las HERRAMIENTAS del agente de IA sin modelo de lenguaje: cada una se llama
// directo (window.__hekatanAgenteTool) contra el workspace local y se imprime lo que
// devolveria a la IA. Separa los fallos del programa de los del modelo.
import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await nav.newPage();
await p.setViewport({ width: 1400, height: 850 });
const errores = [];
p.on("pageerror", (e) => errores.push(String(e)));
await p.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 4000));
const T = (n, a = {}) => p.evaluate((n, a) => window.__hekatanAgenteTool(n, a), n, a);
const hay = await p.evaluate(() => ({ tool: typeof window.__hekatanAgenteTool, lanzador: !!document.getElementById("hk-agente-lanzador") }));
console.log("ganchos", hay);
const out = (n, r) => console.log(`\n## ${n}\n` + JSON.stringify(r).slice(0, 900));
out("listar edificio", await T("listar_plantillas", { filtro: "edificio" }));
out("cargar edificio-aporticado", await T("cargar_plantilla", { id: "edificio-aporticado" }));
out("resultados", await T("resultados"));
out("modal", await T("analisis_modal"));
out("heks portico", await T("modelar_heks", { script:
`node 1 0 0 0
node 2 0 0 3
node 3 5 0 3
node 4 5 0 0
frame 1 1 2 25e6 0.16 0.002133 0.002133
frame 2 2 3 25e6 0.15 0.001125 0.003125
frame 3 3 4 25e6 0.16 0.002133 0.002133
support 1 fixed
support 4 fixed
frameload 2 0 0 -20` }));
out("resultados", await T("resultados"));
out("vista", await T("vista", { camara: "elevX", deformada: true }));
out("deshacer", await T("deshacer"));
out("obtener_modelo", await T("obtener_modelo"));
await p.evaluate(() => window.__hekatanAgenteIA());
await p.screenshot({ path: "cli/shots/_agente_herramientas.png" });
console.log("\npageerrors:", errores.length, errores.slice(0, 3));
await nav.close();
