import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchSelect } from './SearchSelect';
const vuz = ['МГУ имени М.В. Ломоносова', 'НИУ ВШЭ', 'СПбГУ', 'МФТИ', 'ИТМО', 'Казанский федеральный университет', 'УрФУ', 'НГУ', 'ТГУ', 'ТПУ', 'Воронежский госуниверситет', 'ДВФУ', 'СФУ', 'ЮФУ', 'КубГУ'];
const meta: Meta<typeof SearchSelect> = { title: 'Атомы/Выбор с поиском', component: SearchSelect, parameters: { layout: 'padded' } };
export default meta;
/** Выбор вуза из длинного списка: поле поиска сразу в фокусе, совпадение подсвечено, стрелки и Enter работают. Выбранное значение хранит родитель. */
export const ВыборВуза: StoryObj<typeof SearchSelect> = {
  args: { options: vuz, value: 10, prefix: 'Ваш вуз:', placeholder: 'Найти вуз' },
  argTypes: { value: { control: false }, onChange: { control: false } },
  render: (args) => { const [v, setV] = useState(args.value); return <div style={{ background: 'var(--color-bg-card)', padding: 24, borderRadius: 24, minHeight: 380, display: 'flex', justifyContent: 'flex-end' }}><SearchSelect {...args} value={v} onChange={setV} /></div>; },
};
