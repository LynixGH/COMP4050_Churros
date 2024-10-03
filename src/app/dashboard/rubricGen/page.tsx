'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import axios to make API requests
import '@/app/styles/rubricGen.css';
import CreateRubricPopup from '@/app/components/CreateRubricPopup'; // For creating rubrics
import EditRubricPopup from '@/app/components/EditRubricPopup'; // For editing rubrics
//import '@/app/api.tsx';

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
        const response = await axios.get('http://3.27.205.64/rubric/1');
        setRubricData(response.data);  // Set the fetched rubric data to the state
      } catch (error) {
        console.error('Error fetching rubric data:', error);
        alert('Failed to fetch rubric data.');
      }
    };

    fetchRubric();
  }, []); // Fetch data once when component mounts

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
              {rubricData.grade_descriptor_list?.map((descriptor, idx) => (
                <tr key={idx}>
                  <td>{descriptor.grade_descriptor_item.grade_descriptor_name}</td>
                  <td>
                    {descriptor.grade_descriptor_item.mark_min} - {descriptor.grade_descriptor_item.mark_max}
                  </td>
                  <td>
                    <ul>
                      {descriptor.grade_descriptor_item.criterion_list?.map((criterion, cIdx) => (
                        <li key={cIdx}>
                          <strong>{criterion.criteria_name}:</strong> {criterion.criteria_description}
                        </li>
                      ))}
                    </ul>
                  </td>
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
