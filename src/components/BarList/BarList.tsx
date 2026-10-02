import { useEffect, useState } from 'react';
import { Card } from '../Card/Card';
import { fmt, fmtShort } from '../../utils/format';
import './BarList.css';

export interface BarItem { name: string; value: number; note?: string }
export interface BarListProps {
  title: string;
  items: BarItem[];
  /** Сколько строк показать до «Ещё N» */
  top?: number;
  /** Выделенная строка: остальные серые */
  highlight?: string;
  unit?: string;
  digits?: number;
}

/** Горизонтальные столбцы: длинные названия, топ-N и «Ещё N», выделение одной категории синим. */
export function BarList({ title, items, top = 10, highlight, unit = '', digits = 0 }: BarListProps) {
  const [all, setAll] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = requestAnimationFrame(() => setReady(true)); return () => cancelAnimationFrame(t); }, []);
  const sorted = [...items].sort((a, b) => b.value - a.value), shown = all ? sorted : sorted.slice(0, top), mx = sorted[0]?.value || 1;
  return (
    <Card title={title}>
      <div className="vs-bars">
        {shown.map((it, i) => (
          <div key={it.name} className={`vs-bars__r${highlight ? (it.name === highlight ? ' hl' : ' dim') : ''}`}>
            <span className="vs-bars__n">{it.name}{it.note && <small>{it.note}</small>}</span>
            <span className="vs-bars__t"><i style={{ width: ready ? `${(it.value / mx) * 100}%` : 0, transitionDelay: `${i * 40}ms` }} /></span>
            <span className="vs-bars__v vs-num">{digits || unit ? fmt(it.value, digits) + unit : fmtShort(it.value)}</span>
          </div>
        ))}
        {sorted.length > top && <button className="vs-bars__more" onClick={() => setAll(!all)}>{all ? 'Свернуть' : `Ещё ${sorted.length - top}`}</button>}
      </div>
    </Card>
  );
}
