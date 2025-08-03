const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  applyToJob,
  getApplicationsByJob,
  getSeekerApplications
} = require('../controllers/applicationController');

const router = express.Router();

// Apply to a job (seeker, with PDF resume upload)
router.post('/apply/:jobId', protect, authorize('seeker'), upload.single('resume'), applyToJob);

// Seeker views their own applications
router.get('/my', protect, authorize('seeker'), getSeekerApplications);

// Recruiter views applicants for a job
router.get('/:jobId', protect, authorize('recruiter'), getApplicationsByJob);

module.exports = router;
