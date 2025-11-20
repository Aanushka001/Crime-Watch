import React, { useContext, useEffect } from 'react';
import { ReportContext } from '../../context/ReportContext';

const ReportList = () => {
  const { reports, loading, fetchReports } = useContext(ReportContext);

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return <div>Loading reports...</div>;
  }

  return (
    <div>
      <h2>Crime Reports</h2>
      <ul>
        {reports.map((report) => (
          <li key={report.id}>
            {report.crimeType} at {report.location}: {report.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportList;