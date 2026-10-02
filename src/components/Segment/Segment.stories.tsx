import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Segment } from './Segment';
const meta: Meta<typeof Segment> = { title: 'Атомы/Сегмент', component: Segment };
export default meta;
const Live = (args: { options: string[]; size?: 'md' | 'sm' }) => { const [v, setV] = useState(0); return <Segment {...args} value={v} onChange={setV} />; };
export const УровниРаздела: StoryObj<typeof Segment> = { render: () => <Live options={['Сводка', 'Анализ', 'Первичка']} /> };
export const ВОиСПО: StoryObj<typeof Segment> = { render: () => <Live options={['ВО', 'СПО']} size="sm" /> };
export const Годы: StoryObj<typeof Segment> = { render: () => <Live options={['2022', '2023', '2024']} size="sm" /> };
