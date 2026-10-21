const express = require('express');
const {
  register,
  login,
  googleLogin,
  refresh,
  logout,
  getProfile
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/profile', authenticate, getProfile);

module.exports = router;
