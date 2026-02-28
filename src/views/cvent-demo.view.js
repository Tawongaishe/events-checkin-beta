const IN_BUG_WHITE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="18" height="18"><path fill="#fff" d="M92.23,92.23h-11.88v-18.6c0-4.44-.08-10.15-6.18-10.15s-7.14,4.83-7.14,9.83v18.92h-11.88V53.97h11.41v5.23h.16c1.59-3.01,5.47-6.18,11.25-6.18,12.04,0,14.27,7.92,14.27,18.22v20.98ZM41.75,48.74c-3.81,0-6.89-3.09-6.89-6.9s3.08-6.89,6.89-6.89,6.89,3.09,6.89,6.89-3.09,6.9-6.89,6.9m5.94,43.49h-11.89V53.97h11.89v38.26ZM98.15,23.92H29.83c-3.27,0-5.92,2.59-5.92,5.78V98.3c0,3.19,2.65,5.78,5.92,5.78H98.15c3.27,0,5.93-2.59,5.93-5.78V29.7c0-3.19-2.66-5.78-5.93-5.78"/></svg>`;

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

  // Helper: render a filled input (value baked into HTML + animation will retype it)
  function input(id, type, placeholder, val, hasBadge) {
    const filledClass = (isFilled && val) ? ' filled' : '';
    const badge = hasBadge && isFilled && val ? '<span class="voli-badge show">VOLI+</span>' : '';
    // Value baked into data-fill; input starts empty so animation can type it
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
  <title>Event Registration — Verifications Happy Hour</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Helvetica Neue", Arial, "Segoe UI", sans-serif;
      background: #fff;
      color: #333;
    }

    /* ═══ BANNER ═══ */
    .banner {
      background: linear-gradient(135deg, #07082b 0%, #110630 35%, #0c1647 65%, #07082b 100%);
      position: relative;
      overflow: hidden;
      min-height: 220px;
    }
    .banner::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(80,120,255,0.07) 1px, transparent 1px),
        linear-gradient(90deg, rgba(80,120,255,0.07) 1px, transparent 1px);
      background-size: 44px 44px;
      pointer-events: none;
    }
    .banner::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 20% 80%, rgba(130,60,255,0.18) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(0,80,255,0.15) 0%, transparent 50%);
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
      padding: 16px 0 0;
    }
    .banner-logo {
      display: flex;
      align-items: center;
      font-size: 22px;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.5px;
    }
    .logo-b {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px; height: 32px;
      background: #fff;
      color: #07082b;
      font-size: 18px;
      font-weight: 900;
      border-radius: 5px;
      margin-right: 6px;
      font-style: italic;
    }
    .banner-links { display: flex; gap: 20px; list-style: none; }
    .banner-links a { color: rgba(255,255,255,0.88); text-decoration: none; font-size: 13px; font-weight: 500; }
    .banner-links a:hover { color: #ff2d9b; }
    .banner-content {
      padding: 28px 0 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .banner-title-line1 { font-size: 40px; font-weight: 900; color: #fff;    letter-spacing: -0.5px; line-height: 1.05; text-transform: uppercase; }
    .banner-title-line2 { font-size: 40px; font-weight: 900; color: #ff2d9b; letter-spacing: -0.5px; line-height: 1.05; text-transform: uppercase; }
    .banner-title-line3 { font-size: 40px; font-weight: 900; color: #fff;    letter-spacing: -0.5px; line-height: 1.05; text-transform: uppercase; margin-bottom: 14px; }
    .banner-date { font-size: 15px; color: rgba(255,255,255,0.75); font-weight: 500; }
    .banner-date strong { color: #fff; }
    .banner-orb {
      width: 180px; height: 180px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #4a3f8f, #1a0a3d 60%, #0a0520);
      box-shadow: 0 0 60px rgba(130,60,255,0.4), inset 0 0 40px rgba(0,0,0,0.5);
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }
    .banner-orb::after {
      content: '';
      position: absolute;
      top: 12px; left: 12px;
      width: 50px; height: 50px;
      border-radius: 50%;
      background: rgba(255,255,255,0.07);
    }

    /* ═══ FORM AREA ═══ */
    .form-area { max-width: 960px; margin: 0 auto; padding: 36px 32px 60px; }
    .form-title { font-size: 30px; font-weight: 700; color: #e0187c; margin-bottom: 28px; }

    /* VOLI Plus button */
    .voli-wrap { margin-bottom: 24px; }
    .voli-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 13px 22px;
      background: #0a66c2;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.15s;
    }
    .voli-btn:hover { background: #004182; }
    .voli-btn-sub { font-size: 11px; font-weight: 400; opacity: 0.8; }
    .voli-or { display: flex; align-items: center; gap: 12px; margin: 16px 0 20px; color: #bbb; font-size: 12px; }
    .voli-or::before, .voli-or::after { content: ''; flex: 1; border-top: 1px solid #e8e8e8; }

    /* Verified strip */
    .verified-strip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #0a66c2;
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
    .profile-pic.initials { background: #0a66c2; color: #fff; font-size: 20px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .profile-info-name { font-size: 16px; font-weight: 700; color: #111; }
    .profile-info-sub { font-size: 13px; color: #666; margin-top: 2px; }
    .org-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
    .org-badge { font-size: 11px; padding: 2px 8px; border-radius: 10px; background: #f3f4f6; color: #555; font-weight: 600; }
    .org-badge.primary { background: #dbeafe; color: #1d4ed8; }
    .api-section-label { color: #9ca3af; font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; margin: 12px 0 6px; border-top: 1px solid #374151; padding-top: 10px; }

    /* Form fields */
    .field-block { margin-bottom: 18px; }
    .field-label { display: block; font-size: 13px; font-weight: 600; color: #e0187c; margin-bottom: 6px; }
    .field-label .req { color: #e0187c; }
    .field-input-wrap { position: relative; }
    .field-input {
      width: 100%;
      padding: 11px 14px;
      background: #f2f2f2;
      border: 1.5px solid #e8e8e8;
      border-radius: 3px;
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
    .field-input:focus { border-color: #e0187c; background: #fff; box-shadow: 0 0 0 3px rgba(224,24,124,0.1); }
    .field-input.filling { border-color: #0a66c2 !important; background: #eff6ff !important; box-shadow: 0 0 0 3px rgba(10,102,194,0.12) !important; }
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
      color: #0a66c2;
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
      background: #e0187c;
      color: #fff;
      font-size: 15px;
      font-weight: 700;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .submit-btn:hover { background: #b5106a; }
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
      <div class="banner-logo"><span class="logo-b">V</span>VOLI Plus</div>
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
        <div class="banner-title-line1">VERIFICATIONS</div>
        <div class="banner-title-line2">HAPPY HOUR</div>
        <div class="banner-title-line3">2026</div>
        <div class="banner-date"><strong>February 28, 2026</strong> &nbsp;|&nbsp; SAN FRANCISCO, CA</div>
      </div>
      <div class="banner-orb"></div>
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
    // Reset all animated fields to empty first
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
    // Fallback: just stamp the data-fill values directly if no JS fields
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
