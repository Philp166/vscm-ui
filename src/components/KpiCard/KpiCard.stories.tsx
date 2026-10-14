import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { KpiCard } from './KpiCard';
import { Grid } from '../Card/Card';

const s = (vals: number[]) => vals.map((value, i) => ({ year: 2020 + i, value }));
const meta: Meta<typeof KpiCard> = {
  title: 'Показатели/Карточка KPI',
  component: KpiCard,
  parameters: { design: { type: 'figma', url: 'https://www.figma.com/design/sVfvT1POusrkq2G9eUEFGb/%D0%92%D0%A1%D0%A6%D0%9C?node-id=2043-4006' } },
  args: { title: 'Выпускники', series: s([1520460, 1478300, 1573340, 1648528, 1703128]), unit: 'чел.' },
};
const narrow = [(Story: React.ComponentType) => <div style={{ maxWidth: 340 }}><Story /></div>];
export default meta;
type S = StoryObj<typeof KpiCard>;
/** Число: цифра за последний год, изменение к прошлому году в процентах, мини-график. Проведите по графику — цифра и год меняются. */
export const Число: S = { decorators: narrow };
/** Доля: один знак после запятой, изменение в процентных пунктах (`deltaUnit=" п.п."`). */
export const Доля: S = { decorators: narrow, args: { title: 'Трудоустроено', series: s([58, 61.3, 64.2, 65.8, 65.4]), unit: '%', digits: 1, deltaUnit: ' п.п.' } };
/** Загрузка: скелет на месте цифры и графика. */
export const Загрузка: S = { decorators: narrow, args: { state: 'loading' } };
/** Нет данных за период: заголовок остаётся, вместо цифры пояснение. */
export const НетДанных: S = { decorators: narrow, args: { title: 'Средний балл ЕГЭ при приёме', state: 'empty', emptyText: 'За 2024 год показатель ещё не загружен.' } };
/** Четыре карточки в сетке, по три колонки каждая. */
export const ВСетке: S = {
  parameters: { vs: { components: [KpiCard, Grid] } },
  render: () => (
    <Grid>
      <div style={{ gridColumn: 'span 3' }}><KpiCard title="Выпускники" series={s([1520460, 1478300, 1573340, 1648528, 1703128])} /></div>
      <div style={{ gridColumn: 'span 3' }}><KpiCard title="Трудоустроено" series={s([58, 61.3, 64.2, 65.8, 65.4])} unit="%" digits={1} deltaUnit=" п.п." /></div>
      <div style={{ gridColumn: 'span 3' }}><KpiCard title="Зарплата выпускников" series={s([44, 47, 51, 54, 58.4])} unit="тыс. ₽" digits={1} /></div>
      <div style={{ gridColumn: 'span 3' }}><KpiCard title="Доля целевого обучения" series={s([2.1, 2.4, 2.8, 3.0, 3.1])} unit="%" digits={1} deltaUnit=" п.п." /></div>
    </Grid>
  ),
};
