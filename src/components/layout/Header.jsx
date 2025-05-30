import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo-name.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Simplified navigation - only marketing pages and main entry points
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Investor", path: "/investor" },
    { name: "Asset Owner", path: "/asset-owner" },
    {
      name: "Academy",
      path: "https://www.youtube.com/@iWealthX-real",
      external: true,
    },
    { name: "Team", path: "/team" },
    { name: "FAQ", path: "/faq" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Check if we're on a dashboard page
  const isDashboardPage = [
    "/dashboard",
    "/opportunities",
    "/wallet",
    "/issuer",
    "/kyc",
  ].some((path) => location.pathname.startsWith(path));

  // Close mobile menu when location changes (user navigates to a new page)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isDashboardPage
          ? "bg-black/80 backdrop-blur-md py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="iWealthX Logo" className="h-18" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.name}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-primary hover:text-gold transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-text-primary hover:text-gold transition-colors ${
                    location.pathname === item.path ? "text-gold" : ""
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}

            {/* KYC Entry Button */}
            {!isDashboardPage && (
              <Link
                to="/kyc"
                className="bg-gold text-background px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all"
              >
                Start Investing
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gold focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-black/95 overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-screen py-4" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col space-y-4 px-4 pb-4">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.name}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary hover:text-gold transition-colors py-2"
              >
                {item.name}
              </a>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                className={`text-text-primary hover:text-gold transition-colors py-2 ${
                  location.pathname === item.path ? "text-gold" : ""
                }`}
              >
                {item.name}
              </Link>
            )
          )}

          {/* Mobile KYC Link */}
          {!isDashboardPage && (
            <Link
              to="/kyc"
              className="bg-gold text-background px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all text-center"
            >
              Start Investing
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
