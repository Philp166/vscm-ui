import React from 'react';
import './Card.css';

export interface CardProps {
  /** Заголовок карточки: постоянный, не меняется от фильтров */
  title?: string;
  /** Подсказка по значку «i» */
  info?: string;
  /** Одно действие справа в шапке */
  action?: React.ReactNode;
  /** Источник и дата внизу */
  footer?: React.ReactNode;
  /** Ширина по сетке из 12 колонок: 3, 4, 6, 12 */
  span?: 3 | 4 | 6 | 12;
  children?: React.ReactNode;
}

/** Карточка бенто: фон серый, без обводки и тени, радиус 24. Одна карточка — один вопрос. */
export function Card({ title, info, action, footer, span, children }: CardProps) {
  return (
    <section className="vs-card" style={span ? { gridColumn: `span ${span}` } : undefined}>
      {(title || action) && (
        <header className="vs-card__h">
          {title && <h3 className="vs-card__t">{title}</h3>}
          {info && <span className="vs-card__i" title={info} aria-label={info}>i</span>}
          {action && <div className="vs-card__a">{action}</div>}
        </header>
      )}
      <div className="vs-card__b">{children}</div>
      {footer && <footer className="vs-card__f">{footer}</footer>}
    </section>
  );
}

/** Сетка 12 колонок с промежутком 24. */
export function Grid({ children }: { children: React.ReactNode }) {
  return <div className="vs-grid">{children}</div>;
}
