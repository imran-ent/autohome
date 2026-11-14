const fs = require("fs");
const f = "D:\\Default Project\\client\\src\\pages\\customer\\Home.jsx";
let c = fs.readFileSync(f, "utf8");
c = c.replace(/from ["']lucide\.react["']/g, 'from "lucide-react"');
fs.writeFileSync(f, c, "utf8");
console.log("Fixed Home.jsx lucide import");