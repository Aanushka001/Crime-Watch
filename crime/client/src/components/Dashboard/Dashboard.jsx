import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import MapView from '../Map/MapView';
import ReportForm from '../Reports/ReportForm';
import ReportHistory from '../Reports/ReportHistory';
import Analytics from '../Analytics/Analytics';
import { FaMap, FaPlusCircle, FaHistory, FaChartBar } from 'react-icons/fa';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('map');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const tabs = [
    { id: 'map', label: 'Live Map', icon: <FaMap />, requiresAuth: false },
    { id: 'report', label: 'Report Crime', icon: <FaPlusCircle />, requiresAuth: true },
    { id: 'history', label: 'My Reports', icon: <FaHistory />, requiresAuth: true },
    { id: 'analytics', label: 'Analytics', icon: <FaChartBar />, requiresAuth: false }
  ];

  const handleTabClick = (tabId, requiresAuth) => {
    if (requiresAuth && !user) {
      navigate('/login');
      return;
    }
    setActiveTab(tabId);
  };

  const tabContainerStyles = {
    maxWidth: '1400px',
    margin: '2rem auto',
    padding: '0 1rem'
  };

  const tabHeaderStyles = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    overflowX: 'auto',
    padding: '0.5rem',
    background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
    borderRadius: '16px',
    border: '1px solid #475569',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
  };

  const tabButtonStyles = (isActive) => ({
    flex: '1',
    minWidth: '150px',
    padding: '1rem 1.5rem',
    background: isActive 
      ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
      : 'transparent',
    color: isActive ? '#ffffff' : '#cbd5e1',
    border: isActive ? 'none' : '1px solid #475569',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: isActive ? '700' : '600',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.8rem',
    boxShadow: isActive ? '0 4px 16px rgba(59, 130, 246, 0.4)' : 'none'
  });

  const tabContentStyles = {
    background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
    borderRadius: '16px',
    padding: '2rem',
    border: '1px solid #475569',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    minHeight: '500px'
  };

  return (
    <div style={tabContainerStyles}>
      <div style={tabHeaderStyles}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={tabButtonStyles(activeTab === tab.id)}
            onClick={() => handleTabClick(tab.id, tab.requiresAuth)}
            onMouseEnter={e => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div style={tabContentStyles}>
        {activeTab === 'map' && <MapView />}
        {activeTab === 'report' && <ReportForm />}
        {activeTab === 'history' && <ReportHistory />}
        {activeTab === 'analytics' && <Analytics />}
      </div>
    </div>
  );
};

export default Dashboard;