'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@/app/styles/rubricGen.css';
import CreateRubricPopup from '@/app/components/CreateRubricPopup'; // For creating rubrics
import EditRubricPopup from '@/app/components/EditRubricPopup'; // For editing rubrics
import { GET_RUBRIC } from '@/api';

const RubricGen = () => {
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [rubricData, setRubricData] = useState(null); // State to hold fetched rubric data
  const [editRubric, setEditRubric] = useState(null); // State for holding rubric to be edited

  const handleOpenCreatePopup = () => {
    setIsCreatePopupOpen(true);
  };

  const handleOpenEditPopup = (rubric) => {
    setEditRubric(rubric);
    setIsEditPopupOpen(true);
  };

  const handleCloseCreatePopup = (newRubric) => {
    // Add the newly created rubric to the list
    if (newRubric) {
      setRubricData(newRubric);
    }
    setIsCreatePopupOpen(false);
  };

  const handleCloseEditPopup = (updatedRubric) => {
    // Update the rubric after editing
    if (updatedRubric) {
      setRubricData(updatedRubric);
    }
    setIsEditPopupOpen(false);
  };

  // Delete rubric functionality (if needed)
  const handleDeleteRubric = () => {
    setRubricData(null);
  };

  // Fetch rubric data from the API
  useEffect(() => {
    const fetchRubric = async () => {
      try {
        const response = await axios.get(GET_RUBRIC(7));
        console.log('Fetched Rubric Data:', response.data);  // Log the fetched data
        setRubricData(response.data);  // Set the fetched rubric data to the state
      } catch (error) {
        console.error('Error fetching rubric data:', error);
        alert('Failed to fetch rubric data.');
      }
    };

    fetchRubric();
  }, []); // Fetch data once when component mounts

  // Helper function to render criteria
  const renderCriteria = (criteria) => (
    <ul>
      {criteria.map((criterion, index) => (
        <li key={index}>
          <strong>{criterion.criteria_name}:</strong> {criterion.criteria_description}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="rubric-dashboard">
      <button onClick={handleOpenCreatePopup}>Create New Rubric</button>

      {isCreatePopupOpen && <CreateRubricPopup onClose={handleCloseCreatePopup} />}

      {isEditPopupOpen && editRubric && (
        <EditRubricPopup onClose={handleCloseEditPopup} existingRubric={editRubric} />
      )}

      {/* Render Rubric Data */}
      {rubricData ? (
        <div className="rubric-table-container">
          <h2>{rubricData.rubric_title}</h2>

          {/* Table to display the rubric */}
          <table className="rubric-table">
            <thead>
              <tr>
                <th>Grade</th>
                <th>Mark Range</th>
                <th>Criteria</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(rubricData.grade_descriptors).map(([grade, descriptor], idx) => (
                <tr key={idx}>
                  <td>{grade}</td>
                  <td>{descriptor.mark_min} - {descriptor.mark_max}</td>
                  <td>{renderCriteria(descriptor.criterion)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={() => handleOpenEditPopup(rubricData)}>Edit Rubric</button>
          <button onClick={handleDeleteRubric}>Delete Rubric</button>
        </div>
      ) : (
        <p>No rubric available</p>
      )}
    </div>
  );
};

export default RubricGen;
