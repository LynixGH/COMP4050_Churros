import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@/app/styles/EditRubricPopup.css'; // Create a CSS file specific to Edit functionality
import { UPDATE_RUBRIC } from '@/api';

const EditRubricPopup = ({ onClose, existingRubric }) => {
  // Ensure rubric_id is explicitly initialized from existingRubric
  const [rubric, setRubric] = useState({
    rubric_id: existingRubric?.rubric_id || null,  // Ensure rubric_id is present
    rubric_title: existingRubric?.rubric_title || '',
    ulo_list: existingRubric?.ulo_list || [],  // Ensure ulo_list is initialized
    grade_descriptors: existingRubric?.grade_descriptors || {}, // Ensure grade_descriptors is initialized
  });

  useEffect(() => {
    if (existingRubric) {
      console.log('Existing rubric in edit popup:', existingRubric); // Log to verify rubric_id presence
      setRubric({
        rubric_id: existingRubric?.rubric_id || null,  // Explicitly set rubric_id again
        rubric_title: existingRubric?.rubric_title || '',
        ulo_list: existingRubric?.ulo_list || [],
        grade_descriptors: existingRubric?.grade_descriptors || {},
      });
    }
  }, [existingRubric]);

  // Handle input changes for rubric title
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRubric((prevRubric) => ({
      ...prevRubric,
      [name]: value,
    }));
  };

  // Handle ULO changes
  const handleUloChange = (index, value) => {
    const updatedUlos = [...rubric.ulo_list];
    updatedUlos[index].ulo_item = value;
    setRubric((prevRubric) => ({ ...prevRubric, ulo_list: updatedUlos }));
  };

  // Handle changes in Grade Descriptors
  const handleDescriptorChange = (grade, name, value) => {
    const updatedDescriptors = { ...rubric.grade_descriptors };
    updatedDescriptors[grade][name] = value;
    setRubric((prevRubric) => ({ ...prevRubric, grade_descriptors: updatedDescriptors }));
  };

  // Handle changes in Criteria within Grade Descriptors
  const handleCriterionChange = (grade, criterionIndex, name, value) => {
    const updatedDescriptors = { ...rubric.grade_descriptors };
    updatedDescriptors[grade].criterion[criterionIndex][name] = value;
    setRubric((prevRubric) => ({ ...prevRubric, grade_descriptors: updatedDescriptors }));
  };

  // Add/Remove ULOs
  const addUlo = () => setRubric((prevRubric) => ({
    ...prevRubric,
    ulo_list: [...prevRubric.ulo_list, { ulo_item: '' }]
  }));

  const removeUlo = (index) => setRubric((prevRubric) => ({
    ...prevRubric,
    ulo_list: prevRubric.ulo_list.filter((_, i) => i !== index)
  }));

  // Add/Remove Criteria inside a specific Grade Descriptor
  const addCriterion = (grade) => {
    const updatedDescriptors = { ...rubric.grade_descriptors };
    updatedDescriptors[grade].criterion.push({ criteria_name: '', criteria_description: '' });
    setRubric((prevRubric) => ({ ...prevRubric, grade_descriptors: updatedDescriptors }));
  };

  const removeCriterion = (grade, criterionIndex) => {
    const updatedDescriptors = { ...rubric.grade_descriptors };
    updatedDescriptors[grade].criterion = updatedDescriptors[grade].criterion.filter((_, i) => i !== criterionIndex);
    setRubric((prevRubric) => ({ ...prevRubric, grade_descriptors: updatedDescriptors }));
  };

  // Submit updated rubric using PUT request
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!rubric.rubric_id) {
      console.error('rubric_id is missing');  // Log error if missing
      return;
    }
  
    try {
      const response = await axios.put(UPDATE_RUBRIC(rubric.rubric_id), rubric);  // Use the rubric_id dynamically
      if (response.status === 200) {
        alert('Rubric updated successfully!');
        onClose(rubric);  // Pass updated rubric back to parent component after successful update
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
          {rubric.ulo_list && rubric.ulo_list.length > 0 ? (
            rubric.ulo_list.map((ulo, index) => (
              <div key={index} className="dynamic-list-item">
                <textarea
                  value={ulo.ulo_item}
                  onChange={(e) => handleUloChange(index, e.target.value)}
                  required
                />
                <button type="button" className="remove-button" onClick={() => removeUlo(index)}>
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
                onChange={(e) => handleDescriptorChange(grade, 'mark_min', e.target.value)}
                required
              />

              <label>Max Mark:</label>
              <input
                type="number"
                value={descriptor.mark_max}
                onChange={(e) => handleDescriptorChange(grade, 'mark_max', e.target.value)}
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
                  <button type="button" onClick={() => removeCriterion(grade, cIndex)}>Remove Criterion</button>
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
