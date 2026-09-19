import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const errs=[];
for (const [n,m] of [["servicio","cNdgGBOgjQDYiic4"],["diseno","e3qQ74c6C2sEmWPq"]]) {
  const p = await nav.newPage(); await p.setViewport({width:1500,height:950});
  p.on("pageerror",e=>errs.push(n+": "+e.message));
  await p.goto("https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?m="+m,{waitUntil:"networkidle2",timeout:180000});
  await new Promise(r=>setTimeout(r,35000));
  const ban = await p.evaluate(()=>document.getElementById("hk-banner-sin-rigidez")?.innerText||"(sin banner)");
  console.log(n, ban.slice(0,200));
  await p.screenshot({path:"cli/shots/deploy2_"+n+".png"});
  if (n==="diseno") { await p.click("#hk-franjas-btn").catch(e=>errs.push("btn "+e.message)); await new Promise(r=>setTimeout(r,1500)); await p.screenshot({path:"cli/shots/deploy2_diseno_franjas.png"}); }
}
console.log("errores", errs); await nav.close();
