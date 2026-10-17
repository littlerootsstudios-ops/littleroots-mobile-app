// Makes the Android icons/TV banner and the home-screen icons from brand/littleroots-logo.svg.
// Usage: node tools/make-icons.mjs   (needs Playwright's Chromium)
import fs from "fs";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require("/opt/npm-tools/node_modules/playwright")); }

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const svg = fs.readFileSync(path.join(ROOT, "brand/littleroots-logo.svg"), "utf8")
  .replace(/<\?xml[^>]*>|<!--[\s\S]*?-->/g, "")
  .replace(/viewBox="[^"]*"/, 'viewBox="132 292 310 222"')
  .replace(/\swidth="[^"]*"|\sheight="[^"]*"|\sstyle="[^"]*"/g, "")
  .replace(/\.st0\{fill:#0D322C;\}/, ".st0{fill:#F3EBD8;}");

// [file, width, height, logo width as share of canvas, tagline?, jpg?, transparent?]
const RES = "android/app/src/main/res";
const OUT = [
  ...[["mdpi", 48], ["hdpi", 72], ["xhdpi", 96], ["xxhdpi", 144], ["xxxhdpi", 192]].map(([d, s]) => [`${RES}/mipmap-${d}/ic_launcher.png`, s, s, 0.84]),
  ...[["mdpi", 108], ["hdpi", 162], ["xhdpi", 216], ["xxhdpi", 324], ["xxxhdpi", 432]].map(([d, s]) => [`${RES}/mipmap-${d}/ic_launcher_foreground.png`, s, s, 0.56, false, false, true]),
  [`${RES}/drawable-xhdpi/banner.png`, 640, 360, 0.5],
  ["web/icon-180.png", 180, 180, 0.8],
  ["web/icon-192.png", 192, 192, 0.8],
  ["web/icon-512.png", 512, 512, 0.62],
];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [file, w, h, share, tagline, jpg, clear] of OUT) {
  await page.setViewportSize({ width: w, height: h });
  const small = w <= 130;
  await page.setContent(`<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&display=swap" rel="stylesheet">
<style>
html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden}
body{display:flex;flex-direction:column;align-items:center;justify-content:center;
 background:radial-gradient(ellipse at 50% 38%, #1d5248 0%, #0D322C 62%, #08231f 100%);font-family:Nunito,sans-serif}
${clear ? "body{background:transparent!important}" : ""}
svg{width:${Math.round(w * share)}px;height:auto;display:block}
p{margin:${Math.round(h * 0.035)}px 0 0;color:#E7C27F;font-weight:800;letter-spacing:.06em;font-size:${Math.round(h * 0.034)}px}
p b{color:#F3EBD8;font-weight:800}
</style></head><body>${svg}${tagline ? "<p>Small seeds. Deep roots. <b>Stories for every generation.</b></p>" : ""}</body></html>`);
  await page.waitForTimeout(tagline ? 1200 : 150);
  fs.mkdirSync(path.dirname(path.join(ROOT, file)), { recursive: true });
  await page.screenshot({ path: path.join(ROOT, file), type: jpg ? "jpeg" : "png", omitBackground: !!clear, quality: jpg ? 92 : undefined });
  console.log("made", file, `${w}x${h}`);
}
await browser.close();
