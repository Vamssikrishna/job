import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import JobCard from './JobCard';
import './SeekerDashboard.css';
import UpcomingInterviews from './UpcomingInterviews';

const SeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const queryParams = [];
      if (search) queryParams.push(`search=${search}`);
      if (skills) queryParams.push(`skills=${skills}`);
      
      const query = queryParams.length ? `?${queryParams.join('&')}` : '';
      const res = await API.get(`/jobs${query}`);
      setJobs(res.data);
      setLoading(false);
    } catch (err) {
      alert('Failed to fetch jobs');
      setLoading(false);
    }
  };

  useEffect(() => {
  const fetchJobs = async () => {
    try {
      const queryParams = [];
      if (search) queryParams.push(`search=${search}`);
      if (skills) queryParams.push(`skills=${skills}`);
      const query = queryParams.length ? `?${queryParams.join('&')}` : '';
      const res = await API.get(`/jobs${query}`);
      setJobs(res.data);
    } catch {
      alert('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  fetchJobs();
}, [search, skills]);


  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="seeker-dashboard">
      <h2>Available Jobs</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search job title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by skill (comma-separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length ? (
        jobs.map(job => <JobCard key={job._id} job={job} />)
      ) : (
        <p>No jobs found. Adjust filters or try again.</p>
      )}
      <UpcomingInterviews />
    </div>
  );
};

export default SeekerDashboard;
