import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const curriculumPath = path.join(root, "backend", "data", "typescript_curriculum.json");
const questionsPath = path.join(root, "backend", "data", "typescript_questions.json");
const section6Name = "Section 6 · Classes & Interfaces";
const section7Name = "Section 7 · Advanced Types";

const clean = value => value.replaceAll("§", "`");
const q = (question, options, correct, explanation) => ({ type: "mcq", question, options, correct, explanation });
const lesson = (prefix, number, slug, title, body, complete, questions) => ({
  id: `${prefix}_${String(number).padStart(2, "0")}`,
  title,
  image: `/assets/typescript/${prefix}/${String(number).padStart(2, "0")}-${slug}.png`,
  content: clean(`${body}\n\n## Complete subclass code — §${prefix === "ts_classes" ? "classes.ts" : "advanced.ts"}§\n\n§§§ts\n${complete}\n§§§`),
  questions,
});

const section6 = [
  lesson("ts_classes", 1, "class-blueprints", "Create Classes, Fields & Instances", String.raw`# Create Classes, Fields & Instances

A class is a reusable blueprint for objects. TypeScript requires instance fields to be declared, so assigning §this.name§ in a constructor before declaring §name§ produces a useful error.

§§§ts
class User {
  name: string;
  age: number;

  constructor(n: string, a: number) {
    this.name = n;
    this.age = a;
  }
}
§§§

Constructor parameter names are local implementation details; they do not have to match the field names. §new User(...)§ allocates a separate instance and runs the constructor for that instance.

§§§ts
const max = new User('Max', 36);
const fred = new User('Fred', 29);
console.log(max, fred);
§§§

When TypeScript compiles the class, type annotations disappear. The emitted JavaScript retains the runtime class and constructor assignments because those are JavaScript behavior, not type metadata.`, String.raw`class User {
  name: string;
  age: number;

  constructor(displayName: string, yearsOld: number) {
    this.name = displayName;
    this.age = yearsOld;
  }

  describe(): string {
    return this.name + ' is ' + this.age + ' years old.';
  }
}

const max = new User('Max', 36);
const fred = new User('Fred', 29);

console.log(max.describe());
console.log(fred.describe());`, [
    q("Why declare name before assigning this.name?", ["It gives every User instance a checked name field", "It creates a database column", "It makes the class abstract", "It hides the field at runtime"], 0, "The class declaration establishes the instance shape that constructor assignments must satisfy."),
    q("What does new User('Max', 36) do?", ["Creates an instance and runs its constructor", "Creates a type alias", "Compiles the whole project", "Merges two interfaces"], 0, "The new operator allocates an object linked to the class and invokes its constructor."),
  ]),

  lesson("ts_classes", 2, "parameter-properties", "Use Parameter Properties & Access Modifiers", String.raw`# Use Parameter Properties & Access Modifiers

TypeScript can combine a constructor parameter and its assignment into one parameter property. Adding an access modifier is what activates the shortcut.

§§§ts
class User {
  constructor(public name: string, private age: number) {}
}
§§§

§public§ members are available through an instance. §private§ members are only available inside the declaring class. A normal field without an explicit modifier is public, but an unmodified constructor parameter is only a parameter—it does not become a field.

§§§ts
class User {
  public hobbies: string[] = [];

  constructor(public name: string, private age: number) {}

  greet() {
    return 'Hi, I am ' + this.age + ' years old.';
  }
}
§§§

TypeScript's modifier checks happen during development. Native JavaScript §#privateField§ syntax is a different runtime feature.`, String.raw`class User {
  public hobbies: string[] = [];

  constructor(public name: string, private age: number) {}

  addHobby(hobby: string): void {
    this.hobbies.push(hobby);
  }

  greet(): string {
    return 'Hi, I am ' + this.name + ' and I am ' + this.age + '.';
  }
}

const user = new User('Max', 36);
user.name = 'Maximilian';
user.addHobby('TypeScript');

console.log(user.greet(), user.hobbies);
// console.log(user.age); // Error: age is private.`, [
    q("What turns a constructor parameter into an instance field?", ["An access modifier such as public or private", "A return statement", "The new keyword", "A static method"], 0, "A modifier on a constructor parameter activates TypeScript's parameter-property shorthand."),
    q("Where may a private age field be read?", ["Inside the declaring class", "From every module", "Only in HTML", "Only in an interface"], 0, "Private members are checked so only their declaring class can access them."),
  ]),

  lesson("ts_classes", 3, "readonly-accessors-static", "Protect State with readonly, Accessors & Static Members", String.raw`# Protect State with readonly, Accessors & Static Members

§readonly§ prevents reassignment of a property binding after initialization. It is shallow: a readonly array property cannot point at another array, but the existing array can still be mutated unless its element type is also readonly.

§§§ts
class User {
  readonly hobbies: string[] = [];
}

const user = new User();
user.hobbies.push('Coding');
// user.hobbies = []; // Error
§§§

Getters expose computed data through property syntax. Setters validate assignments and commonly store values in private backing fields.

§§§ts
get fullName() { return this._firstName + ' ' + this._lastName; }
set firstName(name: string) {
  if (name.trim() === '') throw new Error('Invalid name.');
  this._firstName = name;
}
§§§

Static members belong to the class itself, so call §User.greet()§ rather than §user.greet()§. They are useful for identifiers and utilities that do not depend on instance state.`, String.raw`class User {
  static readonly entityId = 'USER';
  readonly hobbies: string[] = [];
  private _firstName = '';
  private _lastName = '';

  set firstName(name: string) {
    if (name.trim() === '') throw new Error('Invalid first name.');
    this._firstName = name;
  }

  set lastName(name: string) {
    if (name.trim() === '') throw new Error('Invalid last name.');
    this._lastName = name;
  }

  get fullName(): string {
    return this._firstName + ' ' + this._lastName;
  }

  static greet(): string {
    return 'Hello from the User type.';
  }
}

const max = new User();
max.firstName = 'Max';
max.lastName = 'Schwarz';
max.hobbies.push('Coding');

console.log(User.entityId, User.greet());
console.log(max.fullName, max.hobbies);`, [
    q("Why can a readonly hobbies array still accept push()?", ["readonly protects the property binding, not the mutable array contents", "push creates a new class", "Arrays ignore TypeScript", "The member is static"], 0, "Readonly is shallow unless the referenced value is also modeled as readonly."),
    q("How is a getter named fullName accessed?", ["user.fullName", "user.fullName()", "User.fullName only", "new fullName()"], 0, "Getter syntax exposes a computed value as a property."),
  ]),

  lesson("ts_classes", 4, "inheritance-protected", "Build Inheritance with super & protected", String.raw`# Build Inheritance with super & protected

§extends§ creates a subclass that inherits accessible instance members. If the subclass declares a constructor, it must call §super(...)§ before using §this§ so the base constructor can initialize its part of the object.

§§§ts
class Employee extends User {
  constructor(public jobTitle: string) {
    super();
    super.firstName = 'Max';
  }
}
§§§

Pass every argument required by the base constructor through §super§. A subclass can add members or override inherited behavior.

§protected§ sits between public and private: outside code cannot access it, but subclasses can. Use it for state that derived classes genuinely need; otherwise prefer private.`, String.raw`class User {
  constructor(
    public name: string,
    protected readonly internalId: string,
  ) {}

  describe(): string {
    return this.name + ' [' + this.internalId + ']';
  }
}

class Employee extends User {
  constructor(name: string, id: string, public jobTitle: string) {
    super(name, id);
  }

  work(): string {
    return this.name + ' works as ' + this.jobTitle +
      ' with internal id ' + this.internalId;
  }
}

const employee = new Employee('Max', 'EMP-01', 'Developer');
console.log(employee.describe());
console.log(employee.work());
// console.log(employee.internalId); // Error: protected.`, [
    q("Why must Employee call super()?", ["To run the base-class constructor", "To make every field public", "To compile interfaces", "To create a static method"], 0, "The base constructor must initialize the inherited portion of the instance."),
    q("Who may access a protected member?", ["The declaring class and its subclasses", "All callers", "Only interfaces", "Only static methods"], 0, "Protected keeps outside callers out while allowing derived classes to collaborate with the base class."),
  ]),

  lesson("ts_classes", 5, "abstract-classes", "Design Abstract Base Classes", String.raw`# Design Abstract Base Classes

An abstract class captures shared state and behavior but cannot be constructed directly. It exists to be extended by concrete classes.

§§§ts
abstract class UIElement {
  constructor(public identifier: string) {}

  clone(targetLocation: string): void {
    console.log('Clone to ' + targetLocation);
  }
}

// new UIElement('base'); // Error
§§§

The concrete class forwards required base data with §super(identifier)§ and adds its specialized state. Abstract classes are a TypeScript-only restriction: the §abstract§ keyword is erased during compilation.`, String.raw`abstract class UIElement {
  constructor(public identifier: string) {}

  clone(targetLocation: string): string {
    return this.identifier + ' cloned into ' + targetLocation;
  }
}

class SideDrawerElement extends UIElement {
  constructor(
    identifier: string,
    public position: 'left' | 'right',
  ) {
    super(identifier);
  }

  open(): string {
    return this.identifier + ' opens from the ' + this.position;
  }
}

const drawer = new SideDrawerElement('main-drawer', 'left');
console.log(drawer.open());
console.log(drawer.clone('#mobile-shell'));
// const base = new UIElement('base'); // Error: abstract class.`, [
    q("What is the main purpose of an abstract class?", ["Serve as a non-instantiable base for concrete subclasses", "Create JSON at runtime", "Replace every interface", "Make all fields static"], 0, "Abstract classes centralize shared implementation while requiring callers to construct a concrete subtype."),
    q("What must SideDrawerElement pass to super?", ["The identifier required by UIElement", "Its entire source file", "A type alias", "Nothing, even when the base requires data"], 0, "Subclass constructors must satisfy the base constructor's parameter contract."),
  ]),

  lesson("ts_classes", 6, "interface-contracts", "Define & Use Interface Object Contracts", String.raw`# Define & Use Interface Object Contracts

An interface describes a shape without storing values or method bodies. A method signature states its parameters and return type, not its implementation.

§§§ts
interface Authenticatable {
  email: string;
  password: string;
  login(): void;
  logout(): void;
}
§§§

Use that interface as an object type. The concrete object must supply every required property and method, and it owns the actual login/logout logic.

§§§ts
let user: Authenticatable;
user = {
  email: 'test@example.com',
  password: 'abc1',
  login() { /* create a session */ },
  logout() { /* clear the session */ },
};
§§§`, String.raw`interface Authenticatable {
  email: string;
  password: string;
  login(): void;
  logout(): void;
}

const user: Authenticatable = {
  email: 'test@example.com',
  password: 'abc1',
  login() {
    console.log('Session created for ' + this.email);
  },
  logout() {
    console.log('Session cleared for ' + this.email);
  },
};

user.login();
user.logout();`, [
    q("What belongs inside an interface method declaration?", ["Its parameter and return types, without a body", "Database logic", "A constructor implementation", "Generated JavaScript"], 0, "Interfaces describe behavior contracts rather than implementing behavior."),
    q("What must an object typed Authenticatable provide?", ["Every required property and method", "Only its email", "Only static members", "No runtime values"], 0, "Structural typing checks the object's complete required shape."),
  ]),

  lesson("ts_classes", 7, "interfaces-aliases", "Compare Interfaces, Type Aliases & Callable Contracts", String.raw`# Compare Interfaces, Type Aliases & Callable Contracts

Both a type alias and an interface can describe an object. Type aliases are more general because they can also name unions and primitives; interfaces specialize in extendable object and callable shapes.

Interfaces support declaration merging: separate declarations with the same name combine. That can be useful when augmenting a library-owned interface, but accidental merging can also surprise you. A type alias name cannot be redeclared.

§§§ts
interface Session { token: string; }
interface Session { expiresAt: Date; }

const session: Session = {
  token: 'abc',
  expiresAt: new Date(),
};
§§§

An interface can also describe a call signature, though a function type alias is more common.

§§§ts
type SumFn = (a: number, b: number) => number;
interface SumInterface { (a: number, b: number): number; }
§§§`, String.raw`interface Session {
  token: string;
}

interface Session {
  expiresAt: Date;
}

type SumFn = (a: number, b: number) => number;

interface SumInterface {
  (a: number, b: number): number;
}

const session: Session = {
  token: 'abc',
  expiresAt: new Date(Date.now() + 60_000),
};

const sumWithAlias: SumFn = (a, b) => a + b;
const sumWithInterface: SumInterface = (a, b) => a + b;

console.log(session.token, sumWithAlias(2, 3), sumWithInterface(4, 5));`, [
    q("What does interface declaration merging do?", ["Combines compatible declarations with the same interface name", "Concatenates JavaScript files", "Runs both constructors", "Converts an interface to a class"], 0, "Repeated interface declarations contribute members to one resulting contract."),
    q("Which syntax is more commonly used for a plain function contract?", ["A function type alias", "An abstract class", "A namespace", "A private constructor"], 0, "Interfaces can be callable, but function type aliases are typically easier to recognize."),
  ]),

  lesson("ts_classes", 8, "implements-minimum", "Implement Interfaces & Depend on Minimum Shapes", String.raw`# Implement Interfaces & Depend on Minimum Shapes

§implements§ asks TypeScript to verify that a class has at least the members promised by an interface. A class may implement multiple interfaces separated by commas and may still add extra members.

§§§ts
class AuthenticatableUser implements Authenticatable {
  constructor(
    public userName: string,
    public email: string,
    public password: string,
  ) {}

  login() {}
  logout() {}
}
§§§

Use the interface at API boundaries to depend on the smallest useful capability instead of one concrete class.

§§§ts
function authenticate(user: Authenticatable) {
  user.login();
}
§§§

Any object or class instance with that shape can be passed, which keeps the function flexible and testable.`, String.raw`interface Authenticatable {
  email: string;
  password: string;
  login(): void;
  logout(): void;
}

class AuthenticatableUser implements Authenticatable {
  constructor(
    public userName: string,
    public email: string,
    public password: string,
  ) {}

  login(): void {
    console.log(this.userName + ' logged in.');
  }

  logout(): void {
    console.log(this.userName + ' logged out.');
  }
}

function authenticate(user: Authenticatable): void {
  user.login();
}

const max = new AuthenticatableUser('Max', 'max@example.com', 'secret');
authenticate(max);
max.logout();`, [
    q("May an implementing class have members not listed by the interface?", ["Yes, implements enforces a minimum shape", "No, never", "Only private members", "Only one extra method"], 0, "The interface requires members but does not forbid additional class-specific behavior."),
    q("Why type authenticate with Authenticatable instead of AuthenticatableUser?", ["It accepts any value with the required capability", "It disables type checking", "It makes login static", "It emits the interface at runtime"], 0, "Depending on the contract decouples the function from a specific implementation."),
  ]),

  lesson("ts_classes", 9, "extend-erase", "Extend Interfaces & Understand Type Erasure", String.raw`# Extend Interfaces & Understand Type Erasure

Interface inheritance creates a new contract without changing the original. This differs from declaration merging, which adds members to the same interface.

§§§ts
interface AuthenticatableAdmin extends Authenticatable {
  role: 'admin' | 'super-admin';
}
§§§

An interface may extend multiple interfaces. The derived contract receives every required member and can add its own.

Compile the file and inspect the JavaScript: interface declarations and §implements§ checks are erased because JavaScript has no runtime interface construct. The concrete class, object, methods, and function calls remain. Interfaces improve development-time guarantees; they are not runtime validators.`, String.raw`interface Authenticatable {
  email: string;
  login(): void;
}

interface HasPermissions {
  permissions: string[];
}

interface AuthenticatableAdmin extends Authenticatable, HasPermissions {
  role: 'admin' | 'super-admin';
}

const admin: AuthenticatableAdmin = {
  email: 'admin@example.com',
  role: 'admin',
  permissions: ['courses:write'],
  login() {
    console.log(this.email + ' logged in as ' + this.role);
  },
};

admin.login();
console.log(admin.permissions);

// Compile with: npx tsc classes.ts
// The emitted JavaScript contains admin, but no interface declarations.`, [
    q("How does extends differ from declaration merging here?", ["extends creates a new derived interface", "extends rewrites the original interface", "extends emits runtime validation", "There is no difference"], 0, "The base remains unchanged while the derived interface adds or combines requirements."),
    q("What happens to interface declarations in emitted JavaScript?", ["They are erased", "They become classes", "They become JSON schemas", "They run before main"], 0, "Interfaces are compile-time-only TypeScript constructs."),
  ]),
];

const section7 = [
  lesson("ts_advanced", 1, "intersections", "Compose Shapes with Intersection Types", String.raw`# Compose Shapes with Intersection Types

An intersection combines every requirement from its operands. It is ideal when several data sources share reusable status information.

§§§ts
type FileData = { path: string; content: string };
type DatabaseData = { connectionUrl: string; credentials: string };
type Status = { isOpen: boolean; errorMessage?: string };

type AccessedFileData = FileData & Status;
type AccessedDatabaseData = DatabaseData & Status;
§§§

An §AccessedFileData§ value must contain both file fields and status fields. With interfaces, the equivalent design uses §extends FileData, Status§. Choose the form that fits the surrounding model; the goal is to avoid duplicating shared members.`, String.raw`type FileData = {
  path: string;
  content: string;
};

type DatabaseData = {
  connectionUrl: string;
  credentials: string;
};

type Status = {
  isOpen: boolean;
  errorMessage?: string;
};

type AccessedFileData = FileData & Status;
type AccessedDatabaseData = DatabaseData & Status;

const file: AccessedFileData = {
  path: '/files/course.md',
  content: '# TypeScript',
  isOpen: true,
};

const database: AccessedDatabaseData = {
  connectionUrl: 'postgres://localhost/course',
  credentials: 'local-dev',
  isOpen: false,
  errorMessage: 'Connection closed',
};

console.log(file, database);`, [
    q("What must AccessedFileData contain?", ["All FileData and Status members", "Only the overlapping members", "Only optional fields", "A class constructor"], 0, "An intersection combines requirements rather than choosing one branch."),
    q("What is the interface equivalent of combining these shapes?", ["An interface extending FileData and Status", "A private field", "A function overload", "A const assertion"], 0, "Interface inheritance can combine multiple object contracts."),
  ]),

  lesson("ts_advanced", 2, "in-guards", "Narrow Union Objects with Type Guards", String.raw`# Narrow Union Objects with Type Guards

A union permits either shape, so code must establish which member it received before accessing member-specific properties. Type guards use runtime checks that TypeScript can understand.

§§§ts
type Source = FileSource | DBSource;

function loadData(source: Source) {
  if ('path' in source) {
    console.log(source.path);
    return;
  }
  console.log(source.connectionUrl);
}
§§§

The §in§ operator is a real JavaScript runtime check. A redundant §typeof source === 'object'§ is unnecessary here because both union members are already known object types. The early return lets control-flow analysis narrow the remaining branch to §DBSource§.`, String.raw`type FileSource = {
  path: string;
};

type DBSource = {
  connectionUrl: string;
};

type Source = FileSource | DBSource;

function loadData(source: Source): string {
  if ('path' in source) {
    return 'Opening file at ' + source.path;
  }

  return 'Connecting to ' + source.connectionUrl;
}

const fileSource: FileSource = { path: '/data/file.csv' };
const dbSource: DBSource = { connectionUrl: 'db://courses' };

console.log(loadData(fileSource));
console.log(loadData(dbSource));`, [
    q("Why check 'path' in source?", ["It supplies runtime evidence that narrows to FileSource", "It converts the object to a file", "It adds path to every object", "It disables strict mode"], 0, "The in operator verifies property existence at runtime and TypeScript follows that control flow."),
    q("Why is source.connectionUrl safe after the early return?", ["The FileSource branch has already exited", "Every object has connectionUrl", "A cast was added", "The union became an intersection"], 0, "Control-flow analysis knows the remaining path must be the database branch."),
  ]),

  lesson("ts_advanced", 3, "discriminated-unions", "Model Exhaustive Branches with Discriminated Unions", String.raw`# Model Exhaustive Branches with Discriminated Unions

A discriminated union gives every member the same tag property but a different literal value. Checking that tag is clearer and more stable than probing for incidental fields.

§§§ts
type FileSource = { type: 'file'; path: string };
type DBSource = { type: 'db'; connectionUrl: string };
type Source = FileSource | DBSource;
§§§

Inside §source.type === 'file'§, TypeScript knows §source§ is §FileSource§. A §switch§ scales well and a §never§ assertion turns a newly added, unhandled union member into a compiler error.`, String.raw`type FileSource = {
  type: 'file';
  path: string;
};

type DBSource = {
  type: 'db';
  connectionUrl: string;
};

type Source = FileSource | DBSource;

function assertNever(value: never): never {
  throw new Error('Unhandled source: ' + JSON.stringify(value));
}

function loadData(source: Source): string {
  switch (source.type) {
    case 'file':
      return 'Opening ' + source.path;
    case 'db':
      return 'Connecting to ' + source.connectionUrl;
    default:
      return assertNever(source);
  }
}

console.log(loadData({ type: 'file', path: '/data.json' }));
console.log(loadData({ type: 'db', connectionUrl: 'db://local' }));`, [
    q("What makes this union discriminated?", ["Every member has a shared type field with a distinct literal value", "Every member is a class", "The fields are private", "It uses an index signature"], 0, "The common literal tag connects runtime branching to static narrowing."),
    q("Why call assertNever in default?", ["To detect an unhandled future union member", "To make every branch throw", "To convert strings to numbers", "To merge interfaces"], 0, "Exhaustiveness checking fails when source is no longer never."),
  ]),

  lesson("ts_advanced", 4, "instanceof-predicates", "Reuse instanceof & Custom Type Predicates", String.raw`# Reuse instanceof & Custom Type Predicates

Use §instanceof§ when the alternatives are actual classes. It is a JavaScript runtime operator, and TypeScript narrows the instance inside each branch.

§§§ts
if (entity instanceof User) {
  entity.join();
  return;
}
entity.scan();
§§§

Repeated guards can be moved into a function. Modern TypeScript can infer a predicate from a simple Boolean return; an explicit §source is FileSource§ return type documents the guarantee and works when inference is not available.

§§§ts
function isFile(source: Source): source is FileSource {
  return source.type === 'file';
}
§§§

A predicate is still a Boolean at runtime. Its extra meaning is a compile-time promise, so its implementation must be truthful.`, String.raw`class User {
  constructor(public name: string) {}
  join(): string { return this.name + ' joined.'; }
}

class Admin {
  constructor(public permissions: string[]) {}
  scan(): string { return 'Scanned: ' + this.permissions.join(', '); }
}

type Entity = User | Admin;

function initialize(entity: Entity): string {
  if (entity instanceof User) return entity.join();
  return entity.scan();
}

type FileSource = { type: 'file'; path: string };
type DBSource = { type: 'db'; connectionUrl: string };
type Source = FileSource | DBSource;

function isFile(source: Source): source is FileSource {
  return source.type === 'file';
}

function describe(source: Source): string {
  return isFile(source) ? source.path : source.connectionUrl;
}

console.log(initialize(new User('Max')));
console.log(initialize(new Admin(['users:read'])));
console.log(describe({ type: 'file', path: '/notes.txt' }));`, [
    q("When is instanceof an appropriate guard?", ["When alternatives are class instances", "For arbitrary interface-only objects", "Only for numbers", "Only during compilation"], 0, "Instanceof checks the runtime prototype chain of class instances."),
    q("What does source is FileSource mean?", ["A true result tells TypeScript the argument is FileSource", "It constructs a file", "It changes Source permanently", "It performs validation automatically"], 0, "A type predicate attaches narrowing information to the Boolean result."),
  ]),

  lesson("ts_advanced", 5, "overloads", "Map Inputs to Outputs with Function Overloads", String.raw`# Map Inputs to Outputs with Function Overloads

The implementation of §getLength§ returns different types: text input produces a label such as §'3 words'§, while an array produces a numeric item count. A plain union signature loses the relationship between input and output.

§§§ts
function getLength(value: string | any[]) {
  if (typeof value === 'string') {
    const numberOfWords = value.split(' ').length;
    return numberOfWords + ' words';
  }
  return value.length;
}
§§§

Overload signatures describe each supported call, followed by one compatible implementation signature and body.

§§§ts
function getLength(value: any[]): number;
function getLength(value: string): string;
function getLength(value: string | any[]) { /* implementation */ }
§§§

Callers now receive a precise result without casting. Overloads are valuable when output depends on the input form; do not use them when one union return type already tells the truth.`, String.raw`function getLength(value: unknown[]): number;
function getLength(value: string): string;
function getLength(value: string | unknown[]): string | number {
  if (typeof value === 'string') {
    const numberOfWords = value.trim().split(/\s+/).length;
    return numberOfWords + ' words';
  }

  return value.length;
}

const numberOfWords = getLength('does this work?');
const numberOfItems = getLength(['Sports', 'Cookies']);

console.log(numberOfWords.toUpperCase());
console.log(numberOfItems.toFixed(0));`, [
    q("What information do overloads preserve?", ["The relationship between each input form and its output type", "Runtime database state", "Private class fields", "CSS properties"], 0, "Each overload signature maps a supported argument type to a precise return type."),
    q("How many implementation bodies may an overloaded function have?", ["One", "One per overload signature", "None", "Exactly four"], 0, "Several visible signatures share one compatible implementation."),
  ]),

  lesson("ts_advanced", 6, "index-record", "Model Dynamic Keys with Index Signatures & Record", String.raw`# Model Dynamic Keys with Index Signatures & Record

An index signature models property names that are unknown in advance while constraining their values.

§§§ts
type DataStore = {
  [property: string]: number | boolean;
};

const store: DataStore = {};
store.id = 5;
store.isOpen = false;
// store.name = 'Max'; // Error
§§§

The placeholder name §property§ is documentation; §string§ is the key type. §Record<string, number | boolean>§ expresses the same broad dictionary contract with a built-in utility type.

Use a dynamic dictionary only when keys really are open-ended. A normal object type is safer when the valid keys are known.`, String.raw`type DataStore = {
  [property: string]: number | boolean;
};

const store: DataStore = {};
store.id = 5;
store.isOpen = false;

const metrics: Record<string, number | boolean> = {
  lessons: 42,
  published: true,
};

function printStore(values: Record<string, number | boolean>): void {
  for (const [key, value] of Object.entries(values)) {
    console.log(key + ': ' + value);
  }
}

printStore(store);
printStore(metrics);`, [
    q("What does [property: string]: number | boolean allow?", ["Any string-compatible key whose value is number or boolean", "Only a property literally named property", "Any value type", "Only arrays"], 0, "The bracketed name is a placeholder for dynamic string keys."),
    q("Which utility describes the same broad dictionary?", ["Record<string, number | boolean>", "Partial<number>", "Promise<boolean>", "ReadonlyArray<string>"], 0, "Record maps an allowed key type to an allowed value type."),
  ]),

  lesson("ts_advanced", 7, "as-const", "Preserve Literal Values with as const", String.raw`# Preserve Literal Values with as const

Without context, an array such as §['admin', 'guest', 'editor']§ widens to §string[]§ because TypeScript assumes it may later hold other strings.

§as const§ asks for the narrowest practical inference. The array becomes a readonly tuple and each element keeps its literal type.

§§§ts
const roles = ['admin', 'guest', 'editor'] as const;
const firstRole = roles[0]; // 'admin'
// roles.push('author');    // Error: readonly
§§§

This is stronger than a §const§ variable alone: §const§ prevents rebinding, while §as const§ also narrows nested literals and marks inferred properties readonly. Use it for fixed configuration and discriminant values.`, String.raw`const roles = ['admin', 'guest', 'editor'] as const;
type Role = (typeof roles)[number];

const permissions = {
  admin: ['read', 'write', 'delete'],
  guest: ['read'],
  editor: ['read', 'write'],
} as const;

function canWrite(role: Role): boolean {
  const allowed: readonly string[] = permissions[role];
  return allowed.includes('write');
}

const firstRole = roles[0];
console.log(firstRole, canWrite('admin'), canWrite('guest'));

// roles.push('author'); // Error: readonly tuple.
// permissions.guest.push('write'); // Error: readonly array.`, [
    q("What is the inferred type of roles[0] after as const?", ["The literal type 'admin'", "string", "unknown", "never"], 0, "A const assertion preserves positional literal information in the tuple."),
    q("How does as const differ from a const variable declaration?", ["It also narrows literals and makes inferred members readonly", "It changes runtime values", "It only works on classes", "There is no difference"], 0, "Const prevents rebinding; a const assertion affects the inferred type of the value."),
  ]),

  lesson("ts_advanced", 8, "satisfies", "Validate Contracts without Losing Inference", String.raw`# Validate Contracts without Losing Inference

A direct annotation validates a value but may widen useful information.

§§§ts
const annotated: Record<string, number> = {
  entry1: 0.51,
  entry2: -1.23,
};

annotated.entry3; // Allowed by the broad string-key type
§§§

§satisfies§ checks that the value conforms to a target type while retaining the value's more specific inferred type.

§§§ts
const dataEntries = {
  entry1: 0.51,
  entry2: -1.23,
} satisfies Record<string, number>;

dataEntries.entry2;
// dataEntries.entry3; // Error: typo or unknown key
§§§

This pattern is especially useful for library configuration. For example, a routes array can satisfy a library's route contract while keeping exact route objects available to tooling and autocomplete. It validates; it does not cast or transform the runtime value.`, String.raw`type RouteConfig = {
  path: string;
  component: 'home' | 'courses' | 'lesson';
  requiresAuth?: boolean;
};

const dataEntries = {
  entry1: 0.51,
  entry2: -1.23,
} satisfies Record<string, number>;

const routes = [
  { path: '/', component: 'home' },
  { path: '/courses', component: 'courses', requiresAuth: true },
  { path: '/lesson/:id', component: 'lesson', requiresAuth: true },
] satisfies RouteConfig[];

console.log(dataEntries.entry1);
console.log(routes.map(route => route.path));

// dataEntries.entry3; // Error: property does not exist.
// routes.push({ path: '/bad', component: 'missing' }); // Error.`, [
    q("What does satisfies preserve that a broad annotation can lose?", ["The value's specific inferred keys and literals", "Runtime encryption", "Private fields", "Compiled interfaces"], 0, "Satisfies checks compatibility without replacing the expression's useful inferred type."),
    q("Does satisfies transform or validate data at runtime?", ["No, it is a compile-time compatibility check", "Yes, it parses every value", "Only in Node.js", "Only for arrays"], 0, "Runtime validation needs separate JavaScript logic or a validation library."),
  ]),
];

const curriculum = JSON.parse(fs.readFileSync(curriculumPath, "utf8"));
curriculum.topics = curriculum.topics.filter(({ name }) => name !== section6Name && name !== section7Name);
curriculum.topics.push({ name: section6Name, subtopics: section6 });
curriculum.topics.push({ name: section7Name, subtopics: section7 });
fs.writeFileSync(curriculumPath, `${JSON.stringify(curriculum, null, 2)}\n`);

const challenges = [
  {
    name: section6Name,
    title: "Classes & Interfaces Architecture Challenge",
    items: [
      ["What activates a constructor parameter property?", ["An access modifier", "A getter", "A union", "A spread operator"], 0, "Modifiers such as public or private make the parameter an instance field."],
      ["What does readonly prevent on an array property?", ["Reassigning the property", "Every push", "Reading the array", "Constructing the class"], 0, "Readonly is shallow unless the array itself is typed readonly."],
      ["Which syntax reads a getter?", ["user.fullName", "user.fullName()", "get user.fullName", "new fullName"], 0, "Getters use property access."],
      ["Where is a static method called?", ["On the class", "Only on an instance", "Inside an interface", "Inside JSON"], 0, "Static members belong to the constructor/class object."],
      ["What must a derived constructor call?", ["super(...) before this", "implements", "readonly", "satisfies"], 0, "The base constructor initializes the inherited object state."],
      ["Which modifier allows subclasses but blocks outside callers?", ["protected", "public", "static", "abstract"], 0, "Protected is visible to the class hierarchy."],
      ["Can an abstract class be instantiated directly?", ["No", "Yes", "Only with an interface", "Only in strict mode"], 0, "It must be extended by a concrete class."],
      ["What does implements guarantee?", ["A class has at least the interface shape", "Runtime validation", "A single instance", "Private fields"], 0, "Implements is a compile-time contract check."],
      ["Which feature can add members to a repeated interface name?", ["Declaration merging", "Function overloading", "Indexing", "Type casting"], 0, "Compatible interface declarations merge."],
      ["What happens to interfaces in JavaScript output?", ["They are erased", "They become objects", "They throw", "They become comments"], 0, "Interface metadata exists only during TypeScript checking."],
    ],
  },
  {
    name: section7Name,
    title: "Advanced Types Mastery Challenge",
    items: [
      ["What does A & B require?", ["All members of A and B", "Either A or B", "Only shared members", "No members"], 0, "An intersection composes requirements."],
      ["Which operator narrows by property existence?", ["in", "new", "delete", "await"], 0, "The in operator supplies runtime evidence."],
      ["What powers a discriminated union?", ["A shared property with distinct literals", "A private field", "A static class", "A broad string index"], 0, "The literal tag identifies each member."],
      ["Which guard suits class instances?", ["instanceof", "satisfies", "Record", "readonly"], 0, "Instanceof checks the prototype chain."],
      ["What does a type predicate return at runtime?", ["A boolean", "A type object", "A compiler", "An interface"], 0, "The predicate's extra narrowing information exists at compile time."],
      ["Why use overloads?", ["To map input forms to precise outputs", "To create multiple runtime bodies", "To merge classes", "To freeze arrays"], 0, "Overload signatures preserve call-specific type relationships."],
      ["What does an index signature constrain?", ["Dynamic key and value types", "Only line numbers", "Class inheritance", "Function arity"], 0, "It models dictionaries with unknown property names."],
      ["What does Record<K, V> describe?", ["Keys K mapped to values V", "A video recording", "A private constructor", "A union guard"], 0, "Record is a mapped object utility."],
      ["What does as const do to an inferred array?", ["Makes it a readonly literal tuple", "Makes it any[]", "Runs it", "Deletes it"], 0, "Const assertions preserve literals and readonly structure."],
      ["Why use satisfies instead of a broad annotation?", ["Validate the contract while retaining specific inference", "Perform runtime parsing", "Disable checking", "Emit interfaces"], 0, "Satisfies checks compatibility without widening the expression."],
    ],
  },
];

const questions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
questions.topics = questions.topics.filter(({ name }) => name !== section6Name && name !== section7Name);
for (const challenge of challenges) {
  questions.topics.push({
    name: challenge.name,
    rounds: [{
      round_number: 1,
      title: challenge.title,
      questions: challenge.items.map(([question, options, correct_option_index, explanation]) => ({
        type: "mcq", question, options, correct_option_index, explanation,
      })),
    }],
  });
}
fs.writeFileSync(questionsPath, `${JSON.stringify(questions, null, 2)}\n`);

console.log(`Built ${section6.length} Section 6 subclasses, ${section7.length} Section 7 subclasses, and 20 challenge questions.`);
