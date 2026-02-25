const IN_BUG_BLUE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="32" height="32"><path fill="#0a66c2" d="M92.23,92.23h-11.88v-18.6c0-4.44-.08-10.15-6.18-10.15s-7.14,4.83-7.14,9.83v18.92h-11.88V53.97h11.41v5.23h.16c1.59-3.01,5.47-6.18,11.25-6.18,12.04,0,14.27,7.92,14.27,18.22v20.98ZM41.75,48.74c-3.81,0-6.89-3.09-6.89-6.9s3.08-6.89,6.89-6.89,6.89,3.09,6.89,6.89-3.09,6.9-6.89,6.9m5.94,43.49h-11.89V53.97h11.89v38.26ZM98.15,23.92H29.83c-3.27,0-5.92,2.59-5.92,5.78V98.3c0,3.19,2.65,5.78,5.92,5.78H98.15c3.27,0,5.93-2.59,5.93-5.78V29.7c0-3.19-2.66-5.78-5.93-5.78"/></svg>`;

function getErrorPage(errorMessage) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign-in Error</title>
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
    .card-header {
      padding: 28px 28px 20px;
      border-bottom: 1px solid #e0dfdc;
      text-align: center;
    }
    .error-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #fce4ec;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      margin: 0 auto 14px;
    }
    .card-header h1 {
      font-size: 20px;
      font-weight: 700;
      color: #1b1f23;
      margin-bottom: 6px;
    }
    .card-header p {
      font-size: 14px;
      color: #595959;
      line-height: 1.5;
    }
    .card-body { padding: 20px 28px 28px; }
    .warning-box {
      background: #fdf3d7;
      border-left: 3px solid #c37d16;
      border-radius: 4px;
      padding: 14px 16px;
      margin-bottom: 16px;
      font-size: 13px;
      color: #7a4f0e;
      line-height: 1.6;
    }
    .warning-box strong { display: block; margin-bottom: 4px; color: #5a380a; }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 48px;
      padding: 0 24px;
      background: #0a66c2;
      color: #ffffff;
      border: none;
      border-radius: 24px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.15s ease;
    }
    .btn:hover { background: #004182; }
    .logo-wrap { text-align: center; margin-bottom: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="card-header">
      <div class="logo-wrap">${IN_BUG_BLUE}</div>
      <div class="error-icon">✕</div>
      <h1>Sign-in Failed</h1>
      <p>${errorMessage}</p>
    </div>
    <div class="card-body">
      ${errorMessage === 'unauthorized_scope_error' ? `
      <div class="warning-box">
        <strong>API Access Error</strong>
        Your LinkedIn developer application either lacks the 'Verified on LinkedIn' API product assignment, or is requesting a different tier than provisioned.
      </div>` : ''}
      <a href="/" class="btn">Try Again</a>
    </div>
  </div>
</body>
</html>`;
}

module.exports = { getErrorPage };
