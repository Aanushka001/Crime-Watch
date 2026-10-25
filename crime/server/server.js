require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDatabase = require('./config/db');
const { isOriginAllowed } = require('./config/corsOrigins');
const authRoutes = require('./routes/authRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const { getAnalytics } = require('./controllers/analyticsController');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    callback(null, isOriginAllowed(origin));
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false
}));
app.post('/api/reports', rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false
}));

app.get('/', (_req, res) => res.json({
  message: 'Crime-Watch API running',
  status: 'success',
  version: '2.0.0'
}));
app.get('/health', (_req, res) => res.status(200).json({
  status: 'ok',
  database: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected'
}));

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);
app.get('/api/analytics', getAnalytics);
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.use(errorHandler);

if (require.main === module) {
  const requiredSecrets = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
  const missingSecrets = requiredSecrets.filter((key) => !process.env[key] || process.env[key].length < 32);
  if (missingSecrets.length) {
    throw new Error(
      `${missingSecrets.join(' and ')} must each contain at least 32 characters. ` +
      'For local development run "npm run setup" or "npm start" to generate local secrets. ' +
      'Production secrets must be configured in the environment.'
    );
  }

  connectDatabase()
    .then(() => {
      const port = Number(process.env.PORT || 5000);
      app.listen(port, '0.0.0.0', () => console.log(`Crime-Watch API listening on port ${port}`));
    })
    .catch((error) => {
      console.error('Failed to start Crime-Watch API:', error);
      process.exitCode = 1;
    });
}

module.exports = app;
