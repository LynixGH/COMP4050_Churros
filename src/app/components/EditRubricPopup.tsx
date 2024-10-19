import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@/app/styles/EditRubricPopup.css'; // Make sure the CSS file is created and styled accordingly
import { UPDATE_RUBRIC } from '@/api';

// Define an interface for the component's props
interface Ulo {
  ulo_item: string;
}

interface Criterion {
  criteria_name: string;
  criteria_description: string;
}

interface GradeDescriptor {
  mark_min: number;
  mark_max: number;
  criterion: Criterion[];
}

interface ExistingRubric {
  rubric_id: number | null;
  rubric_title: string;
  ulo_list: Ulo[];
  grade_descriptors: {
    [key: string]: GradeDescriptor;
  };
}

interface EditRubricPopupProps {
  onClose: (updatedRubric: ExistingRubric | null) => void;
  existingRubric: ExistingRubric | null;
}

const EditRubricPopup: React.FC<EditRubricPopupProps> = ({ onClose, existingRubric }) => {
  const [rubric, setRubric] = useState<ExistingRubric>({
    rubric_id: existingRubric?.rubric_id || null,  // Ensure rubric_id is present
    rubric_title: existingRubric?.rubric_title || '',
    ulo_list: existingRubric?.ulo_list || [],  // Ensure ulo_list is initialized
    grade_descriptors: existingRubric?.grade_descriptors || {}, // Ensure grade_descriptors is initialized
  });

  useEffect(() => {
    if (existingRubric) {
      setRubric({
        rubric_id: existingRubric.rubric_id || null,
        rubric_title: existingRubric.rubric_title || '',
        ulo_list: existingRubric.ulo_list || [],
        grade_descriptors: existingRubric.grade_descriptors || {},
      });
    }
  }, [existingRubric]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRubric((prevRubric) => ({
      ...prevRubric,
      [name]: value,
    }));
  };

  const handleUloChange = (index: number, value: string) => {
    const updatedUlos = [...rubric.ulo_list];
    updatedUlos[index].ulo_item = value;
    setRubric((prevRubric) => ({ ...prevRubric, ulo_list: updatedUlos }));
  };

  const handleDescriptorChange = (
    grade: string,
    name: keyof Omit<GradeDescriptor, 'criterion'>, // Only handle 'mark_min' and 'mark_max' here
    value: string | number
  ) => {
    const updatedDescriptors = { ...rubric.grade_descriptors };
  
    // Ensure we cast the value correctly depending on the field
    if (name === 'mark_min' || name === 'mark_max') {
      updatedDescriptors[grade][name] = typeof value === 'string' ? parseInt(value) : value; // Ensure it's a number
    }
  
    setRubric((prevRubric) => ({
      ...prevRubric,
      grade_descriptors: updatedDescriptors,
    }));
  };
  

  const handleCriterionChange = (grade: string, criterionIndex: number, name: keyof Criterion, value: string) => {
    const updatedDescriptors = { ...rubric.grade_descriptors };
    updatedDescriptors[grade].criterion[criterionIndex][name] = value;
    setRubric((prevRubric) => ({ ...prevRubric, grade_descriptors: updatedDescriptors }));
  };

  const addUlo = () => {
    setRubric((prevRubric) => ({
      ...prevRubric,
      ulo_list: [...prevRubric.ulo_list, { ulo_item: '' }],
    }));
  };

  const removeUlo = (index: number) => {
    setRubric((prevRubric) => ({
      ...prevRubric,
      ulo_list: prevRubric.ulo_list.filter((_, i) => i !== index),
    }));
  };

  const addCriterion = (grade: string) => {
    const updatedDescriptors = { ...rubric.grade_descriptors };
    updatedDescriptors[grade].criterion.push({ criteria_name: '', criteria_description: '' });
    setRubric((prevRubric) => ({ ...prevRubric, grade_descriptors: updatedDescriptors }));
  };

  const removeCriterion = (grade: string, criterionIndex: number) => {
    const updatedDescriptors = { ...rubric.grade_descriptors };
    updatedDescriptors[grade].criterion = updatedDescriptors[grade].criterion.filter((_, i) => i !== criterionIndex);
    setRubric((prevRubric) => ({ ...prevRubric, grade_descriptors: updatedDescriptors }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!rubric.rubric_id) {
      console.error('rubric_id is missing');
      return;
    }

    try {
      const response = await axios.put(UPDATE_RUBRIC(rubric.rubric_id), rubric);
      if (response.status === 200) {
        alert('Rubric updated successfully!');
        onClose(rubric);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating rubric:', error);
      alert('Failed to update rubric. Please try again.');
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-content">
        <h2>Edit Rubric</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="rubric_title">Rubric Title:</label>
          <input
            type="text"
            id="rubric_title"
            name="rubric_title"
            value={rubric.rubric_title}
            onChange={handleChange}
            required
          />

          <h3>Unit Learning Outcomes (ULOs)</h3>
          {rubric.ulo_list.length > 0 ? (
            rubric.ulo_list.map((ulo, index) => (
              <div key={index} className="dynamic-list-item">
                <textarea
                  value={ulo.ulo_item}
                  onChange={(e) => handleUloChange(index, e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeUlo(index)}
                >
                  Remove ULO
                </button>
              </div>
            ))
          ) : (
            <p>No ULOs available</p>
          )}
          <button type="button" className="add-button" onClick={addUlo}>
            Add ULO
          </button>

          <h3>Grade Descriptors</h3>
          {Object.entries(rubric.grade_descriptors).map(([grade, descriptor], index) => (
            <div key={index} className="descriptor-item">
              <h4>{grade}</h4>

              <label>Min Mark:</label>
              <input
                type="number"
                value={descriptor.mark_min}
                onChange={(e) => handleDescriptorChange(grade, 'mark_min', parseInt(e.target.value))}
                required
              />

              <label>Max Mark:</label>
              <input
                type="number"
                value={descriptor.mark_max}
                onChange={(e) => handleDescriptorChange(grade, 'mark_max', parseInt(e.target.value))}
                required
              />

              <h4>Criteria</h4>
              {descriptor.criterion.map((criterion, cIndex) => (
                <div key={cIndex} className="criterion-item">
                  <label>Criteria Name:</label>
                  <input
                    type="text"
                    value={criterion.criteria_name}
                    onChange={(e) => handleCriterionChange(grade, cIndex, 'criteria_name', e.target.value)}
                    required
                  />

                  <label>Criteria Description:</label>
                  <textarea
                    value={criterion.criteria_description}
                    onChange={(e) => handleCriterionChange(grade, cIndex, 'criteria_description', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeCriterion(grade, cIndex)}
                  >
                    Remove Criterion
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addCriterion(grade)}>Add Criterion</button>
            </div>
          ))}

          <button type="submit">Update Rubric</button>
        </form>
        <button onClick={() => onClose(null)}>Cancel</button>
      </div>
    </div>
  );
};

export default EditRubricPopup;
