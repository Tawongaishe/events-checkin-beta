const { getSession } = require('../services/session.service');
const { getResultPage } = require('../views/profile.view');

// GET /result?id=SESSION_ID — display the check-in outcome
function handleResult(req, res, parsedUrl) {
  const resultId = parsedUrl.query.id;

  if (!resultId) {
    res.writeHead(302, { 'Location': '/' });
    res.end();
    return;
  }

  const result = getSession(resultId);

  if (!result) {
    res.writeHead(302, { 'Location': '/' });
    res.end();
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(getResultPage(result));
}

module.exports = { handleResult };
