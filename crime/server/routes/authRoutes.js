const express = require('express');
const { registerUser, getUserProfile, deleteUserAccount } = require('../controllers/authController');
const verifyFirebaseToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.get('/profile', verifyFirebaseToken, getUserProfile);
router.delete('/delete', verifyFirebaseToken, deleteUserAccount);

module.exports = router;