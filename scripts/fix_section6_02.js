const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../backend/data/typescript_curriculum.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const section6 = data.topics[5];
if (!section6 || !section6.name.includes("Section 6")) {
    console.error("Section 6 not found at index 5");
    process.exit(1);
}

const subclass = section6.subtopics.find(s => s.id === 'ts_classes_02');
if (!subclass) {
    console.error("Subclass ts_classes_02 not found");
    process.exit(1);
}

// Replace the confusing text
let content = subclass.content;
content = content.replace(
  "Writing out field declarations, constructor parameters, and `this.field = param` assignments is incredibly repetitive.",
  "In the previous example, we had to declare `name` at the top of the class, accept it as a constructor parameter, and then manually assign it using `this.name = n;`. Doing this for every single field is incredibly repetitive."
);

subclass.content = content;

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log("Fixed ts_classes_02 successfully!");
