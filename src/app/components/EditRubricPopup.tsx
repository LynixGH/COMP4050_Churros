import React, { useState, useEffect } from 'react';
import '@/app/styles/EditRubricPopup.css'; // Create a CSS file specific to Edit functionality

const EditRubricPopup = ({ onClose, existingRubric }) => {
  const [rubric, setRubric] = useState(existingRubric);

  useEffect(() => {
    if (existingRubric) {
      setRubric(existingRubric); // Pre-fill form with existing rubric data when editing
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

  // Handle Grade Descriptor changes
  const handleDescriptorChange = (index, name, value) => {
    const updatedDescriptors = [...rubric.grade_descriptor_list];
    updatedDescriptors[index].grade_descriptor_item[name] = value;
    setRubric((prevRubric) => ({ ...prevRubric, grade_descriptor_list: updatedDescriptors }));
  };

  // Handle Criterion changes inside Grade Descriptors
  const handleCriterionChange = (descriptorIndex, criterionIndex, name, value) => {
    const updatedDescriptors = [...rubric.grade_descriptor_list];
    updatedDescriptors[descriptorIndex].grade_descriptor_item.criterion_list[criterionIndex][name] = value;
    setRubric((prevRubric) => ({ ...prevRubric, grade_descriptor_list: updatedDescriptors }));
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

  // Add/Remove Grade Descriptor
  const addDescriptor = () => setRubric((prevRubric) => ({
    ...prevRubric,
    grade_descriptor_list: [
      ...prevRubric.grade_descriptor_list,
      {
        grade_descriptor_item: {
          grade_descriptor_name: '',
          mark_min: '',
          mark_max: '',
          criterion_list: [{ criteria_name: '', criteria_description: '' }]
        }
      }
    ]
  }));

  const removeDescriptor = (index) => setRubric((prevRubric) => ({
    ...prevRubric,
    grade_descriptor_list: prevRubric.grade_descriptor_list.filter((_, i) => i !== index)
  }));

  // Add/Remove Criterion inside a specific Grade Descriptor
  const addCriterion = (descriptorIndex) => {
    const updatedDescriptors = [...rubric.grade_descriptor_list];
    updatedDescriptors[descriptorIndex].grade_descriptor_item.criterion_list.push({ criteria_name: '', criteria_description: '' });
    setRubric((prevRubric) => ({ ...prevRubric, grade_descriptor_list: updatedDescriptors }));
  };

  const removeCriterion = (descriptorIndex, criterionIndex) => {
    const updatedDescriptors = [...rubric.grade_descriptor_list];
    updatedDescriptors[descriptorIndex].grade_descriptor_item.criterion_list = updatedDescriptors[descriptorIndex].grade_descriptor_item.criterion_list.filter((_, i) => i !== criterionIndex);
    setRubric((prevRubric) => ({ ...prevRubric, grade_descriptor_list: updatedDescriptors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose(rubric); // Pass updated rubric back to parent component
  };

  return (
    <div className="popup-container">
      <div className="popup-content">
        <h2>Edit Rubric</h2>
        <form onSubmit={handleSubmit}>
          {/* Fields pre-filled with `existingRubric` */}
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
          {rubric.ulo_list.map((ulo, index) => (
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
            ))}
            <button type="button" className="add-button" onClick={addUlo}>
              Add ULO
            </button>

          <h3>Grade Descriptors</h3>
          {rubric.grade_descriptor_list.map((descriptor, index) => (
            <div key={index} className="descriptor-item">
              <label>Grade Name:</label>
              <input
                type="text"
                value={descriptor.grade_descriptor_item.grade_descriptor_name}
                onChange={(e) => handleDescriptorChange(index, 'grade_descriptor_name', e.target.value)}
                required
              />

              <label>Min Mark:</label>
              <input
                type="number"
                value={descriptor.grade_descriptor_item.mark_min}
                onChange={(e) => handleDescriptorChange(index, 'mark_min', e.target.value)}
                required
              />

              <label>Max Mark:</label>
              <input
                type="number"
                value={descriptor.grade_descriptor_item.mark_max}
                onChange={(e) => handleDescriptorChange(index, 'mark_max', e.target.value)}
                required
              />

              <h4>Criteria</h4>
              {descriptor.grade_descriptor_item.criterion_list.map((criterion, cIndex) => (
                <div key={cIndex} className="criterion-item">
                  <label>Criteria Name:</label>
                  <input
                    type="text"
                    value={criterion.criteria_name}
                    onChange={(e) => handleCriterionChange(index, cIndex, 'criteria_name', e.target.value)}
                    required
                  />

                  <label>Criteria Description:</label>
                  <textarea
                    value={criterion.criteria_description}
                    onChange={(e) => handleCriterionChange(index, cIndex, 'criteria_description', e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => removeCriterion(index, cIndex)}>Remove Criterion</button>
                </div>
              ))}
              <button type="button" onClick={() => addCriterion(index)}>Add Criterion</button>

              <button type="button" onClick={() => removeDescriptor(index)}>Remove Descriptor</button>
            </div>
          ))}
          <button type="button" onClick={addDescriptor}>Add Grade Descriptor</button>

          <button type="submit">Update Rubric</button>
        </form>
        <button onClick={() => onClose(null)}>Cancel</button>
      </div>
    </div>
  );
};

export default EditRubricPopup;
