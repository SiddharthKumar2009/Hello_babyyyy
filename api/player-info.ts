import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ ok: false, description: 'Missing uid parameter' });
  }

  try {
    const response = await fetch(
      `https://info.killersharmabot.online/player-info?uid=${encodeURIComponent(uid as string)}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ ok: false, description: `Remote error: ${response.status}` });
    }

    const data = await response.json();

    const nickname = data?.basicInfo?.nickname || data?.nickname;

    if (!nickname) {
      return res.status(404).json({ ok: false, description: 'Player not found. Check your UID.' });
    }

    return res.json({ ok: true, nickname, uid });

  } catch (err: any) {
    return res.status(500).json({ ok: false, description: err.message || 'Server error' });
  }
}
