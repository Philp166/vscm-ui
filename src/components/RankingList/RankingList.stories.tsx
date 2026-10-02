import type { Meta, StoryObj } from '@storybook/react';
import { RankingList } from './RankingList';
const names = [['МГУ имени М.В. Ломоносова', 'Москва'], ['НИУ ВШЭ', 'Москва'], ['СПбГУ', 'Санкт-Петербург'], ['МФТИ', 'Московская обл.'], ['ИТМО', 'Санкт-Петербург'], ['Казанский федеральный университет', 'Татарстан'], ['УрФУ', 'Свердловская обл.'], ['НГУ', 'Новосибирская обл.'], ['ТГУ', 'Томская обл.'], ['ТПУ', 'Томская обл.'], ['ЮФУ', 'Ростовская обл.'], ['СФУ', 'Красноярский край'], ['ДВФУ', 'Приморский край'], ['Воронежский госуниверситет', 'Воронежская обл.']];
let s = 7; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
const items = names.map(([name, sub], i) => { const b = 79 - i * 0.6; return { name, sub, byYear: { '2022': +(b - 2 + (r() - 0.5) * 4).toFixed(1), '2023': +(b - 1 + (r() - 0.5) * 4).toFixed(1), '2024': +(b + (r() - 0.5) * 4).toFixed(1) } }; });
const meta: Meta<typeof RankingList> = { title: 'Рейтинги/Движение мест', component: RankingList, args: { title: 'Вузы по доле трудоустроенных выпускников', items, years: ['2022', '2023', '2024'], pinned: 13 } };
export default meta;
export const СоСвоимВузом: StoryObj<typeof RankingList> = {};
export const БезЗакрепления: StoryObj<typeof RankingList> = { args: { pinned: undefined } };
