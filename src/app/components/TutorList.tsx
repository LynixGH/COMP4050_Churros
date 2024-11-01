import React, { useState, useEffect, CSSProperties } from 'react';
import axios from 'axios';
import { GET_ALL_TA, GET_ALL_NON_TA, POST_TA, DELETE_TA } from '@/api';


interface Tutor {
  id: number;
  name: string;
}

interface TutorsProps {
  unitCode: string; // The unit code prop to specify the unit
}

const Tutors: React.FC<TutorsProps> = ({ unitCode }) => {

  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Tutor[]>([]);
  const [allStaff, setAllStaff] = useState<Tutor[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Tutor[]>([]); // To track newly added tutors
  const [removedStaff, setRemovedStaff] = useState<Tutor[]>([]);   // To track removed tutors
  const [role, setRole] = useState<string>('TA'); // Role can be adjusted later if needed

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(GET_ALL_TA(unitCode));
        console.log(response.data); // Add this to inspect the data
        setTutors(
          response.data.collaborators.map((collab: any) => ({
            id: collab.staff_id,
            name: collab.staff_name
          }))
        );
      } catch (error) {
        console.error('Error fetching tutors:', error);
        setError('Failed to fetch tutors');
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [unitCode]);

  useEffect(() => {
    if (isEditing) {
      const fetchNonCollaborators = async () => {
        try {
          const response = await axios.get(GET_ALL_NON_TA(unitCode));  // Use the new endpoint
          console.log(response.data);  // Inspect the full response
          setAllStaff(
            response.data.non_collaborators.map((staff: any) => ({
              id: staff.staff_id,
              name: staff.staff_name
            }))
          );
        } catch (error) {
          console.error('Error fetching staff list:', error);
          setError('Failed to fetch staff list');
        }
      };
  
      fetchNonCollaborators();
    }
  }, [isEditing, unitCode]);



  // Handle add tutor to temporary selection list
  const addTutorToUnit = (tutor: Tutor) => {
    setSelectedStaff([...selectedStaff, tutor]);
    setTutors([...tutors, tutor]); // Add the tutor to the list for immediate display
    setSearchResults([]); // Clear search results
    setSearchQuery(''); // Clear search query
  };

  // Handle remove tutor from temporary removal list
  const removeTutor = (id: number) => {
    const removedTutor = tutors.find((tutor) => tutor.id === id);
    if (removedTutor) {
      setRemovedStaff([...removedStaff, removedTutor]); // Track removed tutors
      setTutors(tutors.filter(tutor => tutor.id !== id)); // Immediately remove from display
    }
  };

  const toggleEditMode = async () => {
    if (isEditing) {
      // Submit added tutors
      if (selectedStaff.length > 0) {
        try {
          await Promise.all(
            selectedStaff.map(async (staff) => {
              const response = await axios.post(POST_TA(unitCode), {
                staff_id: staff.id,
                staff_name: staff.name,
                role: role // Send the role, can be adjusted
              });
              console.log('Added tutor:', response.data);
            })
          );
        } catch (error) {
          console.error('Error adding tutors to unit:', error);
          setError('Failed to add tutors to the unit');
        }
      }
  
      // Submit removed tutors
      if (removedStaff.length > 0) {
        try {
          await Promise.all(
            removedStaff.map(async (staff) => {
              const response = await axios.delete(DELETE_TA(unitCode, staff.id));
              console.log('Deleted tutor:', response.data); // Log the response for debugging
            })
          );
        } catch (error) {
          console.error('Error removing tutors from unit:', error);
          setError('Failed to remove tutors from the unit');
        }
      }
  
      // Clear selected and removed staff after submission
      setSelectedStaff([]);
      setRemovedStaff([]);
    }
  
    setIsEditing(!isEditing); // Toggle the edit mode
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      // Filter the allStaff list based on the search query
      const filteredStaff = allStaff.filter(staff =>
        staff.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredStaff);
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
            placeholder="Search for a staff member to add..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
          <div style={styles.searchResults}>
            {searchResults.map(staff => (
              <div
                key={staff.id}
                onClick={() => addTutorToUnit(staff)}
                style={styles.searchResultItem}
              >
                {staff.name}
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
    backgroundColor: '#A6192E',
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