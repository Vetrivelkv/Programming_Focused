import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const curriculumPath = path.join(root, "backend", "data", "typescript_curriculum.json");
const questionsPath = path.join(root, "backend", "data", "typescript_questions.json");

const names = {
  generics: "Section 8 · Generic Types",
  list: "Section 9 · Classes & Generics Demo Project",
  derived: "Section 10 · Deriving Types From Types",
  decorators: "Section 11 · ECMAScript Decorators",
};

const clean = value => value.replaceAll("§", "`");
const q = (question, options, correct, explanation) => ({ type: "mcq", question, options, correct, explanation });
const lesson = (folder, index, slug, title, body, complete, questions) => ({
  id: `${folder}_${String(index).padStart(2, "0")}`,
  title,
  image: `/assets/typescript/${folder}/${String(index).padStart(2, "0")}-${slug}.png`,
  content: clean(`${body}\n\n## Complete subclass code — §${folder.replace("ts_", "")}.ts§\n\n§§§ts\n${complete}\n§§§`),
  questions,
});

const sections = [
  {
    name: names.generics,
    subtopics: [
      lesson("ts_generics", 1, "generic-mental-model", "Recognize Generic Types", String.raw`# Recognize Generic Types

A generic type combines a reusable outer type with another type supplied at the point of use. §Array<string>§ and §string[]§ describe the same array, but the angle-bracket form makes the relationship explicit: §Array§ is generic and §string§ is its element type.

§§§ts
const names: Array<string> = ['Max', 'Anna'];
const scores: Array<number> = [10, 8];
§§§

The placeholder is flexible while defining a type and concrete when using it. That lets one definition preserve precise information instead of falling back to §any§.`, String.raw`const names: Array<string> = ['Max', 'Anna'];
const scores: number[] = [10, 8];

function first<T>(values: Array<T>): T | undefined {
  return values[0];
}

console.log(first(names));
console.log(first(scores));`, [
        q("What does string supply in Array<string>?", ["The array element type", "The array length", "A runtime constructor", "A property name"], 0, "The generic Array type receives string as its concrete element type."),
        q("Why prefer a generic over any?", ["It preserves relationships between input and output types", "It disables errors", "It adds runtime validation", "It only supports strings"], 0, "A generic keeps concrete type information available to the checker."),
      ]),
      lesson("ts_generics", 2, "generic-alias", "Build a Generic Data Store", String.raw`# Build a Generic Data Store

Place a type parameter after the alias name, then reuse it wherever the caller's chosen type belongs.

§§§ts
type DataStore<T> = { [property: string]: T };

const flags: DataStore<string | boolean> = {
  name: 'Max',
  isInstructor: true,
};
§§§

§T§ is a convention, not a keyword. A descriptive name is often clearer in domain code. Each use of §DataStore<...>§ creates a concrete contract, so a string-only store rejects booleans.`, String.raw`type DataStore<Value> = {
  [property: string]: Value;
};

const profile: DataStore<string | boolean> = {
  name: 'Max',
  isInstructor: true,
};

const labels: DataStore<string> = {
  primary: 'TypeScript',
  secondary: 'Generics',
};

console.log(profile, labels);`, [
        q("Where is Value chosen for DataStore<Value>?", ["When DataStore is used", "At JavaScript runtime", "Inside JSON", "By the browser"], 0, "The use site supplies the concrete type argument."),
        q("Can DataStore<string> store true?", ["No", "Yes", "Only in an array", "Only when readonly"], 0, "Every property value must satisfy the chosen string type."),
      ]),
      lesson("ts_generics", 3, "functions-inference", "Create Generic Functions & Use Inference", String.raw`# Create Generic Functions & Use Inference

A generic function can reuse the type learned from its arguments in its return type. §merge<T>(a: T, b: T)§ keeps both inputs tied to one type; §merge<T, U>§ allows them to differ.

§§§ts
function merge<T, U>(a: T, b: U) {
  return [a, b];
}

const result = merge(1, 'two'); // (string | number)[]
§§§

Explicit arguments such as §merge<number, string>(...)§ are valid, but inference is usually shorter and equally precise.`, String.raw`function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const inferred = pair(1, 'two');
const explicit = pair<number, boolean>(2, true);

console.log(inferred[0].toFixed());
console.log(inferred[1].toUpperCase());
console.log(explicit);`, [
        q("Why use two parameters T and U?", ["The two arguments may have different types", "To run twice", "To create two classes", "To avoid inference"], 0, "Independent placeholders preserve each argument's type."),
        q("Must callers always write generic arguments?", ["No, TypeScript often infers them", "Yes", "Only for strings", "Only in classes"], 0, "Argument values usually provide enough information for inference."),
      ]),
      lesson("ts_generics", 4, "constraints", "Constrain Generic Object Operations", String.raw`# Constrain Generic Object Operations

Object spread on primitives is meaningless for this helper, so constrain the placeholders with §extends object§. Two placeholders preserve both distinct shapes and produce an intersection result.

§§§ts
function mergeObjects<T extends object, U extends object>(a: T, b: U) {
  return { ...a, ...b };
}
§§§

A constraint limits what may be substituted; it does not replace the concrete inferred type. The result still knows every member from both inputs.`, String.raw`function mergeObjects<T extends object, U extends object>(
  first: T,
  second: U,
): T & U {
  return { ...first, ...second };
}

const course = mergeObjects(
  { title: 'TypeScript' },
  { lessons: 10, published: true },
);

console.log(course.title, course.lessons, course.published);
// mergeObjects(1, 2); // Error: numbers do not satisfy object.`, [
        q("What does T extends object enforce?", ["T must be an object type", "T becomes the global object", "T is runtime-checked", "T must be an array"], 0, "The constraint rejects primitive substitutions at compile time."),
        q("Why use T and U instead of one T?", ["To retain two distinct input shapes", "To disable spread", "To make both inputs identical", "To create a union"], 0, "Independent parameters let the result contain the exact members of both objects."),
      ]),
      lesson("ts_generics", 5, "classes-interfaces", "Apply Generics to Classes & Interfaces", String.raw`# Apply Generics to Classes & Interfaces

Classes and interfaces use the same placeholder pattern. The concrete type can be inferred by the constructor or supplied explicitly.

§§§ts
class User<Id> {
  constructor(public id: Id) {}
}

interface Repository<Entity> {
  save(value: Entity): void;
}
§§§

Generics are most useful when two or more positions must agree: constructor input and field, repository input and output, or collection element and lookup result.`, String.raw`interface Repository<Entity> {
  save(value: Entity): void;
  findAll(): Entity[];
}

class MemoryRepository<Entity> implements Repository<Entity> {
  private items: Entity[] = [];
  save(value: Entity): void { this.items.push(value); }
  findAll(): Entity[] { return [...this.items]; }
}

type User = { id: number; name: string };
const users = new MemoryRepository<User>();
users.save({ id: 1, name: 'Max' });
console.log(users.findAll());`, [
        q("What relationship does Repository<Entity> preserve?", ["save inputs and returned items use the same entity type", "Every entity is any", "Only IDs are stored", "The interface exists at runtime"], 0, "The shared parameter connects all entity-bearing members."),
        q("Can one generic class be used with numbers and strings?", ["Yes, in separate concrete instances", "No", "Only after casting to any", "Only in JavaScript"], 0, "Each use may choose its own valid concrete type."),
      ]),
    ],
  },
  {
    name: names.list,
    subtopics: [
      lesson("ts_linked_list", 1, "nodes-and-links", "Model a Linked List with Nodes", String.raw`# Model a Linked List with Nodes

A linked list is a chain. Every node stores a value and an optional link to the next node. The list owns a private root and an explicit length because discovering the length by traversal would be repeated work.

§§§ts
class ListNode<T> {
  next?: ListNode<T>;
  constructor(public value: T) {}
}
§§§

The empty list has no root. Private fields keep callers from breaking the chain directly.`, String.raw`class ListNode<T> {
  next?: ListNode<T>;
  constructor(public value: T) {}
}

class LinkedList<T> {
  private root?: ListNode<T>;
  private length = 0;

  getNumberOfElements(): number { return this.length; }
}

const numbers = new LinkedList<number>();
console.log(numbers.getNumberOfElements());`, [
        q("Why is next optional?", ["The final node has no successor", "Every node is empty", "It is private", "Generics require it"], 0, "The tail's next link is undefined."),
        q("Why store length?", ["To avoid traversing the whole chain for every count", "To type the node", "To make fields public", "To sort automatically"], 0, "Maintaining a count makes length lookup constant-time."),
      ]),
      lesson("ts_linked_list", 2, "generic-chain", "Thread One Generic Type Through the Chain", String.raw`# Thread One Generic Type Through the Chain

§LinkedList<T>§ accepts values of §T§, constructs §ListNode<T>§ objects, and stores §ListNode<T>§ references. That thread prevents a number list from accidentally linking a string node.

§§§ts
class LinkedList<T> {
  private root?: ListNode<T>;
  add(value: T) {
    const node = new ListNode(value);
  }
}
§§§

Inference can determine the node's type from §value§ even though the list itself remains generic until instantiated.`, String.raw`class ListNode<T> {
  next?: ListNode<T>;
  constructor(public value: T) {}
}

class LinkedList<T> {
  private root?: ListNode<T>;
  add(value: T): void {
    const node = new ListNode(value);
    if (!this.root) this.root = node;
  }
}

const numberList = new LinkedList<number>();
numberList.add(10);
const nameList = new LinkedList<string>();
nameList.add('Max');`, [
        q("What prevents adding a string to LinkedList<number>?", ["The shared T contract", "The private keyword alone", "The while loop", "Node.js"], 0, "T flows through the list, add parameter, and node."),
        q("Why can new ListNode(value) omit <T>?", ["The constructor argument enables inference", "It becomes any", "Nodes are not generic", "Type arguments are invalid there"], 0, "TypeScript infers the node's concrete value type from value."),
      ]),
      lesson("ts_linked_list", 3, "tail-insertion", "Append Efficiently with a Tail Pointer", String.raw`# Append Efficiently with a Tail Pointer

Traversing from root for every append is avoidable. Keep both ends: the first insertion sets root and tail; later insertions link the old tail to the new node and then advance tail.

§§§ts
if (!this.root || !this.tail) {
  this.root = node;
  this.tail = node;
} else {
  this.tail.next = node;
  this.tail = node;
}
this.length++;
§§§

The invariant is simple: root and tail are either both absent or both present.`, String.raw`class ListNode<T> {
  next?: ListNode<T>;
  constructor(public value: T) {}
}

class LinkedList<T> {
  private root?: ListNode<T>;
  private tail?: ListNode<T>;
  private length = 0;

  add(value: T): void {
    const node = new ListNode(value);
    if (!this.root || !this.tail) {
      this.root = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.length++;
  }
}

const list = new LinkedList<number>();
list.add(10);
list.add(5);`, [
        q("What must happen before tail becomes the new node?", ["The old tail.next must point to it", "Root must be deleted", "Length must reset", "The node must become any"], 0, "Link first, then move the tail reference."),
        q("What is the empty-list invariant?", ["Both root and tail are absent", "Only tail exists", "Length is undefined", "Every node points to itself"], 0, "Both endpoint references describe the same empty/non-empty state."),
      ]),
      lesson("ts_linked_list", 4, "inspect-and-run", "Traverse, Inspect & Run the List", String.raw`# Traverse, Inspect & Run the List

Expose behavior instead of public mutable links. A count method returns the private length. A print or iterator-style method starts at root, consumes the current value, and advances to §current.next§ until it becomes undefined.

§§§ts
let current = this.root;
while (current) {
  console.log(current.value);
  current = current.next;
}
§§§

After compilation, TypeScript annotations and generic parameters disappear; the JavaScript class and traversal remain.`, String.raw`class ListNode<T> {
  next?: ListNode<T>;
  constructor(public value: T) {}
}

class LinkedList<T> {
  private root?: ListNode<T>;
  private tail?: ListNode<T>;
  private length = 0;

  add(value: T): void {
    const node = new ListNode(value);
    if (!this.root || !this.tail) this.root = this.tail = node;
    else { this.tail.next = node; this.tail = node; }
    this.length++;
  }

  getNumberOfElements(): number { return this.length; }
  toArray(): T[] {
    const values: T[] = [];
    let current = this.root;
    while (current) { values.push(current.value); current = current.next; }
    return values;
  }
}

const list = new LinkedList<number>();
[10, 5, -3].forEach(value => list.add(value));
console.log(list.getNumberOfElements(), list.toArray());`, [
        q("When does traversal stop?", ["When current becomes undefined", "When length is private", "After one node", "When T changes"], 0, "The last node's optional next link ends the chain."),
        q("What remains after compiling generics?", ["Runtime classes and logic, not type parameters", "Generic metadata objects", "Interfaces", "Only comments"], 0, "Type annotations are erased while JavaScript behavior remains."),
      ]),
      lesson("ts_linked_list", 5, "insert-delete", "Insert & Delete without Breaking Links", String.raw`# Insert & Delete without Breaking Links

Position-based operations traverse to the affected node and rewire neighboring §next§ references. Insertion makes the previous node point at the new node and the new node at the former successor. Deletion skips the removed node.

Always update edge state: inserting/deleting position zero changes root; changing the final node changes tail; every successful mutation changes length. Invalid positions should return a clear failure without mutating the list.`, String.raw`class ListNode<T> {
  next?: ListNode<T>;
  constructor(public value: T) {}
}

class LinkedList<T> {
  private root?: ListNode<T>;
  private tail?: ListNode<T>;
  private length = 0;

  add(value: T): void { this.insertAt(value, this.length); }

  insertAt(value: T, position: number): boolean {
    if (position < 0 || position > this.length) return false;
    const node = new ListNode(value);
    if (position === 0) {
      node.next = this.root;
      this.root = node;
      if (!this.tail) this.tail = node;
    } else {
      let previous = this.root!;
      for (let index = 1; index < position; index++) previous = previous.next!;
      node.next = previous.next;
      previous.next = node;
      if (position === this.length) this.tail = node;
    }
    this.length++;
    return true;
  }

  deleteAt(position: number): T | undefined {
    if (position < 0 || position >= this.length || !this.root) return undefined;
    let removed: ListNode<T>;
    if (position === 0) { removed = this.root; this.root = this.root.next; }
    else {
      let previous = this.root;
      for (let index = 1; index < position; index++) previous = previous.next!;
      removed = previous.next!;
      previous.next = removed.next;
      if (position === this.length - 1) this.tail = previous;
    }
    this.length--;
    if (this.length === 0) this.tail = undefined;
    return removed.value;
  }

  toArray(): T[] {
    const values: T[] = [];
    let current = this.root;
    while (current) { values.push(current.value); current = current.next; }
    return values;
  }
}

const list = new LinkedList<string>();
list.add('A');
list.add('C');
list.insertAt('B', 1);
console.log(list.toArray(), list.deleteAt(1), list.toArray());`, [
        q("How is a middle node deleted?", ["The previous node points to the removed node's successor", "The root is always cleared", "All nodes are rebuilt", "The generic type changes"], 0, "Skipping one link removes that node from the reachable chain."),
        q("Which state may change at list edges?", ["root or tail as well as length", "Only the generic", "The class name", "No state"], 0, "Endpoint mutations must preserve root/tail invariants."),
      ]),
    ],
  },
  {
    name: names.derived,
    subtopics: [
      lesson("ts_derived", 1, "typeof", "Derive Types from Values with typeof", String.raw`# Derive Types from Values with typeof

JavaScript's runtime §typeof value§ returns a string. In a TypeScript type position, §typeof value§ instead captures the static type of an existing value.

§§§ts
const settings = { difficulty: 'easy', minLevel: 10, didStart: false };
type Settings = typeof settings;
function loadData(input: typeof settings) {}
§§§

A §const§ primitive produces a literal type while a reassignable §let§ usually widens. Function types can also be reused: §type SumFn = typeof sum§.`, String.raw`const settings = {
  difficulty: 'easy',
  minLevel: 10,
  didStart: false,
  players: ['John', 'Jane'],
};

type Settings = typeof settings;

function loadData(input: Settings): void {
  console.log(input.difficulty, input.players.length);
}

function sum(a: number, b: number): number { return a + b; }
type SumFn = typeof sum;
const performMathAction = (callback: SumFn) => callback(10, 5);

loadData(settings);
console.log(performMathAction(sum));`, [
        q("What does typeof settings mean in a type position?", ["The static shape of settings", "The runtime string 'object'", "A JSON copy", "Any"], 0, "TypeScript's type query derives a type from the declared value."),
        q("What can typeof sum preserve?", ["Its full function signature", "Only its name", "Its source code text", "Its latest result"], 0, "A function value has a callable static type that can be reused."),
      ]),
      lesson("ts_derived", 2, "keyof", "Extract Valid Keys with keyof", String.raw`# Extract Valid Keys with keyof

§keyof§ works on a type and produces a union of its property keys. Combine it with generics to reject misspelled or unrelated keys.

§§§ts
function getProp<T extends object, K extends keyof T>(object: T, key: K) {
  return object[key];
}
§§§

Unlike §typeof§, §keyof§ is TypeScript-only. The constraint links the second argument to the exact shape inferred for the first.`, String.raw`type User = { name: string; age: number };
type UserKey = keyof User; // 'name' | 'age'

function getProp<T extends object, K extends keyof T>(object: T, key: K): T[K] {
  const value = object[key];
  if (value === undefined || value === null) {
    throw new Error('Accessing undefined or null value.');
  }
  return value;
}

const user: User = { name: 'Max', age: 36 };
console.log(getProp(user, 'name').toUpperCase());
console.log(getProp(user, 'age').toFixed());`, [
        q("What is keyof User for name and age?", ["'name' | 'age'", "string", "User[]", "never"], 0, "Keyof collects the declared property names as literal types."),
        q("Why constrain K extends keyof T?", ["Only valid keys of the supplied object are accepted", "K becomes a value", "T becomes any", "It adds runtime properties"], 0, "The constraint connects the key argument to the object shape."),
      ]),
      lesson("ts_derived", 3, "indexed-access", "Look Inside Types with Indexed Access", String.raw`# Look Inside Types with Indexed Access

Use bracket notation on types to extract a property's value type. Use §[number]§ on an array type to extract one element type.

§§§ts
type Permissions = AppUser['permissions'];
type Permission = Permissions[number];
§§§

These are type-level operations only; a file containing only aliases compiles to essentially empty JavaScript.`, String.raw`type AppUser = {
  name: string;
  permissions: Array<{
    id: string;
    title: string;
    description: string;
  }>;
};

type Permissions = AppUser['permissions'];
type Permission = Permissions[number];
type PermissionTitle = Permission['title'];

const permission: Permission = {
  id: 'courses:write',
  title: 'Edit courses',
  description: 'May update curriculum content',
};

console.log(permission.title satisfies PermissionTitle);`, [
        q("What does Permissions[number] produce?", ["The type of one array element", "The array length", "Only index zero", "A runtime lookup"], 0, "Number represents the possible numeric indexes of the array type."),
        q("Does AppUser['permissions'] run property access?", ["No, it is a type-level lookup", "Yes", "Only in Node", "Only with decorators"], 0, "Indexed access types are erased during compilation."),
      ]),
      lesson("ts_derived", 4, "mapped-types", "Transform Object Shapes with Mapped Types", String.raw`# Transform Object Shapes with Mapped Types

A mapped type iterates over §keyof T§ and emits a property for every key.

§§§ts
type Results<T> = { [Key in keyof T]: number };
§§§

Property modifiers are preserved by default. Add §?§ or §readonly§, or remove inherited modifiers with §-?§ and §-readonly§. This is the machinery behind utilities such as §Partial§ and §Required§.`, String.raw`type Operations = {
  readonly add?: (a: number, b: number) => number;
  readonly subtract?: (a: number, b: number) => number;
};

type RequiredMutableResults<T> = {
  -readonly [Key in keyof T]-?: number;
};

const results: RequiredMutableResults<Operations> = {
  add: 3,
  subtract: 2,
};

results.add = 10;
console.log(results);`, [
        q("What does Key in keyof T do?", ["Iterates over every key in T", "Runs a for loop", "Selects one random key", "Creates an array"], 0, "Mapped types project each key into a new object type."),
        q("What does -? do in a mapped type?", ["Removes optionality", "Adds optionality", "Deletes the property", "Makes it private"], 0, "The minus modifier removes the optional flag inherited from the source."),
      ]),
      lesson("ts_derived", 5, "template-literals", "Generate String Contracts with Template Literals", String.raw`# Generate String Contracts with Template Literals

Template-literal types combine literal unions. Injecting two unions creates every valid combination.

§§§ts
type FilePermission = §\${ReadPermission}-\${WritePermission}§;
type DataFileEventName = §\${keyof DataFile}Changed§;
§§§

The generated event-name union can drive a mapped type, ensuring the handler object stays synchronized with the source keys.`, String.raw`type ReadPermission = 'no-read' | 'read';
type WritePermission = 'no-write' | 'write';
type FilePermission = §\${ReadPermission}-\${WritePermission}§;

type DataFile = {
  data: string;
  permissions: FilePermission;
};

type DataFileEventName = §\${keyof DataFile}Changed§;
type DataFileEvents = {
  [Key in DataFileEventName]: () => void;
};

const handlers: DataFileEvents = {
  dataChanged: () => console.log('Data changed'),
  permissionsChanged: () => console.log('Permissions changed'),
};

handlers.permissionsChanged();`, [
        q("What happens when two literal unions are interpolated?", ["All valid combinations are generated", "They become any", "Only the first values remain", "A runtime loop runs"], 0, "Template-literal types form the Cartesian combinations of their literal inputs."),
        q("Why derive event names from keyof DataFile?", ["Handlers stay aligned with source properties", "To mutate DataFile", "To emit events automatically", "To create numbers"], 0, "Changing the source keys updates the expected event-name union."),
      ]),
      lesson("ts_derived", 6, "conditional-types", "Branch on Types with Conditional Types", String.raw`# Branch on Types with Conditional Types

Conditional types use §T extends Pattern ? TrueType : FalseType§. They choose a result type, not a runtime value.

§§§ts
type GetElementType<T> = T extends any[] ? T[number] : never;
§§§

Use §never§ when the unsupported branch should not produce a usable value. A function can also expose a conditional return contract, though its runtime checks must still uphold that promise.`, String.raw`type GetElementType<T> = T extends readonly unknown[] ? T[number] : never;

type FullNameOrNothing<T> = T extends {
  firstName: string;
  lastName: string;
} ? string : never;

function getFullName<T extends object>(person: T): FullNameOrNothing<T> {
  if (
    'firstName' in person && 'lastName' in person &&
    person.firstName && person.lastName
  ) {
    return §\${person.firstName} \${person.lastName}§ as FullNameOrNothing<T>;
  }
  throw new Error('No first name and/or last name found.');
}

type Tag = GetElementType<readonly ['new', 'done']>;
const name = getFullName({ firstName: 'Max', lastName: 'Schwarz' });
console.log(name, null as unknown as Tag);`, [
        q("When does GetElementType<T> yield never?", ["When T is not an array type", "When T is a string array", "Always", "At runtime only"], 0, "Its false branch is never."),
        q("Are conditional types runtime if statements?", ["No, they select static types", "Yes", "Only in browsers", "Only for classes"], 0, "They exist in TypeScript's type system and are erased."),
      ]),
      lesson("ts_derived", 7, "infer", "Capture Type Parts with infer", String.raw`# Capture Type Parts with infer

Inside a conditional type's pattern, §infer§ names a part of the matched type so the true branch can reuse it.

§§§ts
type ReturnValue<T> =
  T extends (...args: any[]) => infer Result ? Result : never;
§§§

The placeholder is inferred from the return slot rather than passed by the caller. This same combination of conditional types, mapped types, and inference powers many built-in utilities.`, String.raw`function add(a: number, b: number) {
  return a + b;
}

function createCourse() {
  return { title: 'TypeScript', lessons: 11 };
}

type ReturnValue<T> =
  T extends (...args: any[]) => infer Result ? Result : never;

type AddResult = ReturnValue<typeof add>;
type CourseResult = ReturnValue<typeof createCourse>;

const total: AddResult = add(2, 3);
const course: CourseResult = createCourse();
console.log(total, course.title);`, [
        q("Where may infer be introduced?", ["Inside a conditional type pattern", "In any variable declaration", "Only in classes", "Only at runtime"], 0, "Infer captures a matched subtype in the extends pattern."),
        q("What does ReturnValue<typeof add> produce?", ["number", "the add function", "any[]", "never"], 0, "The inferred return slot of add is number."),
      ]),
      lesson("ts_derived", 8, "utility-types", "Use Built-in Utility Types First", String.raw`# Use Built-in Utility Types First

TypeScript already ships utility types built from the techniques in this section. §ReturnType<F>§ extracts a function result, §Partial<T>§ makes properties optional, §Required<T>§ removes optionality, §Readonly<T>§ protects assignments, and §Pick§/§Omit§ select keys.

Understand the mechanisms so you can build domain-specific helpers, but check the standard utilities before reinventing a common transform.`, String.raw`type Course = {
  id: string;
  title: string;
  published: boolean;
};

function createCourse(): Course {
  return { id: 'ts', title: 'TypeScript', published: false };
}

type CreatedCourse = ReturnType<typeof createCourse>;
type CoursePatch = Partial<Pick<Course, 'title' | 'published'>>;
type PublicCourse = Readonly<Omit<Course, 'published'>>;

const patch: CoursePatch = { published: true };
const publicCourse: PublicCourse = { id: 'ts', title: 'TypeScript' };
const created: CreatedCourse = createCourse();

console.log(created, patch, publicCourse);`, [
        q("Which utility extracts a function's return type?", ["ReturnType", "Partial", "Readonly", "Omit"], 0, "ReturnType uses conditional inference internally."),
        q("What does Partial<T> do?", ["Makes every property optional", "Deletes T", "Runs validation", "Makes T a class"], 0, "Partial is a mapped utility that adds optional modifiers."),
      ]),
    ],
  },
  {
    name: names.decorators,
    subtopics: [
      lesson("ts_decorators", 1, "ecmascript-foundation", "Understand ECMAScript Decorators", String.raw`# Understand ECMAScript Decorators

Decorators are functions attached with §@name§ that can observe, replace, or initialize class-related code. They apply to classes, methods, fields, getters, and setters—not standalone functions or variables.

TypeScript supports current ECMAScript decorators and an older experimental system. This section uses the standard ECMAScript form: do not enable §experimentalDecorators§ for these signatures. TypeScript can downlevel the syntax for older runtimes.`, String.raw`function logger(
  target: Function,
  context: ClassDecoratorContext,
): void {
  console.log('Decorating', context.kind, context.name);
  console.log(target);
}

@logger
class Person {
  name = 'Max';
}

console.log(new Person());`, [
        q("Where can ECMAScript decorators be attached?", ["Class-related declarations", "Any standalone variable", "JSON keys", "CSS selectors"], 0, "Decorators are an object-oriented, class-focused feature."),
        q("Should this section enable experimentalDecorators?", ["No, it uses the modern ECMAScript form", "Yes, always", "Only for fields", "Only in Node"], 0, "The older flag selects the legacy decorator API."),
      ]),
      lesson("ts_decorators", 2, "class-context", "Build a Class Decorator", String.raw`# Build a Class Decorator

A class decorator receives the class constructor as its target and a §ClassDecoratorContext§ describing the decorated declaration. The context exposes §kind§, §name§, metadata, and §addInitializer§.

Decorator code runs when the class definition is evaluated—even if the class is never instantiated. That timing is different from constructor or instance initializer work.`, String.raw`function inspectClass<T extends abstract new (...args: any[]) => object>(
  target: T,
  context: ClassDecoratorContext,
): void {
  console.log({
    kind: context.kind,
    name: context.name,
    constructor: target,
  });
}

@inspectClass
class Course {
  constructor(public title: string) {}
}

const course = new Course('Understanding TypeScript');
console.log(course.title);`, [
        q("What is the target of a class decorator?", ["The class constructor", "A class instance", "The source file", "The first field"], 0, "The class itself is the decorated value."),
        q("When does the decorator body run?", ["When the class definition is evaluated", "On every method call", "Only after new", "During JSON parsing"], 0, "Definition-time decoration happens before instance creation."),
      ]),
      lesson("ts_decorators", 3, "replace-class", "Replace or Extend a Decorated Class", String.raw`# Replace or Extend a Decorated Class

A class decorator may return a replacement constructor. Constrain the target as constructable, extend it, forward every constructor argument through §super(...args)§, and add behavior.

§§§ts
return class extends target {
  age = 35;
  constructor(...args: any[]) {
    super(...args);
  }
};
§§§

The decorator body runs once at definition time; the returned constructor runs once per instance.`, String.raw`type Constructor = new (...args: any[]) => object;

function withCreationLog<T extends Constructor>(
  target: T,
  context: ClassDecoratorContext,
) {
  console.log('Decorating ' + String(context.name));
  return class extends target {
    createdAt = new Date();
    constructor(...args: any[]) {
      super(...args);
      console.log('Created', this);
    }
  };
}

@withCreationLog
class Person {
  constructor(public name: string) {}
}

new Person('Max');
new Person('Anna');`, [
        q("Why call super(...args) in the replacement?", ["To initialize the original class state", "To run the decorator twice", "To remove the base class", "To infer fields"], 0, "The subclass must forward construction to the original constructor."),
        q("Which log runs once per new instance?", ["The returned subclass constructor log", "The outer decorator log", "The context name", "None"], 0, "The replacement constructor participates in every instantiation."),
      ]),
      lesson("ts_decorators", 4, "method-context", "Decorate Methods & Preserve this", String.raw`# Decorate Methods & Preserve this

A method decorator receives the original function plus §ClassMethodDecoratorContext§. A replacement function wraps the method, but must forward the receiver, arguments, and return value.

§§§ts
return function (this: This, ...args: Args): Result {
  return target.apply(this, args);
};
§§§

Calling §target()§ directly loses the instance receiver. §apply(this, args)§ preserves JavaScript's method semantics.`, String.raw`function traced<This, Args extends unknown[], Result>(
  target: (this: This, ...args: Args) => Result,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Result>,
) {
  return function (this: This, ...args: Args): Result {
    console.log('Calling ' + String(context.name), args);
    const result = target.apply(this, args);
    console.log('Completed ' + String(context.name), result);
    return result;
  };
}

class Calculator {
  constructor(private factor: number) {}
  @traced
  multiply(value: number): number { return value * this.factor; }
}

console.log(new Calculator(3).multiply(4));`, [
        q("Why use target.apply(this, args)?", ["To preserve the instance receiver and arguments", "To make the method static", "To call the decorator", "To erase the return type"], 0, "Apply invokes the original method with the wrapper's receiver."),
        q("What may a method decorator return?", ["A replacement method", "Only a class", "Only metadata", "A CSS rule"], 0, "Returning a compatible function replaces the original method."),
      ]),
      lesson("ts_decorators", 5, "autobind", "Autobind Detached Methods with addInitializer", String.raw`# Autobind Detached Methods with addInitializer

§const greet = person.greet; greet()§ loses its receiver because the function is no longer called through §person§. A method decorator can register per-instance setup with §context.addInitializer§ and bind the named method after the instance is created.

Use a normal function for the initializer so JavaScript supplies the new instance as §this§. An arrow function would capture the decorator's surrounding §this§ instead.`, String.raw`function autobind<This, Args extends unknown[], Result>(
  _target: (this: This, ...args: Args) => Result,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Result>,
): void {
  context.addInitializer(function (this: This) {
    const instance = this as Record<PropertyKey, unknown>;
    const method = instance[context.name] as Function;
    instance[context.name] = method.bind(this);
  });
}

class Person {
  constructor(public name: string) {}
  @autobind
  greet(): string { return 'Hi, I am ' + this.name; }
}

const max = new Person('Max');
const detachedGreet = max.greet;
console.log(detachedGreet());`, [
        q("What problem does autobind solve?", ["Detached methods losing their instance receiver", "Missing type aliases", "Slow compilation", "Array indexing"], 0, "Binding fixes this even when the method reference is passed elsewhere."),
        q("Why is the initializer a normal function?", ["It receives the new instance as this", "Arrow functions cannot return", "Decorators ban arrows", "It runs at compile time"], 0, "A normal function gets the intended dynamic receiver."),
      ]),
      lesson("ts_decorators", 6, "field-decorator", "Transform Field Initial Values", String.raw`# Transform Field Initial Values

A field decorator's target is §undefined§ because the field value does not exist when the class definition is decorated. Its §ClassFieldDecoratorContext§ contains the field name, visibility/static flags, access helpers, and §addInitializer§.

Return an initializer function to receive and replace each instance's initial value. The function runs during instance initialization, unlike the outer decorator body.`, String.raw`function trimField(
  _target: undefined,
  context: ClassFieldDecoratorContext<object, string>,
) {
  return function (this: object, initialValue: string): string {
    console.log('Initializing ' + String(context.name));
    return initialValue.trim();
  };
}

class Course {
  @trimField
  title = '  Understanding TypeScript  ';
}

const course = new Course();
console.log(course.title);`, [
        q("Why is a field decorator target undefined?", ["The value is not initialized at decoration time", "Fields are invalid", "The class is private", "TypeScript erased it early"], 0, "Definition-time decoration precedes per-instance field initialization."),
        q("What must the returned field initializer produce?", ["The value to store in the field", "A class constructor", "A method context", "A key union"], 0, "Its return value replaces the original initial field value."),
      ]),
      lesson("ts_decorators", 7, "factories", "Configure Decorators with Factories", String.raw`# Configure Decorators with Factories

A decorator factory is an ordinary function that accepts configuration and returns the actual decorator. That is why usage includes a call: §@replaceWith('')§.

The outer factory runs to create a configured decorator; JavaScript then invokes the returned decorator with target and context. Factories work for class, method, field, getter, and setter decorators.`, String.raw`function replaceWith<Value>(replacement: Value) {
  return function (
    _target: undefined,
    context: ClassFieldDecoratorContext<object, Value>,
  ) {
    return function (_initialValue: Value): Value {
      console.log('Replacing ' + String(context.name));
      return replacement;
    };
  };
}

class Person {
  @replaceWith('Anonymous')
  name = 'Max';

  @replaceWith(18)
  age = 35;
}

const person = new Person();
console.log(person.name, person.age);`, [
        q("What does a decorator factory return?", ["The actual decorator function", "A compiled file", "Only metadata", "A class instance"], 0, "The wrapper captures configuration and returns the signature JavaScript will invoke."),
        q("Why write @replaceWith('Anonymous') with parentheses?", ["To execute the factory and obtain a configured decorator", "To call the field", "To enable experimental decorators", "To instantiate the class"], 0, "The call produces the decorator that is attached to the field."),
      ]),
    ],
  },
];

const curriculum = JSON.parse(fs.readFileSync(curriculumPath, "utf8"));
const replaced = new Set(Object.values(names));
curriculum.topics = curriculum.topics.filter(topic => !replaced.has(topic.name));
curriculum.topics.push(...sections);
fs.writeFileSync(curriculumPath, `${JSON.stringify(curriculum, null, 2)}\n`);

const challengeData = [
  [names.generics, "Generic Types Mastery Challenge", [
    ["What does Array<string> describe?", ["An array whose elements are strings", "A string constructor", "Any array", "A tuple of one item"], 0],
    ["What is T in a generic definition?", ["A type placeholder", "A runtime variable", "A decorator", "A key name"], 0],
    ["Why use merge<T, U>?", ["To retain two possibly different input types", "To force equal values", "To make an array readonly", "To disable inference"], 0],
    ["What does extends object do in a generic?", ["Constrains allowed type arguments", "Creates inheritance at runtime", "Returns an object", "Adds properties"], 0],
    ["Does a generic constraint erase inference?", ["No", "Yes", "Only for classes", "Only for arrays"], 0],
    ["Can TypeScript infer new ListNode(value)'s type?", ["Yes, from value", "No", "Only from a cast", "Only at runtime"], 0],
    ["What links save and findAll in Repository<T>?", ["The shared T", "A global variable", "JSON", "The interface name"], 0],
    ["What does DataStore<boolean> reject?", ["String values", "Boolean values", "String keys", "Empty objects"], 0],
    ["When are explicit type arguments useful?", ["When inference lacks or needs overriding information", "On every call", "Never", "Only in JavaScript"], 0],
    ["Are generic parameters emitted to JavaScript?", ["No", "Yes", "Only T", "Only constraints"], 0],
  ]],
  [names.list, "Generic Linked List Challenge", [
    ["What does a node store besides its value?", ["An optional next-node reference", "The whole list", "A database", "A previous array"], 0],
    ["Why is root optional?", ["An empty list has no root", "Roots are always private", "T may be undefined", "Nodes compile away"], 0],
    ["What type flows through LinkedList<T> and ListNode<T>?", ["The stored value type", "The list length", "The method name", "The position"], 0],
    ["What does the first add set?", ["Both root and tail", "Only next", "Only length", "Nothing"], 0],
    ["How is a later node appended?", ["old tail.next = node, then tail = node", "root = undefined", "delete tail", "copy all nodes"], 0],
    ["Why keep tail?", ["To append without traversing from root", "To infer T", "To make root public", "To print values"], 0],
    ["How does traversal advance?", ["current = current.next", "current = root", "length--", "tail = root"], 0],
    ["What must insertion at zero update?", ["root", "only tail.next", "the generic", "the class name"], 0],
    ["What must deletion of the last node update?", ["tail", "the type alias", "all values", "the constructor"], 0],
    ["What should an invalid position do?", ["Fail without mutation", "Corrupt links", "Change T", "Always throw a string"], 0],
  ]],
  [names.derived, "Derived Types Mastery Challenge", [
    ["What does typeof value do in type space?", ["Derives its static type", "Returns a runtime string", "Copies it", "Deletes it"], 0],
    ["What does keyof T produce?", ["A union of T's keys", "T's values", "An array", "A class"], 0],
    ["What does T[K] represent?", ["The value type at key K", "A runtime read", "A tuple length", "A constructor"], 0],
    ["What does ArrayType[number] extract?", ["An element type", "Only the first item", "The length", "A key string"], 0],
    ["What does [K in keyof T] create?", ["A mapped type", "A runtime loop", "A decorator", "A promise"], 0],
    ["What does -readonly do?", ["Removes readonly modifiers", "Adds readonly", "Deletes values", "Makes fields private"], 0],
    ["What can template-literal types combine?", ["String literal unions", "Runtime DOM nodes", "Only numbers", "Classes only"], 0],
    ["What is a conditional type's syntax based on?", ["T extends Pattern ? A : B", "if(T)", "switch(T)", "T && A"], 0],
    ["What does infer capture?", ["A matched part of another type", "A runtime value", "A compiler flag", "A key press"], 0],
    ["Which utility makes properties optional?", ["Partial", "ReturnType", "Readonly", "Omit"], 0],
  ]],
  [names.decorators, "ECMAScript Decorators Challenge", [
    ["What symbol attaches a decorator?", ["@", "#", "$", "&"], 0],
    ["When does a class decorator body run?", ["At class definition evaluation", "Only on new", "On every method call", "At type-check time only"], 0],
    ["What is a class decorator target?", ["The constructor", "An instance", "A field value", "A module"], 0],
    ["What may a class decorator return?", ["A replacement constructor", "Only void", "Only a string", "A context"], 0],
    ["What does ClassMethodDecoratorContext describe?", ["The decorated method", "The whole project", "A field value only", "A JSON object"], 0],
    ["Why use apply in a method wrapper?", ["To preserve this and forward arguments", "To compile decorators", "To make it static", "To infer keys"], 0],
    ["What does addInitializer enable for autobind?", ["Per-instance setup", "A runtime compiler", "Type erasure", "Mapped keys"], 0],
    ["Why is a field decorator target undefined?", ["The field is not initialized at decoration time", "Fields are invalid", "It is private", "The class was removed"], 0],
    ["What does a field decorator's returned function receive?", ["The initial field value", "The class source", "Only metadata", "A key union"], 0],
    ["What is a decorator factory?", ["A function returning a configured decorator", "A class instance", "A compiler option", "A generic array"], 0],
  ]],
];

const questions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
questions.topics = questions.topics.filter(topic => !replaced.has(topic.name));
for (const [name, title, items] of challengeData) {
  questions.topics.push({
    name,
    rounds: [{
      round_number: 1,
      title,
      questions: items.map(([question, options, correct_option_index]) => ({
        type: "mcq",
        question,
        options,
        correct_option_index,
        explanation: `Correct: ${options[correct_option_index]}.`,
      })),
    }],
  });
}
fs.writeFileSync(questionsPath, `${JSON.stringify(questions, null, 2)}\n`);

console.log(`Built ${sections.reduce((total, section) => total + section.subtopics.length, 0)} subclasses and ${challengeData.length * 10} challenge questions for Sections 8–11.`);
