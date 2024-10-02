'use client';

import React, { useState, useEffect } from 'react';
import '@/app/styles/rubricGen.css';
import CreateRubricPopup from '@/app/components/CreateRubricPopup'; // For creating rubrics
import EditRubricPopup from '@/app/components/EditRubricPopup'; // For editing rubrics

const RubricGen = () => {
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [rubricData, setRubricData] = useState(null); // State to hold fetched rubric data
  const [allRubrics, setAllRubrics] = useState([]); // State to hold all rubrics
  const [editRubric, setEditRubric] = useState(null); // State for holding rubric to be edited

  const handleOpenCreatePopup = () => {
    setIsCreatePopupOpen(true);
  };

  const handleOpenEditPopup = (rubric) => {
    setEditRubric(rubric);
    setIsEditPopupOpen(true);
  };

  const handleCloseCreatePopup = (newRubric) => {
    if (newRubric) {
      setAllRubrics((prevRubrics) => [...prevRubrics, newRubric]); // Add new rubric to the list
    }
    setIsCreatePopupOpen(false);
  };

  const handleCloseEditPopup = (updatedRubric) => {
    if (updatedRubric) {
      setAllRubrics((prevRubrics) =>
        prevRubrics.map((rubric) =>
          rubric.rubric_title === updatedRubric.rubric_title ? updatedRubric : rubric
        )
      ); // Update the edited rubric
    }
    setIsEditPopupOpen(false);
  };

  // Delete a rubric
  const handleDeleteRubric = (rubricTitle) => {
    setAllRubrics((prevRubrics) =>
      prevRubrics.filter((rubric) => rubric.rubric_title !== rubricTitle)
    );
  };

  useEffect(() => {
    // Sample data
    const sampleRubric = {
      rubric_title: "COMP3250 Computer Networks Assignment 1",
      ulo_list: [
        {
          ulo_item: "Demonstrate an understanding of advanced knowledge in networking (especially in Internet technologies) and be able to communicate this knowledge to wider audience",
        },
        {
          ulo_item: "Design TCP/IP based networks and protocols and to integrate such networks with other networking technologies",
        },
        {
          ulo_item: "Have a working knowledge of practical advanced networking and write professional documentation",
        },
        {
          ulo_item: "Demonstrate an understanding of security issues in computer networking.",
        },
        {
          ulo_item: "Engage in independent professional work with a high level of autonomy and accountability.",
        },
      ],
      grade_descriptor_list: [
        {
          grade_descriptor_item: {
            grade_descriptor_name: "Fail",
            mark_min: 0,
            mark_max: 49,
            criterion_list: [
              {
                criteria_name: "Correctness",
                criteria_description: "Significant inaccuracies, little understanding of key concepts, incorrect solutions.",
              },
              {
                criteria_name: "Critical Thinking (Explanation/Analysis)",
                criteria_description: "Limited analysis of scenarios, relies on surface-level thinking.",
              },
              {
                criteria_name: "Communication and Presentation",
                criteria_description: "Frequent grammatical errors, lack of clarity in explanations, does not adhere to the word limit.",
              },
              {
                criteria_name: "Referencing",
                criteria_description: "Poor or no use of referencing style, lacks in-text citations, reference list missing.",
              },
            ],
          },
        },
        {
          grade_descriptor_item: {
            grade_descriptor_name: "Pass",
            mark_min: 50,
            mark_max: 64,
            criterion_list: [
              {
                criteria_name: "Correctness",
                criteria_description: "Addresses most aspects of the questions accurately with some understanding of key concepts.",
              },
              {
                criteria_name: "Critical Thinking (Explanation/Analysis)",
                criteria_description: "Basic analysis provided, some depth of understanding shown.",
              },
              {
                criteria_name: "Communication and Presentation",
                criteria_description: "Minor grammatical errors, generally clear explanations, adheres to the word limit.",
              },
              {
                criteria_name: "Referencing",
                criteria_description: "Basic application of referencing style, some in-text citations, reference list present but may have errors.",
              },
            ],
          },
        },
        {
          grade_descriptor_item: {
            grade_descriptor_name: "Credit",
            mark_min: 65,
            mark_max: 74,
            criterion_list: [
              {
                criteria_name: "Correctness",
                criteria_description: "Accurately addresses all aspects of questions, demonstrates understanding of key concepts.",
              },
              {
                criteria_name: "Critical Thinking (Explanation/Analysis)",
                criteria_description: "Good analysis of scenarios, demonstrates some insight into subject matter.",
              },
              {
                criteria_name: "Communication and Presentation",
                criteria_description: "Clear explanations, few grammatical errors, adheres to word limit.",
              },
              {
                criteria_name: "Referencing",
                criteria_description: "Correct application of referencing style, appropriate in-text citations, accurate reference list.",
              },
            ],
          },
        },
        {
          grade_descriptor_item: {
            grade_descriptor_name: "Distinction",
            mark_min: 75,
            mark_max: 84,
            criterion_list: [
              {
                criteria_name: "Correctness",
                criteria_description: "Comprehensively addresses all aspects of questions, demonstrates thorough understanding of concepts.",
              },
              {
                criteria_name: "Critical Thinking (Explanation/Analysis)",
                criteria_description: "Insightful analysis and evaluation of scenarios, shows depth of understanding.",
              },
              {
                criteria_name: "Communication and Presentation",
                criteria_description: "Well-organized explanations, minimal grammatical errors, adheres to word limit.",
              },
              {
                criteria_name: "Referencing",
                criteria_description: "Detailed application of referencing style, precise in-text citations, comprehensive reference list.",
              },
            ],
          },
        },
        {
          grade_descriptor_item: {
            grade_descriptor_name: "High Distinction",
            mark_min: 85,
            mark_max: 100,
            criterion_list: [
              {
                criteria_name: "Correctness",
                criteria_description: "Thorough and accurate responses to all questions, demonstrates exceptional understanding of key concepts.",
              },
              {
                criteria_name: "Critical Thinking (Explanation/Analysis)",
                criteria_description: "Highly insightful analysis, shows exceptional depth of understanding and critical evaluation.",
              },
              {
                criteria_name: "Communication and Presentation",
                criteria_description: "Professional standard of writing, highly coherent explanations, strictly adheres to word limit.",
              },
              {
                criteria_name: "Referencing",
                criteria_description: "Exemplary application of referencing style, flawless in-text citations, fully and accurately compiled reference list.",
              },
            ],
          },
        },
      ],
    };

    // Set this sample rubric as initial data
    setAllRubrics([sampleRubric]);
  }, []);

  return (
    <div className="rubric-dashboard">
      <button onClick={handleOpenCreatePopup}>Create New Rubric</button>

      {isCreatePopupOpen && <CreateRubricPopup onClose={handleCloseCreatePopup} />}

      {isEditPopupOpen && editRubric && (
        <EditRubricPopup onClose={handleCloseEditPopup} existingRubric={editRubric} />
      )}

      {/* Render Rubric Data */}
      {allRubrics.length > 0 ? (
        allRubrics.map((rubric, index) => (
          <div key={index} className="rubric-table-container">
            <h2>{rubric.rubric_title}</h2>

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
                {rubric.grade_descriptor_list?.map((descriptor, idx) => (
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

            <button onClick={() => handleOpenEditPopup(rubric)}>Edit Rubric</button>
            <button onClick={() => handleDeleteRubric(rubric.rubric_title)}>Delete Rubric</button>
          </div>
        ))
      ) : (
        <p>No rubrics available</p>
      )}
    </div>
  );
};

export default RubricGen;
