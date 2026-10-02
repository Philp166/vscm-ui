import { Card } from '../Card/Card';
import { DeltaPill } from '../DeltaPill/DeltaPill';
import { fmt } from '../../utils/format';
import './ShareBar.css';

export interface ShareBarProps {
  title: string;
  /** Доля, % */
  value: number;
  /** Среднее по стране, % */
  average?: number;
  /** Цель или норма, % */
  target?: number;
  delta?: number;
}

/** Показатель-доля: полоса с отметками среднего и цели, вывод словами под полосой. */
export function ShareBar({ title, value, average, target, delta }: ShareBarProps) {
  const vsAvg = average != null ? value - average : null, toTarget = target != null ? target - value : null;
  return (
    <Card title={title}>
      <div className="vs-share">
        <div className="vs-share__top"><span className="vs-share__v vs-num">{fmt(value, 1)}%</span>{delta != null && <DeltaPill value={delta} unit=" п.п." />}</div>
        <div className="vs-share__bar">
          <i style={{ width: `${Math.min(100, value)}%` }} />
          {average != null && <em className="avg" style={{ left: `${average}%` }}><span>Среднее {fmt(average, 1)}%</span></em>}
          {target != null && <em className="tgt" style={{ left: `${target}%` }}><span>Цель {fmt(target, 0)}%</span></em>}
        </div>
        <p className="vs-share__say">
          {vsAvg != null && <>{vsAvg >= 0 ? 'Выше' : 'Ниже'} среднего на <b>{fmt(Math.abs(vsAvg), 1)} п.п.</b></>}
          {toTarget != null && (toTarget > 0 ? <>, до цели <b>{fmt(toTarget, 1)} п.п.</b></> : <>, цель достигнута</>)}
        </p>
      </div>
    </Card>
  );
}
