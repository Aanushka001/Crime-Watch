import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReportProvider } from './context/ReportContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import MapView from './components/Map/MapView';
import ReportForm from './components/Reports/ReportForm';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProfilePage from './components/Reports/profile';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <ReportProvider>
        <div className="App" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<MapView />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/report" element={<ReportForm />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ReportProvider>
    </AuthProvider>
  );
};

export default App;