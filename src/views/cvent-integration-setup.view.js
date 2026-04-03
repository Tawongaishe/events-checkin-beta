function getCventIntegrationSetupPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LinkedIn Integration Setup — Cvent</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #f5f5f5;
      color: #1a1a1a;
      font-size: 14px;
      line-height: 1.5;
    }

    /* ═══ TOP NAV ═══ */
    .top-nav {
      background: #fff;
      border-bottom: 1px solid #e0e0e0;
      height: 48px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
    }
    .top-nav-rainbow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #04B6A4 0%, #04B6A4 25%, #2B7CD0 25%, #2B7CD0 50%, #6B4DC4 50%, #6B4DC4 75%, #E8437F 75%, #E8437F 100%);
    }
    .cvent-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      color: #1a1a1a;
      text-decoration: none;
      margin-right: 6px;
    }
    .cvent-logo-text { font-weight: 300; letter-spacing: -0.5px; }
    .cvent-logo-text strong { font-weight: 700; color: #1a1a1a; }
    .cvent-logo-divider {
      width: 1px;
      height: 24px;
      background: #d0d0d0;
      margin: 0 10px;
    }
    .cvent-events-label {
      font-size: 14px;
      font-weight: 600;
      color: #006AE1;
      letter-spacing: 0.3px;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-left: 32px;
      list-style: none;
    }
    .nav-links a {
      color: #4a4a4a;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
    }
    .nav-links a:hover { color: #006AE1; }
    .nav-links .has-caret::after {
      content: '';
      display: inline-block;
      width: 0; height: 0;
      margin-left: 4px;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid #888;
      vertical-align: middle;
    }
    .nav-right {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .nav-icon {
      width: 20px;
      height: 20px;
      color: #666;
      cursor: pointer;
    }
    .nav-grid-icon {
      width: 28px;
      height: 28px;
      background: #006AE1;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .nav-grid-icon svg { color: #fff; }

    /* ═══ SUB NAV ═══ */
    .sub-nav {
      background: #fff;
      border-bottom: 1px solid #e0e0e0;
      height: 44px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      position: fixed;
      top: 48px;
      left: 0;
      right: 0;
      z-index: 99;
    }
    .sub-nav-hamburger {
      width: 20px;
      height: 20px;
      margin-right: 12px;
      color: #666;
      cursor: pointer;
    }
    .sub-nav-event {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
    }
    .sub-nav-search {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      color: #999;
      font-size: 13px;
      cursor: pointer;
    }
    .sub-nav-search svg { width: 14px; height: 14px; }

    /* ═══ LAYOUT ═══ */
    .layout {
      display: flex;
      margin-top: 92px;
      min-height: calc(100vh - 92px);
    }

    /* ═══ SIDEBAR ═══ */
    .sidebar {
      width: 220px;
      background: #fff;
      border-right: 1px solid #e8e8e8;
      padding: 16px 0;
      flex-shrink: 0;
      position: fixed;
      top: 92px;
      bottom: 0;
      left: 0;
      overflow-y: auto;
    }
    .sidebar-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px;
      font-size: 14px;
      color: #4a4a4a;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.1s;
    }
    .sidebar-item:hover { background: #f5f7fa; }
    .sidebar-item.active {
      color: #006AE1;
      border-left: 3px solid #006AE1;
      padding-left: 17px;
      font-weight: 600;
      background: #f0f6ff;
    }
    .sidebar-caret {
      width: 16px;
      height: 16px;
      color: #999;
    }

    /* ═══ MAIN CONTENT ═══ */
    .main {
      flex: 1;
      margin-left: 220px;
      padding: 28px 40px 60px;
      max-width: 1100px;
    }

    /* Breadcrumb */
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #999;
      margin-bottom: 16px;
    }
    .breadcrumb a {
      color: #006AE1;
      text-decoration: none;
    }
    .breadcrumb a:hover { text-decoration: underline; }
    .breadcrumb-sep { color: #ccc; }

    /* Page header */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .page-title {
      font-size: 28px;
      font-weight: 400;
      color: #1a1a1a;
    }
    .header-actions { display: flex; gap: 10px; }
    .btn {
      padding: 8px 20px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.15s;
    }
    .btn-primary {
      background: #006AE1;
      color: #fff;
    }
    .btn-primary:hover { background: #0055b3; }
    .btn-outline {
      background: #fff;
      color: #1a1a1a;
      border: 1px solid #d0d0d0;
    }
    .btn-outline:hover { background: #f5f5f5; }
    .btn-secondary {
      background: #f0f0f0;
      color: #4a4a4a;
    }
    .btn-secondary:hover { background: #e5e5e5; }

    /* Help link */
    .help-link {
      font-size: 13px;
      color: #006AE1;
      text-decoration: none;
      margin-bottom: 24px;
      display: inline-block;
    }
    .help-link:hover { text-decoration: underline; }

    /* ═══ WIZARD ═══ */
    .wizard-progress {
      display: flex;
      align-items: center;
      gap: 0;
      margin-bottom: 32px;
      padding: 20px 24px;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    .wizard-step {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      flex: 1;
      position: relative;
    }
    .wizard-step:not(:last-child)::after {
      content: '';
      flex: 1;
      height: 2px;
      background: #e0e0e0;
      margin: 0 16px;
    }
    .wizard-step.completed:not(:last-child)::after {
      background: #006AE1;
    }
    .wizard-step-num {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      flex-shrink: 0;
      border: 2px solid #d0d0d0;
      color: #999;
      background: #fff;
      transition: all 0.2s;
    }
    .wizard-step.active .wizard-step-num {
      border-color: #006AE1;
      background: #006AE1;
      color: #fff;
    }
    .wizard-step.completed .wizard-step-num {
      border-color: #006AE1;
      background: #006AE1;
      color: #fff;
    }
    .wizard-step-label {
      font-size: 13px;
      color: #999;
      font-weight: 500;
      white-space: nowrap;
    }
    .wizard-step.active .wizard-step-label { color: #006AE1; font-weight: 600; }
    .wizard-step.completed .wizard-step-label { color: #006AE1; }

    /* ═══ CARD / SECTION ═══ */
    .card {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 28px;
      margin-bottom: 20px;
    }
    .card-title {
      font-size: 18px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 6px;
    }
    .card-desc {
      font-size: 13px;
      color: #666;
      margin-bottom: 24px;
      line-height: 1.6;
    }

    /* Form fields */
    .form-group {
      margin-bottom: 20px;
    }
    .form-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin-bottom: 6px;
    }
    .form-label .required {
      color: #d32f2f;
      margin-left: 2px;
    }
    .form-hint {
      font-size: 12px;
      color: #888;
      margin-top: 4px;
      line-height: 1.4;
    }
    .form-input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      font-size: 14px;
      color: #1a1a1a;
      background: #fff;
      transition: border-color 0.15s, box-shadow 0.15s;
      font-family: inherit;
    }
    .form-input:focus {
      outline: none;
      border-color: #006AE1;
      box-shadow: 0 0 0 3px rgba(0,106,225,0.1);
    }
    .form-input::placeholder { color: #bbb; }
    textarea.form-input { resize: vertical; min-height: 80px; }
    select.form-input {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    /* Checkbox / toggle */
    .toggle-group {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }
    .toggle {
      position: relative;
      width: 44px;
      height: 24px;
      flex-shrink: 0;
    }
    .toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .toggle-slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background: #ccc;
      border-radius: 24px;
      transition: 0.2s;
    }
    .toggle-slider::before {
      content: '';
      position: absolute;
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background: #fff;
      border-radius: 50%;
      transition: 0.2s;
    }
    .toggle input:checked + .toggle-slider {
      background: #006AE1;
    }
    .toggle input:checked + .toggle-slider::before {
      transform: translateX(20px);
    }
    .toggle-label {
      font-size: 14px;
      color: #333;
    }
    .toggle-desc {
      font-size: 12px;
      color: #888;
      margin-left: 54px;
      margin-top: -6px;
      margin-bottom: 16px;
    }

    /* Checkbox list */
    .checkbox-group {
      margin-bottom: 12px;
    }
    .checkbox-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 14px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
    }
    .checkbox-item:hover { border-color: #006AE1; background: #f8fbff; }
    .checkbox-item.checked { border-color: #006AE1; background: #f0f6ff; }
    .checkbox-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin-top: 2px;
      accent-color: #006AE1;
      flex-shrink: 0;
    }
    .checkbox-content { flex: 1; }
    .checkbox-title {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 2px;
    }
    .checkbox-desc {
      font-size: 12px;
      color: #888;
      line-height: 1.4;
    }

    /* Tag / scope badges */
    .scope-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      background: #e8f4fd;
      color: #006AE1;
      margin: 2px 4px 2px 0;
    }
    .scope-badge.required { background: #fff3e0; color: #e65100; }

    /* URL add row */
    .url-list { margin-bottom: 8px; }
    .url-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .url-row .form-input { flex: 1; }
    .url-remove {
      width: 32px;
      height: 32px;
      border: none;
      background: none;
      color: #999;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }
    .url-remove:hover { background: #fee; color: #d32f2f; }
    .add-url-btn {
      background: none;
      border: 1px dashed #ccc;
      border-radius: 4px;
      padding: 8px 14px;
      font-size: 13px;
      color: #006AE1;
      cursor: pointer;
      font-weight: 500;
      width: 100%;
      text-align: left;
    }
    .add-url-btn:hover { background: #f8fbff; border-color: #006AE1; }

    /* File upload area */
    .upload-area {
      border: 2px dashed #d0d0d0;
      border-radius: 8px;
      padding: 28px;
      text-align: center;
      cursor: pointer;
      transition: all 0.15s;
    }
    .upload-area:hover { border-color: #006AE1; background: #f8fbff; }
    .upload-icon {
      width: 40px;
      height: 40px;
      margin: 0 auto 10px;
      color: #999;
    }
    .upload-text { font-size: 13px; color: #666; }
    .upload-text strong { color: #006AE1; }
    .upload-hint { font-size: 11px; color: #999; margin-top: 4px; }

    /* Wizard navigation */
    .wizard-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;
    }
    .wizard-nav .btn { padding: 10px 28px; font-size: 14px; }

    /* Step panels */
    .step-panel { display: none; }
    .step-panel.active { display: block; }

    /* Info box */
    .info-box {
      display: flex;
      gap: 12px;
      padding: 14px 18px;
      background: #f0f6ff;
      border: 1px solid #d0e4ff;
      border-radius: 6px;
      margin-bottom: 20px;
    }
    .info-box-icon {
      width: 20px;
      height: 20px;
      color: #006AE1;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .info-box-text {
      font-size: 13px;
      color: #333;
      line-height: 1.5;
    }

    /* Review summary */
    .review-section {
      margin-bottom: 24px;
    }
    .review-section-title {
      font-size: 14px;
      font-weight: 700;
      color: #333;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .review-edit-link {
      font-size: 12px;
      font-weight: 500;
      color: #006AE1;
      cursor: pointer;
      text-decoration: none;
    }
    .review-edit-link:hover { text-decoration: underline; }
    .review-row {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .review-label {
      width: 200px;
      font-size: 13px;
      color: #888;
      flex-shrink: 0;
    }
    .review-value {
      font-size: 13px;
      color: #1a1a1a;
      font-weight: 500;
    }

    /* Success state */
    .success-panel {
      text-align: center;
      padding: 48px 24px;
    }
    .success-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 20px;
      background: #e8f5e9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .success-icon svg { width: 32px; height: 32px; color: #2e7d32; }
    .success-title {
      font-size: 22px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 8px;
    }
    .success-desc {
      font-size: 14px;
      color: #666;
      margin-bottom: 28px;
      max-width: 480px;
      margin-left: auto;
      margin-right: auto;
    }
    .success-detail {
      background: #f9fafb;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px 24px;
      text-align: left;
      max-width: 480px;
      margin: 0 auto 24px;
    }
    .success-detail-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13px;
    }
    .success-detail-label { color: #888; }
    .success-detail-value { color: #1a1a1a; font-weight: 600; }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }
    .status-badge.pending { background: #fff3e0; color: #e65100; }
    .status-badge.active { background: #e8f5e9; color: #2e7d32; }

    /* LinkedIn mark */
    .li-mark {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .li-mark svg {
      width: 18px;
      height: 18px;
    }

    /* Agreement section */
    .agreement-box {
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 16px 18px;
      margin-bottom: 16px;
      max-height: 180px;
      overflow-y: auto;
      font-size: 12px;
      color: #666;
      line-height: 1.6;
    }
    .agreement-check {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-top: 12px;
    }
    .agreement-check input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin-top: 1px;
      accent-color: #006AE1;
      flex-shrink: 0;
    }
    .agreement-check label {
      font-size: 13px;
      color: #333;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <!-- TOP NAV -->
  <nav class="top-nav">
    <div class="top-nav-rainbow"></div>
    <a class="cvent-logo" href="#">
      <span class="cvent-logo-text"><strong>cvent</strong></span>
    </a>
    <div class="cvent-logo-divider"></div>
    <span class="cvent-events-label">EVENTS</span>
    <ul class="nav-links">
      <li><a href="#">All Events</a></li>
      <li><a href="#">Events+</a></li>
      <li><a href="#">Webinars</a></li>
      <li><a href="#" class="has-caret">Insights</a></li>
      <li><a href="#" class="has-caret">Meetings</a></li>
      <li><a href="#" class="has-caret">More</a></li>
    </ul>
    <div class="nav-right">
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5"/></svg>
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4-4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <div class="nav-grid-icon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="4" height="4" rx="0.5"/><rect x="6" y="1" width="4" height="4" rx="0.5"/><rect x="11" y="1" width="4" height="4" rx="0.5"/><rect x="1" y="6" width="4" height="4" rx="0.5"/><rect x="6" y="6" width="4" height="4" rx="0.5"/><rect x="11" y="6" width="4" height="4" rx="0.5"/><rect x="1" y="11" width="4" height="4" rx="0.5"/><rect x="6" y="11" width="4" height="4" rx="0.5"/><rect x="11" y="11" width="4" height="4" rx="0.5"/></svg>
      </div>
    </div>
  </nav>

  <!-- SUB NAV -->
  <div class="sub-nav">
    <svg class="sub-nav-hamburger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
    <span class="sub-nav-event">Conference 2026</span>
    <div class="sub-nav-search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      Search this event
    </div>
  </div>

  <!-- LAYOUT -->
  <div class="layout">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <a class="sidebar-item" href="#">Home</a>
      <a class="sidebar-item" href="#">General <svg class="sidebar-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></a>
      <a class="sidebar-item" href="#">Marketing <svg class="sidebar-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></a>
      <a class="sidebar-item" href="#">Email <svg class="sidebar-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></a>
      <a class="sidebar-item" href="#">Attendees <svg class="sidebar-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></a>
      <a class="sidebar-item" href="#">Reports <svg class="sidebar-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></a>
      <a class="sidebar-item active" href="#">Integrations</a>
    </aside>

    <!-- MAIN -->
    <main class="main">
      <div class="breadcrumb">
        <a href="#">Events</a>
        <span class="breadcrumb-sep">&gt;</span>
        <a href="#">Jason's LinkedIn Event</a>
        <span class="breadcrumb-sep">&gt;</span>
        <a href="#">Integrations</a>
        <span class="breadcrumb-sep">&gt;</span>
        <span>LinkedIn — Verified on LinkedIn Setup</span>
      </div>

      <div class="page-header">
        <h1 class="page-title">
          <span class="li-mark">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="28" height="28"><rect width="128" height="128" rx="14" fill="#0A66C2"/><path fill="#fff" d="M92.23,92.23h-11.88v-18.6c0-4.44-.08-10.15-6.18-10.15s-7.14,4.83-7.14,9.83v18.92h-11.88V53.97h11.41v5.23h.16c1.59-3.01,5.47-6.18,11.25-6.18,12.04,0,14.27,7.92,14.27,18.22v20.98ZM41.75,48.74c-3.81,0-6.89-3.09-6.89-6.9s3.08-6.89,6.89-6.89,6.89,3.09,6.89,6.89-3.09,6.9-6.89,6.9m5.94,43.49h-11.89V53.97h11.89v38.26Z"/></svg>
            Verified on LinkedIn Setup
          </span>
        </h1>
        <div class="header-actions">
          <button class="btn btn-outline" onclick="window.history.back()">Cancel</button>
        </div>
      </div>

      <a class="help-link" href="#">Need help getting started? Learn more about the Verified on LinkedIn integration.</a>

      <!-- WIZARD PROGRESS -->
      <div class="wizard-progress">
        <div class="wizard-step active" data-step="1" onclick="goToStep(1)">
          <div class="wizard-step-num">1</div>
          <span class="wizard-step-label">Company Details</span>
        </div>
        <div class="wizard-step" data-step="2" onclick="goToStep(2)">
          <div class="wizard-step-num">2</div>
          <span class="wizard-step-label">Features & Scopes</span>
        </div>
        <div class="wizard-step" data-step="3" onclick="goToStep(3)">
          <div class="wizard-step-num">3</div>
          <span class="wizard-step-label">Technical Setup</span>
        </div>
        <div class="wizard-step" data-step="4" onclick="goToStep(4)">
          <div class="wizard-step-num">4</div>
          <span class="wizard-step-label">Compliance</span>
        </div>
        <div class="wizard-step" data-step="5" onclick="goToStep(5)">
          <div class="wizard-step-num">5</div>
          <span class="wizard-step-label">Review & Submit</span>
        </div>
      </div>

      <!-- ═══════════════════════ STEP 1: Company Details ═══════════════════════ -->
      <div class="step-panel active" id="step-1">
        <div class="card">
          <h2 class="card-title">Company Information</h2>
          <p class="card-desc">Provide your organization details. This information will be used to create your LinkedIn developer application and displayed to attendees during the consent flow.</p>

          <div class="info-box">
            <svg class="info-box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><circle cx="12" cy="8" r="0.5" fill="currentColor"/></svg>
            <div class="info-box-text">
              A LinkedIn developer application will be created on behalf of your organization. You must be an authorized representative to proceed.
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Company Name <span class="required">*</span></label>
              <input class="form-input" type="text" id="companyName" placeholder="e.g. Acme Corp" value="">
            </div>
            <div class="form-group">
              <label class="form-label">LinkedIn Company Page URL <span class="required">*</span></label>
              <input class="form-input" type="url" id="companyLinkedIn" placeholder="https://www.linkedin.com/company/acme-corp">
              <p class="form-hint">Your organization must have a LinkedIn Company Page</p>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Company Website <span class="required">*</span></label>
              <input class="form-input" type="url" id="companyWebsite" placeholder="https://www.acme.com">
            </div>
            <div class="form-group">
              <label class="form-label">Industry</label>
              <select class="form-input" id="industry">
                <option value="">Select industry...</option>
                <option>Technology</option>
                <option>Financial Services</option>
                <option>Healthcare</option>
                <option>Education</option>
                <option>Events & Hospitality</option>
                <option>Professional Services</option>
                <option>Manufacturing</option>
                <option>Media & Entertainment</option>
                <option>Retail</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="card-title">Application Branding</h2>
          <p class="card-desc">These assets will be shown to attendees in the LinkedIn consent screen when they authenticate.</p>

          <div class="form-group">
            <label class="form-label">Application Name <span class="required">*</span></label>
            <input class="form-input" type="text" id="appName" placeholder="e.g. Acme Events" style="max-width:400px">
            <p class="form-hint">This name will appear in the LinkedIn OAuth consent dialog shown to attendees</p>
          </div>

          <div class="form-group">
            <label class="form-label">Application Logo</label>
            <div class="upload-area" onclick="document.getElementById('logoUpload').click()">
              <input type="file" id="logoUpload" accept="image/*" style="display:none">
              <div class="upload-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="40" height="40"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <div class="upload-text">Click to upload or drag and drop</div>
              <div class="upload-hint">PNG, JPG, or SVG. 100x100px recommended. Max 1MB.</div>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="card-title">Primary Contact</h2>
          <p class="card-desc">The primary technical contact who will manage this integration.</p>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Contact Name <span class="required">*</span></label>
              <input class="form-input" type="text" id="contactName" placeholder="Full name">
            </div>
            <div class="form-group">
              <label class="form-label">Contact Email <span class="required">*</span></label>
              <input class="form-input" type="email" id="contactEmail" placeholder="admin@acme.com">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Contact Role / Title</label>
            <input class="form-input" type="text" id="contactRole" placeholder="e.g. Event Technology Manager" style="max-width:400px">
          </div>
        </div>

        <div class="wizard-nav">
          <div></div>
          <button class="btn btn-primary" onclick="goToStep(2)">Continue</button>
        </div>
      </div>

      <!-- ═══════════════════════ STEP 2: Features & Scopes ═══════════════════════ -->
      <div class="step-panel" id="step-2">
        <div class="card">
          <h2 class="card-title">LinkedIn Integration Features</h2>
          <p class="card-desc">Select which Verified on LinkedIn features you'd like to enable for your events. Each feature requires specific LinkedIn API permissions (scopes).</p>

          <div class="checkbox-group">
            <label class="checkbox-item checked">
              <input type="checkbox" checked disabled>
              <div class="checkbox-content">
                <div class="checkbox-title">Registration Autofill</div>
                <div class="checkbox-desc">Allow attendees to autofill registration forms with their LinkedIn profile data (name, email, company, job title). Reduces friction and increases completion rates.</div>
                <div style="margin-top:8px">
                  <span class="scope-badge required">Required</span>
                  <span class="scope-badge">openid</span>
                  <span class="scope-badge">profile</span>
                  <span class="scope-badge">email</span>
                </div>
              </div>
            </label>

            <label class="checkbox-item" id="feat-verify">
              <input type="checkbox" onchange="toggleFeature(this, 'feat-verify')">
              <div class="checkbox-content">
                <div class="checkbox-title">Identity Verification Badges</div>
                <div class="checkbox-desc">Display LinkedIn verification status on attendee profiles in your event app. Helps attendees identify credible professionals and builds trust in the attendee pool.</div>
                <div style="margin-top:8px">
                  <span class="scope-badge">r_verification_report</span>
                </div>
              </div>
            </label>

            <label class="checkbox-item" id="feat-connect">
              <input type="checkbox" onchange="toggleFeature(this, 'feat-connect')">
              <div class="checkbox-content">
                <div class="checkbox-title">In-App LinkedIn Connections</div>
                <div class="checkbox-desc">Enable attendees to send LinkedIn connection requests directly from within your event app, making it easy to maintain professional relationships formed at the event.</div>
                <div style="margin-top:8px">
                  <span class="scope-badge">w_member_social</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div class="card">
          <h2 class="card-title">Data Sharing & Consent</h2>
          <p class="card-desc">Configure how attendee data is shared and managed.</p>

          <div class="toggle-group">
            <label class="toggle">
              <input type="checkbox" checked>
              <span class="toggle-slider"></span>
            </label>
            <span class="toggle-label">Per-event consent</span>
          </div>
          <p class="toggle-desc">Members must consent to share their data for each event separately. Data will not be shared across events.</p>

          <div class="toggle-group">
            <label class="toggle">
              <input type="checkbox" checked>
              <span class="toggle-slider"></span>
            </label>
            <span class="toggle-label">Show verification details to other attendees</span>
          </div>
          <p class="toggle-desc">When enabled, attendees who are verified on LinkedIn will have a badge visible to other attendees in the event app's networking section.</p>

          <div class="toggle-group">
            <label class="toggle">
              <input type="checkbox">
              <span class="toggle-slider"></span>
            </label>
            <span class="toggle-label">Allow attendees to revoke consent in-app</span>
          </div>
          <p class="toggle-desc">Members can revoke data sharing consent from within the event app. Their LinkedIn data will be removed from your event.</p>
        </div>

        <div class="wizard-nav">
          <button class="btn btn-secondary" onclick="goToStep(1)">Back</button>
          <button class="btn btn-primary" onclick="goToStep(3)">Continue</button>
        </div>
      </div>

      <!-- ═══════════════════════ STEP 3: Technical Setup ═══════════════════════ -->
      <div class="step-panel" id="step-3">
        <div class="card">
          <h2 class="card-title">OAuth 2.0 Configuration</h2>
          <p class="card-desc">Configure the OAuth redirect URIs for your LinkedIn integration. These are the URLs where LinkedIn will redirect attendees after they authorize your application.</p>

          <div class="info-box">
            <svg class="info-box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><circle cx="12" cy="8" r="0.5" fill="currentColor"/></svg>
            <div class="info-box-text">
              Redirect URIs must use HTTPS in production. You may add up to 10 redirect URIs. Localhost URIs are allowed for development only.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Authorized Redirect URIs <span class="required">*</span></label>
            <div class="url-list" id="redirectUris">
              <div class="url-row">
                <input class="form-input" type="url" placeholder="https://events.acme.com/auth/linkedin/callback" value="">
                <button class="url-remove" onclick="removeUrl(this)" title="Remove">&times;</button>
              </div>
            </div>
            <button class="add-url-btn" onclick="addUrl('redirectUris')">+ Add another redirect URI</button>
          </div>
        </div>

        <div class="card">
          <h2 class="card-title">Legal & Privacy URLs</h2>
          <p class="card-desc">These URLs are required by LinkedIn and will be displayed in the consent screen shown to attendees.</p>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Privacy Policy URL <span class="required">*</span></label>
              <input class="form-input" type="url" id="privacyUrl" placeholder="https://www.acme.com/privacy">
            </div>
            <div class="form-group">
              <label class="form-label">Terms of Service URL <span class="required">*</span></label>
              <input class="form-input" type="url" id="tosUrl" placeholder="https://www.acme.com/terms">
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="card-title">Webhook Configuration <span style="font-size:12px; color:#888; font-weight:400;">(Optional)</span></h2>
          <p class="card-desc">Receive real-time notifications when attendees connect or revoke consent.</p>

          <div class="form-group">
            <label class="form-label">Webhook Endpoint URL</label>
            <input class="form-input" type="url" id="webhookUrl" placeholder="https://events.acme.com/webhooks/linkedin">
            <p class="form-hint">We will send POST requests to this URL for consent revocation and connection events</p>
          </div>
        </div>

        <div class="wizard-nav">
          <button class="btn btn-secondary" onclick="goToStep(2)">Back</button>
          <button class="btn btn-primary" onclick="goToStep(4)">Continue</button>
        </div>
      </div>

      <!-- ═══════════════════════ STEP 4: Compliance ═══════════════════════ -->
      <div class="step-panel" id="step-4">
        <div class="card">
          <h2 class="card-title">Data Usage Agreement</h2>
          <p class="card-desc">Review and accept the terms governing how LinkedIn member data may be used within your events.</p>

          <div class="agreement-box">
            <p><strong>LinkedIn Verified on LinkedIn — Data Usage Terms</strong></p>
            <br>
            <p><strong>1. Permitted Use.</strong> Customer may only use LinkedIn member data obtained through the Verified on LinkedIn integration for the following purposes: (a) pre-filling event registration forms; (b) displaying member identity and verification status within event applications; (c) facilitating in-event networking and LinkedIn connections. Customer shall not use such data for marketing, advertising, recruitment, or any purpose not expressly authorized.</p>
            <br>
            <p><strong>2. Data Retention.</strong> Customer must delete all LinkedIn member data within 30 days after the conclusion of each event, unless the member has provided separate, explicit consent for longer retention. Customer shall not aggregate LinkedIn data across events or merge it with other data sources without explicit member consent.</p>
            <br>
            <p><strong>3. Security Requirements.</strong> Customer shall implement and maintain industry-standard security measures to protect LinkedIn member data, including encryption at rest and in transit, access controls, and regular security audits. Customer shall promptly notify LinkedIn of any data breach involving LinkedIn member data.</p>
            <br>
            <p><strong>4. Consent & Revocation.</strong> Customer acknowledges that members may revoke consent at any time. Upon receiving a consent revocation notification, Customer must delete the affected member's LinkedIn data within 24 hours and propagate this deletion to all downstream systems.</p>
            <br>
            <p><strong>5. Sub-processor Obligations.</strong> As Cvent acts as a data processor, Customer (data controller) is responsible for ensuring all end-customer usage complies with these terms. Customer must contractually bind their end users to the same data protection obligations.</p>
          </div>

          <div class="agreement-check">
            <input type="checkbox" id="agreeTerms">
            <label for="agreeTerms">I have read and agree to the <strong>LinkedIn Data Usage Terms</strong> and confirm that I am authorized to accept these terms on behalf of my organization. <span class="required">*</span></label>
          </div>
        </div>

        <div class="card">
          <h2 class="card-title">End-Customer Data Protection</h2>
          <p class="card-desc">Confirm that your organization will enforce the following requirements with your end customers (event organizers).</p>

          <div class="agreement-check" style="margin-bottom:12px">
            <input type="checkbox" id="agreeEnforce">
            <label for="agreeEnforce">I confirm that my organization will contractually require end customers to limit LinkedIn data usage to <strong>approved use cases only</strong>.</label>
          </div>

          <div class="agreement-check" style="margin-bottom:12px">
            <input type="checkbox" id="agreeInfosec">
            <label for="agreeInfosec">I confirm that my organization will meet LinkedIn's <strong>information security requirements</strong> and will share compliance documentation upon request.</label>
          </div>

          <div class="agreement-check" style="margin-bottom:12px">
            <input type="checkbox" id="agreeRevocation">
            <label for="agreeRevocation">I confirm that my organization will honor all <strong>consent revocation requests</strong> and propagate deletions to end customer databases within the required timeframe.</label>
          </div>
        </div>

        <div class="card">
          <h2 class="card-title">Estimated Event Volume</h2>
          <p class="card-desc">Help us understand your expected usage to ensure proper API rate limiting.</p>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Estimated events per year</label>
              <select class="form-input" id="eventVolume">
                <option value="">Select...</option>
                <option>1 - 10</option>
                <option>11 - 50</option>
                <option>51 - 200</option>
                <option>201 - 1000</option>
                <option>1000+</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Average attendees per event</label>
              <select class="form-input" id="attendeeVolume">
                <option value="">Select...</option>
                <option>Under 100</option>
                <option>100 - 500</option>
                <option>500 - 2,000</option>
                <option>2,000 - 10,000</option>
                <option>10,000+</option>
              </select>
            </div>
          </div>
        </div>

        <div class="wizard-nav">
          <button class="btn btn-secondary" onclick="goToStep(3)">Back</button>
          <button class="btn btn-primary" onclick="goToStep(5)">Review & Submit</button>
        </div>
      </div>

      <!-- ═══════════════════════ STEP 5: Review & Submit ═══════════════════════ -->
      <div class="step-panel" id="step-5">
        <div class="card" id="review-card">
          <h2 class="card-title">Review Your Application</h2>
          <p class="card-desc">Please review the details below before submitting. Your application will be reviewed by the LinkedIn team, and you'll receive credentials once approved.</p>

          <div class="review-section">
            <div class="review-section-title">
              Company Details
              <a class="review-edit-link" onclick="goToStep(1)">Edit</a>
            </div>
            <div class="review-row">
              <span class="review-label">Company Name</span>
              <span class="review-value" id="rev-company">—</span>
            </div>
            <div class="review-row">
              <span class="review-label">LinkedIn Company Page</span>
              <span class="review-value" id="rev-linkedin">—</span>
            </div>
            <div class="review-row">
              <span class="review-label">Company Website</span>
              <span class="review-value" id="rev-website">—</span>
            </div>
            <div class="review-row">
              <span class="review-label">Application Name</span>
              <span class="review-value" id="rev-appname">—</span>
            </div>
            <div class="review-row">
              <span class="review-label">Primary Contact</span>
              <span class="review-value" id="rev-contact">—</span>
            </div>
          </div>

          <div class="review-section">
            <div class="review-section-title">
              Features & Scopes
              <a class="review-edit-link" onclick="goToStep(2)">Edit</a>
            </div>
            <div class="review-row">
              <span class="review-label">Enabled Features</span>
              <span class="review-value" id="rev-features">—</span>
            </div>
            <div class="review-row">
              <span class="review-label">API Scopes</span>
              <span class="review-value" id="rev-scopes">—</span>
            </div>
          </div>

          <div class="review-section">
            <div class="review-section-title">
              Technical Setup
              <a class="review-edit-link" onclick="goToStep(3)">Edit</a>
            </div>
            <div class="review-row">
              <span class="review-label">Redirect URIs</span>
              <span class="review-value" id="rev-redirects">—</span>
            </div>
            <div class="review-row">
              <span class="review-label">Privacy Policy</span>
              <span class="review-value" id="rev-privacy">—</span>
            </div>
            <div class="review-row">
              <span class="review-label">Terms of Service</span>
              <span class="review-value" id="rev-tos">—</span>
            </div>
          </div>

          <div class="review-section">
            <div class="review-section-title">
              Compliance
              <a class="review-edit-link" onclick="goToStep(4)">Edit</a>
            </div>
            <div class="review-row">
              <span class="review-label">Data Usage Agreement</span>
              <span class="review-value" id="rev-agreement">—</span>
            </div>
            <div class="review-row">
              <span class="review-label">Estimated Volume</span>
              <span class="review-value" id="rev-volume">—</span>
            </div>
          </div>
        </div>

        <!-- Success state (hidden initially) -->
        <div class="card" id="success-card" style="display:none">
          <div class="success-panel">
            <div class="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 class="success-title">Application Submitted Successfully</h2>
            <p class="success-desc">Your Verified on LinkedIn integration request has been submitted for review. The LinkedIn team will review your application and provision your API credentials.</p>

            <div class="success-detail">
              <div class="success-detail-row">
                <span class="success-detail-label">Application ID</span>
                <span class="success-detail-value">LI-VOLI-2026-00847</span>
              </div>
              <div class="success-detail-row">
                <span class="success-detail-label">Submitted</span>
                <span class="success-detail-value">April 3, 2026</span>
              </div>
              <div class="success-detail-row">
                <span class="success-detail-label">Status</span>
                <span class="success-detail-value"><span class="status-badge pending">Pending Review</span></span>
              </div>
              <div class="success-detail-row">
                <span class="success-detail-label">Estimated Review Time</span>
                <span class="success-detail-value">3 - 5 business days</span>
              </div>
            </div>

            <button class="btn btn-primary" onclick="window.location.href='/cvent-integration-setup'" style="margin-right:8px">Back to Integrations</button>
            <button class="btn btn-outline" onclick="window.location.href='/cvent-integration-setup'">View Application Status</button>
          </div>
        </div>

        <div class="wizard-nav" id="review-nav">
          <button class="btn btn-secondary" onclick="goToStep(4)">Back</button>
          <button class="btn btn-primary" onclick="submitApplication()" style="background:#2e7d32">Submit Application</button>
        </div>
      </div>

    </main>
  </div>

  <script>
    let currentStep = 1;

    function goToStep(step) {
      // Don't allow forward jumps past current + 1 (except going back)
      if (step > currentStep + 1) return;

      // Update panels
      document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('step-' + step).classList.add('active');

      // Update wizard progress
      document.querySelectorAll('.wizard-step').forEach(s => {
        const sNum = parseInt(s.dataset.step);
        s.classList.remove('active', 'completed');
        if (sNum === step) s.classList.add('active');
        else if (sNum < step) s.classList.add('completed');
      });

      // Track highest step
      if (step > currentStep) currentStep = step;

      // Populate review if going to step 5
      if (step === 5) populateReview();

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function toggleFeature(checkbox, id) {
      const item = document.getElementById(id);
      if (checkbox.checked) {
        item.classList.add('checked');
      } else {
        item.classList.remove('checked');
      }
    }

    function addUrl(containerId) {
      const container = document.getElementById(containerId);
      const row = document.createElement('div');
      row.className = 'url-row';
      row.innerHTML = '<input class="form-input" type="url" placeholder="https://..."><button class="url-remove" onclick="removeUrl(this)" title="Remove">&times;</button>';
      container.appendChild(row);
    }

    function removeUrl(btn) {
      const container = btn.closest('.url-list');
      if (container.children.length > 1) {
        btn.parentElement.remove();
      }
    }

    function populateReview() {
      const val = id => (document.getElementById(id)?.value || '').trim();
      const checked = id => document.getElementById(id)?.checked;

      document.getElementById('rev-company').textContent = val('companyName') || '—';
      document.getElementById('rev-linkedin').textContent = val('companyLinkedIn') || '—';
      document.getElementById('rev-website').textContent = val('companyWebsite') || '—';
      document.getElementById('rev-appname').textContent = val('appName') || '—';

      const name = val('contactName');
      const email = val('contactEmail');
      document.getElementById('rev-contact').textContent = (name && email) ? name + ' (' + email + ')' : (name || email || '—');

      // Features
      const features = ['Registration Autofill'];
      if (document.querySelector('#feat-verify input')?.checked) features.push('Identity Verification Badges');
      if (document.querySelector('#feat-connect input')?.checked) features.push('In-App LinkedIn Connections');
      document.getElementById('rev-features').textContent = features.join(', ');

      // Scopes
      const scopes = ['openid', 'profile', 'email'];
      if (document.querySelector('#feat-verify input')?.checked) scopes.push('r_verification_report');
      if (document.querySelector('#feat-connect input')?.checked) scopes.push('w_member_social');
      document.getElementById('rev-scopes').innerHTML = scopes.map(s => '<span class="scope-badge">' + s + '</span>').join(' ');

      // Redirects
      const uris = [];
      document.querySelectorAll('#redirectUris .form-input').forEach(i => { if (i.value.trim()) uris.push(i.value.trim()); });
      document.getElementById('rev-redirects').textContent = uris.length ? uris.join(', ') : '—';

      document.getElementById('rev-privacy').textContent = val('privacyUrl') || '—';
      document.getElementById('rev-tos').textContent = val('tosUrl') || '—';

      // Compliance
      const agreed = checked('agreeTerms') && checked('agreeEnforce') && checked('agreeInfosec') && checked('agreeRevocation');
      document.getElementById('rev-agreement').innerHTML = agreed
        ? '<span style="color:#2e7d32; font-weight:600">All agreements accepted</span>'
        : '<span style="color:#d32f2f; font-weight:600">Incomplete — please review</span>';

      const evtVol = val('eventVolume');
      const attVol = val('attendeeVolume');
      document.getElementById('rev-volume').textContent = (evtVol && attVol) ? evtVol + ' events/year, ' + attVol + ' attendees/event' : '—';
    }

    function submitApplication() {
      document.getElementById('review-card').style.display = 'none';
      document.getElementById('review-nav').style.display = 'none';
      document.getElementById('success-card').style.display = 'block';

      // Mark all steps completed
      document.querySelectorAll('.wizard-step').forEach(s => {
        s.classList.remove('active');
        s.classList.add('completed');
      });
    }
  </script>
</body>
</html>`;
}

module.exports = { getCventIntegrationSetupPage };
