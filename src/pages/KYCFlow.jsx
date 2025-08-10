import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import diditService from "../lib/diditService";
import { supabase } from "../lib/supabase";
import AuthComponent from "../components/AuthComponent";

const KYCFlow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verificationUrl, setVerificationUrl] = useState(null);
  const [popup, setPopup] = useState(null);
  const [isVerificationInProgress, setIsVerificationInProgress] =
    useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, [navigate]);

  const checkAuthStatus = async () => {
    try {
      setAuthLoading(true);

      // Check if user is already verified first
      const isCompleted = await diditService.isKYCCompleted();
      if (isCompleted) {
        navigate("/dashboard");
        return;
      }

      // Check Supabase auth session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setIsAuthenticated(true);
        return;
      }

      // Check demo session
      const demoUser = localStorage.getItem("demo_user");
      const demoSession = localStorage.getItem("demo_session");

      if (demoUser && demoSession === "true") {
        setIsAuthenticated(true);
        return;
      }

      // No authentication found
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setError(null);
  };

  const startVerification = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Starting KYC verification...");

      // Create verification session
      const sessionData = await diditService.createVerificationSession({
        firstName: "User",
        lastName: "Test",
      });

      console.log("Session created:", sessionData);

      // Open verification window
      const verificationPopup = diditService.openVerificationWindow(
        sessionData.verificationUrl,
        (result) => {
          console.log("Verification completed:", result);
          setIsVerificationInProgress(false);

          if (result.success) {
            navigate("/dashboard");
          } else {
            // Handle different failure scenarios
            let errorMessage = "Verification failed. Please try again.";

            switch (result.reason) {
              case "popup_closed_without_completion":
                errorMessage =
                  "Verification was not completed. Please complete the verification process before closing the window.";
                break;
              case "status_check_error":
                errorMessage =
                  "Unable to verify completion status. Please try again.";
                break;
              default:
                errorMessage = "Verification failed. Please try again.";
            }

            setError(errorMessage);
          }
        },
        sessionData.sessionId
      );

      setPopup(verificationPopup);
      setVerificationUrl(sessionData.verificationUrl);
      setIsVerificationInProgress(true);
    } catch (error) {
      console.error("Error starting verification:", error);
      setError(error.message || "Failed to start verification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRedirect = () => {
    if (verificationUrl) {
      window.open(verificationUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {!isAuthenticated
            ? "Authentication Required"
            : isVerificationInProgress
            ? "Verification in Progress"
            : "Complete Your KYC Verification"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {!isAuthenticated
            ? "Please sign in or create an account to continue"
            : isVerificationInProgress
            ? "Please complete the verification process in the popup window. Do not close it until you're finished."
            : "Please complete the verification process to access your dashboard"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {authLoading ? (
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Checking authentication...</p>
            </div>
          </div>
        ) : !isAuthenticated ? (
          <AuthComponent onAuthSuccess={handleAuthSuccess} />
        ) : (
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {isVerificationInProgress ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Verification in Progress
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      • Complete the verification process in the popup window
                    </p>
                    <p>
                      • Do not close the popup until verification is finished
                    </p>
                    <p>• You will be automatically redirected when complete</p>
                  </div>
                </div>

                {verificationUrl && (
                  <button
                    onClick={handleManualRedirect}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Reopen Verification Window
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Verification Process
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      • You will be redirected to our secure verification
                      partner
                    </p>
                    <p>• Complete the identity verification process</p>
                    <p>• Return to your dashboard once completed</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={startVerification}
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading
                      ? "Starting Verification..."
                      : "Start KYC Verification"}
                  </button>

                  {verificationUrl && (
                    <button
                      onClick={handleManualRedirect}
                      className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Open Verification in New Tab
                    </button>
                  )}
                </div>

                <div className="text-xs text-gray-500 text-center">
                  <p>
                    By proceeding, you agree to our{" "}
                    <a
                      href="/terms"
                      className="text-blue-600 hover:text-blue-500"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-blue-600 hover:text-blue-500"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KYCFlow;
