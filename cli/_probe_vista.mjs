import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"] });
const p = await b.newPage(); await p.setViewport({ width: 1600, height: 950 });
p.on("pageerror", e => console.log("PAGEERROR", String(e).slice(0,200)));
await p.goto("http://localhost:4600/workspace/?t=itw-test-2-voladizo", { waitUntil: "networkidle2", timeout: 180000 });
await new Promise(r => setTimeout(r, 12000));
await p.evaluate(() => window.__hekatanTutorTest(false));
await new Promise(r => setTimeout(r, 4000));
console.log(await p.evaluate(() => {
  const N = window.__hekatanStates?.nodes?.val ?? [];
  const mn=[1e9,1e9,1e9], mx=[-1e9,-1e9,-1e9];
  for (const q of N) for (let k=0;k<3;k++){ if(q[k]<mn[k])mn[k]=q[k]; if(q[k]>mx[k])mx[k]=q[k]; }
  const ctx = window.__hekatanViewerCtx?.();
  return JSON.stringify({ n: N.length, caja: [mx[0]-mn[0], mx[1]-mn[1], mx[2]-mn[2]],
    hayCtx: !!ctx, cam: ctx ? [+ctx.camera.position.x.toFixed(2), +ctx.camera.position.y.toFixed(2), +ctx.camera.position.z.toFixed(2)] : null });
}));
await b.close();
