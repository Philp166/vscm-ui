import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Segment } from './Segment';
const meta: Meta<typeof Segment> = {
  title: 'Атомы/Сегмент',
  component: Segment,
  // value и onChange в историях держит обёртка Live, поэтому управлять ими из панели нельзя
  argTypes: { value: { control: false }, onChange: { control: false } },
  render: (args) => <Live options={args.options} size={args.size} />,
};
export default meta;
const Live = (args: { options: string[]; size?: 'md' | 'sm' }) => { const [v, setV] = useState(0); return <Segment {...args} value={v} onChange={setV} />; };
/** Уровни раздела «Сводка / Анализ / Первичка», обычный размер. */
export const УровниРаздела: StoryObj<typeof Segment> = { args: { options: ['Сводка', 'Анализ', 'Первичка'] } };
/** Переключатель уровня образования в шапке карточки, малый размер. */
export const ВОиСПО: StoryObj<typeof Segment> = { args: { options: ['ВО', 'СПО'], size: 'sm' } };
/** Переключатель лет, малый размер. */
export const Годы: StoryObj<typeof Segment> = { args: { options: ['2022', '2023', '2024'], size: 'sm' } };
