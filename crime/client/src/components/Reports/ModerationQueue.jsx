import React, { useCallback, useEffect, useState } from 'react';
import { getPendingReports, moderateReport } from '../../utils/api';

const ModerationQueue = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setReports(await getPendingReports());
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to load the moderation queue.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const review = async (reportId, status) => {
    setBusyId(reportId);
    setError('');
    try {
      await moderateReport(reportId, { status });
      await loadReports();
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to update this report.');
    } finally {
      setBusyId('');
    }
  };

  if (loading) return <p role="status">Loading moderation queue…</p>;
  return (
    <section aria-labelledby="moderation-heading">
      <h2 id="moderation-heading">Pending report moderation</h2>
      <p>Verified reports become visible on the public map and in analytics.</p>
      {error && <p className="auth-error" role="alert">{error}</p>}
      {reports.length === 0 ? (
        <p>There are no pending reports to review.</p>
      ) : reports.map((report) => (
        <article className="moderation-card" key={report.id}>
          <h3>{report.crimeType} — {report.location}</h3>
          <p>{report.description}</p>
          <p>{new Date(report.time).toLocaleString()} · {report.latitude}, {report.longitude}</p>
          <div className="moderation-actions">
            <button type="button" disabled={busyId === report.id} onClick={() => review(report.id, 'verified')}>
              Verify
            </button>
            <button type="button" className="reject-button" disabled={busyId === report.id} onClick={() => review(report.id, 'rejected')}>
              Reject
            </button>
          </div>
        </article>
      ))}
    </section>
  );
};

export default ModerationQueue;
