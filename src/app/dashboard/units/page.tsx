'use client'

import React from 'react';
import Assignments from '@/app/components/Assignment'; // Import the Assignments component
import Tutors from '@/app/components/TutorList'; // Import the Tutors component

const UnitDashboard: React.FC = () => {
  const unitName = "CS101"; // Example unit name

  return (
    <div style={styles.container}>
      <h1>{unitName} Dashboard</h1>
      
      {/* Flex container to hold both Assignments and Tutors */}
      <div style={styles.content}>
        {/* Section for displaying assignments */}
        <div style={styles.assignments}>
          <h2>Assignments</h2>
          <Assignments /> {/* Call the Assignments component */}
        </div>

        {/* Section for displaying tutors */}
        <div style={styles.tutors}>
          <h2>Tutors</h2>
          <Tutors /> {/* Call the Tutors component */}
        </div>
      </div>
    </div>
  );
};

// Simple inline styles for layout
const styles = {
  container: {
    padding: '20px',
  },
  content: {
    display: 'flex',
    flexDirection: 'row', // Ensures elements are placed side by side
    gap: '20px',
  },
  assignments: {
    flex: 4, // Takes 4/5 of the width
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  tutors: {
    flex: 1, // Takes 1/5 of the width
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
};

export default UnitDashboard;
