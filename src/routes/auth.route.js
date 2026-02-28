const { REDIRECT_URI, LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET } = require('../config');
const { createSession, getSession, deleteSession } = require('../services/session.service');
const { exchangeCodeForToken, fetchVerificationReport, fetchProfileInfo } = require('../services/linkedin.service');
const { findAttendee, isAlreadyCheckedIn, recordCheckin } = require('../services/checkin.service');
const { getErrorPage } = require('../views/error.view');

// POST /cvent-auth — kick off LinkedIn OAuth for the cvent demo flow
function handleCventAuth(req, res) {
  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end(getErrorPage('LinkedIn credentials are not configured.'));
    return;
  }

  const scopes = 'r_verify_details r_profile_basicinfo r_most_recent_education r_primary_current_experience';
  const sessionId = Math.random().toString(36).substring(7);
  createSession(sessionId, { type: 'cvent_demo', scopes });

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${sessionId}&scope=${encodeURIComponent(scopes)}`;

  console.log('🔐 Starting LinkedIn OAuth for cvent demo...');
  res.writeHead(302, { 'Location': authUrl });
  res.end();
}

// GET /auth  — kick off the LinkedIn OAuth flow using server-side credentials
function handleAuth(req, res) {
  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end(getErrorPage('LinkedIn credentials are not configured. Please set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in .env.local'));
    return;
  }

  const scopes = 'r_verify_details r_profile_basicinfo r_most_recent_education r_primary_current_experience';
  const sessionId = Math.random().toString(36).substring(7);
  createSession(sessionId, { scopes });

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${sessionId}&scope=${encodeURIComponent(scopes)}`;

  console.log('🔐 Starting LinkedIn OAuth for check-in...');
  res.writeHead(302, { 'Location': authUrl });
  res.end();
}

// GET /callback — LinkedIn redirects here after the user authorises
async function handleCallback(req, res, parsedUrl) {
  const code = parsedUrl.query.code;
  const sessionId = parsedUrl.query.state;
  const error = parsedUrl.query.error;

  if (error) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(getErrorPage(error));
    return;
  }

  if (!code) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end(getErrorPage('No authorisation code received. Please try again.'));
    return;
  }

  const session = getSession(sessionId);
  if (!session) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end(getErrorPage('Session expired or invalid. Please go back and try again.'));
    return;
  }

  try {
    // 1. Exchange authorisation code for access token
    const accessToken = await exchangeCodeForToken(code, LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET);
    const sessionType = session.type || 'checkin';
    deleteSession(sessionId);
    console.log('✅ Access token obtained');

    // 2. Fetch LinkedIn profile and verification report in parallel
    const [verificationReport, profileInfo] = await Promise.all([
      fetchVerificationReport(accessToken),
      fetchProfileInfo(accessToken)
    ]);

    // 3. Extract the fields we need
    const firstName = profileInfo.basicInfo?.firstName?.localized?.en_US || '';
    const lastName = profileInfo.basicInfo?.lastName?.localized?.en_US || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const email = profileInfo.basicInfo?.primaryEmailAddress || '';
    const profileUrl = profileInfo.basicInfo?.profileUrl || '';
    const profilePicture = profileInfo.basicInfo?.profilePicture?.croppedImage?.downloadUrl || '';
    const verifications = verificationReport.verifications || [];
    const isVerified = verifications.length > 0;

    // Extract company and job title from primary current position
    const company = profileInfo.primaryCurrentPosition?.companyName?.localized?.en_US || '';
    const jobTitle = profileInfo.primaryCurrentPosition?.title?.localized?.en_US || '';

    // Extract most recent education
    const edu = profileInfo.mostRecentEducation;
    const educationParts = [
      edu?.degreeName?.localized?.en_US,
      edu?.fieldOfStudy?.localized?.en_US,
      edu?.schoolName?.localized?.en_US
    ].filter(Boolean);
    const education = educationParts.join(' · ');

    console.log(`👤 LinkedIn sign-in: ${fullName} (${email})`);

    // ── Cvent demo branch ───────────────────────────────────────────────────
    if (sessionType === 'cvent_demo') {
      // Dump all top-level keys so we can see everything the API returns
      console.log('🔍 CVENT - profileInfo top-level keys:', Object.keys(profileInfo));
      console.log('🔍 CVENT - full profileInfo:', JSON.stringify(profileInfo, null, 2));

      // Pull verified workplaces from verificationReport.verifiedDetails
      // sorted by most recently verified — this is the reliable source for company info
      const verifiedDetails = verificationReport.verifiedDetails || [];
      const workplaceVerifications = verifiedDetails
        .filter(v => v.category === 'WORKPLACE')
        .sort((a, b) => (b.lastVerifiedAt || 0) - (a.lastVerifiedAt || 0));

      const primaryWorkplace = workplaceVerifications[0] || null;
      const cventCompany     = primaryWorkplace?.organizationInfo?.name || company || '';
      const cventCompanyUrl  = primaryWorkplace?.organizationInfo?.url  || '';

      // All verified orgs for display (deduplicated by name)
      const allVerifiedOrgs = workplaceVerifications
        .map(v => v.organizationInfo?.name)
        .filter(Boolean)
        .filter((name, i, arr) => arr.indexOf(name) === i);

      const resultId = Math.random().toString(36).substring(7);
      createSession(resultId, {
        type:            'cvent_result',
        firstName,
        lastName,
        email,
        company:         cventCompany,
        companyUrl:      cventCompanyUrl,
        allVerifiedOrgs,
        profileUrl,
        profilePicture,
        isVerified,
        verifications,
        verifiedDetails: workplaceVerifications,
        education
      });
      console.log(`✅ Cvent demo autofill ready for: ${fullName} | company: "${cventCompany}" | verified orgs: ${allVerifiedOrgs.join(', ')}`);
      res.writeHead(302, { 'Location': `/cvent-demo?session=${resultId}` });
      res.end();
      return;
    }
    // ───────────────────────────────────────────────────────────────────────

    // 4. Look up the person on the attendee list
    const { attendee, matchMethod } = await findAttendee(fullName, email, profileUrl);
    const matchStatusMap = { linkedin_url: 'matched_linkedin_url', email: 'matched_email', name: 'matched_name' };
    const matchStatus = attendee ? (matchStatusMap[matchMethod] || 'matched_name') : 'not_matched';

    if (!attendee) {
      // Not pre-registered — record as a walk-in and still let them in
      console.log(`⚠️  Not pre-registered, recording walk-in: ${fullName} / ${email}`);
      const checkin = await recordCheckin(null, {
        name: fullName,
        email,
        company,
        education,
        profileUrl,
        profilePicture,
        isVerified,
        matchStatus: 'not_matched'
      });

      const resultId = Math.random().toString(36).substring(7);
      createSession(resultId, {
        status: 'walk_in',
        linkedinName: fullName,
        linkedinEmail: email,
        profilePicture,
        isVerified,
        checkinTime: checkin?.checked_in_at || new Date().toISOString()
      });
      res.writeHead(302, { 'Location': `/result?id=${resultId}` });
      res.end();
      return;
    }

    // 5. Check for duplicate check-in
    const existingCheckin = await isAlreadyCheckedIn(attendee.id);

    if (existingCheckin) {
      console.log(`⚠️  Already checked in: ${fullName} (matched by ${matchMethod})`);
      const resultId = Math.random().toString(36).substring(7);
      createSession(resultId, {
        status: 'already_checked_in',
        attendee,
        linkedinName: fullName,
        linkedinEmail: email,
        profilePicture,
        isVerified,
        originalCheckinTime: existingCheckin.checked_in_at,
        matchStatus
      });
      res.writeHead(302, { 'Location': `/result?id=${resultId}` });
      res.end();
      return;
    }

    // 6. Record the new check-in
    const checkin = await recordCheckin(attendee.id, {
      name: fullName,
      email,
      company,
      education,
      profileUrl,
      profilePicture,
      isVerified,
      matchStatus
    });

    console.log(`✅ Checked in: ${fullName} at ${checkin?.checked_in_at} (matched by ${matchMethod})`);

    const resultId = Math.random().toString(36).substring(7);
    createSession(resultId, {
      status: 'success',
      attendee,
      linkedinName: fullName,
      linkedinEmail: email,
      profilePicture,
      isVerified,
      checkinTime: checkin?.checked_in_at || new Date().toISOString(),
      matchStatus
    });
    res.writeHead(302, { 'Location': `/result?id=${resultId}` });
    res.end();

  } catch (err) {
    console.error('❌ Check-in error:', err.message);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end(getErrorPage(err.message));
  }
}

module.exports = { handleAuth, handleCventAuth, handleCallback };
