const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  scheduleInterview,
  getSeekerInterviews,
  getRecruiterInterviews,
  updateInterviewStatus
} = require('../controllers/interviewController');

const router = express.Router();

router.post('/schedule', protect, authorize('recruiter'), scheduleInterview);
router.get('/seeker', protect, authorize('seeker'), getSeekerInterviews);
router.get('/recruiter', protect, authorize('recruiter'), getRecruiterInterviews);
router.put('/status/:interviewId', protect, authorize('recruiter'), updateInterviewStatus);

module.exports = router;
