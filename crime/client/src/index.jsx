import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ReportProvider } from './context/ReportContext';
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const container = document.getElementById('root');
const root = createRoot(container);
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

root.render(
  <React.StrictMode>
    <Router>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <ReportProvider>
              <App />
            </ReportProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      ) : (
        <AuthProvider>
          <ReportProvider>
            <App />
          </ReportProvider>
        </AuthProvider>
      )}
    </Router>
  </React.StrictMode>
);