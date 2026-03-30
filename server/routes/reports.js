const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, reportController.getUserReports);
router.get('/:id', reportController.getReportById); // Optional: add authMiddleware if strict privacy needed, we'll keep public for sharing

module.exports = router;
