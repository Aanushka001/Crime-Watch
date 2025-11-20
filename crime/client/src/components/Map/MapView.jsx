import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { getPublicReports } from '../../utils/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Custom blue marker for user location
const userLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 12, { duration: 1.5 });
  }, [center, map]);
  return null;
};

const MapView = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [locationError, setLocationError] = useState('');

  const colors = {
    primary: '#3b82f6',
    card: '#1e293b',
    cardLight: '#334155',
    text: '#ffffff',
    textSecondary: '#cbd5e1',
    border: '#475569'
  };

  useEffect(() => {
    fetchReports();
    getUserLocation();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getPublicReports();
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setUserLocation([37.7749, -122.4194]); // Default fallback
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          setLocationName(`${data.city || data.locality || ''}, ${data.countryName || ''}`);
        } catch (err) {
          console.error('Error getting location name:', err);
          setLocationName('Your Location');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Unable to retrieve your location');
        
        // Fallback to IP-based location
        fetch('https://ipapi.co/json/')
          .then(res => res.json())
          .then(data => {
            if (data.latitude && data.longitude) {
              setUserLocation([data.latitude, data.longitude]);
              setLocationName(`${data.city}, ${data.country_name}`);
            } else {
              setUserLocation([37.7749, -122.4194]);
              setLocationName('Default Location');
            }
          })
          .catch(() => {
            setUserLocation([37.7749, -122.4194]);
            setLocationName('Default Location');
          });
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
      Assault: '#dc2626',
      Vandalism: '#f59e0b',
      Burglary: '#8b5cf6',
      Robbery: '#991b1b',
      'Vehicle Crime': '#ea580c',
      Other: '#3b82f6'
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
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🗺️</div>
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
          <span style={{ fontSize: '2rem' }}>🗺️</span>
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
            <span style={{ fontSize: '1.2rem' }}>📍</span>
            Your location: <strong>{locationName}</strong>
          </p>
        )}
        {locationError && (
          <p style={{ color: '#f59e0b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            ⚠️ {locationError}
          </p>
        )}
        <p style={{ 
          fontSize: '0.95rem', 
          color: colors.textSecondary, 
          marginTop: '0.8rem',
          lineHeight: '1.6'
        }}>
          Interactive map showing crime incidents in your area. Your location is marked with a blue marker. 
          Colored circles indicate crime zones — click markers for details.
        </p>
      </div>

      <div style={mapContainerStyles}>
        <MapContainer 
          center={userLocation} 
          zoom={12} 
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={userLocation} />
          
          {/* User Location Marker */}
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>
              <div style={{ color: '#000', padding: '0.5rem' }}>
                <strong style={{ color: '#3b82f6', fontSize: '1.1rem' }}>📍 Your Location</strong><br />
                <div style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>{locationName}</div>
              </div>
            </Popup>
          </Marker>
          
          {/* Crime Report Markers */}
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
                  <Marker position={[report.latitude, report.longitude]}>
                    <Popup>
                      <div style={{ color: '#000', minWidth: '220px', padding: '0.5rem' }}>
                        <strong style={{ color: getCrimeColor(report.crimeType), fontSize: '1.1rem' }}>
                          {report.crimeType}
                        </strong><br />
                        <div style={{ margin: '0.5rem 0', fontSize: '0.95rem', lineHeight: '1.5' }}>
                          {report.description}
                        </div>
                        <div style={{ color: '#666', fontSize: '0.85rem' }}>
                          <strong>📍 Location:</strong> {report.location}
                        </div>
                        <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                          <strong>🕒 Time:</strong> {new Date(report.time).toLocaleString()}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
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
            <div style={{ width: '16px', height: '16px', background: '#dc2626', borderRadius: '50%' }}></div>
            <span>Assault</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '16px', height: '16px', background: '#f59e0b', borderRadius: '50%' }}></div>
            <span>Vandalism</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '16px', height: '16px', background: '#8b5cf6', borderRadius: '50%' }}></div>
            <span>Other</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;