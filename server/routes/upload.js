const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const uploadController = require('../controllers/uploadController');

const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      // ignore
    }
  }
  next();
};

router.post('/analyze', optionalAuth, upload.single('resume'), uploadController.uploadAndAnalyze);

module.exports = router;
