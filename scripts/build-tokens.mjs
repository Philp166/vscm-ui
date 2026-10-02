// Собирает src/styles/tokens.css из tokens/vscm.tokens.json (источник правды).
import fs from 'node:fs';
const T = JSON.parse(fs.readFileSync(new URL('../tokens/vscm.tokens.json', import.meta.url), 'utf8'));
const varName = (path) => '--' + path.join('-').replace(/^(primitives|semantic)-/, '');
const hexa = (v) => {
  if (typeof v === 'string' && /^#[0-9a-f]{8}$/i.test(v)) {
    const [r, g, b, a] = [1, 3, 5, 7].map((i) => parseInt(v.slice(i, i + 2), 16));
    return `rgba(${r},${g},${b},${+(a / 255).toFixed(2)})`;
  }
  return v;
};
const lines = [];
const walk = (node, path) => {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) {
      let val = v.$value;
      if (typeof val === 'string' && val.startsWith('{')) val = `var(${varName(val.slice(1, -1).split('.'))})`;
      else if (v.$type === 'color') val = hexa(val);
      else if (v.$type === 'shadow') val = val.map((s) => `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${hexa(s.color)}`).join(', ');
      else if (v.$type === 'cubicBezier') val = `cubic-bezier(${val.join(',')})`;
      else if (v.$type === 'fontFamily') val = `'${val}', 'Manrope Variable', system-ui, sans-serif`;
      lines.push(`  ${varName([...path, k])}: ${val};`);
    } else if (v && typeof v === 'object') walk(v, [...path, k]);
  }
};
walk(T, []);
fs.writeFileSync(new URL('../src/styles/tokens.css', import.meta.url),
  `/* Сгенерировано из tokens/vscm.tokens.json командой npm run tokens. Руками не править. */\n:root {\n${lines.join('\n')}\n}\n`);
console.log(`tokens.css: ${lines.length} переменных`);
