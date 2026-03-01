const { EVENT_NAME } = require('../config');

// Official LinkedIn In-Bug SVG (blue)
const IN_BUG_BLUE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="16" height="16"><path fill="#0a66c2" d="M92.23,92.23h-11.88v-18.6c0-4.44-.08-10.15-6.18-10.15s-7.14,4.83-7.14,9.83v18.92h-11.88V53.97h11.41v5.23h.16c1.59-3.01,5.47-6.18,11.25-6.18,12.04,0,14.27,7.92,14.27,18.22v20.98ZM41.75,48.74c-3.81,0-6.89-3.09-6.89-6.9s3.08-6.89,6.89-6.89,6.89,3.09,6.89,6.89-3.09,6.9-6.89,6.9m5.94,43.49h-11.89V53.97h11.89v38.26ZM98.15,23.92H29.83c-3.27,0-5.92,2.59-5.92,5.78V98.3c0,3.19,2.65,5.78,5.92,5.78H98.15c3.27,0,5.93-2.59,5.93-5.78V29.7c0-3.19-2.66-5.78-5.93-5.78"/></svg>`;

function getResultPage(result) {
  const { status } = result;
  if (status === 'success') return getSuccessPage(result);
  if (status === 'already_checked_in') return getAlreadyCheckedInPage(result);
  if (status === 'walk_in') return getWalkInPage(result);
  if (status === 'not_found') return getWalkInPage(result);
  return getWalkInPage(result);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
    ' · ' +
    d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function avatarHtml(src, name) {
  if (src) return `<img src="${src}" alt="${name}" class="avatar">`;
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return `<div class="avatar avatar-initials">${initials}</div>`;
}

function baseHtml(bodyContent, title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — ${EVENT_NAME}</title>
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
      max-width: 460px;
      width: 100%;
      overflow: hidden;
    }
    .card-header {
      padding: 24px 28px 20px;
      border-bottom: 1px solid #e0dfdc;
      text-align: center;
    }
    .event-label {
      font-size: 12px;
      font-weight: 600;
      color: #595959;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .status-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      margin: 0 auto 14px;
    }
    .status-icon.success { background: #dff0d8; color: #057642; }
    .status-icon.warning { background: #fdf3d7; color: #c37d16; }
    .status-title {
      font-size: 22px;
      font-weight: 700;
      color: #1b1f23;
      margin-bottom: 6px;
    }
    .status-subtitle {
      font-size: 14px;
      color: #595959;
      line-height: 1.5;
    }
    .card-body { padding: 20px 28px 28px; }
    .avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e0dfdc;
      display: block;
      margin: 0 auto 10px;
    }
    .avatar-initials {
      background: #0a66c2;
      color: white;
      font-size: 24px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .person-name {
      font-size: 18px;
      font-weight: 600;
      color: #1b1f23;
      text-align: center;
      margin-bottom: 3px;
    }
    .person-email {
      font-size: 13px;
      color: #595959;
      text-align: center;
      margin-bottom: 12px;
    }
    .verified-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #dff0d8;
      color: #057642;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 12px;
      margin-bottom: 16px;
    }
    .divider {
      border: none;
      border-top: 1px solid #e0dfdc;
      margin: 16px 0;
    }
    .detail-box {
      background: #f3f2ef;
      border-radius: 4px;
      padding: 12px 14px;
      margin-bottom: 8px;
    }
    .detail-label {
      font-size: 11px;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 3px;
    }
    .detail-value {
      font-size: 14px;
      color: #1b1f23;
      font-weight: 500;
    }
    .detail-box.green { background: #dff0d8; }
    .detail-box.green .detail-label { color: #057642; }
    .detail-box.green .detail-value { color: #044f2e; }
    .detail-box.amber { background: #fdf3d7; }
    .detail-box.amber .detail-label { color: #c37d16; }
    .detail-box.amber .detail-value { color: #7a4f0e; }
    .detail-box.light-amber { background: #fffbeb; }
    .detail-box.light-amber .detail-label { color: #92400e; }
    .detail-box.light-amber .detail-value { color: #78350f; }
    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 48px;
      padding: 0 24px;
      border-radius: 24px;
      font-size: 15px;
      font-weight: 600;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: background 0.15s ease;
      margin-top: 16px;
      letter-spacing: 0.01em;
    }
    .btn-primary { background: #0a66c2; color: #ffffff; }
    .btn-primary:hover { background: #004182; }
    .btn-outline { background: transparent; color: #0a66c2; border: 1.5px solid #0a66c2; }
    .btn-outline:hover { background: #f0f7ff; }

    /* Done button */
    .done-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 48px;
      background: #0a66c2;
      color: #fff;
      font-size: 15px;
      font-weight: 700;
      border: none;
      border-radius: 24px;
      cursor: pointer;
      margin-top: 16px;
      transition: background 0.15s;
      letter-spacing: 0.01em;
    }
    .done-btn:hover { background: #004182; }

    /* Feedback */
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    #feedbackContent { animation: slideUp 0.35s ease; }
    .feedback-label {
      font-size: 15px;
      font-weight: 700;
      color: #1b1f23;
      margin-bottom: 14px;
      text-align: center;
    }
    .star-row {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 14px;
    }
    .star {
      font-size: 36px;
      color: #ddd;
      cursor: pointer;
      transition: color 0.1s, transform 0.1s;
      user-select: none;
      line-height: 1;
    }
    .star.on  { color: #f59e0b; }
    .star:hover { transform: scale(1.15); }
    .feedback-comment {
      width: 100%;
      padding: 9px 12px;
      border: 1.5px solid #e0dfdc;
      border-radius: 4px;
      font-size: 13px;
      font-family: inherit;
      color: #333;
      resize: none;
      outline: none;
      margin-bottom: 12px;
      transition: border-color 0.2s;
    }
    .feedback-comment:focus { border-color: #0a66c2; }
    .feedback-submit {
      width: 100%;
      height: 44px;
      background: #0a66c2;
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      border: none;
      border-radius: 22px;
      cursor: pointer;
      transition: background 0.15s;
      margin-bottom: 10px;
    }
    .feedback-submit:hover { background: #004182; }
    .feedback-submit:disabled { background: #057642; cursor: default; }
    .feedback-skip {
      display: block;
      width: 100%;
      background: none;
      border: none;
      color: #888;
      font-size: 13px;
      cursor: pointer;
      padding: 4px 0;
      text-align: center;
    }
    .feedback-skip:hover { color: #333; }
    .feedback-done-msg {
      text-align: center;
      font-size: 17px;
      font-weight: 700;
      color: #057642;
      padding: 8px 0 4px;
    }
    .feedback-done-sub {
      text-align: center;
      font-size: 13px;
      color: #595959;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  ${bodyContent}
</body>
</html>`;
}

// ─── Feedback section ─────────────────────────────────────────────────────────

function feedbackSection(checkinId) {
  if (!checkinId) return '';
  return `
  <div id="feedbackContent" style="display:none">
    <div class="card-body">
      <div class="feedback-label">How was your check-in experience?</div>
      <div class="star-row" id="starRow">
        <span class="star" data-v="1" onclick="setStar(1)">★</span>
        <span class="star" data-v="2" onclick="setStar(2)">★</span>
        <span class="star" data-v="3" onclick="setStar(3)">★</span>
        <span class="star" data-v="4" onclick="setStar(4)">★</span>
        <span class="star" data-v="5" onclick="setStar(5)">★</span>
      </div>
      <div id="feedbackForm">
        <textarea class="feedback-comment" id="feedbackComment" placeholder="Any issues or comments? (optional)" rows="2"></textarea>
        <button class="feedback-submit" id="feedbackSubmit" onclick="submitFeedback('${checkinId}')">Submit</button>
        <button class="feedback-skip" onclick="skipFeedback()">Skip</button>
      </div>
      <div id="feedbackDone" style="display:none">
        <div class="feedback-done-msg">All done!</div>
        <div class="feedback-done-sub">Thanks — enjoy the event.</div>
        <a href="/" class="action-btn btn-outline">Back to Home</a>
      </div>
    </div>
  </div>
  <script>
    var _selectedRating = 0;
    function showFeedback() {
      document.getElementById('checkinContent').style.display = 'none';
      document.getElementById('feedbackContent').style.display = 'block';
    }
    function setStar(n) {
      _selectedRating = n;
      document.querySelectorAll('.star').forEach(function(s) {
        s.classList.toggle('on', parseInt(s.dataset.v) <= n);
      });
    }
    function skipFeedback() {
      document.getElementById('feedbackForm').style.display = 'none';
      document.getElementById('starRow').style.display = 'none';
      document.querySelector('.feedback-label').style.display = 'none';
      document.getElementById('feedbackDone').style.display = 'block';
    }
    function submitFeedback(checkinId) {
      if (!_selectedRating) { alert('Please select a star rating first.'); return; }
      var btn = document.getElementById('feedbackSubmit');
      btn.disabled = true;
      btn.textContent = 'Submitting…';
      fetch('/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkinId: checkinId,
          rating: _selectedRating,
          comment: document.getElementById('feedbackComment').value.trim()
        })
      })
      .then(function(r) { return r.json(); })
      .then(function() {
        document.getElementById('feedbackForm').style.display = 'none';
        document.getElementById('starRow').style.display = 'none';
        document.querySelector('.feedback-label').style.display = 'none';
        document.getElementById('feedbackDone').style.display = 'block';
      })
      .catch(function() {
        btn.disabled = false;
        btn.textContent = 'Submit';
        alert('Could not submit — please try again.');
      });
    }
  </script>`;
}

// ─── Success ──────────────────────────────────────────────────────────────────

function getSuccessPage(result) {
  const { checkinId, attendee, linkedinName, linkedinEmail, profilePicture, checkinTime } = result;
  const displayName = linkedinName || attendee?.full_name || 'Guest';

  const body = `
  <div class="card">
    <div class="card-header">
      <div class="event-label">${EVENT_NAME}</div>
      <div class="status-icon success">✓</div>
      <div class="status-title">Checked In!</div>
      <div class="status-subtitle">Welcome — you're on the list.</div>
    </div>
    <div id="checkinContent">
      <div class="card-body">
        ${avatarHtml(profilePicture, displayName)}
        <div class="person-name">${displayName}</div>
        ${linkedinEmail ? `<div class="person-email">${linkedinEmail}</div>` : ''}

        <hr class="divider">

        <div class="detail-box green">
          <div class="detail-label">Checked in at</div>
          <div class="detail-value">${formatTime(checkinTime)}</div>
        </div>

        ${checkinId
          ? `<button class="done-btn" onclick="showFeedback()">Done</button>`
          : `<a href="/" class="action-btn btn-outline">Back to Home</a>`
        }
      </div>
    </div>
    ${feedbackSection(checkinId)}
  </div>`;

  return baseHtml(body, 'Checked In');
}

// ─── Already Checked In ───────────────────────────────────────────────────────

function getAlreadyCheckedInPage(result) {
  const { attendee, linkedinName, linkedinEmail, profilePicture, isVerified, originalCheckinTime } = result;
  const displayName = linkedinName || attendee?.full_name || 'Guest';

  const body = `
  <div class="card">
    <div class="card-header">
      <div class="event-label">${EVENT_NAME}</div>
      <div class="status-icon warning">⚠</div>
      <div class="status-title">Already Checked In</div>
      <div class="status-subtitle">You have already been checked in to this event.</div>
    </div>
    <div class="card-body">
      ${avatarHtml(profilePicture, displayName)}
      <div class="person-name">${displayName}</div>
      ${linkedinEmail ? `<div class="person-email">${linkedinEmail}</div>` : ''}

      <hr class="divider">

      <div class="detail-box amber">
        <div class="detail-label">Originally checked in at</div>
        <div class="detail-value">${formatTime(originalCheckinTime)}</div>
      </div>

      <a href="/" class="action-btn btn-outline">Back to Home</a>
    </div>
  </div>`;

  return baseHtml(body, 'Already Checked In');
}

// ─── Walk-in (not pre-registered, but admitted) ───────────────────────────────

function getWalkInPage(result) {
  const { checkinId, linkedinName, linkedinEmail, profilePicture, isVerified, checkinTime } = result;
  const displayName = linkedinName || 'Guest';

  const body = `
  <div class="card">
    <div class="card-header">
      <div class="event-label">${EVENT_NAME}</div>
      <div class="status-icon success">✓</div>
      <div class="status-title">Welcome!</div>
      <div class="status-subtitle">You're checked in — enjoy the event.</div>
    </div>
    <div id="checkinContent">
      <div class="card-body">
        ${avatarHtml(profilePicture, displayName)}
        <div class="person-name">${displayName}</div>
        ${linkedinEmail ? `<div class="person-email">${linkedinEmail}</div>` : ''}

        <hr class="divider">

        <div class="detail-box green">
          <div class="detail-label">Checked in at</div>
          <div class="detail-value">${formatTime(checkinTime)}</div>
        </div>

        <div style="font-size:14px; color:#1b1f23; line-height:1.6; margin-top:8px;">
          Show this screen to a member of the events team at the entrance to gain access.
        </div>

        ${checkinId
          ? `<button class="done-btn" onclick="showFeedback()">Done</button>`
          : `<a href="/" class="action-btn btn-outline">Back to Home</a>`
        }
      </div>
    </div>
    ${feedbackSection(checkinId)}
  </div>`;

  return baseHtml(body, 'Checked In');
}

module.exports = { getResultPage };
