import { useEffect, useRef, useState } from 'react';
import { Card } from '../Card/Card';
import { Segment } from '../Segment/Segment';
import { Button } from '../foundation/Controls';
import { Icon } from '../foundation/Icon';
import { useMounted } from '../../charts/chart';
import { fmt } from '../../utils/format';
import './compare.css';

export const LEVELS = ['Округа', 'Регионы', 'Города', 'Организации'] as const;
export interface CompareSelection { level: number; a: string; b: string }

/* ---------- Строка выбора и окно ---------- */
export interface ComparePickerProps { value: CompareSelection; options: Record<number, string[]>; onChange: (v: CompareSelection, applyAll: boolean) => void }
/** Строка выбора у блока: «Организации: МГУ против среднего по стране». По нажатию — окно: уровень, А, Б. В каждой колонке есть «Все…». */
export function ComparePicker({ value, options, onChange }: ComparePickerProps) {
  const [open, setOpen] = useState(false), [d, setD] = useState(value), [all, setAll] = useState(false); const ref = useRef<HTMLDivElement>(null);
  useEffect(() => setD(value), [value]);
  useEffect(() => { const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);
  const allName = (l: number) => `Все ${LEVELS[l].toLowerCase()}`, list = (l: number) => [allName(l), ...options[l]];
  const say = (v: CompareSelection) => v.a.startsWith('Все') ? `${LEVELS[v.level]}: рейтинг, все` : v.b.startsWith('Все') ? `${LEVELS[v.level]}: ${v.a} против среднего` : `${LEVELS[v.level]}: ${v.a} против ${v.b}`;
  return (
    <div className="vs-cmpp" ref={ref}>
      <button className="vs-cmpp__btn" onClick={() => setOpen(!open)}><Icon name="map-pin" size={16} /><span>{say(value)}</span><Icon name="chevron-down" size={16} /></button>
      {open && (
        <div className="vs-cmpp__pop">
          <Segment size="sm" options={[...LEVELS]} value={d.level} onChange={(l) => setD({ level: l, a: options[l][0], b: allName(l) })} />
          <div className="vs-cmpp__cols">
            {(['a', 'b'] as const).map((k) => <div key={k}><span className="h">{k === 'a' ? 'Объект А' : 'Объект Б'}</span><div className="ls">{list(d.level).map((o) => <button key={o} className={d[k] === o ? 'on' : ''} onClick={() => setD({ ...d, [k]: o })}>{o}</button>)}</div></div>)}
          </div>
          <label className="vs-cmpp__all"><input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} />Применить ко всем блокам</label>
          <div className="vs-cmpp__f"><Button size="sm" onClick={() => setOpen(false)}>Отмена</Button><Button variant="primary" size="sm" onClick={() => { onChange(d, all); setOpen(false); }}>Готово</Button></div>
        </div>
      )}
    </div>
  );
}

/* ---------- Показатели объектов: зеркало ---------- */
export interface MirrorMetric { name: string; a: number; b: number; unit?: string; digits?: number }
/** Зеркальное сравнение А и Б по показателям: полосы расходятся от центра, у лучшего — синий. */
export function MirrorCompare({ title, aName, bName, metrics, picker }: { title: string; aName: string; bName: string; metrics: MirrorMetric[]; picker?: React.ReactNode }) {
  const m = useMounted();
  return (
    <Card title={title} action={picker}>
      <div className="vs-mir">
        <div className="vs-mir__h"><b>{aName}</b><span /><b>{bName}</b></div>
        {metrics.map((x) => { const mx = Math.max(x.a, x.b) || 1, aw = (x.a / mx) * 100, bw = (x.b / mx) * 100;
          return <div key={x.name} className="vs-mir__r"><span className="v vs-num">{fmt(x.a, x.digits ?? 0)}{x.unit}</span><span className="t l"><i className={x.a >= x.b ? 'w' : ''} style={{ width: m ? `${aw}%` : 0 }} /></span><span className="n">{x.name}</span><span className="t r"><i className={x.b > x.a ? 'w' : ''} style={{ width: m ? `${bw}%` : 0 }} /></span><span className="v vs-num">{fmt(x.b, x.digits ?? 0)}{x.unit}</span></div>; })}
      </div>
    </Card>
  );
}

/* ---------- Выполнение норм ---------- */
export interface NormRow { name: string; norm: number; a: number; b: number; /** Норма «не более»: меньше — лучше */ max?: boolean }
/** Выполнение норм: для каждой нормы две полосы, А и Б, отметка нормы и вывод «выполнено / не хватает». */
export function NormCompare({ title, aName, bName, rows, picker }: { title: string; aName: string; bName: string; rows: NormRow[]; picker?: React.ReactNode }) {
  const m = useMounted();
  return (
    <Card title={title} action={picker}>
      <div className="vs-nc__lg"><span><i className="a" />{aName}</span><span><i className="b" />{bName}</span><span><i className="n" />Норма</span></div>
      <div className="vs-nc">{rows.map((r) => (
        <div key={r.name} className="vs-nc__g"><div className="vs-nc__t"><b>{r.name}</b><span>норма {r.max ? 'не более ' : ''}{fmt(r.norm)}%</span></div>
          {([['a', r.a, aName], ['b', r.b, bName]] as const).map(([k, v, nm]) => <div key={k} className="vs-nc__r"><span className={`bar ${k}`}><i style={{ width: m ? `${v}%` : 0 }} /><em style={{ left: `${r.norm}%` }} /></span>{(() => { const ok = r.max ? v <= r.norm : v >= r.norm; return <span className={`res${ok ? ' ok' : ''}`}>{fmt(v, 1)}% {ok ? 'выполнено' : r.max ? `выше нормы на ${fmt(v - r.norm, 1)} п.п.` : `не хватает ${fmt(r.norm - v, 1)} п.п.`}</span>; })()}</div>)}
        </div>))}</div>
    </Card>
  );
}

/* ---------- Разрыв по специальностям ---------- */
export interface GapRow { name: string; a: number; b: number }
/** Гантели: по каждой специальности две точки, А и Б, линия между ними — разрыв. Сортировка по разрыву. */
export function GapDumbbell({ title, aName, bName, rows, unit = '%', picker }: { title: string; aName: string; bName: string; rows: GapRow[]; unit?: string; picker?: React.ReactNode }) {
  const [sort, setSort] = useState(0); const m = useMounted();
  const order = [...rows].sort((x, y) => (sort ? Math.abs(y.a - y.b) - Math.abs(x.a - x.b) : y.a - x.a));
  const lo = Math.min(...rows.flatMap((r) => [r.a, r.b])) - 4, hi = Math.max(...rows.flatMap((r) => [r.a, r.b])) + 4, pos = (v: number) => ((v - lo) / (hi - lo)) * 100;
  return (
    <Card title={title} action={<>{picker}<Segment size="sm" options={['По А', 'По разрыву']} value={sort} onChange={setSort} /></>}>
      <div className="vs-nc__lg"><span><i className="a" />{aName}</span><span><i className="b" />{bName}</span></div>
      <div className="vs-gap">{order.map((r) => (
        <div key={r.name} className="vs-gap__r"><span className="n">{r.name}</span>
          <span className="t"><em style={{ left: `${pos(Math.min(r.a, r.b))}%`, width: m ? `${Math.abs(pos(r.a) - pos(r.b))}%` : 0 }} /><i className="b" style={{ left: `${pos(r.b)}%` }} /><i className="a" style={{ left: `${pos(r.a)}%` }} /></span>
          <span className={`d${r.a >= r.b ? ' up' : ' dn'}`}>{r.a >= r.b ? '+' : '−'}{fmt(Math.abs(r.a - r.b), 1)}{unit === '%' ? ' п.п.' : unit}</span></div>))}</div>
    </Card>
  );
}
