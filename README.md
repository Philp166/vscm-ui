# ВСЦМ UI: токены, компоненты, Storybook

Каркас библиотеки компонентов платформы ВСЦМ. Источник правды по стилю — `tokens/vscm.tokens.json`. Компоненты написаны на React и TypeScript, графики на чистом SVG, без сторонних библиотек.

## Что внутри

| Папка | Что это |
|---|---|
| `tokens/` | Токены ВСЦМ (тот же файл, что грузится в Figma) |
| `scripts/build-tokens.mjs` | Собирает `src/styles/tokens.css` из токенов |
| `src/components/` | Компоненты: у каждого код, стили и истории для сторибука |
| `.storybook/` | Настройки сторибука: шрифт, фон, размеры экрана, порядок разделов |
| `.github/workflows/chromatic.yml` | Автопубликация сторибука в Chromatic при каждом изменении |

Вся библиотека ВСЦМ: основа UI-кита, показатели, динамика, структура, сравнения, таблицы, карта-навигатор, потоки, рейтинги, объекты. Полный список — в сторибуке на странице «Введение». У карты в Chromatic отключены снимки «было / стало», потому что WebGL отрисовывается по-разному от запуска к запуску.

## Запуск на своём компьютере (один раз)

1. Установить **Node.js LTS**: https://nodejs.org (кнопка LTS, всё по умолчанию).
2. Установить **Git**: https://git-scm.com/download/win (всё по умолчанию).
3. Распаковать архив, например в `C:\vscm-ui`.
4. Открыть PowerShell и выполнить:

```powershell
cd C:\vscm-ui
npm install
npm run storybook
```

Откроется браузер с адресом http://localhost:6006 — это сторибук. Остановить: Ctrl+C в окне PowerShell.

## Публикация на GitHub

1. Зарегистрироваться на https://github.com и создать пустой репозиторий `vscm-ui` (кнопка New, без README).
2. В PowerShell (вместо `ЛОГИН` — свой логин GitHub):

```powershell
cd C:\vscm-ui
git init
git add .
git commit -m "ВСЦМ UI: токены и первая волна компонентов"
git branch -M main
git remote add origin https://github.com/ЛОГИН/vscm-ui.git
git push -u origin main
```

## Chromatic: сторибук по ссылке

1. Зайти на https://www.chromatic.com, войти через GitHub, нажать Add project и выбрать репозиторий `vscm-ui`.
2. Скопировать **project token**, который покажет Chromatic.
3. В GitHub: репозиторий → Settings → Secrets and variables → Actions → New repository secret. Имя `CHROMATIC_PROJECT_TOKEN`, значение — токен.
4. Готово: при каждом `git push` сторибук сам собирается и публикуется, ссылка видна в Chromatic. Там же сравнение «было / стало» по каждому компоненту.

## Связь с Figma

1. В Figma запустить плагин **Storybook Connect**, войти через Chromatic.
2. Выделить кадр компонента и вставить ссылку на его историю из Chromatic. Рядом с макетом будет живой компонент.
3. В обратную сторону: у компонентов во вкладке Design ссылка на страницу «UI-библиотека» в Figma. Ссылку на конкретный кадр можно заменить в файле `*.stories.tsx`, параметр `design.url`.

## Как менять стиль

1. Правка всегда начинается в `tokens/vscm.tokens.json`.
2. Обновить стили кода:

```powershell
npm run tokens
```

3. Тот же JSON загрузить в Figma через Tokens Studio, чтобы переменные в макетах совпали.

## Как добавить компонент

Создать папку в `src/components/ИмяКомпонента` с тремя файлами: `ИмяКомпонента.tsx`, `ИмяКомпонента.css`, `ИмяКомпонента.stories.tsx`, и добавить экспорт в `src/index.ts`. В стилях использовать только переменные из `tokens.css`, без цветов и отступов вручную.
