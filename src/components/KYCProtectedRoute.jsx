import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import diditService from "../lib/diditService";

const KYCProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [kycStatus, setKycStatus] = useState("loading"); // 'loading', 'verified', 'unverified'
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkKYCStatus = async () => {
      try {
        setIsChecking(true);
        console.log(
          "KYCProtectedRoute: Checking authentication and KYC status..."
        );

        // First check if user is authenticated
        if (!isAuthenticated || !user) {
          console.log("KYCProtectedRoute: User not authenticated");
          setKycStatus("unauthenticated");
          return;
        }

        // Check if KYC is completed (handles both demo and real verification)
        const isCompleted = await diditService.isKYCCompleted();
        console.log("KYCProtectedRoute: KYC completed?", isCompleted);

        setKycStatus(isCompleted ? "verified" : "unverified");
      } catch (error) {
        console.error("KYCProtectedRoute: Error checking KYC status:", error);
        // Default to unverified if there's an error
        setKycStatus("unverified");
      } finally {
        setIsChecking(false);
      }
    };

    // Only check KYC if auth is not loading
    if (!authLoading) {
      checkKYCStatus();
    }
  }, [isAuthenticated, user, authLoading]);

  // Show loading state while checking auth or KYC
  if (authLoading || isChecking || kycStatus === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-primary">
            {authLoading ? "Loading..." : "Checking verification status..."}
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (kycStatus === "unauthenticated") {
    console.log(
      "KYCProtectedRoute: Redirecting to login - user not authenticated"
    );
    return <Navigate to="/login" replace />;
  }

  // Redirect to KYC flow if not verified
  if (kycStatus === "unverified") {
    console.log("KYCProtectedRoute: Redirecting to /kyc - user not verified");
    return <Navigate to="/kyc" replace />;
  }

  // Render children if verified
  return children;
};

export default KYCProtectedRoute;
