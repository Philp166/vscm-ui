import { useEffect, useMemo, useState } from 'react';
import { Card } from '../Card/Card';
import { DeltaPill } from '../DeltaPill/DeltaPill';
import { fmt, smoothPath, NB } from '../../utils/format';
import './KpiCard.css';

export interface KpiPoint { year: number; value: number }
export interface KpiCardProps {
  title: string;
  info?: string;
  /** Ряд по годам: последний год — текущее значение */
  series?: KpiPoint[];
  unit?: string;
  digits?: number;
  /** Единица изменения: «%» для числа, « п.п.» для доли */
  deltaUnit?: string;
  state?: 'ready' | 'loading' | 'empty';
  /** Подсказка для состояния «нет данных» */
  emptyText?: string;
}

/** Карточка KPI: цифра, изменение к прошлому году, мини-график. Проведите по графику — цифра и год меняются. */
export function KpiCard({ title, info, series = [], unit = '', digits = 0, deltaUnit = '%', state = 'ready', emptyText = 'За этот период показатель ещё не загружен.' }: KpiCardProps) {
  const [idx, setIdx] = useState(series.length - 1);
  useEffect(() => setIdx(series.length - 1), [series.length]);
  const cur = series[idx], prev = series[idx - 1];
  const delta = cur && prev ? (deltaUnit === '%' ? (cur.value / prev.value - 1) * 100 : cur.value - prev.value) : 0;
  const shown = useCounter(cur?.value ?? 0);
  const W = 240, H = 56;
  const pts = useMemo(() => {
    if (series.length < 2) return [] as [number, number][];
    const vs = series.map((s) => s.value), lo = Math.min(...vs), hi = Math.max(...vs);
    return series.map((s, i) => [4 + (i * (W - 8)) / (series.length - 1), 6 + (H - 12) * (1 - (s.value - lo) / (hi - lo || 1))] as [number, number]);
  }, [series]);

  if (state === 'loading') return <Card title={title} info={info}><div className="vs-kpi__sk"><i /><i /><i /></div></Card>;
  if (state === 'empty') return <Card title={title} info={info}><div className="vs-kpi__empty"><b>Нет данных</b><span>{emptyText}</span></div></Card>;

  return (
    <Card title={title} info={info}>
      <div className="vs-kpi">
        <div className="vs-kpi__v vs-num">{fmt(shown, digits)}{unit && <small>{NB}{unit}</small>}</div>
        <DeltaPill value={delta} unit={deltaUnit} label={prev ? `к ${prev.year} году` : undefined} />
        {pts.length > 1 && (
          <svg className="vs-kpi__ch" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
            onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setIdx(Math.round(((e.clientX - r.left) / r.width) * (series.length - 1))); }}
            onPointerLeave={() => setIdx(series.length - 1)}>
            <path d={`${smoothPath(pts)} L${W - 4},${H} L4,${H} Z`} className="vs-kpi__area" />
            <path d={smoothPath(pts)} className="vs-kpi__line" vectorEffect="non-scaling-stroke" />
            <circle cx={pts[idx][0]} cy={pts[idx][1]} r="3.5" className="vs-kpi__dot" vectorEffect="non-scaling-stroke" />
          </svg>
        )}
        {cur && <div className="vs-kpi__y">{cur.year}{NB}год</div>}
      </div>
    </Card>
  );
}

function useCounter(target: number) {
  const [v, setV] = useState(target);
  useEffect(() => {
    const from = v, t0 = performance.now(), D = 700; let raf = 0;
    const step = (t: number) => { const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3); setV(from + (target - from) * e); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return v;
}
