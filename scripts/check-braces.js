const fs = require('fs');
const file = process.argv[2] || 'src/docs/swagger.js';
const s = fs.readFileSync(file, 'utf8');
let stack = [];
let targetDepth = null;
let currentDepth = 0;
let inStr = false, strCh = '';
let inSL = false, inML = false;
for (let i = 0, line = 1, col = 1; i < s.length; i++, col++) {
  const c = s[i];
  const n = s[i+1];
  if (c === '\n') { line++; col = 0; inSL = false; continue; }
  if (inSL) continue;
  if (inML) { if (c === '*' && n === '/') { inML = false; i++; col++; } continue; }
  if (inStr) { if (c === '\\') { i++; col++; continue; } if (c === strCh) { inStr = false; strCh = ''; } continue; }
  if (c === '/' && n === '/') { inSL = true; i++; col++; continue; }
  if (c === '/' && n === '*') { inML = true; i++; col++; continue; }
  if (c === '\'' || c === '"' || c === '`') { inStr = true; strCh = c; continue; }
  if (c === '{' || c === '(' || c === '[') {
    stack.push({ c, line, col });
    currentDepth++;
    if (line === 290 && c === '{' && !targetDepth) targetDepth = currentDepth;
  }
  else if (c === '}' || c === ')' || c === ']') {
    const o = stack.pop();
    currentDepth--;
    if (!o) { console.log('Extra closing', c, 'at', line, col); process.exit(1); }
    const ok = (o.c === '{' && c === '}') || (o.c === '(' && c === ')') || (o.c === '[' && c === ']');
    if (!ok) { console.log('Mismatch closing', c, 'at', line, col, 'for opener', o.c, 'at', o.line, o.col); process.exit(1); }
    if (targetDepth && currentDepth + 1 === targetDepth && o.c === '{') {
      console.log('Potential closing for paths at', line, col);
    }
  }
}
if (stack.length) {
  console.log('Unclosed opener', stack[stack.length-1]);
  process.exit(1);
}
console.log('Balanced');
