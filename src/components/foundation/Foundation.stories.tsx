import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, IconButton, Field, Chip, InfoTip, FilterPill } from './Controls';
import { TopNav, LevelBar } from './Shell';
import { Icon, ICON_NAMES } from './Icon';

const meta: Meta = {
  title: 'Основа/Элементы управления',
  parameters: { docs: { description: { component: 'Базовые элементы интерфейса: кнопки, поля, фильтры-капсулы, чипы, подсказка, иконки, верхнее меню и полоса раздела. Размеры, цвета и радиусы берутся из токенов.' } } },
};
export default meta;
const Row = ({ children }: { children: React.ReactNode }) => <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>{children}</div>;

/** Все варианты кнопок: главная с градиентом (одна на экран), серая, текстовая, недоступная; ниже малый размер и круглые кнопки-иконки. */
export const Кнопки: StoryObj = {
  parameters: { vs: { components: [Button, IconButton] } },
  render: () => <><Row><Button variant="primary" icon="download">Выгрузить</Button><Button icon="table">Первичка</Button><Button variant="ghost">Показать всё</Button><Button disabled>Недоступно</Button></Row><Row><Button variant="primary" size="sm">Применить</Button><Button size="sm">Отмена</Button><IconButton icon="refresh" label="Обновить" /><IconButton icon="calendar" label="Период" /></Row></>,
};

/** Поле ввода без обводки: серое, при фокусе синяя рамка. */
export const Поле: StoryObj<typeof Field> = {
  parameters: { vs: { component: Field } },
  args: { icon: 'search', placeholder: 'Найти регион, вуз или показатель' },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
};

/** Поиск с вытягиванием: при фокусе поле плавно расширяется. Так ведут себя все поиски платформы: в шапке, на карте, «Найти сервис». */
export const ПолеПоиска: StoryObj<typeof Field> = {
  name: 'Поле поиска (вытягивается)',
  parameters: { vs: { component: Field } },
  args: { grow: true, icon: 'search', placeholder: 'Найти сервис' },
  decorators: [(Story) => <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: 520 }}><Story /></div>],
};

/** Фильтры-капсулы для коротких списков и чипы выбранных значений с крестиком. Значения хранит родитель. */
export const ФильтрыИЧипы: StoryObj = {
  parameters: { vs: { components: [FilterPill, Chip] } },
  render: () => { const [y, setY] = useState(4); const [l, setL] = useState(0); const [chips, setChips] = useState(['Центральный ФО', 'ВО', 'Бюджет']);
    return <div style={{ minHeight: 280 }}><Row><FilterPill label="Год" options={['2020', '2021', '2022', '2023', '2024']} value={y} onChange={setY} /><FilterPill label="Уровень" options={['Все', 'ВО', 'СПО']} value={l} onChange={setL} /></Row><Row>{chips.map((c) => <Chip key={c} onRemove={() => setChips(chips.filter((x) => x !== c))}>{c}</Chip>)}</Row></div>; },
};

/** Подсказка по значку «i»: открывается по наведению и нажатию. Используется для методики и источника показателя. */
export const Подсказка: StoryObj<typeof InfoTip> = {
  parameters: { vs: { component: InfoTip } },
  args: { title: 'Как считается', text: 'Доля выпускников, трудоустроенных в течение года после выпуска, от общего числа выпускников.' },
  render: (args) => <div style={{ paddingTop: 140, paddingLeft: 140 }}>Доля трудоустроенных <InfoTip {...args} /></div>,
};

/** Набор иконок платформы (Lucide). Под каждой — имя для свойства `icon` у кнопок и полей и `name` у `Icon`. */
export const Иконки: StoryObj = {
  parameters: { vs: { components: [Icon] } },
  render: () => <Row>{ICON_NAMES.map((n) => <span key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 88, fontSize: 11, color: 'var(--color-text-secondary)' }}><Icon name={n} size={24} />{n}</span>)}</Row>,
};

/** Верхнее меню платформы и полоса раздела с переключателем уровня «Сводка / Анализ / Первичка». */
export const ШапкаСтраницы: StoryObj = {
  parameters: { layout: 'fullscreen', vs: { components: [TopNav, LevelBar] } },
  render: () => { const [a, setA] = useState(0); const [lv, setLv] = useState(1); return <><TopNav active={a} onSelect={setA} /><LevelBar title="Трудоустройство выпускников" level={lv} onLevel={setLv} /></>; },
};
