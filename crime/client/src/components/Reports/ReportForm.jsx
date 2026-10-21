import React, { useContext, useState } from 'react';
import { submitReport, updateReport } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const toDateTimeInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const ReportForm = ({ initialReport, onSaved }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    crimeType: initialReport?.crimeType || 'Theft',
    description: initialReport?.description || '',
    location: initialReport?.location || '',
    latitude: initialReport?.latitude ?? '',
    longitude: initialReport?.longitude ?? '',
    time: toDateTimeInput(initialReport?.time) || toDateTimeInput(new Date())
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [locating, setLocating] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('This browser does not support location detection.');
      return Promise.reject(new Error('Geolocation is not supported'));
    }
    setLocating(true);
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setError('');
          setForm((current) => ({
            ...current,
            latitude: coords.latitude.toFixed(6),
            longitude: coords.longitude.toFixed(6)
          }));
          setLocating(false);
          resolve({
            latitude: coords.latitude,
            longitude: coords.longitude
          });
        },
        (locationError) => {
          const message = locationError.message || 'Unable to read your location.';
          setError(message);
          setLocating(false);
          reject(new Error(message));
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      let latitude = Number(form.latitude);
      let longitude = Number(form.longitude);
      if (!form.latitude || !form.longitude) {
        const coords = await useCurrentLocation();
        latitude = coords.latitude;
        longitude = coords.longitude;
      }
      const payload = {
        ...form,
        latitude,
        longitude,
        time: new Date(form.time).toISOString(),
        isAnonymous
      };
      if (!user && !isAnonymous) {
        setError('Sign in to submit a report with your account attached.');
        navigate('/login');
        return;
      }
      if (initialReport) {
        await updateReport(initialReport.id, payload);
        setMessage('Report updated.');
      } else {
        await submitReport(payload);
        setForm({
          crimeType: 'Theft',
          description: '',
          location: '',
          latitude: '',
          longitude: '',
          time: toDateTimeInput(new Date())
        });
        setMessage(`${isAnonymous ? 'Anonymous report' : 'Report'} submitted and is awaiting moderator review.${user ? ' It will remain in your private report history.' : ' Sign in to view your own report history.'}`);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.message || 'Unable to save this report.');
      return;
    } finally {
      setSaving(false);
    }
    if (onSaved) {
      try {
        await onSaved();
      } catch (_refreshError) {
        setError('The report was saved, but the report list could not be refreshed.');
      }
    }
  };

  return (
    <section className="report-form-container" aria-labelledby="report-form-heading">
      <h2 id="report-form-heading">{initialReport ? 'Edit Pending Report' : 'Report a Crime'}</h2>
      <p>Reports are reviewed by a moderator before they appear on the public map. You can submit without signing in.</p>
      {error && <p className="auth-error" role="alert">{error}</p>}
      {message && <p className="success-message" role="status">{message}</p>}
      <form className="report-form" onSubmit={handleSubmit}>
        <label>
          Crime type
          <select name="crimeType" value={form.crimeType} onChange={updateField} required>
            {['Theft', 'Assault', 'Vandalism', 'Burglary', 'Robbery', 'Vehicle Crime', 'Other'].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
        <label>
          Incident date and time
          <input type="datetime-local" name="time" value={form.time} onChange={updateField} required />
        </label>
        <label>
          Location or address
          <input name="location" maxLength="300" value={form.location} onChange={updateField} required />
        </label>
        <div className="coordinates-row">
          <label>
            Latitude
            <input type="number" name="latitude" min="-90" max="90" step="any" value={form.latitude} onChange={updateField} />
          </label>
          <label>
            Longitude
            <input type="number" name="longitude" min="-180" max="180" step="any" value={form.longitude} onChange={updateField} />
          </label>
        </div>
        <button
          className="secondary-button"
          type="button"
          onClick={() => useCurrentLocation().catch(() => {})}
          disabled={locating}
        >
          {locating ? 'Getting location…' : 'Use my current coordinates'}
        </button>
        <label className="anonymous-choice">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(event) => setIsAnonymous(event.target.checked)}
          />
          <span>Submit anonymously (your identity is hidden from the public)</span>
        </label>
        {!user && !isAnonymous && (
          <p className="auth-hint">
            <button className="text-button" type="button" onClick={() => navigate('/login')}>Sign in</button>
            {' '}to attach this report to your private complaint history.
          </p>
        )}
        <label>
          What happened?
          <textarea name="description" rows="5" maxLength="3000" value={form.description} onChange={updateField} required />
        </label>
        <button type="submit" disabled={saving || locating}>{saving ? 'Saving…' : initialReport ? 'Save changes' : 'Submit report'}</button>
      </form>
    </section>
  );
};

export default ReportForm;
