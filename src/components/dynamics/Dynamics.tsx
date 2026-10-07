import { useMemo, useState } from 'react';
import { Card } from '../Card/Card';
import { Segment } from '../Segment/Segment';
import { DeltaPill } from '../DeltaPill/DeltaPill';
import { ChartTip } from '../../charts/ChartTip';
import { SERIES, ticks, indexAt, useMounted } from '../../charts/chart';
import { fmt, fmtShort, smoothPath } from '../../utils/format';
import './dynamics.css';

const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const P = { l: 8, r: 56, t: 16, b: 28 };

/* ---------- Сравнение лет по месяцам ---------- */
export interface YearCompareProps { title: string; byYear: Record<string, number[]>; current: string }
/** Режим «Сравнить годы»: ось январь–декабрь, годы капсулами, текущий год жирной линией. */
export function YearCompare({ title, byYear, current }: YearCompareProps) {
  const years = Object.keys(byYear); const [on, setOn] = useState<string[]>(years.slice(-3)); const [h, setH] = useState<number | null>(null);
  const W = 720, H = 260, all = on.flatMap((y) => byYear[y]), { lo, hi, t } = ticks(Math.min(...all), Math.max(...all), false);
  const x = (i: number) => P.l + ((W - P.l - P.r) * i) / 11, y = (v: number) => P.t + (H - P.t - P.b) * (1 - (v - lo) / (hi - lo));
  const col = (yr: string) => yr === current ? 'var(--color-chart-series-1)' : ['var(--color-gray-400)', 'var(--color-chart-series-2)', 'var(--color-chart-series-3)', 'var(--color-gray-300)'][years.indexOf(yr) % 4];
  return (
    <Card title={title} action={<div className="vs-yc">{years.map((yr) => <button key={yr} className={on.includes(yr) ? 'on' : ''} style={on.includes(yr) ? { background: col(yr) } : undefined} onClick={() => setOn(on.includes(yr) ? on.filter((z) => z !== yr) : [...on, yr])}>{yr}</button>)}</div>}>
      <div className="vs-dyn">
        <svg viewBox={`0 0 ${W} ${H}`} onPointerMove={(e) => setH(indexAt(e, W, P.l, P.r, 12))} onPointerLeave={() => setH(null)}>
          {t.map((v) => <g key={v}><line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} className="g" /><text x={W - P.r + 8} y={y(v) + 4} className="ax">{fmtShort(v)}</text></g>)}
          {on.map((yr) => <path key={yr} d={smoothPath(byYear[yr].map((v, i) => [x(i), y(v)]))} fill="none" stroke={col(yr)} strokeWidth={yr === current ? 3 : 2} strokeLinecap="round" className="ln" />)}
          {MONTHS.map((m, i) => <text key={m} x={x(i)} y={H - 6} textAnchor="middle" className="ax">{m}</text>)}
          {h != null && <line x1={x(h)} x2={x(h)} y1={P.t} y2={H - P.b} className="rl" />}
        </svg>
        {h != null && <ChartTip x={x(h) / W}><b>{MONTHS[h]}</b>{[...on].sort().reverse().map((yr) => <span key={yr}><i className="k" style={{ background: col(yr) }} />{yr}: <b>{fmt(byYear[yr][h])}</b></span>)}</ChartTip>}
      </div>
    </Card>
  );
}

/* ---------- Площадной: состав во времени ---------- */
export interface AreaChartProps { title: string; labels: string[]; series: { name: string; values: number[] }[] }
/** Площадной график: как меняется состав. Переключатель числа / доли. */
export function AreaChart({ title, labels, series }: AreaChartProps) {
  const [mode, setMode] = useState(0); const [h, setH] = useState<number | null>(null);
  const W = 720, H = 260, n = labels.length, tot = labels.map((_, i) => series.reduce((s, z) => s + z.values[i], 0));
  const val = (si: number, i: number) => (mode ? (series[si].values[i] / tot[i]) * 100 : series[si].values[i]);
  const top = mode ? 100 : Math.max(...tot), { hi, t } = ticks(0, top);
  const x = (i: number) => P.l + ((W - P.l - P.r) * i) / (n - 1), y = (v: number) => P.t + (H - P.t - P.b) * (1 - v / hi);
  const layers = useMemo(() => { const acc = labels.map(() => 0); return series.map((_, si) => { const lo = acc.slice(); labels.forEach((__, i) => (acc[i] += val(si, i))); return { lo, up: acc.slice() }; }); /* eslint-disable-next-line */ }, [mode, series, labels]);
  return (
    <Card title={title} action={<Segment size="sm" options={['Числа', 'Доли']} value={mode} onChange={setMode} />}>
      <div className="vs-lg">{series.map((s, i) => <span key={s.name}><i style={{ background: SERIES[i] }} />{s.name}</span>)}</div>
      <div className="vs-dyn">
        <svg viewBox={`0 0 ${W} ${H}`} onPointerMove={(e) => setH(indexAt(e, W, P.l, P.r, n))} onPointerLeave={() => setH(null)}>
          {t.map((v) => <g key={v}><line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} className="g" /><text x={W - P.r + 8} y={y(v) + 4} className="ax">{mode ? fmt(v) + '%' : fmtShort(v)}</text></g>)}
          {layers.map((L, si) => { const up = L.up.map((v, i) => [x(i), y(v)] as [number, number]), lo = L.lo.map((v, i) => [x(i), y(v)] as [number, number]).reverse();
            return <path key={si} d={`${smoothPath(up)} L${lo[0][0]},${lo[0][1]} ${smoothPath(lo).slice(1)} Z`} fill={SERIES[si]} opacity={0.9} className="ar" />; })}
          {labels.map((l, i) => <text key={l} x={x(i)} y={H - 6} textAnchor="middle" className="ax">{l}</text>)}
          {h != null && <line x1={x(h)} x2={x(h)} y1={P.t} y2={H - P.b} className="rl" />}
        </svg>
        {h != null && <ChartTip x={x(h) / W}><b>{labels[h]}</b>{series.map((s, si) => <span key={s.name}><i className="k" style={{ background: SERIES[si] }} />{s.name}: <b>{mode ? fmt(val(si, h), 1) + '%' : fmt(s.values[h])}</b></span>)}</ChartTip>}
      </div>
    </Card>
  );
}

/* ---------- Столбцы и линия: две меры ---------- */
export interface ComboChartProps { title: string; labels: string[]; bars: { name: string; values: number[] }; line: { name: string; values: number[]; unit?: string } }
/** Две меры на одном графике: столбцы — количество (левая ось), линия — доля (правая ось). */
export function ComboChart({ title, labels, bars, line }: ComboChartProps) {
  const m = useMounted(); const [h, setH] = useState<number | null>(null);
  const W = 720, H = 260, Pc = { l: 56, r: 56, t: 16, b: 28 }, n = labels.length, bt = ticks(0, Math.max(...bars.values)), lt = ticks(Math.min(...line.values), Math.max(...line.values), false);
  const bw = ((W - Pc.l - Pc.r) / n) * 0.56, cx = (i: number) => Pc.l + ((W - Pc.l - Pc.r) * (i + 0.5)) / n;
  const yb = (v: number) => Pc.t + (H - Pc.t - Pc.b) * (1 - v / bt.hi), yl = (v: number) => Pc.t + (H - Pc.t - Pc.b) * (1 - (v - lt.lo) / (lt.hi - lt.lo));
  const pts = line.values.map((v, i) => [cx(i), yl(v)] as [number, number]);
  return (
    <Card title={title}>
      <div className="vs-lg"><span><i style={{ background: 'var(--color-chart-series-2)' }} />{bars.name}</span><span><i style={{ background: 'var(--color-chart-series-3)', height: 3 }} />{line.name}</span></div>
      <div className="vs-dyn">
        <svg viewBox={`0 0 ${W} ${H}`} onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(), sx = ((e.clientX - r.left) / r.width) * W; setH(Math.max(0, Math.min(n - 1, Math.floor(((sx - Pc.l) / (W - Pc.l - Pc.r)) * n)))); }} onPointerLeave={() => setH(null)}>
          {bt.t.map((v) => <g key={v}><line x1={Pc.l} x2={W - Pc.r} y1={yb(v)} y2={yb(v)} className="g" /><text x={Pc.l - 8} y={yb(v) + 4} textAnchor="end" className="ax">{fmtShort(v)}</text></g>)}
          {lt.t.map((v) => <text key={v} x={W - Pc.r + 8} y={yl(v) + 4} className="ax">{fmt(v)}{line.unit}</text>)}
          {bars.values.map((v, i) => <rect key={i} x={cx(i) - bw / 2} width={bw} y={m ? yb(v) : H - Pc.b} height={m ? H - Pc.b - yb(v) : 0} rx={6} className={`br${h === i ? ' on' : ''}`} style={{ transitionDelay: `${i * 50}ms` }} />)}
          <path d={smoothPath(pts)} fill="none" stroke="var(--color-chart-series-3)" strokeWidth={2.5} className="ln" />
          {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={h === i ? 5 : 3.5} fill="var(--color-chart-series-3)" stroke="var(--color-bg-card)" strokeWidth={2} />)}
          {labels.map((l, i) => <text key={l} x={cx(i)} y={H - 6} textAnchor="middle" className="ax">{l}</text>)}
        </svg>
        {h != null && <ChartTip x={cx(h) / W}><b>{labels[h]}</b><span>{bars.name}: <b>{fmt(bars.values[h])}</b></span><span>{line.name}: <b>{fmt(line.values[h], 1)}{line.unit}</b></span></ChartTip>}
      </div>
    </Card>
  );
}

/* ---------- План и факт ---------- */
export interface PlanFactProps { title: string; labels: string[]; plan: number[]; fact: (number | null)[]; forecast?: number[]; unit?: string }
/** План пунктиром, факт сплошной, прогноз точками до конца периода. Сверху процент выполнения. */
export function PlanFact({ title, labels, plan, fact, forecast, unit = '' }: PlanFactProps) {
  const last = fact.reduce<number>((a, v, i) => (v != null ? i : a), 0), done = (fact[last]! / plan[last]) * 100, yearDone = forecast ? (forecast[forecast.length - 1] / plan[plan.length - 1]) * 100 : null;
  const W = 720, H = 240, n = labels.length, all = [...plan, ...(fact.filter((v) => v != null) as number[]), ...(forecast || [])], { hi, t } = ticks(0, Math.max(...all));
  const x = (i: number) => P.l + ((W - P.l - P.r) * i) / (n - 1), y = (v: number) => P.t + (H - P.t - P.b) * (1 - v / hi);
  const fp = fact.map((v, i) => (v != null ? [x(i), y(v)] : null)).filter(Boolean) as [number, number][];
  return (
    <Card title={title}>
      <div className="vs-pf"><div><b className="vs-num">{fmt(done)}%</b><span>плана выполнено на {labels[last]}</span></div>{yearDone != null && <div><b className="vs-num">{fmt(yearDone)}%</b><span>прогноз на конец года</span></div>}</div>
      <div className="vs-lg"><span><i style={{ background: 'var(--color-chart-series-1)' }} />Факт</span><span><i className="dash" />План</span>{forecast && <span><i className="dot" />Прогноз</span>}</div>
      <div className="vs-dyn"><svg viewBox={`0 0 ${W} ${H}`}>
        {t.map((v) => <g key={v}><line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} className="g" /><text x={W - P.r + 8} y={y(v) + 4} className="ax">{fmtShort(v)}{unit}</text></g>)}
        <path d={smoothPath(plan.map((v, i) => [x(i), y(v)]))} fill="none" stroke="var(--color-chart-series-3)" strokeWidth={2} strokeDasharray="6 6" />
        <path d={`${smoothPath(fp)} L${fp[fp.length - 1][0]},${H - P.b} L${fp[0][0]},${H - P.b} Z`} className="fa" />
        <path d={smoothPath(fp)} fill="none" stroke="var(--color-chart-series-1)" strokeWidth={2.5} className="ln" />
        {forecast && <path d={smoothPath(forecast.map((v, i) => [x(last + i), y(v)]))} fill="none" stroke="var(--color-chart-series-1)" strokeWidth={2.5} strokeDasharray="2 6" strokeLinecap="round" />}
        <circle cx={fp[fp.length - 1][0]} cy={fp[fp.length - 1][1]} r={5} fill="var(--color-chart-series-1)" stroke="var(--color-bg-card)" strokeWidth={2} />
        {labels.map((l, i) => <text key={l} x={x(i)} y={H - 6} textAnchor="middle" className="ax">{l}</text>)}
      </svg></div>
    </Card>
  );
}

/* ---------- Спарклайны в таблице ---------- */
export interface SparkRow { name: string; values: number[] }
/** Таблица со спарклайном в каждой строке: тренд, последнее значение, изменение. */
export function SparkTable({ title, rows, years, unit = '%' }: { title: string; rows: SparkRow[]; years: string[]; unit?: string }) {
  return (
    <Card title={title}>
      <div className="vs-spt">
        <div className="vs-spt__h"><span>Округ</span><span>{years[0]}–{years[years.length - 1]}</span><span>{years[years.length - 1]}</span><span>К {years[years.length - 2]}</span></div>
        {rows.map((r) => { const lo = Math.min(...r.values), hi = Math.max(...r.values), pts = r.values.map((v, i) => [2 + (i * 72) / (r.values.length - 1), 20 - ((v - lo) / (hi - lo || 1)) * 16] as [number, number]);
          return <div key={r.name} className="vs-spt__r"><span>{r.name}</span><svg viewBox="0 0 76 22" width="76" height="22"><path d={smoothPath(pts)} fill="none" stroke="var(--color-chart-series-1)" strokeWidth={1.75} /><circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={2.6} fill="var(--color-chart-series-1)" /></svg><b className="vs-num">{fmt(r.values[r.values.length - 1], 1)}{unit}</b><DeltaPill value={r.values[r.values.length - 1] - r.values[r.values.length - 2]} unit=" п.п." /></div>; })}
      </div>
    </Card>
  );
}
