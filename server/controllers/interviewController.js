const Interview = require('../models/Interview');
const Application = require('../models/Application');
const { sendEmail } = require('../services/emailService');

// ✅ Random Google Meet-style link generator
const generateMeetLink = () => {
  const part = () => Math.random().toString(36).substring(2, 5);
  return `https://meet.google.com/${part()}-${part()}-${part()}`;
};

// ✅ Schedule Interview Controller
exports.scheduleInterview = async (req, res) => {
  try {
    const { applicationId, date, mode } = req.body;

    // Require all fields but location is auto-handled for online
    if (!applicationId || !date || !mode) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    // Get application (also fetch job & seeker)
    const application = await Application.findById(applicationId).populate('seeker job');
    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    // ✅ Always auto-generate location for online
    let location = '';
    if (mode === 'online') {
      location = generateMeetLink();
    } else {
      // Offline - expect a location from frontend
      location = req.body.location;
      if (!location) {
        return res.status(400).json({ msg: 'Location is required for offline interviews' });
      }
    }

    // ✅ Create interview
    const interview = await Interview.create({
      application: applicationId,
      recruiter: req.user._id,
      seeker: application.seeker._id,
      date,
      mode,
      location,
      status: 'Scheduled',
    });

    const formattedDate = new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const emailBody = `
      <div style="font-family: Arial">
        <h2>Your Interview is Scheduled</h2>
        <p><strong>Job:</strong> ${application.job.title}</p>
        <p><strong>Date & Time:</strong> ${formattedDate}</p>
        <p><strong>Mode:</strong> ${mode}</p>
        <p><strong>${mode === 'online' ? 'Meeting Link' : 'Location'}:</strong><br>
        ${mode === 'online'
          ? `<a href="${location}" target="_blank">${location}</a>`
          : location}
        </p>
        <br><p>All the best!<br>– Job Melaa Team</p>
      </div>
    `;

    await sendEmail(
      application.seeker.email,
      'Interview Scheduled – Job Melaa',
      emailBody
    );

    res.status(201).json({ msg: 'Interview scheduled successfully', interview });
  } catch (err) {
    console.error('❌ Error scheduling interview:', err);
    res.status(500).json({ msg: 'Failed to schedule interview' });
  }
};

// ✅ Get Interviews for Seeker
exports.getSeekerInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ seeker: req.user._id })
      .populate({
        path: 'application',
        populate: { path: 'job' }
      })
      .populate('recruiter', 'name email');

    res.status(200).json(interviews);
  } catch (err) {
    console.error('Seeker Interview Error:', err);
    res.status(500).json({ msg: 'Failed to fetch interviews.' });
  }
};

// ✅ Get Interviews for Recruiter
exports.getRecruiterInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ recruiter: req.user._id })
      .populate({
        path: 'application',
        populate: { path: 'job' }
      })
      .populate('seeker', 'name email');

    res.status(200).json(interviews);
  } catch (err) {
    console.error('Recruiter Interview Error:', err);
    res.status(500).json({ msg: 'Failed to fetch interviews.' });
  }
};

// ✅ Update Interview Status
exports.updateInterviewStatus = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { status } = req.body;

    const interview = await Interview.findById(interviewId).populate({
      path: 'application',
      populate: { path: 'job' }
    });

    if (!interview) return res.status(404).json({ msg: 'Interview not found' });
    if (interview.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    interview.status = status;
    await interview.save();

    const statusMsg = `
      <div>
        <h2>Interview Status Updated</h2>
        <p><strong>Job:</strong> ${interview.application.job.title}</p>
        <p><strong>Status:</strong> ${status}</p>
      </div>
    `;

    await sendEmail(
      interview.seeker.email,
      `Interview ${status} – Job Melaa`,
      statusMsg
    );

    res.status(200).json({ msg: 'Status updated successfully', interview });
  } catch (err) {
    console.error('❌ Status update error:', err);
    res.status(500).json({ msg: 'Failed to update interview status' });
  }
};
