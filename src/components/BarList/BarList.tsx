import { useEffect, useState } from 'react';
import { Card } from '../Card/Card';
import { fmt, fmtShort } from '../../utils/format';
import './BarList.css';

/** Строка горизонтальных столбцов. `note` — серая приписка под названием. */
export interface BarItem { name: string; value: number; note?: string }
export interface BarListProps {
  /** Заголовок карточки. */
  title: string;
  /** Категории. Сортируются по убыванию автоматически. */
  items: BarItem[];
  /** Сколько строк показать до кнопки «Ещё N». */
  top?: number;
  /** Название выделенной строки: она синяя, остальные серые. */
  highlight?: string;
  /** Единица после значения. Если не задана вместе с `digits`, числа сокращаются: «812 тыс.». */
  unit?: string;
  /** Знаков после запятой. */
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
