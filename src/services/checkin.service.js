const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

let supabaseClient = null;

// Lazy init — safe for both traditional servers and Vercel serverless cold starts
function getClient() {
  if (supabaseClient) return supabaseClient;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY environment variables are not set');
  }
  const { createClient } = require('@supabase/supabase-js');
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('✅ Supabase client initialised');
  return supabaseClient;
}

async function initializeCheckinDatabase() {
  const client = getClient();
  const { error } = await client.from('attendees').select('id').limit(1);
  if (error) {
    console.error('❌ Failed to connect to attendees table:', error.message);
    throw new Error(error.message);
  }
  console.log('✅ Connected to Supabase for event check-in');
  console.log(`   URL: ${SUPABASE_URL}`);
}

async function findAttendee(name, email, profileUrl) {
  const client = getClient();

  if (profileUrl && profileUrl.trim()) {
    const { data, error } = await client
      .from('attendees')
      .select('*')
      .ilike('linkedin_url', profileUrl.trim())
      .limit(1);
    if (!error && data && data.length > 0) return { attendee: data[0], matchMethod: 'linkedin_url' };
  }

  if (email && email.trim()) {
    const { data, error } = await client
      .from('attendees')
      .select('*')
      .ilike('email', email.trim())
      .limit(1);
    if (!error && data && data.length > 0) return { attendee: data[0], matchMethod: 'email' };
  }

  if (name && name.trim()) {
    const { data, error } = await client
      .from('attendees')
      .select('*')
      .ilike('full_name', name.trim())
      .limit(1);
    if (!error && data && data.length > 0) return { attendee: data[0], matchMethod: 'name' };
  }

  return { attendee: null, matchMethod: null };
}

async function isAlreadyCheckedIn(attendeeId) {
  const client = getClient();
  const { data, error } = await client
    .from('checkins')
    .select('id, checked_in_at')
    .eq('attendee_id', attendeeId)
    .limit(1);
  if (error || !data || data.length === 0) return null;
  return data[0];
}

async function recordCheckin(attendeeId, linkedinData) {
  const client = getClient();

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

  if (attendeeId) entry.attendee_id = attendeeId;

  const { data, error } = await client
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

async function getAllCheckins() {
  const client = getClient();
  const { data, error } = await client
    .from('checkins')
    .select('*')
    .order('checked_in_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching check-ins:', error.message);
    return [];
  }
  return data || [];
}

async function getCheckinStats() {
  const client = getClient();

  const [checkinsResult, attendeesResult] = await Promise.all([
    getAllCheckins(),
    client.from('attendees').select('id', { count: 'exact', head: true })
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
