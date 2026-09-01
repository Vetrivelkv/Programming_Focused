import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(root, "frontend", "public", "assets", "typescript", "ts_next_gen");

const visuals = [
  ["module-lab", "Modern JavaScript lab", "src/app.ts  →  dist/app.js", "One configured loop for editing, compiling, and browser testing.", "#56d6ff", "#8d7dff"],
  ["let-const", "Bindings & block scope", "const stable  •  let mutable", "Choose reassignment deliberately and keep names inside their blocks.", "#55e6a5", "#37a6ff"],
  ["arrow-functions", "Arrow functions", "(a, b) => a + b", "Use concise expressions and let callback context carry useful types.", "#ffca62", "#ff718f"],
  ["default-parameters", "Default parameters", "b: number = 1", "Put optional defaults after required inputs for natural calls.", "#ff8e5d", "#ffcf59"],
  ["spread", "Spread values", "[head, ...items]", "Expand arrays and objects while remembering every copy is shallow.", "#e979ff", "#6c8cff"],
  ["rest-parameters", "Rest parameters", "(...numbers: number[])", "Collect flexible calls into a typed array, then reduce the values.", "#54dfd2", "#4b8dff"],
  ["destructuring", "Destructuring", "{ firstName: userName }", "Extract arrays by position and objects by key—with clear aliases.", "#ff6fae", "#9c74ff"],
  ["compile-target", "Compile for the runtime", "ES6  ⇢  ES5", "Transform syntax for the target; add polyfills separately for APIs.", "#72e57e", "#e3d857"],
];

const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const wrap = (value, limit) => value.split(" ").reduce((lines, word) => {
  if (!lines.length || `${lines.at(-1)} ${word}`.length > limit) lines.push(word);
  else lines[lines.length - 1] += ` ${word}`;
  return lines;
}, []);
const textLines = (value, x, y, limit, size, height, color, weight = 400) => wrap(value, limit)
  .map((line, index) => `<text x="${x}" y="${y + index * height}" fill="${color}" font-size="${size}" font-weight="${weight}" font-family="Arial, sans-serif">${escape(line)}</text>`)
  .join("\n");

function createSvg(index, title, code, note, accent, accentTwo) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x2="1" y2="1"><stop stop-color="#07111f"/><stop offset=".52" stop-color="#101c32"/><stop offset="1" stop-color="#162640"/></linearGradient>
    <linearGradient id="glow"><stop stop-color="${accent}"/><stop offset="1" stop-color="${accentTwo}"/></linearGradient>
    <filter id="shadow"><feDropShadow dy="22" stdDeviation="24" flood-opacity=".42"/></filter>
  </defs>
  <rect width="1280" height="720" rx="36" fill="url(#bg)"/>
  <circle cx="1150" cy="65" r="285" fill="${accent}" opacity=".09"/><circle cx="115" cy="700" r="280" fill="${accentTwo}" opacity=".07"/>
  <path d="M72 74h190" stroke="url(#glow)" stroke-width="6" stroke-linecap="round"/>
  <text x="72" y="120" fill="${accent}" font-size="17" font-weight="700" letter-spacing="2.6" font-family="Arial, sans-serif">NEXT-GENERATION JAVASCRIPT &amp; TYPESCRIPT · ${String(index).padStart(2, "0")}</text>
  ${textLines(title, 72, 212, 21, 51, 60, "#f7f9ff", 700)}
  <rect x="72" y="423" width="508" height="145" rx="24" fill="#10243b" stroke="#304964"/>
  <text x="106" y="465" fill="#7894ac" font-size="15" letter-spacing="2.1" font-family="Arial, sans-serif">WHY IT MATTERS</text>
  ${textLines(note, 106, 510, 42, 21, 29, "#dce8f5")}
  <g filter="url(#shadow)">
    <rect x="644" y="142" width="570" height="430" rx="28" fill="#060e19" stroke="#3a526c"/>
    <rect x="644" y="142" width="570" height="66" rx="28" fill="#11243a"/>
    <circle cx="686" cy="175" r="7" fill="#ff718f"/><circle cx="711" cy="175" r="7" fill="#ffca62"/><circle cx="736" cy="175" r="7" fill="#55e6a5"/>
    <text x="775" y="182" fill="#829bb1" font-size="17" font-family="Consolas, monospace">src/app.ts</text>
    <text x="698" y="328" fill="${accent}" font-size="28" font-weight="700" font-family="Consolas, monospace">${escape(code)}</text>
    <rect x="698" y="371" width="452" height="2" fill="#2d455d"/>
    <text x="698" y="425" fill="#8aa0b4" font-size="17" font-family="Consolas, monospace">type → compile → inspect → run</text>
    <rect x="698" y="472" width="176" height="42" rx="21" fill="url(#glow)" opacity=".92"/>
    <text x="728" y="499" fill="#07111f" font-size="16" font-weight="700" font-family="Arial, sans-serif">SECTION 05</text>
  </g>
  <text x="72" y="655" fill="#607a91" font-size="16" letter-spacing="1.4" font-family="Arial, sans-serif">PROGRAMMING FOCUSED  /  ORIGINAL LESSON VISUAL</text>
  </svg>`;
}

fs.mkdirSync(outputDir, { recursive: true });
for (const [zeroIndex, item] of visuals.entries()) {
  const index = zeroIndex + 1;
  const [slug, title, code, note, accent, accentTwo] = item;
  const basename = `${String(index).padStart(2, "0")}-${slug}`;
  const svg = createSvg(index, title, code, note, accent, accentTwo);
  fs.writeFileSync(path.join(outputDir, `${basename}.svg`), svg);
  await sharp(Buffer.from(svg)).png().toFile(path.join(outputDir, `${basename}.png`));
}

console.log(`Generated ${visuals.length} Section 5 lesson visuals.`);
