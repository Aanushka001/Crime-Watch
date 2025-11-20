const admin = require('firebase-admin');
const { createUser, getUserById, deleteUser } = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    await createUser({
      uid: userRecord.uid,
      email: userRecord.email,
      username: name,
      userType: 'user',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date()
    });

    return res.status(201).json({
      message: 'User registered successfully',
      uid: userRecord.uid
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteUserAccount = async (req, res) => {
  try {
    await admin.auth().deleteUser(req.user.uid);
    await deleteUser(req.user.uid);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  getUserProfile,
  deleteUserAccount
};