import React from 'react';
import '@/app/styles/studentListPopup.css'; // Import CSS for the popup

interface Student {
  student_id: number | null;
  student_name: string | null;
}

interface StudentListPopupProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[] | null;
}

const StudentListPopup: React.FC<StudentListPopupProps> = ({ isOpen, onClose, students }) => {
  if (!isOpen) return null;

  // Ensure students is an array before mapping
  if (!Array.isArray(students) || students.length === 0) {
    return <div>No student data available</div>;
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Student List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.student_id ?? 'N/A'}</td> {/* Display 'N/A' if student_id is null */}
                <td>{student.student_name ?? 'No Name'}</td> {/* Display 'No Name' if student_name is null */}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default StudentListPopup;
