/** Общие помощники графиков: шкалы, «красивые» деления, анимация чисел, видимость. */
import { useEffect, useRef, useState } from 'react';

export const SERIES = ['var(--color-chart-series-1)', 'var(--color-chart-series-2)', 'var(--color-chart-series-3)', 'var(--color-chart-series-4)'];
export const SCALE5 = ['var(--color-scale-1)', 'var(--color-scale-2)', 'var(--color-scale-3)', 'var(--color-scale-4)', 'var(--color-scale-5)'];

export function niceStep(raw: number) { const p = Math.pow(10, Math.floor(Math.log10(raw || 1))), m = raw / p; return (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p; }
/** 3–5 горизонтальных делений от нуля или от минимума. */
export function ticks(lo: number, hi: number, fromZero = true) {
  const a = fromZero ? Math.min(0, lo) : lo - (hi - lo) * 0.1, b = hi + (hi - a) * 0.08, step = niceStep((b - a) / 4);
  const t: number[] = []; for (let v = (fromZero ? Math.ceil(a / step) : Math.floor(a / step)) * step; v <= b + 1e-9; v += step) t.push(+v.toFixed(6));
  if (t[t.length - 1] < b - 1e-9) t.push(+(t[t.length - 1] + step).toFixed(6));
  return { lo: fromZero ? Math.min(0, t[0]) : t[0], hi: t[t.length - 1], t };
}
/** Плавно меняющееся число (перекат табло). */
export function useAnimatedNumber(target: number, ms = 700) {
  const [v, setV] = useState(target); const from = useRef(target);
  useEffect(() => { const f = from.current, t0 = performance.now(); let raf = 0;
    const step = (t: number) => { const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3), cur = f + (target - f) * e; setV(cur); from.current = cur; if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf); }, [target, ms]);
  return v;
}
/** true после первого кадра: для анимации появления (полосы растут от нуля). */
export function useMounted() { const [m, setM] = useState(false); useEffect(() => { const r = requestAnimationFrame(() => requestAnimationFrame(() => setM(true))); return () => cancelAnimationFrame(r); }, []); return m; }
/** Номер точки под курсором по оси X. */
export function indexAt(e: React.PointerEvent<SVGSVGElement>, W: number, l: number, r: number, n: number) {
  const rc = e.currentTarget.getBoundingClientRect(), sx = ((e.clientX - rc.left) / rc.width) * W;
  return Math.max(0, Math.min(n - 1, Math.round(((sx - l) / (W - l - r)) * (n - 1))));
}
