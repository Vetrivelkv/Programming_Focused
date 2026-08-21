import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(root, "frontend", "public", "assets", "typescript");

const visuals = [
  {
    file: "01-welcome",
    kicker: "GETTING STARTED · 01",
    title: "TypeScript joins the JavaScript workflow",
    summary: "Write typed source. Catch mismatches early. Ship familiar JavaScript.",
    codeTitle: "the development pipeline",
    lines: [
      ["01", "idea.ts", "#8bd5ca"],
      ["02", "  ↓  type check", "#93c5fd"],
      ["03", "idea.js", "#f5c76b"],
      ["04", "  ↓  run", "#93c5fd"],
      ["05", "browser  /  Node.js", "#d9e7ff"],
    ],
    note: "The types guide development; JavaScript remains the runtime language.",
  },
  {
    file: "02-what-is-typescript",
    kicker: "GETTING STARTED · 02",
    title: "JavaScript syntax, plus type information",
    summary: "A type annotation describes the value a function is prepared to receive.",
    codeTitle: "greeting.ts",
    lines: [
      ["01", "function greet(name: string) {", "#d9e7ff"],
      ["02", "  return `Hello, ${name}`;", "#a7f3d0"],
      ["03", "}", "#d9e7ff"],
      ["04", "", "#d9e7ff"],
      ["05", "greet(42);", "#fb7185"],
      ["→", "number is not assignable to string", "#fb7185"],
    ],
    note: "Annotations are checked, then removed from the emitted JavaScript.",
  },
  {
    file: "03-why-typescript",
    kicker: "GETTING STARTED · 03",
    title: "Catch the price bug before the browser does",
    summary: "FormData returns a value that may be text. JavaScript can concatenate it silently.",
    codeTitle: "price-calculator.ts",
    lines: [
      ["01", "function finalPrice(price: number) {", "#d9e7ff"],
      ["02", "  return price + price * 0.19;", "#a7f3d0"],
      ["03", "}", "#d9e7ff"],
      ["04", "const raw = formData.get('price');", "#f5c76b"],
      ["05", "finalPrice(raw);", "#fb7185"],
      ["→", "Convert and validate at the boundary", "#93c5fd"],
    ],
    note: "A red underline is cheaper than a wrong total in production.",
  },
  {
    file: "04-installing-typescript",
    kicker: "GETTING STARTED · 04",
    title: "Install, compile, run",
    summary: "Keep the compiler in the project and invoke the declared version with npx.",
    codeTitle: "terminal",
    lines: [
      ["$", "npm init -y", "#a7f3d0"],
      ["$", "npm i -D typescript", "#a7f3d0"],
      ["$", "npx tsc app.ts", "#a7f3d0"],
      ["✓", "emitted app.js", "#93c5fd"],
      ["$", "node app.js", "#a7f3d0"],
      ["›", "Final price: 119", "#f5c76b"],
    ],
    note: "The browser or Node.js executes the generated .js file—not the type annotations.",
  },
  {
    file: "05-editor-setup",
    kicker: "GETTING STARTED · 05",
    title: "Let the editor expose assumptions",
    summary: "VS Code includes TypeScript language support and understands null-aware DOM APIs.",
    codeTitle: "form.ts",
    lines: [
      ["01", "const input = document.getElementById(", "#d9e7ff"],
      ["02", "  'user-name'", "#a7f3d0"],
      ["03", ") as HTMLInputElement | null;", "#d9e7ff"],
      ["04", "", "#d9e7ff"],
      ["05", "if (!input) throw new Error('Missing');", "#f5c76b"],
      ["06", "console.log(input.value);", "#93c5fd"],
    ],
    note: "Open the whole folder so editor diagnostics and tsconfig settings work together.",
  },
  {
    file: "06-course-roadmap",
    kicker: "GETTING STARTED · 06",
    title: "From essentials to real applications",
    summary: "The course layers language concepts, tooling, architecture, and integrations.",
    codeTitle: "learning roadmap",
    lines: [
      ["01", "Essential & custom types", "#8bd5ca"],
      ["02", "Compiler configuration", "#93c5fd"],
      ["03", "Classes, interfaces, generics", "#f5c76b"],
      ["04", "Modules & third-party libraries", "#c4b5fd"],
      ["05", "React + TypeScript", "#67e8f9"],
      ["06", "Node + Express + TypeScript", "#a7f3d0"],
    ],
    note: "Theory is repeatedly connected to demo projects and practical workflows.",
  },
  {
    file: "07-learn-effectively",
    kicker: "GETTING STARTED · 07",
    title: "Watching introduces it. Practice makes it yours.",
    summary: "Follow the curriculum first, then change examples and build small experiments.",
    codeTitle: "the active-learning loop",
    lines: [
      ["1", "Watch with intention", "#8bd5ca"],
      ["2", "Code along from memory", "#93c5fd"],
      ["3", "Change one assumption", "#f5c76b"],
      ["4", "Predict the diagnostic", "#c4b5fd"],
      ["5", "Use it in a small project", "#a7f3d0"],
      ["↻", "Revisit difficult ideas", "#67e8f9"],
    ],
    note: "Do not copy perfectly—deviate deliberately and explain what changed.",
  },
  {
    file: "08-course-setup",
    kicker: "GETTING STARTED · 08",
    title: "A reproducible TypeScript practice lab",
    summary: "Node.js, VS Code, a local compiler, source files, and generated output.",
    codeTitle: "typescript-lab/",
    lines: [
      ["├─", "src/index.ts", "#8bd5ca"],
      ["├─", "dist/index.js", "#f5c76b"],
      ["├─", "package.json", "#93c5fd"],
      ["└─", "tsconfig.json", "#c4b5fd"],
      ["$", "npx tsc", "#a7f3d0"],
      ["$", "node dist/index.js", "#a7f3d0"],
    ],
    note: "Keep source and generated output separate; version the configuration, not dist.",
  },
];

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function wrapWords(value, limit) {
  return value.split(" ").reduce((lines, word) => {
    const current = lines.at(-1);
    if (!current || `${current} ${word}`.length > limit) lines.push(word);
    else lines[lines.length - 1] = `${current} ${word}`;
    return lines;
  }, []);
}

function createTextLines(value, { x, y, limit, lineHeight, ...attributes }) {
  const attributeString = Object.entries(attributes)
    .map(([key, attributeValue]) => `${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="${attributeValue}"`)
    .join(" ");
  return wrapWords(value, limit).map((line, index) => (
    `<text x="${x}" y="${y + index * lineHeight}" ${attributeString}>${escapeXml(line)}</text>`
  )).join("\n  ");
}

function createSvg(visual) {
  const titleLines = wrapWords(visual.title, 25);
  const title = createTextLines(visual.title, {
    x: 68, y: 190, limit: 25, lineHeight: 57, fill: "#f8fafc", fontSize: 48,
    fontWeight: 700, fontFamily: "Arial, sans-serif",
  });
  const summary = createTextLines(visual.summary, {
    x: 68, y: 190 + titleLines.length * 57 + 25, limit: 43, lineHeight: 36,
    fill: "#9fb3c8", fontSize: 24, fontFamily: "Arial, sans-serif",
  });
  const note = createTextLines(visual.note, {
    x: 100, y: 492, limit: 43, lineHeight: 31, fill: "#d9e7ff", fontSize: 21,
    fontFamily: "Arial, sans-serif",
  });
  const codeLines = visual.lines.map(([number, line, color], index) => {
    const y = 273 + index * 53;
    return `<text x="735" y="${y}" fill="#60718f" font-size="18" font-family="Consolas, monospace">${escapeXml(number)}</text>
      <text x="785" y="${y}" fill="${color}" font-size="21" font-family="Consolas, monospace">${escapeXml(line)}</text>`;
  }).join("\n      ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="background" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#08141f"/>
      <stop offset="1" stop-color="#102a36"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" x2="1">
      <stop offset="0" stop-color="#2dd4bf"/>
      <stop offset="1" stop-color="#60a5fa"/>
    </linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="20" stdDeviation="22" flood-color="#020617" flood-opacity="0.5"/></filter>
  </defs>
  <rect width="1280" height="720" rx="34" fill="url(#background)"/>
  <circle cx="1100" cy="70" r="230" fill="#2dd4bf" opacity="0.055"/>
  <circle cx="1180" cy="690" r="330" fill="#60a5fa" opacity="0.055"/>
  <rect x="68" y="58" width="160" height="5" rx="2.5" fill="url(#accent)"/>
  <text x="68" y="113" fill="#8bd5ca" font-size="20" font-weight="700" font-family="Arial, sans-serif" letter-spacing="3">${escapeXml(visual.kicker)}</text>
  ${title}
  ${summary}
  <rect x="68" y="410" width="520" height="170" rx="24" fill="#122c38" stroke="#25495a"/>
  <text x="100" y="458" fill="#60718f" font-size="17" font-family="Arial, sans-serif" letter-spacing="2">KEY IDEA</text>
  ${note}
  <g filter="url(#shadow)">
    <rect x="680" y="144" width="530" height="470" rx="24" fill="#07111b" stroke="#274052"/>
    <rect x="680" y="144" width="530" height="58" rx="24" fill="#12202d"/>
    <circle cx="715" cy="173" r="7" fill="#fb7185"/>
    <circle cx="739" cy="173" r="7" fill="#f5c76b"/>
    <circle cx="763" cy="173" r="7" fill="#4ade80"/>
    <text x="800" y="180" fill="#8fa5ba" font-size="18" font-family="Consolas, monospace">${escapeXml(visual.codeTitle)}</text>
    ${codeLines}
  </g>
  <text x="68" y="660" fill="#60718f" font-size="17" font-family="Arial, sans-serif">PROGRAMMING FOCUSED  /  ORIGINAL LESSON VISUAL</text>
</svg>`;
}

fs.mkdirSync(outputDirectory, { recursive: true });
for (const visual of visuals) {
  fs.writeFileSync(path.join(outputDirectory, `${visual.file}.svg`), createSvg(visual));
}

console.log(`Generated ${visuals.length} TypeScript lesson visuals in ${outputDirectory}`);
