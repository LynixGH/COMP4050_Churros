import React, { useState } from 'react';
import axios from 'axios';
import '@/app/styles/ConvertMarkingGuidePopup.css';

interface ConvertMarkingGuidePopupProps {
  onClose: () => void; // Close the popup
}

const ConvertMarkingGuidePopup: React.FC<ConvertMarkingGuidePopupProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [markingGuideId, setMarkingGuideId] = useState<string | null>(null); // Store the returned ID
  const [ulos, setUlos] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);

  // Handle file input change and auto-upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Auto-upload file and get the markingGuideID
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('staff_email', 'convener1@example.com'); // Hardcoded staff email

        const uploadResponse = await axios.post('http://3.106.214.31/marking_guide', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Log the full response structure for debugging
        console.log('Upload Response:', uploadResponse.data);

        // Attempt to extract markingGuideID from marking_guide_details
        const markingGuideID = uploadResponse.data?.marking_guide_details?.marking_guide_id;

        if (markingGuideID) {
          setMarkingGuideId(markingGuideID);
          alert(`File uploaded successfully! Marking Guide ID: ${markingGuideID}`);
        } else {
          console.error('Marking Guide ID not found in the response:', uploadResponse.data);
          alert('File uploaded, but failed to retrieve Marking Guide ID.');
        }
      } catch (error) {
        if (error.response) {
          console.error('Error response:', error.response);
          alert(`Error: ${error.response.data.message || 'File upload failed.'}`);
        } else if (error.request) {
          console.error('No response from server:', error.request);
          alert('No response from server. File upload failed.');
        } else {
          console.error('Error during file upload:', error.message);
          alert('An error occurred during file upload.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle ULO input change
  const handleUloChange = (index: number, value: string) => {
    const updatedUlos = [...ulos];
    updatedUlos[index] = value;
    setUlos(updatedUlos);
  };

  // Add new ULO input field
  const addUloField = () => {
    setUlos([...ulos, '']);
  };

  // Remove ULO field
  const removeUloField = (index: number) => {
    setUlos(ulos.filter((_, i) => i !== index));
  };

  // Handle form submission to send ULOs after file upload
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!markingGuideId) {
      alert('Please upload a file before submitting.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        //`http://3.106.214.31/convert_marking_guide/${markingGuideId}`,
        `http://3.106.214.31/convert_marking_guide/10`,
        {
          staff_email: 'ta1@example.com', // Hardcoded staff email
          ulos,
        }
      );

      if (response.status === 200) {
        alert('Marking guide successfully converted!');
        onClose();
      } else {
        console.error('Submission failed with status:', response.status, response.data);
        alert('Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting marking guide:', error);
      alert('An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-content">
        <h2>Convert Marking Guide</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="file">Upload Marking Guide (PDF):</label>
          <input
            type="file"
            id="file"
            name="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={loading || !!markingGuideId} // Disable if file uploaded or loading
          />

          <h3>Unit Learning Outcomes (ULOs)</h3>
          {ulos.map((ulo, index) => (
            <div key={index} className="field-row">
              <input
                type="text"
                value={ulo}
                onChange={(e) => handleUloChange(index, e.target.value)}
                placeholder={`ULO ${index + 1}`}
                disabled={loading}
              />
              {ulos.length > 1 && (
                <button
                  type="button"
                  className="remove-btn-small"
                  onClick={() => removeUloField(index)}
                  disabled={loading}
                >
                  Remove ULO
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addUloField}
            disabled={loading}
          >
            Add ULO
          </button>

          <button type="submit" disabled={loading || !markingGuideId}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          <button type="button" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConvertMarkingGuidePopup;
