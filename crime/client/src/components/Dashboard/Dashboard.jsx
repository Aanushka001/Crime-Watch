import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ReportContext } from '../../context/ReportContext';
import MapView from '../Map/MapView';
import ReportForm from '../Reports/ReportForm';
import ReportHistory from '../Reports/ReportHistory';
import Analytics from '../Analytics/Analytics';
import ModerationQueue from '../Reports/ModerationQueue';

const Dashboard = ({ initialTab = 'map' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { user } = useContext(AuthContext);
  const { fetchReports } = useContext(ReportContext);
  const navigate = useNavigate();

  const tabs = [
    { id: 'map', label: 'Live Map', requiresAuth: false },
    { id: 'report', label: 'Report Crime', requiresAuth: false },
    { id: 'history', label: 'My Reports', requiresAuth: true },
    { id: 'analytics', label: 'Analytics', requiresAuth: false },
    ...(user && ['moderator', 'administrator'].includes(user.role)
      ? [{ id: 'moderation', label: 'Moderation', requiresAuth: true }]
      : [])
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
    background: '#191B20',
    borderRadius: '16px',
    border: '1px solid #3B414D',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
  };

  const tabButtonStyles = (isActive) => ({
    flex: '1',
    minWidth: '150px',
    padding: '1rem 1.5rem',
    background: isActive 
      ? '#3B82F6'
      : 'transparent',
    color: isActive ? '#F3F4F6' : '#A8AFBC',
    border: isActive ? 'none' : '1px solid #3B414D',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: isActive ? '700' : '600',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.8rem',
    boxShadow: 'none'
  });

  const tabContentStyles = {
    background: '#191B20',
    borderRadius: '16px',
    padding: '2rem',
    border: '1px solid #3B414D',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)',
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
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div style={tabContentStyles}>
        {activeTab === 'map' && <MapView />}
        {activeTab === 'report' && <ReportForm onSaved={fetchReports} />}
        {activeTab === 'history' && <ReportHistory />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'moderation' && <ModerationQueue />}
      </div>
    </div>
  );
};

export default Dashboard;