const Application = require('../models/Application');
const Job = require('../models/Job');
const { sendEmail } = require('../services/emailService');

exports.applyToJob = async (req, res) => {
  try {
    const { education, experience } = req.body;
    const jobId = req.params.jobId;

    if (!education || !experience) {
      return res.status(400).json({ msg: 'All fields required.' });
    }
    if (!req.file) {
      return res.status(400).json({ msg: 'Resume upload required (PDF only).' });
    }

    const job = await Job.findById(jobId).populate('recruiter');
    if (!job) return res.status(404).json({ msg: 'Job not found.' });

    // Prevent duplicate applications by the same user
    const exists = await Application.findOne({ job: jobId, seeker: req.user._id });
    if (exists) return res.status(400).json({ msg: 'Already applied for this job.' });

    const application = await Application.create({
      job: jobId,
      seeker: req.user._id,
      education,
      experience,
      resume: req.file.filename,
    });

    // Email notifications
    await sendEmail(
      req.user.email,
      'Application submitted',
      `<p>You applied for <strong>${job.title}</strong> successfully.</p>`
    );

    await sendEmail(
      job.recruiter.email,
      'New job application',
      `<p>${req.user.name} applied to your job <strong>${job.title}</strong>.</p>`
    );

    res.status(201).json({ msg: 'Application submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Application submission failed' });
  }
};

exports.getApplicationsByJob = async (req, res) => {
  const jobId = req.params.jobId;
  const job = await Job.findById(jobId);
  if (!job || job.recruiter.toString() !== req.user._id.toString()) {
    return res.status(403).json({ msg: 'Unauthorized' });
  }

  const applications = await Application.find({ job: jobId }).populate('seeker', '-password');
  res.json(applications);
};

exports.getSeekerApplications = async (req, res) => {
  const applications = await Application.find({ seeker: req.user._id }).populate('job');
  res.json(applications);
};
