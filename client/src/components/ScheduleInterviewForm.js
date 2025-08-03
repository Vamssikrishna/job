import React, { useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import './ScheduleInterviewForm.css';

const ScheduleInterviewForm = ({ applicationId, seeker, onClose }) => {
  const [mode, setMode] = useState('online');
  const [form, setForm] = useState({
    date: '',
    location: generateMeetLink()
  });

  function generateMeetLink() {
    const part = () => Math.random().toString(36).substring(2, 5);
    return `https://meet.google.com/${part()}-${part()}-${part()}`;
  }

  const handleModeChange = (e) => {
    const selectedMode = e.target.value;

    if (selectedMode === 'online') {
      // Auto-generate and lock the location
      setForm((prev) => ({
        ...prev,
        location: generateMeetLink()
      }));
    } else {
      // Allow user to enter location
      setForm((prev) => ({
        ...prev,
        location: ''
      }));
    }

    setMode(selectedMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.date || !form.location) {
      toast.error('All fields are required.');
      return;
    }

    try {
      await API.post('/interviews/schedule', {
        applicationId,
        date: form.date,
        mode,
        location: form.location,
      });
      toast.success('Interview scheduled');
      onClose();
    } catch (err) {
      toast.error('Failed to schedule');
      console.error(err);
    }
  };

  return (
    <div className="schedule-form">
      <h4>Schedule Interview with {seeker.name}</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <select value={mode} onChange={handleModeChange}>
          <option value="online">Online (Auto-generate Meet Link)</option>
          <option value="offline">Offline (Enter address)</option>
        </select>

        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder={mode === 'online' ? 'Meet Link' : 'Enter address'}
          readOnly={mode === 'online'} // 🔒 lock for online
          required
        />

        <button type="submit">Schedule</button>
      </form>
    </div>
  );
};

export default ScheduleInterviewForm;
