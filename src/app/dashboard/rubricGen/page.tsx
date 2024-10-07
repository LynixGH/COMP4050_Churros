'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@/app/styles/rubricGen.css';
import CreateRubricPopup from '@/app/components/CreateRubricPopup'; // For creating rubrics
import EditRubricPopup from '@/app/components/EditRubricPopup'; // For editing rubrics
import { GET_RUBRIC, GET_ALL_RUBRICS, DEL_RUBRIC } from '@/api';

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
    // Log the entire rubric object to inspect it before opening the edit popup
    console.log('Opening edit popup for rubric:', rubric);
  
    // Check if the rubric_id is present in the rubric object
    if (!rubric?.rubric_id) {
      console.error('rubric_id is missing in the rubric object:', rubric);
      return;  // Stop here if rubric_id is missing
    }
  
    setEditRubric(rubric);  // Set the rubric object for editing
    setIsEditPopupOpen(true);  // Open the edit popup
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
  const handleDeleteRubric = async (rubricId) => {
    try {
      // Make DELETE request to the backend
      const response = await axios.delete(DEL_RUBRIC(rubricId));
  
      if (response.status === 200) {
        console.log(`Rubric with ID: ${rubricId} successfully deleted.`);
        
        // Update the frontend by removing the deleted rubric
        setRubrics((prevRubrics) => prevRubrics.filter((rubric) => rubric.rubric_id !== rubricId));
        
        // Also remove it from the detailed rubrics view
        setDetailedRubrics((prevDetailedRubrics) => {
          const newDetailedRubrics = { ...prevDetailedRubrics };
          delete newDetailedRubrics[rubricId]; // Remove deleted rubric from detailed view
          return newDetailedRubrics;
        });
      } else {
        console.error(`Failed to delete rubric with ID: ${rubricId}`);
        alert('Failed to delete rubric. Please try again.');
      }
    } catch (error) {
      console.error(`Error deleting rubric with ID: ${rubricId}`, error);
      alert('Error deleting rubric. Please try again.');
    }
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
      setExpandedRubricId(null);  // If already expanded, hide the details
      return;
    }
  
    if (!detailedRubrics[rubricId]) {
      try {
        const response = await axios.get(GET_RUBRIC(rubricId));
        console.log('Fetched rubric details:', response.data);  // Log the entire fetched rubric details
  
        setDetailedRubrics((prevDetailedRubrics) => ({
          ...prevDetailedRubrics,
          [rubricId]: { ...response.data, rubric_id: rubricId },  // Ensure rubric_id is included in the detailed object
        }));
      } catch (error) {
        console.error(`Error fetching rubric ${rubricId} details:`, error);
        alert(`Failed to fetch rubric details for rubric ID: ${rubricId}`);
      }
    }
  
    setExpandedRubricId(rubricId);  // Expand the selected rubric
  };

  // Helper function to render the rubric table based on the criteria and grade descriptions
  const renderRubricTable = (rubricData) => {
    if (!rubricData || !rubricData.grade_descriptors) {
      return <p>No rubric data available</p>;
    }

    // Define the custom order for grades
    const orderedGrades = ['fail', 'pass_', 'credit', 'distinction', 'high_distinction'];

    // Filter out any missing grades in case the API doesn't provide all grades
    const grades = orderedGrades.filter((grade) => rubricData.grade_descriptors[grade]);
    
    // Get the criteria from the first grade that exists
    const criteria = rubricData.grade_descriptors[grades[0]].criterion;

    return (
      <table className="rubric-table">
        <thead>
          <tr>
            <th>Criterion</th>
            {grades.map((grade) => (
              <th key={grade}>{grade.replace('_', ' ').toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {criteria.map((criterion, index) => (
            <tr key={index}>
              {/* Display criterion name */}
              <td>{criterion.criteria_name}</td>
              {/* Display descriptions for each grade */}
              {grades.map((grade) => (
                <td key={grade}>
                  {rubricData.grade_descriptors[grade].criterion[index].criteria_description}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

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
                {/* Render rubric table */}
                {renderRubricTable(detailedRubrics[rubric.rubric_id])}
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
