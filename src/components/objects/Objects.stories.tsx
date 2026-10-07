import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VuzCard, RegionCard, REGION_NAMES } from './Objects';
import { KpiCard } from '../KpiCard/KpiCard';
import { SearchSelect } from '../SearchSelect/SearchSelect';
import { Grid } from '../Card/Card';
const s = (v: number[]) => v.map((value, i) => ({ year: 2020 + i, value }));
const analytics = <Grid><div style={{ gridColumn: 'span 4' }}><KpiCard title="Доля трудоустроенных" series={s([72.4, 73.3, 74.6, 75.7, 76.1])} unit="%" digits={1} deltaUnit=" п.п." /></div><div style={{ gridColumn: 'span 4' }}><KpiCard title="Выпускники" series={s([8800, 9010, 9120, 9300, 9275])} /></div><div style={{ gridColumn: 'span 4' }}><KpiCard title="Зарплата выпускников" series={s([71, 76, 80, 85, 88])} unit="тыс. ₽" /></div></Grid>;
const meta: Meta = { title: 'Объекты/Карточки' };
export default meta;
export const КарточкаВуза: StoryObj = { render: () => <VuzCard analytics={analytics}
  passport={{ short: 'ФГБОУ ВО «МГУ имени М.В. Ломоносова»', full: 'Федеральное государственное бюджетное образовательное учреждение высшего образования «Московский государственный университет имени М.В. Ломоносова»', fields: [['Вид учреждения', 'Федеральное государственное бюджетное учреждение'], ['Учредитель', 'Минобрнауки России'], ['Руководитель', 'Ректор (демо)'], ['Основной вид деятельности', '85.22 Образование высшее'], ['Лицензия на образовательную деятельность', 'Л035-00115-77/00097464'], ['Свидетельство о госаккредитации', 'А007-00115-77/01173341'], ['Субъект РФ', 'Москва'], ['Юридический адрес', 'Москва, Ленинские горы, д. 1']] }}
  facts={[['Студентов', '39 883'], ['Направлений подготовки', '84'], ['Филиалов', '5'], ['Преподавателей', '2 849']]} /> };
export const КарточкаРегиона: StoryObj = { render: () => { const [i, setI] = useState(Math.max(0, REGION_NAMES.indexOf('Татарстан')));
  return <><div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}><SearchSelect options={REGION_NAMES} value={i} onChange={setI} placeholder="Найти регион" /></div><RegionCard region={REGION_NAMES[i]} analytics={analytics} facts={[['Вузов', '5'], ['Колледжей', '16'], ['Студентов вузов', '48 620'], ['Студентов колледжей', '35 052']]} /></>; } };
