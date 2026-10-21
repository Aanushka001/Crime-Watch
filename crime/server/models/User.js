const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 254
  },
  passwordHash: { type: String, select: false },
  googleId: { type: String, unique: true, sparse: true },
  role: {
    type: String,
    enum: ['citizen', 'moderator', 'administrator'],
    default: 'citizen'
  },
  refreshTokenHash: { type: String, select: false },
  createdAt: { type: Date, default: Date.now }
}, {
  versionKey: false,
  toJSON: {
    transform(_document, result) {
      result.id = result._id.toString();
      delete result._id;
      delete result.passwordHash;
      delete result.refreshTokenHash;
      delete result.googleId;
      return result;
    }
  }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
