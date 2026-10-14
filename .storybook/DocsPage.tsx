import React, { useContext } from 'react';
import { DocsContext, Title, Description, DocsStory, Heading, Subheading, Markdown, PureArgsTable, Source } from '@storybook/blocks';
import type { ArgTypes } from '@storybook/react';

type AnyComponent = React.ComponentType<any> & { __docgenInfo?: { displayName?: string; description?: string } };
type VsParams = { component?: AnyComponent; components?: AnyComponent[] };

/** Имя компонента: из docgen, потому что в собранном сторибуке имена функций сжаты. */
export const componentName = (c: AnyComponent) => c.__docgenInfo?.displayName || c.displayName || c.name;

/** Компоненты, которые показывает история: parameters.vs.components, иначе vs.component, иначе component из meta. */
export const storyComponents = (parameters: { vs?: VsParams }, metaComponent?: AnyComponent): AnyComponent[] => {
  const vs = parameters.vs;
  if (vs?.components?.length) return vs.components;
  if (vs?.component) return [vs.component];
  return metaComponent ? [metaComponent] : [];
};

/**
 * Страница Docs для всех разделов ВСЦМ UI.
 * Порядок: название, описание группы, строка импорта, истории с описанием и кодом, затем таблица свойств
 * по каждому компоненту, который встречается в историях (так свойства видны и в файлах, где компонентов несколько).
 */
export function DocsPage() {
  const ctx = useContext(DocsContext);
  const stories = ctx.componentStories();
  const meta = stories[0];
  const extract = (ctx as any).projectAnnotations?.parameters?.docs?.extractArgTypes as ((c: AnyComponent) => ArgTypes | null) | undefined;

  const comps: AnyComponent[] = [];
  stories.forEach((s) => storyComponents(s.parameters as { vs?: VsParams }, s.component as AnyComponent).forEach((c) => { if (!comps.includes(c)) comps.push(c); }));
  const names = comps.map(componentName);
  const groupText = meta?.parameters?.docs?.description?.component as string | undefined;

  return (
    <>
      <Title />
      {groupText && <Description of="meta" />}
      {names.length > 0 && <Source language="tsx" dark code={`import { ${names.join(', ')} } from 'vscm-ui';\nimport 'vscm-ui/style.css'; // один раз в корне приложения`} />}
      <Heading>Истории</Heading>
      {stories.map((s) => <DocsStory key={s.id} of={s.moduleExport} expanded __forceInitialArgs />)}
      {comps.length > 0 && <Heading>Свойства</Heading>}
      {comps.map((c) => {
        const rows = (extract?.(c) ?? {}) as ArgTypes;
        const desc = c.__docgenInfo?.description;
        return (
          <section key={componentName(c)} id={`props-${componentName(c)}`}>
            <Subheading>{componentName(c)}</Subheading>
            {desc && <Markdown>{desc}</Markdown>}
            {Object.keys(rows).length ? <PureArgsTable rows={rows} /> : <p>Свойств нет.</p>}
          </section>
        );
      })}
    </>
  );
}
