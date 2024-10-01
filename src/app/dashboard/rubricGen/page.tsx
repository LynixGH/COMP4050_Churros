'use client';

import React, { useState } from 'react';
import '@/app/styles/rubricGen.css'; // Import the styles for RubricGen
import CreateRubricPopup from '@/app/components/CreateRubricPopup'; // Import the CreateRubricPopup component

const RubricGen = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="rubric-dashboard">
      <button onClick={handleOpenPopup}>Create New Rubric</button>

      {isPopupOpen && <CreateRubricPopup onClose={handleClosePopup} />}
      
      <h2>Generated Rubrics</h2>
      <div className="rubric-section">
        {/* Here you can display any rubrics that have already been generated */}
        {/* You can map over rubric data similar to how units are mapped in UserDashboard */}
        <p>No rubrics available yet.</p>
      </div>
    </div>
  );
};

export default RubricGen;
