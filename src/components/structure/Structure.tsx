import { useState } from 'react';
import { Card } from '../Card/Card';
import { Segment } from '../Segment/Segment';
import { Button } from '../foundation/Controls';
import { Icon } from '../foundation/Icon';
import { ChartTip } from '../../charts/ChartTip';
import { SERIES, ticks, useMounted } from '../../charts/chart';
import { fmt, fmtShort } from '../../utils/format';
import './structure.css';

/* ---------- Вертикальные столбцы ---------- */
export interface ColumnChartProps { title: string; items: { name: string; value: number }[]; total?: string }
/** Вертикальные столбцы: нажатие выделяет категорию, сортировка с анимацией переезда. */
export function ColumnChart({ title, items, total }: ColumnChartProps) {
  const m = useMounted(); const [sort, setSort] = useState(0); const [sel, setSel] = useState<string | null>(null); const [h, setH] = useState<number | null>(null);
  const order = sort ? [...items].sort((a, b) => b.value - a.value) : items;
  const W = 720, H = 260, Pc = { l: 8, r: 56, t: 16, b: 40 }, n = items.length, { hi, t } = ticks(0, Math.max(...items.map((i) => i.value)));
  const slot = (W - Pc.l - Pc.r) / n, bw = slot * 0.6, y = (v: number) => Pc.t + (H - Pc.t - Pc.b) * (1 - v / hi);
  return (
    <Card title={title} action={<Segment size="sm" options={['Как есть', 'По убыванию']} value={sort} onChange={setSort} />}>
      {total && <div className="vs-tot">{total}</div>}
      <div className="vs-st"><svg viewBox={`0 0 ${W} ${H}`}>
        {t.map((v) => <g key={v}><line x1={Pc.l} x2={W - Pc.r} y1={y(v)} y2={y(v)} className="g" /><text x={W - Pc.r + 8} y={y(v) + 4} className="ax">{fmtShort(v)}</text></g>)}
        {items.map((it) => { const k = order.indexOf(it), cx = Pc.l + slot * (k + 0.5); const dim = sel && sel !== it.name;
          return <g key={it.name} style={{ transform: `translateX(${cx}px)`, transition: 'transform .7s cubic-bezier(.22,.8,.2,1)' }} onClick={() => setSel(sel === it.name ? null : it.name)} onPointerEnter={() => setH(items.indexOf(it))} onPointerLeave={() => setH(null)} className="col">
            <rect x={-bw / 2} width={bw} y={m ? y(it.value) : H - Pc.b} height={m ? H - Pc.b - y(it.value) : 0} rx={6} className={`b${dim ? ' dim' : ''}`} />
            <text y={H - 22} textAnchor="middle" className="ax">{it.name.length > 11 ? it.name.slice(0, 10) + '…' : it.name}</text></g>; })}
      </svg>{h != null && <ChartTip x={(Pc.l + slot * (order.indexOf(items[h]) + 0.5)) / W} y={20}><b>{items[h].name}</b><span>{fmt(items[h].value)}</span></ChartTip>}</div>
    </Card>
  );
}

/* ---------- Стековые столбцы ---------- */
export interface StackedProps { title: string; labels: string[]; series: { name: string; values: number[] }[] }
/** Стековые столбцы: наведение подсвечивает слой во всех столбцах, числа / доли. */
export function StackedColumns({ title, labels, series }: StackedProps) {
  const m = useMounted(); const [mode, setMode] = useState(0); const [hs, setHs] = useState<number | null>(null);
  const tot = labels.map((_, i) => series.reduce((s, z) => s + z.values[i], 0)), v = (si: number, i: number) => (mode ? (series[si].values[i] / tot[i]) * 100 : series[si].values[i]);
  const W = 720, H = 260, Pc = { l: 8, r: 56, t: 16, b: 32 }, n = labels.length, { hi, t } = ticks(0, mode ? 100 : Math.max(...tot));
  const slot = (W - Pc.l - Pc.r) / n, bw = Math.min(64, slot * 0.55), y = (val: number) => Pc.t + (H - Pc.t - Pc.b) * (1 - val / hi);
  return (
    <Card title={title} action={<Segment size="sm" options={['Числа', 'Доли']} value={mode} onChange={setMode} />}>
      <div className="vs-lg2">{series.map((s, i) => <span key={s.name} onPointerEnter={() => setHs(i)} onPointerLeave={() => setHs(null)} className={hs != null && hs !== i ? 'dim' : ''}><i style={{ background: SERIES[i] }} />{s.name}</span>)}</div>
      <div className="vs-st"><svg viewBox={`0 0 ${W} ${H}`}>
        {t.map((val) => <g key={val}><line x1={Pc.l} x2={W - Pc.r} y1={y(val)} y2={y(val)} className="g" /><text x={W - Pc.r + 8} y={y(val) + 4} className="ax">{mode ? fmt(val) + '%' : fmtShort(val)}</text></g>)}
        {labels.map((l, i) => { let acc = 0; const cx = Pc.l + slot * (i + 0.5);
          return <g key={l}>{series.map((s, si) => { const a = acc; acc += v(si, i); const y0 = y(a), y1 = y(acc);
            return <rect key={s.name} x={cx - bw / 2} width={bw} y={m ? y1 : H - Pc.b} height={m ? Math.max(0, y0 - y1 - 1) : 0} fill={SERIES[si]} className={`sg${hs != null && hs !== si ? ' dim' : ''}`} onPointerEnter={() => setHs(si)} onPointerLeave={() => setHs(null)} rx={si === series.length - 1 ? 6 : 0} />; })}
            <text x={cx} y={H - 8} textAnchor="middle" className="ax">{l}</text></g>; })}
      </svg></div>
    </Card>
  );
}

/* ---------- Полосы 100% ---------- */
export interface Bar100Props { title: string; rows: { name: string; parts: number[] }[]; parts: string[] }
/** Полосы 100%: как меняется структура по годам или по округам. */
export function Bar100({ title, rows, parts }: Bar100Props) {
  const m = useMounted();
  return (
    <Card title={title}>
      <div className="vs-lg2">{parts.map((p, i) => <span key={p}><i style={{ background: [SERIES[2], SERIES[0], SERIES[1]][i] }} />{p}</span>)}</div>
      <div className="vs-b100">{rows.map((r) => { const tot = r.parts.reduce((a, b) => a + b, 0);
        return <div key={r.name} className="vs-b100__r"><span>{r.name}</span><div className="t">{r.parts.map((p, i) => <i key={i} style={{ width: m ? `${(p / tot) * 100}%` : 0, background: [SERIES[2], SERIES[0], SERIES[1]][i] }}>{(p / tot) * 100 > 9 && <em>{fmt((p / tot) * 100, 1)}%</em>}</i>)}</div></div>; })}</div>
    </Card>
  );
}

/* ---------- Раскрывающиеся столбцы ---------- */
export interface ExpandItem { name: string; value: number; children?: { name: string; value: number }[] }
/** Категории с подкатегориями: строка раскрывается, полоса делится на части. Замена тримапа. */
export function ExpandBars({ title, items, unit = '' }: { title: string; items: ExpandItem[]; unit?: string }) {
  const m = useMounted(); const [open, setOpen] = useState<string[]>([]); const mx = Math.max(...items.map((i) => i.value)), tot = items.reduce((a, b) => a + b.value, 0);
  const all = open.length === items.length;
  return (
    <Card title={title} action={<Button variant="ghost" size="sm" onClick={() => setOpen(all ? [] : items.map((i) => i.name))}>{all ? 'Свернуть все' : 'Раскрыть все'}</Button>}>
      <div className="vs-exp">{items.map((it) => { const o = open.includes(it.name);
        return <div key={it.name} className={`vs-exp__g${o ? ' open' : ''}`}>
          <button className="vs-exp__r" onClick={() => setOpen(o ? open.filter((z) => z !== it.name) : [...open, it.name])}><span className="ch"><Icon name="chevron-down" size={14} /></span><span className="nm">{it.name}</span>
            <span className="t">{o && it.children ? it.children.map((c, ci) => <i key={c.name} style={{ width: `${(c.value / mx) * 100}%`, background: SERIES[ci % 3] }} />) : <i style={{ width: m ? `${(it.value / mx) * 100}%` : 0 }} />}</span>
            <b className="vs-num">{fmtShort(it.value)}{unit}</b><span className="p">{fmt((it.value / tot) * 100, 1)}%</span></button>
          {o && it.children && <div className="vs-exp__c">{it.children.map((c, ci) => <div key={c.name} className="vs-exp__cr"><span className="nm"><i style={{ background: SERIES[ci % 3] }} />{c.name}</span><span className="t"><i style={{ width: `${(c.value / mx) * 100}%`, background: SERIES[ci % 3] }} /></span><b className="vs-num">{fmtShort(c.value)}{unit}</b><span className="p">{fmt((c.value / it.value) * 100, 1)}%</span></div>)}</div>}
        </div>; })}</div>
    </Card>
  );
}

/* ---------- Бублик ---------- */
export interface DonutProps { title: string; parts: { name: string; value: number }[]; centerLabel?: string }
/** Бублик только для 2–4 долей: в центре итог, при наведении — выбранная доля. */
export function Donut({ title, parts, centerLabel = 'всего' }: DonutProps) {
  const m = useMounted(); const [h, setH] = useState<number | null>(null); const tot = parts.reduce((a, b) => a + b.value, 0), R = 70, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <Card title={title}>
      <div className="vs-don">
        <div className="vs-don__c"><svg viewBox="0 0 180 180">{parts.map((p, i) => { const len = (p.value / tot) * C, off = acc; acc += len;
          return <circle key={p.name} cx="90" cy="90" r={R} fill="none" stroke={SERIES[i]} strokeWidth={h === i ? 26 : 20} strokeDasharray={`${m ? Math.max(0, len - 3) : 0} ${C}`} strokeDashoffset={-off} transform="rotate(-90 90 90)" className="seg" onPointerEnter={() => setH(i)} onPointerLeave={() => setH(null)} />; })}</svg>
          <div className="vs-don__v"><b className="vs-num">{h == null ? fmtShort(tot) : fmt((parts[h].value / tot) * 100, 1) + '%'}</b><span>{h == null ? centerLabel : parts[h].name}</span></div></div>
        <div className="vs-don__ls">{parts.map((p, i) => <div key={p.name} className={h != null && h !== i ? 'dim' : ''} onPointerEnter={() => setH(i)} onPointerLeave={() => setH(null)}><i style={{ background: SERIES[i] }} /><span>{p.name}</span><b className="vs-num">{fmt(p.value)}</b><em>{fmt((p.value / tot) * 100, 1)}%</em></div>)}</div>
      </div>
    </Card>
  );
}
