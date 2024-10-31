import React, { useState, useEffect } from 'react';
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
  const [year, setYear] = useState(new Date().getFullYear());
  const currentMonth = new Date().getMonth();
  const defaultSession = currentMonth < 8 ? 'S1' : 'S2';
  const [session, setSession] = useState(defaultSession);
  const [level, setLevel] = useState('');

  // Map the first digit of the unit code to the appropriate study level
  const determineLevelFromCode = (code: string) => {
    const firstDigit = code.charAt(4);
    switch (firstDigit) {
      case '1':
        return 'first-year';
      case '2':
        return 'second-year';
      case '3':
        return 'third-year';
      case '4':
        return 'forth-year or honors'
      case '5':
        return 'honors or postgraduate';
      case '6':
        return 'masters';
      default:
        return 'postgraduate level';
    }
  };

  // Update the level whenever the unit code changes
  useEffect(() => {
    if (unitCode.length >= 5) {
      setLevel(determineLevelFromCode(unitCode));
    }
  }, [unitCode]);

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
          <button type="submit">Create Unit</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CreateUnitPopup;
