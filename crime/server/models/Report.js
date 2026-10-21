const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  isAnonymous: { type: Boolean, default: false },
  crimeType: {
    type: String,
    required: true,
    trim: true,
    enum: ['Theft', 'Assault', 'Vandalism', 'Burglary', 'Robbery', 'Vehicle Crime', 'Other']
  },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  location: { type: String, required: true, trim: true, maxlength: 300 },
  latitude: { type: Number, required: true, min: -90, max: 90 },
  longitude: { type: Number, required: true, min: -180, max: 180 },
  geoLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: { type: [Number], required: true }
  },
  time: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
    index: true
  },
  reviewNote: { type: String, trim: true, maxlength: 1000, default: '' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reviewedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { versionKey: false });

reportSchema.index({ geoLocation: '2dsphere' });
reportSchema.index({ status: 1, time: -1 });

module.exports = mongoose.models.Report || mongoose.model('Report', reportSchema);
