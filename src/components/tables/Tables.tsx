import { useMemo, useState } from 'react';
import { Card } from '../Card/Card';
import { Button } from '../foundation/Controls';
import { Icon } from '../foundation/Icon';
import { fmt } from '../../utils/format';
import './tables.css';

/* ---------- Группировка с подытогами ---------- */
export interface GroupRow { name: string; orgs: number; grads: number; employed: number }
export interface Group { name: string; rows: GroupRow[] }
/** Таблица с группами (округ → регионы): подытог в строке группы, раскрытие по одной или все сразу, итог по стране. */
export function GroupedTable({ title, groups }: { title: string; groups: Group[] }) {
  const [open, setOpen] = useState<string[]>([groups[0]?.name]);
  const sum = (rs: GroupRow[]) => rs.reduce((a, r) => ({ orgs: a.orgs + r.orgs, grads: a.grads + r.grads, employed: a.employed + r.employed }), { orgs: 0, grads: 0, employed: 0 });
  const total = sum(groups.flatMap((g) => g.rows)), all = open.length === groups.length;
  const cells = (r: { orgs: number; grads: number; employed: number }) => <><td>{fmt(r.orgs)}</td><td>{fmt(r.grads)}</td><td>{fmt(r.employed)}</td><td><span className="vs-gt__sh"><span className="tr"><i style={{ width: `${(r.employed / r.grads) * 100}%` }} /></span><b>{fmt((r.employed / r.grads) * 100, 1)}%</b></span></td></>;
  return (
    <Card title={title} action={<Button variant="ghost" size="sm" onClick={() => setOpen(all ? [] : groups.map((g) => g.name))}>{all ? 'Свернуть все' : 'Раскрыть все'}</Button>}>
      <div className="vs-gt__w"><table className="vs-gt">
        <thead><tr><th>Территория</th><th>Организаций</th><th>Выпускники</th><th>Трудоустроено</th><th>Доля</th></tr></thead>
        <tbody>{groups.map((g) => { const o = open.includes(g.name), s = sum(g.rows);
          return [<tr key={g.name} className={`grp${o ? ' open' : ''}`} onClick={() => setOpen(o ? open.filter((z) => z !== g.name) : [...open, g.name])}><td><span className="ch"><Icon name="chevron-down" size={14} /></span>{g.name}</td>{cells(s)}</tr>,
            ...(o ? g.rows.map((r) => <tr key={g.name + r.name} className="sub"><td>{r.name}</td>{cells(r)}</tr>) : [])]; })}</tbody>
        <tfoot><tr><td>Итого по стране</td>{cells(total)}</tr></tfoot>
      </table></div>
    </Card>
  );
}

/* ---------- Тепловая таблица ---------- */
export interface HeatTableProps { title: string; rows: { name: string; values: number[] }[]; cols: string[]; unit?: string }
/** Тепловая таблица регионы × годы: чем темнее, тем выше. Наведение подсвечивает строку и столбец. */
export function HeatTable({ title, rows, cols, unit = '' }: HeatTableProps) {
  const [h, setH] = useState<[number, number] | null>(null);
  const { lo, hi } = useMemo(() => { const all = rows.flatMap((r) => r.values); return { lo: Math.min(...all), hi: Math.max(...all) }; }, [rows]);
  const shade = (v: number) => { const t = (v - lo) / (hi - lo || 1); const c = ['#E1E5FD', '#C3CBFC', '#97A4FF', '#5266F4', '#1B2D83'][Math.min(4, Math.floor(t * 5))]; return { background: c, color: t > 0.55 ? '#fff' : 'var(--color-text-primary)' }; };
  return (
    <Card title={title} action={<span className="vs-ht__lg"><span>{fmt(lo, 1)}{unit}</span><i /><span>{fmt(hi, 1)}{unit}</span></span>}>
      <div className="vs-ht__w"><table className="vs-ht" onPointerLeave={() => setH(null)}>
        <thead><tr><th />{cols.map((c, ci) => <th key={c} className={h && h[1] === ci ? 'on' : ''}>{c}</th>)}</tr></thead>
        <tbody>{rows.map((r, ri) => <tr key={r.name}><th className={h && h[0] === ri ? 'on' : ''}>{r.name}</th>{r.values.map((v, ci) => <td key={ci} style={shade(v)} className={h && (h[0] === ri || h[1] === ci) ? (h[0] === ri && h[1] === ci ? 'cur' : 'ln') : h ? 'dim' : ''} onPointerEnter={() => setH([ri, ci])}>{fmt(v, 1)}</td>)}</tr>)}</tbody>
      </table></div>
    </Card>
  );
}
