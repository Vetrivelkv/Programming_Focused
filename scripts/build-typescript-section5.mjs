import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const curriculumPath = path.join(root, "backend", "data", "typescript_curriculum.json");
const questionsPath = path.join(root, "backend", "data", "typescript_questions.json");
const sectionName = "Section 5 · Next-generation JavaScript & TypeScript";

const q = (question, options, correct, explanation) => ({ type: "mcq", question, options, correct, explanation });
const lesson = (number, slug, title, content, questions) => ({
  id: `ts_next_gen_${String(number).padStart(2, "0")}`,
  title,
  image: `/assets/typescript/ts_next_gen/${String(number).padStart(2, "0")}-${slug}.png`,
  content: content.replaceAll("§", "`").replaceAll("\\${", "${"),
  questions,
});

const arrowFunctionLab = String.raw`const add = (a: number, b: number): number => a + b;

const printOutput: (value: number | string) => void = output =>
  console.log(output);

const button = document.querySelector('button');

if (button) {
  button.addEventListener('click', event => console.log(event));
}

printOutput(add(2, 5));`;

const defaultParameterLab = String.raw`const add = (a: number, b: number = 1): number => a + b;

const printOutput: (value: number | string) => void = output =>
  console.log(output);

printOutput(add(5));
printOutput(add(5, 3));`;

const spreadLab = String.raw`const hobbies = ['Sports', 'Cooking'];
const activeHobbies = ['Hiking'];

activeHobbies.push(...hobbies);

const allHobbies = ['Reading', ...activeHobbies];

const person = {
  firstName: 'Max',
  age: 30,
};

const copiedPerson = { ...person };

console.log(activeHobbies, allHobbies, copiedPerson);`;

const restLab = String.raw`const add = (...numbers: number[]): number => {
  return numbers.reduce((currentResult, currentValue) => {
    return currentResult + currentValue;
  }, 0);
};

const addExactlyThree = (
  ...numbers: [number, number, number]
): number => numbers.reduce((total, value) => total + value, 0);

const addedNumbers = add(5, 10, 2, 3.7);
const threeNumberTotal = addExactlyThree(5, 10, 2);

console.log(addedNumbers, threeNumberTotal);`;

const destructuringLab = String.raw`const hobbies = ['Sports', 'Cooking', 'Hiking', 'Reading'];
const [hobby1, hobby2, ...remainingHobbies] = hobbies;

const person = {
  firstName: 'Max',
  age: 30,
};

const { firstName: userName, age } = person;

console.log(hobbies);
console.log(hobby1, hobby2, remainingHobbies);
console.log(userName, age);`;

const section = [
  lesson(1, "module-lab", "Set Up the Modern JavaScript Lab", String.raw`# Set Up the Modern JavaScript Lab

This section studies JavaScript features that TypeScript understands and can compile for different runtimes. Keep authored TypeScript in §src§, generated JavaScript in §dist§, and let one project configuration control the build.

## Project shape

§§§text
next-gen-lab/
├─ src/
│  └─ app.ts
├─ dist/
│  └─ app.js
├─ index.html
├─ package.json
└─ tsconfig.json
§§§

Install TypeScript and a lightweight development server, then start the compiler in watch mode beside the server.

§§§bash
npm init -y
npm install --save-dev typescript lite-server
npx tsc --init
npx tsc --watch
npx lite-server
§§§

The browser needs the DOM declarations; the compiler target determines how modern syntax is emitted. Source maps keep browser debugging connected to §src/app.ts§.

## Complete subclass code — §tsconfig.json§

§§§json
{
  "compilerOptions": {
    "target": "ES6",
    "lib": ["DOM", "ES6", "DOM.Iterable", "ScriptHost"],
    "rootDir": "./src",
    "outDir": "./dist",
    "sourceMap": true,
    "strict": true
  },
  "include": ["src"]
}
§§§

## Complete subclass code — §package.json§

§§§json
{
  "scripts": {
    "build": "tsc",
    "dev:types": "tsc --watch",
    "dev:web": "lite-server"
  },
  "devDependencies": {
    "lite-server": "^2.6.1",
    "typescript": "^5.9.0"
  }
}
§§§`, [
    q("Why separate src and dist?", ["To keep authored TypeScript apart from emitted JavaScript", "To install the DOM", "To replace package.json", "To disable source maps"], 0, "The source/output boundary prevents generated files from becoming authored inputs."),
    q("What does target control?", ["The JavaScript syntax emitted by TypeScript", "The browser window size", "The npm registry", "The Git remote"], 0, "Target selects the JavaScript language level of compiler output."),
  ]),

  lesson(2, "let-const", "Use `let`, `const` & Block Scope", String.raw`# Use let, const & Block Scope

Prefer §const§ when the binding will not be reassigned. TypeScript correctly rejects an attempt to point the same constant at another value.

§§§ts
const userName = 'Max';
// userName = 'Manu'; // Error: cannot assign to a constant.
§§§

Use §let§ when reassignment is part of the design.

§§§ts
let age = 30;
age = 29;
§§§

Unlike §var§, both declarations obey block scope. A variable declared inside a function or an §if§ block stays inside that boundary.

§§§ts
function add(a: number, b: number): number {
  var result = a + b;
  return result;
}

if (age > 20) {
  let isOld = true;
  console.log(isOld);
}

// console.log(result); // Outside the function.
// console.log(isOld);  // Outside the if block.
§§§

§const§ protects the binding, not the internals of a referenced array or object. Later lessons use that distinction when pushing into an array.

## Complete subclass code — §src/app.ts§

§§§ts
const userName = 'Max';
let age = 30;
age = 29;

function add(a: number, b: number): number {
  const result = a + b;
  return result;
}

if (age > 20) {
  const isOld = true;
  console.log(userName, isOld, add(age, 1));
}
§§§`, [
    q("Which declaration best fits a binding that is never reassigned?", ["const", "var", "function", "interface"], 0, "Const communicates and enforces that the binding stays fixed."),
    q("Where is a let declared inside an if block available?", ["Only inside that block and its nested blocks", "Everywhere in the file", "Only in dist", "Only in HTML"], 0, "Let and const are block-scoped."),
  ]),

  lesson(3, "arrow-functions", "Write Arrow Functions & Typed Callbacks", String.raw`# Write Arrow Functions & Typed Callbacks

An arrow function can begin with an explicit block and return statement.

§§§ts
const add = (a: number, b: number) => {
  return a + b;
};
§§§

When the body is one expression, omit the braces and §return§. The expression becomes the result.

§§§ts
const add = (a: number, b: number) => a + b;
console.log(add(2, 5));
§§§

A one-parameter function may omit parentheses. Put the function type on the variable when you still want the parameter and return contract to be explicit.

§§§ts
const printOutput = (output: string | number) => console.log(output);

const typedPrintOutput: (value: string | number) => void =
  output => console.log(output);
§§§

Context also supplies callback types. Here TypeScript knows that §event§ is a mouse event because §addEventListener§ and the selected event name provide the contract.

§§§ts
const button = document.querySelector('button');

if (button) {
  button.addEventListener('click', event => console.log(event));
}
§§§

## Complete subclass code — §src/app.ts§

§§§ts
${arrowFunctionLab}
§§§`, [
    q("When may an arrow function omit return?", ["When its body is a single returned expression", "Whenever it has two parameters", "Only when it returns void", "Only in JavaScript files"], 0, "An expression body returns that expression implicitly."),
    q("Why can TypeScript infer the click event parameter?", ["The event-listener signature provides contextual typing", "Every parameter is any", "The browser reads tsconfig", "The callback has no type"], 0, "The API overload and event name give the callback a known parameter type."),
  ]),

  lesson(4, "default-parameters", "Apply Default Function Parameters", String.raw`# Apply Default Function Parameters

A default parameter supplies a value when the caller omits that argument or passes §undefined§.

§§§ts
const add = (a: number, b: number = 1) => a + b;

console.log(add(5));    // 6
console.log(add(5, 3)); // 8
§§§

Place defaulted parameters after required parameters. JavaScript assigns arguments by position; it does not search for the parameter you intended to skip.

§§§ts
// Avoid this awkward order:
// const add = (a: number = 1, b: number) => a + b;
// add(undefined, 5);
§§§

The default participates in type inference, but the explicit annotation keeps the lesson contract obvious.

## Complete subclass code — §src/app.ts§

§§§ts
${defaultParameterLab}
§§§`, [
    q("Where should a defaulted parameter usually appear?", ["After required parameters", "Before every required parameter", "Outside the function", "Inside tsconfig"], 0, "Trailing defaults let callers omit arguments naturally."),
    q("What does add(5) return when b defaults to 1?", ["6", "5", "1", "undefined"], 0, "The omitted second argument uses its default value."),
  ]),

  lesson(5, "spread", "Copy & Combine with the Spread Operator", String.raw`# Copy & Combine with the Spread Operator

Spread expands an iterable into individual values. It can feed an existing array's §push§ call.

§§§ts
const hobbies = ['Sports', 'Cooking'];
const activeHobbies = ['Hiking'];

activeHobbies.push(...hobbies);
§§§

It can also build a new array without changing either input binding.

§§§ts
const allHobbies = ['Reading', ...activeHobbies];
§§§

Object spread copies enumerable properties into a new object.

§§§ts
const person = { firstName: 'Max', age: 30 };
const copiedPerson = { ...person };
§§§

Arrays and objects are reference values. §const activeHobbies§ may still be mutated because §push§ changes the referenced array instead of reassigning the binding. Also remember that object and array spread are **shallow**: nested objects remain shared unless you copy them separately.

## Complete subclass code — §src/app.ts§

§§§ts
${spreadLab}
§§§`, [
    q("What does activeHobbies.push(...hobbies) do?", ["Passes each hobby as a separate push argument", "Pushes one nested array", "Reassigns hobbies", "Deletes Hiking"], 0, "Spread expands the source array into individual arguments."),
    q("Is { ...person } a deep copy of every nested value?", ["No, spread creates a shallow copy", "Yes, always", "Only when target is ES5", "Only in TypeScript"], 0, "Nested references remain shared unless they are copied explicitly."),
  ]),

  lesson(6, "rest-parameters", "Collect Values with Rest Parameters", String.raw`# Collect Values with Rest Parameters

Rest syntax appears in a parameter list and performs the inverse of spread: it collects comma-separated arguments into an array.

§§§ts
const add = (...numbers: number[]) => {
  return numbers.reduce((currentResult, currentValue) => {
    return currentResult + currentValue;
  }, 0);
};

const addedNumbers = add(5, 10, 2, 3.7);
§§§

The initial §0§ gives §reduce§ a valid accumulator even when the rest array is empty. A tuple rest type can require an exact arity when the domain calls for it.

§§§ts
const addExactlyThree = (...numbers: [number, number, number]) =>
  numbers.reduce((total, value) => total + value, 0);

addExactlyThree(5, 10, 2);
// addExactlyThree(5, 10); // Error: expected three arguments.
§§§

Use §number[]§ for any count and a tuple for a fixed count. Array methods such as §push§ expose a rest-style signature for the same reason: callers may provide multiple values.

## Complete subclass code — §src/app.ts§

§§§ts
${restLab}
§§§`, [
    q("What does a rest parameter create inside the function?", ["An array of collected arguments", "A DOM event", "A new tsconfig", "A deep copy"], 0, "Rest merges the remaining call arguments into an array."),
    q("When is a tuple rest type useful?", ["When the function requires an exact number and order of arguments", "When any count is allowed", "When compiling CSS", "When no types are wanted"], 0, "A tuple captures fixed arity and positional types."),
  ]),

  lesson(7, "destructuring", "Destructure Arrays & Objects", String.raw`# Destructure Arrays & Objects

Array destructuring reads by position. Rest can collect all values left after the named positions.

§§§ts
const hobbies = ['Sports', 'Cooking', 'Hiking', 'Reading'];
const [hobby1, hobby2, ...remainingHobbies] = hobbies;

console.log(hobbies, hobby1, hobby2, remainingHobbies);
§§§

The original array remains unchanged. Object destructuring reads by property key rather than order.

§§§ts
const person = { firstName: 'Max', age: 30 };
const { firstName, age } = person;
§§§

Use a colon to give the extracted property a local alias.

§§§ts
const { firstName: userName, age } = person;
console.log(userName, age);
§§§

In this position, the colon means “rename §firstName§ to §userName§”; it is not a TypeScript type annotation.

## Complete subclass code — §src/app.ts§

§§§ts
${destructuringLab}
§§§`, [
    q("How does array destructuring choose values?", ["By position", "By property name", "Alphabetically", "From tsconfig"], 0, "Array patterns map variables to ordered elements."),
    q("What does firstName: userName mean in object destructuring?", ["Extract firstName into a local named userName", "Type firstName as userName", "Assign userName to the object", "Delete firstName"], 0, "The colon introduces a local alias in an object binding pattern."),
  ]),

  lesson(8, "compile-target", "Compile Modern Syntax for Older Runtimes", String.raw`# Compile Modern Syntax for Older Runtimes

With an ES6 target, many features in this section already belong to the output language, so declarations, arrow functions, and destructuring can remain recognizable in §dist/app.js§.

§§§json
{
  "compilerOptions": {
    "target": "ES6"
  }
}
§§§

Switching to ES5 asks TypeScript to rewrite unsupported syntax. The emitted file becomes longer: §const§ and §let§ become §var§, arrow functions become ordinary functions, destructuring becomes indexed/property reads, and spread/rest may use helper logic.

§§§json
{
  "compilerOptions": {
    "target": "ES5"
  }
}
§§§

If §lib§ is omitted, TypeScript chooses default library declarations that match the target. Add platform libraries such as §DOM§ explicitly only when the program uses them. The key distinction is:

- TypeScript-only syntax, such as type annotations, is removed.
- Modern JavaScript syntax is preserved or transformed according to §target§.
- Runtime APIs are not polyfilled by the compiler; compatibility may still require a polyfill.

## Complete subclass code — §src/app.ts§

§§§ts
${destructuringLab}
§§§

## Complete subclass code — §tsconfig.json§

§§§json
{
  "compilerOptions": {
    "target": "ES5",
    "lib": ["DOM", "ES5", "ScriptHost"],
    "rootDir": "./src",
    "outDir": "./dist",
    "sourceMap": true,
    "strict": true
  },
  "include": ["src"]
}
§§§`, [
    q("What happens to modern JavaScript syntax when target changes to ES5?", ["TypeScript rewrites unsupported syntax into older equivalents", "The source file is deleted", "Types become runtime validators", "The browser target changes itself"], 0, "Target controls the language level of generated JavaScript."),
    q("Does TypeScript automatically polyfill every modern runtime API?", ["No", "Yes", "Only in strict mode", "Only with source maps"], 0, "Compilation can transform syntax, but missing runtime APIs need separate polyfills or a newer runtime."),
  ]),
];

const curriculum = JSON.parse(fs.readFileSync(curriculumPath, "utf8"));
curriculum.topics = curriculum.topics.filter(({ name }) => name !== sectionName);
curriculum.topics.push({ name: sectionName, subtopics: section });
fs.writeFileSync(curriculumPath, `${JSON.stringify(curriculum, null, 2)}\n`);

const challengeItems = [
  ["Which declaration should be the default for a binding that will not be reassigned?", ["const", "var", "any", "enum"], 0, "Const makes the binding rule explicit and enforceable."],
  ["What scope do let and const obey?", ["Block scope", "Only global scope", "CSS scope", "Database scope"], 0, "Their bindings stay within the nearest block."],
  ["What does an expression-bodied arrow function return?", ["The expression result", "Always undefined", "The function itself", "A Promise automatically"], 0, "The single expression is returned implicitly."],
  ["Why may a callback parameter have a type without an annotation?", ["Contextual typing from the receiving API", "TypeScript uses any for all callbacks", "The browser compiles it", "The parameter is ignored"], 0, "The expected callback signature supplies the parameter type."],
  ["Why should default parameters normally be trailing?", ["Arguments are assigned by position", "They compile only at the end", "They require rest syntax", "They are object keys"], 0, "Trailing defaults can be omitted without awkward placeholders."],
  ["What does spread do in push(...items)?", ["Expands items into separate arguments", "Collects arguments into one array", "Freezes the array", "Creates a deep clone"], 0, "Spread expands an iterable at the call site."],
  ["What does a rest parameter do?", ["Collects remaining arguments into an array", "Copies an object deeply", "Changes compiler target", "Declares a constant"], 0, "Rest gathers call arguments for array-based processing."],
  ["How does object destructuring locate values?", ["By property key", "Only by position", "By array length", "By line number"], 0, "Object binding patterns match named properties."],
  ["Is object spread a recursive deep copy?", ["No, it is shallow", "Yes, always", "Only for const", "Only with ES5"], 0, "Nested references remain shared."],
  ["What does target ES5 ask TypeScript to change?", ["Unsupported modern syntax in emitted JavaScript", "The source language to Java", "npm dependencies", "HTML semantics"], 0, "The target determines which JavaScript syntax may remain in output."],
];

const questions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
questions.topics = questions.topics.filter(({ name }) => name !== sectionName);
questions.topics.push({
  name: sectionName,
  rounds: [{
    round_number: 1,
    title: "Modern JavaScript & TypeScript Challenge",
    questions: challengeItems.map(([question, options, correct_option_index, explanation]) => ({
      type: "mcq",
      question,
      options,
      correct_option_index,
      explanation,
    })),
  }],
});
fs.writeFileSync(questionsPath, `${JSON.stringify(questions, null, 2)}\n`);

console.log(`Built ${section.length} Section 5 subclasses and ${challengeItems.length} challenge questions.`);
