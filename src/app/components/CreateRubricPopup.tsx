import React, { useState, useEffect } from 'react';
import '@/app/styles/CreateRubricPopup.css';

const CreateRubricPopup = ({ onClose, existingRubric }) => {
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
      setRubric(existingRubric);
    }
  }, [existingRubric]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRubric((prevRubric) => ({
      ...prevRubric,
      [name]: value,
    }));
  };

  // Add new criterion
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

  // Remove criterion
  const removeCriterion = (index) => {
    setRubric((prevRubric) => ({
      ...prevRubric,
      criteria: prevRubric.criteria.filter((_, i) => i !== index),
    }));
  };

  // Add new ULO
  const addULO = () => {
    setRubric((prevRubric) => ({
      ...prevRubric,
      ulos: [...prevRubric.ulos, ''],
    }));
  };

  // Add a single new field (keyword, competency, skill, or knowledge) for a specific criterion
  const addFieldToCriterion = (index, field) => {
    const updatedCriteria = [...rubric.criteria];
    updatedCriteria[index] = {
      ...updatedCriteria[index],
      [field]: [...updatedCriteria[index][field], ''],
    };
    setRubric((prevRubric) => ({
      ...prevRubric,
      criteria: updatedCriteria,
    }));
  };

  // Remove field (keyword, competency, skill, or knowledge)
  const removeFieldFromCriterion = (index, field, fieldIndex) => {
    const updatedCriteria = [...rubric.criteria];
    updatedCriteria[index][field] = updatedCriteria[index][field].filter(
      (_, i) => i !== fieldIndex
    );
    setRubric((prevRubric) => ({
      ...prevRubric,
      criteria: updatedCriteria,
    }));
  };

  // Remove ULO
  const removeULO = (uloIndex) => {
    setRubric((prevRubric) => ({
      ...prevRubric,
      ulos: prevRubric.ulos.filter((_, index) => index !== uloIndex),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose(rubric); // Pass updated rubric back to parent
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
          />

          <label htmlFor="assessment_description">Assessment Description:</label>
          <textarea
            id="assessment_description"
            name="assessment_description"
            value={rubric.assessment_description}
            onChange={handleChange}
          />

          <h3>Criteria</h3>
          {rubric.criteria.map((criterion, index) => (
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
              />
              <button
                type="button"
                onClick={() => removeCriterion(index)}
                className="remove-btn"
              >
                Remove Criterion
              </button>

              <label>Keywords:</label>
              {criterion.keywords.map((keyword, kIndex) => (
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
              {criterion.competencies.map((competency, cIndex) => (
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
              {criterion.skills.map((skill, sIndex) => (
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
              {criterion.knowledge.map((knowledgeItem, kIndex) => (
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
          {rubric.ulos.map((ulo, index) => (
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
          <button type="button" onClick={() => onClose(null)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRubricPopup;
