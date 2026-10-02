import { useEffect, useMemo, useRef, useState } from 'react';
import './SearchSelect.css';

export interface SearchSelectProps {
  options: string[];
  value: number;
  onChange: (index: number) => void;
  /** Подпись перед значением, например «Ваш вуз:» */
  prefix?: string;
  placeholder?: string;
}

/** Выбор из длинного списка с поиском: поле сразу в фокусе, совпадение подсвечено, стрелки и Enter. */
export function SearchSelect({ options, value, onChange, prefix, placeholder = 'Найти' }: SearchSelectProps) {
  const [open, setOpen] = useState(false), [q, setQ] = useState(''), [sel, setSel] = useState(0);
  const root = useRef<HTMLDivElement>(null), inp = useRef<HTMLInputElement>(null);
  const hits = useMemo(() => options.map((n, i) => ({ n, i })).filter((x) => x.n.toLowerCase().includes(q.trim().toLowerCase())), [options, q]);
  useEffect(() => { if (open) { setQ(''); setSel(0); setTimeout(() => inp.current?.focus(), 20); } }, [open]);
  useEffect(() => { const h = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);
  const pick = (i: number) => { onChange(i); setOpen(false); };
  const mark = (n: string) => { const s = q.trim(); if (!s) return n; const k = n.toLowerCase().indexOf(s.toLowerCase()); return k < 0 ? n : <>{n.slice(0, k)}<b>{n.slice(k, k + s.length)}</b>{n.slice(k + s.length)}</>; };
  return (
    <div className={`vs-ss${open ? ' open' : ''}`} ref={root}>
      <button className="vs-ss__btn" onClick={() => setOpen(!open)}>{prefix && <span className="vs-ss__pre">{prefix}</span>}<span className="vs-ss__val">{options[value]}</span><span className="vs-ss__chev">⌄</span></button>
      {open && (
        <div className="vs-ss__ls">
          <div className="vs-ss__q"><span>⌕</span><input ref={inp} value={q} placeholder={placeholder} onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={(e) => { if (e.key === 'ArrowDown') { setSel(Math.min(hits.length - 1, sel + 1)); e.preventDefault(); } else if (e.key === 'ArrowUp') { setSel(Math.max(0, sel - 1)); e.preventDefault(); } else if (e.key === 'Enter' && hits[sel]) pick(hits[sel].i); else if (e.key === 'Escape') setOpen(false); }} /></div>
          <div className="vs-ss__l">
            {hits.length ? hits.map((h, k) => <button key={h.i} className={`${h.i === value ? 'cur' : ''}${k === sel && q ? ' on' : ''}`} onClick={() => pick(h.i)}>{mark(h.n)}</button>) : <div className="vs-ss__no">Ничего не найдено</div>}
          </div>
        </div>
      )}
    </div>
  );
}
