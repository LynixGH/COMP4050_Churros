import React, { useState } from 'react';
import axios from 'axios';
import '@/app/styles/CreateUnitPopup.css'; // Import CSS for the popup
import { POST_UNIT } from '@/api';

interface CreateUnitPopupProps {
  onClose: () => void;
}

const CreateUnitPopup: React.FC<CreateUnitPopupProps> = ({ onClose }) => {
  const [unitCode, setUnitCode] = useState('');
  const [unitName, setUnitName] = useState('');
  const [convenerEmail, setConvenerEmail] = useState('');
  const [year, setYear] = useState('');
  const [session, setSession] = useState('');
  const [level, setLevel] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUnit = {
      unit_code: unitCode,
      unit_name: unitName,
      convener_email: convenerEmail,
      year,
      session,
      level,
    };

    try {
      await axios.post(POST_UNIT, newUnit);
      alert('Unit created successfully');
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
            Convener Email:
            <input type="email" value={convenerEmail} onChange={(e) => setConvenerEmail(e.target.value)} required />
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
