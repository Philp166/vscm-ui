import React from 'react';
import './Card.css';

export interface CardProps {
  /** Заголовок карточки: постоянный, не меняется от фильтров */
  title?: string;
  /** Текст подсказки по значку «i» рядом с заголовком. Значок показывается, только если задан `title` или `action`. */
  info?: string;
  /** Одно действие справа в шапке: переключатель, кнопка, выбор. Не больше одного элемента. */
  action?: React.ReactNode;
  /** Подвал карточки: источник данных и дата обновления. */
  footer?: React.ReactNode;
  /** Ширина в колонках сетки `Grid` (12 колонок). Работает, только если карточка лежит прямо в `Grid`. */
  span?: 3 | 4 | 6 | 12;
  /** Содержимое карточки. */
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

export interface GridProps {
  /** Карточки `Card` со свойством `span` или любые блоки с `grid-column: span N`. */
  children: React.ReactNode;
}

/** Сетка бенто: 12 колонок, промежуток 24. Поля страницы задаёт родитель. */
export function Grid({ children }: GridProps) {
  return <div className="vs-grid">{children}</div>;
}
