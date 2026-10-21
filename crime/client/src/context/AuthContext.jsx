import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { refreshSession, setAccessToken } from '../utils/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setSession = useCallback((session) => {
    setAccessToken(session.accessToken);
    setUser(session.user);
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;
    refreshSession()
      .then((session) => {
        if (active) setSession(session);
      })
      .catch((error) => {
        if (error.response?.status !== 401) {
          console.error('Unable to restore the sign-in session:', error);
        }
        if (active) clearSession();
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [clearSession, setSession]);

  const value = useMemo(() => ({ user, setUser, setSession, clearSession, loading }), [
    user,
    setSession,
    clearSession,
    loading
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
