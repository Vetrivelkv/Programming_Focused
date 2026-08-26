import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const curriculumPath = path.join(root, "backend", "data", "typescript_curriculum.json");
const questionsPath = path.join(root, "backend", "data", "typescript_questions.json");
const section3Name = "Section 3 · The TypeScript Compiler & Configuration";
const section4Name = "Section 4 · TypeScript Essentials Demo Project";

const q = (question, options, correct, explanation) => ({ type: "mcq", question, options, correct, explanation });
const lesson = (prefix, number, slug, title, content, questions) => ({
  id: `${prefix}_${String(number).padStart(2, "0")}`,
  title,
  image: `/assets/typescript/${prefix}/${String(number).padStart(2, "0")}-${slug}.png`,
  content: content.replaceAll("\\`", "`").replaceAll("\\${", "${"),
  questions,
});

const section3 = [
  lesson("ts_compiler", 1, "project-setup", "Create a Configured TypeScript Project", String.raw`# Create a Configured TypeScript Project

Running \`npx tsc file.ts\` compiles one file with command-line defaults. A \`tsconfig.json\` turns a folder into a project: the editor, CI, and every developer share one compiler contract.

\`\`\`bash
mkdir compiler-lab
cd compiler-lab
npm init -y
npm install --save-dev typescript
npx tsc --init
mkdir src
\`\`\`

Put authored files in \`src\` and emitted JavaScript in \`dist\`. From this point, run \`npx tsc\` without a filename so the compiler discovers the project configuration.

## Complete subclass code — \`tsconfig.json\`

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "noEmitOnError": true
  },
  "include": ["src"]
}
\`\`\``, [
    q("What makes TypeScript treat a folder as a configured project?", ["tsconfig.json", "index.html", "README.md", ".gitignore"], 0, "The compiler searches for tsconfig.json to establish project-wide settings."),
    q("Why run `npx tsc` without a filename here?", ["It loads the project configuration", "It skips type checking", "It runs Node.js", "It deletes dist"], 0, "Passing no filename lets tsc compile the configured project."),
  ]),
  lesson("ts_compiler", 2, "target-libs", "Choose `target` and Runtime Libraries", String.raw`# Choose target and Runtime Libraries

\`target\` controls the JavaScript syntax TypeScript emits. \`lib\` controls the built-in APIs the checker knows about. They answer different questions: “What syntax can the runtime execute?” and “Which platform globals are available?”

\`\`\`ts
const scores = [10, 20, 30];
const latest = scores.at(-1);

document.querySelector('#output')?.append(String(latest));
\`\`\`

\`ES2022\` supplies modern JavaScript declarations such as \`Array.prototype.at\`; \`DOM\` supplies browser declarations such as \`document\`. A Node-only project normally omits \`DOM\` and installs Node type declarations instead.

## Complete subclass code — \`tsconfig.json\`

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true
  },
  "include": ["src"]
}
\`\`\``, [
    q("What does `target` primarily control?", ["Emitted JavaScript syntax", "Which source files are included", "npm package versions", "Git branches"], 0, "Target selects the JavaScript language level for emitted output."),
    q("Why add `DOM` to `lib`?", ["To type browser APIs such as document", "To install a browser", "To enable Node imports", "To create HTML"], 0, "Library declaration files describe platform APIs to the checker."),
  ]),
  lesson("ts_compiler", 3, "input-emission", "Control File Input & Emitted Output", String.raw`# Control File Input & Emitted Output

\`rootDir\` and \`outDir\` preserve a clean source/output boundary. Top-level \`include\` and \`exclude\` decide which files belong to the program; they are not compiler options.

\`\`\`text
compiler-lab/
├─ src/app.ts
├─ src/app.test.ts
├─ dist/app.js
└─ tsconfig.json
\`\`\`

Source maps connect a debugger's generated JavaScript location back to TypeScript. \`noEmitOnError\` prevents stale or invalid builds from becoming deployable output.

## Complete subclass code — \`tsconfig.json\`

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "sourceMap": true,
    "removeComments": true,
    "noEmitOnError": true,
    "strict": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.test.ts", "node_modules"]
}
\`\`\``, [
    q("Where do `include` and `exclude` belong?", ["At the top level of tsconfig.json", "Inside compilerOptions", "Inside package-lock.json", "Inside every source file"], 0, "They select the program's file set and are siblings of compilerOptions."),
    q("What does `noEmitOnError` prevent?", ["Output when type errors exist", "Editor diagnostics", "Source maps", "npm installation"], 0, "The compiler withholds generated files when checking fails."),
  ]),
  lesson("ts_compiler", 4, "strict-checking", "Configure Strict Type Checking", String.raw`# Configure Strict Type Checking

\`strict\` enables a coordinated family of checks, including implicit-any detection and null awareness. Start new projects with it enabled; loosening one rule should be an explicit migration choice.

\`\`\`ts
type User = { name: string; nickname?: string };

function displayName(user: User): string {
  return user.nickname?.trim() || user.name;
}
\`\`\`

\`noUncheckedIndexedAccess\` adds \`undefined\` when an index might be missing. \`exactOptionalPropertyTypes\` distinguishes an omitted property from a present property whose value is \`undefined\`.

## Complete subclass code — \`tsconfig.json\`

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "useUnknownInCatchVariables": true,
    "noEmitOnError": true
  },
  "include": ["src"]
}
\`\`\``, [
    q("What does `strict` do?", ["Enables a family of strict type checks", "Minifies JavaScript", "Runs tests", "Installs declaration packages"], 0, "Strict is the umbrella setting for multiple safety checks."),
    q("What does `noUncheckedIndexedAccess` add to uncertain indexed reads?", ["undefined", "never", "any", "null only"], 0, "An array or record index may not exist at runtime."),
  ]),
  lesson("ts_compiler", 5, "quality-checks", "Enable Code-Quality Diagnostics", String.raw`# Enable Code-Quality Diagnostics

Type correctness and code quality overlap but are not identical. Compiler quality checks reveal abandoned variables, forgotten returns, accidental switch fallthrough, and unsafe overrides.

\`\`\`ts
function formatScore(score: number): string {
  if (score >= 90) return 'excellent';
  if (score >= 60) return 'pass';
  return 'retry';
}
\`\`\`

These checks work well in CI, but use them deliberately: library callback signatures sometimes require parameters you do not read, and generated files should be excluded rather than “fixed”.

## Complete subclass code — \`tsconfig.json\`

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "forceConsistentCasingInFileNames": true,
    "noEmitOnError": true
  },
  "include": ["src"]
}
\`\`\``, [
    q("Which option reports a function path without an explicit result?", ["noImplicitReturns", "sourceMap", "allowJs", "target"], 0, "It checks that return behaviour is consistent across reachable paths."),
    q("Why enable casing consistency?", ["Imports then work consistently across operating systems", "It changes variable names", "It minifies output", "It installs Git"], 0, "Case-sensitive and case-insensitive file systems otherwise disagree."),
  ]),
  lesson("ts_compiler", 6, "deep-dive", "Read a Production `tsconfig.json`", String.raw`# Read a Production tsconfig.json

Read configuration by responsibility instead of memorising hundreds of switches: language environment, modules, JavaScript support, emission, interoperability, checking, and file selection.

For a modern Node project, \`NodeNext\` keeps module checking aligned with Node's package rules. \`esModuleInterop\` smooths CommonJS imports. \`skipLibCheck\` skips checking declaration-file internals, not your application code.

## Complete subclass code — \`tsconfig.json\`

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "sourceMap": true,
    "declaration": true,
    "noEmitOnError": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["dist", "node_modules", "**/*.test.ts"]
}
\`\`\``, [
    q("What does `skipLibCheck` skip?", ["Checking declaration-file internals", "Checking your application", "Emitting JavaScript", "Resolving imports"], 0, "It applies to .d.ts library files, not ordinary project source."),
    q("Why pair NodeNext module and resolution settings?", ["To model Node's module rules consistently", "To enable DOM APIs", "To remove package.json", "To run CSS"], 0, "Both emission and lookup then follow Node's ESM/CommonJS semantics."),
  ]),
  lesson("ts_compiler", 7, "compile-watch", "Compile the Project & Use Watch Mode", String.raw`# Compile the Project & Use Watch Mode

\`npx tsc\` performs one project build. \`npx tsc --watch\` keeps the compiler alive, watches included files, and rebuilds after changes.

\`\`\`bash
npm run build
npm run dev:types
node dist/app.js
\`\`\`

Watch mode is feedback, not a production process manager. It does not automatically restart Node unless you pair it with another development tool.

## Complete subclass code — \`package.json\`

\`\`\`json
{
  "name": "compiler-lab",
  "private": true,
  "type": "module",
  "scripts": {
    "clean": "node -e \"require('fs').rmSync('dist',{recursive:true,force:true})\"",
    "build": "tsc",
    "dev:types": "tsc --watch",
    "start": "node dist/app.js"
  },
  "devDependencies": {
    "typescript": "^5.9.0"
  }
}
\`\`\``, [
    q("What does `tsc --watch` do?", ["Recompiles when included files change", "Restarts every server", "Deploys to Railway", "Installs packages"], 0, "Watch mode monitors the configured program and rebuilds it."),
    q("Why keep build commands in package.json?", ["They give the team repeatable commands", "They replace tsconfig", "They disable strict mode", "They hide errors"], 0, "Scripts document and standardise the workflow."),
  ]),
  lesson("ts_compiler", 8, "type-packages", "Install & Use Type Declaration Packages", String.raw`# Install & Use Type Declaration Packages

JavaScript libraries and runtimes need type descriptions. Packages may ship declarations themselves; otherwise the community often publishes them under \`@types/*\`.

\`\`\`bash
npm install --save-dev @types/node
\`\`\`

Node's declarations teach TypeScript about \`node:fs\`, \`process\`, \`Buffer\`, and other runtime APIs. Types do not install the runtime or change behaviour—they describe APIs that already exist.

## Complete subclass code — \`src/app.ts\`

\`\`\`ts
import fs from 'node:fs';

type Config = {
  project: string;
  strict: boolean;
};

const config: Config = {
  project: 'compiler-lab',
  strict: true,
};

fs.writeFileSync('dist/config.json', JSON.stringify(config, null, 2));
console.log(\`Wrote configuration for \${config.project}\`);
\`\`\``, [
    q("What does `@types/node` provide?", ["Type declarations for Node APIs", "The Node runtime", "A database", "A bundler"], 0, "It describes Node's existing modules and globals to TypeScript."),
    q("When is a separate @types package unnecessary?", ["When the library ships its own declarations", "When strict is enabled", "When code has functions", "When using npm"], 0, "Many modern packages include their own .d.ts files."),
  ]),
];

const investmentTypes = String.raw`type InvestmentData = {
  initialAmount: number;
  annualContribution: number;
  expectedReturn: number;
  duration: number;
};

type InvestmentResult = {
  year: string;
  totalAmount: number;
  totalContributions: number;
  totalInterestEarned: number;
};`;

const finalCalculator = String.raw`${investmentTypes}

type CalculationResult = InvestmentResult[] | string;

function calculateInvestment(data: InvestmentData): CalculationResult {
  const { initialAmount, annualContribution, expectedReturn, duration } = data;

  if (initialAmount < 0) return 'Initial amount must be at least zero.';
  if (duration <= 0) return 'Duration must be greater than zero.';
  if (expectedReturn < 0) return 'Expected return must be at least zero.';

  let total = initialAmount;
  let totalContributions = 0;
  let totalInterestEarned = 0;
  const annualResults: InvestmentResult[] = [];

  for (let year = 1; year <= duration; year++) {
    total *= 1 + expectedReturn;
    totalInterestEarned = total - totalContributions - initialAmount;
    totalContributions += annualContribution;
    total += annualContribution;
    annualResults.push({
      year: \`Year \${year}\`,
      totalAmount: total,
      totalContributions,
      totalInterestEarned,
    });
  }

  return annualResults;
}

function printResults(results: CalculationResult): void {
  if (typeof results === 'string') {
    console.log(results);
    return;
  }

  for (const result of results) {
    console.log(result.year);
    console.log(\`Total: \${result.totalAmount.toFixed(0)}\`);
    console.log(\`Contributions: \${result.totalContributions.toFixed(0)}\`);
    console.log(\`Interest: \${result.totalInterestEarned.toFixed(0)}\`);
    console.log('----------------------');
  }
}

const data: InvestmentData = {
  initialAmount: 5000,
  annualContribution: 500,
  expectedReturn: 0.08,
  duration: 10,
};

printResults(calculateInvestment(data));`;

const section4 = [
  lesson("ts_demo", 1, "first-steps", "Model the Investment Calculator", String.raw`# Model the Investment Calculator

The demo project turns four inputs into a year-by-year projection: initial amount, annual contribution, expected decimal return, and duration. Start by naming the data before writing the loop.

\`\`\`ts
const initialAmount = 5000;
const annualContribution = 500;
const expectedReturn = 0.08;
const duration = 10;
\`\`\`

Node runs the emitted JavaScript: \`npx tsc && node dist/calculator.js\`. Keeping the example outside a browser isolates the language and compiler concepts.

## Complete subclass code — \`calculator.ts\`

\`\`\`ts
const initialAmount: number = 5000;
const annualContribution: number = 500;
const expectedReturn: number = 0.08;
const duration: number = 10;

console.log({ initialAmount, annualContribution, expectedReturn, duration });
\`\`\``, [
    q("How is an 8% expected return represented?", ["0.08", "8", "'8%'", "80"], 0, "The calculation uses a decimal rate."),
    q("Why run the emitted file with Node?", ["Node executes JavaScript output", "Node type-checks TypeScript", "Node creates tsconfig", "Node replaces npm"], 0, "The compiler produces the JavaScript runtime input."),
  ]),
  lesson("ts_demo", 2, "custom-types", "Create Reusable Investment Types", String.raw`# Create Reusable Investment Types

Group related inputs into one domain object. A custom alias prevents long parameter lists and gives callers a single contract.

\`\`\`ts
type InvestmentData = {
  initialAmount: number;
  annualContribution: number;
  expectedReturn: number;
  duration: number;
};
\`\`\`

The output shape deserves its own type because every projected year carries the same fields.

## Complete subclass code — \`calculator.ts\`

\`\`\`ts
${investmentTypes}

const data: InvestmentData = {
  initialAmount: 5000,
  annualContribution: 500,
  expectedReturn: 0.08,
  duration: 10,
};

const firstYear: InvestmentResult = {
  year: 'Year 1',
  totalAmount: 5940,
  totalContributions: 500,
  totalInterestEarned: 400,
};

console.log(data, firstYear);
\`\`\``, [
    q("Why use one InvestmentData object?", ["It names and groups the function input contract", "It validates user input automatically", "It emits a database", "It removes numbers"], 0, "A domain object is easier to extend and safer to pass than positional arguments."),
    q("What does InvestmentResult model?", ["One projected year", "The compiler configuration", "An npm package", "A DOM element"], 0, "Each result stores the totals for a particular year."),
  ]),
  lesson("ts_demo", 3, "union-result", "Return Results or a Validation Message", String.raw`# Return Results or a Validation Message

Invalid inputs cannot produce a meaningful projection. Model that honestly as a union instead of returning a partially valid array.

\`\`\`ts
type CalculationResult = InvestmentResult[] | string;
\`\`\`

The caller must narrow the result before iterating. This makes the error path part of the function contract.

## Complete subclass code — \`calculator.ts\`

\`\`\`ts
${investmentTypes}

type CalculationResult = InvestmentResult[] | string;

function validateInvestment(data: InvestmentData): CalculationResult {
  if (data.initialAmount < 0) return 'Initial amount must be at least zero.';
  if (data.duration <= 0) return 'Duration must be greater than zero.';
  if (data.expectedReturn < 0) return 'Expected return must be at least zero.';
  return [];
}

const result = validateInvestment({
  initialAmount: 5000,
  annualContribution: 500,
  expectedReturn: 0.08,
  duration: 10,
});

console.log(result);
\`\`\``, [
    q("What does CalculationResult require callers to handle?", ["An array or an error string", "Only an array", "null only", "A thrown syntax error"], 0, "The union exposes both success and validation outcomes."),
    q("How can a caller narrow this union?", ["Use `typeof result === 'string'`", "Use `as any`", "Check tsconfig", "Rename the function"], 0, "The runtime string check narrows the other branch to InvestmentResult[]."),
  ]),
  lesson("ts_demo", 4, "calculation-loop", "Build the Annual Projection Loop", String.raw`# Build the Annual Projection Loop

For each year, apply growth to the current total, calculate cumulative interest, add the annual contribution, and store an immutable snapshot.

\`\`\`ts
total *= 1 + expectedReturn;
totalInterestEarned = total - totalContributions - initialAmount;
totalContributions += annualContribution;
total += annualContribution;
\`\`\`

The order matters: moving the contribution before growth changes the business rule.

## Complete subclass code — \`calculator.ts\`

\`\`\`ts
${investmentTypes}

function calculateInvestment(data: InvestmentData): InvestmentResult[] {
  const { initialAmount, annualContribution, expectedReturn, duration } = data;
  let total = initialAmount;
  let totalContributions = 0;
  let totalInterestEarned = 0;
  const results: InvestmentResult[] = [];

  for (let year = 1; year <= duration; year++) {
    total *= 1 + expectedReturn;
    totalInterestEarned = total - totalContributions - initialAmount;
    totalContributions += annualContribution;
    total += annualContribution;
    results.push({
      year: \`Year \${year}\`,
      totalAmount: total,
      totalContributions,
      totalInterestEarned,
    });
  }

  return results;
}
\`\`\``, [
    q("Why push a new object on every loop?", ["To preserve a snapshot for each year", "To change tsconfig", "To install types", "To avoid numbers"], 0, "Each object records the accumulated state at that year boundary."),
    q("When is annual growth applied in this model?", ["Before adding that year's contribution", "After printing", "Only in the last year", "Never"], 0, "The operation order defines the calculator's financial assumption."),
  ]),
  lesson("ts_demo", 5, "connect-functions", "Connect Calculation & Presentation", String.raw`# Connect Calculation & Presentation

Keep calculation and output separate. \`calculateInvestment\` returns data; \`printResults\` narrows the union and decides how to display it.

\`\`\`ts
function printResults(results: CalculationResult): void {
  if (typeof results === 'string') {
    console.log(results);
    return;
  }

  for (const result of results) console.log(result.year);
}
\`\`\`

This boundary makes the calculation reusable in a CLI, web page, or API without embedding presentation work inside the math.

## Complete subclass code — \`calculator.ts\`

\`\`\`ts
${finalCalculator}
\`\`\``, [
    q("Why separate calculateInvestment and printResults?", ["To separate domain logic from presentation", "To avoid return types", "To disable Node", "To create more errors"], 0, "The calculation can then serve different output layers."),
    q("What does the early return after logging an error achieve?", ["It prevents iterating a string", "It converts the string", "It recompiles", "It adds a year"], 0, "After the branch returns, results is narrowed to the array type."),
  ]),
  lesson("ts_demo", 6, "compile-execute", "Compile & Execute the Complete Project", String.raw`# Compile & Execute the Complete Project

The final workflow checks the entire configured project, emits only when it is valid, and runs the generated module.

\`\`\`bash
npx tsc
node dist/calculator.js
\`\`\`

Try a negative return or zero duration to prove the validation path, then restore valid data and inspect every annual result. The final source below is complete and runnable.

## Complete subclass code — \`calculator.ts\`

\`\`\`ts
${finalCalculator}
\`\`\``, [
    q("What should happen before running dist/calculator.js?", ["Compile the configured project", "Run the TypeScript as CSS", "Delete tsconfig", "Install a browser"], 0, "The JavaScript output must be produced from checked TypeScript."),
    q("What is the best final verification?", ["Exercise both valid and invalid inputs", "Only inspect the file name", "Disable noEmitOnError", "Replace types with any"], 0, "Both success and validation branches belong to the contract."),
  ]),
];

const curriculum = JSON.parse(fs.readFileSync(curriculumPath, "utf8"));
curriculum.topics = curriculum.topics.filter(({ name }) => ![section3Name, section4Name].includes(name));
curriculum.topics.push({ name: section3Name, subtopics: section3 });
curriculum.topics.push({ name: section4Name, subtopics: section4 });
fs.writeFileSync(curriculumPath, `${JSON.stringify(curriculum, null, 2)}\n`);

const challenge = (title, items) => ({
  round_number: 1,
  title,
  questions: items.map(([question, options, correct_option_index, explanation]) => ({ type: "mcq", question, options, correct_option_index, explanation })),
});

const section3Challenge = challenge("Compiler Configuration Mastery Challenge", [
  ["Which setting determines emitted JavaScript syntax?", ["target", "lib", "include", "types"], 0, "Target selects the output language level."],
  ["Which setting describes browser globals?", ["lib including DOM", "outDir", "rootDir", "sourceMap"], 0, "DOM declaration libraries describe browser APIs."],
  ["Where should include be placed?", ["At the tsconfig top level", "Inside compilerOptions", "Inside src", "Inside package.json scripts"], 0, "File-selection settings are siblings of compilerOptions."],
  ["What blocks output after type errors?", ["noEmitOnError", "allowJs", "removeComments", "skipLibCheck"], 0, "It withholds emitted files on failed checking."],
  ["Which option is the umbrella for strict checks?", ["strict", "sourceMap", "declaration", "module"], 0, "Strict activates a coordinated safety family."],
  ["What does watch mode provide?", ["Automatic recompilation", "Automatic deployment", "Automatic database migration", "Automatic Node restart in every case"], 0, "It watches program inputs and rebuilds them."],
  ["Why install @types/node?", ["To describe Node APIs", "To install Node", "To create JavaScript", "To configure Git"], 0, "The declaration package supplies static API information."],
  ["Why generate source maps?", ["To map runtime locations back to TypeScript", "To type DOM APIs", "To install packages", "To choose included files"], 0, "Debuggers use maps to relate generated and authored code."],
]);

const section4Challenge = challenge("Investment Calculator Mastery Challenge", [
  ["What does InvestmentData group?", ["All calculator inputs", "Compiler options", "Only errors", "DOM elements"], 0, "It is the input contract."],
  ["Why return InvestmentResult[] | string?", ["To model success and validation outcomes", "To disable checking", "To avoid functions", "To install Node"], 0, "The union exposes both valid result shapes."],
  ["How is the result union narrowed?", ["A typeof string check", "A type assertion only", "A package script", "A source map"], 0, "The runtime check distinguishes error text from the result array."],
  ["Why store one result object per year?", ["To preserve annual snapshots", "To compile faster", "To create tsconfig", "To remove contributions"], 0, "Each object records a year-end state."],
  ["Why keep printing outside calculation?", ["To separate presentation from domain logic", "To avoid return types", "To force strings", "To skip validation"], 0, "Separation makes the calculator reusable."],
  ["Which command runs the complete emitted program?", ["node dist/calculator.js", "node calculator.ts", "tsconfig start", "npm css"], 0, "Node consumes the JavaScript generated in dist."],
  ["What invalid duration should the calculator reject?", ["Zero or less", "Ten", "One", "Any number"], 0, "A projection needs at least one year."],
  ["What verifies the complete implementation?", ["Test valid and invalid data", "Ignore output", "Disable strict", "Use any"], 0, "Both branches must be exercised."],
]);

const questions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
questions.topics = questions.topics.filter(({ name }) => ![section3Name, section4Name].includes(name));
questions.topics.push({ name: section3Name, rounds: [section3Challenge] });
questions.topics.push({ name: section4Name, rounds: [section4Challenge] });
fs.writeFileSync(questionsPath, `${JSON.stringify(questions, null, 2)}\n`);

console.log(`Built ${section3.length} compiler modules and ${section4.length} demo-project modules.`);
