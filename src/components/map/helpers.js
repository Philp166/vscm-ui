// @ts-nocheck
/* Мелкие помощники движка карты. */
export const fmt = (v, d = 0) => v.toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/\s/g, '\u00a0');
const ICONS = { 'chevron-right': '<path d="m9 18 6-6-6-6"/>', search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>' };
export const ic = (n) => `<span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ''}</svg></span>`;
export function initSeg(el, cb) {
  const th = el.querySelector('.th'), bs = [...el.querySelectorAll('button')];
  const place = (b) => { th.style.width = b.offsetWidth + 'px'; th.style.transform = `translateX(${b.offsetLeft - 3}px)`; };
  bs.forEach((b, i) => (b.onclick = () => { bs.forEach((x) => x.classList.remove('on')); b.classList.add('on'); place(b); cb(i); }));
  requestAnimationFrame(() => place(bs.find((b) => b.classList.contains('on')) || bs[0]));
}
