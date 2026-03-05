const IN_BUG_BLUE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="20" height="20"><path fill="#0a66c2" d="M92.23,92.23h-11.88v-18.6c0-4.44-.08-10.15-6.18-10.15s-7.14,4.83-7.14,9.83v18.92h-11.88V53.97h11.41v5.23h.16c1.59-3.01,5.47-6.18,11.25-6.18,12.04,0,14.27,7.92,14.27,18.22v20.98ZM41.75,48.74c-3.81,0-6.89-3.09-6.89-6.9s3.08-6.89,6.89-6.89,6.89,3.09,6.89,6.89-3.09,6.9-6.89,6.9m5.94,43.49h-11.89V53.97h11.89v38.26ZM98.15,23.92H29.83c-3.27,0-5.92,2.59-5.92,5.78V98.3c0,3.19,2.65,5.78,5.92,5.78H98.15c3.27,0,5.93-2.59,5.93-5.78V29.7c0-3.19-2.66-5.78-5.93-5.78"/></svg>`;
const IN_BUG_WHITE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="18" height="18"><path fill="#fff" d="M92.23,92.23h-11.88v-18.6c0-4.44-.08-10.15-6.18-10.15s-7.14,4.83-7.14,9.83v18.92h-11.88V53.97h11.41v5.23h.16c1.59-3.01,5.47-6.18,11.25-6.18,12.04,0,14.27,7.92,14.27,18.22v20.98ZM41.75,48.74c-3.81,0-6.89-3.09-6.89-6.9s3.08-6.89,6.89-6.89,6.89,3.09,6.89,6.89-3.09,6.9-6.89,6.9m5.94,43.49h-11.89V53.97h11.89v38.26ZM98.15,23.92H29.83c-3.27,0-5.92,2.59-5.92,5.78V98.3c0,3.19,2.65,5.78,5.92,5.78H98.15c3.27,0,5.93-2.59,5.93-5.78V29.7c0-3.19-2.66-5.78-5.93-5.78"/></svg>`;

function getFlowDemoPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trust Gap Visualization — VOLI+</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f3f2ef;
      color: #1b1f23;
      min-height: 100vh;
    }

    /* ── HEADER ── */
    .topbar {
      background: #1b1f23;
      padding: 0 32px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .topbar-brand { display: flex; align-items: center; gap: 10px; color: #fff; font-size: 15px; font-weight: 700; }
    .topbar-meta { font-size: 12px; color: rgba(255,255,255,0.45); }

    /* ── LAYOUT ── */
    .page { max-width: 1100px; margin: 0 auto; padding: 32px 20px 60px; }
    .page-title { font-size: 22px; font-weight: 800; color: #1b1f23; margin-bottom: 4px; }
    .page-sub { font-size: 14px; color: #595959; margin-bottom: 28px; }

    /* ── OPTION TABS ── */
    .tabs { display: flex; gap: 10px; margin-bottom: 28px; }
    .tab {
      padding: 9px 22px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: 2px solid #e0dfdc;
      background: #fff;
      color: #595959;
      transition: all 0.15s;
      position: relative;
    }
    .tab.active { background: #0a66c2; color: #fff; border-color: #0a66c2; }
    .tab .rec-badge {
      position: absolute;
      top: -8px; right: -8px;
      background: #057642;
      color: #fff;
      font-size: 9px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 8px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    /* ── FLOW PANEL ── */
    .flow-panel { display: none; }
    .flow-panel.active { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
    @media (max-width: 800px) { .flow-panel.active { grid-template-columns: 1fr; } }

    /* ── PHONE MOCKUP ── */
    .phone-wrap {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .phone-step { display: none; animation: fadeIn 0.3s ease; }
    .phone-step.active { display: block; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

    /* ── STEP NAV ── */
    .step-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      border-top: 1px solid #e0dfdc;
      background: #f9f9f7;
    }
    .step-nav-btn {
      padding: 8px 18px;
      border-radius: 16px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: 1.5px solid #e0dfdc;
      background: #fff;
      color: #595959;
      transition: all 0.15s;
    }
    .step-nav-btn:hover:not(:disabled) { border-color: #0a66c2; color: #0a66c2; }
    .step-nav-btn:disabled { opacity: 0.35; cursor: default; }
    .step-nav-btn.primary { background: #0a66c2; color: #fff; border-color: #0a66c2; }
    .step-nav-btn.primary:hover { background: #004182; }
    .step-dots { display: flex; gap: 6px; }
    .step-dot { width: 8px; height: 8px; border-radius: 50%; background: #e0dfdc; transition: background 0.2s; }
    .step-dot.active { background: #0a66c2; }

    /* ── ANNOTATION PANEL ── */
    .annotation-panel { display: flex; flex-direction: column; gap: 12px; }
    .annotation-card {
      background: #fff;
      border-radius: 10px;
      padding: 16px 18px;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.08);
      display: none;
      animation: fadeIn 0.3s ease;
    }
    .annotation-card.active { display: block; }
    .annotation-step-label {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #0a66c2;
      margin-bottom: 6px;
    }
    .annotation-title { font-size: 15px; font-weight: 700; color: #1b1f23; margin-bottom: 8px; }
    .annotation-body { font-size: 13px; color: #595959; line-height: 1.6; }
    .trust-meter { margin-top: 12px; }
    .trust-label { font-size: 11px; font-weight: 600; color: #888; margin-bottom: 5px; }
    .trust-bar-bg { background: #f3f2ef; border-radius: 4px; height: 6px; overflow: hidden; }
    .trust-bar-fill { height: 100%; border-radius: 4px; transition: width 0.4s ease; }
    .trust-high  { background: #057642; }
    .trust-med   { background: #c37d16; }
    .trust-low   { background: #e53935; }
    .pm-rec {
      background: #f0fdf4;
      border: 1.5px solid #057642;
      border-radius: 10px;
      padding: 14px 16px;
      font-size: 12px;
      color: #1b1f23;
      line-height: 1.6;
      margin-top: 4px;
    }
    .pm-rec strong { color: #057642; }

    /* ── SCREEN CONTENTS ── */
    .screen-header {
      padding: 14px 18px 10px;
      border-bottom: 1px solid #f3f2ef;
      font-size: 11px;
      color: #888;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .screen-dot { width: 8px; height: 8px; border-radius: 50%; }
    .screen-body { padding: 22px 20px 20px; }

    /* Acme event screen */
    .event-banner {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 18px;
      color: #fff;
    }
    .event-banner-logo { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.5); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
    .event-banner-title { font-size: 20px; font-weight: 900; line-height: 1.1; margin-bottom: 6px; }
    .event-banner-date { font-size: 12px; color: rgba(255,255,255,0.6); }
    .linkedin-btn-demo {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      width: 100%; padding: 13px; background: #0a66c2; color: #fff;
      border: none; border-radius: 4px; font-size: 14px; font-weight: 600;
      cursor: pointer; margin-bottom: 10px;
    }
    .powered-sub { font-size: 11px; color: #999; text-align: center; margin-top: 6px; }
    .powered-sub strong { color: #0a66c2; }

    /* Pre-consent bridge screen */
    .bridge-header {
      background: #0a66c2;
      padding: 16px 20px;
      display: flex; align-items: center; gap: 10px;
    }
    .bridge-header span { color: #fff; font-size: 14px; font-weight: 700; }
    .bridge-body { padding: 22px 20px; }
    .bridge-event-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: #e3f0fc; color: #004182;
      font-size: 12px; font-weight: 700;
      padding: 4px 10px; border-radius: 12px; margin-bottom: 14px;
    }
    .bridge-message {
      font-size: 14px; line-height: 1.7; color: #1b1f23; margin-bottom: 20px;
    }
    .bridge-message strong { color: #0a66c2; }
    .bridge-continue {
      width: 100%; padding: 12px; background: #0a66c2; color: #fff;
      border: none; border-radius: 4px; font-size: 14px; font-weight: 600;
      cursor: pointer; margin-bottom: 10px; text-align: center; display: block;
    }
    .bridge-cancel { font-size: 12px; color: #888; text-align: center; cursor: pointer; }
    .trust-chain {
      display: flex; align-items: center; gap: 6px;
      background: #f9f9f7; border-radius: 6px; padding: 10px 12px; margin-bottom: 16px;
      font-size: 11px; color: #595959; font-weight: 600;
    }
    .trust-chain-arrow { color: #bbb; }

    /* LinkedIn OAuth screen */
    .li-header {
      background: #fff;
      border-bottom: 1px solid #e0dfdc;
      padding: 14px 20px;
      display: flex; align-items: center; gap: 10px;
    }
    .li-header-text { font-size: 13px; font-weight: 700; color: #1b1f23; }
    .li-header-sub { font-size: 11px; color: #888; }
    .li-body { padding: 18px 20px; }
    .li-app-row {
      display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
      padding-bottom: 14px; border-bottom: 1px solid #f3f2ef;
    }
    .li-app-icon {
      width: 44px; height: 44px; border-radius: 8px;
      background: #e3f0fc; display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 900; color: #0a66c2; flex-shrink: 0;
    }
    .li-app-name { font-size: 14px; font-weight: 700; color: #1b1f23; }
    .li-app-sub { font-size: 11px; color: #888; }
    .li-perm { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 10px; font-size: 12px; color: #595959; }
    .li-perm-dot { width: 6px; height: 6px; border-radius: 50%; background: #0a66c2; margin-top: 5px; flex-shrink: 0; }
    .li-allow-btn {
      width: 100%; padding: 11px; background: #0a66c2; color: #fff;
      border: none; border-radius: 24px; font-size: 14px; font-weight: 700;
      cursor: pointer; margin-top: 14px; margin-bottom: 8px;
    }
    .li-decline { font-size: 12px; color: #888; text-align: center; cursor: pointer; }
    .li-disclaimer { font-size: 10px; color: #bbb; text-align: center; margin-top: 12px; line-height: 1.5; }

    /* Gap callout */
    .gap-callout {
      background: #fef9c3;
      border: 1.5px solid #f59e0b;
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 12px;
      color: #92400e;
      margin-top: 12px;
      line-height: 1.5;
    }
    .gap-callout strong { color: #b45309; }
  </style>
</head>
<body>

<div class="topbar">
  <div class="topbar-brand">${IN_BUG_BLUE} <span style="color:#0a66c2">Verified on LinkedIn</span> &nbsp;·&nbsp; <span style="font-weight:400;color:rgba(255,255,255,0.6)">Trust Gap Architecture</span></div>
  <div class="topbar-meta">For Cvent Partnership Discussion</div>
</div>

<div class="page">
  <div class="page-title">Multi-Tenant Trust Gap — Two Options</div>
  <div class="page-sub">Single-app architecture · Attendee sees "Cvent" not the partner brand · Click through each flow below</div>

  <div class="tabs">
    <div class="tab active" onclick="switchOption(1)" id="tab1">
      Option 1 · Pre-Consent Bridge
      <span class="rec-badge">Recommended</span>
    </div>
    <div class="tab" onclick="switchOption(2)" id="tab2">Option 2 · Co-Branding</div>
  </div>

  <!-- ═══ OPTION 1 ═══ -->
  <div class="flow-panel active" id="panel1">

    <!-- Phone mockup -->
    <div>
      <div class="phone-wrap">

        <!-- Step 1: Acme event page -->
        <div class="phone-step active" id="o1-step1">
          <div class="screen-header">
            <div class="screen-dot" style="background:#34c759"></div>
            Screen 1 of 3 · Partner Event Page
          </div>
          <div class="screen-body">
            <div class="event-banner">
              <div class="event-banner-logo">Acme Corp</div>
              <div class="event-banner-title">Tech Summit 2026</div>
              <div class="event-banner-date">March 15, 2026 · San Francisco</div>
            </div>
            <p style="font-size:13px;color:#595959;margin-bottom:16px;line-height:1.6">
              To complete your registration, verify your professional identity.
            </p>
            <button class="linkedin-btn-demo">
              ${IN_BUG_WHITE} Register with LinkedIn
            </button>
          </div>
        </div>

        <!-- Step 2: Pre-consent bridge -->
        <div class="phone-step" id="o1-step2">
          <div class="bridge-header">
            <svg width="22" height="22" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="6" fill="white" fill-opacity="0.15"/><text x="20" y="27" text-anchor="middle" font-size="18" font-weight="800" fill="white">C</text></svg>
            <span>Cvent Registration</span>
          </div>
          <div class="bridge-body">
            <div class="bridge-event-badge">📅 Acme Corp Tech Summit 2026</div>
            <div class="trust-chain">
              <span>Acme Corp</span>
              <span class="trust-chain-arrow">→</span>
              <span style="color:#0a66c2">Cvent</span>
              <span class="trust-chain-arrow">→</span>
              <span style="color:#0a66c2">LinkedIn</span>
            </div>
            <div class="bridge-message">
              To verify your professional identity for the <strong>Acme Corp Tech Summit</strong>, we use our trusted partner <strong>LinkedIn</strong>.
              <br><br>
              You will be asked to securely connect your LinkedIn account. No data is stored beyond what is needed to verify your registration.
            </div>
            <div class="bridge-continue">Continue with LinkedIn →</div>
            <div class="bridge-cancel">Cancel registration</div>
          </div>
        </div>

        <!-- Step 3: LinkedIn OAuth -->
        <div class="phone-step" id="o1-step3">
          <div class="li-header">
            ${IN_BUG_BLUE}
            <div>
              <div class="li-header-text">LinkedIn</div>
              <div class="li-header-sub">Authorize application</div>
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
            <div style="font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Would like to access:</div>
            <div class="li-perm"><div class="li-perm-dot"></div><span>Your verified work information and employment history</span></div>
            <div class="li-perm"><div class="li-perm-dot"></div><span>Your name and primary email address</span></div>
            <div class="li-perm"><div class="li-perm-dot"></div><span>Your LinkedIn profile URL</span></div>
            <button class="li-allow-btn">Allow</button>
            <div class="li-decline">Decline</div>
            <div class="li-disclaimer">Cvent's use of your information is subject to their privacy policy. LinkedIn is not responsible for how Cvent uses your data.</div>
          </div>
        </div>

        <!-- Nav -->
        <div class="step-nav">
          <button class="step-nav-btn" id="o1-prev" onclick="step(1,-1)" disabled>← Back</button>
          <div class="step-dots">
            <div class="step-dot active" id="o1-dot1"></div>
            <div class="step-dot" id="o1-dot2"></div>
            <div class="step-dot" id="o1-dot3"></div>
          </div>
          <button class="step-nav-btn primary" id="o1-next" onclick="step(1,1)">Next →</button>
        </div>

      </div>
    </div>

    <!-- Annotation panel -->
    <div class="annotation-panel">

      <div class="annotation-card active" id="o1-ann1">
        <div class="annotation-step-label">Step 1 · Partner Event Page</div>
        <div class="annotation-title">Attendee context: Acme Corp</div>
        <div class="annotation-body">The attendee sees the partner's brand throughout. They know they're registering for an Acme Corp event. Trust is fully anchored to the partner at this point.</div>
        <div class="trust-meter">
          <div class="trust-label">Trust in flow</div>
          <div class="trust-bar-bg"><div class="trust-bar-fill trust-high" style="width:90%"></div></div>
        </div>
      </div>

      <div class="annotation-card" id="o1-ann2">
        <div class="annotation-step-label">Step 2 · Pre-Consent Bridge ✦ Key Screen</div>
        <div class="annotation-title">The trust chain is made explicit</div>
        <div class="annotation-body">Cvent explains the three-party relationship before the LinkedIn popup. The attendee understands: <em>Acme Corp → Cvent (technology) → LinkedIn (data).</em> No ambiguity about who is asking or why.</div>
        <div class="trust-meter">
          <div class="trust-label">Trust in flow</div>
          <div class="trust-bar-bg"><div class="trust-bar-fill trust-high" style="width:95%"></div></div>
        </div>
        <div class="pm-rec" style="margin-top:12px">
          <strong>PM Note:</strong> This screen is the entire solution. It costs Cvent one extra screen but eliminates the trust gap completely.
        </div>
      </div>

      <div class="annotation-card" id="o1-ann3">
        <div class="annotation-step-label">Step 3 · LinkedIn OAuth (Standard)</div>
        <div class="annotation-title">"Cvent" — no surprise</div>
        <div class="annotation-body">Because of Step 2, the attendee already knows Cvent is the technology layer. Seeing "Cvent would like to access" on LinkedIn's standard consent screen is expected, not jarring. No legal exceptions needed — this is the standard OAuth flow.</div>
        <div class="trust-meter">
          <div class="trust-label">Trust in flow</div>
          <div class="trust-bar-bg"><div class="trust-bar-fill trust-high" style="width:88%"></div></div>
        </div>
      </div>

    </div>
  </div>

  <!-- ═══ OPTION 2 ═══ -->
  <div class="flow-panel" id="panel2">

    <!-- Phone mockup -->
    <div>
      <div class="phone-wrap">

        <!-- Step 1: Co-branded button -->
        <div class="phone-step active" id="o2-step1">
          <div class="screen-header">
            <div class="screen-dot" style="background:#34c759"></div>
            Screen 1 of 2 · Partner Event Page
          </div>
          <div class="screen-body">
            <div class="event-banner">
              <div class="event-banner-logo">Acme Corp</div>
              <div class="event-banner-title">Tech Summit 2026</div>
              <div class="event-banner-date">March 15, 2026 · San Francisco</div>
            </div>
            <p style="font-size:13px;color:#595959;margin-bottom:16px;line-height:1.6">
              To complete your registration, verify your professional identity.
            </p>
            <button class="linkedin-btn-demo">
              ${IN_BUG_WHITE} Sign in with LinkedIn
            </button>
            <div class="powered-sub">Verified professional data securely provided by <strong>Cvent</strong></div>
            <div class="gap-callout" style="margin-top:14px">
              <strong>Trust gap:</strong> A one-line disclaimer doesn't explain why Cvent is involved or what data will be shared. Most attendees won't read it.
            </div>
          </div>
        </div>

        <!-- Step 2: LinkedIn OAuth — surprise -->
        <div class="phone-step" id="o2-step2">
          <div class="li-header">
            ${IN_BUG_BLUE}
            <div>
              <div class="li-header-text">LinkedIn</div>
              <div class="li-header-sub">Authorize application</div>
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
            <div style="font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Would like to access:</div>
            <div class="li-perm"><div class="li-perm-dot"></div><span>Your verified work information and employment history</span></div>
            <div class="li-perm"><div class="li-perm-dot"></div><span>Your name and primary email address</span></div>
            <div class="li-perm"><div class="li-perm-dot"></div><span>Your LinkedIn profile URL</span></div>
            <button class="li-allow-btn">Allow</button>
            <div class="li-decline">Decline</div>
            <div class="gap-callout" style="margin-top:10px">
              <strong>Trust gap:</strong> Attendee clicked "Sign in with LinkedIn" but now sees "Cvent" — a brand they may not recognise. Drop-off risk is high here.
            </div>
          </div>
        </div>

        <!-- Nav -->
        <div class="step-nav">
          <button class="step-nav-btn" id="o2-prev" onclick="step(2,-1)" disabled>← Back</button>
          <div class="step-dots">
            <div class="step-dot active" id="o2-dot1"></div>
            <div class="step-dot" id="o2-dot2"></div>
          </div>
          <button class="step-nav-btn primary" id="o2-next" onclick="step(2,1)">Next →</button>
        </div>

      </div>
    </div>

    <!-- Annotation panel -->
    <div class="annotation-panel">

      <div class="annotation-card active" id="o2-ann1">
        <div class="annotation-step-label">Step 1 · Partner Event Page</div>
        <div class="annotation-title">Small print ≠ trust</div>
        <div class="annotation-body">The "powered by Cvent" line below the button is easy to miss and doesn't explain the purpose of the data request. The attendee has no preparation for what's coming next.</div>
        <div class="trust-meter">
          <div class="trust-label">Trust in flow</div>
          <div class="trust-bar-bg"><div class="trust-bar-fill trust-med" style="width:60%"></div></div>
        </div>
      </div>

      <div class="annotation-card" id="o2-ann2">
        <div class="annotation-step-label">Step 2 · LinkedIn OAuth ⚠ Trust Gap</div>
        <div class="annotation-title">"Who is Cvent?" — drop-off risk</div>
        <div class="annotation-body">The attendee expected to see the partner brand (Acme Corp) or LinkedIn itself. Instead they see an unfamiliar third party (Cvent) asking for professional verification data. This is the trust gap in its clearest form.</div>
        <div class="trust-meter">
          <div class="trust-label">Trust in flow</div>
          <div class="trust-bar-bg"><div class="trust-bar-fill trust-low" style="width:35%"></div></div>
        </div>
        <div class="pm-rec" style="margin-top:12px;border-color:#e53935;background:#fef2f2">
          <strong style="color:#b91c1c">Risk:</strong> LinkedIn's brand guidelines make non-standard button co-branding legally complex. This option requires sign-off from LinkedIn's Legal and Brand teams.
        </div>
      </div>

    </div>
  </div>

</div>

<script>
  var state = { 1: 1, 2: 1 };
  var maxSteps = { 1: 3, 2: 2 };

  function switchOption(n) {
    document.getElementById('panel1').classList.toggle('active', n === 1);
    document.getElementById('panel2').classList.toggle('active', n === 2);
    document.getElementById('tab1').classList.toggle('active', n === 1);
    document.getElementById('tab2').classList.toggle('active', n === 2);
  }

  function step(opt, dir) {
    var cur = state[opt];
    var next = cur + dir;
    var max = maxSteps[opt];
    if (next < 1 || next > max) return;

    // hide current
    document.getElementById('o' + opt + '-step' + cur).classList.remove('active');
    document.getElementById('o' + opt + '-ann'  + cur).classList.remove('active');
    document.getElementById('o' + opt + '-dot'  + cur).classList.remove('active');

    // show next
    state[opt] = next;
    document.getElementById('o' + opt + '-step' + next).classList.add('active');
    document.getElementById('o' + opt + '-ann'  + next).classList.add('active');
    document.getElementById('o' + opt + '-dot'  + next).classList.add('active');

    // update buttons
    document.getElementById('o' + opt + '-prev').disabled = (next === 1);
    var nextBtn = document.getElementById('o' + opt + '-next');
    nextBtn.disabled = (next === max);
    nextBtn.textContent = next === max ? 'Done ✓' : 'Next →';
    nextBtn.classList.toggle('primary', next < max);
  }
</script>

</body>
</html>`;
}

module.exports = { getFlowDemoPage };
