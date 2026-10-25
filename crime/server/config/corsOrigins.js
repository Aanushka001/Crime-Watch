const normalize = (origin) => origin.trim().replace(/\/+$/, '');

const getAllowedOrigins = () => (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map(normalize)
  .filter(Boolean);

const isOriginAllowed = (origin) => !origin || getAllowedOrigins().includes(normalize(origin));

module.exports = { getAllowedOrigins, isOriginAllowed };
