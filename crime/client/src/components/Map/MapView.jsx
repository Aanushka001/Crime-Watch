import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle, useMap } from 'react-leaflet';
import { getPublicReports } from '../../utils/api';
import 'leaflet/dist/leaflet.css';

const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, map, zoom]);
  return null;
};

const MapView = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [crimeFilter, setCrimeFilter] = useState('');
  const [radiusKm, setRadiusKm] = useState(50);
  const [loadError, setLoadError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [locationError, setLocationError] = useState('');

  const colors = {
    primary: '#3b82f6',
    card: '#191B20',
    cardLight: '#242730',
    text: '#ffffff',
    textSecondary: '#A8AFBC',
    border: '#3B414D'
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError('');
    getPublicReports(100, crimeFilter, locationName ? userLocation : null, radiusKm)
      .then((data) => {
        if (active) setReports(data);
      })
      .catch((err) => {
        if (active) setLoadError(err.response?.data?.error || 'Unable to load verified reports.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [crimeFilter, locationName, radiusKm, userLocation]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setUserLocation([20, 0]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setLocationName('Your Location');
      },
      () => {
        setLocationError('Unable to retrieve your location');
        setUserLocation([20, 0]);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const getCrimeColor = (crimeType) => {
    const colors = {
      Theft: '#ef4444',
      Assault: '#f59e0b',
      Vandalism: '#a78bfa',
      Burglary: '#eab308',
      Robbery: '#991b1b',
      'Vehicle Crime': '#ea580c',
      Other: '#9ca3af'
    };
    return colors[crimeType] || '#6b7280';
  };

  const headerStyles = {
    marginBottom: '2rem',
    padding: '1.5rem',
    background: colors.cardLight,
    borderRadius: '12px',
    border: `1px solid ${colors.border}`
  };

  const mapContainerStyles = {
    width: '100%',
    height: '600px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
    border: `1px solid ${colors.border}`
  };

  if (loading || !userLocation) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: colors.textSecondary }}>
        <div>Loading map and detecting your location...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={headerStyles}>
        <h2 style={{ 
          fontSize: '1.8rem', 
          marginBottom: '0.8rem', 
          color: colors.text, 
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem'
        }}>
          Live Crime Map
        </h2>
        {locationName && (
          <p style={{ 
            fontSize: '1rem', 
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: 0
          }}>
            Your location: <strong>{locationName}</strong>
          </p>
        )}
        {locationError && (
          <p style={{ color: '#f59e0b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {locationError}
          </p>
        )}
        <label className="map-filter">
          Filter verified reports
          <select value={crimeFilter} onChange={(event) => setCrimeFilter(event.target.value)}>
            <option value="">All crime types</option>
            {['Theft', 'Assault', 'Vandalism', 'Burglary', 'Robbery', 'Vehicle Crime', 'Other'].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
        {locationName && (
          <label className="map-filter">
            Distance from your location
            <select value={radiusKm} onChange={(event) => setRadiusKm(Number(event.target.value))}>
              {[10, 25, 50, 100].map((distance) => (
                <option key={distance} value={distance}>{distance} km</option>
              ))}
            </select>
          </label>
        )}
        {loadError && <p className="auth-error" role="alert">{loadError}</p>}
        <p>{reports.length} verified report{reports.length === 1 ? '' : 's'} shown</p>
        {reports.some((report) => report.isDemo) && (
          <p role="note" style={{ color: '#F59E0B', fontWeight: 600 }}>
            Demo preview: some displayed reports are fictional sample data, not real incidents.
          </p>
        )}
        <p style={{ 
          fontSize: '0.95rem', 
          color: colors.textSecondary, 
          marginTop: '0.8rem',
          lineHeight: '1.6'
        }}>
          Interactive map showing crime incidents. {locationName
            ? 'Your location is marked with a blue circle.'
            : 'Location was not shared; pan and zoom the map to explore.'}
          Colored circles indicate crime zones — select a circle for details.
        </p>
      </div>

      <div style={mapContainerStyles}>
        <MapContainer 
          center={userLocation} 
          zoom={locationName ? 12 : 2}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={userLocation} zoom={locationName ? 12 : 2} />
          
          {locationName && <CircleMarker
            center={userLocation}
            radius={9}
            pathOptions={{ color: '#F3F4F6', fillColor: '#3B82F6', fillOpacity: 1, weight: 2 }}
          >
            <Popup>
              <div style={{ color: '#000', padding: '0.5rem' }}>
                <strong style={{ color: '#3b82f6', fontSize: '1.1rem' }}>Your Location</strong><br />
                <div style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>{locationName}</div>
              </div>
            </Popup>
          </CircleMarker>}
          
          {reports.map((report) => {
            if (report.latitude && report.longitude) {
              return (
                <React.Fragment key={report.id}>
                  <Circle
                    center={[report.latitude, report.longitude]}
                    radius={300}
                    pathOptions={{
                      color: getCrimeColor(report.crimeType),
                      fillColor: getCrimeColor(report.crimeType),
                      fillOpacity: 0.25,
                      weight: 2
                    }}
                  />
                  <CircleMarker
                    center={[report.latitude, report.longitude]}
                    radius={8}
                    pathOptions={{
                      color: '#F3F4F6',
                      fillColor: getCrimeColor(report.crimeType),
                      fillOpacity: 1,
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div style={{ color: '#000', minWidth: '220px', padding: '0.5rem' }}>
                        <strong style={{ color: getCrimeColor(report.crimeType), fontSize: '1.1rem' }}>
                          {report.isDemo ? 'DEMO - ' : ''}{report.crimeType}
                        </strong><br />
                        <div style={{ margin: '0.5rem 0', fontSize: '0.95rem', lineHeight: '1.5' }}>
                          {report.description}
                        </div>
                        <div style={{ color: '#666', fontSize: '0.85rem' }}>
                          <strong>Location:</strong> {report.location}
                        </div>
                        <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                          <strong>Time:</strong> {new Date(report.time).toLocaleString()}
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                </React.Fragment>
              );
            }
            return null;
          })}
        </MapContainer>
      </div>

      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1rem', 
        background: colors.cardLight, 
        borderRadius: '10px',
        border: `1px solid ${colors.border}`,
        fontSize: '0.9rem',
        color: colors.textSecondary
      }}>
        <strong>Legend:</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '16px', height: '16px', background: '#3b82f6', borderRadius: '50%' }}></div>
            <span>Your Location</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '16px', height: '16px', background: '#ef4444', borderRadius: '50%' }}></div>
            <span>Theft</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '16px', height: '16px', background: '#F59E0B', borderRadius: '50%' }}></div>
            <span>Assault</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '16px', height: '16px', background: '#A78BFA', borderRadius: '50%' }}></div>
            <span>Vandalism</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '16px', height: '16px', background: '#EAB308', borderRadius: '50%' }}></div>
            <span>Burglary</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '16px', height: '16px', background: '#9CA3AF', borderRadius: '50%' }}></div>
            <span>Other</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;