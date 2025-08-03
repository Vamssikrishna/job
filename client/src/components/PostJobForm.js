// src/components/PostJobForm.js
import React, { useState } from 'react';
import API from '../utils/api';
import './PostJobForm.css';

const PostJobForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    deadline: ''
  });

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const body = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim())
      };
      await API.post('/jobs', body);
      setFormData({ title: '', description: '', skills: '', deadline: '' });
      onSuccess();
    } catch (e) {
      alert('Failed to save job.');
    }
  };

  return (
    <form className="post-job-form" onSubmit={handleSubmit}>
      <input name="title" placeholder="Job title" required onChange={handleChange} />
      <textarea name="description" placeholder="Job description" required onChange={handleChange} />
      <input name="skills" placeholder="Skills (comma separated)" required onChange={handleChange} />
      <input type="date" name="deadline" onChange={handleChange} required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default PostJobForm;
