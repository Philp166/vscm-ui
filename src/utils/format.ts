/** Неразрывный пробел: разряды и единицы не переносятся. */
export const NB = '\u00a0';
/** Число по-русски: разряды неразрывным пробелом, дробь через запятую. */
export function fmt(v: number, digits = 0): string {
  return v.toLocaleString('ru-RU', { minimumFractionDigits: digits, maximumFractionDigits: digits }).replace(/\s/g, NB);
}
/** Округлённая подпись оси: тыс., млн. */
export function fmtShort(v: number): string {
  if (Math.abs(v) >= 1e6) return fmt(v / 1e6, 1) + NB + 'млн';
  if (Math.abs(v) >= 1e3) return fmt(Math.round(v / 1e3)) + NB + 'тыс.';
  return fmt(v);
}
/** Плавная кривая через точки (монотонная, без выбросов). */
export function smoothPath(p: [number, number][]): string {
  if (p.length < 2) return '';
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const [x0, y0] = p[i], [x1, y1] = p[i + 1], mx = (x0 + x1) / 2;
    d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  return d;
}
