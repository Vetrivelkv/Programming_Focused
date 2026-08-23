import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const curriculumPath = path.join(root, "backend", "data", "typescript_curriculum.json");
const questionsPath = path.join(root, "backend", "data", "typescript_questions.json");
const topicName = "Section 2 · TypeScript Basics & Basic Types";

const q = (question, options, correct, explanation) => ({ type: "mcq", question, options, correct, explanation });
const module = (number, slug, title, content, questions) => ({
  id: `ts_basics_${String(number).padStart(2, "0")}`,
  title,
  image: `/assets/typescript/basics/${String(number).padStart(2, "0")}-${slug}.png`,
  content: content.replaceAll("\\`", "`"),
  questions,
});

const subtopics = [
  module(1, "setup", "Set Up the TypeScript Essentials Lab", String.raw`# Set Up the TypeScript Essentials Lab

This section uses small files so each type rule is visible. Node.js runs the emitted JavaScript; it does not make TypeScript types exist at runtime.

\`\`\`bash
mkdir ts-essentials
cd ts-essentials
npm init -y
npm install --save-dev typescript
npx tsc --init
\`\`\`

Create \`src/basics.ts\`, compile it, then run the output:

\`\`\`ts
console.log('TypeScript essentials ready');
\`\`\`

\`\`\`bash
npx tsc
node dist/basics.js
\`\`\`

Keep source and output separate. Your editor analyses \`.ts\`; Node executes \`.js\`. When experimenting with a single file, \`npx tsc src/basics.ts\` is enough, but a configured project gives every file the same strict rules.`, [
    q("Which file does Node.js normally execute in this workflow?", ["The emitted JavaScript file", "tsconfig.json", "The TypeScript source as a browser stylesheet", "package-lock.json only"], 0, "TypeScript is checked and emitted before Node executes JavaScript."),
    q("Why use a project-local TypeScript dependency?", ["It keeps the compiler version reproducible", "It removes Node.js", "It turns types into runtime values", "It deploys automatically"], 0, "The compiler version is recorded with the project."),
  ]),
  module(2, "primitives-inference", "Primitive Types & Type Inference", String.raw`# Primitive Types & Type Inference

The everyday primitive types are \`string\`, \`number\`, and \`boolean\`. Lowercase names describe JavaScript values; uppercase \`String\` and \`Number\` describe wrapper objects and are rarely what application code wants.

\`\`\`ts
let userName: string;
let userAge = 38;       // inferred as number
let isInstructor = true; // inferred as boolean

userName = 'Mira';
userAge = 39;
// userAge = '39'; // error: string is not assignable to number
\`\`\`

Inference is not weaker than an annotation. TypeScript reads the initializer and remembers its type. Add annotations when a variable has no useful initializer or when an exported boundary deserves explicit documentation; otherwise let obvious local values speak for themselves.

JavaScript also has runtime types: \`typeof userName\` returns \`'string'\`. TypeScript uses static knowledge before execution, while \`typeof\` inspects the current runtime value.`, [
    q("What type is inferred for `let count = 3`?", ["number", "string", "any", "Number[]"], 0, "A numeric initializer gives the variable the number type."),
    q("Which annotation normally describes text values?", ["string", "String", "text", "char[]"], 0, "Use the lowercase primitive type string."),
  ]),
  module(3, "functions-any", "Function Parameters, Defaults & `any`", String.raw`# Function Parameters, Defaults & any

Parameters need types unless inference comes from a contextual function type. Defaults are values, so TypeScript can infer from them.

\`\`\`ts
function add(a: number, b = 5): number {
  return a + b;
}

add(10);
add(10, 6);
// add('10');
\`\`\`

An untyped value can become \`any\`. \`any\` permits almost every operation and then spreads through later expressions:

\`\`\`ts
let payload: any = JSON.parse('{"score": 9}');
payload.missing.deep.call(); // checker stays silent
\`\`\`

Use \`any\` only at deliberate escape hatches while migrating or integrating genuinely untyped code. Prefer \`unknown\` for external data because it forces proof before use.`, [
    q("Why does parameter `b = 5` not need `: number`?", ["The default value allows inference", "All parameters are numbers", "Defaults disable checking", "Node assigns the type"], 0, "The numeric default supplies enough information."),
    q("What is the main cost of `any`?", ["It opts out of useful checking", "It prevents JavaScript emission", "It makes values immutable", "It only accepts strings"], 0, "Any allows unsafe operations and can spread lost type information."),
  ]),
  module(4, "unions", "Union Types: One Value, Several Possibilities", String.raw`# Union Types

A union describes every value a variable may legitimately hold.

\`\`\`ts
let age: number | string = 36;
age = '37';
// age = false;
\`\`\`

Before using a member-specific operation, narrow the union:

\`\`\`ts
function normalizeId(id: number | string): string {
  if (typeof id === 'number') {
    return id.toFixed(0);
  }
  return id.trim().toLowerCase();
}
\`\`\`

Do not add union members merely to silence errors. Each member should reflect a real domain state, and every consumer should handle those states.`, [
    q("What does `string | number` mean?", ["The value may be a string or a number", "The value is both at runtime", "The value is always any", "The value is an array"], 0, "A union lists valid alternatives."),
    q("Why use `typeof` inside `normalizeId`?", ["To narrow the union", "To cast at runtime", "To compile the file", "To create a tuple"], 0, "The check proves which operations are safe in each branch."),
  ]),
  module(5, "arrays", "Arrays & Generic Array Syntax", String.raw`# Arrays & Generic Array Syntax

TypeScript infers an array's element type from its initial values.

\`\`\`ts
let hobbies = ['cycling', 'cooking']; // string[]
hobbies.push('reading');
// hobbies.push(10);
\`\`\`

Annotate an initially empty or deliberately mixed array:

\`\`\`ts
let results: (string | number)[] = [];
results = [1, 'pass'];

let history: Array<string | number> = ['start', 1];
\`\`\`

\`T[]\` and \`Array<T>\` express the same array type. Parentheses matter in \`(string | number)[]\`: without them, the brackets would attach only to the nearest type. The generic syntax is often easier to read for complex element types.`, [
    q("Which type accepts an array containing strings and numbers?", ["(string | number)[]", "string | number[]", "[string, number, boolean]", "Record<string, number>"], 0, "The parentheses make the union the element type."),
    q("How does `Array<string>` relate to `string[]`?", ["They describe the same array type", "It creates a tuple", "It disables inference", "It describes a string object"], 0, "They are alternative type syntaxes."),
  ]),
  module(6, "tuples", "Tuples: Fixed Positions with Meaning", String.raw`# Tuples

A tuple describes a fixed sequence where each position has its own type.

\`\`\`ts
type MatchResult = [number, number];

const score: MatchResult = [3, 1];
const home = score[0];
const away = score[1];
// const broken: MatchResult = [3, 1, 0];
\`\`\`

Tuples are useful for compact pairs such as coordinates or success/error results. Prefer an object when callers need named fields or the record will grow:

\`\`\`ts
type Score = { home: number; away: number };
\`\`\`

An ordinary \`(number | string)[]\` does not guarantee order or length; a tuple does.`, [
    q("What does `[number, string]` guarantee?", ["Two ordered positions with those types", "Any number of mixed values", "A key-value record", "A numeric array only"], 0, "A tuple fixes position, length, and member types."),
    q("When is an object clearer than a tuple?", ["When fields benefit from names", "When order matters", "When there are exactly two values", "Never"], 0, "Named properties communicate domain meaning and scale better."),
  ]),
  module(7, "objects", "Object Types, Nested Shapes & the `{}` Trap", String.raw`# Object Types & Nested Shapes

Object types describe the properties code may read and write.

\`\`\`ts
type User = {
  name: string;
  age: number | string;
  hobbies: string[];
  role: { id: number; description: string };
};

const user: User = {
  name: 'Mira',
  age: 38,
  hobbies: ['coding'],
  role: { id: 5, description: 'admin' },
};
\`\`\`

The type \`{}\` does **not** mean “an empty object”. It means any value except \`null\` and \`undefined\`, so strings and numbers fit it. Use a specific object shape when properties are known, \`object\` for a non-primitive object, or \`Record\` for dynamic keys.`, [
    q("What does TypeScript's `{}` type exclude?", ["null and undefined", "All strings", "All numbers", "Every object with a property"], 0, "The empty object type accepts any non-nullish value."),
    q("Why extract a `User` alias?", ["It gives a reusable name to the object contract", "It validates network data", "It creates a class instance", "It emits a database table"], 0, "Aliases reduce repetition and communicate intent."),
  ]),
  module(8, "record", "Flexible Objects with `Record`", String.raw`# Flexible Objects with Record

Use \`Record<Key, Value>\` when property names are not known in advance but every value follows a rule.

\`\`\`ts
type Metric = number | string;
let metrics: Record<string, Metric>;

metrics = {
  requests: 120,
  region: 'ap-south',
};
\`\`\`

The first generic argument constrains keys; the second constrains values. A record is more honest than inventing placeholder properties, but a named object type is better when fields have distinct meanings.

\`\`\`ts
type Permission = 'read' | 'write';
type Grants = Record<Permission, boolean>;
\`\`\`

This second example also proves that every required permission key is present.`, [
    q("What does `Record<string, number>` describe?", ["String keys with numeric values", "A tuple", "Only one named property", "A function type"], 0, "Record maps the allowed key type to a value type."),
    q("When is a named object shape preferable?", ["When properties have different meanings and types", "Whenever keys are dynamic", "Only for empty objects", "Never"], 0, "Explicit properties better document fixed domain fields."),
  ]),
  module(9, "enums", "Enums & Runtime Choices", String.raw`# Enums

Enums create named choices and also emit a JavaScript object.

\`\`\`ts
enum Role {
  Admin,
  Editor,
  Guest,
}

const currentRole = Role.Editor;
\`\`\`

Numeric members default to \`0\`, \`1\`, \`2\`, though explicit string values are clearer at network or storage boundaries:

\`\`\`ts
enum Status {
  Draft = 'draft',
  Published = 'published',
}
\`\`\`

Because enums have runtime output, use them when that named runtime object is valuable. Literal unions often produce simpler JavaScript and interoperate naturally with JSON.`, [
    q("What is distinctive about a regular enum?", ["It produces a runtime object", "It is erased exactly like every type alias", "It accepts every string", "It can only contain booleans"], 0, "Enums differ from type-only constructs because code is emitted."),
    q("Why might string enum values be preferable at a boundary?", ["They are readable and stable in serialized data", "They disable checking", "They become tuples", "They remove JavaScript"], 0, "Descriptive string values are easier to inspect and exchange."),
  ]),
  module(10, "literals-aliases", "Literal Types & Reusable Aliases", String.raw`# Literal Types & Type Aliases

A literal type allows one exact value. Combine literals into a finite vocabulary:

\`\`\`ts
type Role = 'admin' | 'editor' | 'guest' | 'reader';

let userRole: Role = 'admin';
userRole = 'guest';
// userRole = 'owner';
\`\`\`

Aliases can name larger contracts and reuse the literal union:

\`\`\`ts
type User = {
  name: string;
  age: number;
  role: Role;
  permissions: string[];
};

function canEdit(role: Role): boolean {
  return role === 'admin' || role === 'editor';
}
\`\`\`

Literal types can also constrain tuple positions. Here each result must be exactly \`1\` or \`-1\`:

\`\`\`ts
type Comparison = [1 | -1, 1 | -1];

const comparison: Comparison = [1, -1];
// const invalid: Comparison = [0, 1];
\`\`\`

Literal unions are type-only: they add no runtime lookup object. They are ideal for existing strings from HTML, JSON, and APIs.`, [
    q("Which value fits the type `'open' | 'closed'`?", ["'open'", "'pending'", "true", "0"], 0, "Only the listed literal values are accepted."),
    q("Do type aliases create runtime JavaScript objects?", ["No, they are erased", "Yes, always", "Only in Node.js", "Only for strings"], 0, "Aliases describe types for the checker and are not emitted."),
  ]),
  module(11, "returns", "Return Types, `void` & `never`", String.raw`# Return Types, void & never

TypeScript normally infers a function's return type. An explicit annotation documents an exported contract or verifies intent.

\`\`\`ts
function add(a: number, b: number): number {
  return a + b;
}

function log(message: string): void {
  console.log(message);
}

function fail(message: string): never {
  throw new Error(message);
}
\`\`\`

\`void\` means callers should not rely on a returned value. \`never\` means normal completion is impossible: the function always throws or loops forever. \`undefined\` is an actual value; it is not interchangeable with \`never\`.`, [
    q("Which return type fits a function that always throws?", ["never", "void", "undefined", "any[]"], 0, "No reachable normal return produces a value."),
    q("What does `void` communicate?", ["The return value should not be used", "The function cannot execute", "The function always throws", "The parameter is optional"], 0, "Void describes an intentionally ignored return result."),
  ]),
  module(12, "function-types", "Functions as Types & Safe Callbacks", String.raw`# Functions as Types

Function types describe parameters and results, not merely “some function”.

\`\`\`ts
type Logger = (message: string) => void;

const logMessage: Logger = (message) => {
  console.log(message);
};

function performJob(callback: Logger): void {
  callback('Job done');
}
\`\`\`

Methods use the same idea inside object types:

\`\`\`ts
type User = {
  name: string;
  greet: () => string;
};

const user: User = {
  name: 'Mira',
  greet() { return this.name; },
};
\`\`\`

Avoid the broad \`Function\` type: it does not tell callers which arguments or return value are safe.`, [
    q("What does `(message: string) => void` describe?", ["A function accepting a string whose result is ignored", "An array of strings", "A string alias", "A class"], 0, "The arrow separates parameters from the return type."),
    q("Why avoid the `Function` type?", ["It loses the callable signature", "It cannot represent callbacks", "It only works in browsers", "It forces every function to throw"], 0, "A precise signature protects both callers and implementations."),
  ]),
  module(13, "null-narrowing", "`null`, `undefined` & Type Narrowing", String.raw`# null, undefined & Narrowing

With strict null checks, absence must be part of the type.

\`\`\`ts
let label: string | null = 'Ready';
label = null;

function printLength(value: string | null) {
  if (value === null) return;
  console.log(value.length); // narrowed to string
}
\`\`\`

\`null\` is deliberate absence; \`undefined\` commonly means a value was not supplied or a property was not found. Inferred \`null\` stays narrow under strict settings, so annotate a wider union when later assignment is intended.

Truthiness can narrow, but it also rejects valid empty strings and zero. Prefer an explicit nullish comparison when those values matter.`, [
    q("What happens after `if (value === null) return`?", ["The remaining branch sees value as string", "Value becomes any", "Null is converted to an empty string", "The function becomes never"], 0, "Control-flow analysis removes the handled union member."),
    q("Why can a truthiness check be too broad?", ["It also rejects values such as empty string and zero", "It cannot check null", "It changes runtime types", "It creates an enum"], 0, "Falsy values are not always missing values."),
  ]),
  module(14, "optional-chain", "Optional Chaining & Non-Null Assertions", String.raw`# Optional Chaining & Non-Null Assertions

DOM lookups and nested data can be absent. Optional chaining stops safely and returns \`undefined\`.

\`\`\`ts
const input = document.getElementById('user-name') as HTMLInputElement | null;
console.log(input?.value);
\`\`\`

The non-null assertion tells the checker absence is impossible:

\`\`\`ts
const form = document.querySelector('form')!;
form.addEventListener('submit', handleSubmit);
\`\`\`

\`!\` performs no runtime check. Use it only when another invariant truly guarantees the value. For reusable code, an explicit guard gives both safety and a useful failure message:

\`\`\`ts
if (!input) throw new Error('User-name input is missing');
console.log(input.value);
\`\`\`
`, [
    q("What can `input?.value` produce when input is null?", ["undefined", "A guaranteed string", "never", "A compiler crash"], 0, "Optional chaining returns undefined instead of accessing the missing value."),
    q("What runtime validation does postfix `!` add?", ["None", "A null check", "A string conversion", "An exception automatically"], 0, "The assertion changes only the checker's assumption."),
  ]),
  module(15, "casting-unknown", "Type Assertions & the `unknown` Type", String.raw`# Type Assertions & unknown

An assertion supplies more specific static knowledge; it does not convert a value.

\`\`\`ts
const input = document.getElementById('user-name') as HTMLInputElement | null;
\`\`\`

Use \`unknown\` for data whose type is not yet proven:

\`\`\`ts
function process(value: unknown): void {
  if (
    typeof value === 'object' &&
    value !== null &&
    'log' in value &&
    typeof value.log === 'function'
  ) {
    value.log();
  }
}
\`\`\`

The checks progress from broad to specific: object, non-null, property exists, property is callable. This is safer than \`any\`, which would allow \`value.log()\` immediately. Assertions belong where you possess real knowledge the compiler cannot derive; otherwise narrow or validate.`, [
    q("What does `as HTMLInputElement` do at runtime?", ["Nothing; it changes static analysis", "It creates an input element", "It validates the DOM", "It converts a string"], 0, "Assertions are erased during compilation."),
    q("Why is `unknown` safer than `any`?", ["It requires narrowing before operations", "It accepts fewer runtime values", "It emits a validator", "It is always a string"], 0, "Unknown preserves uncertainty until code proves capabilities."),
  ]),
  module(16, "optional-nullish", "Optional Values & Nullish Coalescing", String.raw`# Optional Values & Nullish Coalescing

\`?\` marks a parameter or property as optional, which introduces \`undefined\`.

\`\`\`ts
function generateError(message?: string): never {
  throw new Error(message ?? 'Unknown error');
}

type User = {
  name: string;
  role?: 'admin' | 'guest';
};
\`\`\`

Nullish coalescing uses its right side only for \`null\` or \`undefined\`:

\`\`\`ts
const rawInput = '';
const withOr = rawInput || 'fallback'; // 'fallback'
const withNullish = rawInput ?? 'fallback'; // ''
\`\`\`

Use \`??\` when empty string, \`0\`, or \`false\` are legitimate values. Use \`||\` when every falsy value should trigger the fallback. Parentheses clarify mixed expressions because JavaScript restricts combining \`??\` directly with \`&&\` or \`||\`.`, [
    q("What type does `message?: string` imply?", ["string | undefined", "string | null only", "any", "never"], 0, "An omitted optional parameter has the value undefined."),
    q("When does `value ?? fallback` use the fallback?", ["Only when value is null or undefined", "For every falsy value", "Only for empty strings", "Only for zero"], 0, "Nullish coalescing preserves valid falsy values."),
  ]),
];

const curriculum = JSON.parse(fs.readFileSync(curriculumPath, "utf8"));
curriculum.topics = curriculum.topics.filter((topic) => topic.name !== topicName);
curriculum.topics.push({ name: topicName, subtopics });
fs.writeFileSync(curriculumPath, `${JSON.stringify(curriculum, null, 2)}\n`);

const challengeQuestions = [
  ["Which declaration best models a value that may be a numeric ID or a text ID?", ["number | string", "number & string", "any[]", "[number, string]"], 0, "A union lists legitimate alternatives."],
  ["What is inferred for `const active = false`?", ["false", "any", "string", "undefined"], 0, "A const primitive keeps its literal type, which is assignable to boolean."],
  ["Which type fixes both order and length?", ["[string, number]", "(string | number)[]", "Array<unknown>", "Record<string, number>"], 0, "A tuple assigns a type to each fixed position."],
  ["Which type describes unknown string keys whose values are booleans?", ["Record<string, boolean>", "boolean[]", "{}", "[string, boolean]"], 0, "Record maps a key type to a value type."],
  ["Which construct produces a runtime lookup object?", ["A regular enum", "A type alias", "A union", "A tuple annotation"], 0, "Enums emit JavaScript; the other constructs are type-only."],
  ["What should replace broad `Function` for a callback?", ["A precise signature such as `(value: string) => void`", "any", "object", "never"], 0, "A signature checks arguments and results."],
  ["A function always throws. Which return type communicates that?", ["never", "void", "null", "unknown"], 0, "Never means normal completion is unreachable."],
  ["What must happen before accessing a property on `unknown`?", ["Narrow or validate the value", "Cast it to any automatically", "Put it in an array", "Make it optional"], 0, "Unknown requires evidence before operations."],
  ["What does a type assertion do to the runtime value?", ["Nothing", "It converts it", "It validates it", "It freezes it"], 0, "Assertions are removed during compilation."],
  ["Which operator preserves `0`, `false`, and empty string while replacing nullish values?", ["??", "||", "&&", "!"], 0, "Nullish coalescing falls back only for null and undefined."],
  ["What is a safe response to a possibly missing DOM input?", ["Narrow it with a guard before using `.value`", "Use any everywhere", "Rename the file", "Assume `!` validates it"], 0, "A guard checks the runtime condition and narrows the type."],
  ["Why is `{}` usually a poor object model?", ["It accepts every non-nullish value", "It accepts only empty objects", "It means unknown keys", "It creates a runtime object"], 0, "The empty object type is much broader than its spelling suggests."],
];
const questions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
questions.topics = questions.topics.filter((topic) => topic.name !== topicName);
questions.topics.push({
  name: topicName,
  rounds: [{
    round_number: 1,
    title: "TypeScript Basics Mastery Challenge",
    questions: challengeQuestions.map(([question, options, correct_option_index, explanation]) => ({ type: "mcq", question, options, correct_option_index, explanation })),
  }],
});
fs.writeFileSync(questionsPath, `${JSON.stringify(questions, null, 2)}\n`);

console.log(`Built ${subtopics.length} modules and ${challengeQuestions.length} mastery questions for ${topicName}.`);
