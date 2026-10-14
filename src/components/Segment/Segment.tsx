import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Segment.css';

export interface SegmentProps {
  /** Подписи вариантов, 2–5 коротких слов. */
  options: string[];
  /** Индекс выбранного варианта. Компонент управляемый: значение хранит родитель. */
  value: number;
  /** Вызывается с индексом нажатого варианта. */
  onChange?: (index: number) => void;
  /** Размер: `md` — уровни раздела, `sm` — в шапках карточек. */
  size?: 'md' | 'sm';
}

/** Сегмент-переключатель с плавной подложкой: Сводка / Анализ / Первичка, ВО / СПО, годы. */
export function Segment({ options, value, onChange, size = 'md' }: SegmentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ left: 0, width: 0 });
  // Подложка встаёт под активную кнопку; ширина кнопки зависит от шрифта, поэтому после загрузки шрифта мерим ещё раз
  const measure = () => {
    const b = ref.current?.querySelector('button.on') as HTMLButtonElement | null;
    if (b) setThumb({ left: b.offsetLeft, width: b.offsetWidth });
  };
  useLayoutEffect(measure, [value, options]);
  useEffect(() => { let alive = true; document.fonts?.ready.then(() => { if (alive) measure(); }); return () => { alive = false; }; }, []);
  return (
    <div ref={ref} className={`vs-seg vs-seg--${size}`} role="tablist">
      <span className="vs-seg__th" style={{ transform: `translateX(${thumb.left}px)`, width: thumb.width }} />
      {options.map((o, i) => (
        <button key={o} role="tab" aria-selected={i === value} className={i === value ? 'on' : ''} onClick={() => onChange?.(i)}>{o}</button>
      ))}
    </div>
  );
}
