const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  seeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  education: { type: String, required: true },
  experience: { type: String, required: true },
  resume: { type: String, required: true },
  status: { type: String, enum: ['applied', 'interview', 'hired', 'rejected'], default: 'applied' },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
