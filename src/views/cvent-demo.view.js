const IN_BUG_WHITE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="18" height="18"><path fill="#fff" d="M92.23,92.23h-11.88v-18.6c0-4.44-.08-10.15-6.18-10.15s-7.14,4.83-7.14,9.83v18.92h-11.88V53.97h11.41v5.23h.16c1.59-3.01,5.47-6.18,11.25-6.18,12.04,0,14.27,7.92,14.27,18.22v20.98ZM41.75,48.74c-3.81,0-6.89-3.09-6.89-6.9s3.08-6.89,6.89-6.89,6.89,3.09,6.89,6.89-3.09,6.9-6.89,6.9m5.94,43.49h-11.89V53.97h11.89v38.26ZM98.15,23.92H29.83c-3.27,0-5.92,2.59-5.92,5.78V98.3c0,3.19,2.65,5.78,5.92,5.78H98.15c3.27,0,5.93-2.59,5.93-5.78V29.7c0-3.19-2.66-5.78-5.93-5.78"/></svg>`;

const SF_CLOUD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 40" width="36" height="26" fill="#fff"><path d="M23.3 6.5c2-2.1 4.8-3.5 8-3.5 4.4 0 8.2 2.6 10 6.4.9-.4 1.9-.6 2.9-.6 3.8 0 6.8 3 6.8 6.8 0 3.8-3 6.8-6.8 6.8H11.8C8.1 22.4 5 19.3 5 15.6c0-3.5 2.7-6.4 6.1-6.8-.1-.5-.1-1-.1-1.5C11 3.9 14.9 0 19.7 0c1.7 0 3.3.5 4.7 1.3"/></svg>`;

function getCventDemoPage(prefillData = null) {
  const isFilled       = !!prefillData;
  const firstName      = prefillData?.firstName      || '';
  const lastName       = prefillData?.lastName       || '';
  const email          = prefillData?.email          || '';
  const company        = prefillData?.company        || '';
  const companyUrl     = prefillData?.companyUrl     || '';
  const profileUrl     = prefillData?.profileUrl     || '';
  const profilePicture = prefillData?.profilePicture || '';
  const isVerified     = prefillData?.isVerified     || false;
  const verifications  = prefillData?.verifications  || [];
  const verifiedDetails = prefillData?.verifiedDetails || [];
  const allVerifiedOrgs = prefillData?.allVerifiedOrgs || [];

  // Build API panel — identityMe fields
  const identityFields = [
    { key: 'basicInfo.firstName',           value: firstName,  mapsTo: 'First Name'   },
    { key: 'basicInfo.lastName',            value: lastName,   mapsTo: 'Last Name'    },
    { key: 'basicInfo.primaryEmailAddress', value: email,      mapsTo: 'Email'        },
    { key: 'basicInfo.profileUrl',          value: profileUrl, mapsTo: 'LinkedIn URL' },
  ].filter(f => f.value);

  // verificationReport fields — one row per verified workplace
  const verificationRows = verifiedDetails.map((v, i) => ({
    key:    `verifiedDetails[${i}].organizationInfo.name`,
    value:  v.organizationInfo?.name || '',
    url:    v.organizationInfo?.url  || '',
    method: v.verificationMethod     || '',
    date:   v.lastVerifiedAt ? new Date(v.lastVerifiedAt).toLocaleDateString('en-US', { year:'numeric', month:'short' }) : '',
    mapsTo: i === 0 ? 'Company (primary)' : `Also verified`
  })).filter(r => r.value);

  const identityPanelHtml = identityFields.map(f => `
    <div class="api-row">
      <span class="api-endpoint">GET /rest/identityMe</span>
      <div class="api-field-row">
        <span class="api-key">${f.key}</span>
        <span class="api-arrow">→</span>
        <span class="api-value">"${escHtml(f.value)}"</span>
        <span class="api-label">fills <strong>${f.mapsTo}</strong></span>
      </div>
    </div>`).join('');

  const verificationPanelHtml = verificationRows.map(r => `
    <div class="api-row">
      <span class="api-endpoint">GET /rest/verificationReport · verifiedDetails</span>
      <div class="api-field-row">
        <span class="api-key">${r.key}</span>
        <span class="api-arrow">→</span>
        <span class="api-value">"${escHtml(r.value)}"</span>
        <span class="api-label">fills <strong>${r.mapsTo}</strong>${r.method ? ` · verified via ${r.method.replace('_', ' ')}` : ''}${r.date ? ` · ${r.date}` : ''}</span>
      </div>
    </div>`).join('');

  // JS animation data
  const jsFields = JSON.stringify([
    { id: 'f_firstName', value: firstName  },
    { id: 'f_lastName',  value: lastName   },
    { id: 'f_email',     value: email      },
    { id: 'f_company',   value: company    },
    { id: 'f_linkedin',  value: profileUrl },
  ].filter(f => f.value));

  // Avatar HTML
  const avatarHtml = profilePicture
    ? `<img src="${escHtml(profilePicture)}" class="profile-pic" alt="Profile photo">`
    : `<div class="profile-pic initials">${(firstName[0]||'').toUpperCase()}${(lastName[0]||'').toUpperCase()}</div>`;

  // All verified orgs badge list
  const orgBadgesHtml = allVerifiedOrgs.map((org, i) =>
    `<span class="org-badge${i === 0 ? ' primary' : ''}">${escHtml(org)}${i === 0 ? ' ✓' : ''}</span>`
  ).join('');

  // Helper: render a filled input
  function input(id, type, placeholder, val, hasBadge) {
    const filledClass = (isFilled && val) ? ' filled' : '';
    const badge = hasBadge && isFilled && val ? '<span class="voli-badge show">VOLI+</span>' : '';
    return `<div class="field-input-wrap">
      <input id="${id}" class="field-input${filledClass}" type="${type}" placeholder="${placeholder}" value="" data-fill="${escHtml(val)}" autocomplete="off">
      ${badge}
    </div>`;
  }

  function textarea(id, placeholder, val, hasBadge) {
    const filledClass = (isFilled && val) ? ' filled' : '';
    const badge = hasBadge && isFilled && val ? '<span class="voli-badge show" style="top:12px">VOLI+</span>' : '';
    return `<div class="field-input-wrap">
      <textarea id="${id}" class="field-input${filledClass}" placeholder="${placeholder}" rows="3" data-fill="${escHtml(val)}" autocomplete="off"></textarea>
      ${badge}
    </div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration — Dreamforce 2026</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Helvetica Neue", Arial, "Segoe UI", sans-serif;
      background: #f4f6f9;
      color: #333;
    }

    /* ═══ BANNER ═══ */
    .banner {
      background: linear-gradient(135deg, #032D60 0%, #00396C 40%, #004E8C 70%, #032D60 100%);
      position: relative;
      overflow: hidden;
      min-height: 240px;
    }
    .banner::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(0,161,224,0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,161,224,0.08) 1px, transparent 1px);
      background-size: 44px 44px;
      pointer-events: none;
    }
    .banner::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 15% 85%, rgba(0,161,224,0.22) 0%, transparent 45%),
        radial-gradient(circle at 85% 15%, rgba(0,112,210,0.18) 0%, transparent 45%);
      pointer-events: none;
    }
    .banner-inner {
      position: relative;
      z-index: 1;
      max-width: 960px;
      margin: 0 auto;
      padding: 0 32px;
    }
    .banner-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 0 0;
    }
    .banner-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 300;
      color: #fff;
      letter-spacing: 0.5px;
      text-transform: lowercase;
    }
    .banner-logo strong {
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .banner-links { display: flex; gap: 20px; list-style: none; }
    .banner-links a { color: rgba(255,255,255,0.82); text-decoration: none; font-size: 13px; font-weight: 500; }
    .banner-links a:hover { color: #00A1E0; }
    .banner-content {
      padding: 32px 0 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .banner-eyebrow {
      font-size: 12px;
      font-weight: 700;
      color: #00A1E0;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .banner-title-line1 {
      font-size: 52px;
      font-weight: 900;
      color: #fff;
      letter-spacing: -1px;
      line-height: 1;
      text-transform: uppercase;
    }
    .banner-title-line2 {
      font-size: 52px;
      font-weight: 900;
      color: #00A1E0;
      letter-spacing: -1px;
      line-height: 1;
      text-transform: uppercase;
      margin-bottom: 18px;
    }
    .banner-date { font-size: 14px; color: rgba(255,255,255,0.72); font-weight: 500; }
    .banner-date strong { color: #fff; }

    /* Cloud graphic */
    .banner-cloud-wrap {
      flex-shrink: 0;
      position: relative;
      width: 200px;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cloud-shape {
      position: relative;
      width: 160px;
      height: 100px;
      filter: drop-shadow(0 8px 32px rgba(0,161,224,0.35));
    }
    .cloud-shape::before,
    .cloud-shape::after,
    .cloud-shape span {
      content: '';
      position: absolute;
      background: rgba(255,255,255,0.12);
      border-radius: 50%;
    }
    .cloud-shape::before {
      width: 80px; height: 80px;
      top: 10px; left: 30px;
      background: rgba(0,161,224,0.25);
      backdrop-filter: blur(2px);
    }
    .cloud-shape::after {
      width: 110px; height: 70px;
      bottom: 0; left: 25px;
      border-radius: 40px;
      background: rgba(0,161,224,0.18);
    }
    .cloud-text {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 800;
      color: rgba(255,255,255,0.9);
      letter-spacing: 2px;
      text-transform: uppercase;
      z-index: 2;
    }
    .cloud-ring {
      position: absolute;
      border-radius: 50%;
      border: 1.5px solid rgba(0,161,224,0.3);
    }
    .cloud-ring:nth-child(1) { width: 120px; height: 120px; }
    .cloud-ring:nth-child(2) { width: 160px; height: 160px; opacity: 0.6; }
    .cloud-ring:nth-child(3) { width: 200px; height: 200px; opacity: 0.3; }

    /* ═══ FORM AREA ═══ */
    .form-area {
      max-width: 960px;
      margin: 0 auto;
      padding: 36px 32px 60px;
    }
    .form-title {
      font-size: 28px;
      font-weight: 700;
      color: #032D60;
      margin-bottom: 28px;
    }

    /* VOLI Plus button */
    .voli-wrap { margin-bottom: 24px; }
    .voli-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 13px 22px;
      background: #0070D2;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.15s;
    }
    .voli-btn:hover { background: #005BA1; }
    .powered-by-cvent {
      margin-top: 8px;
      font-size: 11px;
      color: #888;
      font-weight: 500;
    }
    .powered-by-cvent strong { color: #0070D2; font-weight: 700; }
    .voli-or { display: flex; align-items: center; gap: 12px; margin: 16px 0 20px; color: #bbb; font-size: 12px; }
    .voli-or::before, .voli-or::after { content: ''; flex: 1; border-top: 1px solid #e8e8e8; }

    /* Verified strip */
    .verified-strip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #0070D2;
      color: #fff;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 20px;
    }
    .v-check { margin-left: 8px; background: #057642; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 700; }

    /* Profile row */
    .profile-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      background: #f7f7fb;
      border: 1px solid #e8e8f0;
      border-radius: 4px;
      margin-bottom: 22px;
    }
    .profile-pic { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid #ddd; flex-shrink: 0; }
    .profile-pic.initials { background: #0070D2; color: #fff; font-size: 20px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .profile-info-name { font-size: 16px; font-weight: 700; color: #111; }
    .profile-info-sub { font-size: 13px; color: #666; margin-top: 2px; }
    .org-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
    .org-badge { font-size: 11px; padding: 2px 8px; border-radius: 10px; background: #f3f4f6; color: #555; font-weight: 600; }
    .org-badge.primary { background: #dbeafe; color: #1d4ed8; }
    .api-section-label { color: #9ca3af; font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; margin: 12px 0 6px; border-top: 1px solid #374151; padding-top: 10px; }

    /* Form fields */
    .field-block { margin-bottom: 18px; }
    .field-label { display: block; font-size: 13px; font-weight: 600; color: #032D60; margin-bottom: 6px; }
    .field-label .req { color: #0070D2; }
    .field-input-wrap { position: relative; }
    .field-input {
      width: 100%;
      padding: 11px 14px;
      background: #fff;
      border: 1.5px solid #d8dde6;
      border-radius: 4px;
      font-size: 14px;
      color: #333;
      outline: none;
      transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
      font-family: inherit;
      resize: vertical;
    }
    .field-select {
      appearance: none;
      -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 32px;
      cursor: pointer;
    }
    .field-input:focus { border-color: #0070D2; background: #fff; box-shadow: 0 0 0 3px rgba(0,112,210,0.12); }
    .field-input.filling { border-color: #0070D2 !important; background: #eff6ff !important; box-shadow: 0 0 0 3px rgba(0,112,210,0.12) !important; }
    .field-input.filled  { border-color: #057642 !important; background: #f0fdf6 !important; }
    .voli-badge {
      position: absolute;
      right: 10px; top: 50%;
      transform: translateY(-50%);
      display: none;
      align-items: center;
      gap: 3px;
      font-size: 10px;
      font-weight: 700;
      color: #0070D2;
      background: #dbeafe;
      padding: 2px 7px;
      border-radius: 8px;
      pointer-events: none;
    }
    .voli-badge.show { display: flex; }
    textarea.field-input { padding-right: 14px; }

    /* Grid layouts */
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    @media (max-width: 560px) { .two-col { grid-template-columns: 1fr; } }

    /* Submit */
    .submit-wrap { margin-top: 28px; }
    .submit-btn {
      display: inline-block;
      padding: 13px 36px;
      background: #0070D2;
      color: #fff;
      font-size: 15px;
      font-weight: 700;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .submit-btn:hover { background: #005BA1; }
    .submit-btn:disabled { background: #057642; cursor: default; }
    .form-fine-print { font-size: 11px; color: #aaa; margin-top: 10px; line-height: 1.5; }
    .section-divider { border: none; border-top: 1px solid #eee; margin: 24px 0; }

    /* API Data Panel */
    .api-panel { margin-top: 36px; border-radius: 6px; overflow: hidden; border: 1px solid #e0e0e0; }
    .api-panel-header {
      background: #111827;
      color: #fff;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
    }
    .api-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; flex-shrink: 0; }
    .api-panel-subtitle { font-size: 11px; color: #6b7280; font-weight: 400; margin-left: auto; }
    .api-body { background: #1e1e2e; padding: 16px 18px; }
    .api-row { margin-bottom: 10px; }
    .api-endpoint { display: block; color: #6b7280; font-family: monospace; font-size: 10px; margin-bottom: 2px; }
    .api-field-row { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px; font-size: 12px; font-family: monospace; }
    .api-key   { color: #f97316; }
    .api-arrow { color: #6b7280; }
    .api-value { color: #86efac; font-weight: 600; }
    .api-label { color: #6b7280; font-size: 11px; font-family: sans-serif; }
    .api-label strong { color: #60a5fa; }
  </style>
</head>
<body>

<!-- BANNER -->
<div class="banner">
  <div class="banner-inner">
    <div class="banner-nav">
      <div class="banner-logo">
        ${SF_CLOUD}
        <span><strong>dreamforce</strong></span>
      </div>
      <ul class="banner-links">
        <li><a href="#">Summary</a></li>
        <li><a href="#">Agenda</a></li>
        <li><a href="#">Speakers</a></li>
        <li><a href="#">Fees</a></li>
        <li><a href="#">Event FAQs</a></li>
      </ul>
    </div>
    <div class="banner-content">
      <div class="banner-text">
        <div class="banner-eyebrow">San Francisco · September 2026</div>
        <div class="banner-title-line1">DREAMFORCE</div>
        <div class="banner-title-line2">'26</div>
        <div class="banner-date"><strong>September 15–18, 2026</strong> &nbsp;|&nbsp; SAN FRANCISCO, CA</div>
      </div>
      <div class="banner-cloud-wrap">
        <div class="cloud-ring"></div>
        <div class="cloud-ring"></div>
        <div class="cloud-ring"></div>
        <div class="cloud-shape">
          <div class="cloud-text">DF '26</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- FORM -->
<div class="form-area">
  <h2 class="form-title">Registration Information</h2>

  <!-- VOLI Plus section -->
  <div class="voli-wrap">
    ${isFilled
      ? `<div class="verified-strip">
           ${IN_BUG_WHITE}
           <span>Signed in with LinkedIn · VOLI Plus</span>
           <span class="v-check">✓ Identity Verified</span>
         </div>
         <div class="profile-row">
           ${avatarHtml}
           <div>
             <div class="profile-info-name">${escHtml(firstName + ' ' + lastName)}</div>
             ${company ? `<div class="profile-info-sub">${escHtml(company)}</div>` : ''}
             ${allVerifiedOrgs.length > 0 ? `<div class="org-badges">${orgBadgesHtml}</div>` : ''}
           </div>
         </div>`
      : `<a href="/cvent-auth" class="voli-btn">
           ${IN_BUG_WHITE}
           <span>Sign in with LinkedIn</span>
         </a>
         <div class="powered-by-cvent">Powered by <strong>Cvent</strong></div>
         <div class="voli-or">or fill in manually below</div>`
    }
  </div>

  <!-- Registration Type -->
  <div class="field-block">
    <label class="field-label"><span class="req">* </span>Registration Type</label>
    <select class="field-input field-select">
      <option>General Admission</option>
      <option>VIP</option>
      <option>Exhibitor</option>
      <option>Speaker</option>
    </select>
  </div>

  <!-- First / Last Name -->
  <div class="two-col">
    <div class="field-block">
      <label class="field-label" for="f_firstName"><span class="req">* </span>First Name</label>
      ${input('f_firstName', 'text', 'First name', firstName, true)}
    </div>
    <div class="field-block">
      <label class="field-label" for="f_lastName"><span class="req">* </span>Last Name</label>
      ${input('f_lastName', 'text', 'Last name', lastName, true)}
    </div>
  </div>

  <!-- Company -->
  <div class="field-block">
    <label class="field-label" for="f_company"><span class="req">* </span>Company</label>
    ${input('f_company', 'text', 'Your company or organization', company, true)}
  </div>

  <!-- Job Title -->
  <div class="field-block">
    <label class="field-label" for="f_jobTitle">Job Title</label>
    <input id="f_jobTitle" class="field-input" type="text" placeholder="Your job title" autocomplete="off">
  </div>

  <!-- Email -->
  <div class="field-block">
    <label class="field-label" for="f_email"><span class="req">* </span>Email Address</label>
    ${input('f_email', 'email', 'your@email.com', email, true)}
  </div>

  <!-- Mobile / Work Phone -->
  <div class="two-col">
    <div class="field-block">
      <label class="field-label" for="f_mobile"><span class="req">* </span>Mobile</label>
      <input id="f_mobile" class="field-input" type="tel" placeholder="+1 (555) 000-0000" autocomplete="off">
    </div>
    <div class="field-block">
      <label class="field-label" for="f_workphone">Work Phone</label>
      <input id="f_workphone" class="field-input" type="tel" placeholder="+1 (555) 000-0000" autocomplete="off">
    </div>
  </div>

  <!-- LinkedIn URL -->
  <div class="field-block">
    <label class="field-label" for="f_linkedin">LinkedIn URL</label>
    ${input('f_linkedin', 'url', 'www.linkedin.com/in/yourname', profileUrl, true)}
  </div>

  <!-- Twitter / Facebook -->
  <div class="two-col">
    <div class="field-block">
      <label class="field-label" for="f_twitter">Twitter URL</label>
      <input id="f_twitter" class="field-input" type="url" placeholder="www.twitter.com/yourhandle" autocomplete="off">
    </div>
    <div class="field-block">
      <label class="field-label" for="f_facebook">Facebook URL</label>
      <input id="f_facebook" class="field-input" type="url" placeholder="www.facebook.com/yourprofile" autocomplete="off">
    </div>
  </div>

  <hr class="section-divider">

  <!-- Submit -->
  <div class="submit-wrap">
    <button class="submit-btn" type="button" id="submitBtn" onclick="handleSubmit()">
      ${isFilled ? 'Complete Registration →' : 'Register Now →'}
    </button>
    <p class="form-fine-print">
      By registering you agree to the event terms &amp; conditions.<br>
      Your information is collected by the event organiser and handled in accordance with their privacy policy.
    </p>
  </div>

  <!-- API Data Panel (only when autofilled) -->
  ${isFilled ? `
  <div class="api-panel">
    <div class="api-panel-header">
      <div class="api-dot"></div>
      <span>VOLI Plus · LinkedIn API Response</span>
      <span class="api-panel-subtitle">What was pulled and where it mapped</span>
    </div>
    <div class="api-body">
      ${identityPanelHtml ? `<div class="api-section-label">identityMe — Profile Fields</div>${identityPanelHtml}` : ''}
      ${verificationPanelHtml ? `<div class="api-section-label">verificationReport — Verified Workplaces</div>${verificationPanelHtml}` : ''}
      ${!identityPanelHtml && !verificationPanelHtml ? '<div style="color:#6b7280;font-size:12px;font-family:monospace;">No fields returned from API.</div>' : ''}
    </div>
  </div>` : ''}

</div>

<script>
  const IS_FILLED = ${isFilled};
  const FIELDS = ${jsFields};

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function typeInto(el, value) {
    el.classList.remove('filled');
    el.classList.add('filling');
    const badge = el.closest('.field-input-wrap')?.querySelector('.voli-badge');
    if (badge) badge.classList.remove('show');

    const isTextarea = el.tagName === 'TEXTAREA';
    for (let i = 0; i <= value.length; i++) {
      el.value = value.slice(0, i);
      await sleep(isTextarea ? 8 : 18 + Math.random() * 18);
    }

    el.classList.remove('filling');
    el.classList.add('filled');
    if (badge) badge.classList.add('show');
  }

  async function runAutofill() {
    FIELDS.forEach(f => {
      const el = document.getElementById(f.id);
      if (el) {
        el.value = '';
        el.classList.remove('filled', 'filling');
        const badge = el.closest('.field-input-wrap')?.querySelector('.voli-badge');
        if (badge) badge.classList.remove('show');
      }
    });

    await sleep(400);

    for (const field of FIELDS) {
      const el = document.getElementById(field.id);
      if (!el || !field.value) continue;
      await typeInto(el, field.value);
      await sleep(80);
    }
  }

  if (IS_FILLED && FIELDS.length > 0) {
    runAutofill();
  } else if (IS_FILLED) {
    document.querySelectorAll('[data-fill]').forEach(el => {
      const val = el.getAttribute('data-fill');
      if (val) { el.value = val; el.classList.add('filled'); }
    });
  }

  function handleSubmit() {
    if (!IS_FILLED) { window.location.href = '/cvent-auth'; return; }
    const btn = document.getElementById('submitBtn');
    btn.textContent = "✓ You're registered!";
    btn.disabled = true;
  }
</script>
</body>
</html>`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = { getCventDemoPage };
