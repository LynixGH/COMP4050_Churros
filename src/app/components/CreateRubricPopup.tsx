import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@/app/styles/CreateRubricPopup.css';
import { GENERATE_RUBRIC } from '@/api';

// Define an interface for the props
interface CreateRubricPopupProps {
  onClose: () => void;
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

  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    if (existingRubric) {
      setRubric({
        staff_email: existingRubric.staff_email || '',
        assessment_description: existingRubric.assessment_description || '',
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

  const removeFieldFromCriterion = (
    index: number,
    field: keyof typeof rubric.criteria[0],
    fieldIndex: number
  ) => {
    const updatedCriteria = [...rubric.criteria];
  
    // Check if the field is an array before using filter
    if (Array.isArray(updatedCriteria[index][field])) {
      updatedCriteria[index][field] = (updatedCriteria[index][field] as string[]).filter(
        (_, i) => i !== fieldIndex
      ) as any; // This ensures we cast it to the correct type
    }
  
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
    setLoading(true); // Start loading
    try {
      const response = await axios.post(GENERATE_RUBRIC, rubric);
      if (response.status === 200) {
        alert('Rubric submitted successfully!');
        onClose(); // Close the form after submission
        window.location.reload();
      }
    } catch (error) {
      console.error('Error submitting rubric:', error);
      alert('Failed to submit rubric. Please try again.');
    } finally {
      setLoading(false); // End loading
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
            disabled={loading}
          />

          <label htmlFor="assessment_description">Assessment Description:</label>
          <textarea
            id="assessment_description"
            name="assessment_description"
            value={rubric.assessment_description}
            onChange={handleChange}
            required
            disabled={loading}
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
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => removeCriterion(index)}
                className="remove-btn"
                disabled={loading}
              >
                Remove Criterion
              </button>

              {/* Keywords */}
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
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="remove-btn-small"
                    onClick={() => removeFieldFromCriterion(index, 'keywords', kIndex)}
                    disabled={loading}
                  >
                    Remove Keyword
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addFieldToCriterion(index, 'keywords')}
                disabled={loading}
              >
                Add Keyword
              </button>

              {/* Competencies */}
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
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="remove-btn-small"
                    onClick={() => removeFieldFromCriterion(index, 'competencies', cIndex)}
                    disabled={loading}
                  >
                    Remove Competency
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addFieldToCriterion(index, 'competencies')}
                disabled={loading}
              >
                Add Competency
              </button>

              {/* Skills */}
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
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="remove-btn-small"
                    onClick={() => removeFieldFromCriterion(index, 'skills', sIndex)}
                    disabled={loading}
                  >
                    Remove Skill
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addFieldToCriterion(index, 'skills')}
                disabled={loading}
              >
                Add Skill
              </button>

              {/* Knowledge */}
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
                   disabled={loading}
                 />
                 <button
                   type="button"
                   className="remove-btn-small"
                   onClick={() => removeFieldFromCriterion(index, 'knowledge', kIndex)}
                   disabled={loading}
                 >
                   Remove Knowledge
                 </button>
               </div>
             ))}
             <button
               type="button"
               onClick={() => addFieldToCriterion(index, 'knowledge')}
               disabled={loading}
             >
               Add Knowledge
             </button>
           </div>
         ))}
         <button type="button" onClick={addCriterion} disabled={loading}>
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
               disabled={loading}
             />
             <button
               type="button"
               className="remove-btn-small"
               onClick={() => removeULO(index)}
               disabled={loading}
             >
               Remove ULO
             </button>
           </div>
         ))}
         <button type="button" onClick={addULO} disabled={loading}>
           Add ULO
         </button>

         <button type="submit" disabled={loading}>
           {loading ? 'Submitting...' : 'Submit'}
         </button>
         <button type="button" onClick={() => onClose()} disabled={loading}>
           Cancel
         </button>
       </form>
     </div>
   </div>
 );
};

export default CreateRubricPopup;
