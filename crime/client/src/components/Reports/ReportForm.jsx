import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ReportContext } from '../../context/ReportContext';
import { submitReport, updateReport, deleteReport } from '../../utils/api';
import { FaMapMarkerAlt, FaClock, FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';

const ReportForm = () => {
  const { user } = useContext(AuthContext);
  const { reports, fetchReports } = useContext(ReportContext);
  const [crimeType, setCrimeType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editId, setEditId] = useState(null);
  const [viewRecordId, setViewRecordId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const navigate = useNavigate();

  const colors = {
    primary: '#3b82f6',
    primaryDark: '#2563eb',
    secondary: '#60a5fa',
    accent: '#f59e0b',
    accentWarm: '#ef4444',
    background: '#0a0e1a',
    card: '#1e293b',
    cardLight: '#334155',
    text: '#ffffff',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    border: '#475569',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b'
  };

  const containerStyles = {
    maxWidth: '900px',
    margin: '2rem auto',
    padding: '2.5rem',
    background: `linear-gradient(145deg, ${colors.card} 0%, ${colors.background} 100%)`,
    color: colors.text,
    borderRadius: '20px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
    border: `1px solid ${colors.border}`,
    position: 'relative',
    overflow: 'hidden'
  };

  const headerAccentStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`
  };

  const titleStyles = {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 800,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.8rem'
  };

  const formGroupStyles = {
    marginBottom: '1.8rem'
  };

  const labelStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 600,
    marginBottom: '0.8rem',
    color: colors.textSecondary,
    fontSize: '1rem',
    letterSpacing: '0.3px'
  };

  const inputStyles = {
    width: '100%',
    padding: '1rem 1.3rem',
    fontSize: '1rem',
    border: `2px solid ${colors.border}`,
    borderRadius: '12px',
    background: colors.cardLight,
    color: colors.text,
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  };

  const textareaStyles = {
    ...inputStyles,
    minHeight: '120px',
    resize: 'vertical',
    lineHeight: '1.6'
  };

  const selectStyles = {
    ...inputStyles,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%2394a3b8' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
    backgroundSize: '12px',
    paddingRight: '2.5rem'
  };

  const buttonStyles = {
    padding: '1.1rem 2rem',
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
    color: colors.text,
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 700,
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.8rem',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
    letterSpacing: '0.5px',
    position: 'relative',
    overflow: 'hidden'
  };

  const errorStyles = {
    color: colors.text,
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))',
    padding: '1.2rem 1.5rem',
    borderRadius: '12px',
    borderLeft: `4px solid ${colors.error}`,
    fontWeight: 600,
    marginBottom: '1.5rem',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem'
  };

  const successStyles = {
    ...errorStyles,
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
    borderLeftColor: colors.success,
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
  };

  useEffect(() => {
    if (!user) navigate('/login');
    getCurrentLocation();
  }, [user, navigate]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat.toString());
        setLongitude(lng.toString());
        
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          );
          const data = await response.json();
          setLocation(data.locality || data.city || data.principalSubdivision || 'Location detected');
        } catch (err) {
          setLocation('Location detected');
        }
        
        setLocationLoading(false);
      },
      (err) => {
        setError('Unable to retrieve your location: ' + err.message);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!crimeType || !description || !location || !time) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setLoading(true);
    try {
      const reportData = {
        crimeType,
        description,
        location,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        time,
      };
      
      if (editId) {
        await updateReport(editId, reportData);
        setSuccess('✅ Crime report updated successfully!');
      } else {
        await submitReport(reportData);
        setSuccess('✅ Crime report submitted successfully!');
      }
      
      setCrimeType('');
      setDescription('');
      setLocation('');
      setLatitude('');
      setLongitude('');
      setTime('');
      setEditId(null);
      await fetchReports();
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError('⚠️ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (report) => {
    setCrimeType(report.crimeType);
    setDescription(report.description);
    setLocation(report.location);
    setLatitude(report.latitude || '');
    setLongitude(report.longitude || '');
    setTime(report.time);
    setEditId(report.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this report? This action cannot be undone.')) return;
    
    try {
      await deleteReport(reportId);
      setSuccess('✅ Report deleted successfully!');
      await fetchReports();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('⚠️ Error deleting report: ' + err.message);
    }
  };

  const toggleViewRecord = (id) => {
    setViewRecordId(viewRecordId === id ? null : id);
  };

  const getCrimeColor = (type) => {
    const typeColors = {
      Theft: '#ef4444',
      Assault: '#dc2626',
      Vandalism: '#f59e0b',
      Other: '#3b82f6'
    };
    return typeColors[type] || colors.border;
  };

  return (
    <div style={containerStyles}>
      <div style={headerAccentStyles}></div>
      
      <h2 style={titleStyles}>
        <span style={{ fontSize: '2.8rem' }}>📝</span>
        {editId ? 'Edit Crime Report' : 'Report a Crime'}
      </h2>
      
      {error && <div style={errorStyles}>⚠️ {error}</div>}
      {success && <div style={successStyles}><FaCheckCircle /> {success}</div>}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '3rem' }}>
        <div style={formGroupStyles}>
          <label style={labelStyles}>
            <span style={{ fontSize: '1.2rem' }}>🚨</span>
            Type of Crime *
          </label>
          <select
            style={selectStyles}
            value={crimeType}
            onChange={(e) => setCrimeType(e.target.value)}
            onFocus={e => {
              e.target.style.borderColor = colors.primary;
              e.target.style.boxShadow = `0 0 0 3px rgba(59, 130, 246, 0.1)`;
            }}
            onBlur={e => {
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = 'none';
            }}
            required
          >
            <option value="">Select crime type</option>
            <option value="Theft">Theft</option>
            <option value="Assault">Assault</option>
            <option value="Vandalism">Vandalism</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={formGroupStyles}>
          <label style={labelStyles}>
            <span style={{ fontSize: '1.2rem' }}>📋</span>
            Description *
          </label>
          <textarea
            style={textareaStyles}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide detailed information about the incident..."
            onFocus={e => {
              e.target.style.borderColor = colors.primary;
              e.target.style.boxShadow = `0 0 0 3px rgba(59, 130, 246, 0.1)`;
            }}
            onBlur={e => {
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = 'none';
            }}
            required
          />
        </div>

        <div style={formGroupStyles}>
          <label style={labelStyles}>
            <FaMapMarkerAlt style={{ color: colors.accent }} />
            Location *
          </label>
          <input
            style={inputStyles}
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter the location..."
            onFocus={e => {
              e.target.style.borderColor = colors.primary;
              e.target.style.boxShadow = `0 0 0 3px rgba(59, 130, 246, 0.1)`;
            }}
            onBlur={e => {
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = 'none';
            }}
            required
          />
        </div>

        <div style={formGroupStyles}>
          <label style={labelStyles}>
            <span style={{ fontSize: '1.2rem' }}>🌍</span>
            GPS Coordinates (Auto-detected)
          </label>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <input
                style={{ ...inputStyles, background: colors.background }}
                type="number"
                step="any"
                value={latitude}
                placeholder="Latitude"
                readOnly
              />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <input
                style={{ ...inputStyles, background: colors.background }}
                type="number"
                step="any"
                value={longitude}
                placeholder="Longitude"
                readOnly
              />
            </div>
          </div>
          <button 
            type="button" 
            onClick={getCurrentLocation}
            style={{ 
              ...buttonStyles, 
              background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentWarm})`,
              marginTop: '1rem',
              opacity: locationLoading ? 0.6 : 1
            }}
            disabled={locationLoading}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(245, 158, 11, 0.4)';
            }}
          >
            {locationLoading ? '🔄 Detecting Location...' : '📍 Refresh My Location'}
          </button>
        </div>

        <div style={formGroupStyles}>
          <label style={labelStyles}>
            <FaClock style={{ color: colors.accent }} />
            Date & Time *
          </label>
          <input
            style={inputStyles}
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            onFocus={e => {
              e.target.style.borderColor = colors.primary;
              e.target.style.boxShadow = `0 0 0 3px rgba(59, 130, 246, 0.1)`;
            }}
            onBlur={e => {
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = 'none';
            }}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              ...buttonStyles,
              flex: 1,
              minWidth: '200px',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.6)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
            }}
          >
            {loading ? '⏳ Processing...' : editId ? '✏️ Update Report' : '📤 Submit Report'}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setCrimeType('');
                setDescription('');
                setLocation('');
                setLatitude('');
                setLongitude('');
                setTime('');
              }}
              style={{ 
                ...buttonStyles,
                background: colors.cardLight,
                color: colors.textSecondary,
                minWidth: '150px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              ❌ Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div style={{ 
        marginTop: '3rem', 
        paddingTop: '2.5rem', 
        borderTop: `2px solid ${colors.border}` 
      }}>
        <h3 style={{ 
          fontSize: '2rem', 
          marginBottom: '2rem', 
          color: colors.text, 
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem'
        }}>
          <span style={{ fontSize: '2.2rem' }}>📊</span>
          Your Previous Reports
        </h3>
        
        {reports.length === 0 ? (
          <p style={{ 
            color: colors.textMuted, 
            textAlign: 'center', 
            padding: '3rem',
            fontSize: '1.1rem',
            background: colors.background,
            borderRadius: '12px',
            border: `1px dashed ${colors.border}`
          }}>
            📭 No crime reports submitted yet. Be the first to report and help keep your community safe!
          </p>
        ) : (
          reports.map((report) => (
            <div 
              key={report.id} 
              onClick={() => toggleViewRecord(report.id)}
              style={{
                marginBottom: '1.5rem',
                padding: '1.8rem',
                background: colors.cardLight,
                border: `1px solid ${colors.border}`,
                borderLeft: `4px solid ${getCrimeColor(report.crimeType)}`,
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateX(8px)';
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(0, 0, 0, 0.5)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <h4 style={{ margin: 0, color: colors.text, fontWeight: 700, fontSize: '1.3rem', marginBottom: '0.8rem' }}>
                    {report.crimeType}
                  </h4>
                  <p style={{ margin: '0.8rem 0', color: colors.textSecondary, fontSize: '1rem', lineHeight: '1.6' }}>
                    {report.description.length > 150 ? `${report.description.substring(0, 150)}...` : report.description}
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem', fontSize: '0.9rem', color: colors.textMuted }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FaMapMarkerAlt /> {report.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FaClock /> {new Date(report.time).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    padding: '0.6rem 1.2rem', 
                    background: getCrimeColor(report.crimeType),
                    color: colors.text,
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {report.status || 'PENDING'}
                  </div>
                </div>
              </div>
              
              {viewRecordId === report.id && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1.8rem',
                  background: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '12px',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '1.2rem', color: colors.text, fontSize: '1.2rem' }}>
                    📄 Report Details
                  </p>
                  <div style={{ display: 'grid', gap: '0.8rem', color: colors.textSecondary }}>
                    <p style={{ margin: 0 }}><strong>Location:</strong> {report.location}</p>
                    {report.latitude && <p style={{ margin: 0 }}><strong>Latitude:</strong> {report.latitude}</p>}
                    {report.longitude && <p style={{ margin: 0 }}><strong>Longitude:</strong> {report.longitude}</p>}
                    <p style={{ margin: 0 }}><strong>Time:</strong> {new Date(report.time).toLocaleString()}</p>
                    <p style={{ margin: 0 }}><strong>Status:</strong> {report.status}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(report);
                      }}
                      style={{ 
                        ...buttonStyles,
                        padding: '0.8rem 1.5rem',
                        background: colors.secondary,
                        flex: 1,
                        minWidth: '140px'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(96, 165, 250, 0.5)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(96, 165, 250, 0.4)';
                      }}
                    >
                      <FaEdit /> Edit Report
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(report.id);
                      }}
                      style={{ 
                        ...buttonStyles,
                        padding: '0.8rem 1.5rem',
                        background: `linear-gradient(135deg, ${colors.error}, #dc2626)`,
                        flex: 1,
                        minWidth: '140px'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.5)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.4)';
                      }}
                    >
                      <FaTrash /> Delete Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportForm;