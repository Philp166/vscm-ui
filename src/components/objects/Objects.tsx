import React, { useState } from 'react';
import { Card } from '../Card/Card';
import { Icon } from '../foundation/Icon';
import russia from '../map/russia.json';
import './objects.css';

/* ---------- Паспорт организации ---------- */
export interface PassportProps { short: string; full: string; fields: [string, string][] }
/** Паспорт организации: сокращённое и полное наименование слева, восемь плиток справа. Без «таблеток». */
export function Passport({ short, full, fields }: PassportProps) {
  return (
    <section className="vs-pass">
      <div className="vs-pass__l"><span className="k">Паспорт организации</span><div className="n">{short}</div><div className="f">{full}</div></div>
      <div className="vs-pass__g">{fields.map(([a, b]) => <div key={a}><span>{a}</span><b>{b}</b></div>)}</div>
    </section>
  );
}

/** Строка «в цифрах»: 3–4 общих факта об объекте. */
export function FactsRow({ facts }: { facts: [string, string][] }) {
  return <section className="vs-facts">{facts.map(([a, b]) => <div key={a}><span>{a}</span><b className="vs-num">{b}</b></div>)}</section>;
}

/** Аналитика под объектом: по умолчанию свёрнута, раскрывается по кнопке. */
export function OptionalAnalytics({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="vs-more"><button className={open ? 'on' : ''} onClick={() => setOpen(!open)}><Icon name="chevron-down" size={18} />{open ? 'Скрыть аналитику' : label}</button></div>
      {open && <div className="vs-more__box">{children}</div>}
    </>
  );
}

/* ---------- Карточка вуза ---------- */
export interface VuzCardProps { passport: PassportProps; facts: [string, string][]; analytics?: React.ReactNode }
/** Карточка вуза: только общая информация (паспорт и вуз в цифрах). Аналитика подключается опционально. */
export function VuzCard({ passport, facts, analytics }: VuzCardProps) {
  return <div className="vs-obj"><Passport {...passport} /><FactsRow facts={facts} />{analytics && <OptionalAnalytics label="Показать аналитику по вузу">{analytics}</OptionalAnalytics>}</div>;
}

/* ---------- Карточка региона ---------- */
type RD = { n: string; o: string; d: string };
const RG = (russia as { R: RD[] }).R;
const ON = (russia as { O: Record<string, { n: string }> }).O;
export interface RegionCardProps { region: string; okrugName?: string; facts: [string, string][]; analytics?: React.ReactNode }
/** Карточка региона: регион выделен на карте страны, рядом общие факты. Аналитика подключается опционально. */
export function RegionCard({ region, okrugName, facts, analytics }: RegionCardProps) {
  const me = RG.find((r) => r.n === region);
  okrugName = okrugName ?? (me ? ON[me.o]?.n : '');
  return (
    <div className="vs-obj">
      <Card title={region} footer={<span>{okrugName === 'Новые регионы' ? okrugName : `${okrugName} федеральный округ`}</span>}>
        <div className="vs-rc">
          <svg viewBox="0 0 906 495">{RG.map((r) => <path key={r.n} d={r.d} className={r === me ? 'me' : me && r.o === me.o ? 'ok' : ''} />)}</svg>
          <div className="vs-rc__f">{[['Федеральный округ', okrugName] as [string, string], ...facts].map(([a, b]) => <div key={a}><span>{a}</span><b className="vs-num">{b}</b></div>)}</div>
        </div>
      </Card>
      {analytics && <OptionalAnalytics label="Показать аналитику по региону">{analytics}</OptionalAnalytics>}
    </div>
  );
}
export const REGION_NAMES = RG.map((r) => r.n).sort((a, b) => a.localeCompare(b, 'ru'));
