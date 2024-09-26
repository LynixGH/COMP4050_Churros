'use client'

//Display unit name, assignments in the unit, tutors assigned to the unit, ability to upload studentcsv, ability to create assignment
import React from 'react';
import Assignments from '@/app/components/Assignment'; // Import the Assignments component

const UnitDashboard: React.FC = () => {
  const unitName = "CS101"; // Assuming the unit name is available

  return (
    <div style={styles.container}>
      <h1>{unitName} Dashboard</h1>
      
      {/* Section for displaying assignments */}
      <h2>Assignments</h2>
      <Assignments /> {/* Call the Assignments component */}
    </div>
  );
};

// Simple inline styles for layout
const styles = {
  container: {
    padding: '20px',
  }
};

export default UnitDashboard;
