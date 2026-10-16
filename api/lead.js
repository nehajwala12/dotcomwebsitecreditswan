// Vercel serverless function: records a sample-unlock email and forwards it to sales.
// Every lead is written to the function log. When RESEND_API_KEY is set in the Vercel
// project's environment variables, each lead is also emailed to LEAD_TO (default
// sales@creditswan.com) from LEAD_FROM, which must be an address on a domain verified in Resend.
// This is lead capture, not access control: the samples themselves are static files.
const OK = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false }); }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = {}; } }
  const email = String((body && body.email) || '').trim().slice(0, 200);
  if (!OK.test(email)) return res.status(400).json({ ok: false, error: 'invalid email' });
  const sample = String(body.sample || '').slice(0, 40);
  const page = String(body.page || '').slice(0, 300);
  const when = new Date().toISOString();
  console.log(JSON.stringify({ lead: email, sample, page, when, ua: req.headers['user-agent'] || '' }));

  const key = process.env.RESEND_API_KEY;
  if (key) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.LEAD_FROM || 'CreditSwan website <site@creditswan.com>',
          to: [process.env.LEAD_TO || 'sales@creditswan.com'],
          reply_to: email,
          subject: 'Sample opened: ' + email,
          text: 'Work email: ' + email + '\nSample: ' + sample + '\nPage: ' + page + '\nTime (UTC): ' + when + '\n'
        })
      });
      if (!r.ok) console.error('resend failed', r.status, await r.text());
    } catch (e) { console.error('resend error', e && e.message); }
  }
  return res.status(200).json({ ok: true });
};
