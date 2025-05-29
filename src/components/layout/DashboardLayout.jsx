import React from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <div className="lg:ml-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          {(title || subtitle) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-text-secondary text-lg">{subtitle}</p>
              )}
            </div>
          )}

          {/* Page Content */}
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
