import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import { getPublicReports } from '../../utils/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const LocationMarker = () => {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

const MapView = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState([37.7749, -122.4194]);

  const pageStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    color: '#ffffff',
    minHeight: '100vh',
    padding: '2rem 1rem'
  };

  const headerStyles = {
    textAlign: 'center',
    marginBottom: '3rem'
  };

  const titleStyles = {
    fontSize: '3rem',
    marginBottom: '0.5rem',
    background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 900,
    letterSpacing: '-1px'
  };

  const sectionStyles = {
    marginBottom: '2rem',
    padding: '2rem',
    background: '#1e293b',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    border: '1px solid #475569',
    width: '100%'
  };

  const mapContainerStyles = {
    width: '100%',
    height: '600px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    border: '2px solid #475569'
  };

  const loadingStyles = {
    fontSize: '1.5rem',
    color: '#2563eb',
    textAlign: 'center',
    padding: '3rem',
    fontWeight: 600
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getPublicReports();
        setReports(data);
      } catch (err) {
        return;
      } finally {
        setLoading(false);
      }
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
          },
          () => {
            console.log('Location access denied, using default location');
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      }
    };

    fetchReports();
    getUserLocation();
  }, []);

  const getCrimeColor = (crimeType) => {
    const colors = {
      Theft: '#ff6b6b',
      Assault: '#ee5a6f',
      Vandalism: '#ffa07a',
      Other: '#4ecdc4'
    };
    return colors[crimeType] || '#95a5a6';
  };

  if (loading) return <div style={loadingStyles}>Loading map...</div>;

  return (
    <div style={pageStyles}>
      <header style={headerStyles}>
        <h1 style={titleStyles}>Crime Watch</h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>Real-time Crime Reporting and Safety Information</p>
      </header>

      <main style={{ width: '100%', maxWidth: '1400px' }}>
        <section style={sectionStyles}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.2rem', color: '#2563eb', fontWeight: 700 }}>
            Live Crime Map
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#e2e8f0', marginBottom: '1.5rem' }}>
            View real-time crime reports in your area. Your location is automatically detected and shown with a blue marker.
          </p>
          <div style={mapContainerStyles}>
            <MapContainer 
              center={userLocation} 
              zoom={13} 
              style={{ width: '100%', height: '500px' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker />
              {reports.map((report) => {
                if (report.latitude && report.longitude) {
                  return (
                    <React.Fragment key={report.id}>
                      <Circle
                        center={[report.latitude, report.longitude]}
                        radius={200}
                        pathOptions={{
                          color: getCrimeColor(report.crimeType),
                          fillColor: getCrimeColor(report.crimeType),
                          fillOpacity: 0.3
                        }}
                      />
                      <Marker position={[report.latitude, report.longitude]}>
                        <Popup>
                          <div style={{ color: '#000', minWidth: '200px' }}>
                            <strong style={{ color: getCrimeColor(report.crimeType) }}>{report.crimeType}</strong><br />
                            {report.description}<br />
                            <em>{report.location}</em><br />
                            <small>{new Date(report.time).toLocaleString()}</small>
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
        </section>

        <section style={sectionStyles}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.2rem', color: '#2563eb', fontWeight: 700 }}>
            Recent Crime Reports
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {reports.slice(0, 5).map((report) => (
              <div key={report.id} style={{
                padding: '1rem',
                background: '#0f172a',
                borderRadius: '8px',
                border: '1px solid #475569'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, color: '#ffffff' }}>{report.crimeType}</h4>
                  <span style={{
                    padding: '4px 8px',
                    background: getCrimeColor(report.crimeType),
                    color: '#ffffff',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    {report.status || 'Pending'}
                  </span>
                </div>
                <p style={{ margin: '8px 0', color: '#94a3b8' }}>{report.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b' }}>
                  <span>{report.location}</span>
                  <span>{new Date(report.time).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MapView;