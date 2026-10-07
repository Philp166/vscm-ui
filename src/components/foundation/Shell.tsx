import { Icon } from './Icon';
import { Segment } from '../Segment/Segment';
import logo from '../../assets/logo.svg?raw';
import './foundation.css';

export interface TopNavProps { items?: string[]; active?: number; initials?: string; onSelect?: (i: number) => void }
/** Верхнее меню платформы: чёрное, логотип, разделы капсулами, поиск, ассистент, уведомления, профиль. */
export function TopNav({ items = ['Обзор', 'Показатели', 'Справки', 'Данные'], active = 0, initials = 'ФФ', onSelect }: TopNavProps) {
  return (
    <header className="vs-top">
      <span className="vs-top__logo" dangerouslySetInnerHTML={{ __html: logo }} />
      <nav className="vs-top__nav">{items.map((it, i) => <button key={it} className={i === active ? 'on' : ''} onClick={() => onSelect?.(i)}>{it}</button>)}</nav>
      <div className="vs-top__r">
        <button aria-label="Поиск"><Icon name="search" /></button>
        <button aria-label="Ассистент"><Icon name="bot" /></button>
        <button aria-label="Уведомления"><Icon name="bell" /></button>
        <span className="vs-top__me">{initials}</span>
      </div>
    </header>
  );
}

export interface LevelBarProps { title: string; sub?: string; level: number; onLevel?: (i: number) => void }
/** Полоса раздела под меню: название и уровень «Сводка / Анализ / Первичка». */
export function LevelBar({ title, sub = 'раздел', level, onLevel }: LevelBarProps) {
  return (
    <div className="vs-lvl">
      <div className="vs-lvl__t">{title} <span>{sub}</span></div>
      <Segment options={['Сводка', 'Анализ', 'Первичка']} value={level} onChange={onLevel} />
    </div>
  );
}
