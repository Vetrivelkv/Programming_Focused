import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const groups = [
  {
    folder: "ts_classes",
    label: "CLASSES & INTERFACES",
    section: "06",
    visuals: [
      ["class-blueprints", "Classes are object blueprints", "class User { ... }", "Declare fields, initialize them, then create independent instances.", "#50e3c2", "#38a3ff"],
      ["parameter-properties", "Concise, controlled state", "public name · private age", "Parameter properties remove boilerplate while modifiers protect boundaries.", "#65d6ff", "#8f7cff"],
      ["readonly-accessors-static", "Three kinds of intent", "readonly · get/set · static", "Protect bindings, mediate state changes, and place utilities on the class.", "#ffcf5a", "#ff7a90"],
      ["inheritance-protected", "Build on a base class", "extends · super · protected", "Initialize the base first and expose only the state subclasses require.", "#78e57d", "#3bb8ff"],
      ["abstract-classes", "Reusable but not constructible", "abstract class UIElement", "Share behavior through a base that only concrete elements may instantiate.", "#b58cff", "#ff6fc8"],
      ["interface-contracts", "Describe a capability", "interface Authenticatable", "Require a stable object shape without supplying runtime implementation.", "#5be6bd", "#7aa8ff"],
      ["interfaces-aliases", "Choose the right contract", "interface ↔ type alias", "Understand merging, object shapes, and callable signatures.", "#ffb85c", "#ff6f91"],
      ["implements-minimum", "Depend on a minimum shape", "class ... implements ...", "Keep APIs flexible by accepting capability contracts, not concrete classes.", "#58d7ff", "#596dff"],
      ["extend-erase", "Compose, then erase", "extends at type-check time", "Derived interfaces strengthen contracts and disappear from JavaScript output.", "#82e579", "#43c9cb"],
    ],
  },
  {
    folder: "ts_advanced",
    label: "ADVANCED TYPES",
    section: "07",
    visuals: [
      ["intersections", "Compose reusable shapes", "FileData & Status", "Intersections require every member and keep shared state in one place.", "#a98bff", "#5ad9ff"],
      ["in-guards", "Prove before access", "'path' in source", "Runtime evidence lets control flow safely narrow a union.", "#50e3c2", "#4c8dff"],
      ["discriminated-unions", "Give every branch a tag", "type: 'file' | 'db'", "Literal discriminants make branching readable, safe, and exhaustive.", "#ffca5f", "#ff718f"],
      ["instanceof-predicates", "Package reusable evidence", "instanceof · value is Type", "Use prototype checks for classes and predicates for reusable guards.", "#6fe58f", "#4bb9ff"],
      ["overloads", "Map calls precisely", "string → string · array → number", "Overload signatures preserve the relationship between input and output.", "#ff8b5e", "#ba75ff"],
      ["index-record", "Safe dynamic dictionaries", "[key: string] · Record<K,V>", "Open the key space without opening the value type.", "#54d8d0", "#6d86ff"],
      ["as-const", "Keep literal information", "as const", "Infer readonly tuples and exact values instead of broad mutable types.", "#f1dd55", "#54df9a"],
      ["satisfies", "Validate without widening", "value satisfies Contract", "Check a library contract while retaining exact keys and autocomplete.", "#ff70ad", "#8c72ff"],
    ],
  },
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

function createSvg({ index, label, section, title, code, note, accent, accentTwo }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x2="1" y2="1"><stop stop-color="#07101e"/><stop offset=".55" stop-color="#111d35"/><stop offset="1" stop-color="#172b45"/></linearGradient>
    <linearGradient id="accent"><stop stop-color="${accent}"/><stop offset="1" stop-color="${accentTwo}"/></linearGradient>
    <filter id="shadow"><feDropShadow dy="20" stdDeviation="22" flood-opacity=".45"/></filter>
  </defs>
  <rect width="1280" height="720" rx="34" fill="url(#bg)"/>
  <circle cx="1160" cy="80" r="300" fill="${accent}" opacity=".08"/><circle cx="80" cy="710" r="260" fill="${accentTwo}" opacity=".08"/>
  <path d="M70 72h205" stroke="url(#accent)" stroke-width="6" stroke-linecap="round"/>
  <text x="70" y="119" fill="${accent}" font-size="17" font-weight="700" letter-spacing="2.5" font-family="Arial, sans-serif">${escape(label)} · ${String(index).padStart(2, "0")}</text>
  ${textLines(title, 70, 210, 22, 50, 59, "#f7f9ff", 700)}
  <rect x="70" y="425" width="515" height="145" rx="24" fill="#10233a" stroke="#304b67"/>
  <text x="104" y="466" fill="#7f98b2" font-size="15" letter-spacing="2" font-family="Arial, sans-serif">MENTAL MODEL</text>
  ${textLines(note, 104, 510, 43, 21, 29, "#dce8f5")}
  <g filter="url(#shadow)">
    <rect x="642" y="143" width="572" height="430" rx="28" fill="#060d19" stroke="#3b5570"/>
    <rect x="642" y="143" width="572" height="66" rx="28" fill="#11243c"/>
    <circle cx="684" cy="176" r="7" fill="#ff718f"/><circle cx="709" cy="176" r="7" fill="#ffca62"/><circle cx="734" cy="176" r="7" fill="#55e6a5"/>
    <text x="773" y="183" fill="#839db5" font-size="17" font-family="Consolas, monospace">lesson-${section}.ts</text>
    ${textLines(code, 695, 318, 29, 27, 38, accent, 700)}
    <rect x="695" y="380" width="455" height="2" fill="#2d465f"/>
    <text x="695" y="431" fill="#8aa2b8" font-size="17" font-family="Consolas, monospace">observe → type → narrow → run</text>
    <rect x="695" y="472" width="178" height="42" rx="21" fill="url(#accent)"/>
    <text x="727" y="499" fill="#07111f" font-size="16" font-weight="700" font-family="Arial, sans-serif">SECTION ${section}</text>
  </g>
  <text x="70" y="655" fill="#617c94" font-size="16" letter-spacing="1.35" font-family="Arial, sans-serif">PROGRAMMING FOCUSED  /  ORIGINAL LESSON VISUAL</text>
  </svg>`;
}

let count = 0;
for (const group of groups) {
  const outputDir = path.join(root, "frontend", "public", "assets", "typescript", group.folder);
  fs.mkdirSync(outputDir, { recursive: true });
  for (const [zeroIndex, visual] of group.visuals.entries()) {
    const index = zeroIndex + 1;
    const [slug, title, code, note, accent, accentTwo] = visual;
    const base = `${String(index).padStart(2, "0")}-${slug}`;
    const svg = createSvg({ index, label: group.label, section: group.section, title, code, note, accent, accentTwo });
    fs.writeFileSync(path.join(outputDir, `${base}.svg`), svg);
    await sharp(Buffer.from(svg)).png().toFile(path.join(outputDir, `${base}.png`));
    count++;
  }
}

console.log(`Generated ${count} original Section 6–7 lesson visuals.`);
