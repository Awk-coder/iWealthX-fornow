import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Building2,
  ChevronLeft,
  Menu,
  Home,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const sidebarItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      description: "Portfolio overview",
    },
    {
      name: "Opportunities",
      path: "/opportunities",
      icon: TrendingUp,
      description: "Investment marketplace",
    },
    {
      name: "Wallet",
      path: "/wallet",
      icon: Wallet,
      description: "Manage funds",
    },
    {
      name: "Issuer Portal",
      path: "/issuer",
      icon: Building2,
      description: "Project management",
    },
  ];

  const isActivePage = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-surface text-gold p-2 rounded-lg border border-gold/20 hover:border-gold/40 transition-all"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-screen bg-surface border-r border-gray-700/50 z-40
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-16" : "w-56"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-3 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <h2 className="text-text-primary font-semibold text-base">
                  Dashboard
                </h2>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:block text-text-secondary hover:text-gold transition-colors p-1 rounded"
              >
                <ChevronLeft
                  size={16}
                  className={`transform transition-transform ${
                    isCollapsed ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-2 space-y-1">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActivePage(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center p-3 rounded-lg transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-gold text-background shadow-lg"
                        : "text-text-secondary hover:bg-surface hover:text-text-primary"
                    }
                    ${isCollapsed ? "justify-center" : "space-x-3"}
                  `}
                  title={isCollapsed ? item.name : ""}
                >
                  <IconComponent size={18} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {item.name}
                      </div>
                      <div
                        className={`text-xs truncate ${
                          isActive
                            ? "text-background/70"
                            : "text-text-secondary/70"
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-2 border-t border-gray-700/50 space-y-1">
            {/* Back to Marketing Site */}
            <Link
              to="/"
              onClick={() => setIsMobileOpen(false)}
              className={`
                flex items-center p-3 rounded-lg text-text-secondary hover:bg-surface hover:text-text-primary transition-all
                ${isCollapsed ? "justify-center" : "space-x-3"}
              `}
              title={isCollapsed ? "Back to Home" : ""}
            >
              <Home size={18} className="flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium text-sm">Back to Home</span>
              )}
            </Link>

            {/* Logout Placeholder */}
            <button
              className={`
                w-full flex items-center p-3 rounded-lg text-text-secondary hover:bg-accent-red/20 hover:text-accent-red transition-all
                ${isCollapsed ? "justify-center" : "space-x-3"}
              `}
              title={isCollapsed ? "Logout" : ""}
              onClick={() =>
                alert("Logout functionality would be implemented here")
              }
            >
              <LogOut size={18} className="flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium text-sm">Logout</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main content spacer for desktop */}
      <div
        className={`hidden lg:block transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-56"
        }`}
      />
    </>
  );
};

export default Sidebar;
