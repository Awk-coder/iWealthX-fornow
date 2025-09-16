import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const SessionTimeoutSettings = () => {
  const { getSessionTimeoutInfo, extendSession } = useAuth();
  const [timeoutInfo, setTimeoutInfo] = useState(null);

  React.useEffect(() => {
    const updateTimeoutInfo = () => {
      const info = getSessionTimeoutInfo();
      setTimeoutInfo(info);
    };

    updateTimeoutInfo();
    const interval = setInterval(updateTimeoutInfo, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [getSessionTimeoutInfo]);

  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleExtendSession = () => {
    extendSession();
  };

  if (!timeoutInfo) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Session Security
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Session Timeout</p>
            <p className="text-xs text-gray-500">
              For security, your session expires after 2 hours of inactivity
            </p>
          </div>
          <div className="text-right">
            <p
              className={`text-sm font-medium ${
                timeoutInfo.isNearTimeout ? "text-red-600" : "text-green-600"
              }`}
            >
              {timeoutInfo.isNearTimeout ? "Expires Soon" : "Active"}
            </p>
            <p className="text-xs text-gray-500">
              {timeoutInfo.isNearTimeout ? "5 minutes left" : "Session secure"}
            </p>
          </div>
        </div>

        {timeoutInfo.isNearTimeout && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-600 mr-2"
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
              <p className="text-sm text-yellow-800">
                Your session will expire soon due to inactivity
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleExtendSession}
          className="w-full bg-gold text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
        >
          Extend Session
        </button>

        <div className="text-xs text-gray-500">
          <p>• Sessions automatically extend with activity</p>
          <p>• Maximum session duration: 24 hours</p>
          <p>• You'll be warned 5 minutes before expiry</p>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutSettings;
