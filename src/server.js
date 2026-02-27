// Load environment variables from .env.local
require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });

const http = require('http');
const url = require('url');
const { PORT, BASE_URL, REDIRECT_URI } = require('./config');
const { handleHome } = require('./routes/home.route');
const { handleAuth, handleCventAuth, handleCallback } = require('./routes/auth.route');
const { handleResult } = require('./routes/profile.route');
const { handleDashboard } = require('./routes/dashboard.route');
const { handleCventDemo } = require('./routes/cvent-demo.route');
const { initializeCheckinDatabase } = require('./services/checkin.service');
const { getResultPage } = require('./views/profile.view');
const { getErrorPage } = require('./views/error.view');

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    if (pathname === '/' || pathname === '/index.html') {
      handleHome(req, res);

    } else if (pathname === '/auth') {
      handleAuth(req, res);

    } else if (pathname === '/callback') {
      await handleCallback(req, res, parsedUrl);

    } else if (pathname === '/result') {
      handleResult(req, res, parsedUrl);

    } else if (pathname === '/dashboard') {
      await handleDashboard(req, res);

    } else if (pathname === '/cvent-demo') {
      handleCventDemo(req, res, parsedUrl);

    } else if (pathname === '/cvent-auth') {
      handleCventAuth(req, res);

    } else if (pathname === '/preview') {
      // DEV ONLY — preview all page states without going through OAuth
      const type = parsedUrl.query.type || 'success';
      const mockData = {
        success: { status: 'success', linkedinName: 'Alex Johnson', linkedinEmail: 'alex@example.com', profilePicture: '', isVerified: true, checkinTime: new Date().toISOString(), attendee: { full_name: 'Alex Johnson', ticket_type: 'General', company: 'Acme Corp' } },
        walkin:  { status: 'walk_in', linkedinName: 'Jordan Lee', linkedinEmail: 'jordan@example.com', profilePicture: '', isVerified: false, checkinTime: new Date().toISOString() },
        duplicate: { status: 'already_checked_in', linkedinName: 'Sam Rivera', linkedinEmail: 'sam@example.com', profilePicture: '', isVerified: true, originalCheckinTime: new Date(Date.now() - 600000).toISOString(), attendee: { full_name: 'Sam Rivera' } },
        error: null
      };
      res.writeHead(200, { 'Content-Type': 'text/html' });
      if (type === 'error') {
        res.end(getErrorPage('unauthorized_scope_error'));
      } else {
        res.end(getResultPage(mockData[type] || mockData.success));
      }

    } else if (pathname === '/debug-uri') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        REDIRECT_URI,
        BASE_URL,
        VERCEL_URL: process.env.VERCEL_URL || null,
        REDIRECT_URI_ENV: process.env.REDIRECT_URI || null
      }, null, 2));

    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal server error: ' + error.message);
  }
});

console.log('=============================================================');
console.log('Event Check-In App');
console.log('=============================================================\n');
console.log(`🚀 Server starting on ${BASE_URL}`);
console.log(`\n⚠️  Add this redirect URI to your LinkedIn app:`);
console.log(`   ${REDIRECT_URI}\n`);

initializeCheckinDatabase().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running at ${BASE_URL}/\n`);
  });
}).catch(err => {
  console.error('❌ Failed to connect to database:', err.message);
  process.exit(1);
});
