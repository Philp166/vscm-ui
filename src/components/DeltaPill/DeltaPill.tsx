import { fmt } from '../../utils/format';
import './DeltaPill.css';

export interface DeltaPillProps {
  /** Изменение: плюс — рост, минус — падение */
  value: number;
  /** Единица после числа, например « п.п.» или «%» */
  unit?: string;
  digits?: number;
  /** Подпись справа, например «к 2023 году» */
  label?: string;
}

/** Метка динамики. Зелёный и красный в ките только здесь. */
export function DeltaPill({ value, unit = '%', digits = 1, label }: DeltaPillProps) {
  const dir = value > 0 ? 'up' : value < 0 ? 'down' : 'eq';
  return (
    <span className="vs-delta">
      <span className={`vs-delta__p vs-delta__p--${dir}`}>
        {dir === 'up' ? '↑' : dir === 'down' ? '↓' : '='} {fmt(Math.abs(value), digits)}{unit}
      </span>
      {label && <span className="vs-delta__l">{label}</span>}
    </span>
  );
}
