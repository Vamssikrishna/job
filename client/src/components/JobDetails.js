import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';
import ApplicationForm from './ApplicationForm';
import './JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // FIX: fetchJob runs correctly with ID
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (error) {
        console.error(error);
        alert('Failed to load job');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob(); // don't forget to call it
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (!job) return <p>Job not found</p>;

  return (
    <div className="job-details">
      <h2>{job.title}</h2>
      <p><strong>Company:</strong> {job.recruiter?.name}</p>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Skills:</strong> {job.skills.join(', ')}</p>
      <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
      
      <hr />
      <h3>Apply for this Position</h3>
      <ApplicationForm jobId={job._id} />
    </div>
  );
};

export default JobDetails;
