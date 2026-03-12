const IN_BUG_WHITE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="14" height="14"><path fill="#fff" d="M92.23,92.23h-11.88v-18.6c0-4.44-.08-10.15-6.18-10.15s-7.14,4.83-7.14,9.83v18.92h-11.88V53.97h11.41v5.23h.16c1.59-3.01,5.47-6.18,11.25-6.18,12.04,0,14.27,7.92,14.27,18.22v20.98ZM41.75,48.74c-3.81,0-6.89-3.09-6.89-6.9s3.08-6.89,6.89-6.89,6.89,3.09,6.89,6.89-3.09,6.9-6.89,6.9m5.94,43.49h-11.89V53.97h11.89v38.26ZM98.15,23.92H29.83c-3.27,0-5.92,2.59-5.92,5.78V98.3c0,3.19,2.65,5.78,5.92,5.78H98.15c3.27,0,5.93-2.59,5.93-5.78V29.7c0-3.19-2.66-5.78-5.93-5.78"/></svg>`;

function getAttendeeListPage() {
  const attendees = [
    { img: '/images/download.jpeg',  name: 'Jamie Martinez',   title: 'Senior Product Manager, Salesforce',          degree: null,  featured: true },
    { img: '/images/download1.jpeg', name: 'Alex Liu',          title: 'Software Engineer, Google',                  degree: null,  featured: true },
    { img: '/images/download2.jpeg', name: 'Rachel Kim',        title: 'UX Designer, Adobe',                         degree: null,  featured: true },
    { img: '/images/download3.jpeg', name: 'David Chen',        title: 'Executive Vice President, Sales, Hosp...',   degree: 2,     featured: true },
    { img: '/images/download4.jpeg', name: 'Sarah Thompson',    title: 'Senior Vice President, Chief Financial ...',  degree: 1,     featured: true },
    { img: '/images/download5.jpeg', name: 'Michael Torres',    title: 'Data Scientist, Meta',                       degree: 2,     featured: false },
    { img: null, initials: 'EP', color: '#0a9396', name: 'Emily Park',   title: 'Product Lead, Figma',              degree: 1,     featured: false },
    { img: null, initials: 'JW', color: '#5b8def', name: 'James Wilson', title: 'Chief Technology Officer, Notion', degree: null,  featured: false },
  ];

  function degreeBadge(degree) {
    if (!degree) return '';
    return `<span class="degree-pill">${degree === 1 ? '1st' : '2nd'} ${IN_BUG_WHITE}</span>`;
  }

  function avatarEl(a) {
    if (a.img) return `<img src="${a.img}" class="attendee-photo" alt="${a.name}">`;
    return `<div class="attendee-photo attendee-initials" style="background:${a.color}">${a.initials}</div>`;
  }

  function row(a, i, arr) {
    const divider = i < arr.length - 1 ? '<div class="row-divider"></div>' : '';
    return `
      <div class="attendee-row">
        ${avatarEl(a)}
        <div class="attendee-info">
          <div class="name-line">
            <span class="attendee-name">${a.name}</span>
            ${degreeBadge(a.degree)}
          </div>
          <div class="attendee-title">${a.title}</div>
          ${a.featured ? '<div class="featured-tag">Featured</div>' : ''}
        </div>
      </div>
      ${divider}`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Attendee List</title>
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
      background: #1a2385;
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
      padding: 12px 22px 0;
      background: #1a2385;
    }
    .header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }
    .header-title {
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      flex: 1;
      text-align: center;
    }
    .search-icon {
      width: 30px; height: 30px;
      border: 2px solid rgba(255,255,255,0.55);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-spacer { width: 30px; }

    /* Filter + sort bar */
    .filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 0;
    }
    .featured-chip {
      padding: 6px 16px;
      border: 2px solid rgba(255,255,255,0.7);
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      color: #fff;
    }
    .li-filter-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #0a66c2;
      border: 2px solid #0a66c2;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      color: #fff;
      text-decoration: none;
    }
    .li-filter-chip:hover { background: #004182; border-color: #004182; }

    /* List area */
    .list-area {
      flex: 1;
      overflow-y: auto;
      background: #152070;
      margin-top: 14px;
    }
    .list-area::-webkit-scrollbar { display: none; }

    .sort-bar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 10px 20px 8px;
      gap: 4px;
    }
    .sort-label {
      font-size: 13px;
      color: rgba(255,255,255,0.75);
      font-weight: 500;
    }
    .sort-caret { font-size: 13px; color: rgba(255,255,255,0.75); }

    /* Rows */
    .attendee-row {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px 20px;
    }
    .row-divider {
      height: 1px;
      background: rgba(255,255,255,0.08);
      margin: 0 20px;
    }

    .attendee-photo {
      width: 56px; height: 56px;
      border-radius: 28px;
      object-fit: cover;
      flex-shrink: 0;
    }
    .attendee-initials {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
      color: #fff;
    }

    .attendee-info { flex: 1; min-width: 0; padding-top: 2px; }

    .name-line {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 4px;
    }
    .attendee-name {
      font-size: 17px;
      font-weight: 700;
      color: #fff;
    }

    /* LinkedIn degree pill — white rounded rect with [in] icon */
    .degree-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #fff;
      border-radius: 6px;
      padding: 2px 7px 2px 6px;
      font-size: 12px;
      font-weight: 800;
      color: #0a66c2;
      line-height: 1;
    }
    .degree-pill svg path { fill: #0a66c2; }

    .attendee-title {
      font-size: 13px;
      color: rgba(255,255,255,0.55);
      margin-bottom: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Featured tag — looks like a ribbon */
    .featured-tag {
      display: inline-flex;
      align-items: center;
      background: rgba(255,255,255,0.12);
      border-radius: 4px;
      padding: 3px 10px;
      font-size: 11px;
      font-weight: 700;
      color: rgba(255,255,255,0.8);
      letter-spacing: 0.3px;
    }

    /* Bottom nav */
    .bottom-nav {
      flex-shrink: 0;
      background: #101860;
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
      opacity: 0.4;
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

    <!-- Header -->
    <div class="app-header">
      <div class="header-top">
        <div class="header-spacer"></div>
        <div class="header-title">Attendees</div>
        <div class="search-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </div>
      </div>
      <div class="filter-bar">
        <div class="featured-chip">Featured</div>
        <a class="li-filter-chip" href="/attendee-network">
          ${IN_BUG_WHITE}
          Connections
        </a>
      </div>
    </div>

    <!-- List -->
    <div class="list-area">
      <div class="sort-bar">
        <span class="sort-label">Sorted by default order</span>
        <span class="sort-caret">&#8964;</span>
      </div>
      ${attendees.map((a, i, arr) => row(a, i, arr)).join('')}
    </div>

    <!-- Bottom nav -->
    <div class="bottom-nav">
      <div class="nav-item">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
      </div>
      <div class="nav-item">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
      </div>
      <div class="nav-item active">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="#fff" stroke-width="2" fill="none"/></svg>
        <div class="nav-dot"></div>
      </div>
      <div class="nav-item">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
      </div>
      <div class="nav-item">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
      </div>
    </div>

  </div>
</body>
</html>`;
}

module.exports = { getAttendeeListPage };
