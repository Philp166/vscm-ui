import type { Meta, StoryObj } from '@storybook/react';
import { HeroNumber, NormSummary, ShareRing } from './Indicators';
const hero = [['2020', 1478300, 905000, 768000, 710300, 70.2, 54.1], ['2021', 1513196, 941000, 780000, 733196, 71.0, 55.3], ['2022', 1573340, 1010084, 805000, 768340, 72.1, 56.0], ['2023', 1648528, 1084000, 830000, 818528, 72.8, 57.1], ['2024', 1703128, 1114240, 864253, 838875, 73.1, 57.5]].map(([year, total, employed, vo, spo, voEmp, spoEmp]) => ({ year: year as string, total: total as number, employed: employed as number, vo: vo as number, spo: spo as number, voEmp: voEmp as number, spoEmp: spoEmp as number }));
const meta: Meta = { title: 'Показатели/Герой, норма, кольцо' };
export default meta;
export const ГеройЦифра: StoryObj = { render: () => <HeroNumber label="Выпускники за год" data={hero} /> };
export const СводкаСНормой: StoryObj = { render: () => <NormSummary title="Трудоустройство выпускников" norm={70} data={hero.map((h) => ({ year: h.year, graduates: h.total, employed: Math.round(h.total * [0.58, 0.613, 0.642, 0.658, 0.654][+h.year - 2020]) }))} /> };
export const ДоляКольцом: StoryObj = { render: () => <div style={{ maxWidth: 760 }}><ShareRing title="Доля трудоустроенных выпускников по округам" value={68.2} average={65.4} target={70} items={[['Центральный', 68.2], ['Северо-Западный', 67.1], ['Уральский', 66.4], ['Приволжский', 64.9], ['Сибирский', 63.0], ['Южный', 61.8], ['Дальневосточный', 60.2], ['Северо-Кавказский', 55.7]].map(([name, value]) => ({ name: name as string, value: value as number }))} /></div> };
