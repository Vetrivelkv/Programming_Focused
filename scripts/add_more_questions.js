const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../backend/data/typescript_questions.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const newQuestions = {
  "Section 1 · Getting Started": [
    {
      "type": "mcq",
      "question": "You are migrating a large JavaScript codebase to TypeScript. Why is it beneficial that TypeScript is a superset of JavaScript?",
      "options": [
        "Valid JavaScript is generally valid TypeScript, allowing for a gradual migration without rewriting everything.",
        "TypeScript completely rewrites the code to C++ for performance.",
        "TypeScript requires a completely new syntax for every single function.",
        "TypeScript is only designed for backend Node.js code."
      ],
      "correct_option_index": 0,
      "explanation": "Because TypeScript builds upon JavaScript, you can slowly adopt it file by file without breaking your existing JavaScript logic."
    },
    {
      "type": "mcq",
      "question": "If your `tsc` compiler throws a type error, what happens to the output JavaScript file by default?",
      "options": [
        "The JavaScript file is still generated unless the `noEmitOnError` option is enabled.",
        "The build fails entirely and deletes the existing JavaScript file.",
        "The compiler crashes Node.js completely.",
        "It automatically generates an HTML file containing the errors."
      ],
      "correct_option_index": 0,
      "explanation": "By default, TypeScript assumes you might still want to test the emitted JavaScript even if there are type warnings. You must explicitly tell it to halt emission."
    },
    {
      "type": "mcq",
      "question": "Why is it generally recommended to compile TypeScript during a build step rather than compiling it on the fly in the browser?",
      "options": [
        "Browsers do not natively understand TypeScript, so compiling on the fly in the browser severely hurts performance and load times.",
        "Browsers only understand Python.",
        "It is technically impossible to compile TypeScript in a browser.",
        "Compiling on the fly requires a paid enterprise license."
      ],
      "correct_option_index": 0,
      "explanation": "Pre-compiling ensures the user's browser only downloads and runs standard, optimized JavaScript."
    }
  ],
  "Section 2 · TypeScript Basics & Basic Types": [
    {
      "type": "mcq",
      "question": "What is the key difference between the `any` type and the `unknown` type in TypeScript?",
      "options": [
        "`unknown` forces you to perform a type check before using the value, while `any` bypasses all type checking completely.",
        "`any` is strictly typed while `unknown` is loosely typed.",
        "They are exactly the same concept with different names.",
        "`unknown` can only be used on arrays."
      ],
      "correct_option_index": 0,
      "explanation": "The `unknown` type is a safer alternative to `any`. It requires you to prove what the type is (via narrowing) before you can access its properties."
    },
    {
      "type": "mcq",
      "question": "You want to declare an array that will only ever contain exactly two elements: a string followed by a boolean. Which type should you use?",
      "options": [
        "`[string, boolean]`",
        "`string | boolean[]`",
        "`Array<string, boolean>`",
        "`{string, boolean}`"
      ],
      "correct_option_index": 0,
      "explanation": "This specific syntax defines a Tuple, which strictly enforces the length and the positional types of the array."
    },
    {
      "type": "mcq",
      "question": "Why is using an `enum` sometimes discouraged in modern TypeScript compared to union literal types (e.g., `'admin' | 'user'`)?",
      "options": [
        "Enums generate additional runtime JavaScript code and objects, while union literals disappear entirely during compilation.",
        "Enums are significantly slower at compile time.",
        "Enums can only hold numerical values.",
        "Enums cannot be exported from a module."
      ],
      "correct_option_index": 0,
      "explanation": "Union literals offer the same developer experience without injecting extra boilerplate code into your compiled JavaScript bundle."
    }
  ],
  "Section 3 · The TypeScript Compiler & Configuration": [
    {
      "type": "mcq",
      "question": "If you set `\"strictNullChecks\": true` in your `tsconfig.json`, what behavior changes?",
      "options": [
        "Variables cannot implicitly hold `null` or `undefined` unless explicitly declared in their type signature.",
        "All variables must be initialized to null when declared.",
        "The compiler automatically removes all null values from the runtime code.",
        "Null values are automatically converted to undefined at runtime."
      ],
      "correct_option_index": 0,
      "explanation": "This strict setting prevents \"Cannot read property of undefined\" errors by forcing you to handle null/undefined explicitly."
    },
    {
      "type": "mcq",
      "question": "What is the specific purpose of the `\"outDir\"` compiler option?",
      "options": [
        "It specifies the directory where the compiled JavaScript output files should be saved.",
        "It tells the compiler where to look for TypeScript source files.",
        "It points to the project's node_modules folder.",
        "It defines the output format for CSS files."
      ],
      "correct_option_index": 0,
      "explanation": "The `outDir` helps maintain a clean project structure by separating compiled output (usually in a `dist` folder) from the source code."
    },
    {
      "type": "mcq",
      "question": "You have a project with both `.ts` and legacy `.js` files. Which `tsconfig.json` option must you enable to allow TypeScript to compile the `.js` files?",
      "options": [
        "`\"allowJs\": true`",
        "`\"includeJs\": true`",
        "`\"compileAll\": true`",
        "`\"legacyMode\": true`"
      ],
      "correct_option_index": 0,
      "explanation": "`allowJs` is crucial for gradually migrating older JavaScript codebases into TypeScript."
    }
  ],
  "Section 4 · TypeScript Essentials Demo Project": [
    {
      "type": "mcq",
      "question": "In an investment calculator, why is it safer to group related parameters into a single `InvestmentData` object rather than passing 5 separate number arguments?",
      "options": [
        "It prevents bugs caused by passing arguments in the wrong order and explicitly labels the incoming data.",
        "TypeScript restricts functions to a maximum of exactly 3 arguments.",
        "Objects are processed significantly faster by the V8 engine.",
        "Objects automatically convert string inputs into numbers."
      ],
      "correct_option_index": 0,
      "explanation": "When dealing with multiple arguments of the same type, passing an object guarantees the values map correctly to their intended purpose."
    },
    {
      "type": "mcq",
      "question": "You want a function to return either an array of results or a single error string. How do you accurately type this return?",
      "options": [
        "`Result[] | string`",
        "`Result[] & string`",
        "`any`",
        "`[Result, string]`"
      ],
      "correct_option_index": 0,
      "explanation": "A union type (`|`) perfectly describes a value that can be one of several different shapes depending on the outcome."
    },
    {
      "type": "mcq",
      "question": "Why is it considered a best practice to keep the math calculation logic in a separate function from the `console.log` presentation logic?",
      "options": [
        "Separation of concerns makes the calculation logic reusable in other environments, like a web dashboard or mobile app.",
        "It prevents the TypeScript compiler from crashing.",
        "The compiler requires a maximum of 20 lines per function.",
        "Math calculations cannot physically be executed in the same file as console logs."
      ],
      "correct_option_index": 0,
      "explanation": "Decoupling logic allows you to swap out the \"presentation\" layer without having to touch the core business rules."
    }
  ],
  "Section 5 · Next-generation JavaScript & TypeScript": [
    {
      "type": "mcq",
      "question": "What is the effect of using the spread operator on an object, like `const newObj = { ...oldObj };`?",
      "options": [
        "It creates a shallow copy of the object's enumerable properties into a brand new object.",
        "It deeply clones every nested array and object recursively.",
        "It mutates the old object directly.",
        "It converts the object into an array of strings."
      ],
      "correct_option_index": 0,
      "explanation": "The spread operator copies top-level properties. Any nested objects or arrays will still be shared by reference."
    },
    {
      "type": "mcq",
      "question": "How does the rest parameter differ from the spread operator in a function signature like `function sum(...args: number[])`?",
      "options": [
        "The rest parameter collects multiple comma-separated arguments into a single array variable, while spread expands an iterable into individual arguments.",
        "They are functionally identical and can be used interchangeably.",
        "The rest parameter only works on string arguments.",
        "The rest parameter requires a tuple type."
      ],
      "correct_option_index": 0,
      "explanation": "Rest gathers values together during function execution, whereas spread scatters values apart."
    },
    {
      "type": "mcq",
      "question": "If your `tsconfig.json` has `\"target\": \"ES5\"`, how does TypeScript handle modern syntax like arrow functions?",
      "options": [
        "It automatically transpiles them into traditional `function()` syntax so they run safely on older browsers.",
        "It completely ignores them.",
        "It throws a compiler error requiring you to change them manually.",
        "It downloads and polyfills the browser engine at runtime."
      ],
      "correct_option_index": 0,
      "explanation": "The `target` option tells TypeScript how far back it needs to rewrite modern syntactical features for compatibility."
    }
  ],
  "Section 6 · Classes & Interfaces": [
    {
      "type": "mcq",
      "question": "What is the primary characteristic of an `abstract` class?",
      "options": [
        "It serves as a base blueprint that cannot be instantiated directly, often forcing subclasses to implement specific methods.",
        "It automatically creates an interface at runtime.",
        "It strictly prevents any inheritance.",
        "It makes all of its methods private."
      ],
      "correct_option_index": 0,
      "explanation": "Abstract classes are foundational. They define shared logic but remain incomplete, requiring a concrete subclass to be usable."
    },
    {
      "type": "mcq",
      "question": "If a class `implements` an interface, what does the TypeScript compiler strictly verify?",
      "options": [
        "It verifies that the class possesses at least all the properties and methods defined by the interface contract.",
        "It verifies the actual runtime values of the class properties.",
        "It checks if the class is marked as abstract.",
        "It strictly prevents the class from having a constructor."
      ],
      "correct_option_index": 0,
      "explanation": "The `implements` keyword enforces a minimum structural shape, acting as a compile-time guarantee of capability."
    },
    {
      "type": "mcq",
      "question": "When is it appropriate to use the `protected` access modifier instead of `private`?",
      "options": [
        "When you want the property to be hidden from outside callers, but still accessible to subclasses that extend the base class.",
        "When you want the property to be fully public.",
        "When it is a static property.",
        "When you are implementing an interface."
      ],
      "correct_option_index": 0,
      "explanation": "Protected is a middle ground that allows trusted derived classes to access internal state without exposing it globally."
    }
  ],
  "Section 7 · Advanced Types": [
    {
      "type": "mcq",
      "question": "What is the primary architectural benefit of using the `satisfies` operator over a standard type annotation?",
      "options": [
        "It validates the object's shape against a contract without erasing the highly specific inferred literal types of its properties.",
        "It securely encrypts the data at runtime.",
        "It automatically converts an interface into a class.",
        "It forces every property in the object to be readonly."
      ],
      "correct_option_index": 0,
      "explanation": "Standard annotations \"widen\" types. `satisfies` ensures compatibility while preserving exact details, which is amazing for autocompletion."
    },
    {
      "type": "mcq",
      "question": "When working with a Discriminated Union, why is it useful to pass the variable into a function expecting `never` in the `default` case of a switch statement?",
      "options": [
        "It enables exhaustive checking, triggering a compile-time error if you add a new type to the union in the future but forget to handle it.",
        "It securely clears the variable from memory.",
        "It automatically converts the union into an intersection.",
        "It prevents the switch statement from executing."
      ],
      "correct_option_index": 0,
      "explanation": "If all known cases are handled, the variable is narrowed to `never`. If a new case is added, it falls through to default, causing a type mismatch error."
    },
    {
      "type": "mcq",
      "question": "What does the `as const` assertion functionally do to an array like `['admin', 'user']`?",
      "options": [
        "It narrows the array into a strictly typed, readonly tuple of exact literal values.",
        "It converts it to a standard, mutable string array.",
        "It physically deletes the array from the compiled output.",
        "It allows the array to be mutated freely."
      ],
      "correct_option_index": 0,
      "explanation": "A const assertion prevents TypeScript from widening the types, deeply freezing the inferred structure and locking in the exact literal strings."
    }
  ]
};

let addedCount = 0;

data.topics.forEach(topic => {
  if (newQuestions[topic.name] && topic.rounds && topic.rounds.length > 0) {
    // Add the new questions to the first round of the topic
    topic.rounds[0].questions.push(...newQuestions[topic.name]);
    addedCount += newQuestions[topic.name].length;
  }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`Successfully added ${addedCount} new questions to the challenge rounds!`);
