const fs = require("fs");
const f = "D:\\Default Project\\client\\src\\pages\\admin\\AdminOrders.jsx";
let content = fs.readFileSync(f, "utf8");
content = content.replace('import Button from ../../components/common/Button.jsx";', 'import Button from "../../components/common/Button.jsx";');
fs.writeFileSync(f, content);
console.log("Fixed AdminOrders.jsx");