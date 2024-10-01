import React, { useState, useEffect, CSSProperties } from 'react';
import axios from 'axios';

interface Tutor {
  id: number;
  name: string;
}

interface TutorsProps {
  unitCode: string; // The unit code prop to specify the unit
}

const Tutors: React.FC<TutorsProps> = ({ unitCode }) => {
  // Dummy data for tutors specific to the unit
  const initialTutors: Tutor[] = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
  ];

  // Dummy data for all available tutors
  const initialAllTutors: Tutor[] = [
    { id: 3, name: 'Michael Johnson' },
    { id: 4, name: 'Emily Davis' },
    { id: 5, name: 'Chris Lee' }
  ];

  const [tutors, setTutors] = useState<Tutor[]>(initialTutors);
  const [allTutors, setAllTutors] = useState<Tutor[]>(initialAllTutors);
  const [loading, setLoading] = useState<boolean>(false); // Set to false as we're using dummy data
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Tutor[]>([]);

  // Handle add tutor to unit
  const addTutorToUnit = (tutor: Tutor) => {
    // Dummy add logic
    setTutors([...tutors, tutor]); // Add tutor to the state
    setSearchResults([]); // Clear search results
    setSearchQuery(''); // Clear search query
  };

  // Handle remove tutor from unit
  const removeTutor = (id: number) => {
    // Dummy remove logic
    setTutors(tutors.filter(tutor => tutor.id !== id)); // Remove tutor from state
  };

  // Toggle editing mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setError(null);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      // Filter tutors based on search query
      const filteredTutors = allTutors.filter(tutor =>
        tutor.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredTutors);
    } else {
      setSearchResults([]);
    }
  };

  if (loading) {
    return <p>Loading tutors...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <h2>Tutors / Collaborators</h2>
        <button onClick={toggleEditMode} style={styles.manageButton}>
          {isEditing ? 'Done' : 'Manage'}
        </button>
      </div>

      {/* Tutors List */}
      <div style={styles.tutorList}>
        {tutors.map((tutor) => (
          <div key={tutor.id} style={styles.box}>
            <h3>{tutor.name}</h3>
            {isEditing && (
              <button onClick={() => removeTutor(tutor.id)} style={styles.removeButton}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Tutor Search Section (Visible only in editing mode) */}
      {isEditing && (
        <div style={styles.addTutorSection}>
          <input
            type="text"
            placeholder="Search for a tutor to add..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
          <div style={styles.searchResults}>
            {searchResults.map(tutor => (
              <div
                key={tutor.id}
                onClick={() => addTutorToUnit(tutor)}
                style={styles.searchResultItem}
              >
                {tutor.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Inline styles for layout
const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: '16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  manageButton: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  tutorList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  box: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  removeButton: {
    marginTop: '8px',
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  addTutorSection: {
    marginTop: '16px',
    padding: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f1f1f1',
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  searchResults: {
    maxHeight: '150px',
    overflowY: 'auto',
  },
  searchResultItem: {
    padding: '10px',
    cursor: 'pointer',
    backgroundColor: '#e9ecef',
    marginBottom: '4px',
    borderRadius: '4px',
    textAlign: 'left',
  },
};

export default Tutors;
