import React from 'react';
import './ChartTip.css';
/** Подсказка графика: белая, с тенью, над точкой. x — доля ширины 0..1. */
export function ChartTip({ x, y = 0, children }: { x: number; y?: number; children: React.ReactNode }) {
  const align = x > 0.8 ? 'r' : x < 0.2 ? 'l' : 'c';
  return <div className={`vs-tip vs-tip--${align}`} style={{ left: `${x * 100}%`, top: y }}>{children}</div>;
}
