import type { Meta, StoryObj } from '@storybook/react';
import { DeltaPill } from './DeltaPill';
const meta: Meta<typeof DeltaPill> = { title: 'Атомы/Метка динамики', component: DeltaPill, args: { value: 3.3, unit: '%', label: 'к 2023 году' } };
export default meta;
/** Рост: зелёная стрелка вверх. */
export const Рост: StoryObj<typeof DeltaPill> = {};
/** Падение доли: красная стрелка вниз, единица « п.п.». */
export const Падение: StoryObj<typeof DeltaPill> = { args: { value: -0.2, unit: ' п.п.' } };
/** Без изменений: серый знак «=». */
export const БезИзменений: StoryObj<typeof DeltaPill> = { args: { value: 0 } };
