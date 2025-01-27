import React, { useState, useEffect } from 'react';

const ReportViewer = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/reports/');
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        const data = await response.json();
        setReports(data.reports || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Could not fetch reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const downloadReport = async (reportId) => {
    try {
      const response = await fetch(`http://localhost:8000/reports/${reportId}/download`);
      if (!response.ok) {
        throw new Error('Failed to download report');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${reportId}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Error downloading report:', err);
      alert('Could not download the report. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Report Viewer</h2>
      {loading && <p>Loading reports...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && reports.length === 0 && <p>No reports available.</p>}
      {!loading && reports.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Patient ID</th>
              <th>Generated On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.patient_id}</td>
                <td>{report.generated_on}</td>
                <td>
                  <button onClick={() => downloadReport(report.id)}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReportViewer;
