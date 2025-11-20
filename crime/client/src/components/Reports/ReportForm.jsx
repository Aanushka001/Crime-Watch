import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ReportContext } from '../../context/ReportContext';
import { submitReport, updateReport, deleteReport } from '../../utils/api';

const ReportCrime = () => {
  const { user } = useContext(AuthContext);
  const { reports, fetchReports } = useContext(ReportContext);
  const [crimeType, setCrimeType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [viewRecordId, setViewRecordId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const navigate = useNavigate();

  const colors = {
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    secondary: '#3b82f6',
    background: '#0f172a',
    card: '#1e293b',
    cardLight: '#334155',
    text: '#ffffff',
    textSecondary: '#e2e8f0',
    textMuted: '#94a3b8',
    border: '#475569',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b'
  };

  const containerStyles = {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '30px',
    background: colors.card,
    color: colors.text,
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    border: `1px solid ${colors.border}`
  };

  const titleStyles = {
    fontSize: '2rem',
    marginBottom: '25px',
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 700,
    textAlign: 'center'
  };

  const formGroupStyles = {
    marginBottom: '20px'
  };

  const labelStyles = {
    display: 'block',
    fontWeight: 600,
    marginBottom: '8px',
    color: colors.textSecondary,
    fontSize: '0.95rem'
  };

  const inputStyles = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: `2px solid ${colors.border}`,
    borderRadius: '12px',
    background: colors.background,
    color: colors.text,
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  };

  const textareaStyles = {
    ...inputStyles,
    minHeight: '100px',
    resize: 'vertical',
    lineHeight: '1.5'
  };

  const selectStyles = {
    ...inputStyles,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='${encodeURIComponent(colors.textMuted)}' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '12px'
  };

  const buttonStyles = {
    padding: '12px 24px',
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
  };

  const errorStyles = {
    color: colors.error,
    background: `rgba(239, 68, 68, 0.1)`,
    padding: '12px 16px',
    borderRadius: '12px',
    borderLeft: `4px solid ${colors.error}`,
    fontWeight: 600,
    marginBottom: '20px'
  };

  useEffect(() => {
    if (!user) navigate('/login');
    getCurrentLocation();
  }, [user, navigate]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
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
          setLocation(data.locality || data.city || data.principalSubdivision || 'Unknown location');
        } catch (err) {
          setLocation('Location detected');
        }
        
        setLocationLoading(false);
      },
      (err) => {
        alert('Error getting location: ' + err.message);
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
        alert('Crime report updated successfully!');
      } else {
        await submitReport(reportData);
        alert('Crime report submitted successfully!');
      }
      setCrimeType('');
      setDescription('');
      setLocation('');
      setLatitude('');
      setLongitude('');
      setTime('');
      setEditId(null);
      await fetchReports();
    } catch (err) {
      setError(err.message);
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
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await deleteReport(reportId);
      alert('Report deleted successfully!');
      await fetchReports();
    } catch (err) {
      alert('Error deleting report: ' + err.message);
    }
  };

  const toggleViewRecord = (id) => {
    setViewRecordId(viewRecordId === id ? null : id);
  };

  return (
    <div style={containerStyles}>
      <h2 style={titleStyles}>{editId ? 'Edit Crime Report' : 'Report a Crime'}</h2>
      {error && <div style={errorStyles}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={formGroupStyles}>
          <label style={labelStyles} htmlFor="crimeType">Type of Crime:</label>
          <select
            style={selectStyles}
            id="crimeType"
            value={crimeType}
            onChange={(e) => setCrimeType(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Theft">Theft</option>
            <option value="Assault">Assault</option>
            <option value="Vandalism">Vandalism</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={formGroupStyles}>
          <label style={labelStyles} htmlFor="description">Description:</label>
          <textarea
            style={textareaStyles}
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the crime..."
            required
          />
        </div>

        <div style={formGroupStyles}>
          <label style={labelStyles} htmlFor="location">Location:</label>
          <input
            style={inputStyles}
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter the location..."
            required
          />
        </div>

        <div style={formGroupStyles}>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyles} htmlFor="latitude">Latitude:</label>
              <input
                style={inputStyles}
                id="latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Auto-detected"
                readOnly
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyles} htmlFor="longitude">Longitude:</label>
              <input
                style={inputStyles}
                id="longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Auto-detected"
                readOnly
              />
            </div>
          </div>
          <button 
            type="button" 
            onClick={getCurrentLocation}
            style={{ 
              ...buttonStyles, 
              background: colors.secondary,
              marginTop: '10px',
              opacity: locationLoading ? 0.6 : 1
            }}
            disabled={locationLoading}
          >
            {locationLoading ? 'Detecting Location...' : 'Refresh Location'}
          </button>
        </div>

        <div style={formGroupStyles}>
          <label style={labelStyles} htmlFor="time">Time:</label>
          <input
            style={inputStyles}
            id="time"
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              ...buttonStyles, 
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Submitting...' : editId ? 'Update Report' : 'Submit Report'}
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
                color: colors.textSecondary
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: `1px solid ${colors.border}` }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: colors.text, fontWeight: 600 }}>
          Your Previous Reports
        </h3>
        {reports.length === 0 ? (
          <p style={{ color: colors.textMuted, textAlign: 'center', padding: '20px' }}>
            No crime reports submitted yet.
          </p>
        ) : (
          reports.map((report) => (
            <div 
              key={report.id} 
              onClick={() => toggleViewRecord(report.id)}
              style={{
                marginBottom: '15px',
                padding: '20px',
                background: colors.background,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, color: colors.text, fontWeight: 600, fontSize: '1.1rem' }}>
                    {report.crimeType}
                  </h4>
                  <p style={{ margin: '8px 0 0', color: colors.textMuted, fontSize: '0.9rem', lineHeight: '1.4' }}>
                    {report.description.length > 100 ? `${report.description.substring(0, 100)}...` : report.description}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    padding: '4px 8px', 
                    background: report.status === 'pending' ? colors.warning : colors.success,
                    color: colors.text,
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    {report.status?.charAt(0).toUpperCase() + report.status?.slice(1) || 'Pending'}
                  </div>
                  <p style={{ margin: '4px 0 0', color: colors.textMuted, fontSize: '0.8rem' }}>
                    {new Date(report.time).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {viewRecordId === report.id && (
                <div style={{
                  marginTop: '15px',
                  padding: '20px',
                  background: colors.cardLight,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '12px'
                }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '15px', color: colors.text, fontSize: '1.1rem' }}>
                    Report Details
                  </p>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    <p style={{ color: colors.textSecondary, margin: 0 }}>
                      <strong>Location:</strong> {report.location}
                    </p>
                    {report.latitude && (
                      <p style={{ color: colors.textSecondary, margin: 0 }}>
                        <strong>Latitude:</strong> {report.latitude}
                      </p>
                    )}
                    {report.longitude && (
                      <p style={{ color: colors.textSecondary, margin: 0 }}>
                        <strong>Longitude:</strong> {report.longitude}
                      </p>
                    )}
                    <p style={{ color: colors.textSecondary, margin: 0 }}>
                      <strong>Time:</strong> {new Date(report.time).toLocaleString()}
                    </p>
                    <p style={{ color: colors.textSecondary, margin: 0 }}>
                      <strong>Status:</strong> {report.status}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(report);
                      }}
                      style={{ 
                        padding: '8px 16px',
                        background: colors.secondary,
                        color: colors.text,
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 500
                      }}
                    >
                      Edit Report
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(report.id);
                      }}
                      style={{ 
                        padding: '8px 16px',
                        background: colors.error,
                        color: colors.text,
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 500
                      }}
                    >
                      Delete Report
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

export default ReportCrime;