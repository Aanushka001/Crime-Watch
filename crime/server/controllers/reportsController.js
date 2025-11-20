const {
  createReport,
  getReportById,
  getUserReports,
  getAllReports,
  updateReport,
  deleteReport
} = require('../models/Report');

const submitReport = async (req, res) => {
  try {
    const { crimeType, description, location, latitude, longitude, time } = req.body;

    if (!crimeType || !description || !location || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const reportId = await createReport({
      userId: req.user.uid,
      crimeType,
      description,
      location,
      latitude,
      longitude,
      time
    });

    return res.status(201).json({
      message: 'Report submitted successfully',
      reportId
    });
  } catch (error) {
    console.error('Submit report error:', error);
    return res.status(500).json({ error: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await getUserReports(req.user.uid);
    return res.status(200).json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    return res.status(500).json({ error: error.message });
  }
};

const getReportDetails = async (req, res) => {
  try {
    const report = await getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    if (report.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    return res.status(200).json(report);
  } catch (error) {
    console.error('Get report details error:', error);
    return res.status(500).json({ error: error.message });
  }
};

const updateReportDetails = async (req, res) => {
  try {
    const report = await getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    if (report.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await updateReport(req.params.id, req.body);
    return res.status(200).json({ message: 'Report updated successfully' });
  } catch (error) {
    console.error('Update report error:', error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteReportById = async (req, res) => {
  try {
    const report = await getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    if (report.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await deleteReport(req.params.id);
    return res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllPublicReports = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const reports = await getAllReports(limit);
    return res.status(200).json(reports);
  } catch (error) {
    console.error('Get all reports error:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  submitReport,
  getReports,
  getReportDetails,
  updateReportDetails,
  deleteReportById,
  getAllPublicReports
};