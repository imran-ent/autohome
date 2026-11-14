const fs = require('fs');
const path = require('path');

// Read existing file
const filePath = 'D:\\Default Project\\client\\src\\pages\\customer\\Home.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix the import line - replace lucide.react with lucide-react
content = content.replace(/from ['"]lucide\.react['"]/g, 'from "lucide-react"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed Home.jsx imports');