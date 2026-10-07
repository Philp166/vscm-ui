import { useEffect, useMemo, useRef, useState } from 'react';
import { Segment } from '../Segment/Segment';
import { Icon } from '../foundation/Icon';
import { Card } from '../Card/Card';
import { fmt } from '../../utils/format';
import './DataTable.css';

export interface Column<T> { key: keyof T & string; title: string; align?: 'left' | 'right'; render?: (row: T) => React.ReactNode; digits?: number; total?: boolean }
export interface DataTableProps<T> { title: string; columns: Column<T>[]; rows: T[]; maxHeight?: number; onExport?: () => void }

/** Базовая таблица: сортировка по заголовку, закреплённые шапка и первый столбец, поиск, итог по найденным. */
export function DataTable<T extends Record<string, unknown>>({ title, columns, rows, maxHeight = 460, onExport }: DataTableProps<T>) {
  const [sort, setSort] = useState<{ k: string; d: 1 | -1 }>({ k: columns[columns.length - 1].key, d: -1 });
  const [q, setQ] = useState('');
  const [hidden, setHidden] = useState<string[]>([]), [dense, setDense] = useState(0), [colsOpen, setColsOpen] = useState(false);
  const pop = useRef<HTMLDivElement>(null);
  useEffect(() => { const h = (e: MouseEvent) => { if (!pop.current?.contains(e.target as Node)) setColsOpen(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);
  const cols = columns.filter((c, i) => i === 0 || !hidden.includes(c.key));
  const shown = useMemo(() => {
    const f = rows.filter((r) => columns.some((c) => typeof r[c.key] === 'string' && (r[c.key] as string).toLowerCase().includes(q.toLowerCase())));
    return f.sort((a, b) => { const x = a[sort.k], y = b[sort.k]; return typeof x === 'string' ? sort.d * (x as string).localeCompare(y as string, 'ru') : sort.d * ((x as number) - (y as number)); });
  }, [rows, columns, sort, q]);
  return (
    <Card title={title} action={onExport && <button className="vs-tbl__exp" onClick={onExport}>Выгрузить</button>} footer={<span>Показано {shown.length} из {rows.length}</span>}>
      <div className="vs-tbl__bar">
        <input className="vs-tbl__q" placeholder="Найти" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="vs-tbl__cols" ref={pop}><button onClick={() => setColsOpen(!colsOpen)}>Столбцы: {cols.length}<Icon name="chevron-down" size={16} /></button>
          {colsOpen && <div className="vs-tbl__pop">{columns.slice(1).map((c) => <label key={c.key}><input type="checkbox" checked={!hidden.includes(c.key)} onChange={() => setHidden(hidden.includes(c.key) ? hidden.filter((z) => z !== c.key) : [...hidden, c.key])} />{c.title}</label>)}</div>}</div>
        <Segment size="sm" options={['Обычно', 'Компактно']} value={dense} onChange={setDense} />
      </div>
      <div className="vs-tbl__w" style={{ maxHeight }}>
        <table className={`vs-tbl${dense ? ' dense' : ''}`}>
          <thead><tr>{cols.map((c) => <th key={c.key} className={c.align === 'left' ? 'l' : ''} onClick={() => setSort((s) => ({ k: c.key, d: s.k === c.key ? (s.d === 1 ? -1 : 1) : -1 }))}>{c.title}{sort.k === c.key ? (sort.d > 0 ? ' ↑' : ' ↓') : ''}</th>)}</tr></thead>
          <tbody>{shown.map((r, i) => <tr key={i}>{cols.map((c) => <td key={c.key} className={c.align === 'left' ? 'l' : ''}>{c.render ? c.render(r) : typeof r[c.key] === 'number' ? fmt(r[c.key] as number, c.digits ?? 0) : String(r[c.key])}</td>)}</tr>)}</tbody>
          <tfoot><tr>{cols.map((c, i) => <td key={c.key} className={c.align === 'left' ? 'l' : ''}>{i === 0 ? (q ? 'Итого по найденным' : 'Итого') : c.total ? fmt(shown.reduce((s, r) => s + (r[c.key] as number), 0)) : ''}</td>)}</tr></tfoot>
        </table>
      </div>
    </Card>
  );
}
