import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { getPublicReports } from '../../utils/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapView.css';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const MapView = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter] = useState([37.7749, -122.4194]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getPublicReports();
        setReports(data);
      } catch (err) {
  return;
}
finally {
        setLoading(false);
      }
    };
    fetchReports();
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

  if (loading) return <div className="loading">Loading map...</div>;

  return (
    <div className="map-page">
      <header className="header">
        <h1>Crime Watch</h1>
        <p>Real-time Crime Reporting and Safety Information</p>
      </header>

      <main className="main-content">
        <section className="map-section">
          <h2>Crime Map</h2>
          <p>Explore the map below to view real-time crime reports and hotspots.</p>
          <div className="map-container">
            <MapContainer center={mapCenter} zoom={12} style={{ width: '100%', height: '500px' }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
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
                          <strong>{report.crimeType}</strong><br />
                          {report.description}<br />
                          <em>{report.location}</em>
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

        <section className="intro-section">
          <h2>About Cyber Crime</h2>
          <p>Cyber crime refers to illegal activities conducted through the internet or other digital means. These crimes include hacking, identity theft, phishing, and more. Cyber criminals use technology to access personal information, steal identities, or manipulate data for fraudulent purposes.</p>
        </section>

        <section className="technical-data-section">
          <h2>Technical Data on Cyber Crime</h2>
          <p>According to recent reports, cyber crime costs the global economy billions of dollars each year. The most common types of cyber crimes include:</p>
          <ul>
            <li>Phishing: 32% of all data breaches</li>
            <li>Malware: 30% of data breaches</li>
            <li>Ransomware: 20% increase year-over-year</li>
            <li>Denial of Service (DoS): 15% of attacks target large enterprises</li>
          </ul>
        </section>

        <section className="types-section">
          <h2>Types of Cyber Crime</h2>
          <p>Cyber crime encompasses a wide range of activities. Here are some of the most common types:</p>
          <ul>
            <li>Hacking</li>
            <li>Identity Theft</li>
            <li>Phishing</li>
            <li>Ransomware</li>
            <li>Cyberstalking</li>
          </ul>
        </section>

        <section className="laws-section">
          <h2>Laws Against Cyber Crime</h2>
          <p>Several laws have been enacted globally to combat cyber crime.</p>
          <ul>
            <li>Computer Fraud and Abuse Act (USA)</li>
            <li>GDPR (EU)</li>
            <li>Personal Data Protection Act (Singapore)</li>
            <li>Information Technology Act (India)</li>
          </ul>
        </section>

        <section className="reporting-section">
          <h2>How to Report Cyber Crime</h2>
          <ul>
            <li>Contact local law enforcement.</li>
            <li>File a report with IC3.</li>
            <li>Notify bank or financial institutions.</li>
            <li>Change passwords and secure accounts.</li>
          </ul>
        </section>

        <section className="safety-tips-section">
          <h2>Tips for Staying Safe Online</h2>
          <ul>
            <li>Use strong passwords.</li>
            <li>Enable two-factor authentication.</li>
            <li>Avoid suspicious links.</li>
            <li>Keep software updated.</li>
            <li>Use antivirus tools.</li>
          </ul>
        </section>

        <section className="resources-section">
          <h2>Resources</h2>
          <ul>
            <li><a href="https://www.fbi.gov/investigate/cyber" target="_blank" rel="noopener noreferrer">FBI Cyber Crime Division</a></li>
            <li><a href="https://www.ic3.gov/" target="_blank" rel="noopener noreferrer">IC3</a></li>
            <li><a href="https://www.consumer.ftc.gov/topics/identity-theft" target="_blank" rel="noopener noreferrer">FTC Identity Theft</a></li>
            <li><a href="https://staysafeonline.org/" target="_blank" rel="noopener noreferrer">National Cyber Security Alliance</a></li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>© 2024 Crime Watch. All rights reserved.</p>
        <p>Providing real-time crime reporting and safety information.</p>
      </footer>
    </div>
  );
};

export default MapView;
