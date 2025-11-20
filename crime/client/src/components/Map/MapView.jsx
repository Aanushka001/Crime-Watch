import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { getPublicReports } from '../../utils/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 10, { duration: 1.5 });
  }, [center, map]);
  return null;
};

const MapView = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState([37.7749, -122.4194]);
  const [locationName, setLocationName] = useState('');
  const [analytics, setAnalytics] = useState({
    total: 0,
    byType: {},
    recentTrend: 'stable',
    hotspots: []
  });

  const pageStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(180deg, #0a0e1a 0%, #1e293b 100%)',
    color: '#ffffff',
    minHeight: '100vh',
    padding: '2rem 1rem'
  };

  const headerStyles = {
    textAlign: 'center',
    marginBottom: '3rem',
    maxWidth: '900px'
  };

  const titleStyles = {
    fontSize: '3.5rem',
    marginBottom: '0.8rem',
    background: 'linear-gradient(135deg, #3b82f6, #60a5fa, #f59e0b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 900,
    letterSpacing: '-1.5px',
    textShadow: '0 0 30px rgba(59, 130, 246, 0.3)'
  };

  const sectionStyles = {
    marginBottom: '2rem',
    padding: '2.5rem',
    background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    border: '1px solid #475569',
    width: '100%',
    position: 'relative',
    overflow: 'hidden'
  };

  const analyticsGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  };

  const analyticsCardStyles = {
    background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
    padding: '2rem',
    borderRadius: '16px',
    border: '1px solid #475569',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  };

  const mapContainerStyles = {
    width: '100%',
    height: '600px',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
    border: '2px solid #475569'
  };

  const loadingStyles = {
    fontSize: '1.8rem',
    color: '#3b82f6',
    textAlign: 'center',
    padding: '4rem',
    fontWeight: 600
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getPublicReports();
        setReports(data);
        calculateAnalytics(data);
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };

    const getUserCountryLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            
            try {
              // Get location name with reverse geocoding
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              const data = await response.json();
              setLocationName(`${data.city || data.locality || ''}, ${data.countryName || ''}`);
            } catch (err) {
              console.error('Error getting location name:', err);
              setLocationName('Current Location');
            }
          },
          async () => {
            // Fallback to IP-based geolocation
            try {
              const response = await fetch('https://ipapi.co/json/');
              const data = await response.json();
              if (data.latitude && data.longitude) {
                setUserLocation([data.latitude, data.longitude]);
                setLocationName(`${data.city}, ${data.country_name}`);
              }
            } catch (err) {
              console.error('Error with IP geolocation:', err);
              setLocationName('Default Location');
            }
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
    getUserCountryLocation();
  }, []);

  const calculateAnalytics = (data) => {
    const byType = {};
    let recentCount = 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    data.forEach(report => {
      // Count by type
      byType[report.crimeType] = (byType[report.crimeType] || 0) + 1;
      
      // Count recent crimes
      const reportDate = new Date(report.time);
      if (reportDate > oneWeekAgo) {
        recentCount++;
      }
    });

    // Determine trend
    const avgRecent = recentCount / 7;
    const trend = avgRecent > data.length / 30 ? 'increasing' : avgRecent < data.length / 30 ? 'decreasing' : 'stable';

    // Find hotspots (areas with multiple reports)
    const locations = {};
    data.forEach(report => {
      if (report.latitude && report.longitude) {
        const key = `${Math.round(report.latitude * 100)}:${Math.round(report.longitude * 100)}`;
        locations[key] = (locations[key] || 0) + 1;
      }
    });

    const hotspots = Object.entries(locations)
      .filter(([ count]) => count >= 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    setAnalytics({
      total: data.length,
      byType,
      recentTrend: trend,
      hotspots: hotspots.map(([coords, count]) => ({
        coords: coords.split(':').map(c => parseFloat(c) / 100),
        count
      }))
    });
  };

  const getCrimeColor = (crimeType) => {
    const colors = {
      Theft: '#ef4444',
      Assault: '#dc2626',
      Vandalism: '#f59e0b',
      Other: '#3b82f6'
    };
    return colors[crimeType] || '#6b7280';
  };

  const getTrendColor = (trend) => {
    const colors = {
      increasing: '#ef4444',
      decreasing: '#10b981',
      stable: '#f59e0b'
    };
    return colors[trend] || '#6b7280';
  };

  const getTrendIcon = (trend) => {
    const icons = {
      increasing: '↗',
      decreasing: '↘',
      stable: '→'
    };
    return icons[trend] || '→';
  };

  if (loading) return <div style={loadingStyles}>Loading crime data and map...</div>;

  return (
    <div style={pageStyles}>
      <header style={headerStyles}>
        <h1 style={titleStyles}>🚨 Crime Watch</h1>
        <p style={{ fontSize: '1.3rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
          Real-time Crime Reporting & Safety Analytics
        </p>
        {locationName && (
          <p style={{ fontSize: '1rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📍</span>
            Viewing: {locationName}
          </p>
        )}
      </header>

      <main style={{ width: '100%', maxWidth: '1400px' }}>
        {/* Analytics Section */}
        <section style={sectionStyles}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #3b82f6, #f59e0b)' }}></div>
          
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#3b82f6', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '2.2rem' }}>📊</span>
            Crime Analytics Dashboard
          </h2>
          
          <div style={analyticsGridStyles}>
            <div style={{ ...analyticsCardStyles }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#3b82f6', marginBottom: '0.5rem' }}>
                {analytics.total}
              </div>
              <div style={{ fontSize: '1.1rem', color: '#cbd5e1', fontWeight: 600 }}>Total Reports</div>
            </div>

            <div style={{ ...analyticsCardStyles }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                {getTrendIcon(analytics.recentTrend)}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: getTrendColor(analytics.recentTrend), marginBottom: '0.3rem', textTransform: 'capitalize' }}>
                {analytics.recentTrend}
              </div>
              <div style={{ fontSize: '0.95rem', color: '#94a3b8' }}>7-Day Trend</div>
            </div>

            <div style={{ ...analyticsCardStyles }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.5rem' }}>
                {analytics.hotspots.length}
              </div>
              <div style={{ fontSize: '1.1rem', color: '#cbd5e1', fontWeight: 600 }}>Crime Hotspots</div>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.2rem', color: '#cbd5e1', fontWeight: 600 }}>
              Crime Distribution by Type
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {Object.entries(analytics.byType).map(([type, count]) => (
                <div key={type} style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #334155, #1e293b)',
                  borderRadius: '12px',
                  border: `2px solid ${getCrimeColor(type)}`,
                  transition: 'all 0.3s ease'
                }} onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${getCrimeColor(type)}40`;
                }} onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: getCrimeColor(type) }}>{count}</div>
                  <div style={{ fontSize: '1rem', color: '#cbd5e1', fontWeight: 600 }}>{type}</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    {((count / analytics.total) * 100).toFixed(1)}% of total
                  </div>
                </div>
              ))}
            </div>
          </div>

          {analytics.hotspots.length > 0 && (
            <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '2px solid #ef4444' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🔥</span> High Crime Areas (3+ incidents)
              </h3>
              <div style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
                {analytics.hotspots.length} location{analytics.hotspots.length !== 1 ? 's' : ''} identified with multiple crime reports. Exercise extra caution in these areas.
              </div>
            </div>
          )}
        </section>

        {/* Map Section */}
        <section style={sectionStyles}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10b981, #3b82f6)' }}></div>
          
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '2.2rem' }}>🗺️</span>
            Live Crime Map
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', marginBottom: '2rem' }}>
            Interactive map showing crime incidents in your area. Your location is marked with a blue marker. 
            Colored circles indicate crime zones - click markers for details.
          </p>
          <div style={mapContainerStyles}>
            <MapContainer 
              center={userLocation} 
              zoom={10} 
              style={{ width: '100%', height: '600px' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController center={userLocation} />
              
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
                            <div style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>{report.description}</div>
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
        </section>

        {/* Recent Reports Section */}
        <section style={sectionStyles}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }}></div>
          
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '2.2rem' }}>📋</span>
            Recent Crime Reports
          </h2>
          <div style={{ display: 'grid', gap: '1.2rem' }}>
            {reports.slice(0, 8).map((report) => (
              <div key={report.id} style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #334155, #1e293b)',
                borderRadius: '12px',
                border: '1px solid #475569',
                borderLeft: `4px solid ${getCrimeColor(report.crimeType)}`,
                transition: 'all 0.3s ease'
              }} onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateX(8px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
              }} onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{ margin: 0, color: '#ffffff', fontWeight: 700, fontSize: '1.2rem' }}>
                      {report.crimeType}
                    </h4>
                    <p style={{ margin: '0.8rem 0 0', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      {report.description.length > 120 ? `${report.description.substring(0, 120)}...` : report.description}
                    </p>
                    <div style={{ marginTop: '0.8rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#94a3b8' }}>
                      <span>📍 {report.location}</span>
                      <span>🕒 {new Date(report.time).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      padding: '0.5rem 1rem', 
                      background: getCrimeColor(report.crimeType),
                      color: '#ffffff',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                    }}>
                      {report.status?.toUpperCase() || 'PENDING'}
                    </div>
                  </div>
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