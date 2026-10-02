import type { Meta, StoryObj } from '@storybook/react';
import { DeltaPill } from './DeltaPill';
const meta: Meta<typeof DeltaPill> = { title: 'Атомы/Метка динамики', component: DeltaPill, args: { value: 3.3, unit: '%', label: 'к 2023 году' } };
export default meta;
export const Рост: StoryObj<typeof DeltaPill> = {};
export const Падение: StoryObj<typeof DeltaPill> = { args: { value: -0.2, unit: ' п.п.' } };
export const БезИзменений: StoryObj<typeof DeltaPill> = { args: { value: 0 } };
