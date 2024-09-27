'use client';

import React, { useEffect, useState } from 'react';
import UnitCard from '@/app/components/UnitCard'; // Import the UnitCard component
import '@/app/styles/UserDashboard.css'; // Import the dashboard styles

interface Unit {
  unit_code: string;
  unit_name: string;
  year: string;
  session: string;
}

// Define the constant for the API URL
const API_URL = 'http://54.206.102.192/units';

const UserDashboard = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const convenerEmail = 'convener2@example.com'; // Replace with dynamic email if needed

  // Get current year and session based on the current date
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentSession = currentDate.getMonth() < 6 ? 'S1' : 'S2'; // S1 for Jan-May, S2 for Jun-Dec

  useEffect(() => {
    // Simulate fetching units with dummy data since backend is down
    const dummyData: Unit[] = [
      {
        unit_code: 'COMP3100',
        unit_name: 'Distributed Systems',
        year: '2024',
        session: 'S1',
      },
      {
        unit_code: 'COMP3400',
        unit_name: 'Software Engineering',
        year: '2024',
        session: 'S2',
      },
      {
        unit_code: 'COMP3500',
        unit_name: 'Database Systems',
        year: '2024',
        session: 'S1',
      },
      {
        unit_code: 'COMP3600',
        unit_name: 'Web Technologies',
        year: '2023',
        session: 'S1',
      },
      {
        unit_code: 'COMP3700',
        unit_name: 'Machine Learning',
        year: '2021',
        session: 'S1',
      },
      {
        unit_code: 'COMP4500',
        unit_name: 'Artificial Intelligence',
        year: '2024',
        session: 'S2',
      },
      {
        unit_code: 'COMP4900',
        unit_name: 'Cloud Computing',
        year: '2024',
        session: 'S1',
      },
    ];

    // Mimic the async behavior of API requests
    setTimeout(() => {
      setUnits(dummyData);
    }, 1000);
  }, []);

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
