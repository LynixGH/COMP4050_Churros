'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@/app/styles/rubricGen.css';
import CreateRubricPopup from '@/app/components/CreateRubricPopup';
import EditRubricPopup from '@/app/components/EditRubricPopup';
import ConvertMarkingGuidePopup from '@/app/components/ConvertMarkingGuidePopup'; // Import the new component
import { GET_RUBRIC, GET_ALL_RUBRICS, DEL_RUBRIC, GET_PDF_RUBRIC, GET_XLS_RUBRIC } from '@/api';

// Define the Rubric interface
interface Rubric {
  rubric_id: string; // Assuming ID is a string; change to number if applicable
  rubric_title: string;
  created_by: string;
  rubric_generation_status: string;
}

// Define the Criterion interface
interface Criterion {
  criteria_name: string;
  criteria_description: string;
}

// Define the ExistingRubric interface
interface ExistingRubric {
  rubric_id: number | null;
  rubric_title: string;
  ulo_list: any;
  grade_descriptors: any;
}

const RubricGen = () => {
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isConvertPopupOpen, setIsConvertPopupOpen] = useState(false); // New state for ConvertMarkingGuidePopup
  const [rubrics, setRubrics] = useState<Rubric[]>([]); // State to hold the list of rubrics
  const [expandedRubricId, setExpandedRubricId] = useState<string | null>(null); // To track which rubric is expanded for detailed view
  const [detailedRubrics, setDetailedRubrics] = useState<{ [key: string]: any }>({}); // Store detailed rubrics based on ID
  const [editRubric, setEditRubric] = useState<ExistingRubric | null>(null); // State for holding rubric to be edited

  const handleOpenCreatePopup = () => {
    setIsCreatePopupOpen(true);
  };

  const handleOpenEditPopup = (rubric: ExistingRubric) => {
    console.log('Opening edit popup for rubric:', rubric);
    setEditRubric(rubric);
    setIsEditPopupOpen(true);
  };

  const handleCloseCreatePopup = (newRubric: Rubric | null) => {
    if (newRubric) {
      setRubrics((prevRubrics) => [...prevRubrics, newRubric]); // Add new rubric to the list
    }
    setIsCreatePopupOpen(false);
  };

  const mapExistingRubricToRubric = (existingRubric: ExistingRubric): Rubric => {
    return {
      rubric_id: existingRubric.rubric_id?.toString() || '',
      rubric_title: existingRubric.rubric_title,
      created_by: '',
      rubric_generation_status: '',
    };
  };

  const handleCloseEditPopup = (updatedRubric: ExistingRubric | null) => {
    if (updatedRubric) {
      const mappedRubric = mapExistingRubricToRubric(updatedRubric);
      setRubrics((prevRubrics) =>
        prevRubrics.map((rubric) =>
          rubric.rubric_id === mappedRubric.rubric_id ? mappedRubric : rubric
        )
      );
    }
    setIsEditPopupOpen(false);
  };

  // Delete rubric functionality
  const handleDeleteRubric = async (rubricId: string) => {
    try {
      const response = await axios.delete(DEL_RUBRIC(Number(rubricId)));

      if (response.status === 200) {
        alert(`Rubric with ID: ${rubricId} successfully deleted.`);
        setRubrics((prevRubrics) => prevRubrics.filter((rubric) => rubric.rubric_id !== rubricId));
        setDetailedRubrics((prevDetailedRubrics) => {
          const newDetailedRubrics = { ...prevDetailedRubrics };
          delete newDetailedRubrics[rubricId];
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
  }, []);

  // Fetch detailed rubric data when the user clicks to expand it
  const fetchRubricDetails = async (rubricId: string) => {
    if (expandedRubricId === rubricId) {
      setExpandedRubricId(null);
      return;
    }

    if (!detailedRubrics[rubricId]) {
      try {
        const response = await axios.get(GET_RUBRIC(Number(rubricId)));
        console.log('Fetched rubric details:', response.data);
        setDetailedRubrics((prevDetailedRubrics) => ({
          ...prevDetailedRubrics,
          [rubricId]: { ...response.data, rubric_id: rubricId },
        }));
      } catch (error) {
        console.error(`Error fetching rubric ${rubricId} details:`, error);
        alert(`Failed to fetch rubric details for rubric ID: ${rubricId}`);
      }
    }

    setExpandedRubricId(rubricId);
  };

  // Helper function to render the rubric table based on the criteria and grade descriptions
  const renderRubricTable = (rubricData: any) => {
    if (!rubricData || !rubricData.grade_descriptors) {
      return <p>No rubric data available</p>;
    }

    const orderedGrades = ['fail', 'pass_', 'credit', 'distinction', 'high_distinction'];
    const grades = orderedGrades.filter((grade) => rubricData.grade_descriptors[grade]);

    const criteria: Criterion[] = rubricData.grade_descriptors[grades[0]].criterion;

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
              <td>{criterion.criteria_name}</td>
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

  const handleExport = async (rubricId: string, format: 'PDF' | 'XLS') => {
    try {
      let exportEndpoint: string | undefined;

      // Set the export endpoint based on the format
      if (format === 'PDF') {
        exportEndpoint = GET_PDF_RUBRIC(Number(rubricId));
      } else if (format === 'XLS') {
        exportEndpoint = GET_XLS_RUBRIC(Number(rubricId));
      }

      if (!exportEndpoint) {
        throw new Error('Export endpoint is undefined');
      }

      const response = await axios.get(exportEndpoint, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rubric_${rubricId}.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error exporting rubric ID ${rubricId} as ${format}`, error);
      alert(`Failed to export rubric as ${format}. Please try again.`);
    }
  };

  return (
    <div className="rubric-dashboard">
      <button onClick={handleOpenCreatePopup}>Create New Rubric</button>
      <button onClick={() => setIsConvertPopupOpen(true)}>Convert Marking Guide</button> {/* Button for the new popup */}

      {isCreatePopupOpen && <CreateRubricPopup onClose={handleCloseCreatePopup} />}
      {isEditPopupOpen && editRubric && <EditRubricPopup onClose={handleCloseEditPopup} existingRubric={editRubric} />}
      {isConvertPopupOpen && <ConvertMarkingGuidePopup onClose={() => setIsConvertPopupOpen(false)} />} {/* New popup */}

      {rubrics.length > 0 ? (
        rubrics.map((rubric) => (
          <div key={rubric.rubric_id} className="rubric-summary">
                        <h3>{rubric.rubric_title}</h3>
            <p>Created By: {rubric.created_by}</p>
            <p>Status: {rubric.rubric_generation_status}</p>
            <button onClick={() => fetchRubricDetails(rubric.rubric_id)}>
              {expandedRubricId === rubric.rubric_id ? 'Hide Details' : 'View Details'}
            </button>

            {expandedRubricId === rubric.rubric_id && detailedRubrics[rubric.rubric_id] && (
              <div className="rubric-table-container">
                <h2>{detailedRubrics[rubric.rubric_id]?.rubric_title}</h2>
                {renderRubricTable(detailedRubrics[rubric.rubric_id])}

                <button onClick={() => handleOpenEditPopup(detailedRubrics[rubric.rubric_id])}>
                  Edit Rubric
                </button>
                <button onClick={() => handleDeleteRubric(rubric.rubric_id)}>Delete Rubric</button>
                <button onClick={() => handleExport(rubric.rubric_id, 'PDF')}>Export to PDF</button>
                <button onClick={() => handleExport(rubric.rubric_id, 'XLS')}>Export to XLS</button>
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