import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetRoot = path.join(root, "frontend", "public", "assets", "typescript");
const visuals = [
  ["ts_compiler", "project-setup", "Configured project", "tsconfig.json  →  npx tsc", "One compiler contract for editor, CI, and team."],
  ["ts_compiler", "target-libs", "Target & libraries", "ES2022  +  DOM", "Output syntax and platform APIs are separate choices."],
  ["ts_compiler", "input-emission", "Input & emission", "src/**/*.ts  →  dist/", "Select source deliberately and protect emitted output."],
  ["ts_compiler", "strict-checking", "Strict checking", "strict: true", "Make uncertainty visible before runtime."],
  ["ts_compiler", "quality-checks", "Quality diagnostics", "noImplicitReturns", "Catch forgotten paths, unused code, and fallthrough."],
  ["ts_compiler", "deep-dive", "Production configuration", "NodeNext  •  sourceMap", "Read options by responsibility, not memorisation."],
  ["ts_compiler", "compile-watch", "Build & watch", "tsc  /  tsc --watch", "Fast feedback locally; deterministic builds in CI."],
  ["ts_compiler", "type-packages", "Declaration packages", "@types/node", "Describe runtime APIs without changing runtime behaviour."],
  ["ts_demo", "first-steps", "Investment inputs", "5000  +  500  @  8%", "Start with the domain values before the loop."],
  ["ts_demo", "custom-types", "Domain contracts", "InvestmentData", "Give inputs and annual results stable names."],
  ["ts_demo", "union-result", "Honest outcomes", "InvestmentResult[] | string", "Success and validation failure share one explicit contract."],
  ["ts_demo", "calculation-loop", "Annual projection", "grow  →  contribute  →  store", "Operation order defines the financial assumption."],
  ["ts_demo", "connect-functions", "Connect the pipeline", "calculate()  →  print()", "Keep financial logic independent from presentation."],
  ["ts_demo", "compile-execute", "Complete & execute", "tsc  →  node dist/calculator.js", "Check, emit, run, then exercise every branch."],
];

const escape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const wrap = (value, limit) => value.split(" ").reduce((lines, word) => {
  if (!lines.length || `${lines.at(-1)} ${word}`.length > limit) lines.push(word);
  else lines[lines.length - 1] += ` ${word}`;
  return lines;
}, []);
const lines = (value, x, y, limit, size, height, color, weight = 400) => wrap(value, limit)
  .map((line, index) => `<text x="${x}" y="${y + index * height}" fill="${color}" font-size="${size}" font-weight="${weight}" font-family="Arial, sans-serif">${escape(line)}</text>`)
  .join("\n");

function createSvg(section, index, title, code, note) {
  const isCompiler = section === "ts_compiler";
  const accent = isCompiler ? "#58c7ff" : "#ffcb69";
  const accentTwo = isCompiler ? "#9f7aea" : "#ff7f8a";
  const label = isCompiler ? "COMPILER & CONFIGURATION" : "ESSENTIALS DEMO PROJECT";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#071521"/><stop offset="1" stop-color="#182b42"/></linearGradient><linearGradient id="accent"><stop stop-color="${accent}"/><stop offset="1" stop-color="${accentTwo}"/></linearGradient><filter id="shadow"><feDropShadow dy="24" stdDeviation="25" flood-opacity=".4"/></filter></defs>
  <rect width="1280" height="720" rx="36" fill="url(#bg)"/><circle cx="1130" cy="70" r="270" fill="${accent}" opacity=".08"/><circle cx="80" cy="700" r="250" fill="${accentTwo}" opacity=".06"/>
  <rect x="72" y="62" width="185" height="5" rx="3" fill="url(#accent)"/><text x="72" y="112" fill="${accent}" font-size="18" font-weight="700" letter-spacing="2.5" font-family="Arial, sans-serif">${escape(label)} · ${String(index).padStart(2, "0")}</text>
  ${lines(title, 72, 204, 21, 49, 58, "#f4f8ff", 700)}
  <rect x="72" y="424" width="505" height="142" rx="22" fill="#10253a" stroke="#2f4a63"/><text x="105" y="465" fill="#7896ad" font-size="15" letter-spacing="2" font-family="Arial, sans-serif">KEY OUTCOME</text>${lines(note, 105, 510, 43, 21, 29, "#d8e6f3")}
  <g filter="url(#shadow)"><rect x="650" y="145" width="560" height="425" rx="26" fill="#06111c" stroke="#38536b"/><rect x="650" y="145" width="560" height="64" rx="26" fill="#11283b"/><circle cx="691" cy="177" r="7" fill="#ff7f8a"/><circle cx="716" cy="177" r="7" fill="#ffcb69"/><circle cx="741" cy="177" r="7" fill="#64d9ad"/><text x="778" y="184" fill="#849eb3" font-size="17" font-family="Consolas, monospace">lesson.ts</text><text x="700" y="345" fill="${accent}" font-size="25" font-family="Consolas, monospace">${escape(code)}</text><rect x="700" y="384" width="425" height="2" fill="#2d485e"/><text x="700" y="438" fill="#8299aa" font-size="17" font-family="Consolas, monospace">inspect  →  configure  →  prove</text></g>
  <text x="72" y="655" fill="#607c91" font-size="16" letter-spacing="1.4" font-family="Arial, sans-serif">PROGRAMMING FOCUSED  /  ORIGINAL LESSON VISUAL</text></svg>`;
}

for (const section of ["ts_compiler", "ts_demo"]) fs.mkdirSync(path.join(assetRoot, section), { recursive: true });
const counters = { ts_compiler: 0, ts_demo: 0 };
for (const [section, slug, title, code, note] of visuals) {
  const index = ++counters[section];
  const file = `${String(index).padStart(2, "0")}-${slug}`;
  const source = createSvg(section, index, title, code, note);
  const output = path.join(assetRoot, section);
  fs.writeFileSync(path.join(output, `${file}.svg`), source);
  await sharp(Buffer.from(source)).png().toFile(path.join(output, `${file}.png`));
}

console.log(`Generated ${visuals.length} Section 3 and 4 visuals.`);
