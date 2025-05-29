import React from "react";
import { Navigate } from "react-router-dom";

const KYCProtectedRoute = ({ children }) => {
  // Check if user has completed KYC (in a real app, this would check localStorage, API, etc.)
  const hasCompletedKYC = localStorage.getItem("kycCompleted") === "true";

  if (!hasCompletedKYC) {
    // Redirect to KYC flow if not completed
    return <Navigate to="/kyc" replace />;
  }

  return children;
};

export default KYCProtectedRoute;
