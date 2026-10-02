import type { Meta, StoryObj } from '@storybook/react';
import { BarList } from './BarList';
const items = [['Москва', 812000], ['Санкт-Петербург', 334000], ['Московская область', 168000], ['Республика Татарстан', 131000], ['Свердловская область', 139000], ['Новосибирская область', 118000], ['Краснодарский край', 112000], ['Ростовская область', 108000], ['Нижегородская область', 97000], ['Республика Башкортостан', 95000], ['Самарская область', 91000], ['Томская область', 64000], ['Челябинская область', 88000]].map(([name, value]) => ({ name: name as string, value: value as number }));
const meta: Meta<typeof BarList> = { title: 'Структура/Горизонтальные столбцы', component: BarList, args: { title: 'Студенты по регионам', items }, decorators: [(S) => <div style={{ maxWidth: 560 }}><S /></div>] };
export default meta;
export const ТопДесять: StoryObj<typeof BarList> = {};
export const СВыделением: StoryObj<typeof BarList> = { args: { highlight: 'Республика Татарстан' } };
