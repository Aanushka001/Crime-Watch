import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../../utils/api';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({
    total: 0,
    byType: [],
    byTimeOfDay: { morning: 0, afternoon: 0, evening: 0, night: 0 },
    recentTrend: 'stable',
    topLocations: []
  });

  const colors = {
    primary: '#3b82f6',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    purple: '#8b5cf6',
    card: '#191B20',
    cardLight: '#242730',
    text: '#ffffff',
    textSecondary: '#A8AFBC',
    border: '#3B414D'
  };

  useEffect(() => {
    fetchAndAnalyze();
  }, []);

  const fetchAndAnalyze = async () => {
    try {
      setAnalytics(await getAnalytics());
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load analytics.');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCrimeColor = (crimeType) => {
    const colorMap = {
      Theft: colors.error,
      Assault: colors.warning,
      Vandalism: '#A78BFA',
      Burglary: '#EAB308',
      Robbery: '#991b1b',
      'Vehicle Crime': '#ea580c',
      Other: '#9CA3AF'
    };
    return colorMap[crimeType] || colors.border;
  };

  if (loading) {
    return (
      <div style={{ color: colors.text, textAlign: 'center', padding: '2rem' }}>
        Loading analytics...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', color: colors.text }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Crime Analytics Dashboard</h2>
      {error && <p className="auth-error" role="alert">{error}</p>}

      <p style={{ fontSize: '1rem', color: colors.textSecondary }}>
        Verified reports: {analytics.total}
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>

        <div style={{ background: colors.card, padding: '1.5rem', borderRadius: '12px' }}>
          <h3>Reports by Crime Type</h3>
          {analytics.byType.map(({ crimeType, count }) => (
            <p key={crimeType} style={{ color: getCrimeColor(crimeType) }}>
              {crimeType}: {count}
            </p>
          ))}
        </div>

        <div style={{ background: colors.card, padding: '1.5rem', borderRadius: '12px' }}>
          <h3>Reports by Time of Day</h3>
          <p>Morning: {analytics.byTimeOfDay.morning}</p>
          <p>Afternoon: {analytics.byTimeOfDay.afternoon}</p>
          <p>Evening: {analytics.byTimeOfDay.evening}</p>
          <p>Night: {analytics.byTimeOfDay.night}</p>
        </div>

        <div style={{ background: colors.card, padding: '1.5rem', borderRadius: '12px' }}>
          <h3>Verified reports</h3>
          <p style={{ color: colors.textSecondary }}>{analytics.total} total</p>
        </div>

        <div style={{ background: colors.card, padding: '1.5rem', borderRadius: '12px' }}>
          <h3>Top Locations</h3>
          {analytics.topLocations.map((loc) => (
            <p key={loc.location}>{loc.location}: {loc.count}</p>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Analytics;
