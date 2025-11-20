import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';
import { ReportContext } from '../../context/ReportContext';
import { submitReport, updateReport, deleteReport } from '../../utils/api';

const Container = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #939185;
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;
`;

const Form = styled.form`
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #777777;
  color: #fff;
`;

const TextArea = styled.textarea`
  width: 98%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  min-height: 80px;
  background-color: #777777;
  color: #fff;
`;

const Input = styled.input`
  width: 98%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #777777;
  color: #fff;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #f9a825;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;

const PreviousReports = styled.div`
  margin-top: 30px;
`;

const ReportItem = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  background-color: #555;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
`;

const Details = styled.div`
  margin-top: 10px;
  padding: 10px;
  background-color: #666;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

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
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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
        time
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
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      await deleteReport(reportId);
      alert('Report deleted successfully!');
      await fetchReports();
    } catch (err) {
      alert('Error deleting report: ' + err.message);
    }
  };

  const toggleViewRecord = (recordId) => {
    setViewRecordId(viewRecordId === recordId ? null : recordId);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        (error) => {
          alert('Error getting location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <Container>
      <Title>{editId ? 'Edit Crime Report' : 'Report a Crime'}</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="crimeType">Type of Crime:</Label>
          <Select
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
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="description">Description:</Label>
          <TextArea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the crime..."
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="location">Location:</Label>
          <Input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter the location..."
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="latitude">Latitude (Optional):</Label>
          <Input
            type="number"
            step="any"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Enter latitude..."
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="longitude">Longitude (Optional):</Label>
          <Input
            type="number"
            step="any"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Enter longitude..."
          />
          <Button type="button" onClick={getCurrentLocation} style={{ marginTop: '10px' }}>
            Use Current Location
          </Button>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="time">Time:</Label>
          <Input
            type="datetime-local"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </FormGroup>
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : (editId ? 'Update Report' : 'Submit Report')}
        </Button>
        {editId && (
          <Button 
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
            style={{ marginLeft: '10px', backgroundColor: '#666' }}
          >
            Cancel Edit
          </Button>
        )}
      </Form>

      <PreviousReports>
        <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Your Previous Reports</h3>
        {reports.length === 0 ? (
          <p>No records available.</p>
        ) : (
          reports.map((report) => (
            <ReportItem key={report.id} onClick={() => toggleViewRecord(report.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: '0' }}>{report.crimeType}</h4>
                <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#fff' }}>{report.description}</p>
              </div>
              {viewRecordId === report.id && (
                <Details>
                  <p style={{ fontWeight: 'bold', marginBottom: '5px', color: '#fff' }}>Details:</p>
                  <p style={{ color: '#fff' }}>Location: {report.location}</p>
                  {report.latitude && <p style={{ color: '#fff' }}>Latitude: {report.latitude}</p>}
                  {report.longitude && <p style={{ color: '#fff' }}>Longitude: {report.longitude}</p>}
                  <p style={{ color: '#fff' }}>Time: {new Date(report.time).toLocaleString()}</p>
                  <p style={{ color: '#fff' }}>Status: {report.status}</p>
                  <ButtonGroup><button onClick={(e) => { e.stopPropagation(); handleEdit(report); }}>
                      Edit
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(report.id); }}
                      style={{ backgroundColor: '#d9534f' }}
                    >
                      Delete
                    </button>
                  </ButtonGroup>
                </Details>
              )}
            </ReportItem>
          ))
        )}
      </PreviousReports>
    </Container>
  );
};

export default ReportCrime;