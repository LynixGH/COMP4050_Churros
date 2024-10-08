"use client";

import React, { useState, useEffect, CSSProperties } from "react";
import axios from "axios";
import { GET_GENERATED_QUESTIONS } from "@/api";
import { REGENERATE_QUESTIONS_FOR_ONE } from "@/api";

interface AIQuestionCategory {
  [questionKey: string]: string;
}

interface AIQuestions {
  [category: string]: AIQuestionCategory;
}

interface RandomQuestion {
  question: string;
}

interface ReviewData {
  ai_questions: AIQuestions;
  project_title: string;
  random_questions: RandomQuestion[];
  static_questions: string[];
  submission_id: number;
  unit_code: string;
}

interface ReviewQuestionsProps {
  submissionId: number;
  projectName: string;
  unitCode: string;
}

const dummyData: ReviewData = {
  ai_questions: {
    analysis_and_evaluation: {
      question_1:
        "DUMMY Evaluate the importance of documentation in a project like yours that involves complex programming tasks. How will you ensure your documentation remains consistent and helpful?",
      question_2:
        "Analyze the decision to use C++ for developing your program. What are the advantages and disadvantages of using C++ for low-level graphics programming compared to other languages?",
      question_3:
        "In your opinion, how does the complexity of the Vulkan API compare to other graphics libraries you are aware of? What challenges do you anticipate facing with Vulkan?",
    },
    application_and_problem_solving: {
      question_1:
        "Given your understanding of graphics programming, how would you approach implementing a new shader effect that is not covered in the existing resources you plan to use?",
    },
    factual_recall: {
      question_1:
        "What is the primary purpose of learning the Vulkan graphics library and GLSL in the context of your project?",
      question_2:
        "Can you explain the basic differences between Vulkan and OpenGL?",
      question_3:
        "What are the main milestones outlined in your project, and what does each milestone aim to achieve?",
    },
    open_ended: {
      question_1:
        "Reflecting on your project, how do you envision the skills you develop through this project impacting your future career in game development or related fields?",
    },
  },
  project_title: "Project Himanshi",
  random_questions: [
    { question: "What inspired you to choose this project?" },
    { question: "How do you plan to test and validate your work?" },
    { question: "What potential obstacles do you foresee?" },
  ],
  static_questions: [
    "Describe your project's main objectives.",
    "What technologies will you be using?",
  ],
  submission_id: 10,
  unit_code: "CS101",
};

const ReviewQuestions: React.FC<ReviewQuestionsProps> = ({
  submissionId,
  projectName,
  unitCode,
}) => {
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"static" | "random" | "ai">(
    "static"
  );
  const [editingQuestion, setEditingQuestion] = useState<{
    category?: string;
    questionKey: string;
    questionText: string;
    type: "ai" | "static" | "random";
    index?: number;
  } | null>(null);
  const [selectedAIQuestions, setSelectedAIQuestions] = useState<{
    [category: string]: { [questionKey: string]: boolean };
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get(
          `${GET_GENERATED_QUESTIONS(submissionId)}`
        );

        if (response.status === 200 && response.data) {
          const data: ReviewData[] = response.data;
          setReviewData(data[0]);
        } else {
          console.error("Data not found, using dummy data.");
          setReviewData(dummyData);
        }
      } catch (err) {
        console.error(
          "Error fetching review questions, using dummy data.",
          err
        );
        setReviewData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [submissionId]);

  const handleSelectiveGenerate = async () => {
    const selectedCategories = Object.entries(selectedAIQuestions)
      .filter(([_, questions]) => Object.values(questions).some(Boolean))
      .map(([category]) => category);
  
    if (selectedCategories.length === 0) {
      alert("Please select at least one question to regenerate.");
      return;
    }
  
    try {
      // Send a POST request for selected AI questions regeneration
      for (let category of selectedCategories) {
        const generateUrl = GENERATE_QUESTIONS_FOR_ONE(unitCode, projectName, submissionId, category);
        await axios.post(generateUrl);
      }
  
      // Fetch updated questions after regeneration
      setLoading(true);
      const response = await axios.get(
        `${GET_GENERATED_QUESTIONS(submissionId)}`
      );
      if (response.status === 200 && response.data) {
        const data: ReviewData[] = response.data;
        setReviewData(data[0]);
        setSelectedAIQuestions({});  // Clear selections after regeneration
      } else {
        console.error("Data not found after regeneration.");
      }
    } catch (err) {
      console.error("Error regenerating selected questions:", err);
    } finally {
      setLoading(false);
    }
  };
  

  // Active Question Select
  const handleEditClick = (
    type: "ai" | "static" | "random",
    questionKey: string,
    questionText: string,
    category?: string,
    index?: number
  ) => {
    setEditingQuestion({ type, questionKey, questionText, category, index });
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingQuestion) {
      setEditingQuestion({
        ...editingQuestion,
        questionText: e.target.value,
      });
    }
  };

  const handleSaveQuestion = () => {
    if (editingQuestion && reviewData) {
      const updatedReviewData = { ...reviewData };

      if (editingQuestion.type === "ai" && editingQuestion.category) {
        updatedReviewData.ai_questions[editingQuestion.category][
          editingQuestion.questionKey
        ] = editingQuestion.questionText;
      } else if (
        editingQuestion.type === "static" &&
        editingQuestion.index !== undefined
      ) {
        updatedReviewData.static_questions[editingQuestion.index] =
          editingQuestion.questionText;
      } else if (
        editingQuestion.type === "random" &&
        editingQuestion.index !== undefined
      ) {
        updatedReviewData.random_questions[editingQuestion.index].question =
          editingQuestion.questionText;
      }

      setReviewData(updatedReviewData);
      setEditingQuestion(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
  };

  // Task -1: Handle AI Question Selection
  const handleAIQuestionSelect = (category: string, questionKey: string) => {
    setSelectedAIQuestions((prevState) => {
      const categorySelections = prevState[category] || {};
      const isSelected = categorySelections[questionKey];

      return {
        ...prevState,
        [category]: {
          ...categorySelections,
          [questionKey]: !isSelected,
        },
      };
    });
  };

  const isAIQuestionSelected = (category: string, questionKey: string) => {
    return (
      selectedAIQuestions[category] &&
      selectedAIQuestions[category][questionKey]
    );
  };

  // Task 2: Handle Regen All
  const handleRegenAll = async () => {
    try {

      // Use the utility function to generate the URL for the POST request
      const generateUrl = REGENERATE_QUESTIONS_FOR_ONE(unitCode, projectName, submissionId);

      // Send the POST request to regenerate questions
      await axios.post(generateUrl);

      // Fetch the updated data after regeneration
      setLoading(true);
      const response = await axios.get(
        `${GET_GENERATED_QUESTIONS(submissionId)}`
      );
      if (response.status === 200 && response.data) {
        const data: ReviewData[] = response.data;
        setReviewData(data[0]);

        // Clear selected AI questions after regeneration
        setSelectedAIQuestions({});
      } else {
        console.error("Data not found after regeneration.");
      }
    } catch (err) {
      console.error("Error regenerating questions:", err);
    } finally {
      setLoading(false);
    }
  };




  if (loading) {
    return <p>Loading review questions...</p>;
  }

  if (!reviewData) {
    return <p>No review data available.</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{reviewData.project_title}</h2>

      {/* Tab Navigation */}
      <div style={styles.tabContainer}>
        <button
          style={activeTab === "static" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("static")}
        >
          Static Questions
        </button>
        <button
          style={activeTab === "random" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("random")}
        >
          Random Questions
        </button>
        <button
          style={activeTab === "ai" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("ai")}
        >
          AI Questions
        </button>
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {activeTab === "static" && (
          <>
            {reviewData.static_questions && (
              <table style={styles.table}>
                <tbody>
                  {reviewData.static_questions.map((question, index) => (
                    <tr
                      key={index}
                      style={
                        index % 2 === 0
                          ? styles.tableRowEven
                          : styles.tableRowOdd
                      }
                    >
                      <td style={styles.questionText}>
                        {editingQuestion &&
                          editingQuestion.type === "static" &&
                          editingQuestion.index === index ? (
                          <input
                            type="text"
                            value={editingQuestion.questionText}
                            onChange={handleQuestionChange}
                            style={styles.input}
                          />
                        ) : (
                          question
                        )}
                      </td>
                      <td style={styles.actionCell}>
                        {editingQuestion &&
                          editingQuestion.type === "static" &&
                          editingQuestion.index === index ? (
                          <>
                            <button
                              style={styles.saveButton}
                              onClick={handleSaveQuestion}
                            >
                              Save
                            </button>
                            <button
                              style={styles.cancelButton}
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            style={styles.editButton}
                            onClick={() =>
                              handleEditClick(
                                "static",
                                "",
                                question,
                                undefined,
                                index
                              )
                            }
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {activeTab === "random" && (
          <>
            {reviewData.random_questions && (
              <>
                <button style={styles.randomButton}>Random</button>
                <table style={styles.table}>
                  <tbody>
                    {reviewData.random_questions.map((q, index) => (
                      <tr
                        key={index}
                        style={
                          index % 2 === 0
                            ? styles.tableRowEven
                            : styles.tableRowOdd
                        }
                      >
                        <td style={styles.questionText}>
                          {editingQuestion &&
                            editingQuestion.type === "random" &&
                            editingQuestion.index === index ? (
                            <input
                              type="text"
                              value={editingQuestion.questionText}
                              onChange={handleQuestionChange}
                              style={styles.input}
                            />
                          ) : (
                            q.question
                          )}
                        </td>
                        <td style={styles.actionCell}>
                          {editingQuestion &&
                            editingQuestion.type === "random" &&
                            editingQuestion.index === index ? (
                            <>
                              <button
                                style={styles.saveButton}
                                onClick={handleSaveQuestion}
                              >
                                Save
                              </button>
                              <button
                                style={styles.cancelButton}
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              style={styles.editButton}
                              onClick={() =>
                                handleEditClick(
                                  "random",
                                  "",
                                  q.question,
                                  undefined,
                                  index
                                )
                              }
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}

        {activeTab === "ai" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button style={styles.regenButton} onClick={handleRegenAll}>
                Regen All
              </button>
              <button style={styles.regenButton} onClick={handleSelectiveGenerate}>
                Selective Generate
              </button>
            </div>

            {reviewData.ai_questions && (
              <div>
                {Object.entries(reviewData.ai_questions).map(
                  ([category, questions]: [string, AIQuestionCategory]) => (
                    <div key={category} style={styles.category}>
                      <h4 style={styles.categoryHeader}>
                        {formatCategoryName(category)}
                      </h4>
                      <table style={styles.table}>
                        <tbody>
                          {Object.entries(questions).map(
                            (
                              [questionKey, questionText]: [string, string],
                              index
                            ) => {
                              const isSelected = isAIQuestionSelected(
                                category,
                                questionKey
                              );
                              return (
                                <tr
                                  key={questionKey}
                                  style={
                                    isSelected
                                      ? { ...styles.tableRowSelected }
                                      : index % 2 === 0
                                        ? styles.tableRowEven
                                        : styles.tableRowOdd
                                  }
                                  onClick={() =>
                                    handleAIQuestionSelect(category, questionKey)
                                  }
                                >
                                  <td style={styles.questionText}>
                                    {editingQuestion &&
                                      editingQuestion.type === "ai" &&
                                      editingQuestion.category === category &&
                                      editingQuestion.questionKey === questionKey ? (
                                      <input
                                        type="text"
                                        value={editingQuestion.questionText}
                                        onChange={handleQuestionChange}
                                        style={styles.input}
                                      />
                                    ) : (
                                      questionText
                                    )}
                                  </td>
                                  <td style={styles.actionCell}>
                                    {editingQuestion &&
                                      editingQuestion.type === "ai" &&
                                      editingQuestion.category === category &&
                                      editingQuestion.questionKey === questionKey ? (
                                      <>
                                        <button
                                          style={styles.saveButton}
                                          onClick={handleSaveQuestion}
                                        >
                                          Save
                                        </button>
                                        <button
                                          style={styles.cancelButton}
                                          onClick={handleCancelEdit}
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        style={styles.editButton}
                                        onClick={(e) => {
                                          e.stopPropagation(); // Prevent row click
                                          handleEditClick(
                                            "ai",
                                            questionKey,
                                            questionText,
                                            category
                                          );
                                        }}
                                      >
                                        Edit
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                  )
                )}
              </div>
            )}
          </>
        )}



      </div>
    </div>
  );
};



// Helper function to format category names
const formatCategoryName = (category: string) => {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Inline styles for the component
const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: '24px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '28px',
    marginBottom: '24px',
    textAlign: 'center',
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  tab: {
    padding: '12px 24px',
    margin: '0 8px',
    backgroundColor: '#f1f1f1',
    border: 'none',
    borderRadius: '4px 4px 0 0',
    cursor: 'pointer',
    fontSize: '16px',
  },
  activeTab: {
    padding: '12px 24px',
    margin: '0 8px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderBottom: 'none',
    borderRadius: '4px 4px 0 0',
    cursor: 'pointer',
    fontSize: '16px',
  },
  tabContent: {
    border: '1px solid #ccc',
    borderRadius: '0 4px 4px 4px',
    padding: '16px',
    backgroundColor: '#fff',
  },
  category: {
    marginBottom: '24px',
  },
  categoryHeader: {
    fontSize: '20px',
    marginBottom: '12px',
    color: '#333',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableRowEven: {
    backgroundColor: '#f9f9f9',
  },
  tableRowOdd: {
    backgroundColor: '#fff',
  },
  tableRowSelected: {
    backgroundColor: '#cce5ff',
  },
  questionText: {
    padding: '12px',
    border: '1px solid #ddd',
    width: '85%',
    verticalAlign: 'top',
    cursor: 'pointer',
  },
  actionCell: {
    padding: '12px',
    border: '1px solid #ddd',
    width: '15%',
    textAlign: 'right',
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px',
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  randomButton: {
    padding: '10px 20px',
    backgroundColor: '#17a2b8', // Computer-friendly shade of blue
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '16px',
  },
  regenButton: {
    padding: '10px 20px',
    backgroundColor: '#ffc107', // Yellow color
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '16px',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
};

export default ReviewQuestions;
