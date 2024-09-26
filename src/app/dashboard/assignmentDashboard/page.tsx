'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssignmentDashboard: React.FC = () => {
  const [unitName, setUnitName] = useState<string>('CS101'); // Example unit name
  const [assignmentName, setAssignmentName] = useState<string>('Fastest Scheduling Algorithm'); // Example assignment name
  const [submissions, setSubmissions] = useState<any[]>([]); // State to hold submissions
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSubmissions, setSelectedSubmissions] = useState<number[]>([]); // Track selected submission IDs

  useEffect(() => {
    // Fetch submissions when component mounts
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get('http://54.206.102.192/units/CS101/projects/FastestSchedulingAlgorithm/files');
      // Access the submission_files from the response data
      setSubmissions(response.data.submission_files);
    } catch (err) {
      console.error("Error fetching submissions", err);
      setError("Failed to fetch submissions.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setError(null); // Reset error on file selection
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setLoading(true); // Start loading state
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        await axios.post('http://54.206.102.192/units/CS101/projects/FastestSchedulingAlgorithm/files', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSelectedFile(null); // Clear the file input after submission
        fetchSubmissions(); // Refresh the submissions list after successful upload
      } catch (err) {
        console.error("Error uploading file", err);
        setError("Failed to upload file.");
      } finally {
        setLoading(false); // Stop loading state
      }
    }
  };

  const handleCheckboxChange = (submissionId: number) => {
    setSelectedSubmissions(prev => 
      prev.includes(submissionId) 
        ? prev.filter(id => id !== submissionId) 
        : [...prev, submissionId]
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{unitName} Dashboard</h1>
      <h2 className="text-xl mb-4">{assignmentName}</h2>

      {submissions.length === 0 ? (
        <div className="mb-4">
          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            className="border rounded px-2 py-1 mr-2"
          />
          <button onClick={handleUpload} className="bg-green-500 text-white px-4 py-2 rounded" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Submission'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      ) : null}

      <h3 className="text-lg font-semibold mt-4">Submissions</h3>
      {submissions.length === 0 ? (
        <p>No submissions uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto pr-10"> {/* Added right padding here */}
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
                        setSelectedSubmissions(submissions.map(submission => submission.submission_id));
                      }
                    }}
                    checked={selectedSubmissions.length === submissions.length}
                  />
                </th>
                <th className="border px-4 py-2">Submission ID</th>
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
                      checked={selectedSubmissions.includes(submission.submission_id)}
                      onChange={() => handleCheckboxChange(submission.submission_id)}
                    />
                  </td>
                  <td className="border px-4 py-2">{submission.submission_id}</td>
                  <td className="border px-4 py-2">{submission.submission_file_name}</td>
                  <td className="border px-4 py-2">{submission.submission_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignmentDashboard;
