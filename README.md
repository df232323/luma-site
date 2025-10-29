# LUMA — сайт вакансии (Vercel)

Готовый проект для публикации на **Vercel**. Включает:
- `index.html` — сайт (мультистраница на hash‑роутинге).
- `api/submit.js` — serverless‑функция для отправки заявок в Telegram, **токен и chat_id хранятся в переменных окружения**.
- `luma-logo.png` — логотип (замените на свой файл из макета).

## Развёртывание на Vercel (быстро)

1. Зайдите на vercel.com → New Project → Import (загрузите эти файлы).
2. На шаге **Environment Variables** добавьте переменные:
   - `TELEGRAM_BOT_TOKEN` — токен вашего бота (из @BotFather).
   - `TELEGRAM_CHAT_ID` — ID вашей группы/чата (можно получить через @getmyid_bot).
3. Deploy. После деплоя форма «Отклик» начнёт слать заявки в Telegram.

### Через CLI
```bash
npm i -g vercel
vercel login
vercel
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_CHAT_ID
vercel --prod
```

## Примечания
- Токен **не хранится** в клиентском коде — это безопаснее.
- Замените `luma-logo.png` на реальный логотип.
- Кнопка «Написать в Telegram» ведёт на https://t.me/Luma_Ekaterina.
