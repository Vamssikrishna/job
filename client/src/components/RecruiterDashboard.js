// src/components/RecruiterDashboard.js
import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import PostJobForm from './PostJobForm';
import ApplicantList from './ApplicantList';
import './RecruiterDashboard.css';
import UpcomingInterviews from './UpcomingInterviews';
import { toast } from 'react-toastify';



const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await API.get('/jobs');
      const myJobs = res.data.filter(job => job.recruiter); // All jobs
      setJobs(myJobs);
    } catch (err) {
      alert('Failed to fetch jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

const handleDelete = async (jobId) => {
  if (!window.confirm('Are you sure you want to delete this job?')) return;
  try {
    await API.delete(`/jobs/${jobId}`);
    toast.success('Job deleted');        // ✅
    fetchJobs();
  } catch (err) {
    console.error('❌ Delete Job Error:', err);
    toast.error(err.response?.data?.msg || 'Delete failed'); // ✅
  }
};


  return (
    <div className="recruiter-dashboard">
      <h2>Your Job Postings</h2>
      <button className="post-btn" onClick={() => setShowPostForm(!showPostForm)}>
        {showPostForm ? 'Close' : 'Post New Job'}
      </button>

      {showPostForm && <PostJobForm onSuccess={fetchJobs} />}

      {loading ? <p>Loading jobs...</p> : (
        jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job._id} className="job-listing">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p><strong>Skills:</strong> {job.skills.join(', ')}</p>
              <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
              <button className="delete-btn" onClick={() => handleDelete(job._id)}>🗑 Delete</button>
              <button className="view-apps" onClick={() => setSelectedJob(job)}>👁 View Applicants</button>
            </div>
          ))
        ) : <p>No jobs posted yet.</p>
      )}

      {selectedJob && (
        <ApplicantList job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
      <UpcomingInterviews />
    </div>
    
  );
};


export default RecruiterDashboard;
