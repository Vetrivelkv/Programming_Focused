import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const groups = [
  ["ts_generics", "GENERIC TYPES", "08", [
    ["generic-mental-model", "One container, precise contents", "Array<string>", "Supply a concrete type without losing reusable structure."],
    ["generic-alias", "Design a reusable value store", "DataStore<Value>", "Choose the allowed value contract at the point of use."],
    ["functions-inference", "Let calls carry type evidence", "pair<T, U>(a, b)", "Inference preserves both inputs all the way to the result."],
    ["constraints", "Flexible, inside safe boundaries", "T extends object", "Constraints reject invalid substitutions while preserving exact shapes."],
    ["classes-interfaces", "Thread one domain type through", "Repository<Entity>", "Connect constructor, storage, inputs, and outputs with one parameter."],
  ]],
  ["ts_linked_list", "GENERIC LINKED LIST", "09", [
    ["nodes-and-links", "Values connected one node at a time", "value → next?", "The final node ends the chain with an undefined next link."],
    ["generic-chain", "One T across the whole chain", "LinkedList<T> → ListNode<T>", "A number list can never link a string node."],
    ["tail-insertion", "Append without walking the list", "tail.next = node", "Link the old tail first, then advance the tail pointer."],
    ["inspect-and-run", "Traverse without exposing links", "while (current)", "Read value, follow next, stop at undefined."],
    ["insert-delete", "Rewire neighbors, preserve invariants", "previous.next = successor", "Every mutation keeps root, tail, and length consistent."],
  ]],
  ["ts_derived", "DERIVING TYPES", "10", [
    ["typeof", "Turn existing values into contracts", "typeof settings", "Reuse object and function shapes without duplicating them."],
    ["keyof", "Accept only real property names", "K extends keyof T", "Connect an accessor key to the exact object it reads."],
    ["indexed-access", "Look inside nested type structure", "T[K] · T[number]", "Extract property and array-element types with bracket notation."],
    ["mapped-types", "Project every key into a new shape", "[K in keyof T]", "Transform values and add or remove property modifiers."],
    ["template-literals", "Generate synchronized string unions", "`${keyof T}Changed`", "Compose permissions and event names from existing literals."],
    ["conditional-types", "Choose a type by structure", "T extends P ? A : B", "Model supported and impossible branches with precise results."],
    ["infer", "Capture one piece of a matched type", "(...args) => infer R", "Name the return slot and reuse it in the true branch."],
    ["utility-types", "Reach for the standard toolbox", "ReturnType · Partial · Pick", "Use proven built-ins, then create domain-specific helpers when needed."],
  ]],
  ["ts_decorators", "ECMASCRIPT DECORATORS", "11", [
    ["ecmascript-foundation", "Code that enhances class code", "@decorator", "Use the standard API without the legacy experimental flag."],
    ["class-context", "Observe a class at definition time", "ClassDecoratorContext", "Read kind and name before any instance is created."],
    ["replace-class", "Return an enhanced constructor", "class extends target", "Forward constructor arguments and add instance behavior safely."],
    ["method-context", "Wrap calls without losing semantics", "target.apply(this, args)", "Preserve receiver, parameters, and return value."],
    ["autobind", "Prepare every new instance", "context.addInitializer", "Bind detached callbacks once during instance initialization."],
    ["field-decorator", "Transform initial field values", "initialValue → replacement", "Definition-time metadata drives instance-time initialization."],
    ["factories", "Configure before decorating", "@replaceWith(value)", "A factory closes over options and returns the real decorator."],
  ]],
];

const palette = [
  ["#56e0c5", "#3c8cff"], ["#ffcf5f", "#ff6f91"], ["#8c80ff", "#e36bd7"],
  ["#65dcff", "#5368ff"], ["#7fe47d", "#20bdad"], ["#ff9a62", "#c56bff"],
];
const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const wrap = (value, limit) => value.split(" ").reduce((lines, word) => {
  if (!lines.length || `${lines.at(-1)} ${word}`.length > limit) lines.push(word);
  else lines[lines.length - 1] += ` ${word}`;
  return lines;
}, []);
const lines = (value, x, y, limit, size, step, color, weight = 400) => wrap(value, limit)
  .map((line, index) => `<text x="${x}" y="${y + index * step}" fill="${color}" font-size="${size}" font-weight="${weight}" font-family="Arial, sans-serif">${escape(line)}</text>`)
  .join("\n");

function svg({ label, section, index, title, code, note, accent, accentTwo }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x2="1" y2="1"><stop stop-color="#06101d"/><stop offset=".55" stop-color="#111f38"/><stop offset="1" stop-color="#192e49"/></linearGradient>
    <linearGradient id="glow"><stop stop-color="${accent}"/><stop offset="1" stop-color="${accentTwo}"/></linearGradient>
    <filter id="shadow"><feDropShadow dy="20" stdDeviation="20" flood-opacity=".45"/></filter>
  </defs>
  <rect width="1280" height="720" rx="34" fill="url(#bg)"/>
  <circle cx="1135" cy="90" r="295" fill="${accent}" opacity=".09"/><circle cx="65" cy="700" r="245" fill="${accentTwo}" opacity=".08"/>
  <path d="M70 72h235" stroke="url(#glow)" stroke-width="6" stroke-linecap="round"/>
  <text x="70" y="119" fill="${accent}" font-size="17" font-weight="700" letter-spacing="2.4" font-family="Arial, sans-serif">${escape(label)} · ${String(index).padStart(2, "0")}</text>
  ${lines(title, 70, 215, 23, 49, 58, "#f7f9ff", 700)}
  <rect x="70" y="430" width="520" height="145" rx="24" fill="#10243b" stroke="#304d69"/>
  <text x="104" y="471" fill="#829bb4" font-size="15" letter-spacing="2" font-family="Arial, sans-serif">WHY IT MATTERS</text>
  ${lines(note, 104, 515, 43, 21, 29, "#dce8f5")}
  <g filter="url(#shadow)">
    <rect x="645" y="143" width="569" height="432" rx="28" fill="#060d19" stroke="#3a5774"/>
    <rect x="645" y="143" width="569" height="66" rx="28" fill="#11243c"/>
    <circle cx="686" cy="176" r="7" fill="#ff718f"/><circle cx="711" cy="176" r="7" fill="#ffca62"/><circle cx="736" cy="176" r="7" fill="#55e6a5"/>
    <text x="775" y="183" fill="#839db5" font-size="17" font-family="Consolas, monospace">section-${section}.ts</text>
    ${lines(code, 696, 326, 29, 27, 39, accent, 700)}
    <rect x="696" y="389" width="452" height="2" fill="#2d465f"/>
    <text x="696" y="438" fill="#8aa2b8" font-size="17" font-family="Consolas, monospace">derive → constrain → verify</text>
    <rect x="696" y="482" width="180" height="42" rx="21" fill="url(#glow)"/>
    <text x="728" y="509" fill="#07111f" font-size="16" font-weight="700" font-family="Arial, sans-serif">SECTION ${section}</text>
  </g>
  <text x="70" y="655" fill="#627d96" font-size="16" letter-spacing="1.35" font-family="Arial, sans-serif">PROGRAMMING FOCUSED  /  ORIGINAL LESSON VISUAL</text>
  </svg>`;
}

let total = 0;
for (const [folder, label, section, visuals] of groups) {
  const output = path.join(root, "frontend", "public", "assets", "typescript", folder);
  fs.mkdirSync(output, { recursive: true });
  for (const [offset, [slug, title, code, note]] of visuals.entries()) {
    const index = offset + 1;
    const [accent, accentTwo] = palette[offset % palette.length];
    const data = svg({ label, section, index, title, code, note, accent, accentTwo });
    const base = `${String(index).padStart(2, "0")}-${slug}`;
    fs.writeFileSync(path.join(output, `${base}.svg`), data);
    await sharp(Buffer.from(data)).png().toFile(path.join(output, `${base}.png`));
    total++;
  }
}

console.log(`Generated ${total} original Section 8–11 lesson visuals.`);
