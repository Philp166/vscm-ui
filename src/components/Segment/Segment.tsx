import { useLayoutEffect, useRef, useState } from 'react';
import './Segment.css';

export interface SegmentProps {
  options: string[];
  value: number;
  onChange?: (index: number) => void;
  size?: 'md' | 'sm';
}

/** Сегмент-переключатель с плавной подложкой: Сводка / Анализ / Первичка, ВО / СПО, годы. */
export function Segment({ options, value, onChange, size = 'md' }: SegmentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ left: 0, width: 0 });
  useLayoutEffect(() => {
    const b = ref.current?.querySelectorAll('button')[value] as HTMLButtonElement | undefined;
    if (b) setThumb({ left: b.offsetLeft, width: b.offsetWidth });
  }, [value, options]);
  return (
    <div ref={ref} className={`vs-seg vs-seg--${size}`} role="tablist">
      <span className="vs-seg__th" style={{ transform: `translateX(${thumb.left}px)`, width: thumb.width }} />
      {options.map((o, i) => (
        <button key={o} role="tab" aria-selected={i === value} className={i === value ? 'on' : ''} onClick={() => onChange?.(i)}>{o}</button>
      ))}
    </div>
  );
}
