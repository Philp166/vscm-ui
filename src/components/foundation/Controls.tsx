import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import './foundation.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Вид: `primary` — градиент, одна главная кнопка на экран; `secondary` — серая; `ghost` — текстовая, без фона. */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Иконка слева от текста: имя из набора `Icon` (см. `ICON_NAMES`). */
  icon?: string;
  /** Высота: `md` — 40 px, `sm` — 32 px (в шапках карточек и окнах). */
  size?: 'md' | 'sm';
  /** Дополнительный CSS-класс. */
  className?: string;
}
/** Кнопка. Градиент только у главной кнопки экрана. Принимает все стандартные свойства `<button>` (`onClick`, `disabled`, `type` и т. д.). */
export function Button({ variant = 'secondary', icon, size = 'md', children, className = '', ...rest }: ButtonProps) {
  return <button className={`vs-btn vs-btn--${variant} vs-btn--${size} ${className}`} {...rest}>{icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}{children}</button>;
}
export interface IconButtonProps {
  /** Имя иконки из набора `Icon`. */
  icon: string;
  /** Подпись для экранного диктора и всплывающая подсказка. Обязательна: у кнопки нет текста. */
  label: string;
  /** Обработчик нажатия. */
  onClick?: () => void;
  /** Вариант для тёмного фона (верхнее меню). */
  dark?: boolean;
}
/** Кнопка-иконка, круглая, 40 px. */
export function IconButton({ icon, label, onClick, dark }: IconButtonProps) {
  return <button className={`vs-ibtn${dark ? ' vs-ibtn--dark' : ''}`} aria-label={label} title={label} onClick={onClick}><Icon name={icon} /></button>;
}

export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Иконка слева в поле: имя из набора `Icon`, для поиска — `search`. */
  icon?: string;
  /** Поисковое поведение, как у поиска на карте: при фокусе поле плавно вытягивается. Ширина в покое и в фокусе задаётся CSS-переменными `--vs-field-w` (280 px) и `--vs-field-w-focus` (360 px). Все поиски платформы ведут себя одинаково. */
  grow?: boolean;
}
/** Поле ввода без обводки: серое, при фокусе синяя рамка. Принимает все стандартные свойства `<input>` (`value`, `onChange`, `placeholder` и т. д.). */
export function Field({ icon, grow, ...rest }: FieldProps) {
  return <label className={`vs-field${grow ? ' vs-field--grow' : ''}`}>{icon && <Icon name={icon} size={18} />}<input {...rest} /></label>;
}

export interface ChipProps {
  /** Подпись чипа: значение выбранного фильтра. */
  children: React.ReactNode;
  /** Обработчик крестика. Если не задан, крестика нет. */
  onRemove?: () => void;
}
/** Чип: выбранный фильтр с крестиком. */
export function Chip({ children, onRemove }: ChipProps) {
  return <span className="vs-chip">{children}{onRemove && <button aria-label="Убрать" onClick={onRemove}><Icon name="x" size={14} /></button>}</span>;
}

export interface InfoTipProps {
  /** Заголовок подсказки жирным, например «Как считается». */
  title?: string;
  /** Текст подсказки: методика, источник, оговорки. */
  text: string;
}
/** Подсказка по значку «i»: открывается по наведению и нажатию. */
export function InfoTip({ title, text }: InfoTipProps) {
  const [open, setOpen] = useState(false);
  return (
    <span className="vs-info" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button aria-label="Подробнее" onClick={() => setOpen(!open)}><Icon name="info" size={18} /></button>
      {open && <span className="vs-info__pop">{title && <b>{title}</b>}{text}</span>}
    </span>
  );
}

export interface FilterPillProps {
  /** Название фильтра перед двоеточием, например «Год». */
  label: string;
  /** Варианты. Для длинных списков (регионы, вузы) используйте `SearchSelect`. */
  options: string[];
  /** Индекс выбранного варианта в `options`. Компонент управляемый: значение хранит родитель. */
  value: number;
  /** Вызывается с индексом нового варианта. */
  onChange: (i: number) => void;
}
/** Фильтр-капсула: «Год: 2024 ⌄», выбор из короткого списка. Для длинных списков — выбор с поиском. */
export function FilterPill({ label, options, value, onChange }: FilterPillProps) {
  const [open, setOpen] = useState(false); const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);
  return (
    <div className={`vs-fp${open ? ' open' : ''}`} ref={ref}>
      <button onClick={() => setOpen(!open)}><span>{label}:</span><b>{options[value]}</b><Icon name="chevron-down" size={16} /></button>
      {open && <div className="vs-fp__ls">{options.map((o, i) => <button key={o} className={i === value ? 'on' : ''} onClick={() => { onChange(i); setOpen(false); }}>{o}{i === value && <Icon name="check" size={16} />}</button>)}</div>}
    </div>
  );
}
