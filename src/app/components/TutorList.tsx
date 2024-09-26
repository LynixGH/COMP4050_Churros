import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Tutor {
  id: number;
  name: string;
}

const Tutors: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch tutors from the API
    axios.get('/api/tutors')
      .then(response => {
        setTutors(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching tutors", err);
        setError('Failed to load tutors');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading tutors...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={styles.container}>
      {tutors.map((tutor) => (
        <div key={tutor.id} style={styles.box}>
          <h3>{tutor.name}</h3>
        </div>
      ))}
    </div>
  );
};

// Inline styles for layout
const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    padding: '16px'
  },
  box: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  }
};

export default Tutors;
