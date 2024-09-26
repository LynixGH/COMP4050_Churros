'use client'

import React, { useState } from 'react';
import Assignments from '@/app/components/Assignment'; // Import the Assignments component
import Tutors from '@/app/components/TutorList'; // Import the Tutors component
import axios from 'axios';

// Modal component to handle the project creation
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (name: string) => void; }> = ({ isOpen, onClose, onSubmit }) => {
  const [projectName, setProjectName] = useState<string>('');

  const handleSubmit = () => {
    if (projectName.trim()) {
      onSubmit(projectName);
      setProjectName(''); // Clear input after submission
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2>Create New Project</h2>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          style={styles.input}
        />
        <div style={styles.modalActions}>
          <button onClick={handleSubmit} style={styles.createButton}>Create</button>
          <button onClick={onClose} style={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const UnitDashboard: React.FC = () => {
  const unitName = "CS101"; // Example unit name
  const [modalOpen, setModalOpen] = useState<boolean>(false); // State for modal visibility
  const [error, setError] = useState<string | null>(null); // State for error messages

  const handleCreateProject = (newProjectName: string) => {
    const projectData = {
      project_name: newProjectName
    };

    // Make a POST request to create a new project
    axios.post('http://54.206.102.192/units/CS101/projects', projectData)
      .then(response => {
        console.log("Project created successfully:", response.data);
        setModalOpen(false); // Close the modal
        setError(null); // Clear any previous error
        window.location.reload(); // Refresh the page
      })
      .catch(err => {
        console.error("Error creating project", err);
        setError("Failed to create project.");
      });
  };

  return (
    <div style={styles.container}>
      <h1>{unitName} Dashboard</h1>

      {/* Button to open the modal for creating a new project */}
      <button onClick={() => setModalOpen(true)} style={styles.createButton}>
        Create Project
      </button>
      {error && <p style={styles.error}>{error}</p>}

      {/* Modal for project creation */}
      <Modal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      {/* Flex container to hold both Assignments and Tutors */}
      <div style={styles.content}>
        {/* Section for displaying assignments */}
        <div style={styles.assignments}>
          <h2>Assignments</h2>
          <Assignments /> {/* Call the Assignments component */}
        </div>

        {/* Section for displaying tutors */}
        <div style={styles.tutors}>
          <h2>Tutors</h2>
          <Tutors /> {/* Call the Tutors component */}
        </div>
      </div>
    </div>
  );
};

// Simple inline styles for layout
const styles = {
  container: {
    padding: '20px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '400px',
  },
  input: {
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%', // Full width input
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  createButton: {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 15px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  content: {
    display: 'flex',
    flexDirection: 'row', // Ensures elements are placed side by side
    gap: '20px',
  },
  assignments: {
    flex: 4, // Takes 4/5 of the width
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  tutors: {
    flex: 1, // Takes 1/5 of the width
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
};

export default UnitDashboard;
