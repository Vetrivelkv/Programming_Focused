const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../backend/data/typescript_curriculum.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const section5 = data.topics[4];
if (!section5 || !section5.name.includes("Section 5")) {
    console.error("Section 5 not found at index 4");
    process.exit(1);
}

section5.subtopics = [
  {
    "id": "ts_next_gen_01",
    "title": "Set Up the Modern JavaScript Lab",
    "image": "/assets/typescript/ts_next_gen/01-module-lab.png",
    "content": "# Set Up the Modern JavaScript Lab\n\n## 1. Project Shape\nIn this section, we study modern JavaScript features that TypeScript understands and compiles for different runtimes. We will keep our authored TypeScript in `src`, our generated JavaScript in `dist`, and let one project configuration control the build.\n\n```text\nnext-gen-lab/\n├─ src/\n│  └─ app.ts\n├─ dist/\n│  └─ app.js\n├─ index.html\n├─ package.json\n└─ tsconfig.json\n```\n\n## 2. Installing Dependencies\nFirst, initialize your project and install TypeScript along with a lightweight development server. Then, initialize your `tsconfig.json`.\n\n```bash\nnpm init -y\nnpm install --save-dev typescript lite-server\nnpx tsc --init\n```\n\n## 3. The Configuration\nYour `tsconfig.json` determines how modern syntax is emitted (via `target`). We also enable `sourceMap` to keep browser debugging connected to our original `src/app.ts` file instead of the compiled JavaScript.\n\n## Complete Code Snippet\n**`tsconfig.json`**\n```json\n{\n  \"compilerOptions\": {\n    \"target\": \"ES6\", // 💡 Determines the JavaScript language level of compiler output\n    \"lib\": [\"DOM\", \"ES6\", \"DOM.Iterable\", \"ScriptHost\"],\n    \"rootDir\": \"./src\",\n    \"outDir\": \"./dist\", // 💡 The boundary separating generated files from authored inputs\n    \"sourceMap\": true, // ✅ OK: Enables browser debugging connected to our .ts files\n    \"strict\": true\n  },\n  \"include\": [\"src\"]\n}\n```\n\n**`package.json`**\n```json\n{\n  \"scripts\": {\n    \"build\": \"tsc\",\n    \"dev:types\": \"tsc --watch\",\n    \"dev:web\": \"lite-server\"\n  },\n  \"devDependencies\": {\n    \"lite-server\": \"^2.6.1\",\n    \"typescript\": \"^5.9.0\"\n  }\n}\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "Why is it important to separate your `src` and `dist` directories in your TypeScript project configuration?",
        "options": [
          "To keep authored TypeScript files separate from the generated JavaScript output, preventing emitted files from accidentally becoming project inputs.",
          "To install the DOM.",
          "To replace package.json.",
          "To disable source maps."
        ],
        "correct": 0,
        "explanation": "The source/output boundary prevents generated files from becoming authored inputs and prevents messy directory structures."
      },
      {
        "type": "mcq",
        "question": "What is the primary purpose of the `target` option in `tsconfig.json`?",
        "options": [
          "It determines the specific JavaScript language level (e.g., ES5, ES6) that the compiler will output.",
          "It controls the browser window size during testing.",
          "It points to the npm registry.",
          "It configures the Git remote repository."
        ],
        "correct": 0,
        "explanation": "Target selects the JavaScript language level of compiler output, ensuring compatibility with your deployment environment."
      }
    ]
  },
  {
    "id": "ts_next_gen_02",
    "title": "Use `let`, `const` & Block Scope",
    "image": "/assets/typescript/ts_next_gen/02-let-const.png",
    "content": "# Use let, const & Block Scope\n\n## 1. Choosing Between Let and Const\nIn modern JavaScript and TypeScript, you should prefer `const` whenever a variable's binding will not be reassigned. If you attempt to reassign a `const`, TypeScript will immediately catch the error. Use `let` only when reassignment is an intentional part of your design.\n\n```ts\nconst userName = 'Max';\n// ❌ Error: Cannot assign to 'userName' because it is a constant.\n// userName = 'Manu'; \n\n// ✅ OK: 'let' allows reassignment\nlet age = 30;\nage = 29;\n```\n\n## 2. Block Scope\nUnlike the older `var` keyword, both `let` and `const` obey **block scope**. This means if you declare a variable inside a function or an `if` block, it stays locked inside that specific boundary.\n\n```ts\nif (age > 20) {\n  const isOld = true;\n  console.log(isOld); // ✅ OK: Used inside the block\n}\n// ❌ Error: Cannot find name 'isOld'. It doesn't exist outside the 'if' block!\n// console.log(isOld); \n```\n\n## 3. Const and Object Mutations\nIt is crucial to remember that `const` protects the *binding*, not the internal contents of an array or object. You cannot point the variable to a new array, but you *can* push new items into the existing array!\n\n## Complete Code Snippet\n```ts\nconst userName = 'Max';\nlet age = 30;\nage = 29;\n\nfunction add(a: number, b: number): number {\n  // 💡 Block scoped to this function\n  const result = a + b;\n  return result;\n}\n\nif (age > 20) {\n  // 💡 Block scoped to this 'if' statement\n  const isOld = true;\n  console.log(userName, isOld, add(age, 1));\n}\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "Which declaration should you use by default if you know a variable will never be reassigned to a new value?",
        "options": [
          "`const`, because it communicates your intent and enforces that the binding remains fixed.",
          "`let`, because it uses less memory.",
          "`var`, because it is globally scoped.",
          "`function`, to create a constant binding."
        ],
        "correct": 0,
        "explanation": "Const communicates and enforces that the binding stays fixed, reducing bugs caused by accidental reassignments."
      },
      {
        "type": "mcq",
        "question": "Where is a variable declared with `let` or `const` inside an `if` block available for use?",
        "options": [
          "Only inside that specific `if` block and any blocks nested inside of it, due to block scoping.",
          "Everywhere in the file, because it gets hoisted.",
          "Only in the compiled JavaScript `dist` folder.",
          "Globally across all files."
        ],
        "correct": 0,
        "explanation": "Let and const are block-scoped, meaning they don't leak out into outer scopes."
      }
    ]
  },
  {
    "id": "ts_next_gen_03",
    "title": "Write Arrow Functions & Typed Callbacks",
    "image": "/assets/typescript/ts_next_gen/03-arrow-functions.png",
    "content": "# Write Arrow Functions & Typed Callbacks\n\n## 1. Arrow Function Syntax\nArrow functions provide a shorter syntax for writing functions. You can start with an explicit block and a `return` statement:\n\n```ts\nconst add = (a: number, b: number) => {\n  return a + b;\n};\n```\n\n## 2. Implicit Returns\nWhen your function body is just a single expression, you can omit the curly braces and the `return` keyword entirely! The expression automatically becomes the result.\n\n```ts\n// 💡 The result of a + b is implicitly returned!\nconst add = (a: number, b: number) => a + b;\n```\n\n## 3. Typed Callbacks and Context\nWhen passing arrow functions as callbacks, you can explicitly type the function signature on the variable.\n\n```ts\n// 💡 Explicitly defining the function signature: (value: string | number) => void\nconst printOutput: (value: string | number) => void = output => console.log(output);\n```\nSometimes, you don't even need to write the types! TypeScript uses contextual typing to figure out the parameters. For example, when adding an event listener, TypeScript automatically knows the callback parameter is a MouseEvent.\n\n```ts\nconst button = document.querySelector('button');\nif (button) {\n  // ✅ OK: TypeScript knows 'event' is a MouseEvent because of the 'click' context\n  button.addEventListener('click', event => console.log(event));\n}\n```\n\n## Complete Code Snippet\n```ts\n// ✅ OK: Concise arrow function with implicit return\nconst add = (a: number, b: number): number => a + b;\n\n// 💡 Typing the variable with a function signature\nconst printOutput: (value: number | string) => void = output =>\n  console.log(output);\n\nconst button = document.querySelector('button');\n\nif (button) {\n  // 💡 Contextual typing infers the 'event' type automatically\n  button.addEventListener('click', event => console.log(event));\n}\n\nprintOutput(add(2, 5));\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "When are you allowed to omit the `return` keyword in an arrow function?",
        "options": [
          "When the function body consists of a single expression, because the expression's result is returned implicitly.",
          "Whenever it has exactly two parameters.",
          "Only when it returns `void`.",
          "Only in plain JavaScript files."
        ],
        "correct": 0,
        "explanation": "An expression body returns that expression implicitly, allowing for very concise one-liner functions."
      },
      {
        "type": "mcq",
        "question": "Why doesn't TypeScript require you to explicitly type the `event` parameter in `button.addEventListener('click', event => ...)`?",
        "options": [
          "Because the event listener API provides contextual typing; TypeScript knows that a 'click' event yields a MouseEvent parameter.",
          "Because all callback parameters in TypeScript default to `any`.",
          "Because the browser reads your `tsconfig.json` to figure it out.",
          "Because callbacks inherently have no type safety."
        ],
        "correct": 0,
        "explanation": "The API overload and event name give the callback a known parameter type through contextual typing."
      }
    ]
  },
  {
    "id": "ts_next_gen_04",
    "title": "Apply Default Function Parameters",
    "image": "/assets/typescript/ts_next_gen/04-default-parameters.png",
    "content": "# Apply Default Function Parameters\n\n## 1. Setting Defaults\nA default parameter automatically supplies a value if the caller omits that argument or explicitly passes `undefined`. The default value also participates in type inference, though writing the explicit annotation helps keep your function's contract obvious.\n\n```ts\n// 💡 'b' defaults to 1 if no value is provided\nconst add = (a: number, b: number = 1) => a + b;\n\nconsole.log(add(5));    // ✅ OK: Returns 6 (5 + 1)\nconsole.log(add(5, 3)); // ✅ OK: Returns 8 (5 + 3)\n```\n\n## 2. Parameter Ordering\nYou should always place your defaulted parameters **after** your required parameters in the function signature. JavaScript assigns arguments by position; it will not automatically search for the parameter you intended to skip!\n\n```ts\n// ❌ Error-prone design: Default parameter comes first\nconst badAdd = (a: number = 1, b: number) => a + b;\n\n// To skip 'a', you would have to explicitly pass undefined, which is awkward:\nbadAdd(undefined, 5); \n```\n\n## Complete Code Snippet\n```ts\n// ✅ OK: Required parameters first, defaulted parameters last\nconst add = (a: number, b: number = 1): number => a + b;\n\nconst printOutput: (value: number | string) => void = output =>\n  console.log(output);\n\nprintOutput(add(5));    // Uses default: prints 6\nprintOutput(add(5, 3)); // Overrides default: prints 8\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "In the function `const add = (a: number, b: number = 1) => a + b`, what does `add(5)` return?",
        "options": [
          "It returns 6, because the omitted second argument automatically falls back to its default value of 1.",
          "It returns 5, because the second argument is ignored.",
          "It returns 1, because the first argument defaults to 1.",
          "It returns undefined because an argument is missing."
        ],
        "correct": 0,
        "explanation": "The omitted second argument uses its default value of 1, resulting in 5 + 1."
      },
      {
        "type": "mcq",
        "question": "Why should default parameters generally be placed at the end of the parameter list?",
        "options": [
          "Because JavaScript assigns arguments by position. Trailing defaults allow callers to simply omit the final arguments naturally.",
          "Because TypeScript compilers only process defaults at the end of the line.",
          "Because placing them at the beginning causes them to become global variables.",
          "Because they are required to be configured in `tsconfig.json`."
        ],
        "correct": 0,
        "explanation": "Trailing defaults let callers omit arguments naturally without having to pass awkward placeholders like `undefined`."
      }
    ]
  },
  {
    "id": "ts_next_gen_05",
    "title": "Copy & Combine with the Spread Operator",
    "image": "/assets/typescript/ts_next_gen/05-spread.png",
    "content": "# Copy & Combine with the Spread Operator\n\n## 1. Expanding Arrays\nThe spread operator (`...`) expands an iterable (like an array) into individual separate values. It is incredibly useful for feeding an existing array's items into functions like `push` that accept multiple arguments.\n\n```ts\nconst hobbies = ['Sports', 'Cooking'];\nconst activeHobbies = ['Hiking'];\n\n// 💡 Expands 'hobbies' into individual strings and pushes them one by one\nactiveHobbies.push(...hobbies);\n```\n\n## 2. Creating New Copies\nYou can also use the spread operator to build brand new arrays or objects without modifying the original inputs.\n\n```ts\n// ✅ OK: Creates a new array combining a new string with all items from activeHobbies\nconst allHobbies = ['Reading', ...activeHobbies];\n\n// ✅ OK: Copies all enumerable properties of 'person' into a brand new object\nconst person = { firstName: 'Max', age: 30 };\nconst copiedPerson = { ...person };\n```\n\n## 3. Shallow Copies Warning\nIt is important to remember that object and array spreads create **shallow copies**. If your object contains nested arrays or objects, those nested references remain shared between the original and the copy!\n\n## Complete Code Snippet\n```ts\nconst hobbies = ['Sports', 'Cooking'];\nconst activeHobbies = ['Hiking'];\n\n// 💡 Expanding an array into arguments\nactiveHobbies.push(...hobbies);\n\n// 💡 Using spread to combine arrays\nconst allHobbies = ['Reading', ...activeHobbies];\n\nconst person = {\n  firstName: 'Max',\n  age: 30,\n};\n\n// 💡 Using spread to copy object properties\nconst copiedPerson = { ...person };\n\nconsole.log(activeHobbies, allHobbies, copiedPerson);\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "When you execute `activeHobbies.push(...hobbies)`, what exactly does the spread operator do?",
        "options": [
          "It expands the `hobbies` array so that each item is passed as an individual, separate argument to the `push` method.",
          "It pushes the entire `hobbies` array as a single nested array inside `activeHobbies`.",
          "It permanently reassigns `activeHobbies` to equal `hobbies`.",
          "It deletes all items from `hobbies` and moves them."
        ],
        "correct": 0,
        "explanation": "Spread expands the source iterable into individual arguments, feeding them directly into the function call."
      },
      {
        "type": "mcq",
        "question": "True or False: `{ ...person }` creates a complete, deep copy of the person object, including completely copying all nested objects and arrays inside it.",
        "options": [
          "False. The spread operator creates a shallow copy. Any nested objects or arrays will still be shared by reference between the original and the copy.",
          "True. Spread always creates a recursive deep copy of all values.",
          "True, but only if you are compiling to ES6.",
          "False. Spread can only be used on arrays, not objects."
        ],
        "correct": 0,
        "explanation": "Nested references remain shared unless they are explicitly copied individually."
      }
    ]
  },
  {
    "id": "ts_next_gen_06",
    "title": "Collect Values with Rest Parameters",
    "image": "/assets/typescript/ts_next_gen/06-rest-parameters.png",
    "content": "# Collect Values with Rest Parameters\n\n## 1. Collecting Arguments\nWhile the spread operator expands arrays into separate values, the **Rest Parameter** does the exact opposite! It appears in a function's parameter list and collects a comma-separated list of arguments into a single array.\n\n```ts\n// 💡 The '...numbers' rest parameter collects all arguments into an array of numbers\nconst add = (...numbers: number[]) => {\n  return numbers.reduce((currentResult, currentValue) => {\n    return currentResult + currentValue;\n  }, 0);\n};\n\nconst addedNumbers = add(5, 10, 2, 3.7); // ✅ OK: All 4 numbers are collected into the array\n```\n*Note: The initial `0` gives `reduce` a valid accumulator even when the rest array is empty.*\n\n## 2. Rest Parameters with Tuples\nYou can use `number[]` for any unknown count of arguments. But if your domain requires a specific, fixed number of arguments, you can type the rest parameter as a Tuple!\n\n```ts\n// 💡 Forcing the rest parameter to collect exactly three numbers\nconst addExactlyThree = (...numbers: [number, number, number]) =>\n  numbers.reduce((total, value) => total + value, 0);\n\naddExactlyThree(5, 10, 2); // ✅ OK\n// ❌ Error: Expected 3 arguments, but got 2.\n// addExactlyThree(5, 10); \n```\n\n## Complete Code Snippet\n```ts\n// ✅ OK: Collects any number of arguments into a number array\nconst add = (...numbers: number[]): number => {\n  return numbers.reduce((currentResult, currentValue) => {\n    return currentResult + currentValue;\n  }, 0);\n};\n\n// ✅ OK: Collects exactly three arguments using a Tuple type\nconst addExactlyThree = (\n  ...numbers: [number, number, number]\n): number => numbers.reduce((total, value) => total + value, 0);\n\nconst addedNumbers = add(5, 10, 2, 3.7);\nconst threeNumberTotal = addExactlyThree(5, 10, 2);\n\nconsole.log(addedNumbers, threeNumberTotal);\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "What does a rest parameter (`...args`) do when used inside a function's parameter list?",
        "options": [
          "It collects all the remaining individual arguments passed to the function and merges them into a single array variable.",
          "It forces the function to pause execution.",
          "It creates a new `tsconfig.json` property.",
          "It performs a deep copy of the arguments."
        ],
        "correct": 0,
        "explanation": "Rest merges the remaining comma-separated call arguments into an array structure."
      },
      {
        "type": "mcq",
        "question": "Why might you type a rest parameter as a Tuple (e.g., `...args: [string, number]`) instead of an open array (`...args: any[]`)?",
        "options": [
          "To enforce a strict contract requiring an exact number of arguments in a specific order, catching mistakes if the caller provides too few or too many arguments.",
          "Because any count of arguments is allowed in TypeScript.",
          "To compile the application as CSS.",
          "Because TypeScript requires all arrays to be tuples."
        ],
        "correct": 0,
        "explanation": "A tuple captures fixed arity (number of arguments) and strict positional types, giving you maximum type safety."
      }
    ]
  },
  {
    "id": "ts_next_gen_07",
    "title": "Destructure Arrays & Objects",
    "image": "/assets/typescript/ts_next_gen/07-destructuring.png",
    "content": "# Destructure Arrays & Objects\n\n## 1. Array Destructuring\nDestructuring allows you to easily extract values from arrays and objects into distinct variables. For arrays, destructuring extracts values strictly **by position**. You can also combine this with the rest operator to collect the remaining unextracted values!\n\n```ts\nconst hobbies = ['Sports', 'Cooking', 'Hiking', 'Reading'];\n\n// 💡 Extracts the first two positions, and collects the rest into a new array!\nconst [hobby1, hobby2, ...remainingHobbies] = hobbies;\n\nconsole.log(hobby1); // 'Sports'\nconsole.log(remainingHobbies); // ['Hiking', 'Reading']\n```\n*Note: The original array remains completely unchanged.*\n\n## 2. Object Destructuring\nUnlike arrays, object destructuring extracts values **by property key name**, regardless of the order they appear in the object.\n\n```ts\nconst person = { firstName: 'Max', age: 30 };\n// 💡 Extracts variables matching the exact property names\nconst { firstName, age } = person; \n```\n\nIf you want to extract a property but give it a different local variable name, use a colon (`:`).\n```ts\n// 💡 The colon here means \"rename firstName to userName\". It is NOT a TypeScript type annotation!\nconst { firstName: userName, age } = person;\nconsole.log(userName, age);\n```\n\n## Complete Code Snippet\n```ts\nconst hobbies = ['Sports', 'Cooking', 'Hiking', 'Reading'];\n\n// ✅ OK: Array destructuring by position, utilizing the rest operator\nconst [hobby1, hobby2, ...remainingHobbies] = hobbies;\n\nconst person = {\n  firstName: 'Max',\n  age: 30,\n};\n\n// ✅ OK: Object destructuring by key, renaming firstName to userName\nconst { firstName: userName, age } = person;\n\nconsole.log(hobbies);\nconsole.log(hobby1, hobby2, remainingHobbies);\nconsole.log(userName, age);\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "How does array destructuring determine which values are assigned to which variables?",
        "options": [
          "Array patterns map variables strictly by their ordered position within the array.",
          "By matching the property names of the array.",
          "Alphabetically.",
          "By checking the `tsconfig.json`."
        ],
        "correct": 0,
        "explanation": "Array patterns rely entirely on position (index) to map variables to array elements."
      },
      {
        "type": "mcq",
        "question": "When destructuring an object, what does the syntax `{ firstName: userName }` achieve?",
        "options": [
          "It extracts the value of the `firstName` property, but assigns it to a newly created local variable named `userName`.",
          "It types `firstName` as the `userName` object.",
          "It assigns the value of `userName` to the `firstName` property in the object.",
          "It deletes `firstName` from the object."
        ],
        "correct": 0,
        "explanation": "The colon introduces a local alias in an object binding pattern, renaming it for your local scope without changing the original object."
      }
    ]
  },
  {
    "id": "ts_next_gen_08",
    "title": "Compile Modern Syntax for Older Runtimes",
    "image": "/assets/typescript/ts_next_gen/08-compile-target.png",
    "content": "# Compile Modern Syntax for Older Runtimes\n\n## 1. The Power of `target`\nWhen your `tsconfig.json` has an `ES6` target, many of the modern features in this section (like arrow functions, `let`/`const`, and destructuring) are left exactly as they are in your emitted JavaScript, because ES6 natively supports them!\n\n```json\n{\n  \"compilerOptions\": {\n    \"target\": \"ES6\" // 💡 Keeps modern syntax intact\n  }\n}\n```\n\n## 2. Compiling for Older Browsers\nIf you need to support older browsers, you can change the target to `ES5`. TypeScript will automatically rewrite your modern syntax into older equivalents. Your emitted file will become much longer: `let` and `const` will turn into `var`, arrow functions become standard functions, and destructuring becomes manual property lookups!\n\n```json\n{\n  \"compilerOptions\": {\n    \"target\": \"ES5\" // 💡 Forces TypeScript to transpile down to older syntax\n  }\n}\n```\n\n## 3. Polyfills vs. Transpilation\nIt is critical to understand the distinction of what the compiler does:\n* **Syntax Transpilation:** Modern *syntax* (like arrow functions) is rewritten to match your `target`. TypeScript-only syntax (like types) is completely removed.\n* **No Runtime Polyfills:** Missing modern *APIs* (like `Promise` or `fetch`) are **not** polyfilled by the compiler! If your target environment doesn't support them, you must include a separate polyfill library.\n\n## Complete Code Snippet\n**`src/app.ts`**\n```ts\nconst hobbies = ['Sports', 'Cooking', 'Hiking', 'Reading'];\nconst [hobby1, hobby2, ...remainingHobbies] = hobbies;\n\nconst person = {\n  firstName: 'Max',\n  age: 30,\n};\n\nconst { firstName: userName, age } = person;\n\nconsole.log(hobbies, hobby1, hobby2, remainingHobbies, userName, age);\n```\n\n**`tsconfig.json`**\n```json\n{\n  \"compilerOptions\": {\n    // ✅ OK: Set to ES5 to safely support older runtimes!\n    \"target\": \"ES5\",\n    \"lib\": [\"DOM\", \"ES5\", \"ScriptHost\"],\n    \"rootDir\": \"./src\",\n    \"outDir\": \"./dist\",\n    \"sourceMap\": true,\n    \"strict\": true\n  },\n  \"include\": [\"src\"]\n}\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "What happens to your modern `let` declarations and arrow functions when you change your TypeScript compilation target from `ES6` to `ES5`?",
        "options": [
          "TypeScript automatically transpiles and rewrites the unsupported modern syntax into older equivalents (like using `var` and standard functions) so it runs safely on older engines.",
          "The source file is deleted.",
          "Types become runtime validators.",
          "The browser target changes itself automatically."
        ],
        "correct": 0,
        "explanation": "Target controls the language level of generated JavaScript, converting new syntactical features down to older equivalents when needed."
      },
      {
        "type": "mcq",
        "question": "Does changing the TypeScript target to `ES5` automatically polyfill missing runtime APIs, like `fetch` or `Promise`, for older browsers?",
        "options": [
          "No. TypeScript only transpiles modern syntax. It does not provide runtime polyfills for missing browser APIs; you must add those separately.",
          "Yes, TypeScript includes a full suite of polyfills.",
          "Only if you compile in strict mode.",
          "Only if you use source maps."
        ],
        "correct": 0,
        "explanation": "Compilation can transform syntax, but missing runtime APIs need separate polyfills or a newer runtime environment."
      }
    ]
  }
];

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log("Section 5 patched successfully!");
