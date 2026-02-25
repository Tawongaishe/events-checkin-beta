const { EVENT_NAME } = require('../config');

const IN_BUG_WHITE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="20" height="20"><path fill="#fff" d="M92.23,92.23h-11.88v-18.6c0-4.44-.08-10.15-6.18-10.15s-7.14,4.83-7.14,9.83v18.92h-11.88V53.97h11.41v5.23h.16c1.59-3.01,5.47-6.18,11.25-6.18,12.04,0,14.27,7.92,14.27,18.22v20.98ZM41.75,48.74c-3.81,0-6.89-3.09-6.89-6.9s3.08-6.89,6.89-6.89,6.89,3.09,6.89,6.89-3.09,6.9-6.89,6.9m5.94,43.49h-11.89V53.97h11.89v38.26ZM98.15,23.92H29.83c-3.27,0-5.92,2.59-5.92,5.78V98.3c0,3.19,2.65,5.78,5.92,5.78H98.15c3.27,0,5.93-2.59,5.93-5.78V29.7c0-3.19-2.66-5.78-5.93-5.78"/></svg>`;

const LINKEDIN_WORDMARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 363.75 128" height="28"><path fill="#0a66c2" d="M23.6 35.61L23.6 92.06 58.87 92.06 58.87 80.65 35.97 80.65 35.97 35.61 23.6 35.61"/><path fill="#0a66c2" d="M70.27,34.77c3.81,0,6.89,3.09,6.89,6.89s-3.09,6.89-6.89,6.89-6.89-3.08-6.89-6.89,3.09-6.89,6.89-6.89m-5.94,19.02h11.89v38.26h-11.89V53.79Z"/><polygon fill="#0a66c2" points="125.9 35.6 137.78 35.6 137.78 69.34 151.24 53.77 165.81 53.77 150.22 71.48 165.49 92.06 150.55 92.06 137.94 73.15 137.78 73.15 137.78 92.06 125.9 92.06 125.9 35.6"/><path fill="#0a66c2" d="M82.79,53.79h11.41v5.23h.16c1.58-3.01,5.47-6.18,11.25-6.18,12.05,0,14.27,7.92,14.27,18.22v20.98h-11.89v-18.6c0-4.44-.08-10.14-6.18-10.14s-7.13,4.84-7.13,9.83v18.92h-11.89V53.79Z"/><path fill="#0a66c2" d="M200.89,85.42c-3.81,4.84-10.06,7.61-16.24,7.61-11.88,0-21.39-7.93-21.39-20.21s9.51-20.2,21.39-20.2c11.1,0,18.07,7.92,18.07,20.2v3.73h-27.58c.94,4.52,4.35,7.45,8.95,7.45,3.88,0,6.5-1.98,8.48-4.68l8.32,6.1Zm-10.06-16.95c.08-3.96-3.01-7.29-7.3-7.29-5.23,0-8.08,3.57-8.39,7.29h15.69Z"/><path fill="#0a66c2" d="M247.92,92.04h-10.94v-5.07h-.16c-1.83,2.77-6.42,6.02-11.81,6.02-11.41,0-18.94-8.24-18.94-19.89,0-10.7,6.66-20.52,17.59-20.52,4.92,0,9.51,1.35,12.21,5.07h.16v-22.05h11.89v56.44Zm-20.45-29c-5.94,0-9.5,3.97-9.5,9.75s3.56,9.75,9.5,9.75,9.51-3.96,9.51-9.75-3.57-9.75-9.51-9.75"/><path fill="#0a66c2" d="M328.12,92.06h-11.88v-18.6c0-4.44-.08-10.15-6.18-10.15s-7.14,4.83-7.14,9.83v18.92h-11.88V53.81h11.41v5.23h.16c1.59-3.01,5.47-6.18,11.25-6.18,12.04,0,14.27,7.92,14.27,18.22v20.98Zm-50.48-43.49c-3.81,0-6.89-3.09-6.89-6.9s3.08-6.89,6.89-6.89,6.89,3.09,6.89,6.89-3.09,6.9-6.89,6.9m5.94,43.49h-11.89V53.8h11.89v38.26Zm50.46-68.31h-68.32c-3.27,0-5.92,2.59-5.92,5.78V98.13c0,3.19,2.65,5.78,5.92,5.78h68.32c3.27,0,5.93-2.59,5.93-5.78V29.53c0-3.19-2.66-5.78-5.93-5.78"/></svg>`;

function getHomePage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${EVENT_NAME} — Check-In</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #f3f2ef;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.08);
      max-width: 440px;
      width: 100%;
      overflow: hidden;
    }
    .card-top {
      padding: 32px 32px 28px;
      text-align: center;
      border-bottom: 1px solid #e0dfdc;
    }
    .logo-wrap { margin-bottom: 20px; }
    .event-name {
      font-size: 22px;
      font-weight: 600;
      color: #1b1f23;
      margin-bottom: 8px;
      line-height: 1.3;
    }
    .subtitle {
      color: #595959;
      font-size: 14px;
      line-height: 1.6;
    }
    .card-body { padding: 24px 32px 28px; }
    .linkedin-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: #0a66c2;
      color: #ffffff;
      text-decoration: none;
      padding: 0 24px;
      border-radius: 24px;
      font-size: 16px;
      font-weight: 600;
      width: 100%;
      border: none;
      cursor: pointer;
      height: 48px;
      transition: background 0.15s ease;
      letter-spacing: 0.01em;
    }
    .linkedin-btn:hover { background: #004182; }
    .linkedin-btn:active { background: #003375; }
    .divider {
      border: none;
      border-top: 1px solid #e0dfdc;
      margin: 20px 0;
    }
    .info-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      color: #595959;
      font-size: 14px;
      line-height: 1.5;
    }
    .info-dot {
      width: 20px;
      height: 20px;
      background: #dff0d8;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #057642;
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .footer-note {
      margin-top: 20px;
      font-size: 12px;
      color: #999;
      line-height: 1.5;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="card-top">
      <div class="logo-wrap">${LINKEDIN_WORDMARK}</div>
      <h1 class="event-name">${EVENT_NAME}</h1>
      <p class="subtitle">Sign in with your LinkedIn account to verify your identity and check in to the event.</p>
    </div>
    <div class="card-body">
      <form action="/auth" method="POST">
        <button type="submit" class="linkedin-btn">
          ${IN_BUG_WHITE}
          Sign in with LinkedIn
        </button>
      </form>

      <hr class="divider">

      <div class="info-list">
        <div class="info-item">
          <div class="info-dot">✓</div>
          <span>Your identity is verified using your LinkedIn profile</span>
        </div>
        <div class="info-item">
          <div class="info-dot">✓</div>
          <span>Your name and email are checked against the attendee list</span>
        </div>
        <div class="info-item">
          <div class="info-dot">✓</div>
          <span>Your check-in is recorded with a timestamp</span>
        </div>
      </div>

      <p class="footer-note">By signing in you agree to share your LinkedIn profile information for event check-in purposes.</p>
    </div>
  </div>
</body>
</html>`;
}

module.exports = { getHomePage };
