const querystring = require('querystring');
const { getDashboardPage, getLoginPage } = require('../views/dashboard.view');
const { getCheckinStats } = require('../services/checkin.service');
const { DASHBOARD_USERNAME, DASHBOARD_PASSWORD } = require('../config');

async function handleDashboard(req, res) {
  if (req.method === 'GET') {
    const cookies = parseCookies(req.headers.cookie);

    if (cookies.dashboardAuth === 'authenticated') {
      try {
        const stats = await getCheckinStats();
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(getDashboardPage(stats));
      } catch (error) {
        console.error('❌ Error fetching check-in stats:', error.message);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>Error loading dashboard</h1><p>' + error.message + '</p>');
      }
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(getLoginPage());
    }

  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const params = querystring.parse(body);
      const username = params.username?.trim();
      const password = params.password?.trim();

      if (username === DASHBOARD_USERNAME && password === DASHBOARD_PASSWORD) {
        res.writeHead(302, {
          'Location': '/dashboard',
          'Set-Cookie': 'dashboardAuth=authenticated; Path=/; HttpOnly; Max-Age=14400'
        });
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(getLoginPage('Invalid username or password'));
      }
    });

  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method not allowed');
  }
}

function parseCookies(cookieHeader) {
  const cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = value;
    });
  }
  return cookies;
}

module.exports = { handleDashboard };
