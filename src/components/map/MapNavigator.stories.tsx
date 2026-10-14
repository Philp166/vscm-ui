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
/** Вся страна, наклонный вид 2.5D. Тяните, чтобы наклонить; колесо — ближе; нажатие на округ — переход внутрь. */
export const ВсяСтрана: S = {};
/** Карта сразу открыта на регионе. */
export const Регион: S = { args: { initialRegion: 'Томская область' } };
/** Карта сразу открыта на вузе: белая точка выбранного вуза. */
export const Вуз: S = { args: { initialVuz: 'НГУ' } };
/** Режим «Куда уезжают»: дуги из региона, толщина — сколько выпускников уезжает. */
export const КудаУезжают: S = { args: { initialRegion: 'Томская область', initialFlows: true } };
/** Плоский вид 2D. */
export const ПлоскийВид: S = { args: { flat: true } };
/** Как связать карту с блоками ниже: страница слушает `onChange` и перерисовывает содержимое по выбору. */
export const СБлокомНиже: S = {
  render: () => { const [s, setS] = useState<MapSelection>({ okrug: null, region: null, vuz: null, flows: false });
    return <><MapNavigator onChange={setS} /><div style={{ marginTop: 16, padding: 20, borderRadius: 24, background: 'var(--color-bg-card)', fontSize: 15 }}><b>Блок ниже получает выбор:</b> {s.vuz ? `вуз «${s.vuz}», ${s.region}` : s.region ? `регион «${s.region}»` : s.okrug ? s.okrug : 'вся страна'}{s.flows ? ', режим «Куда уезжают»' : ''}</div></>; },
};
