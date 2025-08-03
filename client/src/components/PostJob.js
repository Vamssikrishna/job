import React, { useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

const PostJob = ({ onJobPosted }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    skills: '',
    deadline: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, skills, deadline } = form;

    if (!title || !description || !skills || !deadline) {
      toast.warning('Please fill in all fields.');
      return;
    }

    try {
      const res = await API.post('/jobs', {
        ...form,
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean), // ✅ ensure array
      });

      toast.success('Job posted successfully!');
      if (onJobPosted) onJobPosted();
      setForm({ title: '', description: '', skills: '', deadline: '' });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Failed to post job');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Job Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Job Description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="skills"
        placeholder="Skills (comma-separated)"
        value={form.skills}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="deadline"
        value={form.deadline}
        onChange={handleChange}
        required
      />
      <button type="submit">Post Job</button>
    </form>
  );
};

export default PostJob;
