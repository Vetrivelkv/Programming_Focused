const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../backend/data/typescript_curriculum.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const section4 = data.topics[3];
if (!section4 || !section4.name.includes("Section 4")) {
    console.error("Section 4 not found at index 3");
    process.exit(1);
}

section4.subtopics = [
  {
    "id": "ts_demo_complete",
    "title": "Building the Investment Calculator Project",
    "image": "/assets/typescript/ts_demo/06-compile-execute.png",
    "content": "# Building the Investment Calculator Project\n\nLet's bring all our TypeScript skills together into a complete, working demo! We're going to build a CLI tool that takes an initial investment, adds an annual contribution, and projects the growth over a duration of time.\n\n## 1. Setting Up Our Data & Types\nInstead of passing around a bunch of disconnected numbers, we'll group our inputs into a single domain object. We'll also define exactly what a single year of our projection looks like.\n\n```ts\n// 💡 Grouping related data makes our function signatures clean and readable\ntype InvestmentData = {\n  initialAmount: number;\n  annualContribution: number;\n  expectedReturn: number; // 💡 e.g., 0.08 for 8%\n  duration: number;\n};\n\n// 💡 The exact shape of a single projected year's snapshot\ntype InvestmentResult = {\n  year: string;\n  totalAmount: number;\n  totalContributions: number;\n  totalInterestEarned: number;\n};\n```\n\n## 2. Modeling the Outcomes & Validation\nIf a user provides invalid inputs (like a negative investment duration), our calculator can't produce a meaningful projection. We'll use a **Union Type** to be honest about our return values: we'll return an array of results on success, OR a string error message on failure.\n\n```ts\n// 💡 A Union Type perfectly describes a function that might succeed OR fail with a message.\ntype CalculationResult = InvestmentResult[] | string;\n```\nBecause the return type is a union, TypeScript will force whoever calls this function to check the result (narrowing the type) before trying to use it. \n\n## 3. Building the Annual Projection Loop\nNow we build the core math engine. The order of operations inside our loop is critical!\n\n```ts\n// 💡 Inside our loop, we grow the existing money BEFORE adding new contributions.\ntotal *= 1 + expectedReturn;\ntotalInterestEarned = total - totalContributions - initialAmount;\ntotalContributions += annualContribution;\ntotal += annualContribution;\n```\nEvery time the loop finishes a year, we push a new `{}` object into our array. This creates a permanent, immutable snapshot of the investment's state at that specific year.\n\n## 4. Separation of Concerns (Presentation)\nIt's a best practice to keep your math logic completely separate from your UI presentation. Our `calculateInvestment` function only returns data. \n\nWe'll create a dedicated `printResults` function to handle the output. By keeping these separate, you could easily reuse your exact same math logic in a React web app!\n\n```ts\nfunction printResults(results: CalculationResult): void {\n  // 💡 Narrowing the union! If it's a string, it's an error message.\n  if (typeof results === 'string') {\n    console.log(`❌ Error: ${results}`);\n    return; // 💡 Early return stops the rest of the function from running\n  }\n\n  // 💡 Because of the early return above, TypeScript KNOWS results is an array here!\n  for (const result of results) {\n    console.log(result.year);\n  }\n}\n```\n\n## 5. Compiling & Executing\nWe have our complete calculator! To test our entire workflow, we compile the project and run the emitted JavaScript with Node.js.\n\n```bash\n# 💡 Step 1: Compile the TypeScript into JavaScript\nnpx tsc\n\n# 💡 Step 2: Run the newly created JavaScript file\nnode dist/calculator.js\n```\n\n## Complete Code Snippet\n```ts\n// ✅ OK: Final complete application!\ntype InvestmentData = {\n  initialAmount: number;\n  annualContribution: number;\n  expectedReturn: number;\n  duration: number;\n};\n\ntype InvestmentResult = {\n  year: string;\n  totalAmount: number;\n  totalContributions: number;\n  totalInterestEarned: number;\n};\n\ntype CalculationResult = InvestmentResult[] | string;\n\nfunction calculateInvestment(data: InvestmentData): CalculationResult {\n  const { initialAmount, annualContribution, expectedReturn, duration } = data;\n\n  // ✅ OK: Returning validation errors as strings\n  if (initialAmount < 0) return 'Initial amount must be at least zero.';\n  if (duration <= 0) return 'Duration must be greater than zero.';\n  if (expectedReturn < 0) return 'Expected return must be at least zero.';\n\n  let total = initialAmount;\n  let totalContributions = 0;\n  let totalInterestEarned = 0;\n  const annualResults: InvestmentResult[] = [];\n\n  for (let year = 1; year <= duration; year++) {\n    total *= 1 + expectedReturn;\n    totalInterestEarned = total - totalContributions - initialAmount;\n    totalContributions += annualContribution;\n    total += annualContribution;\n    \n    // ✅ OK: Saving an immutable snapshot for this year\n    annualResults.push({\n      year: `Year ${year}`,\n      totalAmount: total,\n      totalContributions,\n      totalInterestEarned,\n    });\n  }\n\n  return annualResults;\n}\n\n// 💡 A dedicated function just for handling the presentation\nfunction printResults(results: CalculationResult): void {\n  if (typeof results === 'string') {\n    // ❌ Error handling\n    console.log(`Error: ${results}`);\n    return;\n  }\n\n  // ✅ OK: Success handling\n  for (const result of results) {\n    console.log(`--- ${result.year} ---`);\n    console.log(`Total: $${result.totalAmount.toFixed(2)}`);\n    console.log(`Contributions: $${result.totalContributions.toFixed(2)}`);\n    console.log(`Interest: $${result.totalInterestEarned.toFixed(2)}`);\n  }\n}\n\n// 💡 Try changing these values to test the error paths!\nconst data: InvestmentData = {\n  initialAmount: 5000,\n  annualContribution: 500,\n  expectedReturn: 0.08,\n  duration: 10,\n};\n\nprintResults(calculateInvestment(data));\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "You're writing the `calculateInvestment` function. Why is it safer to accept a single `data: InvestmentData` object instead of four separate number parameters?",
        "options": [
          "It prevents bugs caused by passing arguments in the wrong order, and guarantees the data is clearly labeled.",
          "TypeScript restricts functions to a maximum of three parameters.",
          "It automatically validates that the numbers are greater than zero.",
          "Objects run faster in JavaScript than individual arguments."
        ],
        "correct": 0,
        "explanation": "When a function takes multiple arguments of the same type (like four numbers), it's very easy to accidentally swap them. Passing a single typed object guarantees the data is labeled and structured correctly."
      },
      {
        "type": "mcq",
        "question": "You call `calculateInvestment` and store the output in `let myResult`. You immediately try to run `myResult.forEach(...)` but TypeScript throws an error. Why?",
        "options": [
          "Because `myResult` is typed as a union (`InvestmentResult[] | string`). It might be an error message string, so you must narrow the type before using array methods.",
          "Because the array returned by the function is read-only.",
          "Because `.forEach` is not supported in TypeScript.",
          "Because the union type automatically converts the array into a string."
        ],
        "correct": 0,
        "explanation": "When dealing with a union, TypeScript protects you from runtime crashes by forcing you to prove the value is actually an array before you use array methods on it."
      },
      {
        "type": "mcq",
        "question": "In the projection loop, we mutate the `total` variable. Why don't these mutations ruin the historical snapshots we saved in previous years?",
        "options": [
          "Because we create and push a brand new object literal `{...}` on every iteration, capturing the values at that exact moment.",
          "Because TypeScript makes variables immutable by default inside loops.",
          "Because we used `const` for the `results` array.",
          "Because the loop runs asynchronously."
        ],
        "correct": 0,
        "explanation": "Every time the loop runs, a newly allocated object is created and pushed to the array. Modifying the primitive number variables later doesn't reach back and change the properties of the objects we already saved."
      },
      {
        "type": "mcq",
        "question": "You're building a web dashboard and want to show the investment chart in the browser. Why was separating `calculateInvestment` and `printResults` a great idea?",
        "options": [
          "Because you can reuse the exact same `calculateInvestment` math logic in your React app, and simply replace `printResults` with a UI chart component.",
          "Because it prevents TypeScript from throwing union errors.",
          "Because browsers cannot run functions that contain `console.log`.",
          "Because it combines the math and the UI into one file for faster loading."
        ],
        "correct": 0,
        "explanation": "Separation of concerns makes code reusable. Because the calculation doesn't care about *how* things are printed, it can be seamlessly dropped into any environment (CLI, web, mobile, etc.)."
      },
      {
        "type": "mcq",
        "question": "You make a logic change to `calculator.ts`, but when you run `node dist/calculator.js`, you don't see your changes. What did you forget to do?",
        "options": [
          "You forgot to run `npx tsc` to compile the updated TypeScript code into the new JavaScript file.",
          "You forgot to save the file in your code editor.",
          "You need to restart your computer to clear the Node.js cache.",
          "You ran the wrong file; you should have run `node src/calculator.ts`."
        ],
        "correct": 0,
        "explanation": "Node.js only runs the `.js` files in your `dist` folder. If you edit your `.ts` source files, you must always recompile with `tsc` to update the JavaScript output before running it."
      }
    ]
  }
];

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log("Section 4 merged successfully!");
