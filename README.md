# MAX Chat (GREEN-API)

Минимальный веб-чат для отправки и получения текстовых сообщений через [GREEN-API](https://green-api.com):
отправка — метод `SendMessage`, получение — HTTP API (`ReceiveNotification` + `DeleteNotification`).
Протестировано на инстансе **WhatsApp**; API GREEN-API для MAX и Telegram использует те же методы.

React + TypeScript + Vite, нативный CSS (CSS Modules + дизайн-токены), архитектура Feature-Sliced Design. Есть мобильная версия.

## Локальный запуск

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production-сборка в dist/
```

## Подготовка инстанса GREEN-API

1. Создайте инстанс в [личном кабинете](https://console.green-api.com) и авторизуйте его (QR-код в мессенджере).
2. Включите получение уведомлений через HTTP API: в настройках инстанса `webhookUrl` должен быть **пустым**,
   `incomingWebhook`, `outgoingMessageWebhook` и `outgoingAPIMessageWebhook` — `yes` (применяется за пару минут).
3. На странице входа введите `idInstance` и `apiTokenInstance`. `apiUrl` определяется автоматически по префиксу `idInstance` (например, `7107…` → `https://7107.api.greenapi.com`); при необходимости его можно указать вручную.

## Демо-режим

Кнопка «Демо-режим» на странице входа запускает чат без GREEN-API и без реальных аккаунтов:
`shared/api/mockApi.ts` реализует тот же интерфейс `GreenApi` и отвечает эхо-сообщением через 1,5 с
(через ту же очередь уведомлений, что и настоящий приём). Подходит, чтобы посмотреть интерфейс без инстанса.

## Как пользоваться

1. Войдите с учётными данными GREEN-API.
2. Введите номер получателя в международном формате (`79991234567`; номер вида `8999…` преобразуется в `7999…`) и нажмите «Создать».
3. Напишите сообщение — оно уйдёт методом `SendMessage`.
4. Ответы приходят через `ReceiveNotification` (long polling) → `DeleteNotification` и появляются в чате.

## Структура (FSD)

```
src/
  app/        точка входа, провайдеры, глобальные стили и дизайн-токены (tokens.css)
  pages/      login, chat — композиция виджетов/фич
  widgets/    chat-sidebar, chat-window
  features/   login, create-chat, send-message, receive-messages
  entities/   session (учётные данные + API-клиент), chat (чаты, сообщения, стор)
  shared/     ui (Button, Input, Avatar), api (GREEN-API клиент), lib (утилиты)
```

Импорты идут только вниз по слоям (`app → pages → widgets → features → entities → shared`).

## Замечания

- Учётные данные и история чатов хранятся в `localStorage` (для тестового задания; в проде токен так хранить не стоит).
- Поддерживаются только текстовые сообщения.
