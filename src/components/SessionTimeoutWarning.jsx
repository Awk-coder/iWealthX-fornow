import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const SessionTimeoutWarning = () => {
  const { getSessionTimeoutInfo, extendSession, signOut } = useAuth();
  const [timeoutInfo, setTimeoutInfo] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Check timeout status every minute
    const interval = setInterval(() => {
      const info = getSessionTimeoutInfo();
      setTimeoutInfo(info);

      if (info.isNearTimeout && info.timeUntilTimeout > 0) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [getSessionTimeoutInfo]);

  const handleExtendSession = () => {
    extendSession();
    setShowWarning(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowWarning(false);
  };

  if (!showWarning || !timeoutInfo) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Session Timeout Warning
          </h3>

          <p className="text-gray-600 mb-6">
            Your session will expire soon due to inactivity. For security
            reasons, you'll need to sign in again.
          </p>

          <div className="flex space-x-4">
            <button
              onClick={handleSignOut}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign Out Now
            </button>

            <button
              onClick={handleExtendSession}
              className="flex-1 px-4 py-2 bg-gold text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Stay Signed In
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Your session will automatically extend if you continue using the
            application.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutWarning;
