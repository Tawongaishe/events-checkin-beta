const { recordFeedback } = require('../services/checkin.service');

async function handleFeedback(req, res) {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', async () => {
    try {
      const { checkinId, rating, comment } = JSON.parse(body);
      const r = parseInt(rating, 10);
      if (!r || r < 1 || r > 5) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'rating must be 1–5' }));
        return;
      }
      await recordFeedback(checkinId || null, r, comment || '');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch (err) {
      console.error('❌ Feedback route error:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  });
}

module.exports = { handleFeedback };
