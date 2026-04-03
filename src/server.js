// Load environment variables from .env.local
require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });

// Polyfill fetch globals for Node 16 (required by Supabase and Anthropic SDK)
const nodeFetch = require('node-fetch');
if (!globalThis.fetch) {
  globalThis.fetch = nodeFetch;
  globalThis.Headers = nodeFetch.Headers;
  globalThis.Request = nodeFetch.Request;
  globalThis.Response = nodeFetch.Response;
}

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { PORT, BASE_URL, REDIRECT_URI } = require('./config');
const { handleHome } = require('./routes/home.route');
const { handleAuth, handleCventAuth, handleAttendeeHubAuth, handleCallback } = require('./routes/auth.route');
const { handleResult } = require('./routes/profile.route');
const { handleDashboard } = require('./routes/dashboard.route');
const { handleCventDemo } = require('./routes/cvent-demo.route');
const { handleFeedback } = require('./routes/feedback.route');
const { handleMockupGenerator, handleGenerateMockupApi } = require('./routes/mockup-generator.route');
const { getFlowDemoPage } = require('./views/flow-demo.view');
const { getCventOption1Page, getCventOption2Page } = require('./views/cvent-flow-demo.view');
const { getAttendeeHubPage } = require('./views/attendee-hub.view');
const { getAttendeeLoginPage } = require('./views/attendee-login.view');
const { getAttendeeNetworkPage } = require('./views/attendee-network.view');
const { getAttendeeListPage } = require('./views/attendee-list.view');
const { getCventIntegrationSetupPage } = require('./views/cvent-integration-setup.view');
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

    } else if (pathname === '/cvent-option1') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(getCventOption1Page());

    } else if (pathname === '/cvent-option2') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(getCventOption2Page());

    } else if (pathname === '/flow-demo') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(getFlowDemoPage());

    } else if (pathname === '/attendee-login') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(getAttendeeLoginPage());

    } else if (pathname === '/attendee-hub') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(getAttendeeHubPage());

    } else if (pathname === '/attendee-network') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(getAttendeeNetworkPage());

    } else if (pathname === '/attendee-list') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(getAttendeeListPage());

    } else if (pathname === '/cvent-integration-setup') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(getCventIntegrationSetupPage());

    } else if (pathname === '/attendee-hub-auth') {
      handleAttendeeHubAuth(req, res);

    } else if (pathname === '/mockup-generator') {
      handleMockupGenerator(req, res);

    } else if (pathname === '/api/generate-mockup' && req.method === 'POST') {
      await handleGenerateMockupApi(req, res);

    } else if (pathname === '/feedback' && req.method === 'POST') {
      await handleFeedback(req, res);

    } else if (pathname === '/preview') {
      // DEV ONLY — preview all page states without going through OAuth
      const type = parsedUrl.query.type || 'success';
      const mockData = {
        success: { status: 'success', checkinId: 'preview-mock-id', linkedinName: 'Alex Johnson', linkedinEmail: 'alex@example.com', profilePicture: '', isVerified: true, checkinTime: new Date().toISOString(), attendee: { full_name: 'Alex Johnson', ticket_type: 'General', company: 'Acme Corp' } },
        walkin:  { status: 'walk_in', checkinId: 'preview-mock-id', linkedinName: 'Jordan Lee', linkedinEmail: 'jordan@example.com', profilePicture: '', isVerified: false, checkinTime: new Date().toISOString() },
        duplicate: { status: 'already_checked_in', linkedinName: 'Sam Rivera', linkedinEmail: 'sam@example.com', profilePicture: '', isVerified: true, originalCheckinTime: new Date(Date.now() - 600000).toISOString(), attendee: { full_name: 'Sam Rivera' } },
        error: null
      };
      res.writeHead(200, { 'Content-Type': 'text/html' });
      if (type === 'error') {
        res.end(getErrorPage('unauthorized_scope_error'));
      } else {
        res.end(getResultPage(mockData[type] || mockData.success));
      }

    } else if (pathname.startsWith('/images/')) {
      const filePath = path.join(__dirname, '..', pathname);
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('Not found'); return; }
        const ext = path.extname(filePath).toLowerCase();
        const mime = { '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' }[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
      });

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
