const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authorization = req.get('authorization') || '';
  const token = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (payload.type !== 'access' || !payload.sub) {
      return res.status(401).json({ error: 'Invalid access token' });
    }
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (_error) {
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }
};

const authenticateOptional = (req, res, next) => {
  const authorization = req.get('authorization') || '';
  if (!authorization) {
    return next();
  }

  const token = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : null;
  if (!token) {
    return res.status(401).json({ error: 'Invalid authorization header' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (payload.type !== 'access' || !payload.sub) {
      return res.status(401).json({ error: 'Invalid access token' });
    }
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (_error) {
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'You do not have permission to perform this action' });
  }
  return next();
};

module.exports = { authenticate, authenticateOptional, authorize };
