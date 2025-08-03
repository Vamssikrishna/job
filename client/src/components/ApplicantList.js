// src/components/ApplicantList.js
import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import './ApplicantList.css';
import ScheduleInterviewForm from './ScheduleInterviewForm';

const ApplicantList = ({ job, onClose }) => {
  const [applicants, setApplicants] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await API.get(`/applications/${job._id}`);
        setApplicants(res.data);
      } catch (err) {
        alert('Could not load applicants');
      }
    };
    fetchApplicants();
  }, [job._id]);

  return (
    <div className="applicant-list">
      <h3>Applicants for {job.title}</h3>
      <button onClick={onClose}>✖ Close</button>

      {applicants.length > 0 ? (
        applicants.map((a) => (
          <div className="applicant" key={a._id}>
            <p><strong>Name:</strong> {a.seeker?.name}</p>
            <p><strong>Email:</strong> {a.seeker?.email}</p>
            <p><strong>Education:</strong> {a.education}</p>
            <p><strong>Experience:</strong> {a.experience}</p>

            <a
              href={`http://localhost:5000/uploads/${a.resume}`}
              target="_blank"
              rel="noreferrer"
            >
              📄 Download Resume
            </a>

            <br />
            <button
              onClick={() => setSelectedApp(a)}
              className="interview-btn"
            >
              📅 Schedule Interview
            </button>

            {selectedApp?._id === a._id && (
              <ScheduleInterviewForm
                seeker={a.seeker}
                applicationId={a._id}
                onClose={() => setSelectedApp(null)}
              />
            )}
          </div>
        ))
      ) : (
        <p>No applicants yet for this job.</p>
      )}
    </div>
  );
};

export default ApplicantList;
