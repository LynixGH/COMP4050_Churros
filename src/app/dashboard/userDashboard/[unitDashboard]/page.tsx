'use client';

import React, { useState } from 'react';
import Assignments from '@/app/components/Assignment'; // Import the Assignments component
import Tutors from '@/app/components/TutorList'; // Import the Tutors component
import axios from 'axios';
import UploadModal from '@/app/components/UploadModal'; // Import the UploadModal component
import '@/app/styles/unitDashboard.css'; // Import the CSS file
import { GET_UNITS } from '@/api';

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
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Project</h2>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          className="input"
        />
        <div className="modal-actions">
          <button onClick={handleSubmit} className="create-button">Create</button>
          <button onClick={onClose} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default function UnitDashboard({ params }: { params: { unitDashboard: string } }) {
  const unitCode = params.unitDashboard;
  const [modalOpen, setModalOpen] = useState<boolean>(false); // State for modal visibility
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false); // State for upload modal visibility
  const [error, setError] = useState<string | null>(null); // State for error messages

  axios.get(GET_UNITS)
    .then(response => {
      if (response.status === 404) {
        console.log('Failed to load');
      }
    })
    .catch(err => {
      console.error("Error fetching unit", err);
      setError('Failed to load unit');
      window.location.href = '/dashboard/userDashboard';
    });

  const handleCreateProject = (newProjectName: string) => {
    const projectData = {
      project_name: newProjectName
    };

    axios.post(`http://3.27.122.31/units/${unitCode}/projects`, projectData)
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

  const handleFileUpload = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    axios.post(`http://54.206.102.192/units/${unitCode}/students`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log("File uploaded successfully:", response.data);
        setUploadModalOpen(false); // Close the upload modal
        window.location.reload(); // Refresh the page
      })
      .catch(err => {
        console.error("Error uploading file", err);
        setError("Failed to upload file.");
      });
  };

  return (
    <div className="container">
      <h1>{unitCode} Dashboard</h1>

      {/* Button to open the modal for creating a new project */}
      <button onClick={() => setModalOpen(true)} className="create-button">
        Create Project
      </button>
      <button onClick={() => setUploadModalOpen(true)} className="upload-button">
        Upload CSV
      </button>
      {error && <p className="error">{error}</p>}

      {/* Modal for project creation */}
      <Modal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      {/* Modal for file upload */}
      <UploadModal 
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />

      {/* Flex container to hold both Assignments and Tutors */}
      <div className="content">
        {/* Section for displaying assignments */}
        <div className="assignments">
          <h2>Assignments</h2>
          <Assignments project_name='AssignmentName' unit_code={unitCode}/> {/* Call the Assignments component */}
        </div>

        {/* Section for displaying tutors */}
        <div className="tutors">
          {/* <h2>Tutors</h2> */}
          <Tutors unitCode={unitCode}/> {/* Call the Tutors component */}
        </div>
      </div>
    </div>
  );
};
