import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import './foundation.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary — градиент, одна на экран; secondary — серая; ghost — текстовая */
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: string;
  size?: 'md' | 'sm';
}
/** Кнопка. Градиент только у главной кнопки экрана. */
export function Button({ variant = 'secondary', icon, size = 'md', children, className = '', ...rest }: ButtonProps) {
  return <button className={`vs-btn vs-btn--${variant} vs-btn--${size} ${className}`} {...rest}>{icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}{children}</button>;
}
/** Кнопка-иконка, круглая. */
export function IconButton({ icon, label, onClick, dark }: { icon: string; label: string; onClick?: () => void; dark?: boolean }) {
  return <button className={`vs-ibtn${dark ? ' vs-ibtn--dark' : ''}`} aria-label={label} title={label} onClick={onClick}><Icon name={icon} /></button>;
}

/** Поле ввода без обводки: серое, при фокусе синяя рамка. */
export function Field({ icon, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { icon?: string }) {
  return <label className="vs-field">{icon && <Icon name={icon} size={18} />}<input {...rest} /></label>;
}

/** Чип: выбранный фильтр с крестиком. */
export function Chip({ children, onRemove }: { children: React.ReactNode; onRemove?: () => void }) {
  return <span className="vs-chip">{children}{onRemove && <button aria-label="Убрать" onClick={onRemove}><Icon name="x" size={14} /></button>}</span>;
}

/** Подсказка по значку «i»: открывается по наведению и нажатию. */
export function InfoTip({ title, text }: { title?: string; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="vs-info" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button aria-label="Подробнее" onClick={() => setOpen(!open)}><Icon name="info" size={18} /></button>
      {open && <span className="vs-info__pop">{title && <b>{title}</b>}{text}</span>}
    </span>
  );
}

export interface FilterPillProps { label: string; options: string[]; value: number; onChange: (i: number) => void }
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
