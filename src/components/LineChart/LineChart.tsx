import { useMemo, useState } from 'react';
import { Card } from '../Card/Card';
import { Segment } from '../Segment/Segment';
import { fmtShort, fmt, smoothPath } from '../../utils/format';
import './LineChart.css';

export interface LineSeries { name: string; values: number[] }
export interface LineChartProps {
  title: string;
  /** Подписи по оси X */
  labels: string[];
  series: LineSeries[];
  /** Линия нормы пунктиром */
  norm?: { value: number; label: string };
  /** Периоды: сколько последних точек показать, например {"Год":12,"3 года":36} */
  periods?: Record<string, number>;
  height?: number;
}

const COLORS = ['var(--color-chart-series-1)', 'var(--color-chart-series-2)', 'var(--color-chart-series-3)', 'var(--color-chart-series-4)'];

/** Линейный график по правилам кита: без вертикальной оси, 3–5 линий сетки, плавные линии, линейка и подсказка при наведении, кликабельная легенда. */
export function LineChart({ title, labels, series, norm, periods, height = 260 }: LineChartProps) {
  const pk = periods ? Object.keys(periods) : [];
  const [pi, setPi] = useState(Math.max(0, pk.length - 1));
  const [off, setOff] = useState<string[]>([]);
  const [hover, setHover] = useState<number | null>(null);
  const n = periods ? Math.min(labels.length, periods[pk[pi]]) : labels.length;
  const L = labels.slice(-n), S = series.map((s) => ({ ...s, values: s.values.slice(-n) }));
  const vis = S.filter((s) => !off.includes(s.name));
  const W = 720, H = height, P = { l: 8, r: 56, t: 16, b: 28 };
  const { lo, hi, ticks } = useMemo(() => {
    const all = vis.flatMap((s) => s.values).concat(norm ? [norm.value] : []);
    let lo = Math.min(...all), hi = Math.max(...all); const pad = (hi - lo) * 0.12 || 1; lo -= pad; hi += pad;
    const step = niceStep((hi - lo) / 4), t0 = Math.ceil(lo / step) * step; const ticks: number[] = [];
    for (let v = t0; v <= hi; v += step) ticks.push(v);
    return { lo, hi, ticks };
  }, [vis, norm]);
  const x = (i: number) => P.l + ((W - P.l - P.r) * i) / Math.max(1, L.length - 1);
  const y = (v: number) => P.t + (H - P.t - P.b) * (1 - (v - lo) / (hi - lo));
  return (
    <Card title={title} action={periods && <Segment size="sm" options={pk} value={pi} onChange={setPi} />}>
      {series.length > 1 && (
        <div className="vs-line__lg">
          {series.map((s, i) => (
            <button key={s.name} className={off.includes(s.name) ? 'off' : ''} onClick={() => setOff((o) => (o.includes(s.name) ? o.filter((z) => z !== s.name) : [...o, s.name]))}>
              <i style={{ background: COLORS[i] }} />{s.name}
            </button>
          ))}
        </div>
      )}
      <div className="vs-line">
        <svg viewBox={`0 0 ${W} ${H}`} onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const sx = ((e.clientX - r.left) / r.width) * W; setHover(Math.max(0, Math.min(L.length - 1, Math.round(((sx - P.l) / (W - P.l - P.r)) * (L.length - 1))))); }} onPointerLeave={() => setHover(null)}>
          {ticks.map((t) => <g key={t}><line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} className="vs-line__grid" /><text x={W - P.r + 8} y={y(t) + 4} className="vs-line__ax">{fmtShort(t)}</text></g>)}
          {norm && <g><line x1={P.l} x2={W - P.r} y1={y(norm.value)} y2={y(norm.value)} className="vs-line__norm" /><text x={W - P.r} y={y(norm.value) - 6} textAnchor="end" className="vs-line__nl">{norm.label}</text></g>}
          {S.map((s, si) => { if (off.includes(s.name)) return null; const pts = s.values.map((v, i) => [x(i), y(v)] as [number, number]);
            return <g key={s.name}>{si === 0 && <path d={`${smoothPath(pts)} L${x(L.length - 1)},${H - P.b} L${x(0)},${H - P.b} Z`} className="vs-line__area" />}
              <path d={smoothPath(pts)} fill="none" stroke={COLORS[si]} strokeWidth={2.5} strokeLinecap="round" className="vs-line__path" />
              <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={4} fill={COLORS[si]} stroke="var(--color-bg-card)" strokeWidth={2} /></g>; })}
          {L.map((l, i) => (L.length <= 12 || i % Math.ceil(L.length / 12) === 0) && <text key={l + i} x={x(i)} y={H - 6} textAnchor="middle" className="vs-line__ax">{l}</text>)}
          {hover != null && <g><line x1={x(hover)} x2={x(hover)} y1={P.t} y2={H - P.b} className="vs-line__ruler" />{vis.map((s) => { const si = series.findIndex((z) => z.name === s.name); return <circle key={s.name} cx={x(hover)} cy={y(s.values[hover])} r={4.5} fill={COLORS[si]} stroke="var(--color-bg-card)" strokeWidth={2} />; })}</g>}
        </svg>
        {hover != null && (
          <div className="vs-line__tip" style={{ left: `${(x(hover) / W) * 100}%` }}>
            <b>{L[hover]}</b>
            {vis.map((s) => <span key={s.name}>{s.name}: <b className="vs-num">{fmt(s.values[hover], s.values[hover] % 1 ? 1 : 0)}</b></span>)}
          </div>
        )}
      </div>
    </Card>
  );
}
function niceStep(raw: number) { const p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p; }
