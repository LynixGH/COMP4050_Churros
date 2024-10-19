import React, { useState } from 'react';
import axios from 'axios';
import { POST_STUDENTS } from '@/api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  unit_code: string;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload, unit_code }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setError(null); // Reset error on file selection
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
      setError(null); // Reset error on file selection
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setLoading(true); // Start loading state
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await axios.post(POST_STUDENTS(unit_code), formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Set content type for file upload
          },
        });
        console.log("File uploaded successfully:", response.data);
        setSelectedFile(null); // Clear the file input after submission
        onClose(); // Close the modal
      } catch (err) {
        console.error("Error uploading file", err);
        setError("Failed to upload file."); // Set error message
      } finally {
        setLoading(false); // Stop loading state
      }
    }
  };

  const handleClick = () => {
    const inputElement = document.getElementById('file-input') as HTMLInputElement;
    if (inputElement) {
      inputElement.click(); // Trigger the file input dialog
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2>Upload CSV File</h2>
        <div 
          style={{ ...styles.dropZone, ...(dragging ? styles.dragging : {}) }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick} // Add click handler to the drop zone
        >
          {selectedFile ? (
            <p>{selectedFile.name}</p>
          ) : (
            <p>Drag and drop a CSV file here, or click to select a file.</p>
          )}
          <input
            id="file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={styles.hiddenInput}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.modalActions}>
          <button onClick={handleUpload} style={styles.createButton} disabled={loading}>
            {loading ? 'Uploading...' : 'Upload'}
          </button>
          <button onClick={onClose} style={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Inline styles for the modal
const styles: { [key: string]: React.CSSProperties } = {
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
  dropZone: {
    border: '2px dashed #007bff',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    marginBottom: '10px',
    cursor: 'pointer',
  },
  dragging: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
  },
  hiddenInput: {
    display: 'none',
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
};

export default UploadModal;
