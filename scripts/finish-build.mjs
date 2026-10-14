// Доводит сборку пакета после vite и tsc:
// 1) кладёт токены рядом со сборкой: dist/tokens.css (CSS-переменные) и dist/tokens.json (DTCG, как в Figma);
// 2) убирает из типов строки `import './x.css'`: стили уже собраны в dist/style.css, а в .d.ts такие строки мешают строгим проектам.
import fs from 'node:fs';
import path from 'node:path';
const root = new URL('../', import.meta.url);
fs.copyFileSync(new URL('src/styles/tokens.css', root), new URL('dist/tokens.css', root));
fs.copyFileSync(new URL('tokens/vscm.tokens.json', root), new URL('dist/tokens.json', root));
let n = 0;
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return walk(p);
  if (!p.endsWith('.d.ts')) return;
  const src = fs.readFileSync(p, 'utf8'), out = src.replace(/^import '[^']+\.css';\r?\n/gm, '');
  if (out !== src) { fs.writeFileSync(p, out); n++; }
});
walk(new URL('dist/types', root).pathname);
console.log(`finish-build: токены скопированы, css-импорты убраны из ${n} файлов типов`);
