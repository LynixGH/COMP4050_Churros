'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import QuestionTemplate from "@/app/components/QuestionTemplate";
import Link from "next/link";
import { GET_SUBMISSIONS, BATCH_UPLOAD_SUBMISSIONS, GENERATE_ALL_QUESTIONS, GET_QUESTIONS_TEMPLATE } from '@/api';

export default function AssignmentDashboard({
  params,
}: {
  params: { unitDashboard: string; assignmentDashboard: string };
}) {
  const unitCode = params.unitDashboard;
  const projectName = params.assignmentDashboard;
  const [unitName, setUnitName] = useState<string>(unitCode);
  const [assignmentName, setAssignmentName] = useState<string>(projectName);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSubmissions, setSelectedSubmissions] = useState<number[]>([]);
  const [showTemplate, setShowTemplate] = useState<boolean>(false);
  const [templateSaved, setTemplateSaved] = useState<boolean>(false);
  const [showViewTemplatePopup, setShowViewTemplatePopup] = useState<boolean>(false);
  const [questionTemplate, setQuestionTemplate] = useState<any>(null);
  const [prevSubmissionStatuses, setPrevSubmissionStatuses] = useState<{ [id: number]: string }>({});

  useEffect(() => {
    fetchSubmissions();
    const interval = setInterval(checkSubmissionStatus, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [unitCode, projectName]);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(GET_SUBMISSIONS(unitCode, projectName));
      const updatedSubmissions = response.data.submission_files.map((submission: any) => ({
        ...submission,
        submission_status: submission.submission_status === "uploaded" ? "Generating" : submission.submission_status
      }));

      setSubmissions(updatedSubmissions);
      // Track initial statuses
      const initialStatuses = Object.fromEntries(updatedSubmissions.map((sub: any) => [sub.submission_id, sub.submission_status]));
      setPrevSubmissionStatuses(initialStatuses);
    } catch (err) {
      console.error("Error fetching submissions", err);
      setError("Failed to fetch submissions.");
    }
  };

  const checkSubmissionStatus = async () => {
    try {
      const response = await axios.get(GET_SUBMISSIONS(unitCode, projectName));
      const updatedSubmissions = response.data.submission_files;

      // Only refresh if a submission status changes from "Generating" to "GENERATED"
      let shouldRefresh = false;
      const newStatuses = { ...prevSubmissionStatuses };
      updatedSubmissions.forEach((submission: any) => {
        if (submission.submission_status === "GENERATED" && prevSubmissionStatuses[submission.submission_id] === "Generating") {
          shouldRefresh = true;
        }
        newStatuses[submission.submission_id] = submission.submission_status;
      });

      // Update the previous statuses
      setPrevSubmissionStatuses(newStatuses);

      if (shouldRefresh) {
        setSubmissions(updatedSubmissions);
        window.location.reload();
      } else {
        setSubmissions(updatedSubmissions);
      }
    } catch (err) {
      console.error("Error checking submission status", err);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles(event.target.files);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles && selectedFiles.length > 0) {
      setLoading(true);
      const formData = new FormData();
      Array.from(selectedFiles).forEach((file) => {
        formData.append("files[]", file);
      });

      formData.append("staff_email", "convener1@example.com");

      try {
        await axios.post(
          BATCH_UPLOAD_SUBMISSIONS(unitCode, projectName),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setSelectedFiles(null);
        fetchSubmissions();
      } catch (err) {
        console.error("Error uploading files", err);
        setError("Failed to upload files.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCheckboxChange = (submissionId: number) => {
    setSelectedSubmissions((prev) =>
      prev.includes(submissionId)
        ? prev.filter((id) => id !== submissionId)
        : [...prev, submissionId]
    );
  };

  const handleGenerateQuestions = async () => {
    if (selectedSubmissions.length > 0) {
      try {
        // Update status of selected submissions to "Generating"
        setSubmissions(prevSubmissions =>
          prevSubmissions.map(submission =>
            selectedSubmissions.includes(submission.submission_id)
              ? { ...submission, submission_status: "Generating" }
              : submission
          )
        );

        const response = await axios.post(
          GENERATE_ALL_QUESTIONS(unitCode, decodeURIComponent(projectName)),
          {
            submission_ids: selectedSubmissions,
          }
        );
        console.log("Questions generated successfully:", response.data);
      } catch (err: any) {
        console.error("Error generating questions", err);
        setError("Failed to generate questions.");
        
        if (err.response && err.response.data && err.response.data.error) {
          window.alert(`Error: ${err.response.data.error}`);
        } else {
          window.alert("An error occurred while generating questions.");
        }
      }
    } else {
      setError("Please select at least one submission.");
    }
  };

  const handleViewTemplate = async () => {
    try {
      const response = await axios.get(GET_QUESTIONS_TEMPLATE(unitCode, projectName));
      setQuestionTemplate(response.data);
      setShowViewTemplatePopup(true);
    } catch (err) {
      console.error("Error fetching question template", err);
      setError("Failed to fetch question template.");
    }
  };

  const resetTemplateSaved = () => {
    setTemplateSaved(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{unitName} Dashboard</h1>
      <h2 className="text-xl mb-4">{decodeURIComponent(assignmentName)}</h2>
      <div className="mb-4">
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileChange}
          className="border rounded px-2 py-1 mr-2"
        />
        <button
          onClick={handleUpload}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Submission"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div className="flex justify-between items-center mt-4">
        <h3 className="text-lg font-semibold">Submissions</h3>
        <div>
          <button
            onClick={() => {
              setShowTemplate(true);
              if (!templateSaved) {
                setTemplateSaved(true);
              }
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            {templateSaved ? "Edit Question Template" : "Question Template"}
          </button>
          <button
            onClick={handleViewTemplate}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            View Question Template
          </button>
          <button
            onClick={handleGenerateQuestions}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-10"
          >
            Generate Questions
          </button>
        </div>
      </div>

      {submissions.length === 0 ? (
        <p>No submissions uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto pr-10">
          <table className="min-w-full mt-2 border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    onChange={() => {
                      if (selectedSubmissions.length === submissions.length) {
                        setSelectedSubmissions([]);
                      } else {
                        setSelectedSubmissions(
                          submissions.map(
                            (submission) => submission.submission_id
                          )
                        );
                      }
                    }}
                    checked={selectedSubmissions.length === submissions.length}
                  />
                </th>
                <th className="border px-1 py-2">Submission ID</th>
                <th className="border px-4 py-2">File Name</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.submission_id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedSubmissions.includes(
                        submission.submission_id
                      )}
                      onChange={() =>
                        handleCheckboxChange(submission.submission_id)
                      }
                    />
                  </td>
                  <td className="border px-4 py-2">
                    {submission.submission_id}
                  </td>
                  <td className="border px-4 py-2">
                    <Link
                      href={`/userDashboard/${unitCode}/${projectName}/${submission.submission_id}`}
                    >{submission.submission_file_name}</Link>
                  </td>
                  <td className="border px-4 py-2">
                    {submission.submission_status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showTemplate && (
        <QuestionTemplate
          onClose={() => {
            setShowTemplate(false);
            resetTemplateSaved();
          }}
          unitCode={unitCode}
          projectName={projectName}
        />
      )}

      {showViewTemplatePopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Question Template</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-64">
              {questionTemplate ? JSON.stringify(questionTemplate, null, 2) : "No template available."}
            </pre>
            <button
              onClick={() => setShowViewTemplatePopup(false)}
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
