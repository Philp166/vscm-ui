import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, IconButton, Field, Chip, InfoTip, FilterPill } from './Controls';
import { TopNav, LevelBar } from './Shell';
import { Icon, ICON_NAMES } from './Icon';

const meta: Meta = { title: 'Основа/Элементы управления' };
export default meta;
const Row = ({ children }: { children: React.ReactNode }) => <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>{children}</div>;

export const Кнопки: StoryObj = { render: () => <><Row><Button variant="primary" icon="download">Выгрузить</Button><Button icon="table">Первичка</Button><Button variant="ghost">Показать всё</Button><Button disabled>Недоступно</Button></Row><Row><Button variant="primary" size="sm">Применить</Button><Button size="sm">Отмена</Button><IconButton icon="refresh" label="Обновить" /><IconButton icon="calendar" label="Период" /></Row></> };
export const Поле: StoryObj = { render: () => <div style={{ maxWidth: 420 }}><Field icon="search" placeholder="Найти регион, вуз или показатель" /></div> };
export const ФильтрыИЧипы: StoryObj = { render: () => { const [y, setY] = useState(4); const [l, setL] = useState(0); const [chips, setChips] = useState(['Центральный ФО', 'ВО', 'Бюджет']);
  return <div style={{ minHeight: 280 }}><Row><FilterPill label="Год" options={['2020', '2021', '2022', '2023', '2024']} value={y} onChange={setY} /><FilterPill label="Уровень" options={['Все', 'ВО', 'СПО']} value={l} onChange={setL} /></Row><Row>{chips.map((c) => <Chip key={c} onRemove={() => setChips(chips.filter((x) => x !== c))}>{c}</Chip>)}</Row></div>; } };
export const Подсказка: StoryObj = { render: () => <div style={{ paddingTop: 140, paddingLeft: 140 }}>Доля трудоустроенных <InfoTip title="Как считается" text="Доля выпускников, трудоустроенных в течение года после выпуска, от общего числа выпускников." /></div> };
export const Иконки: StoryObj = { render: () => <Row>{ICON_NAMES.map((n) => <span key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 88, fontSize: 11, color: 'var(--color-text-secondary)' }}><Icon name={n} size={24} />{n}</span>)}</Row> };

export const ШапкаСтраницы: StoryObj = { parameters: { layout: 'fullscreen' }, render: () => { const [a, setA] = useState(0); const [lv, setLv] = useState(1); return <><TopNav active={a} onSelect={setA} /><LevelBar title="Трудоустройство выпускников" level={lv} onLevel={setLv} /></>; } };
