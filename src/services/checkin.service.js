const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

let supabaseClient = null;

async function initializeCheckinDatabase() {
  if (supabaseClient) return;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ SUPABASE_URL and SUPABASE_ANON_KEY are required!');
    process.exit(1);
  }

  const { createClient } = require('@supabase/supabase-js');
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Verify attendees table exists
  const { error } = await supabaseClient
    .from('attendees')
    .select('id')
    .limit(1);

  if (error) {
    console.error('❌ Failed to connect to attendees table:', error.message);
    console.error('   Please run the setup SQL in your Supabase project (see README)');
    process.exit(1);
  }

  console.log('✅ Connected to Supabase for event check-in');
  console.log(`   URL: ${SUPABASE_URL}`);
}

// Find an attendee by email (preferred) or full name
// Returns { attendee, matchMethod } where matchMethod is 'linkedin_url', 'email', 'name', or null
async function findAttendee(name, email, profileUrl) {
  if (!supabaseClient) return { attendee: null, matchMethod: null };

  // 1. LinkedIn profile URL — most reliable (unique identifier)
  if (profileUrl && profileUrl.trim()) {
    const { data, error } = await supabaseClient
      .from('attendees')
      .select('*')
      .ilike('linkedin_url', profileUrl.trim())
      .limit(1);

    if (!error && data && data.length > 0) return { attendee: data[0], matchMethod: 'linkedin_url' };
  }

  // 2. Email match
  if (email && email.trim()) {
    const { data, error } = await supabaseClient
      .from('attendees')
      .select('*')
      .ilike('email', email.trim())
      .limit(1);

    if (!error && data && data.length > 0) return { attendee: data[0], matchMethod: 'email' };
  }

  // 3. Full name match (least reliable)
  if (name && name.trim()) {
    const { data, error } = await supabaseClient
      .from('attendees')
      .select('*')
      .ilike('full_name', name.trim())
      .limit(1);

    if (!error && data && data.length > 0) return { attendee: data[0], matchMethod: 'name' };
  }

  return { attendee: null, matchMethod: null };
}

// Returns the existing check-in record if already checked in, otherwise null
async function isAlreadyCheckedIn(attendeeId) {
  if (!supabaseClient) return null;

  const { data, error } = await supabaseClient
    .from('checkins')
    .select('id, checked_in_at')
    .eq('attendee_id', attendeeId)
    .limit(1);

  if (error || !data || data.length === 0) return null;
  return data[0];
}

// Record a new check-in and return the created record
// attendeeId may be null for walk-in guests not on the pre-registered list
async function recordCheckin(attendeeId, linkedinData) {
  if (!supabaseClient) return null;

  const entry = {
    linkedin_name: linkedinData.name,
    linkedin_email: linkedinData.email,
    linkedin_company: linkedinData.company,
    linkedin_education: linkedinData.education,
    linkedin_profile_url: linkedinData.profileUrl,
    linkedin_profile_picture: linkedinData.profilePicture,
    verified_identity: linkedinData.isVerified,
    match_status: linkedinData.matchStatus,
    checked_in_at: new Date().toISOString()
  };

  // Only set attendee_id if we have one (pre-registered guests)
  if (attendeeId) entry.attendee_id = attendeeId;

  const { data, error } = await supabaseClient
    .from('checkins')
    .insert([entry])
    .select()
    .single();

  if (error) {
    console.error('❌ Error recording check-in:', error.message);
    return null;
  }

  return data;
}

// Fetch all check-ins joined with attendee details, newest first
async function getAllCheckins() {
  if (!supabaseClient) return [];

  const { data, error } = await supabaseClient
    .from('checkins')
    .select(`
      *,
      attendees (
        full_name,
        email,
        company,
        ticket_type
      )
    `)
    .order('checked_in_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching check-ins:', error.message);
    return [];
  }

  return data || [];
}

async function getCheckinStats() {
  if (!supabaseClient) return { totalCheckins: 0, totalAttendees: 0, walkIns: 0, checkins: [] };

  const [checkinsResult, attendeesResult] = await Promise.all([
    getAllCheckins(),
    supabaseClient.from('attendees').select('id', { count: 'exact', head: true })
  ]);

  const walkIns = checkinsResult.filter(c => c.match_status === 'not_matched').length;

  return {
    totalCheckins: checkinsResult.length,
    totalAttendees: attendeesResult.count || 0,
    walkIns,
    checkins: checkinsResult
  };
}

module.exports = {
  initializeCheckinDatabase,
  findAttendee,
  isAlreadyCheckedIn,
  recordCheckin,
  getAllCheckins,
  getCheckinStats
};
