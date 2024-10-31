import React, { useState } from 'react';
import axios from 'axios';
import '@/app/styles/CreateUnitPopup.css';
import { POST_UNIT } from '@/api';

interface CreateUnitPopupProps {
  onClose: () => void;
  convenerEmail: string;
  onUnitCreated: (newUnit: any) => void;
}

const CreateUnitPopup: React.FC<CreateUnitPopupProps> = ({ onClose, convenerEmail, onUnitCreated }) => {
  const [unitCode, setUnitCode] = useState('');
  const [unitName, setUnitName] = useState('');
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
  // Set default session based on the current month
  // Get the current date
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // Get current month (0-11)
  const defaultSession = currentMonth < 8 ? 'S1' : 'S2'; // S1 for Jan-Aug, S2 for Sep-Dec
  const [session, setSession] = useState(defaultSession); 
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
      const response = await axios.post(POST_UNIT, newUnit);
      alert('Unit created successfully');
      onUnitCreated(response.data);
      onClose();
    } catch (error) {
      console.error('Failed to create unit', error);
      alert('Error creating unit');
    }
  };

  // Generate a list of years from the current year, going back five years and forward two years
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

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
            <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} required>
              {yearOptions.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </label>
          <label>
            Session:
            <select value={session} onChange={(e) => setSession(e.target.value)} required>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>
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