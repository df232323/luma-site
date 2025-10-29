export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return res.status(500).json({ error: 'Missing Telegram env vars' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const msg =
      `<b>Новый отклик LUMA</b>%0A%0A` +
      `Имя: ${body.first_name||'-'}%0A` +
      `Фамилия: ${body.last_name||'-'}%0A` +
      `Телефон: ${body.phone||'-'}%0A` +
      `ДР: ${body.dob||'-'}%0A` +
      `Платформа: ${body.platform||'-'}%0A` +
      `Telegram: ${body.telegram||'-'}%0A` +
      `Трек-код: <b>${body.track_code||'-'}</b>`;
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: decodeURIComponent(msg), parse_mode: 'HTML' }),
    });
    const out = await r.json();
    if (!out.ok) return res.status(500).json(out);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
