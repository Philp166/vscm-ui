import type { Preview } from '@storybook/react';
import '../src/styles/base.css';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'Страница', values: [{ name: 'Страница', value: '#FFFFFF' }, { name: 'Карточка', value: '#F2F2F4' }] },
    viewport: { viewports: {
      mobile: { name: 'Телефон 390', styles: { width: '390px', height: '844px' } },
      tablet: { name: 'Планшет 960', styles: { width: '960px', height: '1024px' } },
      desktop: { name: 'Десктоп 1440', styles: { width: '1440px', height: '900px' } } } },
    options: { storySort: { order: ['Введение', 'Основа', 'Атомы', 'Показатели', 'Динамика', 'Структура', 'Сравнения', 'Таблицы', 'География', 'Потоки и схемы', 'Рейтинги', 'Объекты'] } },
    controls: { expanded: true },
  },
};
export default preview;
