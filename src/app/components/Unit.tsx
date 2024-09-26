import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@/app/styles/Unit.css'

interface Assignment {
  project_id: number;
  project_name: string;
  unit_code: string;
}

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [newName, setNewName] = useState<string>('');

  useEffect(() => {
    // Fetch assignments from the API
    axios.get('http://54.206.102.192/units/CS101/projects')
      .then(response => {
        setAssignments(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching assignments", err);
        setError('Failed to load assignments');
        setLoading(false);
      });
  }, []);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedAssignment(null); // Reset selected assignment when toggling edit mode
    setNewName(''); // Clear the new name input
  };

  const handleEditClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setNewName(assignment.project_name);
  };

  const handleDeleteClick = (assignment: Assignment) => {
    // Make DELETE request to remove the assignment
    axios.delete(`http://54.206.102.192/units/CS101/projects/${encodeURIComponent(assignment.project_name)}`)
      .then(response => {
        // Remove the deleted assignment from the state
        setAssignments(prevAssignments => 
          prevAssignments.filter(a => a.project_id !== assignment.project_id)
        );
      })
      .catch(err => {
        console.error("Error deleting assignment", err);
      });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleSave = () => {
    if (selectedAssignment) {
      const updatedAssignment = {
        project_name: newName
      };

      // Make PUT request to update the assignment name
      axios.put(`http://54.206.102.192/units/CS101/projects/${encodeURIComponent(selectedAssignment.project_name)}`, updatedAssignment)
        .then(response => {
          // Update the state with the new assignment name
          setAssignments(prevAssignments => 
            prevAssignments.map(assignment => 
              assignment.project_id === selectedAssignment.project_id 
                ? { ...assignment, project_name: newName }
                : assignment
            )
          );
          setSelectedAssignment(null); // Close the modal
        })
        .catch(err => {
          console.error("Error updating assignment", err);
        });
    }
  };

  const handleCancel = () => {
    setSelectedAssignment(null);
  };

  if (loading) {
    return <p>Loading assignments...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      {assignments.map((assignment) => (
        <div key={assignment.project_id} className="box">
          <div className="assignmentInfo">
            <h3>{assignment.project_name || 'Unnamed Project'}</h3>
            <p>Unit Code: {assignment.unit_code}</p>
          </div>
          
          {isEditMode && (
            <div className="actions">
              <button className="actionButton" onClick={() => handleEditClick(assignment)}>Edit</button>
              <button className="actionButton" onClick={() => handleDeleteClick(assignment)}>Delete</button>
            </div>
          )}
        </div>
      ))}
  
      {isEditMode ? (
        <button onClick={toggleEditMode} className="cancelButton">
          Cancel Editing
        </button>
      ) : (
        <button onClick={toggleEditMode} className="editButton">
          Edit Assignments
        </button>
      )}
  
      {selectedAssignment && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>Edit Project Name</h2>
            <input 
              type="text" 
              value={newName} 
              onChange={handleNameChange} 
              className="input" 
            />
            <div className="modalActions">
              <button className="saveButton" onClick={handleSave}>Save</button>
              <button className="cancelButton" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

// Inline styles for the component


export default Assignments;
