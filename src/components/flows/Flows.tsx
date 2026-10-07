import { useState } from 'react';
import { Card } from '../Card/Card';
import { Segment } from '../Segment/Segment';
import { SearchSelect } from '../SearchSelect/SearchSelect';
import { useMounted } from '../../charts/chart';
import { fmt } from '../../utils/format';
import './flows.css';

/* ---------- Воронка пути ---------- */
export interface FunnelStep { name: string; sub: string; value: number }
/** Путь выпускника: заявления → зачисление → выпуск → трудоустройство. Процент перехода и самая большая потеря словами. */
export function Funnel({ title, levels }: { title: string; levels: Record<string, FunnelStep[]> }) {
  const keys = Object.keys(levels); const [k, setK] = useState(0); const m = useMounted(); const steps = levels[keys[k]], mx = steps[0].value;
  const conv = steps.slice(1).map((s, i) => s.value / steps[i].value), worst = conv.indexOf(Math.min(...conv));
  return (
    <Card title={title} action={<Segment size="sm" options={keys} value={k} onChange={setK} />}>
      <div className="vs-fun">{steps.map((s, i) => <div key={s.name}>
        {i > 0 && <div className={`vs-fun__cv${i - 1 === worst ? ' w' : ''}`}>↓ переходят {fmt(conv[i - 1] * 100, 1)}%{i - 1 === worst && ' — здесь самая большая потеря'}</div>}
        <div className="vs-fun__r"><span className="n">{s.name}<small>{s.sub}</small></span><span className="t"><i style={{ width: m ? `${(s.value / mx) * 100}%` : 0, opacity: 1 - i * 0.18 }} /></span><b className="vs-num">{fmt(s.value)}</b></div></div>)}</div>
      <p className="vs-fun__say">Больше всего людей теряется между ступенями «{steps[worst].name}» и «{steps[worst + 1].name}»: <b>{fmt(steps[worst].value - steps[worst + 1].value)}</b> человек, это {fmt((1 - conv[worst]) * 100, 1)}%.</p>
    </Card>
  );
}

/* ---------- Куда уезжают ---------- */
export interface Destinations { region: string; graduates: number; stay: number; top: { name: string; share: number }[] }
/** Где работают выпускники вузов региона: остались дома, главные направления, остальные. Один регион за раз. */
export function DestinationBars({ title, data }: { title: string; data: Destinations[] }) {
  const [i, setI] = useState(0); const m = useMounted(); const d = data[i], other = 1 - d.stay - d.top.reduce((a, b) => a + b.share, 0);
  const rows: [string, number, number][] = [['Остались в регионе', d.stay, 1], ...d.top.map((t) => [t.name, t.share, 0] as [string, number, number]), ['Другие регионы', other, 2]], mx = Math.max(...rows.map((r) => r[1]));
  return (
    <Card title={title} action={<SearchSelect options={data.map((x) => x.region)} value={i} onChange={setI} placeholder="Найти регион" />}>
      <p className="vs-dst__say">Остаются в регионе <b>{fmt(d.stay * 100)}%</b>. Главное направление — <b>{d.top[0].name}</b>, {fmt(d.top[0].share * 100, 1)}%.</p>
      <div className="vs-dst">{rows.map(([n, v, k], ri) => <div key={n} className={`vs-dst__r${k === 1 ? ' st' : k === 2 ? ' ot' : ''}`}><span className="n">{n}</span><span className="t"><i style={{ width: m ? `${(v / mx) * 100}%` : 0, transitionDelay: `${ri * 60}ms` }} /></span><b className="vs-num">{fmt(v * 100, 1)}%</b><span className="c vs-num">{fmt(Math.round((d.graduates * v) / 100) * 100)} чел.</span></div>)}</div>
    </Card>
  );
}

/* ---------- Баланс региона ---------- */
export interface Balance { region: string; graduates: number; stayed: number; left: number; came: number }
/** Сколько выпускников регион притягивает и сколько теряет. Итог одной фразой. */
export function RegionBalance({ title, data }: { title: string; data: Balance[] }) {
  const [i, setI] = useState(0); const m = useMounted(); const d = data[i], net = d.came - d.left;
  const rows: [string, number][] = [['Выпустили вузы', d.graduates], ['Остались работать', d.stayed], ['Уехали работать', d.left], ['Приехали работать', d.came]];
  return (
    <Card title={title} action={<SearchSelect options={data.map((x) => x.region)} value={i} onChange={setI} placeholder="Найти регион" />}>
      <div className="vs-bal">
        <div className="vs-bal__say"><b>{d.region} {net >= 0 ? 'притягивает' : 'теряет'} выпускников: {net >= 0 ? '+' : '−'}{fmt(Math.abs(net))}</b><span>Остаются работать {fmt((d.stayed / d.graduates) * 100)}% выпускников. Приезжает {fmt(d.came)}, уезжает {fmt(d.left)}.</span></div>
        <div className="vs-bal__rows">{rows.map(([n, v], ri) => <div key={n} className={`vs-bal__r k${ri}`}><span className="n">{n}</span><span className="t"><i style={{ width: m ? `${(v / d.graduates) * 100}%` : 0 }} /></span><b className="vs-num">{fmt(v)}</b></div>)}
          <div className="vs-bal__r tot"><span className="n">Итог</span><span /><b className="vs-num">{net >= 0 ? '+' : '−'}{fmt(Math.abs(net))}</b></div></div>
      </div>
    </Card>
  );
}
