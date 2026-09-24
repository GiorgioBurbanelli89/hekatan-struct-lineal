import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.goto("about:blank");
const r = await p.evaluate(() => {
  const l = ["video/mp4;codecs=avc1.42E01E", "video/mp4;codecs=avc1", "video/mp4",
             "video/webm;codecs=vp9,opus", "video/webm"];
  const o = {};
  for (const m of l) o[m] = MediaRecorder.isTypeSupported(m);
  return { soporte: o, version: navigator.userAgent.match(/Chrome\/[\d.]+/)?.[0] };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
