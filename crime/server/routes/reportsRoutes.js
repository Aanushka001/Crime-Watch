const express = require('express');
const {
  createReport,
  getMyReports,
  getPublicReports,
  getPendingReports,
  getReport,
  updateReport,
  deleteReport,
  moderateReport
} = require('../controllers/reportsController');
const { authenticate, authenticateOptional, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/public', getPublicReports);
router.get('/moderation', authenticate, authorize('moderator', 'administrator'), getPendingReports);
router.get('/', authenticate, getMyReports);
router.post('/', authenticateOptional, createReport);
router.get('/:id', authenticate, getReport);
router.patch('/:id', authenticate, updateReport);
router.delete('/:id', authenticate, deleteReport);
router.patch('/:id/moderate', authenticate, authorize('moderator', 'administrator'), moderateReport);

module.exports = router;
