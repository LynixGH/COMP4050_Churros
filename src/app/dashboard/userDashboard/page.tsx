'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Axios is used for requests
import UnitCard from '@/app/components/UnitCard'; // Import the UnitCard component
import '@/app/styles/userDashboard.css'; // Import the dashboard styles
import CreateUnitPopup from '@/app/components/CreateUnitPopup';
import { GET_ALL_UNITS } from '@/api'; // Import the GET_ALL_UNITS from API.tsx

interface Unit {
  unit_code: string;
  unit_name: string;
  year: string;
  session: string;
  level: string;
}

const UserDashboard = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const convenerEmail = 'convener2@example.com'; // Replace with dynamic email if needed
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Callback to add the newly created unit to the list
  const handleUnitCreated = (newUnit: Unit) => {
    setUnits((prevUnits) => [...prevUnits, newUnit]); // Add the new unit to the existing units
  };

  // Get current year and session based on the current date
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentSession = currentDate.getMonth() < 6 ? 'S1' : 'S2'; // S1 for Jan-May, S2 for Jun-Dec

  useEffect(() => {
    // Fetch the units from the backend using the GET_ALL_UNITS endpoint
    const fetchUnits = async () => {
      try {
        const response = await axios.get(GET_ALL_UNITS(convenerEmail));
        setUnits(response.data); // Set the fetched data to the state
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    };

    fetchUnits();
  }, [convenerEmail]);

  // Filter active and inactive units
  const activeUnits = units.filter(
    (unit) => unit.year === currentYear && unit.session === currentSession
  );

  // Sort inactive units based on year and session
  const inactiveUnits = units
    .filter(
      (unit) => !(unit.year === currentYear && unit.session === currentSession)
    )
    .sort((a, b) => {
      if (a.year !== b.year) {
        return parseInt(b.year) - parseInt(a.year); // Sort by year descending
      } else {
        return a.session === 'S2' && b.session === 'S1' ? -1 : 1; // Sort by session, S2 first
      }
    });

  return (
    <div className="unit-dashboard">
      <button onClick={handleOpenPopup}>Create New Unit</button>

      {isPopupOpen && <CreateUnitPopup onClose={handleClosePopup} convenerEmail={convenerEmail} onUnitCreated={handleUnitCreated} />} {/* Pass the email and callback */}

      <h2>Active Units</h2>
      <div className="units-section active-units">
        {activeUnits.length > 0 ? (
          activeUnits.map((unit) => (
            <UnitCard key={unit.unit_code} unit={unit} />
          ))
        ) : (
          <p>No active units available.</p>
        )}
      </div>

      <h2>Inactive Units</h2>
      <div className="units-section inactive-units">
        {inactiveUnits.length > 0 ? (
          inactiveUnits.map((unit) => (
            <UnitCard key={unit.unit_code} unit={unit} />
          ))
        ) : (
          <p>No inactive units available.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
