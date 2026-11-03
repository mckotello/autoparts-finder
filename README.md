# AutoPartsFinder

Клиентское приложение на **React** и **Redux** для двухэтапного подбора автозапчастей через Web-сервис «Проценка» [Favorit Parts](https://lk.favorit-parts.ru/static/wsprice.pdf).

## Возможности

1. **Этап 1** — ввод артикула, debounced-запрос `number`, отображение списка производителей (`brand` из ответа `goods`).
2. **Этап 2** — выбор бренда, запрос с `number`, `brand`, `analogues=on`, таблица позиций и аналогов с наименованием, производителем, ценой (минимум по складам с остатком) и остатком.

Обработка состояний: спиннеры загрузки, сообщения об ошибках API и сети, пустые ответы.

## Стек

- React 18, Vite
- Redux Toolkit, react-redux
- Bootstrap 5 (CSS)

## Запуск

```bash
cd d:\AutoPartsFinder
copy .env.example .env
# В .env укажите свой ключ покупателя VITE_API_KEY
npm install
npm run dev
```

Откройте адрес, который выведет Vite (обычно http://localhost:5173).

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `VITE_API_KEY` | Обязательный ключ покупателя |
| `VITE_API_BASE_URL` | Базовый хост для прокси в dev (по умолчанию `http://api.favorit-parts.ru`) |
| `VITE_API_URL` | Полный URL эндпоинта (если нужен обход прокси, например backend-шлюз) |

В **development** запросы идут на `/api/hsprice/` и проксируются на `http://api.favorit-parts.ru/hs/hsprice/` (обход CORS).

Для **production** без прокси браузер может блокировать прямой вызов API из‑за CORS — тогда задайте `VITE_API_URL` на ваш backend-прокси или разверните статику за reverse proxy с тем же правилом, что в `vite.config.js`.

## Сборка

```bash
npm run build
npm run preview
```

## Структура

```
src/
  api/priceApi.js          — HTTP и разбор ответа
  store/features/search/   — Redux slice и async thunks
  components/              — UI этапов
  hooks/                   — debounce поиска брендов
```

Документация API: https://lk.favorit-parts.ru/static/wsprice.pdf
