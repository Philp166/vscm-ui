import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
type Row = { org: string; region: string; grad: number; emp: number; share: number };
let s = 3; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
const orgs: [string, string][] = [['МГУ имени М.В. Ломоносова', 'Москва'], ['НИУ ВШЭ', 'Москва'], ['СПбГУ', 'Санкт-Петербург'], ['МФТИ', 'Московская обл.'], ['ИТМО', 'Санкт-Петербург'], ['КФУ', 'Татарстан'], ['УрФУ', 'Свердловская обл.'], ['НГУ', 'Новосибирская обл.'], ['ТГУ', 'Томская обл.'], ['ТПУ', 'Томская обл.'], ['ЮФУ', 'Ростовская обл.'], ['СФУ', 'Красноярский край']];
const rows: Row[] = orgs.map(([org, region]) => { const grad = Math.round(2500 + r() * 9000), share = +(58 + r() * 16).toFixed(1); return { org, region, grad, emp: Math.round((grad * share) / 100), share }; });
const meta: Meta<typeof DataTable<Row>> = {
  title: 'Таблицы/Основная таблица',
  component: DataTable,
  args: { title: 'Трудоустройство выпускников по организациям', rows, onExport: () => alert('Выгрузка'), columns: [
    { key: 'org', title: 'Организация', align: 'left' }, { key: 'region', title: 'Регион', align: 'left' },
    { key: 'grad', title: 'Выпускники', total: true }, { key: 'emp', title: 'Трудоустроено', total: true }, { key: 'share', title: 'Доля, %', digits: 1 }] },
};
export default meta;
export const Базовая: StoryObj<typeof DataTable<Row>> = {};
