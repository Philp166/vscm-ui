import React from 'react';
import type { Preview, ArgTypesEnhancer, ArgTypes } from '@storybook/react';
import { DocsPage } from './DocsPage';
import '../src/styles/base.css';

/**
 * Таблица свойств и управление для историй, у которых компонент задан в parameters.vs.component.
 * Нужна для файлов, где в одной группе несколько компонентов: Storybook сам берёт свойства только у component из meta.
 */
const propsFromStoryComponent: ArgTypesEnhancer = (ctx) => {
  const c = (ctx.parameters as { vs?: { component?: React.ComponentType } }).vs?.component;
  const extract = ctx.parameters.docs?.extractArgTypes as ((c: unknown) => ArgTypes | null) | undefined;
  if (!c || !extract) return ctx.argTypes;
  const fromDocs = extract(c) || {};
  const merged: ArgTypes = { ...fromDocs };
  Object.entries(ctx.argTypes).forEach(([k, v]) => { merged[k] = { ...(fromDocs[k] || {}), ...v, table: { ...(fromDocs[k]?.table || {}), ...(v?.table || {}) } }; });
  return merged;
};

const preview: Preview = {
  tags: ['autodocs'],
  argTypesEnhancers: [propsFromStoryComponent],
  // История без своего render рисует компонент из parameters.vs.component (или component из meta) с текущими args.
  render: (args, ctx) => {
    const C = ((ctx.parameters as { vs?: { component?: React.ComponentType<any> } }).vs?.component ?? ctx.component) as React.ComponentType<any>;
    return <C {...args} />;
  },
  parameters: {
    layout: 'padded',
    docs: { page: DocsPage },
    backgrounds: { default: 'Страница', values: [{ name: 'Страница', value: '#FFFFFF' }, { name: 'Карточка', value: '#F2F2F4' }] },
    viewport: { viewports: {
      mobile: { name: 'Телефон 390', styles: { width: '390px', height: '844px' } },
      tablet: { name: 'Планшет 960', styles: { width: '960px', height: '1024px' } },
      desktop: { name: 'Десктоп 1440', styles: { width: '1440px', height: '900px' } } } },
    options: { storySort: { order: ['Введение', 'Для разработчиков', 'Основа', 'Атомы', 'Показатели', 'Динамика', 'Структура', 'Сравнения', 'Таблицы', 'География', 'Потоки и схемы', 'Рейтинги', 'Объекты'] } },
    controls: { expanded: true },
  },
};
export default preview;
