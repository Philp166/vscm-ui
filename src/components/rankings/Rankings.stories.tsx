import type { Meta, StoryObj } from '@storybook/react';
import { MultiRanking, PlaceStrip } from './Rankings';
import { VUZ, rnd, resetRnd } from '../../demo/data';
resetRnd(21);
const items = VUZ.map(([name, sub], i) => ({ name, sub, values: { emp: 79 - i * 0.55 + (rnd() - 0.5) * 3, sal: Math.round(95 - i * 1.6 + (rnd() - 0.5) * 24), tgt: +(5 + rnd() * 25).toFixed(1) } }));
const all = [...items.map((i) => +i.values.emp.toFixed(1))]; for (let k = all.length; k < 539; k++) all.push(+(46 + Math.pow(rnd(), 1.3) * 26).toFixed(1));
const meta: Meta = {
  title: 'Рейтинги/Блоки',
  parameters: { docs: { description: { component: 'Рейтинги: сводный по нескольким показателям и место одного объекта среди всех. Рейтинг с движением мест по годам — в разделе «Движение мест».' } } },
};
export default meta;
/** Итоговое место — среднее место по показателям. Полосы и места по каждому показателю: видно, за счёт чего объект высоко. Нажатие на заголовок пересортировывает. */
export const ПоНесколькимПоказателям: StoryObj<typeof MultiRanking> = {
  parameters: { vs: { component: MultiRanking } },
  args: { title: 'Сводный рейтинг вузов', items, metrics: [{ key: 'emp', name: 'Трудоустройство', short: 'Труд.' }, { key: 'sal', name: 'Зарплата', short: 'Зарпл.' }, { key: 'tgt', name: 'Целевое обучение', short: 'Целев.' }] },
};
/** «Где мы»: место крупно, фраза «лучше, чем X%», все объекты страны точками, медиана и зона топ-10%. Объект выбирается поиском. */
export const МестоОбъекта: StoryObj<typeof PlaceStrip> = {
  parameters: { vs: { component: PlaceStrip } },
  args: { title: 'Место по доле трудоустроенных, 2024', names: items.map((i) => i.name), values: items.map((i) => +i.values.emp.toFixed(1)), all },
};
