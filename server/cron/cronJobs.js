const cron = require('node-cron');
const Interview = require('../models/Interview');
const User = require('../models/User');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { sendEmail } = require('../services/emailService');

exports.start = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('📬 Checking for upcoming interviews...');

    const now = new Date();
    const twentyFourHoursAhead = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const interviews = await Interview.find({
      status: 'Scheduled',
      date: {
        $gte: new Date(twentyFourHoursAhead.setMinutes(0, 0, 0)),
        $lt: new Date(twentyFourHoursAhead.setMinutes(59, 59, 999))
      }
    }).populate('seeker application');

    for (const interview of interviews) {
      const user = interview.seeker;
      const jobTitle = (await Job.findById(interview.application.job)).title;

      await sendEmail(
        user.email,
        `📅 Reminder: Interview tomorrow for ${jobTitle}`,
        `<h3>Reminder!</h3>
         <p>Your interview is scheduled for <b>${new Date(interview.date).toLocaleString()}</b>.</p>
         <p>Mode: ${interview.mode}</p>
         <p>Location/Link: ${interview.location}</p>`
      );

      console.log(`Reminder sent to ${user.email}`);
    }
  });
};
