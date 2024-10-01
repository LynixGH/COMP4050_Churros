import React, { useState } from 'react';
import axios from 'axios';
import '@/app/styles/CreateRubricPopup.css'; // Update CSS as necessary

interface CreateRubricPopupProps {
  onClose: () => void;
}

const CreateRubricPopup: React.FC<CreateRubricPopupProps> = ({ onClose }) => {
  const [staffEmail, setStaffEmail] = useState('');
  const [assessmentDescription, setAssessmentDescription] = useState('');
  const [criteria, setCriteria] = useState([
    { criterion: '', keywords: [''], competencies: [''], skills: [''], knowledge: [''] },
  ]);
  const [ulos, setUlos] = useState(['']);

  // Handle criterion field change
  const handleCriterionChange = (index: number, field: string, value: string) => {
    const updatedCriteria = [...criteria];
    updatedCriteria[index] = { ...updatedCriteria[index], [field]: value };
    setCriteria(updatedCriteria);
  };

  // Handle array field changes (keywords, competencies, skills, knowledge)
  const handleArrayChange = (index: number, field: string, subIndex: number, value: string) => {
    const updatedCriteria = [...criteria];
    updatedCriteria[index][field][subIndex] = value;
    setCriteria(updatedCriteria);
  };

  // Add or remove entries in array fields (keywords, competencies, skills, knowledge)
  const addArrayItem = (index: number, field: string) => {
    const updatedCriteria = [...criteria];
    updatedCriteria[index][field] = [...updatedCriteria[index][field], ''];
    setCriteria(updatedCriteria);
  };

  const removeArrayItem = (index: number, field: string, subIndex: number) => {
    const updatedCriteria = [...criteria];
    updatedCriteria[index][field] = updatedCriteria[index][field].filter((_, i) => i !== subIndex);
    setCriteria(updatedCriteria);
  };

  // Add and remove criteria
  const addCriterion = () => {
    setCriteria([...criteria, { criterion: '', keywords: [''], competencies: [''], skills: [''], knowledge: [''] }]);
  };

  const removeCriterion = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  // Handle ULO changes
  const handleUloChange = (index: number, value: string) => {
    const updatedUlos = [...ulos];
    updatedUlos[index] = value;
    setUlos(updatedUlos);
  };

  // Add or remove ULOs
  const addUlo = () => setUlos([...ulos, '']);
  const removeUlo = (index: number) => setUlos(ulos.filter((_, i) => i !== index));

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rubricData = {
      staff_email: staffEmail,
      assessment_description: assessmentDescription,
      criteria,
      ulos,
    };

    try {
      await axios.post('http://54.206.102.192/generate_rubric', rubricData);
      alert('Rubric uploaded successfully');
      onClose(); // Close the popup after submission
    } catch (error) {
      console.error('Failed to upload rubric', error);
      alert('Error uploading rubric');
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-content">
        <h2>Create Rubric</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Staff Email:
            <input
              type="email"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Assessment Description:
            <textarea
              value={assessmentDescription}
              onChange={(e) => setAssessmentDescription(e.target.value)}
              required
            />
          </label>

          <h3>Criteria</h3>
          {criteria.map((criterion, index) => (
            <div key={index} className="criterion-section">
              <label>
                Criterion:
                <input
                  type="text"
                  value={criterion.criterion}
                  onChange={(e) => handleCriterionChange(index, 'criterion', e.target.value)}
                  required
                />
              </label>

              <h4>Keywords</h4>
              {criterion.keywords.map((keyword, subIndex) => (
                <div key={subIndex} className="keyword-field">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => handleArrayChange(index, 'keywords', subIndex, e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => removeArrayItem(index, 'keywords', subIndex)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem(index, 'keywords')}>
                Add Keyword
              </button>

              <h4>Competencies</h4>
              {criterion.competencies.map((competency, subIndex) => (
                <div key={subIndex} className="competency-field">
                  <input
                    type="text"
                    value={competency}
                    onChange={(e) => handleArrayChange(index, 'competencies', subIndex, e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => removeArrayItem(index, 'competencies', subIndex)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem(index, 'competencies')}>
                Add Competency
              </button>

              <h4>Skills</h4>
              {criterion.skills.map((skill, subIndex) => (
                <div key={subIndex} className="skill-field">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayChange(index, 'skills', subIndex, e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => removeArrayItem(index, 'skills', subIndex)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem(index, 'skills')}>
                Add Skill
              </button>

              <h4>Knowledge</h4>
              {criterion.knowledge.map((knowledgeItem, subIndex) => (
                <div key={subIndex} className="knowledge-field">
                  <input
                    type="text"
                    value={knowledgeItem}
                    onChange={(e) => handleArrayChange(index, 'knowledge', subIndex, e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => removeArrayItem(index, 'knowledge', subIndex)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem(index, 'knowledge')}>
                Add Knowledge
              </button>

              <button type="button" onClick={() => removeCriterion(index)}>Remove Criterion</button>
            </div>
          ))}
          <button type="button" onClick={addCriterion}>Add Criterion</button>

          <h3>ULOs</h3>
          {ulos.map((ulo, index) => (
            <div key={index} className="ulo-section">
              <label>
                ULO:
                <input
                  type="text"
                  value={ulo}
                  onChange={(e) => handleUloChange(index, e.target.value)}
                  required
                />
              </label>
              <button type="button" onClick={() => removeUlo(index)}>Remove ULO</button>
            </div>
          ))}
          <button type="button" onClick={addUlo}>Add ULO</button>

          <button type="submit">Create Rubric</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CreateRubricPopup;
