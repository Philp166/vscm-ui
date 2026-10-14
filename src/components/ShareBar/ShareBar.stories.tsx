import type { Meta, StoryObj } from '@storybook/react';
import { ShareBar } from './ShareBar';
const meta: Meta<typeof ShareBar> = { title: 'Показатели/Показатель-доля', component: ShareBar, args: { title: 'Доля трудоустроенных выпускников', value: 65.4, average: 62.9, target: 70, delta: -0.4 }, decorators: [(S) => <div style={{ maxWidth: 420 }}><S /></div>] };
export default meta;
/** Доля ниже цели: под полосой «выше среднего на …, до цели …». */
export const НижеЦели: StoryObj<typeof ShareBar> = {};
/** Цель достигнута: вывод меняется на «цель достигнута». */
export const ЦельДостигнута: StoryObj<typeof ShareBar> = { args: { value: 72.5, delta: 1.3 } };
