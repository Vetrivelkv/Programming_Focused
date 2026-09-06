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
    "id": "ts_demo_01",
    "title": "Model the Investment Calculator",
    "image": "/assets/typescript/ts_demo/01-first-steps.png",
    "content": "# Model the Investment Calculator\n\n## 1. Setting Up Our Data\nLet's build an investment calculator! We'll take four basic inputs and turn them into a year-by-year financial projection. Our inputs are: the initial amount, the annual contribution, the expected return (as a decimal), and the duration in years. \n\nBefore we write any complex loops, let's start by simply naming and defining our data.\n\n```ts\n// 💡 Start by explicitly defining the types for each of our financial inputs.\nconst initialAmount: number = 5000;\nconst annualContribution: number = 500;\nconst expectedReturn: number = 0.08; // 💡 8% return represented as a decimal\nconst duration: number = 10;\n```\n\n## 2. Running the Code\nWe'll use Node.js to run the JavaScript file that TypeScript generates for us. Keeping this example out of the browser helps us focus purely on the language and how the compiler works.\n\nRun this in your terminal:\n```bash\nnpx tsc && node dist/calculator.js\n```\n\n## Complete Code Snippet\n```ts\n// ✅ OK: All our inputs are strictly typed as numbers\nconst initialAmount: number = 5000;\nconst annualContribution: number = 500;\nconst expectedReturn: number = 0.08;\nconst duration: number = 10;\n\nconsole.log({ initialAmount, annualContribution, expectedReturn, duration });\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "You're setting up the investment calculator and someone suggests passing the expected return as a string like `\"8%\"`. Why is it better to use a number like `0.08` instead?",
        "options": [
          "Math operations require numeric values, so passing a decimal number avoids runtime conversion errors.",
          "TypeScript cannot compile string types into JavaScript.",
          "Strings take up too much memory in Node.js.",
          "It isn't better; `\"8%\"` is the preferred format in TypeScript."
        ],
        "correct": 0,
        "explanation": "Financial calculations require mathematical operations. Using a decimal `number` (like 0.08) ensures you can multiply it directly without needing to parse a string first."
      },
      {
        "type": "mcq",
        "question": "You just finished writing `calculator.ts`. Your teammate tries to run `node src/calculator.ts` and it crashes. What did they do wrong?",
        "options": [
          "Node executes JavaScript, not TypeScript. They need to compile it first with `npx tsc` and run the emitted `.js` file.",
          "They forgot to add `--run` to the node command.",
          "TypeScript files must be run inside a web browser, not Node.",
          "The file should be named `calculator.js` before writing TypeScript in it."
        ],
        "correct": 0,
        "explanation": "TypeScript is a compile-time tool. Node.js only understands JavaScript, so you must always compile your `.ts` files into `.js` files before running them."
      }
    ]
  },
  {
    "id": "ts_demo_02",
    "title": "Create Reusable Investment Types",
    "image": "/assets/typescript/ts_demo/02-custom-types.png",
    "content": "# Create Reusable Investment Types\n\n## 1. Grouping Inputs\nPassing four separate numbers into a function can get messy and confusing. Instead, let's group these related inputs into a single domain object. By creating a custom type alias, we give our function a single, clear contract.\n\n```ts\n// 💡 Grouping related data makes our functions much easier to read and use later!\ntype InvestmentData = {\n  initialAmount: number;\n  annualContribution: number;\n  expectedReturn: number;\n  duration: number;\n};\n```\n\n## 2. Defining the Output\nOur calculator will project the investment's growth year by year. Since every projected year will have the exact same shape (a year label, total amount, etc.), it deserves its own type too!\n\n```ts\n// 💡 This defines exactly what one year of our projection will look like.\ntype InvestmentResult = {\n  year: string;\n  totalAmount: number;\n  totalContributions: number;\n  totalInterestEarned: number;\n};\n```\n\n## Complete Code Snippet\n```ts\n// ✅ OK: Our clear, reusable input contract\ntype InvestmentData = {\n  initialAmount: number;\n  annualContribution: number;\n  expectedReturn: number;\n  duration: number;\n};\n\n// ✅ OK: The exact shape of a single projected year\ntype InvestmentResult = {\n  year: string;\n  totalAmount: number;\n  totalContributions: number;\n  totalInterestEarned: number;\n};\n\n// 💡 Using our new types to strictly type our data objects\nconst data: InvestmentData = {\n  initialAmount: 5000,\n  annualContribution: 500,\n  expectedReturn: 0.08, // ❌ Error if we passed a string here!\n  duration: 10,\n};\n\nconst firstYear: InvestmentResult = {\n  year: 'Year 1',\n  totalAmount: 5940,\n  totalContributions: 500,\n  totalInterestEarned: 400,\n};\n\nconsole.log(data, firstYear);\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "You're writing a function `calculateInvestment`. Why is it safer to accept a single `data: InvestmentData` object instead of four separate number parameters?",
        "options": [
          "It prevents bugs caused by passing arguments in the wrong order, and makes the function signature much cleaner.",
          "TypeScript restricts functions to a maximum of three parameters.",
          "It automatically validates that the numbers are greater than zero.",
          "Objects run faster in JavaScript than individual arguments."
        ],
        "correct": 0,
        "explanation": "When a function takes multiple arguments of the same type (like four numbers), it's very easy to accidentally swap them. Passing a single typed object guarantees the data is labeled and structured correctly."
      },
      {
        "type": "mcq",
        "question": "You want to store a list of all 10 projected years. Based on our new types, what is the correct type annotation for that array?",
        "options": [
          "`InvestmentResult[]`",
          "`InvestmentData[]`",
          "`Array<InvestmentData>`",
          "`[InvestmentResult]`"
        ],
        "correct": 0,
        "explanation": "`InvestmentResult` represents a single year's projection. To hold multiple years, you need an array of those results, which is written as `InvestmentResult[]`."
      }
    ]
  },
  {
    "id": "ts_demo_03",
    "title": "Return Results or a Validation Message",
    "image": "/assets/typescript/ts_demo/03-union-result.png",
    "content": "# Return Results or a Validation Message\n\n## 1. Modeling the Outcomes\nIf a user provides invalid inputs (like a negative investment duration), our calculator can't produce a meaningful projection. We need to be honest about this in our types! Instead of returning an empty array or a partially valid projection, we'll return a **Union Type**.\n\nOur function will return either an array of results OR a string containing an error message.\n\n```ts\n// 💡 A Union Type perfectly describes a function that might succeed OR fail with a message.\ntype CalculationResult = InvestmentResult[] | string;\n```\n\n## 2. Handling the Union\nBecause the return type is a union, TypeScript will force whoever calls this function to check the result (narrowing the type) before trying to loop over it. This makes error handling a mandatory part of our function's contract!\n\n## Complete Code Snippet\n```ts\ntype InvestmentData = {\n  initialAmount: number;\n  annualContribution: number;\n  expectedReturn: number;\n  duration: number;\n};\n\ntype InvestmentResult = {\n  year: string;\n  totalAmount: number;\n  totalContributions: number;\n  totalInterestEarned: number;\n};\n\n// 💡 The union that enforces error checking\ntype CalculationResult = InvestmentResult[] | string;\n\nfunction validateInvestment(data: InvestmentData): CalculationResult {\n  // ✅ OK: Returning strings when validation fails\n  if (data.initialAmount < 0) return 'Initial amount must be at least zero.';\n  if (data.duration <= 0) return 'Duration must be greater than zero.';\n  if (data.expectedReturn < 0) return 'Expected return must be at least zero.';\n  \n  // ✅ OK: Returning an array when everything is fine\n  return [];\n}\n\nconst result = validateInvestment({\n  initialAmount: 5000,\n  annualContribution: 500,\n  expectedReturn: 0.08,\n  duration: 10,\n});\n\nconsole.log(result);\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "You call `validateInvestment` and store the output in `let myResult`. You immediately try to run `myResult.forEach(...)` but TypeScript throws an error. Why?",
        "options": [
          "Because `myResult` might be a string (an error message), and strings don't have a `.forEach` method. You must narrow the type first.",
          "Because the array returned by the function is read-only.",
          "Because `.forEach` is not supported in TypeScript.",
          "Because the union type automatically converts the array into a string."
        ],
        "correct": 0,
        "explanation": "When dealing with a union like `InvestmentResult[] | string`, TypeScript protects you from runtime crashes by forcing you to prove the value is actually an array before you use array methods on it."
      },
      {
        "type": "mcq",
        "question": "You want to safely check if the result is an error message so you can display it to the user. How do you narrow the union type?",
        "options": [
          "Use a runtime check like `if (typeof result === 'string')` to handle the error message.",
          "Use a type assertion like `result as string` to force it to be an error.",
          "Wrap the call in a `try/catch` block.",
          "Use `if (result === string)` to check the type."
        ],
        "correct": 0,
        "explanation": "Using the JavaScript `typeof` operator allows TypeScript to automatically narrow the union type. Inside the `if` block, TypeScript knows `result` is a string!"
      }
    ]
  },
  {
    "id": "ts_demo_04",
    "title": "Build the Annual Projection Loop",
    "image": "/assets/typescript/ts_demo/04-calculation-loop.png",
    "content": "# Build the Annual Projection Loop\n\n## 1. The Calculation Logic\nNow it's time to build the core engine of our calculator! For each year of the duration, we need to:\n1. Apply the expected growth to our current total.\n2. Calculate the total interest earned so far.\n3. Add the new annual contribution to our totals.\n4. Save a snapshot of this year's data.\n\nThe order of these operations is critical—if we apply the contribution *before* the growth, it changes the financial math entirely!\n\n```ts\n// 💡 The core financial logic running inside our loop\ntotal *= 1 + expectedReturn;\ntotalInterestEarned = total - totalContributions - initialAmount;\ntotalContributions += annualContribution;\ntotal += annualContribution;\n```\n\n## 2. Saving the Snapshot\nEvery time the loop finishes a year, we push a new `InvestmentResult` object into our array. This creates a permanent snapshot of the investment's state at the end of that specific year.\n\n## Complete Code Snippet\n```ts\ntype InvestmentData = {\n  initialAmount: number;\n  annualContribution: number;\n  expectedReturn: number;\n  duration: number;\n};\n\ntype InvestmentResult = {\n  year: string;\n  totalAmount: number;\n  totalContributions: number;\n  totalInterestEarned: number;\n};\n\nfunction calculateInvestment(data: InvestmentData): InvestmentResult[] {\n  const { initialAmount, annualContribution, expectedReturn, duration } = data;\n  \n  let total = initialAmount;\n  let totalContributions = 0;\n  let totalInterestEarned = 0;\n  const results: InvestmentResult[] = [];\n\n  for (let year = 1; year <= duration; year++) {\n    // 💡 Order matters! We grow the existing money before adding new contributions.\n    total *= 1 + expectedReturn;\n    totalInterestEarned = total - totalContributions - initialAmount;\n    \n    totalContributions += annualContribution;\n    total += annualContribution;\n    \n    // ✅ OK: Saving an immutable snapshot for this year\n    results.push({\n      year: `Year ${year}`,\n      totalAmount: total,\n      totalContributions,\n      totalInterestEarned,\n    });\n  }\n\n  return results;\n}\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "You're reviewing the loop logic. What would happen if you pushed the `results.push(...)` snapshot outside and after the `for` loop finishes?",
        "options": [
          "You would only get a single object representing the final year's totals, instead of a year-by-year breakdown.",
          "It would throw a TypeScript compiler error because arrays must be populated inside loops.",
          "The calculations would fail because the variables would reset.",
          "Nothing, it would behave exactly the same way."
        ],
        "correct": 0,
        "explanation": "Pushing inside the loop captures the state of the variables at each specific step (Year 1, Year 2, etc.). Moving it outside would only capture the final resulting state."
      },
      {
        "type": "mcq",
        "question": "In the loop, we mutate (change) the `total` and `totalContributions` variables. Why don't these mutations ruin the historical snapshots we saved in previous years?",
        "options": [
          "Because we create and push a brand new object literal `{...}` on every iteration, which captures the values by value at that moment.",
          "Because TypeScript makes variables immutable by default inside loops.",
          "Because we used `const` for the `results` array.",
          "Because the loop runs asynchronously."
        ],
        "correct": 0,
        "explanation": "Every time the loop runs, a newly allocated object is created and pushed to the array. Modifying the primitive number variables later doesn't reach back and change the properties of the objects we already saved."
      }
    ]
  },
  {
    "id": "ts_demo_05",
    "title": "Connect Calculation & Presentation",
    "image": "/assets/typescript/ts_demo/05-connect-functions.png",
    "content": "# Connect Calculation & Presentation\n\n## 1. Separation of Concerns\nIt's a best practice to keep your math (calculations) completely separate from your UI (presentation). Our `calculateInvestment` function only returns data. It shouldn't care *how* that data is shown to the user.\n\nWe'll create a dedicated `printResults` function to handle the output. This function takes our union type, checks for errors, and formats the text for the console.\n\n```ts\nfunction printResults(results: CalculationResult): void {\n  // 💡 Narrowing the union! If it's a string, it's an error message.\n  if (typeof results === 'string') {\n    console.log(`❌ Error: ${results}`);\n    return; // 💡 Early return stops the rest of the function from running\n  }\n\n  // 💡 Because of the early return above, TypeScript KNOWS results is an array here!\n  for (const result of results) {\n    console.log(result.year);\n  }\n}\n```\nBy keeping these separate, you could easily reuse your exact same math logic in a React web app or a mobile app!\n\n## Complete Code Snippet\n```ts\ntype InvestmentData = {\n  initialAmount: number;\n  annualContribution: number;\n  expectedReturn: number;\n  duration: number;\n};\n\ntype InvestmentResult = {\n  year: string;\n  totalAmount: number;\n  totalContributions: number;\n  totalInterestEarned: number;\n};\n\ntype CalculationResult = InvestmentResult[] | string;\n\nfunction calculateInvestment(data: InvestmentData): CalculationResult {\n  const { initialAmount, annualContribution, expectedReturn, duration } = data;\n\n  // ✅ OK: Returning validation errors as strings\n  if (initialAmount < 0) return 'Initial amount must be at least zero.';\n  if (duration <= 0) return 'Duration must be greater than zero.';\n  if (expectedReturn < 0) return 'Expected return must be at least zero.';\n\n  let total = initialAmount;\n  let totalContributions = 0;\n  let totalInterestEarned = 0;\n  const annualResults: InvestmentResult[] = [];\n\n  for (let year = 1; year <= duration; year++) {\n    total *= 1 + expectedReturn;\n    totalInterestEarned = total - totalContributions - initialAmount;\n    totalContributions += annualContribution;\n    total += annualContribution;\n    \n    annualResults.push({\n      year: `Year ${year}`,\n      totalAmount: total,\n      totalContributions,\n      totalInterestEarned,\n    });\n  }\n\n  return annualResults;\n}\n\n// 💡 A dedicated function just for handling the presentation\nfunction printResults(results: CalculationResult): void {\n  if (typeof results === 'string') {\n    // ❌ Error message handling\n    console.log(`Error: ${results}`);\n    return;\n  }\n\n  // ✅ OK: Formatting the valid data\n  for (const result of results) {\n    console.log(`--- ${result.year} ---`);\n    console.log(`Total: $${result.totalAmount.toFixed(2)}`);\n    console.log(`Contributions: $${result.totalContributions.toFixed(2)}`);\n    console.log(`Interest: $${result.totalInterestEarned.toFixed(2)}`);\n  }\n}\n\nconst data: InvestmentData = {\n  initialAmount: 5000,\n  annualContribution: 500,\n  expectedReturn: 0.08,\n  duration: 10,\n};\n\n// 💡 Pass the calculated data straight into our printer!\nprintResults(calculateInvestment(data));\n```",
    "questions": [
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
        "question": "Inside `printResults`, what is the purpose of the `return;` statement inside the `if (typeof results === 'string')` block?",
        "options": [
          "It acts as an \"early return\", stopping the function and guaranteeing to TypeScript that the remaining code will only execute if `results` is an array.",
          "It converts the string back into an array so the loop doesn't crash.",
          "It returns the string to the original caller of the function.",
          "It forces Node.js to exit the program entirely."
        ],
        "correct": 0,
        "explanation": "An early return is a powerful way to narrow types. Once you return out of the function on the string condition, TypeScript is smart enough to know that any code following the `if` statement *must* be dealing with the array."
      }
    ]
  },
  {
    "id": "ts_demo_06",
    "title": "Compile & Execute the Complete Project",
    "image": "/assets/typescript/ts_demo/06-compile-execute.png",
    "content": "# Compile & Execute the Complete Project\n\n## 1. The Final Workflow\nWe have our complete, robust calculator! Now we need to test our entire workflow. We will ask TypeScript to check the project, emit the final JavaScript only if it's completely valid, and then run it.\n\n```bash\n# 💡 Step 1: Compile the TypeScript into JavaScript\nnpx tsc\n\n# 💡 Step 2: Run the newly created JavaScript file\nnode dist/calculator.js\n```\n\n## 2. Testing Edge Cases\nTo prove our application is truly robust, we should intentionally break it. Try changing the `expectedReturn` to `-0.05` or the `duration` to `0`. \n\nRun the compilation and execution commands again. Because of our validation and union types, the application won't crash—it will gracefully print out our error messages!\n\n## Complete Code Snippet\n```ts\n// ✅ OK: Final complete application!\ntype InvestmentData = {\n  initialAmount: number;\n  annualContribution: number;\n  expectedReturn: number;\n  duration: number;\n};\n\ntype InvestmentResult = {\n  year: string;\n  totalAmount: number;\n  totalContributions: number;\n  totalInterestEarned: number;\n};\n\ntype CalculationResult = InvestmentResult[] | string;\n\nfunction calculateInvestment(data: InvestmentData): CalculationResult {\n  const { initialAmount, annualContribution, expectedReturn, duration } = data;\n\n  if (initialAmount < 0) return 'Initial amount must be at least zero.';\n  if (duration <= 0) return 'Duration must be greater than zero.';\n  if (expectedReturn < 0) return 'Expected return must be at least zero.';\n\n  let total = initialAmount;\n  let totalContributions = 0;\n  let totalInterestEarned = 0;\n  const annualResults: InvestmentResult[] = [];\n\n  for (let year = 1; year <= duration; year++) {\n    total *= 1 + expectedReturn;\n    totalInterestEarned = total - totalContributions - initialAmount;\n    totalContributions += annualContribution;\n    total += annualContribution;\n    \n    annualResults.push({\n      year: `Year ${year}`,\n      totalAmount: total,\n      totalContributions,\n      totalInterestEarned,\n    });\n  }\n\n  return annualResults;\n}\n\nfunction printResults(results: CalculationResult): void {\n  if (typeof results === 'string') {\n    // ❌ Error handling\n    console.log(`Error: ${results}`);\n    return;\n  }\n\n  // ✅ OK: Success handling\n  for (const result of results) {\n    console.log(`--- ${result.year} ---`);\n    console.log(`Total: $${result.totalAmount.toFixed(2)}`);\n    console.log(`Contributions: $${result.totalContributions.toFixed(2)}`);\n    console.log(`Interest: $${result.totalInterestEarned.toFixed(2)}`);\n  }\n}\n\n// 💡 Try changing these values to test the error paths!\nconst data: InvestmentData = {\n  initialAmount: 5000,\n  annualContribution: 500,\n  expectedReturn: 0.08,\n  duration: 10,\n};\n\nprintResults(calculateInvestment(data));\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "You make a change to `calculator.ts`, but when you run `node dist/calculator.js`, you don't see your changes. What did you forget to do?",
        "options": [
          "You forgot to run `npx tsc` to compile the updated TypeScript code into the new JavaScript file.",
          "You forgot to save the file in your code editor.",
          "You need to restart your computer to clear the Node.js cache.",
          "You ran the wrong file; you should have run `node src/calculator.ts`."
        ],
        "correct": 0,
        "explanation": "Node.js only runs the `.js` files in your `dist` folder. If you edit your `.ts` source files, you must always recompile with `tsc` to update the JavaScript output before running it."
      },
      {
        "type": "mcq",
        "question": "Why is it important to test your application with invalid data (like a duration of `-5` years)?",
        "options": [
          "To ensure your validation logic and error-handling branches work correctly and gracefully alert the user, rather than crashing unexpectedly.",
          "To force TypeScript to throw a compile-time error.",
          "To bypass the compiler and test Node.js directly.",
          "It isn't important; users will never input negative numbers."
        ],
        "correct": 0,
        "explanation": "A robust application handles both expected success paths and unexpected failure paths. Testing invalid data proves that your error handling works as designed in the real world."
      }
    ]
  }
];

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log("Section 4 patched successfully!");
