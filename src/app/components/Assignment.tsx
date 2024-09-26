import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Assignment {
  project_id: number;
  project_name: string;
  unit_code: string;
}

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <p>Loading assignments...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={styles.container}>
      {assignments.map((assignment) => (
        <div key={assignment.project_id} style={styles.box}>
          <h3>{assignment.project_name || 'Unnamed Project'}</h3>
          <p>Unit Code: {assignment.unit_code}</p>
        </div>
      ))}
    </div>
  );
};

// Inline styles for the component
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

export default Assignments;
