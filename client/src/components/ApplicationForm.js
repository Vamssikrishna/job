import React, { useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import './ApplicationForm.css';

const ApplicationForm = ({ jobId }) => {
  const [formData, setFormData] = useState({
    education: '',
    experience: '',
    resume: null
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === 'resume') {
      setFormData({ ...formData, resume: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!formData.education || !formData.experience || !formData.resume) {
      toast.error('All fields and a PDF resume are required.');
      setSubmitting(false);
      return;
    }

    try {
      const form = new FormData();
      form.append('education', formData.education);
      form.append('experience', formData.experience);
      form.append('resume', formData.resume);

      await API.post(`/applications/apply/${jobId}`, form);
      toast.success('✅ Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.msg || '❌ Failed to apply. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="apply-form" onSubmit={handleSubmit}>
      <input type="text" name="education" placeholder="Education" required onChange={handleChange} />
      <input type="text" name="experience" placeholder="Experience" required onChange={handleChange} />
      <input type="file" name="resume" accept=".pdf" required onChange={handleChange} />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Apply'}
      </button>
    </form>
  );
};

export default ApplicationForm;
