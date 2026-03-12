const IN_BUG_WHITE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="12" height="12"><path fill="#fff" d="M92.23,92.23h-11.88v-18.6c0-4.44-.08-10.15-6.18-10.15s-7.14,4.83-7.14,9.83v18.92h-11.88V53.97h11.41v5.23h.16c1.59-3.01,5.47-6.18,11.25-6.18,12.04,0,14.27,7.92,14.27,18.22v20.98ZM41.75,48.74c-3.81,0-6.89-3.09-6.89-6.9s3.08-6.89,6.89-6.89,6.89,3.09,6.89,6.89-3.09,6.9-6.89,6.9m5.94,43.49h-11.89V53.97h11.89v38.26ZM98.15,23.92H29.83c-3.27,0-5.92,2.59-5.92,5.78V98.3c0,3.19,2.65,5.78,5.92,5.78H98.15c3.27,0,5.93-2.59,5.93-5.78V29.7c0-3.19-2.66-5.78-5.93-5.78"/></svg>`;

function getAttendeeNetworkPage() {
  const attendees = [
    { initials: 'JM', color: '#5b8def', img: '/images/download.jpeg',  name: 'Martinez, Jamie',    title: 'Senior Product Manager',   company: 'Salesforce', degree: 1 },
    { initials: 'AL', color: '#e86c3a', img: '/images/download1.jpeg', name: 'Liu, Alex',          title: 'Software Engineer',        company: 'Google',     degree: 1 },
    { initials: 'RK', color: '#7b5ea7', img: '/images/download2.jpeg', name: 'Kim, Rachel',        title: 'UX Designer',              company: 'Adobe',      degree: 1 },
    { initials: 'DC', color: '#2da44e', img: '/images/download3.jpeg', name: 'Chen, David',        title: 'Marketing Director',       company: 'HubSpot',    degree: 1 },
    { initials: 'ST', color: '#e8a23a', img: '/images/download4.jpeg', name: 'Thompson, Sarah',    title: 'VP of Engineering',        company: 'Stripe',     degree: 2 },
    { initials: 'MT', color: '#d64e4e', img: '/images/download5.jpeg', name: 'Torres, Michael',    title: 'Data Scientist',           company: 'Meta',       degree: 2 },
    { initials: 'EP', color: '#0a9396', img: null,                          name: 'Park, Emily',     title: 'Product Lead',             company: 'Figma',      degree: 2 },
    { initials: 'JW', color: '#5b8def', img: null,                          name: 'Wilson, James',   title: 'Chief Technology Officer', company: 'Notion',     degree: 2 },
    { initials: 'PS', color: '#a35fce', img: null,                          name: 'Sharma, Priya',   title: 'Design Engineer',          company: 'Airbnb',     degree: 2 },
    { initials: 'BN', color: '#4a5568', img: null,                          name: 'Nguyen, Brandon', title: 'Solutions Architect',      company: 'AWS',        degree: null },
    { initials: 'LH', color: '#4a5568', img: null,                          name: 'Hayes, Lauren',   title: 'Product Designer',         company: 'Figma',      degree: null },
    { initials: 'OM', color: '#4a5568', img: null,                          name: 'Miller, Oliver',  title: 'Growth Manager',           company: 'Intercom',   degree: null },
  ];

  function degreeTag(degree) {
    if (degree === 1) return `<span class="degree-badge first">1st</span>`;
    if (degree === 2) return `<span class="degree-badge second">2nd</span>`;
    return '';
  }

  function row(a) {
    const avatarEl = a.img
      ? `<img src="${a.img}" class="avatar avatar-img" alt="${a.initials}">`
      : `<div class="avatar" style="background:${a.color}">${a.initials}</div>`;
    return `
      <div class="attendee-row">
        <div class="avatar-wrap">
          ${avatarEl}
          ${degreeTag(a.degree)}
        </div>
        <div class="attendee-info">
          <div class="attendee-name">${a.name}</div>
          <div class="attendee-meta">${a.title} · ${a.company}</div>
        </div>
        <div class="chevron">›</div>
      </div>`;
  }

  const firstDegree  = attendees.filter(a => a.degree === 1);
  const secondDegree = attendees.filter(a => a.degree === 2);
  const others       = attendees.filter(a => a.degree === null);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Attendee Network</title>
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

    /* App header */
    .app-header {
      padding: 14px 20px 0;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .header-back {
      font-size: 15px;
      color: rgba(255,255,255,0.6);
      display: flex;
      align-items: center;
      gap: 4px;
      text-decoration: none;
    }
    .header-back:hover { color: #fff; }
    .header-title {
      font-size: 17px;
      font-weight: 700;
      color: #fff;
    }
    .header-filter {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255,255,255,0.5);
    }

    /* Search bar */
    .search-bar {
      display: flex;
      align-items: center;
      background: rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 8px 12px;
      gap: 8px;
      margin-bottom: 12px;
    }
    .search-bar svg { flex-shrink: 0; fill: rgba(255,255,255,0.35); }
    .search-bar span { font-size: 14px; color: rgba(255,255,255,0.35); }

    /* Filter chips */
    .filter-row {
      display: flex;
      gap: 8px;
      padding-bottom: 12px;
      overflow-x: auto;
    }
    .filter-row::-webkit-scrollbar { display: none; }
    .chip {
      flex-shrink: 0;
      padding: 5px 12px;
      border-radius: 16px;
      border: 1.5px solid rgba(255,255,255,0.15);
      font-size: 12px;
      font-weight: 600;
      color: rgba(255,255,255,0.6);
      background: transparent;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .chip.active {
      background: #0a66c2;
      border-color: #0a66c2;
      color: #fff;
    }

    /* Scrollable list */
    .screen-scroll {
      flex: 1;
      overflow-y: auto;
    }
    .screen-scroll::-webkit-scrollbar { display: none; }

    /* Section header */
    .section-header {
      padding: 10px 20px 6px;
      font-size: 11px;
      font-weight: 700;
      color: rgba(255,255,255,0.35);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 6px;
    }
    .section-count {
      background: rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.45);
      font-size: 10px;
      font-weight: 700;
      padding: 1px 7px;
      border-radius: 10px;
    }
    .li-section-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px; height: 18px;
      background: #0a66c2;
      border-radius: 3px;
    }

    /* Attendee rows */
    .attendee-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 20px;
      background: rgba(255,255,255,0.05);
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }

    .avatar-wrap { position: relative; flex-shrink: 0; }
    .avatar {
      width: 44px; height: 44px;
      border-radius: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      color: #fff;
    }
    .avatar-img {
      object-fit: cover;
      background: none;
    }

    .degree-badge {
      position: absolute;
      bottom: -2px; right: -4px;
      font-size: 9px;
      font-weight: 800;
      padding: 1px 5px;
      border-radius: 8px;
      line-height: 1.4;
    }
    .degree-badge.first  { background: #0a66c2; color: #fff; border: 1.5px solid #1a1a5e; }
    .degree-badge.second { background: #1a1a5e; color: #7ab8f5; border: 1.5px solid #7ab8f5; }

    .attendee-info { flex: 1; min-width: 0; }
    .attendee-name {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .attendee-meta {
      font-size: 12px;
      color: rgba(255,255,255,0.45);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }
    .chevron { font-size: 20px; color: rgba(255,255,255,0.2); font-weight: 300; }

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
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      cursor: pointer;
      opacity: 0.45;
      text-decoration: none;
    }
    .nav-item.active { opacity: 1; }
    .nav-item svg { fill: #fff; }
    .nav-dot { width: 4px; height: 4px; border-radius: 50%; background: #fff; }
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

    <!-- App header -->
    <div class="app-header">
      <div class="header-top">
        <a class="header-back" href="/attendee-list">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M7 1L1 7l6 6" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round"/></svg>
          Back
        </a>
        <div class="header-title">Attendees</div>
        <div class="header-filter">Filter</div>
      </div>

      <!-- Search -->
      <div class="search-bar">
        <svg width="16" height="16" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <span>Search attendees</span>
      </div>

      <!-- Filter chips -->
      <div class="filter-row">
        <div class="chip active">
          ${IN_BUG_WHITE}
          Connections
        </div>
        <div class="chip">Industry</div>
        <div class="chip">Company</div>
        <div class="chip">More ›</div>
      </div>
    </div>

    <!-- Attendee list -->
    <div class="screen-scroll">

      <div class="section-header">
        <div class="li-section-icon">${IN_BUG_WHITE}</div>
        1st Degree
        <span class="section-count">${firstDegree.length}</span>
      </div>
      ${firstDegree.map(row).join('')}

      <div class="section-header">
        <div class="li-section-icon">${IN_BUG_WHITE}</div>
        2nd Degree
        <span class="section-count">${secondDegree.length}</span>
      </div>
      ${secondDegree.map(row).join('')}

      <div class="section-header">
        Other Attendees
        <span class="section-count">${others.length}</span>
      </div>
      ${others.map(row).join('')}

    </div>

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
      <a class="nav-item" href="/attendee-hub" style="text-decoration:none;">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
      </a>
    </div>

  </div>
</body>
</html>`;
}

module.exports = { getAttendeeNetworkPage };
