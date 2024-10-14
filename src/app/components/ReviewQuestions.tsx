// ReviewQuestions.tsx

"use client";

import React, { useState, useEffect, CSSProperties } from "react";
import axios from "axios";
import { GET_GENERATED_QUESTIONS } from "@/api";
import { REGENERATE_QUESTIONS_FOR_ONE } from "@/api";
import { GET_QUESTION_BANK } from "@/api";

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

interface RandomQuestion {
  question: string;  // <-- The declaration of `question` as a property inside RandomQuestion
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
  const [randomQuestions, setRandomQuestions] = useState<RandomQuestion[]>([]); // Declare randomQuestions state



  const [activeTab, setActiveTab] = useState<"static" | "random" | "ai">(
    "static"
  );

  // State for selected reasons
  const [selectedReasons, setSelectedReasons] = useState<{
    [category: string]: { [questionKey: string]: string };
  }>({});

  // State for selected questions
  const [selectedQuestions, setSelectedQuestions] = useState<{
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
          setReviewData(data[data.length - 1]);
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

  // Handle checkbox change
  const handleCheckboxChange = (
    category: string,
    questionKey: string,
    isChecked: boolean
  ) => {
    setSelectedQuestions((prevSelected) => ({
      ...prevSelected,
      [category]: {
        ...prevSelected[category],
        [questionKey]: isChecked,
      },
    }));
  };

  const handleSelectiveGenerate = async () => {

    const questionTypeMap: { [key: string]: string } = {
      analysis_and_evaluation: "Analysis and Evaluation",
      application_and_problem_solving: "Application and Problem Solving",
      factual_recall: "Factual Recall",
      open_ended: "Open-ended",
    };

    const questionReasonArray = [];
    let hasSelectedQuestion = false;
    let allSelectedHaveReasons = true;
    let reasonWithoutSelection = false;

    for (let [category, questions] of Object.entries(
      reviewData!.ai_questions
    )) {
      for (let [questionKey, questionText] of Object.entries(questions)) {
        const isSelected =
          selectedQuestions[category]?.[questionKey] || false;
        const reason = selectedReasons[category]?.[questionKey];

        if (isSelected) {
          hasSelectedQuestion = true;
          if (!reason) {
            allSelectedHaveReasons = false;
          } else {
            const questionType = questionTypeMap[category] || category;
            questionReasonArray.push({
              [questionKey]: questionText,
              reason: reason,
              question_type: questionType,
            });
          }
        } else if (reason) {
          reasonWithoutSelection = true;
        }
      }
    }

    // Check for failsafe conditions
    if (!hasSelectedQuestion) {
      alert("Please select at least one question to regenerate.");
      return;
    }

    if (!allSelectedHaveReasons) {
      alert("Please provide a reason for each selected question.");
      return;
    }

    if (reasonWithoutSelection) {
      alert(
        "You have provided reasons for questions that are not selected. Please select the questions or remove the reasons."
      );
      return;
    }

    // Before sending, output the question_reason array for debugging
    console.log("Question Reasons to be sent:", questionReasonArray);

    // Prepare the payload
    const payload = {
      question_reason: questionReasonArray,
    };

    try {
      // Send the POST request with the payload
      const generateUrl = REGENERATE_QUESTIONS_FOR_ONE(
        unitCode,
        projectName,
        submissionId
      );

      await axios.post(generateUrl, payload);

      // Fetch updated questions after regeneration
      setLoading(true);
      const response = await axios.get(
        `${GET_GENERATED_QUESTIONS(submissionId)}`
      );
      if (response.status === 200 && response.data) {
        const data: ReviewData[] = response.data;
        setReviewData(data[0]);

        // Clear selected reasons and selected questions after regeneration
        setSelectedReasons({});
        setSelectedQuestions({});
      } else {
        console.error("Data not found after regeneration.");
      }
    } catch (err) {
      console.error("Error regenerating selected questions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle reason selection
  const handleReasonChange = (
    category: string,
    questionKey: string,
    reason: string
  ) => {
    setSelectedReasons((prevReasons) => ({
      ...prevReasons,
      [category]: {
        ...prevReasons[category],
        [questionKey]: reason,
      },
    }));
  };

  const handleRandomButtonClick = async () => {
    try {
      setLoading(true); // Show loading indicator while fetching
      const response = await axios.get(GET_QUESTION_BANK(unitCode, projectName));

      if (response.status === 200 && response.data) {
        setRandomQuestions(response.data.random_questions); // Update state with fetched questions
      } else {
        console.error("No random questions found.");
      }
    } catch (error) {
      console.error("Error fetching random questions:", error);
    } finally {
      setLoading(false); // Stop loading indicator after fetching
    }
  };

  const handleCancelReason = (category: string, questionKey: string) => {
    setSelectedReasons((prevReasons) => {
      const newCategoryReasons = { ...prevReasons[category] };
      delete newCategoryReasons[questionKey];

      return {
        ...prevReasons,
        [category]: newCategoryReasons,
      };
    });
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
                      <td style={styles.questionText}>{question}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {activeTab === "random" && (
          <>
            <button
              style={styles.randomButton}
              onClick={handleRandomButtonClick} // Attach event handler to the Random button
            >
              Fetch Random Questions
            </button>

            {randomQuestions.length > 0 && (
              <table style={styles.table}>
                <tbody>
                  {randomQuestions.map((q, index) => (
                    <tr
                      key={index}
                      style={
                        index % 2 === 0
                          ? styles.tableRowEven
                          : styles.tableRowOdd
                      }
                    >
                      <td style={styles.questionText}>{q.question}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {activeTab === "ai" && (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                style={styles.regenButton}
                onClick={handleSelectiveGenerate}
              >
                Selective Generate
              </button>
            </div>

            {reviewData.ai_questions && (
              <div>
                {Object.entries(reviewData.ai_questions).map(
                  ([category, questions]) => (
                    <div key={category} style={styles.category}>
                      <h4 style={styles.categoryHeader}>
                        {formatCategoryName(category)}
                      </h4>
                      <table style={styles.table}>
                        <tbody>
                          {Object.entries(questions).map(
                            ([questionKey, questionText], index) => {
                              const isSelected =
                                selectedQuestions[category]?.[questionKey] ||
                                false;
                              const reason =
                                selectedReasons[category]?.[questionKey] || "";
                              return (
                                <tr
                                  key={questionKey}
                                  style={
                                    index % 2 === 0
                                      ? styles.tableRowEven
                                      : styles.tableRowOdd
                                  }
                                >
                                  {/* Checkbox Cell */}
                                  <td style={styles.checkboxCell}>
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          category,
                                          questionKey,
                                          e.target.checked
                                        )
                                      }
                                    />
                                  </td>
                                  {/* Question Text Cell */}
                                  <td style={styles.questionText}>
                                    {questionText}
                                  </td>
                                  {/* Action Cell */}
                                  <td style={styles.actionCell}>
                                    {/* Dropdown for selecting a reason */}
                                    <select
                                      value={reason}
                                      onChange={(e) =>
                                        handleReasonChange(
                                          category,
                                          questionKey,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">
                                        Choose a reason
                                      </option>
                                      <option value="Too vague">
                                        Too vague
                                      </option>
                                      <option value="Not aligned with assignment content">
                                        Not aligned with assignment content
                                      </option>
                                      <option value="Grammatical issues">
                                        Grammatical issues
                                      </option>
                                      <option value="Needs elaboration">
                                        Needs elaboration
                                      </option>
                                      <option value="Other">
                                        Other
                                      </option>
                                    </select>

                                    {/* Show Cancel button if a reason is selected */}
                                    {reason && (
                                      <button
                                        style={styles.cancelButton}
                                        onClick={() =>
                                          handleCancelReason(
                                            category,
                                            questionKey
                                          )
                                        }
                                      >
                                        Cancel
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
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "28px",
    marginBottom: "24px",
    textAlign: "center",
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px",
  },
  tab: {
    padding: "12px 24px",
    margin: "0 8px",
    backgroundColor: "#f1f1f1",
    border: "none",
    borderRadius: "4px 4px 0 0",
    cursor: "pointer",
    fontSize: "16px",
  },
  activeTab: {
    padding: "12px 24px",
    margin: "0 8px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderBottom: "none",
    borderRadius: "4px 4px 0 0",
    cursor: "pointer",
    fontSize: "16px",
  },
  tabContent: {
    border: "1px solid #ccc",
    borderRadius: "0 4px 4px 4px",
    padding: "16px",
    backgroundColor: "#fff",
  },
  category: {
    marginBottom: "24px",
  },
  categoryHeader: {
    fontSize: "20px",
    marginBottom: "12px",
    color: "#333",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableRowEven: {
    backgroundColor: "#f9f9f9",
  },
  tableRowOdd: {
    backgroundColor: "#fff",
  },
  checkboxCell: {
    padding: "12px",
    border: "1px solid #ddd",
    width: "5%",
    verticalAlign: "top",
    textAlign: "center",
  },
  questionText: {
    padding: "12px",
    border: "1px solid #ddd",
    verticalAlign: "top",
  },
  actionCell: {
    padding: "12px",
    border: "1px solid #ddd",
    width: "35%",
    verticalAlign: "top",
  },
  randomButton: {
    padding: "10px 20px",
    backgroundColor: "#17a2b8",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "16px",
  },
  regenButton: {
    padding: "10px 20px",
    backgroundColor: "#ffc107",
    color: "#000",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "16px",
  },
  cancelButton: {
    padding: "8px 16px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginLeft: "8px",
  },
};

export default ReviewQuestions;
