const mongoose = require('mongoose');
const Report = require('../models/Report');

const serialize = (report) => {
  const result = report.toObject ? report.toObject() : report;
  delete result.userId;
  delete result.reviewedBy;
  return { ...result, id: result._id.toString() };
};

const validateReport = (data) => {
  const latitude = Number(data.latitude);
  const longitude = Number(data.longitude);
  const time = new Date(data.time);
  if (
    !['Theft', 'Assault', 'Vandalism', 'Burglary', 'Robbery', 'Vehicle Crime', 'Other'].includes(data.crimeType) ||
    typeof data.description !== 'string' || !data.description.trim() || data.description.length > 3000 ||
    typeof data.location !== 'string' || !data.location.trim() || data.location.length > 300 ||
    data.latitude === undefined || data.latitude === null || data.latitude === '' ||
    data.longitude === undefined || data.longitude === null || data.longitude === '' ||
    !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
    !Number.isFinite(longitude) || longitude < -180 || longitude > 180 ||
    !data.time || Number.isNaN(time.getTime())
  ) {
    return null;
  }
  return {
    crimeType: data.crimeType,
    description: data.description.trim(),
    location: data.location.trim(),
    latitude,
    longitude,
    geoLocation: { type: 'Point', coordinates: [longitude, latitude] },
    time
  };
};

const createReport = async (req, res, next) => {
  try {
    const fields = validateReport(req.body);
    if (!fields) {
      return res.status(400).json({ error: 'Provide a valid crime type, description, location, coordinates, and date/time' });
    }
    const isAnonymous = !req.user || req.body.isAnonymous === true;
    const report = await Report.create({
      ...fields,
      userId: req.user ? req.user.id : null,
      isAnonymous
    });
    return res.status(201).json({ report: serialize(report) });
  } catch (error) {
    return next(error);
  }
};

const getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    return res.status(200).json(reports.map(serialize));
  } catch (error) {
    return next(error);
  }
};

const getPublicReports = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit || 100);
    if (!Number.isInteger(limit) || limit < 1 || limit > 500) {
      return res.status(400).json({ error: 'Limit must be between 1 and 500' });
    }
    const query = { status: 'verified' };
    if (req.query.crimeType) {
      query.crimeType = req.query.crimeType;
    }
    const hasCoordinates = req.query.latitude !== undefined || req.query.longitude !== undefined;
    if (hasCoordinates) {
      const latitude = Number(req.query.latitude);
      const longitude = Number(req.query.longitude);
      const radiusKm = Number(req.query.radiusKm || 50);
      if (
        !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
        !Number.isFinite(longitude) || longitude < -180 || longitude > 180 ||
        !Number.isFinite(radiusKm) || radiusKm < 1 || radiusKm > 500
      ) {
        return res.status(400).json({ error: 'Provide valid map coordinates and a radius between 1 and 500 km' });
      }
      query.geoLocation = {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: radiusKm * 1000
        }
      };
    }
    const reports = await Report.find(query).sort({ time: -1 }).limit(limit).lean();
    return res.status(200).json(reports.map(serialize));
  } catch (error) {
    return next(error);
  }
};

const getPendingReports = async (req, res, next) => {
  try {
    const query = req.user.role === 'administrator' ? {} : { status: 'pending' };
    const sortOrder = req.user.role === 'administrator' ? -1 : 1;
    const reports = await Report.find(query).sort({ createdAt: sortOrder }).lean();
    return res.status(200).json(reports.map(serialize));
  } catch (error) {
    return next(error);
  }
};

const getReport = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Report not found' });
    }
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    if ((!report.userId || report.userId.toString() !== req.user.id) &&
      !['moderator', 'administrator'].includes(req.user.role)) {
      return res.status(403).json({ error: 'You cannot view this report' });
    }
    return res.status(200).json({ report: serialize(report) });
  } catch (error) {
    return next(error);
  }
};

const updateReport = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Report not found' });
    }
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    const isOwner = report.userId && report.userId.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'administrator') {
      return res.status(403).json({ error: 'You cannot edit this report' });
    }
    if (isOwner && report.status !== 'pending') {
      return res.status(409).json({ error: 'Only pending reports can be edited' });
    }

    const fields = validateReport({ ...report.toObject(), ...req.body });
    if (!fields) {
      return res.status(400).json({ error: 'Report fields are invalid' });
    }
    Object.assign(report, fields, { updatedAt: new Date() });
    await report.save();
    return res.status(200).json({ report: serialize(report) });
  } catch (error) {
    return next(error);
  }
};

const deleteReport = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Report not found' });
    }
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    const isOwner = report.userId && report.userId.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'administrator') {
      return res.status(403).json({ error: 'You cannot delete this report' });
    }
    if (isOwner && report.status !== 'pending') {
      return res.status(409).json({ error: 'Only pending reports can be deleted' });
    }
    await report.deleteOne();
    return res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

const moderateReport = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Report not found' });
    }
    const { status, reviewNote = '' } = req.body;
    if (!['verified', 'rejected'].includes(status) || typeof reviewNote !== 'string' || reviewNote.length > 1000) {
      return res.status(400).json({ error: 'Choose verified or rejected and provide a review note under 1000 characters' });
    }
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewNote: reviewNote.trim(),
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    return res.status(200).json({ report: serialize(report) });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createReport,
  getMyReports,
  getPublicReports,
  getPendingReports,
  getReport,
  updateReport,
  deleteReport,
  moderateReport
};
