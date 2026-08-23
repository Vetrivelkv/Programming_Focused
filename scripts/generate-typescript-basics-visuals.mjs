import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "frontend", "public", "assets", "typescript", "basics");
const visuals = [
  ["setup", "Set up the essentials lab", "npx tsc  →  node dist/app.js", "Source is typed. Output is runnable JavaScript."],
  ["primitives-inference", "Primitive types & inference", "let score = 38;  // number", "Annotate boundaries; infer obvious local values."],
  ["functions-any", "Functions, defaults & any", "add(a: number, b = 5)", "A precise signature keeps unsafe values out."],
  ["unions", "One value, several possibilities", "number | string", "Narrow the union before member-specific work."],
  ["arrays", "Arrays with honest element types", "Array<string | number>", "The brackets belong to the complete element union."],
  ["tuples", "Fixed positions with meaning", "[number, number]", "A tuple locks order, length, and member types."],
  ["objects", "Objects are contracts", "{ name: string; role: Role }", "Prefer known shapes over the misleading {} type."],
  ["record", "Dynamic keys, consistent values", "Record<string, number | string>", "Record maps a key vocabulary to a value rule."],
  ["enums", "Named choices at runtime", "Status.Published", "Enums emit an object; unions remain type-only."],
  ["literals-aliases", "A finite domain vocabulary", "'admin' | 'editor' | 'guest'", "Aliases make exact choices reusable."],
  ["returns", "Return paths tell a story", "number  •  void  •  never", "Never means normal completion cannot happen."],
  ["function-types", "Callbacks with contracts", "(message: string) => void", "Describe what may be called, not merely Function."],
  ["null-narrowing", "Absence must be handled", "string | null", "A guard turns uncertainty into a safe branch."],
  ["optional-chain", "Access safely or prove presence", "input?.value   /   form!", "Optional chaining checks; ! only asserts."],
  ["casting-unknown", "Prove unknown values step by step", "unknown  →  narrow  →  use", "Assertions do not transform runtime data."],
  ["optional-nullish", "Fallback only when truly absent", "value ?? fallback", "Nullish coalescing preserves 0, false, and empty text."],
];

const escape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const wrap = (value, width) => value.split(" ").reduce((lines, word) => {
  if (!lines.length || `${lines.at(-1)} ${word}`.length > width) lines.push(word);
  else lines[lines.length - 1] += ` ${word}`;
  return lines;
}, []);
const textLines = (value, x, y, width, size, lineHeight, color, weight = 400) => wrap(value, width)
  .map((line, index) => `<text x="${x}" y="${y + index * lineHeight}" fill="${color}" font-size="${size}" font-weight="${weight}" font-family="Arial, sans-serif">${escape(line)}</text>`)
  .join("\n");

function svg(index, title, code, note) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#071c22"/><stop offset="1" stop-color="#123b35"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="24" stdDeviation="24" flood-opacity=".35"/></filter></defs>
  <rect width="1280" height="720" rx="36" fill="url(#bg)"/>
  <circle cx="1120" cy="80" r="260" fill="#65d6b2" opacity=".07"/><circle cx="110" cy="710" r="250" fill="#f3c96b" opacity=".06"/>
  <text x="74" y="92" fill="#8ee1c3" font-size="19" font-weight="700" letter-spacing="3" font-family="Arial, sans-serif">TYPESCRIPT BASICS · ${String(index).padStart(2, "0")}</text>
  ${textLines(title, 74, 178, 22, 46, 57, "#f4faf6", 700)}
  <rect x="74" y="410" width="500" height="148" rx="22" fill="#11352f" stroke="#2f6254"/>
  <text x="105" y="453" fill="#78a99a" font-size="16" letter-spacing="2" font-family="Arial, sans-serif">WHY IT MATTERS</text>
  ${textLines(note, 105, 500, 42, 22, 31, "#d6e8e0")}
  <g filter="url(#shadow)"><rect x="655" y="154" width="555" height="410" rx="25" fill="#071715" stroke="#37675a"/><rect x="655" y="154" width="555" height="62" rx="25" fill="#14372f"/><circle cx="696" cy="185" r="7" fill="#f17878"/><circle cx="721" cy="185" r="7" fill="#efc66a"/><circle cx="746" cy="185" r="7" fill="#75d29e"/><text x="782" y="192" fill="#88a99e" font-size="17" font-family="Consolas, monospace">concept.ts</text><text x="704" y="342" fill="#65d6b2" font-size="27" font-family="Consolas, monospace">${escape(code)}</text><rect x="704" y="380" width="420" height="2" fill="#315349"/><text x="704" y="435" fill="#819e94" font-size="18" font-family="Consolas, monospace">predict  →  compile  →  explain</text></g>
  <text x="74" y="654" fill="#6e9186" font-size="16" letter-spacing="1.5" font-family="Arial, sans-serif">PROGRAMMING FOCUSED  /  ORIGINAL LESSON VISUAL</text>
  </svg>`;
}

fs.mkdirSync(output, { recursive: true });
for (const [offset, [slug, title, code, note]] of visuals.entries()) {
  const index = offset + 1;
  const file = `${String(index).padStart(2, "0")}-${slug}`;
  const source = svg(index, title, code, note);
  fs.writeFileSync(path.join(output, `${file}.svg`), source);
  await sharp(Buffer.from(source)).png().toFile(path.join(output, `${file}.png`));
}

const thumbnails = await Promise.all(visuals.map(async ([slug], offset) => {
  const file = `${String(offset + 1).padStart(2, "0")}-${slug}.png`;
  return {
    input: await sharp(path.join(output, file)).resize(300, 169).png().toBuffer(),
    left: (offset % 4) * 312,
    top: Math.floor(offset / 4) * 181,
  };
}));
await sharp({ create: { width: 1236, height: 712, channels: 3, background: "#071c22" } })
  .composite(thumbnails)
  .jpeg({ quality: 88 })
  .toFile(path.join(output, "section-2-contact-sheet.jpg"));

console.log(`Generated ${visuals.length} Section 2 visuals in ${output}`);
