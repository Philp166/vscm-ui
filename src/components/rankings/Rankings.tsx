import { useMemo, useState } from 'react';
import { Card } from '../Card/Card';
import { SearchSelect } from '../SearchSelect/SearchSelect';
import { Icon } from '../foundation/Icon';
import { fmt } from '../../utils/format';
import './rankings.css';

/* ---------- Рейтинг по нескольким показателям ---------- */
export interface MultiItem { name: string; sub?: string; values: Record<string, number> }
export interface MultiMetric { key: string; name: string; short?: string }
/** Итоговое место — среднее место по показателям. Полосы и места по каждому: видно, за счёт чего объект высоко. Нажатие на заголовок пересортировывает. */
export function MultiRanking({ title, items, metrics, top = 12 }: { title: string; items: MultiItem[]; metrics: MultiMetric[]; top?: number }) {
  const [sk, setSk] = useState('sum'); const RH = 52;
  const ranks = useMemo(() => Object.fromEntries(metrics.map((m) => { const s = [...items].sort((a, b) => b.values[m.key] - a.values[m.key]); return [m.key, new Map(s.map((it, i) => [it, i + 1]))]; })), [items, metrics]);
  const score = (it: MultiItem) => metrics.reduce((a, m) => a + ranks[m.key].get(it)!, 0) / metrics.length;
  const ext = Object.fromEntries(metrics.map((m) => [m.key, [Math.min(...items.map((i) => i.values[m.key])), Math.max(...items.map((i) => i.values[m.key]))]]));
  const order = [...items].sort((a, b) => (sk === 'sum' ? score(a) - score(b) : b.values[sk] - a.values[sk])).slice(0, top);
  return (
    <Card title={title}>
      <div className="vs-mr__h"><span>Место</span><span>Вуз</span>{metrics.map((m) => <button key={m.key} className={sk === m.key ? 'on' : ''} onClick={() => setSk(m.key)}><span className="l">{m.name}</span><span className="s">{m.short || m.name}</span>{sk === m.key && <Icon name="arrow-down" size={14} />}</button>)}<button className={`sum${sk === 'sum' ? ' on' : ''}`} onClick={() => setSk('sum')}>Итог{sk === 'sum' && <Icon name="arrow-down" size={14} />}</button></div>
      <div className="vs-mr" style={{ height: order.length * RH }}>{items.map((it) => { const k = order.indexOf(it); if (k < 0) return null;
        return <div key={it.name} className="vs-mr__r" style={{ transform: `translateY(${k * RH}px)` }}><span className="p vs-num">{k + 1}</span><span className="n">{it.name}{it.sub && <small>{it.sub}</small>}</span>
          {metrics.map((m) => <span key={m.key} className={`c${sk === m.key ? ' on' : ''}`}><span className="t"><i style={{ width: `${8 + ((it.values[m.key] - ext[m.key][0]) / (ext[m.key][1] - ext[m.key][0] || 1)) * 92}%` }} /></span><b className="vs-num">{ranks[m.key].get(it)}</b></span>)}
          <span className="v vs-num">{fmt(score(it), 1)}</span></div>; })}</div>
    </Card>
  );
}

/* ---------- Место объекта ---------- */
/** «Где мы»: место крупно, фраза «лучше, чем X%», все объекты страны точками, медиана и зона топ-10%. */
export function PlaceStrip({ title, names, values, all, unit = '%' }: { title: string; names: string[]; values: number[]; all: number[]; unit?: string }) {
  const [i, setI] = useState(0); const v = values[i], sorted = [...all].sort((a, b) => b - a), n = all.length;
  const place = sorted.findIndex((x) => x <= v) + 1, med = sorted[Math.floor(n / 2)], t10 = sorted[Math.floor(n * 0.1)], better = Math.round((1 - place / n) * 100);
  const lo = Math.min(...all) - 1, hi = Math.max(...all) + 1, W = 760, x = (a: number) => 20 + ((a - lo) / (hi - lo)) * (W - 40);
  const jit = useMemo(() => all.map((_, k) => ((k * 9301 + 49297) % 233280) / 233280), [all]);
  return (
    <Card title={title} action={<SearchSelect options={names} value={i} onChange={setI} placeholder="Найти вуз" />}>
      <div className="vs-pl">
        <div><div className="vs-pl__big vs-num">{place}-е<small>из {n}</small></div><p className="vs-pl__say">{names[i]} лучше, чем <b>{better}%</b> вузов страны. {v >= t10 ? 'Входит в топ-10%.' : v >= med ? 'Выше медианы.' : 'Ниже медианы.'} Значение <b>{fmt(v, 1)}{unit}</b>, медиана {fmt(med, 1)}{unit}.</p></div>
        <svg viewBox={`0 0 ${W} 150`}>
          <rect x={x(t10)} y={28} width={W - 20 - x(t10)} height={94} rx={10} className="z" /><text x={W - 20} y={20} textAnchor="end" className="zl">топ-10%</text>
          {all.map((a, k) => <circle key={k} cx={x(a)} cy={40 + jit[k] * 70} r={3} className="d" />)}
          <line x1={x(med)} x2={x(med)} y1={28} y2={122} className="m" /><text x={x(med)} y={20} textAnchor="middle" className="ml">медиана {fmt(med, 1)}{unit}</text>
          <g style={{ transform: `translateX(${x(v)}px)`, transition: 'transform .7s cubic-bezier(.22,.8,.2,1)' }}><line x1={0} x2={0} y1={30} y2={130} className="s" /><circle cx={0} cy={80} r={9} className="sd" /><text y={146} textAnchor="middle" className="sl">{fmt(v, 1)}{unit}</text></g>
        </svg>
      </div>
    </Card>
  );
}
