import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchSelect } from './SearchSelect';
const vuz = ['МГУ имени М.В. Ломоносова', 'НИУ ВШЭ', 'СПбГУ', 'МФТИ', 'ИТМО', 'Казанский федеральный университет', 'УрФУ', 'НГУ', 'ТГУ', 'ТПУ', 'Воронежский госуниверситет', 'ДВФУ', 'СФУ', 'ЮФУ', 'КубГУ'];
const meta: Meta<typeof SearchSelect> = { title: 'Атомы/Выбор с поиском', component: SearchSelect, parameters: { layout: 'padded' } };
export default meta;
export const ВыборВуза: StoryObj<typeof SearchSelect> = { render: () => { const [v, setV] = useState(10); return <div style={{ background: 'var(--color-bg-card)', padding: 24, borderRadius: 24, minHeight: 380, display: 'flex', justifyContent: 'flex-end' }}><SearchSelect options={vuz} value={v} onChange={setV} prefix="Ваш вуз:" placeholder="Найти вуз" /></div>; } };
