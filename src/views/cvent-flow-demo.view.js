const IN_BUG_WHITE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="18" height="18"><path fill="#fff" d="M92.23,92.23h-11.88v-18.6c0-4.44-.08-10.15-6.18-10.15s-7.14,4.83-7.14,9.83v18.92h-11.88V53.97h11.41v5.23h.16c1.59-3.01,5.47-6.18,11.25-6.18,12.04,0,14.27,7.92,14.27,18.22v20.98ZM41.75,48.74c-3.81,0-6.89-3.09-6.89-6.9s3.08-6.89,6.89-6.89,6.89,3.09,6.89,6.89-3.09,6.9-6.89,6.9m5.94,43.49h-11.89V53.97h11.89v38.26ZM98.15,23.92H29.83c-3.27,0-5.92,2.59-5.92,5.78V98.3c0,3.19,2.65,5.78,5.92,5.78H98.15c3.27,0,5.93-2.59,5.93-5.78V29.7c0-3.19-2.66-5.78-5.93-5.78"/></svg>`;
const IN_BUG_BLUE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="22" height="22"><path fill="#0a66c2" d="M92.23,92.23h-11.88v-18.6c0-4.44-.08-10.15-6.18-10.15s-7.14,4.83-7.14,9.83v18.92h-11.88V53.97h11.41v5.23h.16c1.59-3.01,5.47-6.18,11.25-6.18,12.04,0,14.27,7.92,14.27,18.22v20.98ZM41.75,48.74c-3.81,0-6.89-3.09-6.89-6.9s3.08-6.89,6.89-6.89,6.89,3.09,6.89,6.89-3.09,6.9-6.89,6.9m5.94,43.49h-11.89V53.97h11.89v38.26ZM98.15,23.92H29.83c-3.27,0-5.92,2.59-5.92,5.78V98.3c0,3.19,2.65,5.78,5.92,5.78H98.15c3.27,0,5.93-2.59,5.93-5.78V29.7c0-3.19-2.66-5.78-5.93-5.78"/></svg>`;

// Mock attendee for autofill demo
const MOCK = {
  firstName: 'Sarah',
  lastName: 'Chen',
  email: 'sarah.chen@acmecorp.com',
  company: 'Acme Corp',
  profileUrl: 'linkedin.com/in/sarahchen',
  initials: 'SC'
};

const MOCK_JS = JSON.stringify([
  { id: 'f_firstName', value: MOCK.firstName },
  { id: 'f_lastName',  value: MOCK.lastName  },
  { id: 'f_email',     value: MOCK.email     },
  { id: 'f_company',   value: MOCK.company   },
  { id: 'f_linkedin',  value: MOCK.profileUrl },
]);

// ─── Shared base CSS (same as cvent-demo) ────────────────────────────────────
const BASE_CSS = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "Helvetica Neue", Arial, "Segoe UI", sans-serif; background: #fff; color: #333; }
    .banner { background: linear-gradient(135deg, #07082b 0%, #110630 35%, #0c1647 65%, #07082b 100%); position: relative; overflow: hidden; min-height: 220px; }
    .banner::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(rgba(80,120,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(80,120,255,0.07) 1px, transparent 1px); background-size: 44px 44px; pointer-events: none; }
    .banner::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 20% 80%, rgba(130,60,255,0.18) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,80,255,0.15) 0%, transparent 50%); pointer-events: none; }
    .banner-inner { position: relative; z-index: 1; max-width: 960px; margin: 0 auto; padding: 0 32px; }
    .banner-nav { display: flex; align-items: center; justify-content: space-between; padding: 16px 0 0; }
    .banner-logo { display: flex; align-items: center; font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
    .logo-b { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: #fff; color: #07082b; font-size: 18px; font-weight: 900; border-radius: 5px; margin-right: 6px; font-style: italic; }
    .banner-links { display: flex; gap: 20px; list-style: none; }
    .banner-links a { color: rgba(255,255,255,0.88); text-decoration: none; font-size: 13px; font-weight: 500; }
    .banner-content { padding: 28px 0 36px; display: flex; align-items: center; justify-content: space-between; }
    .banner-title-line1 { font-size: 40px; font-weight: 900; color: #fff; letter-spacing: -0.5px; line-height: 1.05; text-transform: uppercase; }
    .banner-title-line2 { font-size: 40px; font-weight: 900; color: #ff2d9b; letter-spacing: -0.5px; line-height: 1.05; text-transform: uppercase; }
    .banner-title-line3 { font-size: 40px; font-weight: 900; color: #fff; letter-spacing: -0.5px; line-height: 1.05; text-transform: uppercase; margin-bottom: 14px; }
    .banner-date { font-size: 15px; color: rgba(255,255,255,0.75); font-weight: 500; }
    .banner-date strong { color: #fff; }
    .banner-orb { width: 180px; height: 180px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #4a3f8f, #1a0a3d 60%, #0a0520); box-shadow: 0 0 60px rgba(130,60,255,0.4), inset 0 0 40px rgba(0,0,0,0.5); flex-shrink: 0; position: relative; overflow: hidden; }
    .banner-orb::after { content: ''; position: absolute; top: 12px; left: 12px; width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.07); }
    .form-area { max-width: 960px; margin: 0 auto; padding: 36px 32px 60px; }
    .form-title { font-size: 30px; font-weight: 700; color: #e0187c; margin-bottom: 28px; }
    .voli-wrap { margin-bottom: 24px; }
    .voli-btn { display: inline-flex; align-items: center; gap: 10px; padding: 13px 22px; background: #0a66c2; color: #fff; border: none; border-radius: 4px; font-size: 15px; font-weight: 600; cursor: pointer; text-decoration: none; transition: background 0.15s; }
    .voli-btn:hover { background: #004182; }
    .voli-btn-sub { font-size: 11px; font-weight: 400; opacity: 0.8; }
    .voli-or { display: flex; align-items: center; gap: 12px; margin: 16px 0 20px; color: #bbb; font-size: 12px; }
    .voli-or::before, .voli-or::after { content: ''; flex: 1; border-top: 1px solid #e8e8e8; }
    .verified-strip { display: inline-flex; align-items: center; gap: 8px; background: #0a66c2; color: #fff; padding: 8px 16px; border-radius: 4px; font-size: 13px; font-weight: 500; margin-bottom: 20px; }
    .v-check { margin-left: 8px; background: #057642; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 700; }
    .profile-row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: #f7f7fb; border: 1px solid #e8e8f0; border-radius: 4px; margin-bottom: 22px; }
    .profile-pic { width: 52px; height: 52px; border-radius: 50%; border: 2px solid #ddd; flex-shrink: 0; background: #0a66c2; color: #fff; font-size: 20px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .profile-info-name { font-size: 16px; font-weight: 700; color: #111; }
    .profile-info-sub { font-size: 13px; color: #666; margin-top: 2px; }
    .field-block { margin-bottom: 18px; }
    .field-label { display: block; font-size: 13px; font-weight: 600; color: #e0187c; margin-bottom: 6px; }
    .field-input-wrap { position: relative; }
    .field-input { width: 100%; padding: 11px 14px; background: #f2f2f2; border: 1.5px solid #e8e8e8; border-radius: 3px; font-size: 14px; color: #333; outline: none; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; font-family: inherit; }
    .field-input.filling { border-color: #0a66c2 !important; background: #eff6ff !important; box-shadow: 0 0 0 3px rgba(10,102,194,0.12) !important; }
    .field-input.filled { border-color: #057642 !important; background: #f0fdf6 !important; }
    .voli-badge { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); display: none; align-items: center; gap: 3px; font-size: 10px; font-weight: 700; color: #0a66c2; background: #dbeafe; padding: 2px 7px; border-radius: 8px; pointer-events: none; }
    .voli-badge.show { display: flex; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .field-select { appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
    .submit-wrap { margin-top: 28px; }
    .submit-btn { display: inline-block; padding: 13px 36px; background: #e0187c; color: #fff; font-size: 15px; font-weight: 700; border: none; border-radius: 4px; cursor: pointer; }
    .section-divider { border: none; border-top: 1px solid #eee; margin: 24px 0; }

    /* ── MODAL ── */
    .modal-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(7,8,43,0.65); backdrop-filter: blur(4px);
      z-index: 200; align-items: center; justify-content: center;
    }
    .modal-overlay.show { display: flex; }
    .modal-card {
      background: #fff; border-radius: 12px; width: 100%; max-width: 400px;
      margin: 20px; overflow: hidden;
      box-shadow: 0 32px 80px rgba(0,0,0,0.35);
      animation: slideUp 0.3s ease;
    }
    @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    .modal-screen { display: none; }
    .modal-screen.active { display: block; }

    /* Bridge screen */
    .bridge-bar { background: #0a66c2; padding: 16px 20px; display: flex; align-items: center; gap: 10px; }
    .bridge-bar-logo { width: 32px; height: 32px; border-radius: 6px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 900; color: #fff; }
    .bridge-bar-name { font-size: 14px; font-weight: 700; color: #fff; }
    .bridge-bar-sub { font-size: 11px; color: rgba(255,255,255,0.7); }
    .bridge-body { padding: 22px 22px 20px; }
    .bridge-event-chip { display: inline-flex; align-items: center; gap: 6px; background: #e3f0fc; color: #004182; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 10px; margin-bottom: 16px; }
    .bridge-chain { display: flex; align-items: center; gap: 6px; background: #f7f7fb; border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; font-size: 12px; font-weight: 600; color: #555; }
    .bridge-chain span { color: #0a66c2; }
    .bridge-chain-arrow { color: #ccc; font-size: 14px; }
    .bridge-msg { font-size: 13px; line-height: 1.7; color: #333; margin-bottom: 20px; }
    .bridge-msg strong { color: #0a66c2; }
    .bridge-continue { width: 100%; padding: 13px; background: #0a66c2; color: #fff; border: none; border-radius: 4px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 10px; }
    .bridge-continue:hover { background: #004182; }
    .bridge-cancel { text-align: center; font-size: 12px; color: #aaa; cursor: pointer; }
    .bridge-cancel:hover { color: #555; }

    /* LinkedIn OAuth screen */
    .li-top { padding: 18px 20px 14px; border-bottom: 1px solid #e8e8e8; display: flex; align-items: center; gap: 10px; }
    .li-top-text { font-size: 14px; font-weight: 700; color: #1b1f23; }
    .li-top-sub { font-size: 11px; color: #888; }
    .li-body { padding: 18px 20px 20px; }
    .li-app-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid #f3f2ef; }
    .li-app-icon { width: 46px; height: 46px; border-radius: 8px; background: #e3f0fc; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; color: #0a66c2; flex-shrink: 0; }
    .li-app-name { font-size: 14px; font-weight: 700; color: #1b1f23; }
    .li-app-sub { font-size: 11px; color: #888; }
    .li-perms-label { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
    .li-perm { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 12px; color: #444; line-height: 1.5; }
    .li-perm-dot { width: 6px; height: 6px; border-radius: 50%; background: #0a66c2; flex-shrink: 0; margin-top: 5px; }
    .li-allow { width: 100%; padding: 12px; background: #0a66c2; color: #fff; border: none; border-radius: 24px; font-size: 14px; font-weight: 700; cursor: pointer; margin-top: 14px; margin-bottom: 8px; }
    .li-allow:hover { background: #004182; }
    .li-decline { text-align: center; font-size: 12px; color: #888; cursor: pointer; }
    .li-decline:hover { color: #333; }
    .li-fine { font-size: 10px; color: #bbb; text-align: center; margin-top: 12px; line-height: 1.5; }

    /* Demo label pill */
    .demo-label {
      position: fixed; bottom: 20px; right: 20px;
      background: #1b1f23; color: #fff;
      font-size: 12px; font-weight: 600;
      padding: 8px 14px; border-radius: 20px;
      z-index: 300; opacity: 0.85;
    }
    .demo-label a { color: #0a9cf4; text-decoration: none; margin-left: 6px; }
`;

// ─── Shared form HTML ─────────────────────────────────────────────────────────
const FORM_HTML = `
  <div class="field-block">
    <label class="field-label"><span style="color:#e0187c">* </span>Registration Type</label>
    <select class="field-input field-select">
      <option>General Admission</option><option>VIP</option><option>Exhibitor</option><option>Speaker</option>
    </select>
  </div>
  <div class="two-col">
    <div class="field-block">
      <label class="field-label" for="f_firstName"><span style="color:#e0187c">* </span>First Name</label>
      <div class="field-input-wrap">
        <input id="f_firstName" class="field-input" type="text" placeholder="First name" value="" data-fill="${MOCK.firstName}" autocomplete="off">
        <span class="voli-badge">VOLI+</span>
      </div>
    </div>
    <div class="field-block">
      <label class="field-label" for="f_lastName"><span style="color:#e0187c">* </span>Last Name</label>
      <div class="field-input-wrap">
        <input id="f_lastName" class="field-input" type="text" placeholder="Last name" value="" data-fill="${MOCK.lastName}" autocomplete="off">
        <span class="voli-badge">VOLI+</span>
      </div>
    </div>
  </div>
  <div class="field-block">
    <label class="field-label" for="f_company"><span style="color:#e0187c">* </span>Company</label>
    <div class="field-input-wrap">
      <input id="f_company" class="field-input" type="text" placeholder="Your company or organization" value="" data-fill="${MOCK.company}" autocomplete="off">
      <span class="voli-badge">VOLI+</span>
    </div>
  </div>
  <div class="field-block">
    <label class="field-label" for="f_jobTitle">Job Title</label>
    <input id="f_jobTitle" class="field-input" type="text" placeholder="Your job title" autocomplete="off">
  </div>
  <div class="field-block">
    <label class="field-label" for="f_email"><span style="color:#e0187c">* </span>Email Address</label>
    <div class="field-input-wrap">
      <input id="f_email" class="field-input" type="email" placeholder="your@email.com" value="" data-fill="${MOCK.email}" autocomplete="off">
      <span class="voli-badge">VOLI+</span>
    </div>
  </div>
  <div class="two-col">
    <div class="field-block">
      <label class="field-label" for="f_mobile"><span style="color:#e0187c">* </span>Mobile</label>
      <input id="f_mobile" class="field-input" type="tel" placeholder="+1 (555) 000-0000" autocomplete="off">
    </div>
    <div class="field-block">
      <label class="field-label" for="f_workphone">Work Phone</label>
      <input id="f_workphone" class="field-input" type="tel" placeholder="+1 (555) 000-0000" autocomplete="off">
    </div>
  </div>
  <div class="field-block">
    <label class="field-label" for="f_linkedin">LinkedIn URL</label>
    <div class="field-input-wrap">
      <input id="f_linkedin" class="field-input" type="url" placeholder="www.linkedin.com/in/yourname" value="" data-fill="${MOCK.profileUrl}" autocomplete="off">
      <span class="voli-badge">VOLI+</span>
    </div>
  </div>
  <hr class="section-divider">
  <div class="submit-wrap">
    <button class="submit-btn" type="button" id="submitBtn">Complete Registration →</button>
  </div>
`;

// ─── Shared autofill JS ───────────────────────────────────────────────────────
const AUTOFILL_JS = `
  var FIELDS = ${MOCK_JS};
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
  async function typeInto(el, value) {
    el.classList.remove('filled'); el.classList.add('filling');
    var badge = el.closest('.field-input-wrap')?.querySelector('.voli-badge');
    if (badge) badge.classList.remove('show');
    for (var i = 0; i <= value.length; i++) {
      el.value = value.slice(0, i);
      await sleep(18 + Math.random() * 18);
    }
    el.classList.remove('filling'); el.classList.add('filled');
    if (badge) badge.classList.add('show');
  }
  async function runAutofill() {
    FIELDS.forEach(f => {
      var el = document.getElementById(f.id);
      if (el) { el.value = ''; el.classList.remove('filled','filling'); var b = el.closest('.field-input-wrap')?.querySelector('.voli-badge'); if (b) b.classList.remove('show'); }
    });
    await sleep(300);
    for (var field of FIELDS) {
      var el = document.getElementById(field.id);
      if (!el || !field.value) continue;
      await typeInto(el, field.value);
      await sleep(80);
    }
  }
`;

// ─── LinkedIn OAuth modal screen (Option 1 style) ─────────────────────────────
const LI_OAUTH_SCREEN = (screenId, onAllowFn) => `
  <div class="modal-screen ${screenId}" id="${screenId}">
    <div class="li-top">
      ${IN_BUG_BLUE}
      <div>
        <div class="li-top-text">LinkedIn</div>
        <div class="li-top-sub">Authorize application</div>
      </div>
    </div>
    <div class="li-body">
      <div class="li-app-row">
        <div class="li-app-icon">C</div>
        <div>
          <div class="li-app-name">Cvent</div>
          <div class="li-app-sub">cvent.com · Event registration platform</div>
        </div>
      </div>
      <div class="li-perms-label">Would like to access:</div>
      <div class="li-perm"><div class="li-perm-dot"></div><span>Your verified work information and employment history</span></div>
      <div class="li-perm"><div class="li-perm-dot"></div><span>Your name and primary email address</span></div>
      <div class="li-perm"><div class="li-perm-dot"></div><span>Your LinkedIn profile URL</span></div>
      <button class="li-allow" onclick="${onAllowFn}()">Allow</button>
      <div class="li-decline" onclick="closeModal()">Decline</div>
      <div class="li-fine">Cvent's use of your information is subject to their privacy policy and LinkedIn's terms of service.</div>
    </div>
  </div>
`;

// ─── LinkedIn OAuth modal screen (Option 2 — real consent screen style) ───────
const LI_OAUTH_SCREEN_V2 = (screenId, onAllowFn) => `
  <div class="modal-screen ${screenId}" id="${screenId}">
    <!-- LinkedIn header -->
    <div class="li2-header">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 34" height="22" fill="#0a66c2">
        <path d="M8.7 25.6H2.1V10.8h6.6v14.8zM5.4 8.2C3.2 8.2 1.4 6.4 1.4 4.2S3.2.2 5.4.2s4 1.8 4 4-1.8 4-4 4zM27.4 25.6h-6.6v-7.2c0-1.7 0-3.9-2.4-3.9s-2.8 1.9-2.8 3.8v7.3h-6.6V10.8h6.3v2h.1c.9-1.7 3-3.4 6.1-3.4 6.5 0 7.7 4.3 7.7 9.8v6.4z"/>
      </svg>
    </div>

    <!-- Overlapping avatars -->
    <div class="li2-avatars">
      <div class="li2-user-avatar">
        ${MOCK.initials}
        <div class="li2-li-badge">in</div>
      </div>
      <div class="li2-app-thumb">
        <div class="li2-df-logo">
          <span class="li2-df-text">DF</span>
          <span class="li2-df-sub">dreamforce</span>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="li2-body">
      <div class="li2-heading"><strong>Salesforce</strong> would like to:</div>
      <ul class="li2-perms">
        <li>Use your LinkedIn profile information and verification details. <a href="#" onclick="return false">Learn more</a></li>
      </ul>
      <div class="li2-not-you">Signed in as ${MOCK.firstName} ${MOCK.lastName} &nbsp;·&nbsp; <a href="#" onclick="return false">Not you?</a></div>
      <button class="li2-cancel" onclick="closeModal()">Cancel</button>
      <button class="li2-allow" onclick="${onAllowFn}()">Allow</button>
      <div class="li2-redirect">You will be redirected to https://events-checkin-beta.vercel.app</div>
      <div class="li2-footer"><a href="#" onclick="return false">Privacy Policy</a> &nbsp;|&nbsp; <a href="#" onclick="return false">User Agreement</a></div>
    </div>
  </div>
`;

// ─── Option 1: Pre-Consent Bridge ────────────────────────────────────────────
function getCventOption1Page() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Option 1 · Pre-Consent Bridge — Shipping Trust Happy Hour</title>
  <style>${BASE_CSS}</style>
</head>
<body>

<!-- BANNER -->
<div class="banner">
  <div class="banner-inner">
    <div class="banner-nav">
      <div class="banner-logo"><span class="logo-b">V</span>VOLI Plus</div>
      <ul class="banner-links">
        <li><a href="#">Summary</a></li><li><a href="#">Agenda</a></li>
        <li><a href="#">Speakers</a></li><li><a href="#">Fees</a></li>
      </ul>
    </div>
    <div class="banner-content">
      <div class="banner-text">
        <div class="banner-title-line1">SHIPPING TRUST</div>
        <div class="banner-title-line2">HAPPY HOUR</div>
        <div class="banner-title-line3">2026</div>
        <div class="banner-date"><strong>March 15, 2026</strong> &nbsp;|&nbsp; SAN FRANCISCO, CA</div>
      </div>
      <div class="banner-orb"></div>
    </div>
  </div>
</div>

<!-- FORM -->
<div class="form-area">
  <h2 class="form-title">Registration Information</h2>

  <div class="voli-wrap">
    <div id="voliEmpty">
      <button class="voli-btn" onclick="openBridge()">
        ${IN_BUG_WHITE}
        <span>Sign in with LinkedIn</span>
      </button>
      <div class="voli-or">or fill in manually below</div>
    </div>
    <div id="voliVerified" style="display:none">
      <div class="verified-strip">
        ${IN_BUG_WHITE}
        <span>Signed in with LinkedIn · VOLI Plus</span>
        <span class="v-check">✓ Identity Verified</span>
      </div>
      <div class="profile-row">
        <div class="profile-pic">${MOCK.initials}</div>
        <div>
          <div class="profile-info-name">${MOCK.firstName} ${MOCK.lastName}</div>
          <div class="profile-info-sub">${MOCK.company}</div>
        </div>
      </div>
    </div>
  </div>

  ${FORM_HTML}
</div>

<!-- ── MODAL ── -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal-card">

    <!-- Screen 1: Bridge -->
    <div class="modal-screen active" id="bridgeScreen">
      <div class="bridge-bar">
        <div class="bridge-bar-logo">C</div>
        <div>
          <div class="bridge-bar-name">Cvent Registration</div>
          <div class="bridge-bar-sub">Secure identity verification</div>
        </div>
      </div>
      <div class="bridge-body">
        <div class="bridge-event-chip">📅 Shipping Trust Happy Hour 2026</div>
        <div class="bridge-chain">
          <span style="color:#333;font-weight:700">Your Event</span>
          <span class="bridge-chain-arrow">→</span>
          <span>Cvent</span>
          <span class="bridge-chain-arrow">→</span>
          <span>LinkedIn</span>
        </div>
        <div class="bridge-msg">
          To verify your professional identity for the <strong>Shipping Trust Happy Hour</strong>, Cvent uses its trusted integration with <strong>LinkedIn</strong>.
          <br><br>
          You'll be asked to securely authorise LinkedIn to share your verified work information. No data is stored beyond what's needed to confirm your registration.
        </div>
        <button class="bridge-continue" onclick="showLinkedIn()">
          ${IN_BUG_WHITE} Continue with LinkedIn
        </button>
        <div class="bridge-cancel" onclick="closeModal()">Cancel registration</div>
      </div>
    </div>

    <!-- Screen 2: LinkedIn OAuth -->
    ${LI_OAUTH_SCREEN('liScreen', 'confirmAllow')}

  </div>
</div>

<div class="demo-label">Option 1 · Pre-Consent Bridge <a href="/cvent-option2">→ See Option 2</a></div>

<script>
  ${AUTOFILL_JS}

  function openBridge() {
    document.getElementById('modalOverlay').classList.add('show');
    document.getElementById('bridgeScreen').classList.add('active');
    document.getElementById('liScreen').classList.remove('active');
  }
  function showLinkedIn() {
    document.getElementById('bridgeScreen').classList.remove('active');
    document.getElementById('liScreen').classList.add('active');
  }
  function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
  }
  function confirmAllow() {
    closeModal();
    document.getElementById('voliEmpty').style.display = 'none';
    document.getElementById('voliVerified').style.display = 'block';
    runAutofill();
  }
</script>
</body>
</html>`;
}

// ─── Option 2: Co-Branding ───────────────────────────────────────────────────
function getCventOption2Page() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Option 2 · Co-Branding — Shipping Trust Happy Hour</title>
  <style>
    ${BASE_CSS}
    .powered-by { font-size: 11px; color: #aaa; margin-top: 8px; }
    .powered-by strong { color: #0a66c2; }
    .gap-pill {
      display: inline-flex; align-items: center; gap: 5px;
      background: #fef3c7; color: #92400e;
      font-size: 11px; font-weight: 700;
      padding: 3px 10px; border-radius: 8px;
      margin-left: 10px; vertical-align: middle;
    }

    /* ── Real LinkedIn consent screen (Option 2) ── */
    .li2-header {
      padding: 14px 20px 12px;
      border-bottom: 1px solid #e8e8e8;
      text-align: center;
    }
    .li2-avatars {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 28px 0 12px;
    }
    .li2-user-avatar {
      width: 76px; height: 76px;
      border-radius: 50%;
      background: #0a66c2;
      color: #fff;
      font-size: 26px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      border: 3px solid #fff;
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
      position: relative;
      z-index: 2;
      margin-right: -14px;
      flex-shrink: 0;
    }
    .li2-li-badge {
      position: absolute;
      bottom: -3px; right: -3px;
      width: 22px; height: 22px;
      background: #0a66c2;
      border-radius: 4px;
      border: 2px solid #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 900; color: #fff;
      font-style: italic;
    }
    .li2-app-thumb {
      width: 76px; height: 76px;
      border-radius: 10px;
      background: linear-gradient(135deg, #00a1e0 0%, #0070d2 100%);
      border: 3px solid #fff;
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
      z-index: 1;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }
    .li2-df-logo {
      display: flex; flex-direction: column; align-items: center; gap: 1px;
    }
    .li2-df-text {
      font-size: 26px; font-weight: 900; color: #fff; line-height: 1;
      font-family: "Helvetica Neue", Arial, sans-serif;
      letter-spacing: -1px;
    }
    .li2-df-sub {
      font-size: 8px; font-weight: 600; color: rgba(255,255,255,0.85);
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .li2-body {
      padding: 6px 24px 20px;
      text-align: center;
    }
    .li2-heading {
      font-size: 16px; color: #1b1f23;
      margin-bottom: 4px; font-weight: 400;
    }
    .li2-heading strong { font-weight: 700; }
    .li2-perms {
      list-style: none;
      text-align: left;
      background: #f3f2ef;
      border-radius: 6px;
      padding: 14px 16px;
      margin: 14px 0 12px;
    }
    .li2-perms li {
      font-size: 13px; color: #444; line-height: 1.6;
      padding-left: 14px; position: relative;
    }
    .li2-perms li::before {
      content: '·';
      position: absolute; left: 0;
      color: #0a66c2; font-size: 18px; line-height: 1.2;
    }
    .li2-perms a { color: #0a66c2; text-decoration: none; }
    .li2-perms a:hover { text-decoration: underline; }
    .li2-not-you {
      font-size: 12px; color: #666; margin-bottom: 16px;
    }
    .li2-not-you a { color: #0a66c2; text-decoration: none; }
    .li2-cancel {
      width: 100%; padding: 11px;
      border: 1.5px solid #0a66c2; background: #fff;
      color: #0a66c2; border-radius: 24px;
      font-size: 14px; font-weight: 700; cursor: pointer;
      margin-bottom: 10px;
      transition: background 0.15s;
    }
    .li2-cancel:hover { background: #e8f0fa; }
    .li2-allow {
      width: 100%; padding: 12px;
      background: #0a66c2; color: #fff;
      border: none; border-radius: 24px;
      font-size: 14px; font-weight: 700; cursor: pointer;
      margin-bottom: 14px;
      transition: background 0.15s;
    }
    .li2-allow:hover { background: #004182; }
    .li2-redirect {
      font-size: 11px; color: #888; text-align: center;
      margin-bottom: 12px; line-height: 1.5;
    }
    .li2-footer {
      font-size: 11px; color: #999; text-align: center;
      border-top: 1px solid #e8e8e8; padding-top: 12px;
    }
    .li2-footer a { color: #999; text-decoration: none; }
    .li2-footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>

<!-- BANNER -->
<div class="banner">
  <div class="banner-inner">
    <div class="banner-nav">
      <div class="banner-logo"><span class="logo-b">V</span>VOLI Plus</div>
      <ul class="banner-links">
        <li><a href="#">Summary</a></li><li><a href="#">Agenda</a></li>
        <li><a href="#">Speakers</a></li><li><a href="#">Fees</a></li>
      </ul>
    </div>
    <div class="banner-content">
      <div class="banner-text">
        <div class="banner-title-line1">SHIPPING TRUST</div>
        <div class="banner-title-line2">HAPPY HOUR</div>
        <div class="banner-title-line3">2026</div>
        <div class="banner-date"><strong>March 15, 2026</strong> &nbsp;|&nbsp; SAN FRANCISCO, CA</div>
      </div>
      <div class="banner-orb"></div>
    </div>
  </div>
</div>

<!-- FORM -->
<div class="form-area">
  <h2 class="form-title">Registration Information</h2>

  <div class="voli-wrap">
    <div id="voliEmpty">
      <button class="voli-btn" onclick="openLinkedIn()">
        ${IN_BUG_WHITE}
        <span>Sign in with LinkedIn</span>
      </button>
      <div class="powered-by">
        Verified professional data securely provided by <strong>Cvent</strong>
        <span class="gap-pill">⚠ Trust gap here</span>
      </div>
      <div class="voli-or">or fill in manually below</div>
    </div>
    <div id="voliVerified" style="display:none">
      <div class="verified-strip">
        ${IN_BUG_WHITE}
        <span>Signed in with LinkedIn · VOLI Plus</span>
        <span class="v-check">✓ Identity Verified</span>
      </div>
      <div class="profile-row">
        <div class="profile-pic">${MOCK.initials}</div>
        <div>
          <div class="profile-info-name">${MOCK.firstName} ${MOCK.lastName}</div>
          <div class="profile-info-sub">${MOCK.company}</div>
        </div>
      </div>
    </div>
  </div>

  ${FORM_HTML}
</div>

<!-- ── MODAL ── -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal-card">
    ${LI_OAUTH_SCREEN_V2('liScreen active', 'confirmAllow')}
  </div>
</div>

<div class="demo-label">Option 2 · Co-Branding <a href="/cvent-option1">← See Option 1</a></div>

<script>
  ${AUTOFILL_JS}

  function openLinkedIn() {
    document.getElementById('modalOverlay').classList.add('show');
  }
  function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
  }
  function confirmAllow() {
    closeModal();
    document.getElementById('voliEmpty').style.display = 'none';
    document.getElementById('voliVerified').style.display = 'block';
    runAutofill();
  }
</script>
</body>
</html>`;
}

module.exports = { getCventOption1Page, getCventOption2Page };
