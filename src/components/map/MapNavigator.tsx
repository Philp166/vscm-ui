import { useEffect, useRef } from 'react';
import { mountMap } from './engine';
import russia from './russia.json';
import './MapNavigator.css';

export interface MapSelection { okrug: string | null; region: string | null; vuz: string | null; flows: boolean }
export interface MapNavigatorProps {
  /** Сообщает, что выбрано: блоки под картой обновляются по этому событию */
  onChange?: (s: MapSelection) => void;
  /** Открыть сразу на регионе (для историй и ссылок) */
  initialRegion?: string;
  /** Открыть сразу на вузе */
  initialVuz?: string;
  /** Сразу включить дуги «Куда уезжают» (нужен initialRegion) */
  initialFlows?: boolean;
  /** Сразу плоский вид 2D */
  flat?: boolean;
  height?: number;
}

const SEARCH = '<span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></span>';
const RESET = '<span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg></span>';
const MARKUP = `<div class="m3" id="stage"><canvas id="cv3"></canvas>
<div class="ov tl"><div class="crumbs5" id="cr"></div><h2 id="mT">Россия</h2><div class="msub" id="mSub"></div></div>
<div class="ov tr"><div class="msrch">${SEARCH}<input id="q3" placeholder="Найти регион или вуз" autocomplete="off"><div class="q3r" id="q3r"></div></div><div class="seg seg--sm dk" id="mS"><span class="th"></span><button class="on">Трудоустройство</button><button>Выпускники</button><button>Зарплата</button></div><button class="md fl" id="fl" style="display:none">Куда уезжают</button><button class="md" id="md">2D</button><button class="rst" id="rst" title="Исходный вид">${RESET}</button></div>
<div class="ov bl"><div class="lg3" id="lg"></div></div><div class="ov br" id="hint">Тяните, чтобы наклонить. Колесо — ближе. Нажмите на округ</div><div class="ld" id="ld">Загружаем карту</div></div>
<div class="mtip3" id="mtip"></div>`;

/** Карта-навигатор России (WebGL): страна → округ → регион → вуз, поиск, показатель, 2D / 2.5D, режим «Куда уезжают». Блоки под картой слушают onChange. */
export function MapNavigator({ onChange, initialRegion, initialVuz, initialFlows, flat, height }: MapNavigatorProps) {
  const ref = useRef<HTMLDivElement>(null); const cb = useRef(onChange); cb.current = onChange;
  useEffect(() => {
    const root = ref.current!; root.innerHTML = MARKUP;
    if (height) (root.querySelector('#stage') as HTMLElement).style.height = height + 'px';
    const api = mountMap(root, russia, { onChange: (s: MapSelection) => cb.current?.(s) });
    const timers: number[] = [];
    if (flat) timers.push(window.setTimeout(() => (root.querySelector('#md') as HTMLButtonElement).click(), 900));
    if (initialVuz) timers.push(window.setTimeout(() => api.goU(initialVuz), 600));
    else if (initialRegion) { timers.push(window.setTimeout(() => api.goR(initialRegion), 600)); if (initialFlows) timers.push(window.setTimeout(() => api.setFlows(true), 1900)); }
    return () => { timers.forEach(clearTimeout); api.destroy(); root.innerHTML = ''; };
  }, [initialRegion, initialVuz, initialFlows, flat, height]);
  return <div className="vs-map" ref={ref} />;
}
