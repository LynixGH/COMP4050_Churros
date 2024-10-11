'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@/app/styles/CreateRubricPopup.css';
import { GENERATE_RUBRIC } from '@/api';

// Define an interface for the props
interface CreateRubricPopupProps {
  onClose: () => void; // Define onClose as a function with no arguments
  existingRubric?: {
    staff_email?: string;
    assessment_description?: string;
    criteria?: {
      criterion: string;
      keywords: string[];
      competencies: string[];
      skills: string[];
      knowledge: string[];
    }[];
    ulos?: string[];
  };
}

const CreateRubricPopup: React.FC<CreateRubricPopupProps> = ({
  onClose,
  existingRubric,
}) => {
  const [rubric, setRubric] = useState({
    staff_email: '',
    assessment_description: '',
    criteria: [
      {
        criterion: '',
        keywords: [''],
        competencies: [''],
        skills: [''],
        knowledge: [''],
      },
    ],
    ulos: [''],
  });

  useEffect(() => {
    if (existingRubric) {
      setRubric({
        staff_email: existingRubric.staff_email || '', // Ensure it's always a string
        assessment_description: existingRubric.assessment_description || '', // Ensure it's always a string
        criteria: existingRubric.criteria || [
          {
            criterion: '',
            keywords: [''],
            competencies: [''],
            skills: [''],
            knowledge: [''],
          },
        ],
        ulos: existingRubric.ulos || [''],
      });
    }
  }, [existingRubric]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRubric((prevRubric) => ({
      ...prevRubric,
      [name]: value,
    }));
  };

  const addCriterion = () => {
    setRubric((prevRubric) => ({
      ...prevRubric,
      criteria: [
        ...prevRubric.criteria,
        {
          criterion: '',
          keywords: [''],
          competencies: [''],
          skills: [''],
          knowledge: [''],
        },
      ],
    }));
  };

  const removeCriterion = (index: number) => {
    setRubric((prevRubric) => ({
      ...prevRubric,
      criteria: prevRubric.criteria.filter((_, i) => i !== index),
    }));
  };

  const addULO = () => {
    setRubric((prevRubric) => ({
      ...prevRubric,
      ulos: [...prevRubric.ulos, ''],
    }));
  };

  const addFieldToCriterion = (index: number, field: keyof typeof rubric.criteria[0]) => {
    const updatedCriteria = [...rubric.criteria];
    updatedCriteria[index] = {
      ...updatedCriteria[index],
      [field]: [...(updatedCriteria[index][field] as string[]), ''], // Cast to string[]
    };
    setRubric((prevRubric) => ({
      ...prevRubric,
      criteria: updatedCriteria,
    }));
  };
  

  const removeFieldFromCriterion = (index: number, field: keyof typeof rubric.criteria[0], fieldIndex: number) => {
    const updatedCriteria = [...rubric.criteria];
    updatedCriteria[index][field] = updatedCriteria[index][field].filter(
      (_, i) => i !== fieldIndex
    );
    setRubric((prevRubric) => ({
      ...prevRubric,
      criteria: updatedCriteria,
    }));
  };

  const removeULO = (uloIndex: number) => {
    setRubric((prevRubric) => ({
      ...prevRubric,
      ulos: prevRubric.ulos.filter((_, index) => index !== uloIndex),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(GENERATE_RUBRIC, rubric);
      if (response.status === 200) {
        console.log('Rubric submitted successfully!');
        onClose(); // Close the form after submission
      }
    } catch (error) {
      console.error('Error submitting rubric:', error);
      alert('Failed to submit rubric. Please try again.');
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-content">
        <h2>{existingRubric ? 'Edit Rubric' : 'Create New Rubric'}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="staff_email">Staff Email:</label>
          <input
            type="email"
            id="staff_email"
            name="staff_email"
            value={rubric.staff_email}
            onChange={handleChange}
            required
          />

          <label htmlFor="assessment_description">Assessment Description:</label>
          <textarea
            id="assessment_description"
            name="assessment_description"
            value={rubric.assessment_description}
            onChange={handleChange}
            required
          />

          <h3>Criteria</h3>
          {rubric.criteria?.map((criterion, index) => (
            <div key={index} className="criterion-section">
              <label>Criterion {index + 1}:</label>
              <input
                type="text"
                name={`criterion-${index}`}
                value={criterion.criterion}
                onChange={(e) => {
                  const updatedCriteria = [...rubric.criteria];
                  updatedCriteria[index].criterion = e.target.value;
                  setRubric({ ...rubric, criteria: updatedCriteria });
                }}
                required
              />
              <button
                type="button"
                onClick={() => removeCriterion(index)}
                className="remove-btn"
              >
                Remove Criterion
              </button>

              <label>Keywords:</label>
              {criterion.keywords?.map((keyword, kIndex) => (
                <div key={kIndex} className="field-row">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => {
                      const updatedKeywords = [...rubric.criteria[index].keywords];
                      updatedKeywords[kIndex] = e.target.value;
                      const updatedCriteria = [...rubric.criteria];
                      updatedCriteria[index].keywords = updatedKeywords;
                      setRubric({ ...rubric, criteria: updatedCriteria });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeFieldFromCriterion(index, 'keywords', kIndex)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addFieldToCriterion(index, 'keywords')}
              >
                Add Keyword
              </button>

              <label>Competencies:</label>
              {criterion.competencies?.map((competency, cIndex) => (
                <div key={cIndex} className="field-row">
                  <input
                    type="text"
                    value={competency}
                    onChange={(e) => {
                      const updatedCompetencies = [...rubric.criteria[index].competencies];
                      updatedCompetencies[cIndex] = e.target.value;
                      const updatedCriteria = [...rubric.criteria];
                      updatedCriteria[index].competencies = updatedCompetencies;
                      setRubric({ ...rubric, criteria: updatedCriteria });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      removeFieldFromCriterion(index, 'competencies', cIndex)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addFieldToCriterion(index, 'competencies')}
              >
                Add Competency
              </button>

              <label>Skills:</label>
              {criterion.skills?.map((skill, sIndex) => (
                <div key={sIndex} className="field-row">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => {
                      const updatedSkills = [...rubric.criteria[index].skills];
                      updatedSkills[sIndex] = e.target.value;
                      const updatedCriteria = [...rubric.criteria];
                      updatedCriteria[index].skills = updatedSkills;
                      setRubric({ ...rubric, criteria: updatedCriteria });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeFieldFromCriterion(index, 'skills', sIndex)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addFieldToCriterion(index, 'skills')}>
                Add Skill
              </button>

              <label>Knowledge:</label>
              {criterion.knowledge?.map((knowledgeItem, kIndex) => (
                <div key={kIndex} className="field-row">
                  <input
                    type="text"
                    value={knowledgeItem}
                    onChange={(e) => {
                      const updatedKnowledge = [...rubric.criteria[index].knowledge];
                      updatedKnowledge[kIndex] = e.target.value;
                      const updatedCriteria = [...rubric.criteria];
                      updatedCriteria[index].knowledge = updatedKnowledge;
                      setRubric({ ...rubric, criteria: updatedCriteria });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      removeFieldFromCriterion(index, 'knowledge', kIndex)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addFieldToCriterion(index, 'knowledge')}>
                Add Knowledge
              </button>
            </div>
          ))}
          <button type="button" onClick={addCriterion}>
            Add Criterion
          </button>

          <h3>Unit Learning Outcomes (ULOs)</h3>
          {rubric.ulos?.map((ulo, index) => (
            <div key={index} className="field-row">
              <input
                type="text"
                value={ulo}
                onChange={(e) => {
                  const updatedUlos = [...rubric.ulos];
                  updatedUlos[index] = e.target.value;
                  setRubric({ ...rubric, ulos: updatedUlos });
                }}
              />
              <button type="button" onClick={() => removeULO(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addULO}>
            Add ULO
          </button>

          <button type="submit">Submit</button>
          <button type="button" onClick={() => onClose()}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRubricPopup;
