import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VuzCard, RegionCard, Passport, FactsRow, OptionalAnalytics, REGION_NAMES } from './Objects';
import { KpiCard } from '../KpiCard/KpiCard';
import { SearchSelect } from '../SearchSelect/SearchSelect';
import { Grid } from '../Card/Card';
const s = (v: number[]) => v.map((value, i) => ({ year: 2020 + i, value }));
const analytics = <Grid><div style={{ gridColumn: 'span 4' }}><KpiCard title="Доля трудоустроенных" series={s([72.4, 73.3, 74.6, 75.7, 76.1])} unit="%" digits={1} deltaUnit=" п.п." /></div><div style={{ gridColumn: 'span 4' }}><KpiCard title="Выпускники" series={s([8800, 9010, 9120, 9300, 9275])} /></div><div style={{ gridColumn: 'span 4' }}><KpiCard title="Зарплата выпускников" series={s([71, 76, 80, 85, 88])} unit="тыс. ₽" /></div></Grid>;
const meta: Meta = {
  title: 'Объекты/Карточки',
  parameters: { docs: { description: { component: 'Карточки объектов: вуз (паспорт организации из восьми плиток и вуз в цифрах) и регион (регион на карте страны и общие факты). Аналитика под карточкой подключается опционально и свёрнута по умолчанию.' } } },
};
export default meta;
/** Карточка вуза: паспорт организации и вуз в цифрах. Аналитика открывается кнопкой «Показать аналитику по вузу». */
export const КарточкаВуза: StoryObj<typeof VuzCard> = {
  parameters: { vs: { component: VuzCard, components: [VuzCard, Passport, FactsRow, OptionalAnalytics] } },
  args: {
    analytics,
    passport: { short: 'ФГБОУ ВО «МГУ имени М.В. Ломоносова»', full: 'Федеральное государственное бюджетное образовательное учреждение высшего образования «Московский государственный университет имени М.В. Ломоносова»', fields: [['Вид учреждения', 'Федеральное государственное бюджетное учреждение'], ['Учредитель', 'Минобрнауки России'], ['Руководитель', 'Ректор (демо)'], ['Основной вид деятельности', '85.22 Образование высшее'], ['Лицензия на образовательную деятельность', 'Л035-00115-77/00097464'], ['Свидетельство о госаккредитации', 'А007-00115-77/01173341'], ['Субъект РФ', 'Москва'], ['Юридический адрес', 'Москва, Ленинские горы, д. 1']] },
    facts: [['Студентов', '39 883'], ['Направлений подготовки', '84'], ['Филиалов', '5'], ['Преподавателей', '2 849']],
  },
  argTypes: { analytics: { control: false } },
};
/** Карточка региона: регион выделен на карте страны, рядом общие факты. Регион в истории выбирается поиском. */
export const КарточкаРегиона: StoryObj<typeof RegionCard> = {
  parameters: { vs: { component: RegionCard, components: [RegionCard] } },
  args: { region: 'Татарстан', analytics, facts: [['Вузов', '5'], ['Колледжей', '16'], ['Студентов вузов', '48 620'], ['Студентов колледжей', '35 052']] },
  argTypes: { region: { control: 'select', options: REGION_NAMES }, analytics: { control: false } },
  render: (args) => { const [i, setI] = useState(Math.max(0, REGION_NAMES.indexOf(args.region)));
    return <><div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}><SearchSelect options={REGION_NAMES} value={i} onChange={setI} placeholder="Найти регион" /></div><RegionCard {...args} region={REGION_NAMES[i]} /></>; },
};
