import { useMemo, useState } from 'react';
import { Card } from '../Card/Card';
import { Segment } from '../Segment/Segment';
import { SearchSelect } from '../SearchSelect/SearchSelect';
import { fmt } from '../../utils/format';
import './RankingList.css';

export interface RankItem { name: string; sub?: string; byYear: Record<string, number> }
export interface RankingListProps {
  title: string;
  items: RankItem[];
  years: string[];
  /** Сколько строк в топе */
  top?: number;
  unit?: string;
  /** Индекс «своего» объекта: закреплён внизу, если вне топа */
  pinned?: number;
}
const RH = 52;

/** Рейтинг с движением мест: строки переезжают при смене года, стрелки изменения места, свой объект всегда виден. */
export function RankingList({ title, items, years, top = 10, unit = '%', pinned }: RankingListProps) {
  const [yi, setYi] = useState(years.length - 1);
  const [pin, setPin] = useState(pinned);
  const Y = years[yi], PY = years[yi - 1];
  const order = useMemo(() => [...items].sort((a, b) => b.byYear[Y] - a.byYear[Y]), [items, Y]);
  const prev = useMemo(() => (PY ? [...items].sort((a, b) => b.byYear[PY] - a.byYear[PY]) : null), [items, PY]);
  const me = pin != null ? items[pin] : null, mi = me ? order.indexOf(me) : -1;
  const show = mi >= top ? [...order.slice(0, top), me!] : order.slice(0, top);
  const mx = order[0].byYear[Y], mn = order[order.length - 1].byYear[Y] * 0.95;
  return (
    <Card title={title} action={<>{pin != null && <SearchSelect options={items.map((i) => i.name)} value={pin} onChange={setPin} prefix="Ваш вуз:" placeholder="Найти вуз" />}<Segment size="sm" options={years} value={yi} onChange={setYi} /></>}>
      <div className="vs-rank" style={{ height: show.length * RH + (mi >= top ? 24 : 0) }}>
        {items.map((it) => {
          const k = show.indexOf(it); if (k < 0) return null;
          const place = order.indexOf(it) + 1, pp = prev ? prev.indexOf(it) + 1 : null, d = pp ? pp - place : 0;
          return (
            <div key={it.name} className={`vs-rank__r${it === me ? ' me' : ''}`} style={{ transform: `translateY(${k === top ? top * RH + 24 : k * RH}px)` }}>
              <span className="vs-rank__p vs-num">{place}</span>
              <span className="vs-rank__n">{it.name}{it.sub && <small>{it.sub}</small>}</span>
              <span className="vs-rank__t"><i style={{ width: `${10 + ((it.byYear[Y] - mn) / (mx - mn)) * 90}%` }} /></span>
              <span className="vs-rank__v vs-num">{fmt(it.byYear[Y], 1)}{unit}</span>
              <span className={`vs-rank__d ${!pp || !d ? 'eq' : d > 0 ? 'up' : 'dn'}`}>{!pp ? '—' : d > 0 ? `↑${d}` : d < 0 ? `↓${-d}` : '0'}</span>
            </div>
          );
        })}
        {mi >= top && <div className="vs-rank__gap" style={{ top: top * RH }}>...</div>}
      </div>
    </Card>
  );
}
