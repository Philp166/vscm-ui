import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ComparePicker, MirrorCompare, NormCompare, GapDumbbell, CompareSelection } from './Compare';
import { OKRUGS, VUZ } from '../../demo/data';
const OPTIONS = { 0: OKRUGS.map((o) => o + ' ФО'), 1: ['Москва', 'Санкт-Петербург', 'Татарстан', 'Свердловская обл.', 'Новосибирская обл.', 'Томская обл.'], 2: ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург', 'Новосибирск', 'Томск'], 3: VUZ.map((v) => v[0]) };
const meta: Meta = {
  title: 'Сравнения/Блоки',
  parameters: { docs: { description: { component: 'Сравнение двух объектов А и Б: строка выбора с окном (уровень, А, Б, «Все…»), зеркальные полосы по показателям, выполнение норм и гантели разрыва. Выбор сравнения хранит родитель и передаёт в блоки.' } } },
};
export default meta;
const usePick = () => useState<CompareSelection>({ level: 3, a: 'МГУ имени М.В. Ломоносова', b: 'Все организации' });
/** Строка выбора у блока: «Организации: МГУ против среднего». По нажатию — окно: уровень, объект А, объект Б, «Применить ко всем блокам». */
export const ВыборСравнения: StoryObj<typeof ComparePicker> = {
  parameters: { vs: { component: ComparePicker } },
  args: { options: OPTIONS },
  argTypes: { value: { control: false }, onChange: { control: false } },
  render: (args) => { const [v, setV] = usePick(); return <div style={{ minHeight: 420, display: 'flex', justifyContent: 'flex-end', background: 'var(--color-bg-card)', padding: 24, borderRadius: 24 }}><ComparePicker {...args} value={v} onChange={(x) => setV(x)} /></div>; },
};
/** Зеркальное сравнение по показателям: полосы расходятся от центра, у лучшего — синий. Выбор сравнения в шапке меняет названия объектов. */
export const ПоказателиОбъектов: StoryObj<typeof MirrorCompare> = {
  parameters: { vs: { components: [MirrorCompare, ComparePicker] } },
  render: () => { const [v, setV] = usePick(); const b = v.b.startsWith('Все') ? 'Среднее по стране' : v.b; return <MirrorCompare title="Показатели объектов" aName={v.a} bName={b} picker={<ComparePicker value={v} options={OPTIONS} onChange={(x) => setV(x)} />} metrics={[{ name: 'Доля трудоустроенных', a: 76.1, b: 64.8, unit: '%', digits: 1 }, { name: 'Зарплата, тыс. ₽', a: 88, b: 62 }, { name: 'Целевое обучение', a: 9.4, b: 12.4, unit: '%', digits: 1 }, { name: 'Средний балл ЕГЭ', a: 91, b: 68 }, { name: 'Выпускники', a: 9275, b: 3400 }]} />; },
};
/** Выполнение норм: для каждой нормы две полосы, А и Б, отметка нормы и вывод «выполнено / не хватает». Есть нормы «не более». */
export const ВыполнениеНорм: StoryObj<typeof NormCompare> = {
  parameters: { vs: { component: NormCompare } },
  args: { title: 'Выполнение норм', aName: 'МГУ имени М.В. Ломоносова', bName: 'Среднее по стране', rows: [{ name: 'Доля трудоустроенных', norm: 70, a: 76.1, b: 64.8 }, { name: 'Доля целевого обучения', norm: 10, a: 9.4, b: 12.4 }, { name: 'Отчисления за первый курс', norm: 15, a: 6.2, b: 16.4, max: true }] },
};
/** Гантели: по каждой специальности две точки, А и Б, линия между ними — разрыв. Сортировка «По А / По разрыву». */
export const РазрывПоСпециальностям: StoryObj<typeof GapDumbbell> = {
  parameters: { vs: { component: GapDumbbell } },
  args: { title: 'Разрыв по специальностям', aName: 'МГУ имени М.В. Ломоносова', bName: 'Среднее по стране', rows: [['Юриспруденция', 78, 66], ['Экономика', 74, 63], ['Менеджмент', 69, 61], ['Педагогическое образование', 61, 66], ['Информатика и ВТ', 84, 72], ['Строительство', 72, 70], ['Лечебное дело', 88, 79]].map(([name, a, b]) => ({ name: name as string, a: a as number, b: b as number })) },
};
