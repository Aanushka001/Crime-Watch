import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { getUserReports } from '../utils/api';

export const ReportContext = createContext(null);

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const fetchReports = useCallback(async () => {
    if (!user) {
      setReports([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      setReports(await getUserReports());
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to load your reports.');
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchReports().catch(() => {});
    } else {
      setReports([]);
    }
  }, [fetchReports, user]);

  return (
    <ReportContext.Provider value={{ reports, setReports, loading, error, fetchReports }}>
      {children}
    </ReportContext.Provider>
  );
};
