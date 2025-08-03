import React from 'react';
import { Link } from 'react-router-dom';
import './JobCard.css';

const JobCard = ({ job }) => (
  <div className="job-card">
    <h3>{job.title}</h3>
    <p><strong>Company:</strong> {job.recruiter?.name}</p>
    <p><strong>Skills:</strong> {job.skills.join(', ')}</p>
    <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
    <Link to={`/jobs/${job._id}`} className="details-btn">View Details</Link>
  </div>
);

export default JobCard;
