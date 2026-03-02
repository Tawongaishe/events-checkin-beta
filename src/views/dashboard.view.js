const { EVENT_NAME } = require('../config');

const IN_BUG_WHITE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="24" height="24"><path fill="#fff" d="M92.23,92.23h-11.88v-18.6c0-4.44-.08-10.15-6.18-10.15s-7.14,4.83-7.14,9.83v18.92h-11.88V53.97h11.41v5.23h.16c1.59-3.01,5.47-6.18,11.25-6.18,12.04,0,14.27,7.92,14.27,18.22v20.98ZM41.75,48.74c-3.81,0-6.89-3.09-6.89-6.9s3.08-6.89,6.89-6.89,6.89,3.09,6.89,6.89-3.09,6.9-6.89,6.9m5.94,43.49h-11.89V53.97h11.89v38.26ZM98.15,23.92H29.83c-3.27,0-5.92,2.59-5.92,5.78V98.3c0,3.19,2.65,5.78,5.92,5.78H98.15c3.27,0,5.93-2.59,5.93-5.78V29.7c0-3.19-2.66-5.78-5.93-5.78"/></svg>`;

function getLoginPage(errorMessage = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard — ${EVENT_NAME}</title>
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
      width: 100%;
      max-width: 380px;
      overflow: hidden;
    }
    .card-top {
      background: #1b1f23;
      padding: 28px 28px 24px;
      text-align: center;
    }
    .card-top-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    .card-top h1 { font-size: 18px; font-weight: 700; color: #ffffff; }
    .card-top p { font-size: 13px; color: rgba(255,255,255,0.6); margin-top: 4px; }
    .card-body { padding: 24px 28px 28px; }
    .form-group { margin-bottom: 16px; }
    label { display: block; font-weight: 600; font-size: 13px; color: #1b1f23; margin-bottom: 6px; }
    input {
      width: 100%;
      padding: 10px 12px;
      border: 1.5px solid #e0dfdc;
      border-radius: 4px;
      font-size: 14px;
      color: #1b1f23;
      transition: border-color 0.15s;
      background: #fff;
    }
    input:focus { outline: none; border-color: #0a66c2; }
    button {
      width: 100%;
      height: 48px;
      background: #0a66c2;
      color: white;
      border: none;
      border-radius: 24px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
      margin-top: 4px;
    }
    button:hover { background: #004182; }
    .error {
      background: #fce4ec;
      color: #b71c1c;
      padding: 10px 12px;
      border-radius: 4px;
      margin-bottom: 16px;
      font-size: 13px;
      border-left: 3px solid #e53935;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="card-top">
      <div class="card-top-icon">${IN_BUG_WHITE}</div>
      <h1>Admin Dashboard</h1>
      <p>${EVENT_NAME}</p>
    </div>
    <div class="card-body">
      ${errorMessage ? `<div class="error">${errorMessage}</div>` : ''}
      <form method="POST">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" required autofocus autocomplete="username">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required autocomplete="current-password">
        </div>
        <button type="submit">Sign in</button>
      </form>
    </div>
  </div>
</body>
</html>`;
}

function getDashboardPage(stats) {
  const {
    totalCheckins, totalAttendees, walkIns = 0, checkins,
    feedback = [], avgRating, ratingDistribution = {1:0,2:0,3:0,4:0,5:0},
    durationBuckets = {}, errors = [], dropOffRate = 0
  } = stats;
  const registeredCheckins = totalCheckins - walkIns;
  const remaining = Math.max(0, totalAttendees - registeredCheckins);
  const pct = totalAttendees > 0 ? Math.round((registeredCheckins / totalAttendees) * 100) : 0;

  const matchLabels = {
    matched_linkedin_url: '<span class="match-badge match-linkedin">LinkedIn URL</span>',
    matched_email: '<span class="match-badge match-email">Email</span>',
    matched_name: '<span class="match-badge match-name">Name</span>',
    not_matched: '<span class="match-badge match-walkin">Walk-in</span>'
  };

  // Rating bar chart
  const maxRating = Math.max(...Object.values(ratingDistribution), 1);
  const ratingBarsHtml = [5,4,3,2,1].map(n => {
    const count = ratingDistribution[n] || 0;
    const pctBar = Math.round((count / maxRating) * 100);
    const color = n >= 4 ? '#057642' : n === 3 ? '#c37d16' : '#e53935';
    return `<div class="chart-row">
      <span class="chart-label">${'★'.repeat(n)}</span>
      <div class="chart-bar-wrap"><div class="chart-bar" style="width:${pctBar}%;background:${color}"></div></div>
      <span class="chart-count">${count}</span>
    </div>`;
  }).join('');

  // Duration histogram
  const maxDuration = Math.max(...Object.values(durationBuckets), 1);
  const durationBarsHtml = Object.entries(durationBuckets).map(([label, count]) => {
    const pctBar = Math.round((count / maxDuration) * 100);
    return `<div class="chart-row">
      <span class="chart-label" style="width:52px">${label}</span>
      <div class="chart-bar-wrap"><div class="chart-bar" style="width:${pctBar}%;background:#0a66c2"></div></div>
      <span class="chart-count">${count}</span>
    </div>`;
  }).join('');

  // Feedback comments
  const feedbackListHtml = feedback.length > 0
    ? feedback.map(f => {
        const stars = '★'.repeat(f.rating) + '☆'.repeat(5 - f.rating);
        const time = f.submitted_at
          ? new Date(f.submitted_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' · ' +
            new Date(f.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
          : '';
        return `<div class="feedback-item">
          <div class="feedback-stars" style="color:#f59e0b">${stars}</div>
          <div>
            <div class="feedback-comment-text">${f.comment ? f.comment : '<span style="color:#bbb;font-style:italic">No comment</span>'}</div>
            <div class="feedback-meta">${time}</div>
          </div>
        </div>`;
      }).join('')
    : '<div class="feedback-empty">No feedback submitted yet.</div>';

  const rows = checkins.map(c => {
    const name = c.linkedin_name || c.attendees?.full_name || '—';
    const email = c.linkedin_email || c.attendees?.email || '—';
    const liCompany = c.linkedin_company || '<span style="color:#bbb;">—</span>';
    const regCompany = c.attendees?.company || '<span style="color:#bbb;">—</span>';
    const education = c.linkedin_education || '<span style="color:#bbb;">—</span>';
    const profileUrl = c.linkedin_profile_url || '';
    const nameCell = profileUrl
      ? `<a href="${profileUrl}" target="_blank" rel="noopener" style="color:#0a66c2;text-decoration:none;font-weight:600;">${name}</a>`
      : `<span style="font-weight:600;">${name}</span>`;
    const verified = c.verified_identity
      ? '<span style="color:#057642;font-weight:600;font-size:13px;">✓ Verified</span>'
      : '<span style="color:#bbb;">—</span>';
    const matchCell = matchLabels[c.match_status] || '<span style="color:#bbb;">—</span>';
    const time = c.checked_in_at
      ? new Date(c.checked_in_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
        '<br><span style="font-size:11px;color:#999;">' +
        new Date(c.checked_in_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + '</span>'
      : '—';
    const rowBg = c.match_status === 'not_matched' ? ' style="background:#fffdf5;"' : '';

    return `<tr${rowBg}>
      <td>
        ${c.linkedin_profile_picture ? `<img src="${c.linkedin_profile_picture}" alt="${name}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:8px;border:1px solid #e0dfdc;">` : '<span style="display:inline-block;width:32px;height:32px;border-radius:50%;background:#e0dfdc;vertical-align:middle;margin-right:8px;"></span>'}
        <span style="vertical-align:middle;">${nameCell}</span>
      </td>
      <td>${email}</td>
      <td>${liCompany}</td>
      <td>${regCompany}</td>
      <td>${education}</td>
      <td>${matchCell}</td>
      <td>${verified}</td>
      <td>${time}</td>
    </tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard — ${EVENT_NAME}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #f3f2ef;
      color: #1b1f23;
    }
    .topbar {
      background: #1b1f23;
      color: white;
      padding: 0 28px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .topbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .topbar-left span {
      font-size: 15px;
      font-weight: 600;
      color: #ffffff;
    }
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .topbar-time { font-size: 12px; color: rgba(255,255,255,0.5); margin-right: 8px; }
    .topbar-btn {
      color: rgba(255,255,255,0.75);
      font-size: 13px;
      text-decoration: none;
      border: 1px solid rgba(255,255,255,0.2);
      padding: 5px 12px;
      border-radius: 16px;
      transition: all 0.15s;
      font-weight: 500;
    }
    .topbar-btn:hover { background: rgba(255,255,255,0.1); color: white; border-color: rgba(255,255,255,0.4); }
    .container { max-width: 1200px; margin: 0 auto; padding: 28px 20px; }
    .page-title { font-size: 20px; font-weight: 700; color: #1b1f23; margin-bottom: 4px; }
    .page-sub { font-size: 14px; color: #595959; margin-bottom: 24px; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: #ffffff;
      border-radius: 8px;
      padding: 18px 20px;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.08);
      border-top: 3px solid #0a66c2;
    }
    .stat-card.green { border-top-color: #057642; }
    .stat-card.amber { border-top-color: #c37d16; }
    .stat-card.gray { border-top-color: #595959; }
    .stat-label { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .stat-value { font-size: 32px; font-weight: 700; color: #1b1f23; line-height: 1; }
    .stat-sub { font-size: 12px; color: #999; margin-top: 5px; }
    .progress-wrap {
      background: #ffffff;
      border-radius: 8px;
      padding: 16px 20px;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.08);
      margin-bottom: 24px;
    }
    .progress-label { font-size: 13px; font-weight: 600; color: #1b1f23; margin-bottom: 8px; }
    .progress-bg { background: #e0dfdc; border-radius: 4px; height: 8px; overflow: hidden; }
    .progress-fill { background: #0a66c2; height: 100%; border-radius: 4px; transition: width 0.6s ease; }
    .progress-text { font-size: 12px; color: #595959; margin-top: 6px; }
    .table-card {
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .table-head {
      padding: 14px 16px;
      border-bottom: 1px solid #e0dfdc;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .table-head strong { font-size: 14px; font-weight: 700; color: #1b1f23; }
    .count-badge {
      background: #e3f0fc;
      color: #0a66c2;
      font-size: 12px;
      font-weight: 700;
      padding: 2px 10px;
      border-radius: 10px;
    }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #f9f9f7; border-bottom: 1.5px solid #e0dfdc; }
    th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 12px 14px; border-bottom: 1px solid #f3f2ef; font-size: 13px; vertical-align: middle; color: #1b1f23; }
    tbody tr:hover { background: #f9f9f7; }
    tbody tr:last-child td { border-bottom: none; }
    .match-badge { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 8px; }
    .match-linkedin { background: #e3f0fc; color: #004182; }
    .match-email { background: #dff0d8; color: #057642; }
    .match-name { background: #f3f2ef; color: #595959; }
    .match-walkin { background: #fdf3d7; color: #c37d16; }
    .empty { padding: 48px; text-align: center; color: #bbb; font-size: 14px; }
    .footer { text-align: center; padding: 20px; color: #bbb; font-size: 12px; }
    .section-title { font-size: 15px; font-weight: 700; color: #1b1f23; margin: 28px 0 12px; }
    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
    @media (max-width: 700px) { .charts-grid { grid-template-columns: 1fr; } }
    .chart-card {
      background: #fff;
      border-radius: 8px;
      padding: 18px 20px;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.08);
    }
    .chart-card-title { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; }
    .chart-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .chart-label { font-size: 12px; color: #595959; width: 42px; flex-shrink: 0; text-align: right; }
    .chart-bar-wrap { flex: 1; background: #f3f2ef; border-radius: 3px; height: 18px; overflow: hidden; }
    .chart-bar { height: 100%; border-radius: 3px; transition: width 0.4s ease; min-width: 2px; }
    .chart-count { font-size: 12px; color: #888; width: 28px; flex-shrink: 0; }
    .feedback-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
    .feedback-item {
      background: #fff;
      border-radius: 8px;
      padding: 14px 16px;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.08);
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }
    .feedback-stars { font-size: 16px; letter-spacing: 1px; flex-shrink: 0; }
    .feedback-comment-text { font-size: 13px; color: #1b1f23; line-height: 1.5; flex: 1; }
    .feedback-meta { font-size: 11px; color: #bbb; margin-top: 3px; }
    .feedback-empty { padding: 24px; text-align: center; color: #bbb; font-size: 13px; background: #fff; border-radius: 8px; box-shadow: 0 0 0 1px rgba(0,0,0,0.08); }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="topbar-left">
      ${IN_BUG_WHITE}
      <span>${EVENT_NAME}</span>
    </div>
    <div class="topbar-right">
      <span class="topbar-time">Updated ${new Date().toLocaleTimeString()}</span>
      <a href="/dashboard" class="topbar-btn">Refresh</a>
      <a href="/" class="topbar-btn">← Event Page</a>
    </div>
  </div>

  <div class="container">
    <div class="page-title">Check-In Overview</div>
    <div class="page-sub">Live attendance tracking · ${EVENT_NAME}</div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total on List</div>
        <div class="stat-value">${totalAttendees}</div>
        <div class="stat-sub">pre-registered</div>
      </div>
      <div class="stat-card green">
        <div class="stat-label">Checked In</div>
        <div class="stat-value">${registeredCheckins}</div>
        <div class="stat-sub">${pct}% of registered</div>
      </div>
      <div class="stat-card amber">
        <div class="stat-label">Not Yet Arrived</div>
        <div class="stat-value">${remaining}</div>
        <div class="stat-sub">outstanding</div>
      </div>
      <div class="stat-card gray">
        <div class="stat-label">Walk-ins</div>
        <div class="stat-value">${walkIns}</div>
        <div class="stat-sub">not pre-registered</div>
      </div>
    </div>

    <div class="progress-wrap">
      <div class="progress-label">Registered Check-in Progress</div>
      <div class="progress-bg">
        <div class="progress-fill" style="width:${pct}%"></div>
      </div>
      <div class="progress-text">${registeredCheckins} of ${totalAttendees} registered guests checked in (${pct}%)${walkIns > 0 ? ` · ${walkIns} walk-in${walkIns !== 1 ? 's' : ''}` : ''}</div>
    </div>

    <div class="section-title">Experience Metrics</div>

    <div class="stats-grid" style="margin-bottom:12px">
      <div class="stat-card" style="border-top-color:#f59e0b">
        <div class="stat-label">Avg Rating</div>
        <div class="stat-value">${avgRating !== null ? avgRating.toFixed(1) : '—'}</div>
        <div class="stat-sub">${feedback.length} rating${feedback.length !== 1 ? 's' : ''} submitted</div>
      </div>
      <div class="stat-card" style="border-top-color:#e53935">
        <div class="stat-label">Drop-off Rate</div>
        <div class="stat-value">${dropOffRate}%</div>
        <div class="stat-sub">${errors.length} error${errors.length !== 1 ? 's' : ''} / ${checkins.length + errors.length} attempts</div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-card-title">Rating Distribution</div>
        ${ratingBarsHtml || '<div style="color:#bbb;font-size:13px">No ratings yet</div>'}
      </div>
      <div class="chart-card">
        <div class="chart-card-title">Check-in Duration</div>
        ${durationBarsHtml || '<div style="color:#bbb;font-size:13px">No duration data yet</div>'}
      </div>
    </div>

    <div class="section-title">Feedback Comments</div>
    <div class="feedback-list">${feedbackListHtml}</div>

    <div class="section-title">Check-In Log</div>
    <div class="table-card">
      <div class="table-head">
        <strong>Check-In Log</strong>
        <span class="count-badge">${totalCheckins} total</span>
      </div>
      ${checkins.length > 0 ? `
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>LinkedIn Company</th>
            <th>Registered Org</th>
            <th>Education</th>
            <th>Matched By</th>
            <th>LinkedIn Verified</th>
            <th>Check-In Time</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>` : '<div class="empty">No check-ins yet — share the event page with attendees.</div>'}
    </div>

    <div class="footer">Verified on LinkedIn · ${EVENT_NAME}</div>
  </div>
</body>
</html>`;
}

module.exports = { getLoginPage, getDashboardPage };
