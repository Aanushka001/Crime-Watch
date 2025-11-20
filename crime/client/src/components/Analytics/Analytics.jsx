import React, { useEffect, useState } from 'react';
import { getPublicReports } from '../../utils/api';
import { FaChartBar, FaChartPie, FaClock, FaMapMarkedAlt } from 'react-icons/fa';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState({
    total: 0,
    byType: {},
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
    card: '#1e293b',
    cardLight: '#334155',
    text: '#ffffff',
    textSecondary: '#cbd5e1',
    border: '#475569'
  };

  useEffect(() => {
    fetchAndAnalyze();
  }, []);

  const fetchAndAnalyze = async () => {
    try {
      const data = await getPublicReports();
      setReports(data);
      analyzeData(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeData = (data) => {
    const byType = {};
    const timeOfDay = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    const locations = {};

    data.forEach(report => {
      byType[report.crimeType] = (byType[report.crimeType] || 0) + 1;

      const hour = new Date(report.time).getHours();
      if (hour >= 6 && hour < 12) timeOfDay.morning++;
      else if (hour >= 12 && hour < 18) timeOfDay.afternoon++;
      else if (hour >= 18 && hour < 22) timeOfDay.evening++;
      else timeOfDay.night++;

      locations[report.location] = (locations[report.location] || 0) + 1;
    });

    const topLocations = Object.entries(locations)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentCount = data.filter(r => new Date(r.time) > oneWeekAgo).length;
    const trend = recentCount > data.length / 4 ? 'increasing' :
                  recentCount < data.length / 8 ? 'decreasing' : 'stable';

    setAnalytics({
      total: data.length,
      byType,
      byTimeOfDay: timeOfDay,
      recentTrend: trend,
      topLocations
    });
  };

  const getCrimeColor = (crimeType) => {
    const colorMap = {
      Theft: colors.error,
      Assault: '#dc2626',
      Vandalism: colors.warning,
      Burglary: colors.purple,
      Robbery: '#991b1b',
      'Vehicle Crime': '#ea580c',
      Other: colors.primary
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

      <p style={{ fontSize: '1rem', color: colors.textSecondary }}>
        Total Reports Fetched: {reports.length}
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>

        <div style={{ background: colors.card, padding: '1.5rem', borderRadius: '12px' }}>
          <FaChartBar size={28} color={colors.primary} />
          <h3 style={{ marginTop: '1rem' }}>Reports by Crime Type</h3>
          {Object.entries(analytics.byType).map(([type, count]) => (
            <p key={type} style={{ color: getCrimeColor(type) }}>
              {type}: {count}
            </p>
          ))}
        </div>

        <div style={{ background: colors.card, padding: '1.5rem', borderRadius: '12px' }}>
          <FaClock size={28} color={colors.warning} />
          <h3 style={{ marginTop: '1rem' }}>Reports by Time of Day</h3>
          <p>Morning: {analytics.byTimeOfDay.morning}</p>
          <p>Afternoon: {analytics.byTimeOfDay.afternoon}</p>
          <p>Evening: {analytics.byTimeOfDay.evening}</p>
          <p>Night: {analytics.byTimeOfDay.night}</p>
        </div>

        <div style={{ background: colors.card, padding: '1.5rem', borderRadius: '12px' }}>
          <FaChartPie size={28} color={colors.success} />
          <h3 style={{ marginTop: '1rem' }}>Trend (Past Week)</h3>
          <p style={{ color: colors.textSecondary }}>{analytics.recentTrend}</p>
        </div>

        <div style={{ background: colors.card, padding: '1.5rem', borderRadius: '12px' }}>
          <FaMapMarkedAlt size={28} color={colors.purple} />
          <h3 style={{ marginTop: '1rem' }}>Top Locations</h3>
          {analytics.topLocations.map((loc) => (
            <p key={loc.location}>{loc.location}: {loc.count}</p>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Analytics;
