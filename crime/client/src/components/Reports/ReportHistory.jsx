import React, { useContext, useState } from 'react';
import { ReportContext } from '../../context/ReportContext';
import { deleteReport } from '../../utils/api';
import { FaMapMarkerAlt, FaClock, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

const ReportHistory = () => {
  const { reports, fetchReports } = useContext(ReportContext);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const colors = {
    primary: '#3b82f6',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    card: '#1e293b',
    cardLight: '#334155',
    text: '#ffffff',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    border: '#475569'
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }
    
    setDeleteLoading(true);
    try {
      await deleteReport(reportId);
      await fetchReports();
    } catch (err) {
      alert('Error deleting report: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCrimeColor = (type) => {
    const colorMap = {
      Theft: colors.error,
      Assault: '#dc2626',
      Vandalism: colors.warning,
      Burglary: '#8b5cf6',
      Robbery: '#991b1b',
      'Vehicle Crime': '#ea580c',
      Other: colors.primary
    };
    return colorMap[type] || colors.border;
  };

  const headerStyles = {
    marginBottom: '2rem'
  };

  const reportCardStyles = {
    marginBottom: '1.5rem',
    padding: '1.8rem',
    background: colors.cardLight,
    border: `1px solid ${colors.border}`,
    borderLeft: `4px solid`,
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const detailsStyles = {
    marginTop: '1.5rem',
    padding: '1.5rem',
    background: colors.card,
    borderRadius: '10px',
    border: `1px solid ${colors.border}`,
    animation: 'fadeIn 0.3s ease'
  };

  const buttonStyles = {
    padding: '0.8rem 1.5rem',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem'
  };

  if (reports.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
        <h3 style={{ color: colors.text, fontSize: '1.5rem', marginBottom: '0.8rem' }}>
          No Reports Yet
        </h3>
        <p style={{ color: colors.textMuted, fontSize: '1rem' }}>
  You haven&apos;t submitted any crime reports yet. Go to the &quot;Report Crime&quot; tab to submit your first report.
</p>

      </div>
    );
  }

  return (
    <div>
      <div style={headerStyles}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: colors.text, fontWeight: 800 }}>
          📋 Your Crime Reports
        </h2>
        <p style={{ color: colors.textSecondary, fontSize: '1rem' }}>
          Total reports: <strong>{reports.length}</strong>
        </p>
      </div>

      {reports.map((report) => (
        <div 
          key={report.id}
          style={{
            ...reportCardStyles,
            borderLeftColor: getCrimeColor(report.crimeType)
          }}
          onClick={() => toggleExpand(report.id)}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateX(8px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
                <h4 style={{ margin: 0, color: colors.text, fontWeight: 700, fontSize: '1.3rem' }}>
                  {report.crimeType}
                </h4>
                <div style={{ 
                  padding: '0.4rem 0.8rem', 
                  background: getCrimeColor(report.crimeType),
                  color: colors.text,
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {report.status || 'PENDING'}
                </div>
              </div>
              
              <p style={{ margin: '0.8rem 0', color: colors.textSecondary, fontSize: '1rem', lineHeight: '1.6' }}>
                {report.description.length > 150 
                  ? `${report.description.substring(0, 150)}...` 
                  : report.description}
              </p>
              
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem', fontSize: '0.9rem', color: colors.textMuted }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FaMapMarkerAlt /> {report.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FaClock /> {new Date(report.time).toLocaleString()}
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              {expandedId === report.id ? (
                <FaEyeSlash style={{ fontSize: '1.5rem', color: colors.primary }} />
              ) : (
                <FaEye style={{ fontSize: '1.5rem', color: colors.textMuted }} />
              )}
            </div>
          </div>
          
          {expandedId === report.id && (
            <div style={detailsStyles} onClick={(e) => e.stopPropagation()}>
              <h4 style={{ marginBottom: '1rem', color: colors.text, fontWeight: 700 }}>
                📄 Full Report Details
              </h4>
              
              <div style={{ display: 'grid', gap: '0.8rem', color: colors.textSecondary, marginBottom: '1.5rem' }}>
                <div>
                  <strong style={{ color: colors.text }}>Crime Type:</strong> {report.crimeType}
                </div>
                <div>
                  <strong style={{ color: colors.text }}>Description:</strong><br />
                  <span style={{ lineHeight: '1.6' }}>{report.description}</span>
                </div>
                <div>
                  <strong style={{ color: colors.text }}>Location:</strong> {report.location}
                </div>
                {report.latitude && (
                  <div>
                    <strong style={{ color: colors.text }}>Coordinates:</strong> {report.latitude}, {report.longitude}
                  </div>
                )}
                <div>
                  <strong style={{ color: colors.text }}>Date & Time:</strong> {new Date(report.time).toLocaleString()}
                </div>
                <div>
                  <strong style={{ color: colors.text }}>Status:</strong>{' '}
                  <span style={{ 
                    color: report.status === 'resolved' ? colors.success : colors.warning,
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    {report.status || 'PENDING'}
                  </span>
                </div>
                <div>
                  <strong style={{ color: colors.text }}>Report ID:</strong> {report.id}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  style={{ 
                    ...buttonStyles,
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: colors.text,
                    flex: 1,
                    minWidth: '150px'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.5)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => {
                    // Navigate to edit (you'll need to implement this)
                    console.log('Edit report:', report.id);
                  }}
                >
                  <FaEdit /> Edit Report
                </button>
                
                <button
                  style={{ 
                    ...buttonStyles,
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: colors.text,
                    flex: 1,
                    minWidth: '150px',
                    opacity: deleteLoading ? 0.6 : 1
                  }}
                  onMouseEnter={e => {
                    if (!deleteLoading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.5)';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => handleDelete(report.id)}
                  disabled={deleteLoading}
                >
                  <FaTrash /> Delete Report
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReportHistory;