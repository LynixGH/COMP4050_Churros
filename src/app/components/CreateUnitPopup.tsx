import React, { useState } from 'react';
import axios from 'axios';
import '@/app/styles/CreateUnitPopup.css'; // Import CSS for the popup
import { POST_UNIT } from '@/api';

interface CreateUnitPopupProps {
  onClose: () => void;
  convenerEmail: string; // Email passed from UserDashboard
  onUnitCreated: (newUnit: any) => void; // Callback to notify UserDashboard
}

const CreateUnitPopup: React.FC<CreateUnitPopupProps> = ({ onClose, convenerEmail, onUnitCreated }) => {
  const [unitCode, setUnitCode] = useState('');
  const [unitName, setUnitName] = useState('');
  const [year, setYear] = useState('');
  const [session, setSession] = useState('');
  const [level, setLevel] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUnit = {
      unit_code: unitCode,
      unit_name: unitName,
      convener_email: convenerEmail, // Use the email passed as prop
      year,
      session,
      level,
    };

    try {
      const response = await axios.post(POST_UNIT, newUnit);
      alert('Unit created successfully');
      onUnitCreated(response.data); // Notify UserDashboard to update units
      onClose(); // Close the popup after submission
    } catch (error) {
      console.error('Failed to create unit', error);
      alert('Error creating unit');
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-content">
        <h2>Create New Unit</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Unit Code:
            <input type="text" value={unitCode} onChange={(e) => setUnitCode(e.target.value)} required />
          </label>
          <label>
            Unit Name:
            <input type="text" value={unitName} onChange={(e) => setUnitName(e.target.value)} required />
          </label>
          <label>
            Year:
            <input type="text" value={year} onChange={(e) => setYear(e.target.value)} required />
          </label>
          <label>
            Session:
            <input type="text" value={session} onChange={(e) => setSession(e.target.value)} required />
          </label>
          <label>
            Level:
            <input type="text" value={level} onChange={(e) => setLevel(e.target.value)} required />
          </label>
          <button type="submit">Create Unit</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CreateUnitPopup;
