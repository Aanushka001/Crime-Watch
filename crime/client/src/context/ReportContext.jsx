import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { getUserReports } from '../utils/api';

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchReports = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getUserReports();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user]);

  return (
    <ReportContext.Provider value={{ reports, setReports, loading, fetchReports }}>
      {children}
    </ReportContext.Provider>
  );
};