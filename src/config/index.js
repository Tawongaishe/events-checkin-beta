const PORT = parseInt(process.env.PORT) || 5000;

const getBaseUrl = () => {
  if (process.env.BASE_URL) return process.env.BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_EXTERNAL_URL) return process.env.RENDER_EXTERNAL_URL;
  if (process.env.REPLIT_DOMAINS) return `https://${process.env.REPLIT_DOMAINS}`;
  return `http://localhost:${PORT}`;
};

const BASE_URL = getBaseUrl();
const REDIRECT_URI = process.env.REDIRECT_URI || `${BASE_URL}/callback`;

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const EVENT_NAME = process.env.EVENT_NAME || 'Shipping Trust Happy Hour';
const DASHBOARD_USERNAME = process.env.DASHBOARD_USERNAME || 'admin';
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'changeme123';

module.exports = {
  PORT,
  BASE_URL,
  REDIRECT_URI,
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET,
  EVENT_NAME,
  DASHBOARD_USERNAME,
  DASHBOARD_PASSWORD
};
