const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const refreshCookieName = 'crime_watch_refresh';
const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/auth'
});

const setRefreshCookie = (res, token) => {
  res.cookie(refreshCookieName, token, {
    ...refreshCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const createTokens = (user) => ({
  accessToken: jwt.sign(
    { role: user.role, type: 'access' },
    process.env.JWT_ACCESS_SECRET,
    { subject: user.id, expiresIn: '15m' }
  ),
  refreshToken: jwt.sign(
    { type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { subject: user.id, expiresIn: '7d' }
  )
});

const startSession = async (user, res) => {
  const tokens = createTokens(user);
  user.refreshTokenHash = hashToken(tokens.refreshToken);
  await user.save();
  setRefreshCookie(res, tokens.refreshToken);
  return { accessToken: tokens.accessToken, user };
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (
      typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80 ||
      typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password !== 'string' || password.length < 10 || password.length > 128
    ) {
      return res.status(400).json({
        error: 'Provide a valid name, email address, and password of at least 10 characters'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
      role: 'citizen'
    });
    const session = await startSession(user, res);
    return res.status(201).json(session);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
    if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Email or password is incorrect' });
    }

    const session = await startSession(user, res);
    return res.status(200).json(session);
  } catch (error) {
    return next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const { credential } = req.body;
    if (!clientId) {
      return res.status(503).json({ error: 'Google sign-in is not configured on this server' });
    }
    if (typeof credential !== 'string' || !credential) {
      return res.status(400).json({ error: 'A Google credential is required' });
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.email_verified) {
      return res.status(401).json({ error: 'Google account email is not verified' });
    }

    let user = await User.findOne({
      $or: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }]
    });
    if (!user) {
      user = new User({
        name: payload.name || payload.email,
        email: payload.email.toLowerCase(),
        googleId: payload.sub,
        role: 'citizen'
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
    }

    const session = await startSession(user, res);
    return res.status(200).json(session);
  } catch (error) {
    return next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const token = req.cookies[refreshCookieName];
    if (!token) {
      return res.status(401).json({ error: 'Refresh session is missing' });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (_error) {
      res.clearCookie(refreshCookieName, refreshCookieOptions());
      return res.status(401).json({ error: 'Refresh session is invalid or expired' });
    }
    if (payload.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const user = await User.findById(payload.sub).select('+refreshTokenHash');
    if (!user || user.refreshTokenHash !== hashToken(token)) {
      return res.status(401).json({ error: 'Refresh session has been revoked' });
    }

    const tokens = createTokens(user);
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id, refreshTokenHash: hashToken(token) },
      { $set: { refreshTokenHash: hashToken(tokens.refreshToken) } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(401).json({ error: 'Refresh session has already been rotated' });
    }
    setRefreshCookie(res, tokens.refreshToken);
    return res.status(200).json({ accessToken: tokens.accessToken, user: updatedUser });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies[refreshCookieName];
    if (token) {
      let payload;
      try {
        payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      } catch (_error) {
        payload = null;
      }
      if (payload && payload.type === 'refresh') {
        await User.findByIdAndUpdate(payload.sub, { $unset: { refreshTokenHash: 1 } });
      }
    }
    res.clearCookie(refreshCookieName, refreshCookieOptions());
    return res.status(200).json({ message: 'Signed out successfully' });
  } catch (error) {
    return next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login, googleLogin, refresh, logout, getProfile };
