import React, { useEffect, useState, useContext } from 'react';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './UpcomingInterviews.css';

const UpcomingInterviews = () => {
  const { user } = useContext(AuthContext);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const url = user?.role === 'seeker' ? '/interviews/seeker' : '/interviews/recruiter';
        const res = await API.get(url);
        setInterviews(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role) fetchInterviews(); // call this
  }, [user?.role]);

  return (
    <div className="interview-section">
      <h3>📅 Upcoming Interviews</h3>
      {loading ? (
        <p>Loading...</p>
      ) : interviews.length > 0 ? (
        interviews.map((iv) => (
          <div key={iv._id} className="interview-card">
            <p><strong>Job:</strong> {iv.application?.job?.title}</p>
            {user?.role === 'recruiter' && <p><strong>Candidate:</strong> {iv.seeker?.name}</p>}
            <p><strong>Date:</strong> {new Date(iv.date).toLocaleString()}</p>
            <p><strong>Mode:</strong> {iv.mode}</p>
            <p><strong>Location:</strong> {iv.location}</p>
            <p><strong>Status:</strong> {iv.status}</p>
          </div>
        ))
      ) : (
        <p>No interviews yet</p>
      )}
    </div>
  );
};

export default UpcomingInterviews;
