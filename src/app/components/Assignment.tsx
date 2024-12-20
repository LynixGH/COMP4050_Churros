import React, { useState, useEffect, CSSProperties } from "react";
import axios from "axios";
import Link from "next/link";
import { GET_PROJECTS, DELETE_PROJECT, UPDATE_PROJECT } from "@/api";

interface Assignment {
  project_id?: number;
  project_name: string;
  unit_code?: string;
}

const Assignments: React.FC<Assignment> = ({
  unit_code = "",
  project_id = 0,
  project_name = "ERROR",
}) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [newName, setNewName] = useState<string>("");

  useEffect(() => {
    axios
      .get(GET_PROJECTS(unit_code))
      .then((response) => {
        if (response.status === 200 && response.data) {
          setAssignments(response.data);
          setLoading(false);
        } else {
          setError("Unit not found");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching assignments", err);
        setError("Failed to load assignments");
        setLoading(false);
      });
  }, [unit_code]);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedAssignment(null);
    setNewName("");
  };

  const handleEditClick = (assignment: Assignment, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAssignment(assignment);
    setNewName(assignment.project_name);
  };

  const handleDeleteClick = (assignment: Assignment, e: React.MouseEvent) => {
    e.stopPropagation();
    axios
      .delete(DELETE_PROJECT(unit_code, assignment.project_name))
      .then((response) => {
        setAssignments((prevAssignments) =>
          prevAssignments.filter((a) => a.project_id !== assignment.project_id)
        );
      })
      .catch((err) => {
        console.error("Error deleting assignment", err);
      });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleSave = () => {
    if (selectedAssignment) {
      const updatedAssignment = {
        project_name: newName,
      };

      axios
        .put(
          UPDATE_PROJECT(unit_code, selectedAssignment.project_name),
          updatedAssignment
        )
        .then((response) => {
          setAssignments((prevAssignments) =>
            prevAssignments.map((assignment) =>
              assignment.project_id === selectedAssignment.project_id
                ? { ...assignment, project_name: newName }
                : assignment
            )
          );
          setSelectedAssignment(null);
        })
        .catch((err) => {
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
    <div style={styles.container}>
      {assignments.map((assignment) => (
        <div key={assignment.project_id} style={styles.box}>
          {/* Wrapping only the project info in the Link */}
          <Link
            href={`/userDashboard/${unit_code}/${assignment.project_name}`}
            passHref
          >
            <div style={styles.assignmentInfo}>
              <h3>{assignment.project_name || "Unnamed Project"}</h3>
              <p>Unit Code: {assignment.unit_code}</p>
            </div>
          </Link>

          {/* Action buttons, separate from Link */}
          {isEditMode && (
            <div style={styles.actions}>
              <button
                style={styles.actionButton}
                onClick={(e) => handleEditClick(assignment, e)}
              >
                Edit
              </button>
              <button
                style={styles.actionButton}
                onClick={(e) => handleDeleteClick(assignment, e)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {assignments.length == 0 ? (
        <p>
          There are no assignments for this unit.
        </p>
      ) : (
        isEditMode ? (
          <button onClick={toggleEditMode} style={styles.cancelButton}>
            Cancel Editing
          </button>
        ) : (
          <button onClick={toggleEditMode} style={styles.editButton}>
            Edit Assignments
          </button>
        )
        )
      }

      {selectedAssignment && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Edit Project Name</h2>
            <input
              type="text"
              value={newName}
              onChange={handleNameChange}
              style={styles.input}
            />
            <div style={styles.modalActions}>
              <button style={styles.saveButton} onClick={handleSave}>
                Save
              </button>
              <button style={styles.cancelButton} onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline styles for the component
const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "16px",
  },
  box: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assignmentInfo: {
    flex: 1,
    cursor: "pointer",
  },
  editButton: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#A6192E",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  actionButton: {
    padding: "8px 12px",
    backgroundColor: "#A6192E",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    maxWidth: "90%",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
  },
  saveButton: {
    padding: "8px 16px",
    backgroundColor: "#43A047",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "8px 16px",
    backgroundColor: "#777877",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Assignments;
