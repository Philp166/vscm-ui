import { useMemo, useState } from 'react';
import { Card } from '../Card/Card';
import { fmt } from '../../utils/format';
import './DataTable.css';

export interface Column<T> { key: keyof T & string; title: string; align?: 'left' | 'right'; render?: (row: T) => React.ReactNode; digits?: number; total?: boolean }
export interface DataTableProps<T> { title: string; columns: Column<T>[]; rows: T[]; maxHeight?: number; onExport?: () => void }

/** Базовая таблица: сортировка по заголовку, закреплённые шапка и первый столбец, поиск, итог по найденным. */
export function DataTable<T extends Record<string, unknown>>({ title, columns, rows, maxHeight = 460, onExport }: DataTableProps<T>) {
  const [sort, setSort] = useState<{ k: string; d: 1 | -1 }>({ k: columns[columns.length - 1].key, d: -1 });
  const [q, setQ] = useState('');
  const shown = useMemo(() => {
    const f = rows.filter((r) => columns.some((c) => typeof r[c.key] === 'string' && (r[c.key] as string).toLowerCase().includes(q.toLowerCase())));
    return f.sort((a, b) => { const x = a[sort.k], y = b[sort.k]; return typeof x === 'string' ? sort.d * (x as string).localeCompare(y as string, 'ru') : sort.d * ((x as number) - (y as number)); });
  }, [rows, columns, sort, q]);
  return (
    <Card title={title} action={onExport && <button className="vs-tbl__exp" onClick={onExport}>Выгрузить</button>} footer={<span>Показано {shown.length} из {rows.length}</span>}>
      <input className="vs-tbl__q" placeholder="Найти" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="vs-tbl__w" style={{ maxHeight }}>
        <table className="vs-tbl">
          <thead><tr>{columns.map((c) => <th key={c.key} className={c.align === 'left' ? 'l' : ''} onClick={() => setSort((s) => ({ k: c.key, d: s.k === c.key ? (s.d === 1 ? -1 : 1) : -1 }))}>{c.title}{sort.k === c.key ? (sort.d > 0 ? ' ↑' : ' ↓') : ''}</th>)}</tr></thead>
          <tbody>{shown.map((r, i) => <tr key={i}>{columns.map((c) => <td key={c.key} className={c.align === 'left' ? 'l' : ''}>{c.render ? c.render(r) : typeof r[c.key] === 'number' ? fmt(r[c.key] as number, c.digits ?? 0) : String(r[c.key])}</td>)}</tr>)}</tbody>
          <tfoot><tr>{columns.map((c, i) => <td key={c.key} className={c.align === 'left' ? 'l' : ''}>{i === 0 ? (q ? 'Итого по найденным' : 'Итого') : c.total ? fmt(shown.reduce((s, r) => s + (r[c.key] as number), 0)) : ''}</td>)}</tr></tfoot>
        </table>
      </div>
    </Card>
  );
}
