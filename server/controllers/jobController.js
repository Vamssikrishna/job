const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  const { title, description, skills, deadline } = req.body;
  const job = await Job.create({
    recruiter: req.user._id,
    title,
    description,
    skills,
    deadline
  });
  res.status(201).json(job);
};

exports.getAllJobs = async (req, res) => {
  const { search, skills } = req.query;
  let filters = {};
  if (search) filters.title = { $regex: search, $options: 'i' };
  if (skills) filters.skills = { $in: skills.split(',') };

  const jobs = await Job.find(filters).populate('recruiter', 'name email');
  res.json(jobs);
};

exports.getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id).populate('recruiter', 'name email');
  if (!job) return res.status(404).json({ msg: 'Job not found' });
  res.json(job);
};

exports.updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job || job.recruiter.toString() !== req.user._id.toString())
    return res.status(403).json({ msg: 'Unauthorized' });

  const { title, description, skills, deadline } = req.body;
  job.title = title;
  job.description = description;
  job.skills = skills;
  job.deadline = deadline;
  await job.save();

  res.json(job);
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // 🔐 Check if this recruiter owns the job
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Access denied: Not job owner' });
    }

    await job.deleteOne(); // or job.remove()

    res.status(200).json({ msg: 'Job deleted successfully' });
  } catch (error) {
    console.error('❌ Failed to delete job:', error);
    res.status(500).json({ msg: 'Failed to delete job' });
  }
};
