const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(walk(full));
    else if (entry.name.endsWith(".jsx")) results.push(full);
  }
  return results;
}

const files = walk(path.join("D:\\Default Project\\client\\src"));
let fixed = 0;
for (const f of files) {
  let content = fs.readFileSync(f, "utf8");
  const original = content;
  // Fix missing opening quote after "from " for Button imports
  content = content.replace(/import Button from "([^"]*Button\.jsx)"/g, 'import Button from "$1"');
  if (content !== original) {
    fs.writeFileSync(f, content);
    console.log("Fixed Button import:", f);
    fixed++;
  }
}
console.log(`Fixed ${fixed} files`);
