'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@/app/styles/rubricGen.css';
import CreateRubricPopup from '@/app/components/CreateRubricPopup'; // For creating rubrics
import EditRubricPopup from '@/app/components/EditRubricPopup'; // For editing rubrics
import { GET_RUBRIC, GET_ALL_RUBRICS } from '@/api';

const RubricGen = () => {
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [rubrics, setRubrics] = useState([]); // State to hold the list of rubrics
  const [expandedRubricId, setExpandedRubricId] = useState(null); // To track which rubric is expanded for detailed view
  const [detailedRubrics, setDetailedRubrics] = useState({}); // Store detailed rubrics based on ID
  const [editRubric, setEditRubric] = useState(null); // State for holding rubric to be edited

  const handleOpenCreatePopup = () => {
    setIsCreatePopupOpen(true);
  };

  const handleOpenEditPopup = (rubric) => {
    if (rubric?.rubric_id) {
      console.log('Opening edit popup for rubric:', rubric);  // Log rubric object to ensure rubric_id is present
      setEditRubric(rubric);  // Pass rubric to the edit popup, ensuring rubric_id exists
      setIsEditPopupOpen(true);
    } else {
      console.error('rubric_id is missing when opening edit popup.');
    }
  };

  const handleCloseCreatePopup = (newRubric) => {
    if (newRubric) {
      setRubrics((prevRubrics) => [...prevRubrics, newRubric]); // Add new rubric to the list
    }
    setIsCreatePopupOpen(false);
  };

  const handleCloseEditPopup = (updatedRubric) => {
    if (updatedRubric) {
      setRubrics((prevRubrics) =>
        prevRubrics.map((rubric) =>
          rubric.rubric_id === updatedRubric.rubric_id ? updatedRubric : rubric
        )
      );
    }
    setIsEditPopupOpen(false);
  };

  // Delete rubric functionality
  const handleDeleteRubric = (rubricId) => {
    setRubrics((prevRubrics) => prevRubrics.filter((rubric) => rubric.rubric_id !== rubricId));
    
    setDetailedRubrics((prevDetailedRubrics) => {
      const newDetailedRubrics = { ...prevDetailedRubrics };
      delete newDetailedRubrics[rubricId]; // Remove deleted rubric from detailed view
      return newDetailedRubrics;
    });
  };

  // Fetch all rubrics from the API
  useEffect(() => {
    const fetchAllRubrics = async () => {
      try {
        const response = await axios.get(GET_ALL_RUBRICS('convener1@example.com'));
        console.log('Fetched All Rubrics:', response.data);
        setRubrics(response.data.rubrics);
      } catch (error) {
        console.error('Error fetching rubrics:', error);
        alert('Failed to fetch rubrics.');
      }
    };

    fetchAllRubrics();
  }, []); // Fetch data once when component mounts

  // Fetch detailed rubric data when the user clicks to expand it
  const fetchRubricDetails = async (rubricId) => {
    if (expandedRubricId === rubricId) {
      // If the rubric is already expanded, collapse it
      setExpandedRubricId(null);
      return;
    }

    try {
      const response = await axios.get(GET_RUBRIC(rubricId));
      console.log('Fetched rubric details:', response.data);  // Ensure rubric details are fetched
      
      // Add rubric_id to the detailed rubric object
      const detailedRubricWithId = { ...response.data, rubric_id: rubricId };

      setDetailedRubrics((prevDetailedRubrics) => ({
        ...prevDetailedRubrics,
        [rubricId]: detailedRubricWithId, // Store the detailed rubric with its ID
      }));
      setExpandedRubricId(rubricId);  // Set the expanded rubric to the fetched one
    } catch (error) {
      console.error(`Error fetching rubric ${rubricId} details:`, error);
      alert(`Failed to fetch rubric details for rubric ID: ${rubricId}`);
    }
  };

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

      {/* Render list of rubrics */}
      {rubrics.length > 0 ? (
        rubrics.map((rubric) => (
          <div key={rubric.rubric_id} className="rubric-summary">
            <h3>{rubric.rubric_title}</h3>
            <p>Created By: {rubric.created_by}</p>
            <p>Status: {rubric.rubric_generation_status}</p>
            <button onClick={() => fetchRubricDetails(rubric.rubric_id)}>
              {expandedRubricId === rubric.rubric_id ? 'Hide Details' : 'View Details'}
            </button>

            {/* Render detailed rubric if this is the expanded rubric */}
            {expandedRubricId === rubric.rubric_id && detailedRubrics[rubric.rubric_id] && (
              <div className="rubric-table-container">
                <h2>{detailedRubrics[rubric.rubric_id]?.rubric_title}</h2>
                <table className="rubric-table">
                  <thead>
                    <tr>
                      <th>Grade</th>
                      <th>Mark Range</th>
                      <th>Criteria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(detailedRubrics[rubric.rubric_id]?.grade_descriptors).map(
                      ([grade, descriptor], idx) => (
                        <tr key={idx}>
                          <td>{grade}</td>
                          <td>{descriptor.mark_min} - {descriptor.mark_max}</td>
                          <td>{renderCriteria(descriptor.criterion)}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <button onClick={() => handleOpenEditPopup(detailedRubrics[rubric.rubric_id])}>
                  Edit Rubric
                </button>
                <button onClick={() => handleDeleteRubric(rubric.rubric_id)}>Delete Rubric</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No rubrics available</p>
      )}
    </div>
  );
};

export default RubricGen;
