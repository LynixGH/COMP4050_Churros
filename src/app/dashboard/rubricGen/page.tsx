'use client';

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import '@/app/styles/rubricGen.css'; // Import your styles
import CreateRubricPopup from '@/app/components/CreateRubricPopup'; // Import the CreateRubricPopup component
import axios from 'axios';

const RubricGen = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [rubricData, setRubricData] = useState(null); // State to hold fetched rubric data
  const [editRubric, setEditRubric] = useState(null); // State for holding rubric to be edited
  const API_URL = 'http://54.206.102.192/rubrics'; // Update with correct endpoint

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = (updatedRubric) => {
    if (updatedRubric) {
      setRubricData(updatedRubric); // Update the rubric with the new or edited data
    }
    setIsPopupOpen(false);
    setEditRubric(null); // Reset editing state
  };

  useEffect(() => {
    // Simulate a GET request to fetch rubric data
    const fetchRubric = async () => {
      try {
        const response = await axios.get(API_URL);
        setRubricData(response.data); // Set the fetched data
      } catch (error) {
        console.error('Error fetching rubric data:', error);

        // Simulate rubric data as a fallback since the API is down
        const sampleRubric = {
          staff_email: 'john.doe@example.com',
          assessment_description:
            'This assessment tests knowledge of process management, memory management, and file systems in operating systems.',
          criteria: [
            {
              criterion: 'Process Management',
              keywords: ['processes', 'scheduling', 'multithreading'],
              competencies: ['understanding of process lifecycle'],
              skills: ['solve synchronization issues'],
              knowledge: ['scheduling algorithms', 'process synchronization'],
            },
            {
              criterion: 'Memory Management',
              keywords: ['virtual memory', 'paging', 'segmentation'],
              competencies: ['memory allocation strategies'],
              skills: ['apply virtual memory concepts'],
              knowledge: ['paging', 'memory allocation'],
            },
            {
              criterion: 'File Systems',
              keywords: ['file system architecture', 'file allocation'],
              competencies: ['file system design'],
              skills: ['optimize file systems'],
              knowledge: ['file allocation methods', 'disk scheduling'],
            },
          ],
          ulos: [
            'ULO1: Understand core OS concepts like process, memory, and file systems.',
            'ULO2: Apply OS algorithms to solve problems.',
            'ULO3: Critically evaluate OS architectures.',
            'ULO4: Solve OS concurrency and synchronization problems.',
          ],
        };

        // Set the sample rubric data
        setRubricData(sampleRubric);
      }
    };

    fetchRubric();
  }, []);

  // Handle delete functionality
  const handleDeleteRubric = () => {
    setRubricData(null); // Remove the rubric from state
  };

  // Handle edit functionality
  const handleEditRubric = () => {
    setEditRubric(rubricData); // Set the current rubric data to edit
    setIsPopupOpen(true); // Open popup with pre-filled data
  };

  return (
    <div className="rubric-dashboard">
      <button onClick={handleOpenPopup}>Create New Rubric</button>

      {isPopupOpen && (
        <CreateRubricPopup
          onClose={handleClosePopup}
          existingRubric={editRubric} // Pass the rubric to edit if in edit mode
        />
      )}

      <h2>Generated Rubrics</h2>
      <div className="rubric-section">
        {rubricData ? (
          <div className="rubric-display">
            <h3>Assessment Description</h3>
            <p>{rubricData.assessment_description}</p>

            <h3>Criteria</h3>
            {rubricData.criteria && rubricData.criteria.length > 0 ? (
              rubricData.criteria.map((criterion, index) => (
                <div key={index} className="criterion-item">
                  <h4>{criterion.criterion}</h4>
                  <p>
                    <strong>Keywords:</strong> {criterion.keywords.join(', ')}
                  </p>
                  <p>
                    <strong>Competencies:</strong> {criterion.competencies.join(', ')}
                  </p>
                  <p>
                    <strong>Skills:</strong> {criterion.skills.join(', ')}
                  </p>
                  <p>
                    <strong>Knowledge:</strong> {criterion.knowledge.join(', ')}
                  </p>
                </div>
              ))
            ) : (
              <p>No criteria available.</p>
            )}

            <h3>Unit Learning Outcomes (ULOs)</h3>
            <ul>
              {rubricData.ulos && rubricData.ulos.length > 0 ? (
                rubricData.ulos.map((ulo, index) => <li key={index}>{ulo}</li>)
              ) : (
                <p>No ULOs available.</p>
              )}
            </ul>

            {/* Add Edit and Delete buttons */}
            <button onClick={handleEditRubric} className="edit-btn">
              Edit Rubric
            </button>
            <button onClick={handleDeleteRubric} className="delete-btn">
              Delete Rubric
            </button>
          </div>
        ) : (
          <p>No rubrics available yet.</p>
        )}
      </div>
    </div>
  );
};

export default RubricGen;
