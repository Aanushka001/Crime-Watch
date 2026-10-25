
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const location = useLocation();

  // Keep the selected tab synchronized with navigation.
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, location.key]);

  // Available dashboard tabs.
  const tabs = [
    {
      id: 'map',
      label: 'Live Map',
      requiresAuth: false,
    },
    {
      id: 'report',
      label: 'Report Crime',
      requiresAuth: false,
    },
    {
      id: 'history',
      label: 'My Reports',
      requiresAuth: true,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      requiresAuth: false,
    },
    ...(user &&
    ['moderator', 'administrator'].includes(user.role)
      ? [
          {
            id: 'moderation',
            label: 'Moderation',
            requiresAuth: true,
          },
        ]
      : []),
  ];

  // Handle tab navigation and authentication.
  const handleTabClick = (tabId, requiresAuth) => {
    if (requiresAuth && !user) {
      navigate('/login');
      return;
    }

    setActiveTab(tabId);
  };

  // Dashboard container.
  const tabContainerStyles = {
    maxWidth: '1400px',
    margin: '2rem auto',
    padding: '0 1rem',
    width: '100%',
    boxSizing: 'border-box',
  };

  // Tab navigation.
  const tabHeaderStyles = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    overflowX: 'auto',
    padding: '0.5rem',
    background: '#191B20',
    borderRadius: '16px',
    border: '1px solid #3B414D',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
  };

  // Individual tab button styles.
  const tabButtonStyles = (isActive) => ({
    flex: '1 0 auto',
    minWidth: '150px',
    padding: '1rem 1.5rem',
    background: isActive ? '#3B82F6' : 'transparent',
    color: isActive ? '#F3F4F6' : '#A8AFBC',
    border: isActive ? 'none' : '1px solid #3B414D',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: isActive ? '700' : '600',
    transition: 'background 0.2s ease, transform 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.8rem',
    whiteSpace: 'nowrap',
    boxShadow: 'none',
  });

  // Main dashboard content.
  const tabContentStyles = {
    background: '#191B20',
    borderRadius: '16px',
    padding: '2rem',
    border: '1px solid #3B414D',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)',
    minHeight: '500px',
    color: '#F3F4F6',
    boxSizing: 'border-box',
  };

  return (
    <div style={tabContainerStyles}>
      <div style={tabHeaderStyles}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              style={tabButtonStyles(isActive)}
              onClick={() =>
                handleTabClick(tab.id, tab.requiresAuth)
              }
              onMouseEnter={(event) => {
                if (!isActive) {
                  event.currentTarget.style.background =
                    'rgba(59, 130, 246, 0.1)';
                  event.currentTarget.style.transform =
                    'translateY(-2px)';
                }
              }}
              onMouseLeave={(event) => {
                if (!isActive) {
                  event.currentTarget.style.background =
                    'transparent';
                  event.currentTarget.style.transform =
                    'translateY(0)';
                }
              }}
              aria-pressed={isActive}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div style={tabContentStyles}>
        {activeTab === 'map' && <MapView />}

        {activeTab === 'report' && (
          <ReportForm onSaved={fetchReports} />
        )}

        {activeTab === 'history' && user && (
          <ReportHistory />
        )}

        {activeTab === 'analytics' && <Analytics />}

        {activeTab === 'moderation' &&
          user &&
          ['moderator', 'administrator'].includes(user.role) && (
            <ModerationQueue />
          )}
      </div>
    </div>
  );
};

export default Dashboard;
