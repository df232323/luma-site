// api/submit.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const {
    first_name = '',
    last_name = '',
    phone = '',
    dob = '',
    platform = '',
    telegram = '-',
    track_code = '-',
  } = req.body || {};

  // читаем из Vercel
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ ok: false, error: 'Telegram env vars missing' });
  }

  // сообщение ровно как у тебя на скрине
  const text =
    '🆕Новый отклик LUMA\n\n' +
    
    `👤Имя: ${first_name}\n` +
    `👥Фамилия: ${last_name}\n` +
    `☎️Телефон: ${phone}\n` +
    `🎂ДР: ${dob}\n` +
    `📱Платформа: ${platform}\n` +
    `🌐Telegram: ${telegram}\n` +
    `🎟Трек-код: ${track_code}\n`;

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const tgRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    });

    const data = await tgRes.json();

    if (!data.ok) {
      return res.status(500).json({ ok: false, error: 'Telegram error', data });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
