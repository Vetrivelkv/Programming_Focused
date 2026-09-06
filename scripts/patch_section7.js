const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../backend/data/typescript_curriculum.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const section7 = data.topics[6];
if (!section7 || !section7.name.includes("Section 7")) {
    console.error("Section 7 not found at index 6");
    process.exit(1);
}

section7.subtopics = [
  {
    "id": "ts_advanced_01",
    "title": "Compose Shapes with Intersection Types",
    "image": "/assets/typescript/ts_advanced/01-intersections.png",
    "content": "# Compose Shapes with Intersection Types\n\n## 1. What is an Intersection Type?\nAn Intersection Type allows you to combine multiple distinct types into one single, unified type. \n\nWhile a Union (`|`) says \"this value can be type A *OR* type B\", an Intersection (`&`) demands \"this value must perfectly satisfy type A *AND* type B simultaneously!\"\n\n```ts\ntype FileData = { path: string; content: string };\ntype Status = { isOpen: boolean; errorMessage?: string };\n\n// 💡 The resulting type requires EVERY field from both FileData and Status\ntype AccessedFileData = FileData & Status;\n```\n\n## 2. Why Use Intersections?\nIntersection types are ideal for composing objects from highly reusable, smaller data sources. If multiple parts of your application share a `Status` object, you can easily staple it onto other shapes without writing duplicate fields.\n\n*Note: If you were using `interfaces` instead of `types`, you could achieve this exact same result using `interface AccessedFileData extends FileData, Status`.*\n\n## Complete Code Snippet\n```ts\ntype FileData = {\n  path: string;\n  content: string;\n};\n\ntype DatabaseData = {\n  connectionUrl: string;\n  credentials: string;\n};\n\ntype Status = {\n  isOpen: boolean;\n  errorMessage?: string;\n};\n\n// 💡 Combining shapes using the '&' intersection operator\ntype AccessedFileData = FileData & Status;\ntype AccessedDatabaseData = DatabaseData & Status;\n\n// ✅ OK: Must contain fields from both FileData and Status\nconst file: AccessedFileData = {\n  path: '/files/course.md',\n  content: '# TypeScript',\n  isOpen: true,\n};\n\nconst database: AccessedDatabaseData = {\n  connectionUrl: 'postgres://localhost/course',\n  credentials: 'local-dev',\n  isOpen: false,\n  errorMessage: 'Connection closed',\n};\n\nconsole.log(file, database);\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "If you create a type `type AccessedFileData = FileData & Status`, what fields must an object of this type contain?",
        "options": [
          "It must contain every single field from both the `FileData` and the `Status` objects combined.",
          "It must contain only the overlapping fields that both objects share.",
          "It must contain fields from `FileData` OR fields from `Status`, but not necessarily both.",
          "It must contain a class constructor."
        ],
        "correct": 0,
        "explanation": "An intersection (`&`) merges types together, demanding that the resulting object satisfies all the requirements of every type combined."
      },
      {
        "type": "mcq",
        "question": "If you wanted to achieve the exact same structural combination using `interfaces` instead of `types`, what syntax would you use?",
        "options": [
          "Interface inheritance: `interface AccessedFileData extends FileData, Status {}`",
          "A private field: `private fields = FileData & Status;`",
          "A function overload.",
          "A const assertion: `as const`."
        ],
        "correct": 0,
        "explanation": "Interface inheritance (extending multiple interfaces) achieves the exact same structural combination as intersecting multiple object types."
      }
    ]
  },
  {
    "id": "ts_advanced_02",
    "title": "Narrow Union Objects with Type Guards",
    "image": "/assets/typescript/ts_advanced/02-in-guards.png",
    "content": "# Narrow Union Objects with Type Guards\n\n## 1. The Problem with Unions\nWhen a function accepts a Union type (`Source = FileSource | DBSource`), TypeScript restricts you. You are only allowed to access properties that exist on *both* types! \n\nIf you want to access a property unique to `FileSource`, you must prove to TypeScript that the object is actually a file. You do this using a **Type Guard**.\n\n## 2. The `in` Operator\nThe `in` operator is a native JavaScript feature that checks if a property exists on an object at runtime. TypeScript is smart enough to understand this control flow and narrow the type automatically!\n\n```ts\nfunction loadData(source: Source) {\n  // 💡 Using 'in' as a Type Guard to check for a unique property\n  if ('path' in source) {\n    // ✅ OK: TypeScript has safely narrowed the type down to FileSource!\n    console.log(source.path);\n    return; \n  }\n}\n```\n*Note: Don't use `typeof source === 'object'` here. Both branches of the union are objects, so that check proves nothing!*\n\n## 3. Control-Flow Analysis\nBecause we placed a `return` statement inside the `if` block, TypeScript applies Control-Flow Analysis. Any code executing after that `if` block *must* be the other half of the union (`DBSource`), because the `FileSource` branch has already exited!\n\n## Complete Code Snippet\n```ts\ntype FileSource = {\n  path: string;\n};\n\ntype DBSource = {\n  connectionUrl: string;\n};\n\n// 💡 The Union Type\ntype Source = FileSource | DBSource;\n\nfunction loadData(source: Source): string {\n  // 💡 Type Guard using the 'in' operator\n  if ('path' in source) {\n    // ✅ OK: source is strictly inferred as FileSource here\n    return 'Opening file at ' + source.path;\n  }\n\n  // ✅ OK: Because of the early return above, source is strictly inferred as DBSource here!\n  return 'Connecting to ' + source.connectionUrl;\n}\n\nconst fileSource: FileSource = { path: '/data/file.csv' };\nconst dbSource: DBSource = { connectionUrl: 'db://courses' };\n\nconsole.log(loadData(fileSource));\nconsole.log(loadData(dbSource));\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "Why do we use the `in` operator (e.g., `if ('path' in source)`) when dealing with Union types containing objects?",
        "options": [
          "It provides a concrete runtime check that proves the property exists, allowing TypeScript to safely narrow the union down to a specific branch.",
          "It automatically converts the generic object into a physical file on the disk.",
          "It globally adds the `path` property to every object in the application.",
          "It disables strict mode checking for that block of code."
        ],
        "correct": 0,
        "explanation": "The `in` operator checks for property existence at runtime. TypeScript's control-flow analyzer understands this check and confidently narrows the type for you."
      },
      {
        "type": "mcq",
        "question": "In the `loadData` function, why does TypeScript allow you to safely access `source.connectionUrl` after the `if` block?",
        "options": [
          "Because the `if` block for the `FileSource` contained an early return, so control-flow analysis guarantees the remaining path must be the database branch.",
          "Because every object in TypeScript natively has a `connectionUrl` property.",
          "Because an explicit type cast (`as DBSource`) was silently added by the compiler.",
          "Because the union was transformed into an intersection."
        ],
        "correct": 0,
        "explanation": "Control-flow analysis traces execution. Since the first type exited the function early, the compiler logically deduces that only the alternative type remains."
      }
    ]
  },
  {
    "id": "ts_advanced_03",
    "title": "Model Exhaustive Branches with Discriminated Unions",
    "image": "/assets/typescript/ts_advanced/03-discriminated-unions.png",
    "content": "# Model Exhaustive Branches with Discriminated Unions\n\n## 1. The Pattern\nUsing the `in` operator to probe objects for random properties (like checking for `'path'`) works, but it's fragile. What if someone renames the property later? \n\nA more robust pattern is the **Discriminated Union**. You give every object in the union a shared \"tag\" property (often named `type` or `kind`), but give it a distinctly different **literal string value**.\n\n```ts\ntype FileSource = { type: 'file'; path: string };\ntype DBSource = { type: 'db'; connectionUrl: string };\n\ntype Source = FileSource | DBSource;\n```\nBecause both objects share the `type` field, TypeScript allows you to check it without any errors. Once you check the tag using a `switch` or `if` statement, TypeScript instantly narrows the object!\n\n## 2. Exhaustiveness Checking\nDiscriminated unions enable a superpower: **Exhaustiveness Checking**. \n\nBy adding a `default` case to your switch statement that throws an error taking a parameter of type `never`, you force the compiler to warn you if you ever add a new object to the union but forget to handle it in the switch statement!\n\n## Complete Code Snippet\n```ts\n// 💡 Adding a literal 'type' tag to each object\ntype FileSource = {\n  type: 'file';\n  path: string;\n};\n\ntype DBSource = {\n  type: 'db';\n  connectionUrl: string;\n};\n\ntype Source = FileSource | DBSource;\n\n// 💡 This function expects 'never'. It should technically be unreachable!\nfunction assertNever(value: never): never {\n  throw new Error('Unhandled source: ' + JSON.stringify(value));\n}\n\nfunction loadData(source: Source): string {\n  // 💡 Switching on the shared tag\n  switch (source.type) {\n    case 'file':\n      // ✅ OK: Narrowed to FileSource\n      return 'Opening ' + source.path;\n    case 'db':\n      // ✅ OK: Narrowed to DBSource\n      return 'Connecting to ' + source.connectionUrl;\n    default:\n      // 💡 Exhaustiveness Check: If we add a new Source later, this line will throw a compiler error!\n      return assertNever(source);\n  }\n}\n\nconsole.log(loadData({ type: 'file', path: '/data.json' }));\nconsole.log(loadData({ type: 'db', connectionUrl: 'db://local' }));\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "What architectural detail makes a Union \"Discriminated\"?",
        "options": [
          "Every member of the union has a shared property (like `type`), but each member is assigned a distinct literal string value for that property.",
          "Every member of the union is built from a class.",
          "All the fields in the union members are marked as `private`.",
          "The union relies on an index signature."
        ],
        "correct": 0,
        "explanation": "The common literal tag connects runtime branching directly to static type narrowing, making it incredibly easy to discriminate between union members."
      },
      {
        "type": "mcq",
        "question": "Why do we pass `source` into the `assertNever` function inside the `default` block of the switch statement?",
        "options": [
          "To trigger a compile-time error if we later add a new member to the union but forget to handle it, thus ensuring our code is exhaustively checked.",
          "To force all application branches to throw an exception at runtime.",
          "To automatically convert incoming strings into numerical values.",
          "To merge multiple interfaces together into a single schema."
        ],
        "correct": 0,
        "explanation": "Because `assertNever` expects an argument of type `never`, passing a newly unhandled union member into it will cause the compiler to immediately throw an error, preventing production bugs."
      }
    ]
  },
  {
    "id": "ts_advanced_04",
    "title": "Reuse instanceof & Custom Type Predicates",
    "image": "/assets/typescript/ts_advanced/04-instanceof-predicates.png",
    "content": "# Reuse instanceof & Custom Type Predicates\n\n## 1. The `instanceof` Operator\nIf your union is made of actual **Classes** (not plain object interfaces), you don't need a `type` tag or an `in` operator. You can use the native JavaScript `instanceof` operator. \n\nBecause `instanceof` checks the actual prototype chain at runtime, TypeScript will automatically narrow the type based on the result.\n\n```ts\nif (entity instanceof User) {\n  // ✅ OK: TypeScript knows this is the User class\n  entity.join(); \n}\n```\n\n## 2. Custom Type Predicates\nIf you have a complex narrowing check (like checking a `type` tag on an interface), you might want to move it into a reusable helper function. But if you just return a `boolean`, TypeScript loses the narrowing capability in the caller function!\n\nTo solve this, you define a **Custom Type Predicate** as the return type: `source is FileSource`.\n\n```ts\n// 💡 The return type 'source is FileSource' is a Type Predicate\nfunction isFile(source: Source): source is FileSource {\n  return source.type === 'file';\n}\n```\nThis tells TypeScript: *\"If this function returns true, you can confidently narrow the 'source' argument to 'FileSource'.\"* \n\n## Complete Code Snippet\n```ts\nclass User {\n  constructor(public name: string) {}\n  join(): string { return this.name + ' joined.'; }\n}\n\nclass Admin {\n  constructor(public permissions: string[]) {}\n  scan(): string { return 'Scanned: ' + this.permissions.join(', '); }\n}\n\ntype Entity = User | Admin;\n\nfunction initialize(entity: Entity): string {\n  // 💡 Type Guard using instanceof for Classes\n  if (entity instanceof User) return entity.join();\n  return entity.scan();\n}\n\ntype FileSource = { type: 'file'; path: string };\ntype DBSource = { type: 'db'; connectionUrl: string };\ntype Source = FileSource | DBSource;\n\n// 💡 Custom Type Predicate function for Interfaces/Types\nfunction isFile(source: Source): source is FileSource {\n  return source.type === 'file';\n}\n\nfunction describe(source: Source): string {\n  // ✅ OK: The caller understands the narrowing due to the type predicate!\n  return isFile(source) ? source.path : source.connectionUrl;\n}\n\nconsole.log(initialize(new User('Max')));\nconsole.log(initialize(new Admin(['users:read'])));\nconsole.log(describe({ type: 'file', path: '/notes.txt' }));\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "When is it appropriate and highly effective to use the `instanceof` type guard?",
        "options": [
          "When the alternatives in your union are actual class instances (which have a prototype chain), rather than arbitrary plain objects or interfaces.",
          "When you need to validate arbitrary interface-only objects from a JSON response.",
          "Only when you are comparing numerical types.",
          "Only during compile time, as `instanceof` doesn't exist in JavaScript."
        ],
        "correct": 0,
        "explanation": "`instanceof` is a real JavaScript operator that checks the prototype chain, making it perfect for narrowing unions composed of instantiated classes."
      },
      {
        "type": "mcq",
        "question": "What specifically does the return type `source is FileSource` accomplish on a custom function?",
        "options": [
          "It acts as a Type Predicate, telling TypeScript that if the function returns true, the compiler can safely narrow the argument's type to `FileSource`.",
          "It physically constructs a new file on the local machine.",
          "It permanently mutates the `Source` interface globally.",
          "It automatically runs validation on all objects passed into the application."
        ],
        "correct": 0,
        "explanation": "A type predicate attaches critical narrowing information to a simple Boolean result, allowing helper functions to participate in control-flow analysis."
      }
    ]
  },
  {
    "id": "ts_advanced_05",
    "title": "Map Inputs to Outputs with Function Overloads",
    "image": "/assets/typescript/ts_advanced/05-overloads.png",
    "content": "# Map Inputs to Outputs with Function Overloads\n\n## 1. The Lost Relationship\nImagine a utility function `getLength` that takes either a `string` or an `any[]` array. \n* If passed a string, it returns a string like `'3 words'`.\n* If passed an array, it returns a number.\n\nIf you simply type it as `(value: string | any[]) => string | number`, TypeScript loses the relationship. If you pass an array in, TypeScript still thinks it *might* return a string, forcing the user to manually cast the result!\n\n## 2. Function Overloads to the Rescue\n**Function Overloads** allow you to write multiple distinct function signatures that map exactly which input leads to which output. You place these overload signatures immediately above the actual implementation function.\n\n```ts\n// 💡 Overload 1: Array in, Number out\nfunction getLength(value: any[]): number;\n// 💡 Overload 2: String in, String out\nfunction getLength(value: string): string;\n\n// 💡 The Implementation Signature (must be broad enough to handle all overloads)\nfunction getLength(value: string | any[]) { /* logic here */ }\n```\nNow, when callers use this function, TypeScript provides incredibly precise result types based on exactly what they passed in. \n\n*Warning: Only use overloads when the return type dynamically changes based on the input. If the function always returns the exact same type, overloads are unnecessary!*\n\n## Complete Code Snippet\n```ts\n// 💡 The Overload Signatures\nfunction getLength(value: unknown[]): number;\nfunction getLength(value: string): string;\n\n// 💡 The actual Implementation\nfunction getLength(value: string | unknown[]): string | number {\n  if (typeof value === 'string') {\n    const numberOfWords = value.trim().split(/\\s+/).length;\n    return numberOfWords + ' words';\n  }\n\n  return value.length;\n}\n\n// ✅ OK: TypeScript knows this is strictly a string, so we can call string methods!\nconst numberOfWords = getLength('does this work?');\nconsole.log(numberOfWords.toUpperCase()); \n\n// ✅ OK: TypeScript knows this is strictly a number, so we can call number methods!\nconst numberOfItems = getLength(['Sports', 'Cookies']);\nconsole.log(numberOfItems.toFixed(0));\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "What specific problem do Function Overloads solve?",
        "options": [
          "They preserve the strict relationship between specific input forms and their precise output types, preventing the loss of information caused by broad union returns.",
          "They allow the runtime application to save data to a database state.",
          "They create private class fields securely.",
          "They automatically compile modern CSS properties."
        ],
        "correct": 0,
        "explanation": "Overloads map distinct argument patterns to exact return types, saving developers from having to manually cast their results when calling highly dynamic utility functions."
      },
      {
        "type": "mcq",
        "question": "If you write three Overload Signatures for a function, how many actual implementation bodies are you allowed to provide?",
        "options": [
          "Exactly one implementation body that uses broad enough types to handle all the overload scenarios.",
          "One implementation body per overload signature.",
          "None; overloads require the logic to be handled by a class.",
          "Exactly four bodies."
        ],
        "correct": 0,
        "explanation": "TypeScript uses a single shared implementation to process the logic, while the multiple overload signatures simply provide the strict typing contracts for the outside callers."
      }
    ]
  },
  {
    "id": "ts_advanced_06",
    "title": "Model Dynamic Keys with Index Signatures & Record",
    "image": "/assets/typescript/ts_advanced/06-index-record.png",
    "content": "# Model Dynamic Keys with Index Signatures & Record\n\n## 1. Index Signatures\nSometimes you need to build a flexible dictionary object where you don't know the property names in advance (like caching API responses or a dynamic configuration object), but you do know the *types* of values they must hold.\n\nAn **Index Signature** models this exact scenario.\n\n```ts\n// 💡 The '[property: string]' allows any string key name!\ntype DataStore = {\n  [property: string]: number | boolean;\n};\n\nconst store: DataStore = {};\nstore.id = 5; // ✅ OK\n// store.name = 'Max'; // ❌ Error: The value must be a number or boolean!\n```\n*Note: The name `property` in the brackets is just a placeholder for documentation. You can name it `key` or `id` instead.*\n\n## 2. The Built-in `Record` Utility\nWriting out the bracket syntax can be clunky. TypeScript provides a built-in utility type called `Record` that does the exact same thing in a cleaner format: `Record<KeyType, ValueType>`.\n\n```ts\n// 💡 Identical to the Index Signature above, but cleaner!\nconst metrics: Record<string, number | boolean> = {\n  lessons: 42,\n  published: true,\n};\n```\n*Warning: Use dynamic dictionaries only when keys are truly open-ended. If you know the exact keys you need, a normal object type is much safer!*\n\n## Complete Code Snippet\n```ts\n// 💡 Using the manual Index Signature\ntype DataStore = {\n  [property: string]: number | boolean;\n};\n\nconst store: DataStore = {};\nstore.id = 5;\nstore.isOpen = false;\n\n// 💡 Using the built-in Record utility\nconst metrics: Record<string, number | boolean> = {\n  lessons: 42,\n  published: true,\n};\n\nfunction printStore(values: Record<string, number | boolean>): void {\n  for (const [key, value] of Object.entries(values)) {\n    console.log(key + ': ' + value);\n  }\n}\n\nprintStore(store);\nprintStore(metrics);\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "What exactly does the Index Signature syntax `[property: string]: number | boolean` allow you to do?",
        "options": [
          "It allows the object to accept any string-based property key name, as long as its corresponding value is either a number or a boolean.",
          "It requires the object to contain a single property that is literally named 'property'.",
          "It permits the object to hold absolutely any value type, essentially disabling TypeScript.",
          "It restricts the object to only functioning as a numerical array."
        ],
        "correct": 0,
        "explanation": "The bracketed text acts as a dynamic placeholder for strings, turning the object into a flexible dictionary while still enforcing strict value types."
      },
      {
        "type": "mcq",
        "question": "Which of the following built-in TypeScript utility types achieves the exact same broad dictionary contract as a string index signature?",
        "options": [
          "`Record<string, number | boolean>`",
          "`Partial<number>`",
          "`Promise<boolean>`",
          "`ReadonlyArray<string>`"
        ],
        "correct": 0,
        "explanation": "The `Record` utility type maps an allowed key type to an allowed value type, serving as a much cleaner shorthand for index signatures."
      }
    ]
  },
  {
    "id": "ts_advanced_07",
    "title": "Preserve Literal Values with as const",
    "image": "/assets/typescript/ts_advanced/07-as-const.png",
    "content": "# Preserve Literal Values with as const\n\n## 1. The Widening Problem\nWhen you declare a basic array like `const roles = ['admin', 'guest'];`, TypeScript automatically \"widens\" the type to `string[]`. It assumes you might want to push more strings into the array later. \n\nBut what if this is a strict configuration array, and you want TypeScript to lock in those exact literal strings?\n\n## 2. The `as const` Assertion\nBy appending `as const` to a value, you are demanding that TypeScript apply the **narrowest possible inference**.\n\n```ts\n// 💡 The array becomes a completely frozen, readonly tuple of exact string literals!\nconst roles = ['admin', 'guest', 'editor'] as const;\n\n// ❌ Error: Property 'push' does not exist on type 'readonly [\"admin\", \"guest\", \"editor\"]'\n// roles.push('author'); \n```\n\n## 3. Stronger than a `const` Variable\nDon't confuse `as const` with a `const` variable declaration!\n* `const variable = ...` prevents the variable from being reassigned.\n* `... as const` reaches deep into the object or array, marking every nested property as `readonly` and locking every primitive down to its exact literal type.\n\nThis is incredibly useful for defining fixed configurations, permissions, and discriminant values without having to write out massive custom types manually.\n\n## Complete Code Snippet\n```ts\n// 💡 Narrowing an array into a readonly tuple of literals\nconst roles = ['admin', 'guest', 'editor'] as const;\n\n// 💡 A slick trick to extract a Union type directly from the array values!\ntype Role = (typeof roles)[number];\n\n// 💡 Deeply freezing an entire configuration object\nconst permissions = {\n  admin: ['read', 'write', 'delete'],\n  guest: ['read'],\n  editor: ['read', 'write'],\n} as const;\n\nfunction canWrite(role: Role): boolean {\n  // ✅ OK: permissions[role] is strictly typed as a readonly array of literals\n  const allowed: readonly string[] = permissions[role];\n  return allowed.includes('write');\n}\n\nconst firstRole = roles[0];\nconsole.log(firstRole, canWrite('admin'), canWrite('guest'));\n\n// ❌ Error: Cannot push to a readonly tuple.\n// roles.push('author'); \n\n// ❌ Error: Cannot push to a deeply frozen readonly array.\n// permissions.guest.push('write'); \n```",
    "questions": [
      {
        "type": "mcq",
        "question": "What is the inferred type of `roles[0]` after initializing the array as `const roles = ['admin', 'guest'] as const;`?",
        "options": [
          "The exact string literal type `'admin'`.",
          "The generic `string` type.",
          "The `unknown` type.",
          "The `never` type."
        ],
        "correct": 0,
        "explanation": "A const assertion stops TypeScript from widening strings. It preserves the exact literal values and positional information within a tuple."
      },
      {
        "type": "mcq",
        "question": "How does using the `as const` assertion differ from simply using a `const` variable declaration?",
        "options": [
          "A `const` declaration prevents variable reassignment, while `as const` deeply freezes the object's inferred type, narrowing literals and making nested properties readonly.",
          "It physically alters the runtime variables to be immutable.",
          "It only functions properly when applied directly to classes.",
          "There is no difference; they are redundant features."
        ],
        "correct": 0,
        "explanation": "The `const` keyword handles reassignment at the JavaScript level, but `as const` is a TypeScript feature that alters how the compiler infers the internal structure and mutability of your data."
      }
    ]
  },
  {
    "id": "ts_advanced_08",
    "title": "Validate Contracts without Losing Inference",
    "image": "/assets/typescript/ts_advanced/08-satisfies.png",
    "content": "# Validate Contracts without Losing Inference\n\n## 1. The Annotation Trade-off\nWhen you use a direct type annotation (e.g., `: Record<string, number>`), you are telling TypeScript to validate your object. However, there is a major trade-off: **you lose all the specific information about your object!**\n\n```ts\nconst annotated: Record<string, number> = {\n  entry1: 0.51,\n  entry2: -1.23,\n};\n\n// ❌ Silent Bug: The compiler allows this because the 'Record' type accepts ANY string key, even though entry3 doesn't exist!\nannotated.entry3; \n```\n\n## 2. Enter the `satisfies` Operator\nThe `satisfies` operator was introduced in TypeScript 4.9. It acts as a \"checker\". \n\nIt checks that your value successfully fulfills a target contract, but instead of widening the type to match the contract, it **retains the exact, highly-specific inferred shape of your original object!**\n\n```ts\nconst dataEntries = {\n  entry1: 0.51,\n  entry2: -1.23,\n} satisfies Record<string, number>;\n\n// ✅ OK: TypeScript knows entry2 exists\ndataEntries.entry2;\n// ❌ Error: TypeScript catches this immediately because the specific shape was preserved!\n// dataEntries.entry3; \n```\n\n## 3. When to Use It\n`satisfies` is phenomenal for library configuration (like an array of routing objects). You can ensure your config strictly matches the library's `RouteConfig` rules, while still allowing autocomplete to know the *exact* literal paths you typed!\n\n*Note: `satisfies` only performs compile-time validation. It does not manipulate data or enforce safety at runtime!*\n\n## Complete Code Snippet\n```ts\ntype RouteConfig = {\n  path: string;\n  component: 'home' | 'courses' | 'lesson';\n  requiresAuth?: boolean;\n};\n\n// 💡 Validates against Record, but keeps exact keys (entry1, entry2)\nconst dataEntries = {\n  entry1: 0.51,\n  entry2: -1.23,\n} satisfies Record<string, number>;\n\n// 💡 Validates against RouteConfig, but remembers the exact literal paths for autocomplete!\nconst routes = [\n  { path: '/', component: 'home' },\n  { path: '/courses', component: 'courses', requiresAuth: true },\n  { path: '/lesson/:id', component: 'lesson', requiresAuth: true },\n] satisfies RouteConfig[];\n\nconsole.log(dataEntries.entry1);\nconsole.log(routes.map(route => route.path));\n\n// ❌ Error: Property 'entry3' does not exist.\n// dataEntries.entry3; \n\n// ❌ Error: Fails the RouteConfig validation (missing required component/invalid path etc).\n// routes.push({ path: '/bad', component: 'missing' });\n```",
    "questions": [
      {
        "type": "mcq",
        "question": "What critical information does the `satisfies` operator preserve that a standard broad type annotation (like `: Record<string, number>`) destroys?",
        "options": [
          "It preserves the value's highly specific inferred keys and literal properties, rather than wiping them out with a generic structural type.",
          "It preserves runtime encryption data.",
          "It preserves private class fields across modules.",
          "It preserves compiled interface interfaces."
        ],
        "correct": 0,
        "explanation": "A broad annotation \"widens\" your object, making TypeScript forget your specific keys. `satisfies` validates the shape but lets you keep your precise keys for autocompletion and safety."
      },
      {
        "type": "mcq",
        "question": "Does the `satisfies` operator transform or validate your data at runtime when running in the browser?",
        "options": [
          "No, it is purely a compile-time compatibility check executed by TypeScript.",
          "Yes, it actively parses and strips invalid fields from every object.",
          "It only performs runtime validation in Node.js environments.",
          "It only validates variables declared as arrays."
        ],
        "correct": 0,
        "explanation": "Like all TypeScript type syntax, `satisfies` is completely erased during compilation. It provides strict developer safety but performs zero validation at runtime."
      }
    ]
  }
];

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log("Section 7 patched successfully!");
