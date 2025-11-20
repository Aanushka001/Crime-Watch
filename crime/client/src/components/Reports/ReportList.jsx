import React, { useContext, useEffect } from 'react';
import { ReportContext } from '../../context/ReportContext';

const ReportList = () => {
  const { reports, loading, fetchReports } = useContext(ReportContext);

  const containerStyles = {
    padding: '2rem',
    background: '#1e293b',
    color: '#ffffff',
    borderRadius: '12px',
    margin: '2rem auto',
    maxWidth: '800px'
  };

  const listStyles = {
    listStyle: 'none',
    padding: 0
  };

  const listItemStyles = {
    background: '#0f172a',
    padding: '1rem',
    marginBottom: '0.5rem',
    borderRadius: '8px',
    border: '1px solid #475569'
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return <div style={{ color: '#ffffff', textAlign: 'center', padding: '2rem' }}>Loading reports...</div>;
  }

  return (
    <div style={containerStyles}>
      <h2 style={{ color: '#2563eb', marginBottom: '1rem' }}>Crime Reports</h2>
      <ul style={listStyles}>
        {reports.map((report) => (
          <li key={report.id} style={listItemStyles}>
            <strong>{report.crimeType}</strong> at {report.location}: {report.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportList;