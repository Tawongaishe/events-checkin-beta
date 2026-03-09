const IN_BUG_WHITE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="20" height="20"><path fill="#fff" d="M92.23,92.23h-11.88v-18.6c0-4.44-.08-10.15-6.18-10.15s-7.14,4.83-7.14,9.83v18.92h-11.88V53.97h11.41v5.23h.16c1.59-3.01,5.47-6.18,11.25-6.18,12.04,0,14.27,7.92,14.27,18.22v20.98ZM41.75,48.74c-3.81,0-6.89-3.09-6.89-6.9s3.08-6.89,6.89-6.89,6.89,3.09,6.89,6.89-3.09,6.9-6.89,6.9m5.94,43.49h-11.89V53.97h11.89v38.26ZM98.15,23.92H29.83c-3.27,0-5.92,2.59-5.92,5.78V98.3c0,3.19,2.65,5.78,5.92,5.78H98.15c3.27,0,5.93-2.59,5.93-5.78V29.7c0-3.19-2.66-5.78-5.93-5.78"/></svg>`;
const { EVENT_NAME } = require('../config');

function getAttendeeLoginPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Attendee Hub — Sign In</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #d8dbe8;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif;
    }

    /* ── iPhone frame ── */
    .iphone {
      width: 390px;
      height: 780px;
      background: #1a1a5e;
      border-radius: 54px;
      box-shadow:
        0 0 0 2px #8a8a9a,
        0 0 0 6px #4a4a5a,
        0 40px 80px rgba(0,0,0,0.45),
        inset 0 0 0 1px rgba(255,255,255,0.08);
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    /* Dynamic island */
    .dynamic-island {
      position: absolute;
      top: 14px; left: 50%;
      transform: translateX(-50%);
      width: 120px; height: 34px;
      background: #000;
      border-radius: 20px;
      z-index: 10;
    }

    /* Status bar */
    .status-bar {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 60px 28px 0;
      color: #fff;
    }
    .status-time { font-size: 16px; font-weight: 700; }
    .status-icons { display: flex; align-items: center; gap: 6px; }
    .status-icons svg { fill: #fff; }

    /* Main content — centered */
    .screen-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 36px 48px;
      text-align: center;
    }

    /* Hex app icon */
    .app-icon {
      width: 72px; height: 72px;
      margin-bottom: 24px;
    }

    /* Title */
    .app-title {
      font-size: 26px;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }
    .event-name {
      font-size: 13px;
      font-weight: 700;
      color: rgba(255,255,255,0.45);
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 10px;
    }
    .app-subtitle {
      font-size: 14px;
      color: rgba(255,255,255,0.5);
      line-height: 1.5;
      margin-bottom: 48px;
      max-width: 240px;
    }

    /* Sign in button */
    .signin-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 15px 24px;
      background: #0a66c2;
      border: none;
      border-radius: 50px;
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: background 0.15s;
      margin-bottom: 16px;
    }
    .signin-btn:hover { background: #004182; }

    .signin-fine {
      font-size: 11px;
      color: rgba(255,255,255,0.3);
      line-height: 1.6;
      max-width: 260px;
      margin-bottom: 20px;
    }

    .divider {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      margin-bottom: 16px;
    }
    .divider-line {
      flex: 1;
      height: 1px;
      background: rgba(255,255,255,0.12);
    }
    .divider-text {
      font-size: 11px;
      color: rgba(255,255,255,0.25);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .alt-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 14px 24px;
      background: transparent;
      border: 1.5px solid rgba(255,255,255,0.18);
      border-radius: 50px;
      color: rgba(255,255,255,0.6);
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: border-color 0.15s, color 0.15s;
    }
    .alt-btn:hover { border-color: rgba(255,255,255,0.4); color: #fff; }

    /* Bottom safe area */
    .safe-area {
      flex-shrink: 0;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .home-indicator {
      width: 120px; height: 5px;
      background: rgba(255,255,255,0.25);
      border-radius: 3px;
    }
  </style>
</head>
<body>
  <div class="iphone">
    <div class="dynamic-island"></div>

    <!-- Status bar -->
    <div class="status-bar">
      <span class="status-time">9:41</span>
      <div class="status-icons">
        <svg width="17" height="12" viewBox="0 0 17 12"><rect x="0" y="4" width="3" height="8" rx="1"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="1"/><rect x="9" y="1" width="3" height="11" rx="1"/><rect x="13.5" y="0" width="3" height="12" rx="1" opacity="0.3"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM8 6C9.8 6 11.4 6.8 12.5 8l-1.4 1.4C10.3 8.5 9.2 8 8 8s-2.3.5-3.1 1.4L3.5 8C4.6 6.8 6.2 6 8 6zm0-4c2.8 0 5.3 1.2 7.1 3.1L13.7 6.5C12.3 5 10.3 4 8 4S3.7 5 2.3 6.5L.9 5.1C2.7 3.2 5.2 2 8 2z"/></svg>
        <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0" y="1" width="21" height="10" rx="2.5" stroke="#fff" stroke-width="1.2" fill="none"/><rect x="1.5" y="2.5" width="16" height="7" rx="1.5" fill="#fff"/><path d="M22.5 4v4a2 2 0 000-4z" fill="#fff" opacity="0.4"/></svg>
      </div>
    </div>

    <!-- Centered content -->
    <div class="screen-body">

      <!-- Cvent hex icon -->
      <svg class="app-icon" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hexG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff6b9d"/>
            <stop offset="100%" style="stop-color:#c73a6e"/>
          </linearGradient>
        </defs>
        <polygon points="36,3 65,19 65,53 36,69 7,53 7,19" fill="url(#hexG)"/>
        <text x="36" y="46" text-anchor="middle" font-size="28" font-weight="900" fill="#fff" font-family="Helvetica Neue, Arial">C</text>
      </svg>

      <div class="app-title">Attendee Hub</div>
      <div class="event-name">${EVENT_NAME}</div>
      <div class="app-subtitle">Connect and network with fellow attendees</div>

      <a class="signin-btn" href="/attendee-hub-auth">
        ${IN_BUG_WHITE}
        Sign in with LinkedIn
      </a>

      <div class="signin-fine">By signing in you agree to share your LinkedIn profile information for networking purposes.</div>

      <div class="divider">
        <div class="divider-line"></div>
        <div class="divider-text">or</div>
        <div class="divider-line"></div>
      </div>

      <a class="alt-btn" href="/attendee-hub">
        Continue without LinkedIn
      </a>

    </div>

    <!-- Home indicator -->
    <div class="safe-area">
      <div class="home-indicator"></div>
    </div>

  </div>
</body>
</html>`;
}

module.exports = { getAttendeeLoginPage };
