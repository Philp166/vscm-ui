import type { Meta, StoryObj } from '@storybook/react';
import { LineChart } from './LineChart';
const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const labels = [2022, 2023, 2024].flatMap((y) => months.map((m) => `${m} ${String(y).slice(2)}`));
const wave = (b: number, a: number, k: number) => labels.map((_, i) => Math.round(b + a * Math.sin(i / 2.2 + k) + i * b * 0.004));
const meta: Meta<typeof LineChart> = {
  title: 'Динамика/Линейный график',
  component: LineChart,
  args: { title: 'Вакансии для выпускников по месяцам', labels, series: [{ name: 'Высшее', values: wave(42000, 6000, 0) }, { name: 'Среднее профессиональное', values: wave(31000, 4000, 1) }], periods: { 'Год': 12, '3 года': 36 } },
};
export default meta;
export const ДвеСерии: StoryObj<typeof LineChart> = {};
export const СНормой: StoryObj<typeof LineChart> = { args: { title: 'Доля трудоустроенных, 2020–2024', labels: ['2020', '2021', '2022', '2023', '2024'], series: [{ name: 'Доля', values: [58, 61.3, 64.2, 65.8, 65.4] }], norm: { value: 70, label: 'норма 70%' }, periods: undefined } };
