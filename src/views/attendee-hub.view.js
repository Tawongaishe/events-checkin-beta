const IN_BUG_WHITE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="20" height="20"><path fill="#fff" d="M92.23,92.23h-11.88v-18.6c0-4.44-.08-10.15-6.18-10.15s-7.14,4.83-7.14,9.83v18.92h-11.88V53.97h11.41v5.23h.16c1.59-3.01,5.47-6.18,11.25-6.18,12.04,0,14.27,7.92,14.27,18.22v20.98ZM41.75,48.74c-3.81,0-6.89-3.09-6.89-6.9s3.08-6.89,6.89-6.89,6.89,3.09,6.89,6.89-3.09,6.9-6.89,6.9m5.94,43.49h-11.89V53.97h11.89v38.26ZM98.15,23.92H29.83c-3.27,0-5.92,2.59-5.92,5.78V98.3c0,3.19,2.65,5.78,5.92,5.78H98.15c3.27,0,5.93-2.59,5.93-5.78V29.7c0-3.19-2.66-5.78-5.93-5.78"/></svg>`;
const IN_BUG_BLUE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="20" height="20"><path fill="#0a66c2" d="M92.23,92.23h-11.88v-18.6c0-4.44-.08-10.15-6.18-10.15s-7.14,4.83-7.14,9.83v18.92h-11.88V53.97h11.41v5.23h.16c1.59-3.01,5.47-6.18,11.25-6.18,12.04,0,14.27,7.92,14.27,18.22v20.98ZM41.75,48.74c-3.81,0-6.89-3.09-6.89-6.9s3.08-6.89,6.89-6.89,6.89,3.09,6.89,6.89-3.09,6.9-6.89,6.9m5.94,43.49h-11.89V53.97h11.89v38.26ZM98.15,23.92H29.83c-3.27,0-5.92,2.59-5.92,5.78V98.3c0,3.19,2.65,5.78,5.92,5.78H98.15c3.27,0,5.93-2.59,5.93-5.78V29.7c0-3.19-2.66-5.78-5.93-5.78"/></svg>`;

function getAttendeeHubPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Attendee Hub — Cvent Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #d8dbe8;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif;
      gap: 16px;
    }

    /* Demo state toggle */
    .demo-toggle {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(0,0,0,0.12);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: #333;
    }
    .toggle-pill {
      width: 44px; height: 24px;
      background: #ccc;
      border-radius: 12px;
      position: relative;
      cursor: pointer;
      transition: background 0.25s;
    }
    .toggle-pill.on { background: #0a66c2; }
    .toggle-knob {
      position: absolute;
      top: 3px; left: 3px;
      width: 18px; height: 18px;
      background: #fff;
      border-radius: 50%;
      transition: left 0.25s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .toggle-pill.on .toggle-knob { left: 23px; }

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
      top: 14px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 34px;
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
      padding: 60px 28px 8px;
      color: #fff;
    }
    .status-time { font-size: 16px; font-weight: 700; }
    .status-icons { display: flex; align-items: center; gap: 6px; }
    .status-icons svg { fill: #fff; }

    /* App header */
    .app-header {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 20px 10px;
      color: #fff;
    }
    .header-back { display: flex; align-items: center; gap: 4px; color: #fff; cursor: pointer; }
    .header-title { font-size: 17px; font-weight: 600; color: #fff; }
    .header-menu { font-size: 20px; color: #fff; cursor: pointer; letter-spacing: 2px; line-height: 1; }

    /* Scrollable content */
    .screen-scroll {
      flex: 1;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }
    .screen-scroll::-webkit-scrollbar { display: none; }

    /* Profile photo */
    .profile-photo-wrap { width: 100%; height: 260px; overflow: hidden; }
    .profile-photo { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }

    /* Profile info */
    .profile-info {
      background: #1e1e72;
      padding: 18px 22px 16px;
      text-align: center;
    }
    .name-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 4px;
    }
    .attendee-name { font-size: 22px; font-weight: 700; color: #fff; line-height: 1.2; }
    .li-bug {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px; height: 36px;
      background: #0a66c2;
      border-radius: 7px;
      text-decoration: none;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    .li-bug:hover { background: #004182; }
    .pronouns { font-size: 14px; color: rgba(255,255,255,0.55); margin-bottom: 10px; }
    .attendee-title { font-size: 16px; color: rgba(255,255,255,0.9); font-weight: 500; margin-bottom: 2px; }
    .attendee-company { font-size: 15px; color: rgba(255,255,255,0.65); }

    /* Action buttons */
    .action-row {
      display: flex;
      justify-content: center;
      gap: 20px;
      padding: 16px 22px 18px;
      background: #1e1e72;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .action-btn {
      width: 52px; height: 52px;
      border-radius: 50%;
      background: rgba(255,255,255,0.12);
      border: 1.5px solid rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
    }
    .action-btn svg { fill: #fff; }

    /* Scrollable cards */
    .scroll-card {
      background: #2a2a80;
      border-radius: 12px;
      margin: 10px 12px;
      padding: 14px 16px;
    }
    .scroll-card-title {
      font-size: 13px;
      font-weight: 700;
      color: rgba(255,255,255,0.6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    /* Connected row */
    .connected-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 0 12px;
    }
    .connected-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      border: 2px solid rgba(255,255,255,0.3);
      display: flex; align-items: center; justify-content: center;
      position: relative;
    }
    .connected-check {
      position: absolute;
      bottom: -2px; right: -2px;
      width: 14px; height: 14px;
      background: #057642;
      border-radius: 50%;
      border: 1.5px solid #2a2a80;
      display: flex; align-items: center; justify-content: center;
      font-size: 8px;
      color: #fff;
      font-weight: 900;
    }
    .connected-text { font-size: 14px; font-weight: 600; color: #fff; }

    /* Connections avatars */
    .connections-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .avatar-stack { display: flex; align-items: center; }
    .stack-avatar {
      width: 38px; height: 38px;
      border-radius: 50%;
      border: 2px solid #2a2a80;
      margin-left: -10px;
      background: linear-gradient(135deg, #5b5bd6, #3535a0);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; color: #fff;
      flex-shrink: 0;
    }
    .stack-avatar:first-child { margin-left: 0; }
    .stack-avatar.plus { background: rgba(255,255,255,0.15); font-size: 12px; }
    .connections-count { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 6px; }
    .location-col { text-align: right; }
    .location-dot { font-size: 18px; margin-bottom: 4px; }
    .location-text { font-size: 12px; color: rgba(255,255,255,0.7); }

    /* Interest tags */
    .tags-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag {
      padding: 6px 12px;
      border: 1.5px solid rgba(255,255,255,0.25);
      border-radius: 20px;
      font-size: 12px;
      color: rgba(255,255,255,0.85);
      font-weight: 500;
    }

    /* Social links */
    .social-row { display: flex; gap: 12px; }
    .social-btn {
      width: 40px; height: 40px;
      border-radius: 50%;
      background: rgba(255,255,255,0.12);
      border: 1.5px solid rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      font-size: 15px; font-weight: 700; color: #fff;
    }

    /* ── Verified on LinkedIn section ── */
    .voli-section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;
    }
    .voli-section-label {
      font-size: 15px;
      font-weight: 700;
      color: #fff;
      flex: 1;
    }

    /* Info icon + tooltip */
    .info-wrap {
      position: relative;
      display: inline-flex;
    }
    .info-icon {
      width: 20px; height: 20px;
      border-radius: 50%;
      border: 1.5px solid rgba(255,255,255,0.4);
      color: rgba(255,255,255,0.5);
      font-size: 11px;
      font-weight: 700;
      font-style: italic;
      display: flex; align-items: center; justify-content: center;
      cursor: default;
      user-select: none;
      flex-shrink: 0;
    }
    .info-tooltip {
      display: none;
      position: absolute;
      bottom: calc(100% + 8px);
      right: 0;
      width: 220px;
      background: #111827;
      color: rgba(255,255,255,0.88);
      font-size: 12px;
      line-height: 1.5;
      font-weight: 400;
      padding: 10px 12px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      z-index: 50;
      font-style: normal;
    }
    .info-tooltip::after {
      content: '';
      position: absolute;
      top: 100%; right: 6px;
      border: 5px solid transparent;
      border-top-color: #111827;
    }
    .info-wrap:hover .info-tooltip { display: block; }

    /* Unverified: filled blue pill button */
    .verify-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 13px 20px;
      background: #0a66c2;
      border: none;
      border-radius: 50px;
      color: #fff;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s;
      text-decoration: none;
      margin-bottom: 10px;
    }
    .verify-btn:hover { background: #004182; }
    .verify-hint {
      font-size: 12px;
      color: rgba(255,255,255,0.45);
      text-align: center;
      line-height: 1.5;
    }

    /* Verified: detail card */
    .verified-card {
      background: rgba(10,102,194,0.12);
      border: 1.5px solid #0a66c2;
      border-radius: 10px;
      overflow: hidden;
    }
    .verified-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px 10px;
      border-bottom: 1px solid rgba(10,102,194,0.3);
    }
    .verified-card-icon {
      width: 28px; height: 28px;
      background: #0a66c2;
      border-radius: 5px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .verified-card-title {
      font-size: 14px;
      font-weight: 700;
      color: #7ab8f5;
      flex: 1;
    }
    .verified-card-check {
      width: 22px; height: 22px;
      background: #057642;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px;
      color: #fff;
      font-weight: 900;
      flex-shrink: 0;
    }
    .verified-card-body { padding: 12px 14px 14px; }
    .verified-field {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .verified-field:last-of-type { margin-bottom: 0; }
    .verified-field-label {
      font-size: 11px;
      color: rgba(255,255,255,0.45);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      width: 72px;
      flex-shrink: 0;
    }
    .verified-field-value {
      font-size: 14px;
      color: #fff;
      font-weight: 600;
    }
    .verified-card-footer {
      padding: 10px 14px 12px;
      border-top: 1px solid rgba(10,102,194,0.3);
    }
    .verified-card-link {
      font-size: 12px;
      color: #7ab8f5;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .verified-card-link:hover { text-decoration: underline; }

    /* Bottom nav */
    .bottom-nav {
      flex-shrink: 0;
      background: #14144e;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 12px 10px 28px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; opacity: 0.45; }
    .nav-item.active { opacity: 1; }
    .nav-item svg { fill: #fff; }
    .nav-dot { width: 4px; height: 4px; border-radius: 50%; background: #fff; }
  </style>
</head>
<body>

  <!-- Demo state toggle (outside phone) -->
  <div class="demo-toggle">
    <span>Unverified</span>
    <div class="toggle-pill" id="togglePill" onclick="toggleVerified()">
      <div class="toggle-knob"></div>
    </div>
    <span>Verified</span>
  </div>

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

    <!-- App header -->
    <div class="app-header">
      <div class="header-back">
        <svg width="10" height="17" viewBox="0 0 10 17" fill="#fff"><path d="M9 1L1 8.5 9 16" stroke="#fff" stroke-width="1.5" fill="none"/></svg>
      </div>
      <div class="header-title">Attendee Details</div>
      <div class="header-menu">···</div>
    </div>

    <!-- Scrollable screen content -->
    <div class="screen-scroll">

      <!-- Profile photo -->
      <div class="profile-photo-wrap">
        <img src="/images/pujita.jpg" class="profile-photo" alt="Pujita Tipnis">
      </div>

      <!-- Profile info -->
      <div class="profile-info">
        <div class="name-row">
          <div class="attendee-name">Ms. Pujita Tipnis</div>
          <a class="li-bug" href="https://www.linkedin.com/in/tawongaishe" target="_blank" rel="noopener">
            ${IN_BUG_WHITE}
          </a>
        </div>
        <div class="pronouns">she/her</div>
        <div class="attendee-title">Product Designer</div>
        <div class="attendee-company">Cvent Inc</div>
      </div>

      <!-- Action buttons -->
      <div class="action-row">
        <div class="action-btn">
          <svg width="22" height="22" viewBox="0 0 24 24"><path d="M15 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"/></svg>
        </div>
        <div class="action-btn">
          <svg width="22" height="22" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        </div>
      </div>

      <!-- LinkedIn section (near top, state-driven) -->
      <div class="scroll-card" id="linkedinSection">
        <div class="voli-section-header">
          <div class="voli-section-label" style="display:flex;align-items:center;gap:8px;">
            <span style="width:22px;height:22px;background:#0a66c2;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">${IN_BUG_WHITE}</span>
            LinkedIn
          </div>
          <div class="info-wrap">
            <div class="info-icon">i</div>
            <div class="info-tooltip">Connecting with LinkedIn pulls in your verified profile, workplace and shared connections — so fellow attendees can see the full picture.</div>
          </div>
        </div>

        <!-- Unverified state -->
        <div id="stateUnverified">
          <a class="verify-btn" href="/attendee-hub-auth">
            ${IN_BUG_WHITE}
            Enhance with LinkedIn
          </a>
          <div class="verify-hint">Enhancing with LinkedIn can improve your attendee experience — we'll pull in your profile info, verifications, and networking data. If you have LinkedIn verifications, those will be shown to other attendees.</div>
        </div>

        <!-- Verified state -->
        <div id="stateVerified" style="display:none">

          <!-- Network at event -->
          <div class="connections-row" style="margin-bottom:14px;">
            <div>
              <div class="avatar-stack">
                <div class="stack-avatar">JM</div>
                <div class="stack-avatar">AL</div>
                <div class="stack-avatar">RK</div>
                <div class="stack-avatar plus">+9</div>
              </div>
              <div class="connections-count">12 LinkedIn connections at this event</div>
            </div>
          </div>

          <!-- Verified identity card -->
          <div class="verified-card">
            <div class="verified-card-header">
              <div class="verified-card-icon">${IN_BUG_WHITE}</div>
              <div class="verified-card-title">Verified on LinkedIn</div>
              <div class="verified-card-check">✓</div>
            </div>
            <div class="verified-card-body">
              <div class="verified-field">
                <div class="verified-field-label">Identity</div>
                <div class="verified-field-value">Pujita Tipnis</div>
              </div>
              <div class="verified-field">
                <div class="verified-field-label">Workplace</div>
                <div class="verified-field-value">Cvent Inc</div>
              </div>
            </div>
            <div class="verified-card-footer">
              <a class="verified-card-link" href="https://www.linkedin.com/in/tawongaishe" target="_blank" rel="noopener">
                View LinkedIn profile &nbsp;↗
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Interests -->
      <div class="scroll-card">
        <div class="scroll-card-title">Interests</div>
        <div class="tags-wrap">
          <div class="tag">Accessibility</div>
          <div class="tag">Big data</div>
          <div class="tag">Customer relationship management (CRM)</div>
          <div class="tag">Journalism</div>
          <div class="tag">Search engine optimization (SEO)</div>
        </div>
      </div>

      <!-- Social media links -->
      <div class="scroll-card">
        <div class="scroll-card-title">Social media links</div>
        <div class="social-row">
          <div class="social-btn">f</div>
          <div class="social-btn">𝕏</div>
          <div class="social-btn">${IN_BUG_WHITE}</div>
        </div>
      </div>

      <!-- Spacer at bottom of scroll -->
      <div style="height: 16px;"></div>

    </div><!-- end screen-scroll -->

    <!-- Bottom nav -->
    <div class="bottom-nav">
      <div class="nav-item">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
      </div>
      <div class="nav-item">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
      </div>
      <div class="nav-item">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="#fff" stroke-width="2" fill="none"/></svg>
      </div>
      <div class="nav-item active">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        <div class="nav-dot"></div>
      </div>
      <div class="nav-item">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
      </div>
    </div>

  </div><!-- end iphone -->

<script>
  var verified = new URLSearchParams(window.location.search).get('verified') === 'true';

  function applyState() {
    var pill = document.getElementById('togglePill');
    var unverified = document.getElementById('stateUnverified');
    var verifiedEl = document.getElementById('stateVerified');
    if (verified) {
      pill.classList.add('on');
      unverified.style.display = 'none';
      verifiedEl.style.display = 'block';
    } else {
      pill.classList.remove('on');
      unverified.style.display = 'block';
      verifiedEl.style.display = 'none';
    }
  }

  function toggleVerified() {
    verified = !verified;
    applyState();
    if (verified) {
      document.getElementById('stateVerified').closest('.scroll-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Apply on load (handles ?verified=true redirect from OAuth)
  applyState();
  if (verified) {
    setTimeout(function() {
      document.getElementById('stateVerified').closest('.scroll-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
  }
</script>
</body>
</html>`;
}

module.exports = { getAttendeeHubPage };
