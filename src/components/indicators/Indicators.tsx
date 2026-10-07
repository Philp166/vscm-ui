import { useMemo, useState } from 'react';
import { Card } from '../Card/Card';
import { Segment } from '../Segment/Segment';
import { DeltaPill } from '../DeltaPill/DeltaPill';
import { Icon } from '../foundation/Icon';
import { fmt, NB, smoothPath } from '../../utils/format';
import { useAnimatedNumber, useMounted } from '../../charts/chart';
import './indicators.css';

/* ---------- Герой-цифра ---------- */
export interface HeroYear { year: string; total: number; employed: number; vo: number; spo: number; voEmp: number; spoEmp: number }
export interface HeroNumberProps { label: string; unit?: string; data: HeroYear[] }
/** Главная цифра страницы уровня «Сводка». Одна на экран: табло-перекат, годы капсулами, ВО и СПО на стекле, тренд на всю ширину. */
export function HeroNumber({ label, unit = 'чел.', data }: HeroNumberProps) {
  const [i, setI] = useState(data.length - 1);
  const d = data[i], p = data[i - 1];
  const v = useAnimatedNumber(d.total, 900);
  const W = 1000, H = 120, lo = Math.min(...data.map((x) => x.total)) * 0.96, hi = Math.max(...data.map((x) => x.total));
  const pts = data.map((x, k) => [(k * W) / (data.length - 1), H - 10 - ((x.total - lo) / (hi - lo)) * (H - 30)] as [number, number]);
  const side = (name: string, val: number, prev: number | undefined, emp: number) => (
    <div className="vs-hero__side">
      <div className="vs-hero__sh"><span>{name}</span>{prev != null && <DeltaPill value={(val / prev - 1) * 100} />}</div>
      <b className="vs-num">{fmt(val)}</b>
      <div className="vs-hero__bar"><i style={{ width: `${emp}%` }} /></div>
      <span className="vs-hero__cap">Трудоустроено <b>{fmt(emp, 1)}%</b></span>
    </div>
  );
  return (
    <section className="vs-hero">
      <div className="vs-hero__main">
        <span className="vs-hero__l">{label}</span>
        <div className="vs-hero__v vs-num">{fmt(Math.round(v))}<small>{NB}{unit}</small></div>
        {p && <DeltaPill value={(d.total / p.total - 1) * 100} label={`к ${p.year} году`} />}
        <p className="vs-hero__say">Из них трудоустроено <b>{fmt(d.employed)}</b>{NB}человек, это <b>{fmt((d.employed / d.total) * 100, 1)}%</b>. Больше половины выпускников приходится на высшее образование: <b>{fmt((d.vo / d.total) * 100, 1)}%</b>.</p>
      </div>
      <div className="vs-hero__aside">
        <Segment size="sm" options={data.map((x) => x.year)} value={i} onChange={setI} />
        {side('Высшее образование', d.vo, p?.vo, d.voEmp)}
        {side('Среднее профессиональное', d.spo, p?.spo, d.spoEmp)}
      </div>
      <svg className="vs-hero__tr" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <path d={`${smoothPath(pts)} L${W},${H} L0,${H} Z`} className="a" /><path d={smoothPath(pts)} className="l" vectorEffect="non-scaling-stroke" />
      </svg>
    </section>
  );
}

/* ---------- Сводка с нормой ---------- */
export interface NormYear { year: string; graduates: number; employed: number }
export interface NormSummaryProps { title: string; norm: number; normBasis?: string; data: NormYear[] }
/** Ответ уровня «Сводка» за полминуты: сколько всего, сколько достигло, какая норма и сколько не хватает. */
export function NormSummary({ title, norm, normBasis = 'Норма установлена приказом (демо)', data }: NormSummaryProps) {
  const [i, setI] = useState(data.length - 1); const d = data[i];
  const share = (d.employed / d.graduates) * 100, need = Math.round(d.graduates * norm / 100), gap = need - d.employed;
  const g = useAnimatedNumber(d.graduates), e = useAnimatedNumber(d.employed), n = useAnimatedNumber(need);
  const W = 1000, H = 130, sh = data.map((x) => (x.employed / x.graduates) * 100), lo = Math.min(...sh, norm) - 3, hi = Math.max(...sh, norm) + 2;
  const x = (k: number) => 8 + (k * (W - 60)) / (data.length - 1), y = (v: number) => 10 + (H - 34) * (1 - (v - lo) / (hi - lo));
  const pts = sh.map((v, k) => [x(k), y(v)] as [number, number]);
  return (
    <Card title={title} info={normBasis} action={<div className="vs-step"><button disabled={i === 0} onClick={() => setI(i - 1)}><Icon name="chevron-left" size={18} /></button><b>{d.year}</b><button disabled={i === data.length - 1} onClick={() => setI(i + 1)}><Icon name="chevron-right" size={18} /></button></div>}>
      <div className="vs-norm">
        <div className="vs-norm__n"><span>Выпускники</span><b className="vs-num">{fmt(Math.round(g))}</b></div>
        <div className="vs-norm__n"><span>Трудоустроено</span><b className="vs-num">{fmt(Math.round(e))}</b><em>{fmt(share, 1)}% от выпускников</em></div>
        <div className="vs-norm__n"><span>Норма {norm}%</span><b className="vs-num">{fmt(Math.round(n))}</b></div>
      </div>
      <div className="vs-norm__bar"><i style={{ width: `${share}%` }} /><em style={{ left: `${norm}%` }}><span>норма</span></em></div>
      <p className="vs-norm__say">{gap > 0 ? <>До нормы не хватает <b>{fmt(gap)}</b> трудоустроенных выпускников, это <b>{fmt(norm - share, 1)} п.п.</b></> : <>Норма выполнена с запасом <b>{fmt(-gap)}</b> человек</>}</p>
      <svg className="vs-norm__tr" viewBox={`0 0 ${W} ${H}`}>
        <line x1={8} x2={W - 52} y1={y(norm)} y2={y(norm)} className="nl" /><text x={W - 48} y={y(norm) + 4} className="nt">норма</text>
        <path d={smoothPath(pts)} className="l" />
        {pts.map((pt, k) => <g key={k} onClick={() => setI(k)} style={{ cursor: 'pointer' }}><circle cx={pt[0]} cy={pt[1]} r={k === i ? 6 : 3.5} className={k === i ? 'pon' : 'p'} /><text x={pt[0]} y={H - 4} textAnchor="middle" className={k === i ? 'yt on' : 'yt'}>{data[k].year}</text></g>)}
      </svg>
    </Card>
  );
}

/* ---------- Доля кольцом и список по округам ---------- */
export interface ShareRingProps { title: string; value: number; average: number; target: number; items: { name: string; value: number }[] }
/** Доля кольцом с отметками среднего и цели, рядом список по округам с полосами. */
export function ShareRing({ title, value, average, target, items }: ShareRingProps) {
  const m = useMounted(); const R = 70, C = 2 * Math.PI * R;
  const sorted = useMemo(() => [...items].sort((a, b) => b.value - a.value), [items]);
  const mark = (p: number) => { const a = (p / 100) * 2 * Math.PI - Math.PI / 2; return [90 + Math.cos(a) * (R - 12), 90 + Math.sin(a) * (R - 12), 90 + Math.cos(a) * (R + 12), 90 + Math.sin(a) * (R + 12)]; };
  const [a1, a2, a3, a4] = mark(average), [t1, t2, t3, t4] = mark(target);
  return (
    <Card title={title}>
      <div className="vs-ring">
        <div className="vs-ring__c">
          <svg viewBox="0 0 180 180"><circle cx="90" cy="90" r={R} className="bg" /><circle cx="90" cy="90" r={R} className="fg" strokeDasharray={C} strokeDashoffset={m ? C * (1 - value / 100) : C} />
            <line x1={a1} y1={a2} x2={a3} y2={a4} className="avg" /><line x1={t1} y1={t2} x2={t3} y2={t4} className="tgt" /></svg>
          <div className="vs-ring__v"><b className="vs-num">{fmt(value, 1)}%</b><span>по стране</span></div>
          <div className="vs-ring__lg"><span><i className="avg" />Среднее {fmt(average, 1)}%</span><span><i className="tgt" />Цель {fmt(target)}%</span></div>
        </div>
        <div className="vs-ring__ls">{sorted.map((it) => <div key={it.name} className="vs-ring__r"><span>{it.name}</span><span className="t"><i style={{ width: m ? `${it.value}%` : 0 }} /><em style={{ left: `${target}%` }} /></span><b className="vs-num">{fmt(it.value, 1)}%</b></div>)}</div>
      </div>
    </Card>
  );
}
