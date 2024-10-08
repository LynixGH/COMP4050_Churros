import React, { useState } from "react";
import axios from "axios";

const QuestionTemplate: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [questions, setQuestions] = useState<string[]>([""]); // Start with one empty question
  const [difficulty, setDifficulty] = useState<string>(""); // For storing selected difficulty
  const [numQuestions, setNumQuestions] = useState<{ [key: string]: string }>({
    type1: "",
    type2: "",
    type3: "",
    type4: "",
    type5: "",
  }); // For storing number of questions for each type

  const [questionBank, setQuestionBank] = useState<string[][]>([]); // Array to store CSV questions
  const [randomQuestionsCount, setRandomQuestionsCount] = useState<string>(""); // Number of random questions to select
  const [uploadedFileName, setUploadedFileName] = useState<string>(""); // State for uploaded file name
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false); // State for upload success
  const [error, setError] = useState<string>(""); // State for error message

  // Handles CSV file upload
  const handleCsvUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      // Validate if the uploaded file is a CSV
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setError("Please upload a valid CSV file.");
        setUploadedFileName(""); // Clear the uploaded file name
        return;
      } else {
        setError(""); // Clear error if valid file is uploaded
      }

      const reader = new FileReader();
      reader.onload = async () => {
        const text = reader.result as string;
        const rows = text.split("\n").map((row) => row.split(","));
        setQuestionBank(rows);

        // POST the CSV file
        const formData = new FormData();
        formData.append("file", file); // Append the file to FormData

        try {
          await axios.post(
            "http://54.206.102.192/units/CS101/projects/aaaaa/question_bank",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setUploadSuccess(true); // Set upload success state to true
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
          setError("Failed to upload the CSV file. Please try again."); // Set error message
        }

        // Confirm upload with GET request
        try {
          const response = await axios.get(
            "http://54.206.102.192/units/CS101/projects/aaaaa/question_bank"
          );
          console.log("Confirmation response:", response.data);
        } catch (getError) {
          console.error("Error confirming upload:", getError);
          setError("Failed to confirm upload."); // Set error message
        }
      };
      reader.readAsText(file);
      setUploadedFileName(file.name); // Update the uploaded file name
    }
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, ""]); // Add a new empty question box
  };

  const handleNumQuestionsChange = (type: string, value: string) => {
    if (/^[0-9]*$/.test(value)) {
      // Allow only positive numbers
      setNumQuestions({ ...numQuestions, [type]: value });
    }
  };

  const handleRandomQuestionsCountChange = (value: string) => {
    if (/^[0-9]*$/.test(value)) {
      // Allow only positive numbers
      setRandomQuestionsCount(value);
    }
  };

  // Handle the save button click
  const handleSave = async () => {
    // Prepare the data to be sent
    const data = {
      static_questions: questions.filter((q) => q.trim() !== ""), // Filter out empty questions
      static_questions_count: questions.length,
      question_bank_count: questionBank.length,
      ai_questions_count: randomQuestionsCount
        ? parseInt(randomQuestionsCount)
        : 0,
      factual_recall_count: parseInt(numQuestions.type1) || 0,
      conceptual_understanding_count: parseInt(numQuestions.type2) || 0,
      analysis_evaluation_count: parseInt(numQuestions.type3) || 0,
      application_problem_solving_count: parseInt(numQuestions.type4) || 0,
      open_ended_discussion_count: parseInt(numQuestions.type5) || 0,
      questions_difficulty: difficulty,
    };

    try {
      const response = await axios.post(
        "http://54.206.102.192/units/CS101/projects/FastestSchedulingAlgorithm/template",
        data
      );
      console.log("Response:", response.data);
      onClose(); // Close the modal on successful save
    } catch (err) {
      console.error("Error saving data:", err);
      setError("Failed to save data. Please try again."); // Set an error message
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 h-4/5 overflow-auto relative">
        {" "}
        {/* Fill 80% of the screen */}
        <h2 className="text-lg font-bold mb-4">Question Template</h2>
        {/* Static Questions Section */}
        {questions.map((question, index) => (
          <div key={index} className="mb-6 relative">
            {/* Input container with relative positioning */}
            <div className="relative border rounded px-2 py-1 w-full focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="text"
                value={question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                placeholder=" " // Placeholder for the floating label effect
                className="w-full focus:outline-none bg-transparent pt-2 pb-1" // Adjusted padding for height
                style={{ zIndex: 1 }} // Ensure the input is on top
              />
              <label
                className={`absolute left-2 transition-all duration-200 ease-in-out pointer-events-none
                ${
                  question
                    ? "text-blue-500 text-xs -top-2 bg-white px-1"
                    : "text-gray-500 top-2"
                }`} // Adjusted label position
              >
                Static Question {index + 1}
              </label>
            </div>
          </div>
        ))}
        <button
          onClick={handleAddQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Question
        </button>
        {/* Question Bank Section */}
        <h3 className="text-md font-semibold mb-4">Question Bank</h3>
        <div className="mb-6 relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload CSV File
          </label>
          <div className="flex items-center justify-center border-dashed border-2 border-gray-300 rounded-md py-8">
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="absolute w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M12 16v-4a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 24h32M12 28h8m-8 4h8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  Drag & drop a file here, or{" "}
                  <span className="text-blue-500 underline cursor-pointer">
                    choose file
                  </span>
                </p>
                {uploadedFileName && (
                  <p className="mt-2 text-gray-700">
                    Uploaded File: <strong>{uploadedFileName}</strong>
                  </p>
                )}{" "}
                {/* Show uploaded file name */}
                {error && <p className="mt-2 text-red-500">{error}</p>}{" "}
                {/* Show error message */}
                {uploadSuccess && (
                  <p className="mt-2 text-green-500">Upload successful!</p>
                )}{" "}
                {/* Show success message */}
              </div>
            </div>
          </div>
        </div>
                       {/* Number of Random Questions */}
         <div className="mb-6 relative">
          <div className="relative border rounded px-2 py-1 w-full focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="number"
              value={randomQuestionsCount}
              onChange={(e) => handleRandomQuestionsCountChange(e.target.value)}
              placeholder=" " // Placeholder for the floating label effect
              className="w-full focus:outline-none bg-transparent pt-2 pb-1" // Adjusted padding for height
              min="1" // Allow only positive numbers
              style={{ zIndex: 1 }} // Ensure the input is on top
            />
            <label 
              className={`absolute left-2 transition-all duration-200 ease-in-out pointer-events-none
              ${randomQuestionsCount ? 'text-blue-500 text-xs -top-2 bg-white px-1' : 'text-gray-500 top-2'}`} // Adjusted label position
            >
              Number of Random Questions
            </label>
          </div>
          <span className="text-xs text-gray-500 mt-1">e.g., 5</span>
        </div>
        {/* AI-Generated Questions Section */}
        <h3 className="text-md font-semibold mb-4">AI-Generated Questions</h3>
        {/* Difficulty Level Dropdown */}
        <div className="mb-6 relative">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Difficulty Level
            </option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        {/* Number of Questions Inputs for Each Type */}
        {[
          "Factual Recall",
          "Conceptual Understanding",
          "Analysis & Evaluation",
          "Application & Problem-Solving",
          "Open-Ended Discussion",
        ].map((type, idx) => (
          <div key={idx} className="mb-6 relative">
            <div className="relative border rounded px-2 py-1 w-full focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="number"
                value={numQuestions[`type${idx + 1}`]}
                onChange={(e) =>
                  handleNumQuestionsChange(`type${idx + 1}`, e.target.value)
                }
                placeholder=" " // Placeholder for the floating label effect
                className="w-full focus:outline-none bg-transparent pt-2 pb-1" // Adjusted padding for height
                min="1" // Allow only positive numbers
                style={{ zIndex: 1 }} // Ensure the input is on top
              />
              <label
                className={`absolute left-2 transition-all duration-200 ease-in-out pointer-events-none
                ${
                  numQuestions[`type${idx + 1}`]
                    ? "text-blue-500 text-xs -top-2 bg-white px-1"
                    : "text-gray-500 top-2"
                }`} // Adjusted label position
              >
                Number of {type} Questions
              </label>
            </div>
            <span className="text-xs text-gray-500 mt-1">e.g., 5</span>
          </div>
        ))}
      </div>
      {/* Save Button Centered Below the Popup */}
      <div className="flex justify-center w-full absolute bottom-4">
        {" "}
        {/* Center the button */}
        <button
          onClick={handleSave} // Use the handleSave function
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded ml-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default QuestionTemplate;
