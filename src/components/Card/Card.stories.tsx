import type { Meta, StoryObj } from '@storybook/react';
import { Card, Grid } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Основа/Карточка',
  component: Card,
  parameters: { design: { type: 'figma', url: 'https://www.figma.com/design/sVfvT1POusrkq2G9eUEFGb/%D0%92%D0%A1%D0%A6%D0%9C?node-id=2043-4006' } },
  args: { title: 'Доля трудоустроенных выпускников', info: 'Доля от выпускников, трудоустроенных в течение года', footer: <><span>Источник: демо-данные</span><span>Обновлено 01.10.2026</span></>, children: 'Содержимое карточки' },
};
export default meta;
export const Базовая: StoryObj<typeof Card> = {};
export const СеткаБенто: StoryObj<typeof Card> = {
  render: () => (
    <Grid>
      <Card span={3} title="3 колонки">KPI</Card><Card span={3} title="3 колонки">KPI</Card><Card span={6} title="6 колонок">График</Card>
      <Card span={4} title="4 колонки">Доля</Card><Card span={4} title="4 колонки">Доля</Card><Card span={4} title="4 колонки">Доля</Card>
      <Card span={12} title="12 колонок">Таблица</Card>
    </Grid>
  ),
};
