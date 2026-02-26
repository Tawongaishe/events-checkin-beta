const { getCventDemoPage } = require('../views/cvent-demo.view');
const { getSession, deleteSession } = require('../services/session.service');

function handleCventDemo(req, res, parsedUrl) {
  const sessionId = parsedUrl.query.session;

  if (sessionId) {
    const session = getSession(sessionId);
    if (session && session.type === 'cvent_result') {
      deleteSession(sessionId);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(getCventDemoPage(session));
      return;
    }
  }

  // No session — show empty form
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(getCventDemoPage(null));
}

module.exports = { handleCventDemo };
