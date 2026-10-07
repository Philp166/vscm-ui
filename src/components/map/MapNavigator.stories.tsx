import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MapNavigator, MapSelection } from './MapNavigator';

const meta: Meta<typeof MapNavigator> = {
  title: 'География/Карта-навигатор',
  component: MapNavigator,
  parameters: { layout: 'padded', chromatic: { disableSnapshot: true } },
};
export default meta;
type S = StoryObj<typeof MapNavigator>;
export const ВсяСтрана: S = {};
export const Регион: S = { args: { initialRegion: 'Томская область' } };
export const Вуз: S = { args: { initialVuz: 'НГУ' } };
export const КудаУезжают: S = { args: { initialRegion: 'Томская область', initialFlows: true } };
export const ПлоскийВид: S = { args: { flat: true } };
export const СБлокомНиже: S = {
  render: () => { const [s, setS] = useState<MapSelection>({ okrug: null, region: null, vuz: null, flows: false });
    return <><MapNavigator onChange={setS} /><div style={{ marginTop: 16, padding: 20, borderRadius: 24, background: 'var(--color-bg-card)', fontSize: 15 }}><b>Блок ниже получает выбор:</b> {s.vuz ? `вуз «${s.vuz}», ${s.region}` : s.region ? `регион «${s.region}»` : s.okrug ? s.okrug : 'вся страна'}{s.flows ? ', режим «Куда уезжают»' : ''}</div></>; },
};
