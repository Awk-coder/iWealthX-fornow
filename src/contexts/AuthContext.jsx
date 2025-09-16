import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../lib/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionTimeout, setSessionTimeout] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Initialize auth service
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const result = await authService.initialize();

        if (isMounted) {
          if (result.success) {
            setIsAuthenticated(result.isAuthenticated);
            setUser(result.session?.user || null);
          } else {
            setError(result.error);
          }
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const unsubscribe = authService.addAuthListener((authState) => {
      if (isMounted) {
        setIsAuthenticated(authState.isAuthenticated);
        setUser(authState.user);
        setError(authState.error || null);
        setSessionTimeout(authState.sessionTimeout || false);

        // Show refresh notification if token was refreshed
        if (authState.refreshed) {
          console.log("Token refreshed automatically");
        }

        // Handle session timeout
        if (authState.sessionTimeout) {
          console.log("Session timed out due to inactivity");
        }
      }
    });

    // Cleanup
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      setError(null);
      const result = await authService.signIn(email, password);

      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.user);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      setError(null);
      const result = await authService.signUp(email, password, userData);

      if (result.success) {
        return { success: true, user: result.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const result = await authService.signOut();

      if (result.success) {
        setIsAuthenticated(false);
        setUser(null);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      const result = await authService.resetPassword(email);

      if (result.success) {
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      setError(null);
      const result = await authService.updatePassword(newPassword);

      if (result.success) {
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const refreshToken = async () => {
    try {
      setError(null);
      const result = await authService.refreshToken();

      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.user);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const getSessionTimeoutInfo = () => {
    return authService.getSessionTimeoutInfo();
  };

  const extendSession = () => {
    authService.extendSession();
    setSessionTimeout(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    sessionTimeout,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshToken,
    getSessionTimeoutInfo,
    extendSession,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
