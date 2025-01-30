import React, { useState } from 'react';

const PACSViewer = () => {
  const [patientId, setPatientId] = useState('');
  const [modality, setModality] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/pacs/images/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientId, modality, date_range: dateRange }),
      });
      const result = await response.json();
      setImages(result.images || []);
    } catch (error) {
      console.error('Error fetching PACS images:', error);
    }
  };

  return (
    <div>
      <h2>PACS Viewer</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Patient ID:
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
          />
        </label>
        <label>
          Modality:
          <input
            type="text"
            value={modality}
            onChange={(e) => setModality(e.target.value)}
            placeholder="e.g., CT, MRI"
          />
        </label>
        <label>
          Date Range:
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </label>
        <button type="submit">Fetch Images</button>
      </form>
      {images.length > 0 ? (
        <div>
          <h3>Images</h3>
          <ul>
            {images.map((image, index) => (
              <li key={index}>
                {image.id} - {image.modality} ({image.date})
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No images found for the given patient ID and criteria.</p>
      )}
    </div>
  );
};

export default PACSViewer;
